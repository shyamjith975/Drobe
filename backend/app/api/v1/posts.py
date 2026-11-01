from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.core.database import get_db
from app.models.user import User, UserProfile
from app.models.social import Post, PostMedia, ProductTag, Like, Comment, SavedPost
from app.schemas.all_schemas import PostCreate, CommentCreate
from app.api.deps import get_current_user, get_current_user_optional

router = APIRouter(prefix="/posts", tags=["Social Feed & Posts"])

def serialize_post(post: Post, current_user_id: Optional[str] = None) -> dict:
    has_liked = False
    has_saved = False
    if current_user_id:
        has_liked = any(l.user_id == current_user_id for l in post.likes)
        has_saved = any(s.user_id == current_user_id for s in post.saved_by)

    author = post.author
    author_profile = author.profile if author else None

    return {
        "id": post.id,
        "user_id": post.user_id,
        "author": {
            "id": author.id if author else "",
            "username": author_profile.username if author_profile else "drobe_user",
            "display_name": author_profile.display_name if author_profile else "Fashion Enthusiast",
            "avatar_url": author_profile.avatar_url if author_profile else None,
            "role": author.role if author else "enthusiast",
            "is_verified": author_profile.is_verified if author_profile else False,
            "city": author_profile.city if author_profile else None,
        },
        "caption": post.caption,
        "description": post.description,
        "category": post.category,
        "occasion": post.occasion,
        "city": post.city,
        "tags": post.tags or [],
        "media": [
            {
                "id": m.id,
                "media_url": m.media_url,
                "media_type": m.media_type,
                "order_index": m.order_index,
                "aspect_ratio": m.aspect_ratio
            }
            for m in post.media
        ],
        "product_tags": [
            {
                "id": pt.id,
                "product_id": pt.product_id,
                "title": pt.title,
                "brand_name": pt.brand_name,
                "price": pt.price,
                "currency": pt.currency,
                "shopping_url": pt.shopping_url,
                "pin_x": pt.pin_x,
                "pin_y": pt.pin_y
            }
            for pt in post.product_tags
        ],
        "tagged_stylist_id": post.tagged_stylist_id,
        "likes_count": post.likes_count,
        "comments_count": post.comments_count,
        "saves_count": post.saves_count,
        "has_liked": has_liked,
        "has_saved": has_saved,
        "created_at": post.created_at.isoformat() if post.created_at else None
    }

@router.get("/")
def get_feed(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    category: Optional[str] = None,
    city: Optional[str] = None,
    tag: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    query = db.query(Post)
    if category and category.lower() != "all":
        query = query.filter(Post.category.ilike(f"%{category}%"))
    if city:
        query = query.filter(Post.city.ilike(f"%{city}%"))
    
    posts = query.order_by(desc(Post.created_at)).offset(skip).limit(limit).all()
    user_id = current_user.id if current_user else None
    return [serialize_post(p, user_id) for p in posts]

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_post(
    payload: PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not payload.media_urls:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one media image or video is required to publish a post"
        )
    
    post = Post(
        user_id=current_user.id,
        caption=payload.caption,
        description=payload.description,
        category=payload.category,
        occasion=payload.occasion,
        city=payload.city or (current_user.profile.city if current_user.profile else "Kochi"),
        tags=payload.tags,
        tagged_stylist_id=payload.tagged_stylist_id
    )
    db.add(post)
    db.flush()

    # Add media items
    for idx, url in enumerate(payload.media_urls):
        media = PostMedia(
            post_id=post.id,
            media_url=url,
            media_type="image" if not url.endswith((".mp4", ".webm")) else "video",
            order_index=idx
        )
        db.add(media)

    # Add Shop This Look product tags
    if payload.product_tags:
        for pt in payload.product_tags:
            tag = ProductTag(
                post_id=post.id,
                product_id=pt.product_id,
                title=pt.title,
                brand_name=pt.brand_name,
                price=pt.price,
                currency=pt.currency,
                shopping_url=pt.shopping_url,
                pin_x=pt.pin_x,
                pin_y=pt.pin_y
            )
            db.add(tag)

    # Update user's post count
    if current_user.profile:
        current_user.profile.posts_count += 1

    db.commit()
    db.refresh(post)
    return serialize_post(post, current_user.id)

@router.get("/{post_id}")
def get_post_by_id(
    post_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    user_id = current_user.id if current_user else None
    return serialize_post(post, user_id)

@router.post("/{post_id}/like")
def toggle_like(
    post_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")

    existing_like = db.query(Like).filter(Like.post_id == post_id, Like.user_id == current_user.id).first()
    if existing_like:
        db.delete(existing_like)
        post.likes_count = max(0, post.likes_count - 1)
        db.commit()
        return {"liked": False, "likes_count": post.likes_count}
    else:
        new_like = Like(post_id=post_id, user_id=current_user.id)
        db.add(new_like)
        post.likes_count += 1
        db.commit()
        return {"liked": True, "likes_count": post.likes_count}

@router.get("/{post_id}/comments")
def get_post_comments(post_id: str, db: Session = Depends(get_db)):
    comments = db.query(Comment).filter(Comment.post_id == post_id).order_by(desc(Comment.created_at)).all()
    results = []
    for c in comments:
        author = c.author
        profile = author.profile if author else None
        results.append({
            "id": c.id,
            "post_id": c.post_id,
            "user_id": c.user_id,
            "author": {
                "username": profile.username if profile else "user",
                "display_name": profile.display_name if profile else "User",
                "avatar_url": profile.avatar_url if profile else None
            },
            "content": c.content,
            "created_at": c.created_at.isoformat() if c.created_at else None
        })
    return results

@router.post("/{post_id}/comments", status_code=status.HTTP_201_CREATED)
def add_comment(
    post_id: str,
    payload: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    
    comment = Comment(
        post_id=post_id,
        user_id=current_user.id,
        parent_id=payload.parent_id,
        content=payload.content
    )
    db.add(comment)
    post.comments_count += 1
    db.commit()
    db.refresh(comment)

    profile = current_user.profile
    return {
        "id": comment.id,
        "post_id": comment.post_id,
        "user_id": comment.user_id,
        "author": {
            "username": profile.username if profile else "user",
            "display_name": profile.display_name if profile else "User",
            "avatar_url": profile.avatar_url if profile else None
        },
        "content": comment.content,
        "created_at": comment.created_at.isoformat()
    }

@router.post("/{post_id}/save")
def toggle_save_post(
    post_id: str,
    collection_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")

    existing = db.query(SavedPost).filter(SavedPost.post_id == post_id, SavedPost.user_id == current_user.id).first()
    if existing:
        db.delete(existing)
        post.saves_count = max(0, post.saves_count - 1)
        db.commit()
        return {"saved": False, "saves_count": post.saves_count}
    else:
        new_save = SavedPost(post_id=post_id, user_id=current_user.id, collection_id=collection_id)
        db.add(new_save)
        post.saves_count += 1
        db.commit()
        return {"saved": True, "saves_count": post.saves_count}
