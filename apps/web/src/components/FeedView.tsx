import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Share2, 
  Tag, 
  CheckCircle, 
  ExternalLink, 
  Sparkles, 
  MapPin, 
  Send,
  X
} from 'lucide-react';

interface FeedViewProps {
  posts: any[];
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
  onAddComment: (postId: string, content: string) => void;
  onBookStylist: (stylistId: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

export const FeedView: React.FC<FeedViewProps> = ({
  posts,
  onLike,
  onSave,
  onAddComment,
  onBookStylist,
  selectedCategory,
  setSelectedCategory,
}) => {
  const [activePinPost, setActivePinPost] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<any | null>(null);
  const [commentDrawerPost, setCommentDrawerPost] = useState<any | null>(null);
  const [newCommentText, setNewCommentText] = useState('');

  const categories = [
    'All',
    'Old Money',
    'Quiet Luxury',
    'Wedding & Occasion',
    'Streetwear',
    'Casual Luxury',
    'Minimalist'
  ];

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentDrawerPost || !newCommentText.trim()) return;
    onAddComment(commentDrawerPost.id, newCommentText.trim());
    setNewCommentText('');
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-300">
      
      {/* Category Pills Header */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`pill-glass text-xs py-1.5 px-4 ${selectedCategory === cat ? 'active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts Stream */}
      <div className="max-w-3xl mx-auto space-y-10">
        {posts.map((post) => {
          const author = post.author || {};
          const isPinsActive = activePinPost === post.id;

          return (
            <article 
              key={post.id} 
              className="glass-card rounded-3xl overflow-hidden shadow-lg border border-white/80"
            >
              
              {/* Post Header */}
              <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/40">
                <div className="flex items-center gap-3">
                  <img
                    src={author.avatar_url || '/images/stylist_editorial.jpg'}
                    alt={author.display_name}
                    className="w-11 h-11 rounded-full object-cover border border-white shadow-sm"
                    onError={(e) => {
                      e.currentTarget.src = '/images/stylist_editorial.jpg';
                    }}
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-semibold text-sm sm:text-base text-[#141414]">
                        {author.display_name}
                      </h3>
                      {author.is_verified && (
                        <CheckCircle className="w-4 h-4 text-[#2d5a46] fill-[#2d5a46]/20" />
                      )}
                      <span className="text-xs text-[#7d6f64]">@{author.username}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#7d6f64] mt-0.5">
                      <span className="capitalize font-semibold text-[#b85d43] bg-white/70 px-2 py-0.5 rounded-full text-[10px]">
                        {author.role || 'Stylist'}
                      </span>
                      {post.city && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#b85d43]" />
                          {post.city}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tagged Stylist Action */}
                {post.tagged_stylist_id && (
                  <button
                    onClick={() => onBookStylist(post.tagged_stylist_id)}
                    className="btn-capsule-black text-xs py-1.5 px-3.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Book Stylist</span>
                  </button>
                )}
              </div>

              {/* Media Section with Fixed-Size Editorial Frame & Interactive Outfit Pin Dots */}
              <div className="relative group overflow-hidden bg-black/5 w-full h-[400px] sm:h-[520px] rounded-2xl">
                <img
                  src={post.media?.[0]?.media_url || '/images/hero_editorial.jpg'}
                  alt={post.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  onError={(e) => {
                    e.currentTarget.src = '/images/hero_editorial.jpg';
                  }}
                />

                {/* Shop This Look Toggle Button */}
                {post.product_tags && post.product_tags.length > 0 && (
                  <button
                    onClick={() => setActivePinPost(isPinsActive ? null : post.id)}
                    className={`absolute bottom-4 left-4 pill-glass text-xs py-1.5 px-3.5 z-30 shadow-lg ${
                      isPinsActive ? 'active' : ''
                    }`}
                  >
                    <Tag className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Shop This Look ({post.product_tags.length})</span>
                  </button>
                )}

                {/* Interactive Pulsing Dots Overlay (Template Style) */}
                {isPinsActive && post.product_tags?.map((pt: any) => (
                  <div
                    key={pt.id}
                    style={{ left: `${pt.pin_x}%`, top: `${pt.pin_y}%` }}
                    className="garment-dot"
                    onClick={() => setSelectedTag(selectedTag?.id === pt.id ? null : pt)}
                    title={pt.title}
                  ></div>
                ))}

                {/* Tagged Product Popup Details */}
                {selectedTag && isPinsActive && (
                  <div 
                    style={{ 
                      left: `clamp(16px, ${selectedTag.pin_x}%, calc(100% - 260px))`, 
                      top: `${Math.min(selectedTag.pin_y + 6, 75)}%` 
                    }}
                    className="garment-floating-card absolute p-4 z-40 w-60 shadow-2xl"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-[#b85d43] font-bold">{selectedTag.brand_name}</p>
                        <h4 className="text-xs font-serif font-bold text-[#141414] line-clamp-1">{selectedTag.title}</h4>
                        <p className="text-xs font-bold text-[#141414] mt-1">₹{selectedTag.price.toLocaleString('en-IN')}</p>
                      </div>
                      <a
                        href={selectedTag.shopping_url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-[#141414] text-white rounded-lg hover:bg-black transition-colors"
                        title="Open store link"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Post Actions & Stats */}
              <div className="p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => onLike(post.id)}
                      className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                        post.has_liked ? 'text-[#b85d43]' : 'text-[#141414] hover:text-[#b85d43]'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${post.has_liked ? 'fill-[#b85d43]' : ''}`} />
                      <span>{post.likes_count}</span>
                    </button>

                    <button
                      onClick={() => setCommentDrawerPost(post)}
                      className="flex items-center gap-1.5 text-sm font-semibold text-[#141414] hover:text-[#7d6f64] transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>{post.comments_count}</span>
                    </button>

                    <button className="text-[#141414] hover:text-[#7d6f64] transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>

                  <button
                    onClick={() => onSave(post.id)}
                    className={`transition-colors ${
                      post.has_saved ? 'text-[#d4af37]' : 'text-[#141414] hover:text-[#d4af37]'
                    }`}
                  >
                    <Bookmark className={`w-5 h-5 ${post.has_saved ? 'fill-[#d4af37]' : ''}`} />
                  </button>
                </div>

                {/* Caption & Description */}
                <div className="space-y-1">
                  <p className="text-sm text-[#141414] leading-relaxed">
                    <span className="font-bold mr-2">{author.display_name}</span>
                    {post.caption}
                  </p>
                  
                  {post.description && (
                    <p className="text-xs text-[#7d6f64] italic font-serif">
                      "{post.description}"
                    </p>
                  )}

                  {/* Hashtags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {post.tags.map((tag: string, idx: number) => (
                        <span key={idx} className="text-xs text-[#b85d43] font-medium hover:underline cursor-pointer">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </article>
          );
        })}
      </div>

      {/* Frosted Glass Comments Drawer Modal */}
      {commentDrawerPost && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="garment-floating-card w-full max-w-lg p-6 space-y-4 max-h-[85vh] flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-white/60">
              <h3 className="font-serif font-bold text-base text-[#141414]">
                Editorial Discussion
              </h3>
              <button 
                onClick={() => setCommentDrawerPost(null)}
                className="icon-btn-glass w-8 h-8 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 py-2 pr-1">
              <div className="p-3 bg-white/60 rounded-2xl border border-white text-xs space-y-1">
                <span className="font-bold text-[#141414]">Elena Rostova (Shop Manager)</span>
                <p className="text-[#5e564e]">The architectural drape on this piece pairs particularly well with high-waisted linen trousers.</p>
              </div>
            </div>

            <form onSubmit={handleCommentSubmit} className="pt-2 flex items-center gap-2">
              <input
                type="text"
                placeholder="Share sartorial perspective..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="flex-1 bg-white/70 border border-white text-xs text-[#141414] px-4 py-2.5 rounded-full focus:outline-none"
              />
              <button type="submit" className="btn-capsule-black text-xs py-2 px-4">
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
