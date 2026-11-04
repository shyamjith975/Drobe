import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Star, 
  MapPin, 
  ShoppingBag, 
  UserCheck, 
  ShieldCheck, 
  CheckCircle, 
  Scissors, 
  Camera, 
  Crown, 
  Search, 
  Layers, 
  TrendingUp, 
  Heart, 
  MessageSquare, 
  ChevronRight,
  ExternalLink,
  Users,
  Compass
} from 'lucide-react';

interface LandingPageViewProps {
  onNavigate: (tab: string) => void;
  onOpenAuth: (portal?: 'customer' | 'boutique' | 'consultant' | 'admin', mode?: 'signin' | 'register') => void;
  stylists: any[];
  brands: any[];
  posts: any[];
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onNavigate,
  onOpenAuth,
  stylists,
  brands,
  posts
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [legalModalOpen, setLegalModalOpen] = useState<'about' | 'terms' | 'privacy' | 'help' | null>(null);

  // 10 Visual Fashion Categories specified in Prompt Section 3.1
  const fashionCategories = [
    {
      title: 'Old Money',
      subtitle: 'Quiet luxury, cashmere, tailored linen & heritage tailoring',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
      badge: 'Trending 2026',
      tag: 'Old Money'
    },
    {
      title: 'Streetwear',
      subtitle: 'Oversized silhouettes, cargo utility & Tokyo/Seoul drops',
      image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=600&q=80',
      badge: 'High Heat',
      tag: 'Streetwear'
    },
    {
      title: 'Casual',
      subtitle: 'Effortless everyday styling, elevated denim & minimalist knits',
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
      badge: 'Everyday Essential',
      tag: 'Casual'
    },
    {
      title: 'Luxury',
      subtitle: 'Haute couture, textured tweed coats, silk blouses & runway picks',
      image: 'https://images.unsplash.com/photo-1539533018447-63fcce667823?auto=format&fit=crop&w=600&q=80',
      badge: 'Haute Couture',
      tag: 'Luxury'
    },
    {
      title: 'Wedding',
      subtitle: 'Bridal trousseau, royal sherwanis & bespoke destination glamour',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
      badge: 'Bespoke Occasion',
      tag: 'Wedding'
    },
    {
      title: 'Formal',
      subtitle: 'Sharp tuxedo suiting, evening gowns & diplomatic boardroom fits',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
      badge: 'Black Tie',
      tag: 'Formal'
    },
    {
      title: 'Korean Fashion',
      subtitle: 'Clean pastel palettes, structured trench coats & Gangnam chic',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
      badge: 'K-Wave',
      tag: 'Korean'
    },
    {
      title: 'Minimalist',
      subtitle: 'Neutral monochrome, architectural cuts & conscious capsules',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
      badge: 'Capsule Wardrobe',
      tag: 'Minimalist'
    },
    {
      title: 'Ethnic',
      subtitle: 'Heritage handloom sarees, chikankari & artisanal South Indian drapes',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
      badge: 'Heritage Craft',
      tag: 'Ethnic'
    },
    {
      title: 'Sportswear',
      subtitle: 'Performance athleisure, tennis club aesthetics & technical windbreakers',
      image: 'https://images.unsplash.com/photo-1483721074573-586540da5703?auto=format&fit=crop&w=600&q=80',
      badge: 'Athletic Club',
      tag: 'Sportswear'
    }
  ];

