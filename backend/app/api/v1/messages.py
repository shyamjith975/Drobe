from typing import Optional, List
import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, desc
from app.core.database import get_db
from app.models.user import User
from app.models.messaging import Conversation, Message
from app.schemas.all_schemas import SendMessageRequest
from app.api.deps import get_current_user

router = APIRouter(prefix="/messages", tags=["Real-time Messaging"])

@router.get("/conversations")
def get_user_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    convs = db.query(Conversation).filter(
        or_(
            Conversation.participant_one_id == current_user.id,
            Conversation.participant_two_id == current_user.id
        )
    ).order_by(desc(Conversation.last_message_at)).all()

    results = []
    for c in convs:
        other_user = c.participant_two if c.participant_one_id == current_user.id else c.participant_one
        other_profile = other_user.profile if other_user else None

        results.append({
            "id": c.id,
            "participant_id": other_user.id if other_user else "",
            "participant_name": other_profile.display_name if other_profile else "Fashion Contact",
            "participant_avatar": other_profile.avatar_url if other_profile else None,
            "participant_role": other_user.role if other_user else "enthusiast",
            "last_message": c.last_message,
            "last_message_at": c.last_message_at.isoformat() if c.last_message_at else None,
            "unread_count": 0
        })
    return results

@router.get("/{conversation_id}")
def get_conversation_messages(
    conversation_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")

    if current_user.id not in [conv.participant_one_id, conv.participant_two_id]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    messages = db.query(Message).filter(Message.conversation_id == conversation_id).order_by(Message.created_at).all()
    return [
        {
            "id": m.id,
            "conversation_id": m.conversation_id,
            "sender_id": m.sender_id,
            "sender_name": m.sender.profile.display_name if (m.sender and m.sender.profile) else "User",
            "content": m.content,
            "media_url": m.media_url,
            "is_read": m.is_read,
            "created_at": m.created_at.isoformat() if m.created_at else None
        }
        for m in messages
    ]

@router.post("/send", status_code=status.HTTP_201_CREATED)
def send_message(
    payload: SendMessageRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    recipient = db.query(User).filter(User.id == payload.recipient_id).first()
    if not recipient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recipient not found")

    # Find or create conversation
    conv = db.query(Conversation).filter(
        or_(
            and_(Conversation.participant_one_id == current_user.id, Conversation.participant_two_id == payload.recipient_id),
            and_(Conversation.participant_one_id == payload.recipient_id, Conversation.participant_two_id == current_user.id)
        )
    ).first()

    if not conv:
        conv = Conversation(
            participant_one_id=current_user.id,
            participant_two_id=payload.recipient_id,
            last_message=payload.content,
            last_message_at=datetime.datetime.now(datetime.timezone.utc)
        )
        db.add(conv)
        db.flush()
    else:
        conv.last_message = payload.content
        conv.last_message_at = datetime.datetime.now(datetime.timezone.utc)

    msg = Message(
        conversation_id=conv.id,
        sender_id=current_user.id,
        content=payload.content,
        media_url=payload.media_url,
        is_read=False
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)

    return {
        "id": msg.id,
        "conversation_id": conv.id,
        "sender_id": msg.sender_id,
        "content": msg.content,
        "media_url": msg.media_url,
        "created_at": msg.created_at.isoformat()
    }
