import React, { useState } from 'react';
import { Sparkles, MapPin, Star, ArrowUpRight, CheckCircle, Tag } from 'lucide-react';

interface DiscoverViewProps {
  posts: any[];
  stylists: any[];
  brands: any[];
  onSelectPost: (post: any) => void;
  onSelectStylist: (stylist: any) => void;
  onSelectBrand: (brand: any) => void;
}

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  posts,
  stylists,
  brands,
  onSelectPost,
  onSelectStylist,
  onSelectBrand,
}) => {
  const [activeFilter, setActiveFilter] = useState('All');

  const aestheticCategories = [
    { name: 'All', tag: 'All' },
    { name: 'Old Money', tag: 'Old Money' },
    { name: 'Quiet Luxury', tag: 'Quiet Luxury' },
    { name: 'Kerala Kasavu', tag: 'Wedding & Occasion' },
    { name: 'Streetwear', tag: 'Streetwear' },
    { name: 'Coastal Linen', tag: 'Casual Luxury' },
  ];

  const filteredPosts = activeFilter === 'All'
    ? posts
    : posts.filter(p => p.category?.toLowerCase().includes(activeFilter.toLowerCase()) || p.tags?.some((t: string) => t.toLowerCase().includes(activeFilter.toLowerCase())));

  return (
    <div className="w-full space-y-12 animate-in fade-in duration-300">
      
      {/* Editorial Headline */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-widest text-[#b85d43] font-bold">
          Visual Discovery & Aesthetics
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif text-[#141414] font-bold">
          Curated Sartorial Trends
        </h1>
        <p className="text-xs sm:text-sm text-[#7d6f64] font-serif italic">
          Discover human-crafted styling formulas, editorial lookbooks, and regional luxury artisans.
        </p>

        {/* Aesthetic Filter Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {aestheticCategories.map((c) => (
            <button
              key={c.name}
              onClick={() => setActiveFilter(c.name)}
              className={`pill-glass text-xs py-1.5 px-3.5 ${activeFilter === c.name ? 'active' : ''}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Stylists Spotlight Bar */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/40">
          <div>
            <h2 className="text-xl font-serif font-bold text-[#141414]">Featured Human Stylists</h2>
            <p className="text-xs text-[#7d6f64]">Verified professionals available for consultations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stylists.slice(0, 4).map((s) => (
            <div
              key={s.id}
              onClick={() => onSelectStylist(s)}
              className="glass-card p-4 flex items-center gap-3.5 cursor-pointer hover:scale-102 transition-transform"
            >
              <img
                src={s.user?.avatar_url || '/images/stylist_editorial.jpg'}
                alt={s.user?.display_name}
                className="w-14 h-14 rounded-2xl object-cover border border-white shadow-sm shrink-0"
                onError={(e) => {
                  e.currentTarget.src = '/images/stylist_editorial.jpg';
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <h4 className="font-bold text-sm text-[#141414] truncate">{s.user?.display_name}</h4>
                  <CheckCircle className="w-3.5 h-3.5 text-[#2d5a46] shrink-0" />
                </div>
                <p className="text-xs text-[#7d6f64] truncate">{s.category}</p>
                <div className="flex items-center gap-2 mt-1 text-[11px]">
                  <span className="flex items-center text-[#d4af37] font-semibold">
                    <Star className="w-3 h-3 fill-[#d4af37] mr-0.5" />
                    {s.rating}
                  </span>
                  <span className="text-[#7d6f64] flex items-center">
                    <MapPin className="w-3 h-3 mr-0.5" />
                    {s.base_city}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Aesthetic Masonry Grid */}
      <section className="space-y-4">
        <h2 className="text-xl font-serif font-bold text-[#141414]">Trending Visual Lookbooks</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="glass-card rounded-2xl overflow-hidden group cursor-pointer relative"
            >
              <div className="aspect-[3/4] overflow-hidden bg-black/5">
                <img
                  src={post.media?.[0]?.media_url || '/images/hero_editorial.jpg'}
                  alt={post.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = '/images/hero_editorial.jpg';
                  }}
                />
              </div>
              <div className="p-3">
                <p className="font-bold text-xs text-[#141414] line-clamp-1">{post.caption}</p>
                <div className="flex items-center justify-between text-[11px] text-[#7d6f64] mt-1">
                  <span>@{post.author?.username}</span>
                  <span className="text-[#b85d43] font-medium">{post.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