  return (
    <div className="landing-page-root w-full max-w-full overflow-x-hidden rounded-2xl sm:rounded-3xl" style={{ background: '#F7F5F0', color: '#191919', minHeight: '100vh' }}>
      
      {/* 1. HERO SECTION */}
      <section className="hero-section relative py-8 px-3 sm:py-16 sm:px-6 max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '999px',
            background: '#FFFFFF',
            border: '1px solid #EAE8E3',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#8A8176',
            marginBottom: '1.5rem',
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
          }}>
            <Sparkles size={14} color="#191919" />
            <span className="truncate max-w-[280px] sm:max-w-none">DROBE Platform · Discover. Express. Connect. Style.</span>
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(1.85rem, 4.5vw, 3.5rem)',
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            marginBottom: '1rem',
            color: '#191919'
          }}>
            Your Style.<br />
            Your People.<br />
            <span style={{ fontStyle: 'italic', fontWeight: 400, color: '#8A8176' }}>Your DROBE.</span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-[#555] leading-relaxed max-w-[520px] mb-6 sm:mb-8">
            Discover new looks, connect with certified personal stylists, explore boutique collections, and express your personal style on one integrated luxury platform.
          </p>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '2.5rem'
          }}>
            <button
              onClick={() => onNavigate('feed')}
              style={{
                background: '#191919',
                color: '#FFFFFF',
                padding: '12px 24px',
                borderRadius: '999px',
                fontWeight: 600,
                fontSize: '0.92rem',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 6px 20px rgba(25, 25, 25, 0.15)'
              }}
            >
              <Compass size={16} color="#FFFFFF" />
              <span style={{ color: '#FFFFFF' }}>Explore Fashion</span>
            </button>

            <button
              onClick={() => onNavigate('stylists')}
              style={{
                background: '#FFFFFF',
                color: '#191919',
                padding: '12px 22px',
                borderRadius: '999px',
                fontWeight: 600,
                fontSize: '0.92rem',
                border: '1px solid #EAE8E3',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
              }}
            >
              <Scissors size={16} />
              <span>Find a Stylist</span>
            </button>

            <button
              onClick={() => onNavigate('brands')}
              style={{
                background: '#FFFFFF',
                color: '#191919',
                padding: '12px 22px',
                borderRadius: '999px',
                fontWeight: 600,
                fontSize: '0.92rem',
                border: '1px solid #EAE8E3',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
              }}
            >
              <ShoppingBag size={16} />
              <span>Discover Boutiques</span>
            </button>

            <button
              onClick={() => onOpenAuth('customer', 'register')}
              style={{
                background: '#FFFFFF',
                color: '#191919',
                padding: '12px 20px',
                borderRadius: '999px',
                fontWeight: 600,
                fontSize: '0.92rem',
                border: '1px dashed #8A8176',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>Join DROBE</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Quick Metrics Strip */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            paddingTop: '1.5rem',
            borderTop: '1px solid #EAE8E3'
          }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#191919', fontFamily: "'Playfair Display', Georgia, serif" }}>14,500+</div>
              <div style={{ fontSize: '0.78rem', color: '#8A8176', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Curated Outfits</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#191919', fontFamily: "'Playfair Display', Georgia, serif" }}>320+</div>
              <div style={{ fontSize: '0.78rem', color: '#8A8176', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Verified Stylists</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#191919', fontFamily: "'Playfair Display', Georgia, serif" }}>99.4%</div>
              <div style={{ fontSize: '0.78rem', color: '#8A8176', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Client Satisfaction</div>
            </div>
          </div>
        </div>

        {/* Hero Visual Card (Single Clean Portrait with Hotspot Badge) */}
        <div style={{ position: 'relative' }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '28px',
            padding: '14px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.08)',
            border: '1px solid #EAE8E3',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'relative',
              borderRadius: '20px',
              overflow: 'hidden',
              aspectRatio: '4/5',
              background: '#ECE9E2'
            }}>
              <img
                src="/images/hero_editorial.jpg"
                alt="DROBE Autumn/Winter Luxury Editorial"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1539533018447-63fcce667823?auto=format&fit=crop&w=800&q=80';
                }}
              />

              {/* Floating Hotspot Badge */}
              <div 
                style={{
                  position: 'absolute',
                  top: '35%',
                  left: '46%',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(8px)',
                  padding: '10px 16px',
                  borderRadius: '16px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                  border: '1px solid rgba(255,255,255,0.8)',
                  cursor: 'pointer',
                  zIndex: 10
                }}
                onClick={() => onNavigate('recommendations')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#191919' }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Shop This Look</span>
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#191919' }}>Textured wool tweed coat</div>
                <div style={{ fontSize: '0.85rem', color: '#8A8176' }}>$3,500 · Size 38</div>
              </div>

              {/* Style Recommendation Guide Badge */}
              <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                right: '20px',
                background: 'rgba(25, 25, 25, 0.92)',
                color: '#FFFFFF',
                borderRadius: '18px',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backdropFilter: 'blur(10px)',
                zIndex: 20
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Sparkles size={20} color="#D4AF37" />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFFFFF' }}>Color & Fabric Recommendations</div>
                    <div style={{ fontSize: '0.75rem', color: '#A09C94' }}>Explore curated seasonal palettes and material compositions</div>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('recommendations')}
                  style={{
                    background: '#FFFFFF',
                    color: '#191919',
                    border: 'none',
                    borderRadius: '999px',
                    padding: '8px 16px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Explore
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. EXPLORE FASHION (10 Categories) */}
      <section className="landing-section">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="text-[10px] sm:text-xs font-bold text-[#8A8176] uppercase tracking-widest mb-2">
            Visual Style Architecture
          </div>
          <h2 className="font-serif text-xl sm:text-3xl md:text-4xl font-bold text-[#191919] mb-2 sm:mb-3">
            Explore Fashion Aesthetic Categories
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-[#666] leading-relaxed">
            Immerse yourself in ten curated fashion movements, from quiet luxury and high-heat streetwear to regal bridal couture.
          </p>
        </div>

        {/* 10 Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {fashionCategories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => onNavigate('feed')}
              className="bg-white rounded-2xl overflow-hidden border border-[#EAE8E3] cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all shadow-sm"
            >
              <div className="relative h-48 sm:h-52 overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/images/hero_editorial.jpg';
                  }}
                />
                <span className="absolute top-2.5 right-2.5 bg-black/85 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                  {cat.badge}
                </span>
              </div>
              <div className="p-3.5 sm:p-4">
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#191919] mb-1">
                  {cat.title}
                </h3>
                <p className="text-xs text-[#777] line-clamp-2 leading-relaxed mb-3">
                  {cat.subtitle}
                </p>
                <div className="flex items-center gap-1 text-xs font-semibold text-[#191919]">
                  <span>Explore Looks</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FIND YOUR PERSONAL STYLIST */}
      <section className="landing-section">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-10">
          <div>
            <div className="text-[10px] sm:text-xs font-bold text-[#8A8176] uppercase tracking-widest mb-2">
              Professional Stylist Marketplace
            </div>
            <h2 className="font-serif text-xl sm:text-3xl md:text-4xl font-bold text-[#191919]">
              Find Your Personal Stylist
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-[#666] mt-1.5 max-w-xl">
              Certified personal consultants, celebrity advisors, and wedding trousseau experts ready for virtual & physical appointments.
            </p>
          </div>
          <button
            onClick={() => onNavigate('stylists')}
            className="self-start sm:self-auto bg-[#191919] text-white px-5 py-2.5 rounded-full font-semibold text-xs sm:text-sm inline-flex items-center gap-2 hover:bg-black transition-colors"
            style={{ backgroundColor: '#191919', color: '#FFFFFF' }}
          >
            <span style={{ color: '#FFFFFF', fontWeight: 700 }}>View All Stylists</span>
            <ArrowRight size={15} color="#FFFFFF" />
          </button>
        </div>

        {/* Featured Stylists Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {stylists.slice(0, 3).map((st) => (
            <div
              key={st.id}
              className="bg-white rounded-3xl p-4 sm:p-6 border border-[#EAE8E3] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <img
                    src={st.user?.avatar_url || '/images/stylist_editorial.jpg'}
                    alt={st.user?.display_name}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover flex-shrink-0"
                    onError={(e) => {
                      e.currentTarget.src = '/images/stylist_editorial.jpg';
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-base sm:text-lg font-bold text-[#191919] truncate">{st.user?.display_name}</h3>
                      <CheckCircle size={15} className="text-[#2E7D32] flex-shrink-0" />
                    </div>
                    <div className="text-xs sm:text-sm text-[#8A8176] font-medium truncate">{st.category}</div>
                    <div className="flex items-center gap-1.5 text-xs text-[#666] mt-1 flex-wrap">
                      <span className="inline-flex items-center gap-1 whitespace-nowrap"><MapPin size={12} /> {st.base_city}</span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1 whitespace-nowrap"><Star size={12} className="text-[#D4AF37] fill-[#D4AF37]" /> {st.rating || 5.0}</span>
                      <span>·</span>
                      <span className="whitespace-nowrap">{st.experience_years || 4}+ yrs exp</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#555] leading-relaxed mb-3 sm:mb-4 line-clamp-3">
                  {st.bio}
                </p>

                {/* Specializations Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(st.specializations || []).slice(0, 3).map((spec: string, i: number) => (
                    <span
                      key={i}
                      className="bg-[#F7F5F0] text-[#666] text-xs font-medium px-2.5 py-1 rounded-full border border-[#EAE8E3]"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3.5 border-t border-[#EAE8E3] gap-2 flex-wrap">
                <div>
                  <div className="text-[10px] sm:text-xs text-[#8A8176] uppercase tracking-wider">Starting from</div>
                  <div className="text-base sm:text-xl font-bold text-[#191919]">₹{st.starting_price?.toLocaleString()}</div>
                </div>
                <button
                  onClick={() => onNavigate('stylists')}
                  className="bg-[#191919] text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold hover:bg-black transition-colors"
                  style={{ backgroundColor: '#191919', color: '#FFFFFF' }}
                >
                  <span style={{ color: '#FFFFFF', fontWeight: 700 }}>View Portfolio</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. DISCOVER BOUTIQUES */}
      <section className="landing-section">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-10">
          <div>
            <div className="text-[10px] sm:text-xs font-bold text-[#8A8176] uppercase tracking-widest mb-2">
              Fashion Houses & Boutiques
            </div>
            <h2 className="font-serif text-xl sm:text-3xl md:text-4xl font-bold text-[#191919]">
              Discover Registered Boutiques
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-[#666] mt-1.5 max-w-xl">
              Explore curated designer boutiques with interactive garment hotspots, appointment booking, and instant styling concierge.
            </p>
          </div>
          <button
            onClick={() => onNavigate('brands')}
            className="self-start sm:self-auto bg-white text-[#191919] px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm inline-flex items-center gap-2 border-2 border-[#191919] hover:bg-[#191919] hover:text-white transition-all shadow-sm"
            style={{ backgroundColor: '#FFFFFF', color: '#191919', borderColor: '#191919' }}
          >
            <span style={{ color: '#191919', fontWeight: 700 }}>All Boutiques</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Boutiques Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {brands.slice(0, 3).map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#EAE8E3] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="relative h-48 sm:h-52 overflow-hidden">
                <img
                  src={b.banner_url || '/images/boutique_maison.jpg'}
                  alt={b.brand_name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/images/boutique_maison.jpg';
                  }}
                />
                <span className="absolute bottom-3 left-3 bg-white/95 text-[#191919] text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                  <MapPin size={11} className="inline mr-1 text-[#8A8176]" />
                  {b.city}
                </span>
              </div>
              <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#191919] truncate">{b.brand_name}</h3>
                    {b.is_verified && <CheckCircle size={15} className="text-[#2E7D32] flex-shrink-0" />}
                  </div>
                  <div className="text-xs sm:text-sm text-[#8A8176] mb-2">{b.category}</div>
                  <p className="text-xs sm:text-sm text-[#666] leading-relaxed mb-4 line-clamp-2">
                    {b.description}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-[#EAE8E3] gap-2 flex-wrap">
                  <span className="text-xs text-[#8A8176]">{b.products_count || 12} Items on Rack</span>
                  <button
                    onClick={() => onNavigate('brands')}
                    className="bg-[#191919] text-white px-4 py-2 rounded-full text-xs font-semibold hover:bg-black transition-colors"
                    style={{ backgroundColor: '#191919', color: '#FFFFFF' }}
                  >
                    <span style={{ color: '#FFFFFF', fontWeight: 700 }}>Explore Store</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FASHION COMMUNITY & TRENDING POSTS */}
      <section className="landing-section">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="text-[10px] sm:text-xs font-bold text-[#8A8176] uppercase tracking-widest mb-2">
            Fashion Social Community
          </div>
          <h2 className="font-serif text-xl sm:text-3xl md:text-4xl font-bold text-[#191919] mb-2 sm:mb-3">
            Trending Looks & Community Transformations
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-[#666] leading-relaxed">
            Real outfits uploaded by verified creators, personal stylists, and fashion lovers. Tagged with exact brand garments.
          </p>
        </div>

        {/* Community Feed Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {posts.slice(0, 4).map((post) => (
            <div
              key={post.id}
              onClick={() => onNavigate('feed')}
              className="bg-white rounded-2xl overflow-hidden border border-[#EAE8E3] cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all shadow-sm"
            >
              <div className="relative h-64 sm:h-72 overflow-hidden">
                <img
                  src={post.media?.[0]?.media_url || '/images/hero_editorial.jpg'}
                  alt={post.caption}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/images/hero_editorial.jpg';
                  }}
                />
                {post.product_tags?.length > 0 && (
                  <span className="absolute top-2.5 left-2.5 bg-black/85 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-sm">
                    <ShoppingBag size={11} />
                    <span>{post.product_tags.length} Tagged</span>
                  </span>
                )}
              </div>
              <div className="p-3.5 sm:p-4">
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={post.author?.avatar_url || '/images/stylist_editorial.jpg'}
                    alt={post.author?.display_name}
                    className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                    onError={(e) => {
                      e.currentTarget.src = '/images/stylist_editorial.jpg';
                    }}
                  />
                  <span className="text-xs sm:text-sm font-semibold text-[#191919] truncate">{post.author?.display_name}</span>
                </div>
                <p className="text-xs text-[#555] leading-relaxed line-clamp-2 mb-2.5">
                  {post.caption}
                </p>
                <div className="flex items-center gap-3.5 text-xs text-[#8A8176]">
                  <span className="flex items-center gap-1"><Heart size={13} /> {post.likes_count || 48}</span>
                  <span className="flex items-center gap-1"><MessageSquare size={13} /> {post.comments_count || 12}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. BRAND & CREATOR COLLABORATIONS */}
      <section className="landing-section">
        <div className="landing-creator-card">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-block bg-white/10 text-[#D4AF37] text-xs font-semibold px-3.5 py-1.5 rounded-full mb-3 sm:mb-4">
                DROBE Creator Network
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold leading-tight mb-3 sm:mb-4 text-white">
                Where Luxury Brands Meet Fashion Creators & Stylists.
              </h2>
              <p className="text-xs sm:text-base text-[#B0ACA4] leading-relaxed mb-6 sm:mb-8">
                Boutiques launch seasonal lookbook campaigns, invite verified stylists for collection curation, and contract fashion creators with escrow payment protection.
              </p>
              <div className="flex flex-wrap gap-2.5 sm:gap-3">
                <button
                  onClick={() => onOpenAuth('boutique', 'register')}
                  className="bg-white text-[#191919] px-5 py-2.5 sm:px-6 sm:py-3 rounded-full text-xs sm:text-sm font-bold hover:bg-neutral-100 transition-colors shadow-md"
                  style={{ backgroundColor: '#FFFFFF', color: '#191919', border: '2px solid #FFFFFF' }}
                >
                  <span style={{ color: '#191919', fontWeight: 700 }}>Post Brand Campaign</span>
                </button>
                <button
                  onClick={() => onOpenAuth('consultant', 'register')}
                  className="bg-transparent text-white border-2 border-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-full text-xs sm:text-sm font-bold hover:bg-white/15 transition-colors shadow-sm"
                  style={{ backgroundColor: 'transparent', color: '#FFFFFF', border: '2px solid #FFFFFF' }}
                >
                  <span style={{ color: '#FFFFFF', fontWeight: 700 }}>Apply as Creator / Stylist</span>
                </button>
              </div>
            </div>

            {/* 4 Feature Cards (Single column on mobile, 2 columns on tablet/desktop) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-white/5 rounded-2xl p-4 sm:p-5 border border-white/10">
                <Crown size={22} className="text-[#D4AF37] mb-2 sm:mb-2.5" />
                <div className="text-base sm:text-lg font-semibold mb-1 text-white">Curated Campaigns</div>
                <div className="text-xs sm:text-sm text-[#999] leading-relaxed">Verified luxury brands and boutique lookbook drops with clear milestones.</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 sm:p-5 border border-white/10">
                <ShieldCheck size={22} className="text-[#D4AF37] mb-2 sm:mb-2.5" />
                <div className="text-base sm:text-lg font-semibold mb-1 text-white">Escrow Security</div>
                <div className="text-xs sm:text-sm text-[#999] leading-relaxed">Funds secured before campaign launch and released upon deliverable approval.</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 sm:p-5 border border-white/10">
                <Camera size={22} className="text-[#D4AF37] mb-2 sm:mb-2.5" />
                <div className="text-base sm:text-lg font-semibold mb-1 text-white">Editorial Rights</div>
                <div className="text-xs sm:text-sm text-[#999] leading-relaxed">Standardized creator and commercial licensing agreements built-in.</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 sm:p-5 border border-white/10">
                <TrendingUp size={22} className="text-[#D4AF37] mb-2 sm:mb-2.5" />
                <div className="text-base sm:text-lg font-semibold mb-1 text-white">Performance Data</div>
                <div className="text-xs sm:text-sm text-[#999] leading-relaxed">Track clicks, engagement, and direct garment sales from published looks.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. JOIN DROBE (4 Dedicated Registration Paths) */}
      <section className="landing-section">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="text-[10px] sm:text-xs font-bold text-[#8A8176] uppercase tracking-widest mb-2">
            Ecosystem Onboarding
          </div>
          <h2 className="font-serif text-xl sm:text-3xl md:text-4xl font-bold text-[#191919] mb-2 sm:mb-3">
            Join the DROBE Fashion Ecosystem
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-[#666] leading-relaxed">
            Four dedicated registration and login experiences sharing one secure database.
          </p>
        </div>

        {/* 4 Portal Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Path 1: Customer */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#EAE8E3] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#F7F5F0] flex items-center justify-center mb-4">
                <ShoppingBag size={22} className="text-[#191919]" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#191919] mb-2">Customer Portal</h3>
              <p className="text-xs sm:text-sm text-[#666] leading-relaxed mb-5">
                Discover visual feeds, book personal stylists, try clothes with AI models, and build saved collections.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => onOpenAuth('customer', 'register')}
                className="bg-[#191919] text-white py-2.5 px-4 rounded-full font-bold text-xs sm:text-sm hover:bg-black transition-colors"
                style={{ backgroundColor: '#191919', color: '#FFFFFF' }}
              >
                <span style={{ color: '#FFFFFF', fontWeight: 700 }}>Join as Customer</span>
              </button>
              <button
                onClick={() => onOpenAuth('customer', 'signin')}
                className="bg-white text-[#191919] border border-[#191919]/30 py-2 px-3 rounded-full font-bold text-xs hover:bg-[#191919] hover:text-white transition-all text-center shadow-xs"
                style={{ backgroundColor: '#FFFFFF', color: '#191919', borderColor: 'rgba(25, 25, 25, 0.3)' }}
              >
                Sign In to Customer Account
              </button>
            </div>
          </div>

          {/* Path 2: Boutique */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#EAE8E3] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#F7F5F0] flex items-center justify-center mb-4">
                <Crown size={22} className="text-[#191919]" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#191919] mb-2">Boutique & Brand</h3>
              <p className="text-xs sm:text-sm text-[#666] leading-relaxed mb-5">
                Manage boutique catalog, publish shop-the-look tags, host lookbooks, and collaborate with creators.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => onOpenAuth('boutique', 'register')}
                className="bg-[#191919] text-white py-2.5 px-4 rounded-full font-bold text-xs sm:text-sm hover:bg-black transition-colors"
                style={{ backgroundColor: '#191919', color: '#FFFFFF' }}
              >
                <span style={{ color: '#FFFFFF', fontWeight: 700 }}>Register as Boutique</span>
              </button>
              <button
                onClick={() => onOpenAuth('boutique', 'signin')}
                className="bg-white text-[#191919] border border-[#191919]/30 py-2 px-3 rounded-full font-bold text-xs hover:bg-[#191919] hover:text-white transition-all text-center shadow-xs"
                style={{ backgroundColor: '#FFFFFF', color: '#191919', borderColor: 'rgba(25, 25, 25, 0.3)' }}
              >
                Sign In to Boutique
              </button>
            </div>
          </div>

          {/* Path 3: Stylist / Consultant */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#EAE8E3] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#F7F5F0] flex items-center justify-center mb-4">
                <Scissors size={22} className="text-[#191919]" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#191919] mb-2">Stylist & Consultant</h3>
              <p className="text-xs sm:text-sm text-[#666] leading-relaxed mb-5">
                Manage bookings, calendars, service locations, before-and-after portfolios, and direct client earnings.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => onOpenAuth('consultant', 'register')}
                className="bg-[#191919] text-white py-2.5 px-4 rounded-full font-bold text-xs sm:text-sm hover:bg-black transition-colors"
                style={{ backgroundColor: '#191919', color: '#FFFFFF' }}
              >
                <span style={{ color: '#FFFFFF', fontWeight: 700 }}>Join as Stylist</span>
              </button>
              <button
                onClick={() => onOpenAuth('consultant', 'signin')}
                className="bg-white text-[#191919] border border-[#191919]/30 py-2 px-3 rounded-full font-bold text-xs hover:bg-[#191919] hover:text-white transition-all text-center shadow-xs"
                style={{ backgroundColor: '#FFFFFF', color: '#191919', borderColor: 'rgba(25, 25, 25, 0.3)' }}
              >
                Sign In to Stylist Portal
              </button>
            </div>
          </div>

          {/* Path 4: Admin Access */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#EAE8E3] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#F7F5F0] flex items-center justify-center mb-4">
                <ShieldCheck size={22} className="text-[#191919]" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#191919] mb-2">Enterprise Admin</h3>
              <p className="text-xs sm:text-sm text-[#666] leading-relaxed mb-5">
                Restricted operations portal. Manage verifications, financial ledgers, staff RBAC, and safety moderation.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => onOpenAuth('admin', 'signin')}
                className="bg-[#191919] text-white py-2.5 px-4 rounded-full font-bold text-xs sm:text-sm hover:bg-black transition-colors"
                style={{ backgroundColor: '#191919', color: '#FFFFFF' }}
              >
                <span style={{ color: '#FFFFFF', fontWeight: 700 }}>Admin Credentials Login</span>
              </button>
              <span className="text-[11px] text-[#423B34] font-semibold text-center mt-1">
                Invitation Only · No Public Sign-up
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#191919] text-white py-10 px-5 sm:py-16 sm:px-8 border-t border-[#333] pb-28 sm:pb-16 rounded-b-2xl sm:rounded-b-3xl">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12 text-left">
          <div>
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                DROBE
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#8A8176] leading-relaxed">
              The international luxury fashion social network and professional marketplace. Connecting creators, boutiques, consultants, and clients.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3 sm:mb-4">Portals</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#B0ACA4]">
              <li className="cursor-pointer hover:text-white transition-colors" onClick={() => onOpenAuth('customer', 'signin')}>Customer Portal</li>
              <li className="cursor-pointer hover:text-white transition-colors" onClick={() => onOpenAuth('boutique', 'signin')}>Boutique / Brand Portal</li>
              <li className="cursor-pointer hover:text-white transition-colors" onClick={() => onOpenAuth('consultant', 'signin')}>Stylist & Consultant Portal</li>
              <li className="cursor-pointer hover:text-white transition-colors" onClick={() => onOpenAuth('admin', 'signin')}>Administration Desk</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3 sm:mb-4">Discovery</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#B0ACA4]">
              <li className="cursor-pointer hover:text-white transition-colors" onClick={() => onNavigate('recommendations')}>Color & Material Guides</li>
              <li className="cursor-pointer hover:text-white transition-colors" onClick={() => onNavigate('stylists')}>Professional Stylists</li>
              <li className="cursor-pointer hover:text-white transition-colors" onClick={() => onNavigate('brands')}>Boutique Directory</li>
              <li className="cursor-pointer hover:text-white transition-colors" onClick={() => onNavigate('styleguides')}>Editorial Style Guides</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3 sm:mb-4">Legal & Help</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#B0ACA4]">
              <li className="cursor-pointer hover:text-white transition-colors" onClick={() => setLegalModalOpen('about')}>About DROBE</li>
              <li className="cursor-pointer hover:text-white transition-colors" onClick={() => setLegalModalOpen('terms')}>Terms of Service</li>
              <li className="cursor-pointer hover:text-white transition-colors" onClick={() => setLegalModalOpen('privacy')}>Privacy Policy</li>
              <li className="cursor-pointer hover:text-white transition-colors" onClick={() => setLegalModalOpen('help')}>Help & Support Centre</li>
              <li className="cursor-pointer hover:text-white transition-colors" onClick={() => setContactModalOpen(true)}>Contact Concierge</li>
            </ul>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto pt-6 sm:pt-8 border-t border-[#2B2B2B] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#666]">
          <div>© 2026 DROBE Technologies Inc. All rights reserved.</div>
          <div>Crafted for international luxury fashion, verified professionals, and bespoke retail.</div>
        </div>
      </footer>

      {/* Legal & Info Modals */}
      {legalModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-8 max-h-[85vh] overflow-y-auto shadow-2xl">
            <h3 className="font-serif text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-[#191919]">
              {legalModalOpen === 'about' && 'About DROBE'}
              {legalModalOpen === 'terms' && 'Terms of Service'}
              {legalModalOpen === 'privacy' && 'Privacy Policy'}
              {legalModalOpen === 'help' && 'Help & Support Centre'}
            </h3>
            <p className="text-xs sm:text-sm text-[#555] leading-relaxed mb-5 sm:mb-6">
              {legalModalOpen === 'about' && 'DROBE is a next-generation luxury fashion technology ecosystem that integrates social expression, personal stylist booking, and boutique showroom commerce on a single centralized PostgreSQL architecture.'}
              {legalModalOpen === 'terms' && 'All transactions, appointments, and stylist bookings are subject to 24-hour cancellation policies and escrow security. Boutiques and consultants must maintain verified accreditation.'}
              {legalModalOpen === 'privacy' && 'Your personal fashion preferences, measurements, and payment information are encrypted with banking-grade security and never sold to third parties.'}
              {legalModalOpen === 'help' && 'Need styling assistance, booking dispute resolution, or boutique onboarding support? Our editorial and support desk is available 24/7 at concierge@drobe.style.'}
            </p>
            <button
              onClick={() => setLegalModalOpen(null)}
              className="bg-[#191919] text-white rounded-full px-6 py-2.5 font-semibold text-xs sm:text-sm hover:bg-black transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Contact Concierge Modal */}
      {contactModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            <h3 className="font-serif text-xl sm:text-2xl font-bold mb-2 text-[#191919]">
              Contact DROBE Concierge
            </h3>
            <p className="text-xs sm:text-sm text-[#666] mb-4">
              Reach our editorial team, boutique onboarding specialists, or general client assistance.
            </p>
            <div className="flex flex-col gap-3 mb-5">
              <input
                type="text"
                placeholder="Your Name"
                className="p-3 rounded-xl border border-[#EAE8E3] text-xs sm:text-sm outline-none focus:border-[#191919]"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="p-3 rounded-xl border border-[#EAE8E3] text-xs sm:text-sm outline-none focus:border-[#191919]"
              />
              <textarea
                placeholder="Your message or enquiry..."
                rows={4}
                className="p-3 rounded-xl border border-[#EAE8E3] text-xs sm:text-sm outline-none focus:border-[#191919] resize-none"
              />
            </div>
            <div className="flex gap-2.5 justify-end">
              <button
                onClick={() => setContactModalOpen(false)}
                className="bg-transparent text-[#666] border border-[#EAE8E3] rounded-full px-4 py-2 text-xs sm:text-sm hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Thank you! Your message has been received by DROBE Concierge.');
                  setContactModalOpen(false);
                }}
                className="bg-[#191919] text-white rounded-full px-5 py-2 font-semibold text-xs sm:text-sm hover:bg-black transition-colors"
              >
                Send Enquiry
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
