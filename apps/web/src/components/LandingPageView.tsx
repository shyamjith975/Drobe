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
    <div className="landing-page-root" style={{ background: '#F7F5F0', color: '#191919', minHeight: '100vh' }}>
      
      {/* 1. HERO SECTION */}
      <section className="hero-section" style={{
        position: 'relative',
        padding: '5rem 1.5rem 6rem',
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
        gap: '2.5rem',
        alignItems: 'center'
      }}>
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
            <span>DROBE Platform · Discover. Express. Connect. Style.</span>
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
            fontWeight: 700,
            lineHeight: 1.12,
            letterSpacing: '-0.02em',
            marginBottom: '1.25rem',
            color: '#191919'
          }}>
            Your Style.<br />
            Your People.<br />
            <span style={{ fontStyle: 'italic', fontWeight: 400, color: '#8A8176' }}>Your DROBE.</span>
          </h1>

          <p style={{
            fontSize: '1.15rem',
            lineHeight: 1.6,
            color: '#555',
            maxWidth: '520px',
            marginBottom: '2.5rem'
          }}>
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
                padding: '14px 26px',
                borderRadius: '999px',
                fontWeight: 600,
                fontSize: '0.95rem',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 6px 20px rgba(25, 25, 25, 0.15)',
                transition: 'transform 0.2s ease'
              }}
            >
              <Compass size={17} />
              <span>Explore Fashion</span>
            </button>

            <button
              onClick={() => onNavigate('stylists')}
              style={{
                background: '#FFFFFF',
                color: '#191919',
                padding: '14px 24px',
                borderRadius: '999px',
                fontWeight: 600,
                fontSize: '0.95rem',
                border: '1px solid #EAE8E3',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
              }}
            >
              <Scissors size={17} />
              <span>Find a Stylist</span>
            </button>

            <button
              onClick={() => onNavigate('brands')}
              style={{
                background: '#FFFFFF',
                color: '#191919',
                padding: '14px 24px',
                borderRadius: '999px',
                fontWeight: 600,
                fontSize: '0.95rem',
                border: '1px solid #EAE8E3',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
              }}
            >
              <ShoppingBag size={17} />
              <span>Discover Boutiques</span>
            </button>

            <button
              onClick={() => onOpenAuth('customer', 'register')}
              style={{
                background: 'transparent',
                color: '#8A8176',
                padding: '14px 20px',
                borderRadius: '999px',
                fontWeight: 600,
                fontSize: '0.95rem',
                border: '1px dashed #8A8176',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>Join DROBE</span>
              <ArrowRight size={15} />
            </button>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 sm:pt-6 border-t border-[#EAE8E3]">
            <div className="min-w-0">
              <div className="text-lg sm:text-2xl font-bold text-[#141414] font-serif truncate">14,500+</div>
              <div className="text-[9px] sm:text-xs text-[#8A8176] uppercase tracking-wider truncate">Outfits</div>
            </div>
            <div className="min-w-0">
              <div className="text-lg sm:text-2xl font-bold text-[#141414] font-serif truncate">320+</div>
              <div className="text-[9px] sm:text-xs text-[#8A8176] uppercase tracking-wider truncate">Stylists</div>
            </div>
            <div className="min-w-0">
              <div className="text-lg sm:text-2xl font-bold text-[#141414] font-serif truncate">99.4%</div>
              <div className="text-[9px] sm:text-xs text-[#8A8176] uppercase tracking-wider truncate">Satisfaction</div>
            </div>
          </div>
        </div>

        {/* Hero Visual Collage with Reference Flagship Preview */}
        <div style={{ position: 'relative' }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            padding: '10px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.08)',
            border: '1px solid #EAE8E3',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Fixed-Size 3-Arch Triptych Container */}
            <div className="hero-arches-triptych-container">
              
              {/* Left Arch: Boutique Showroom Atelier (Fixed Size) */}
              <div className="hero-arch-column hero-arch-side">
                <img
                  src="/images/shop_manager.jpg"
                  alt="DROBE Atelier Boutique Showroom"
                  className="hero-arch-img"
                  onError={(e) => {
                    e.currentTarget.src = '/images/boutique_maison.jpg';
                  }}
                />
              </div>

              {/* Center Arch: Lead Stylist & Editorial Moodboard (Fixed Size) */}
              <div className="hero-arch-column hero-arch-center">
                <img
                  src="/images/stylist_editorial.jpg"
                  alt="DROBE Autumn/Winter Stylist Atelier Moodboard"
                  className="hero-arch-img"
                  onError={(e) => {
                    e.currentTarget.src = '/images/hero_editorial.jpg';
                  }}
                />

                {/* Floating Hotspot Badge */}
                <div 
                  className="hero-hotspot-badge"
                  style={{
                    position: 'absolute',
                    top: '20%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(8px)',
                    padding: '6px 10px',
                    borderRadius: '14px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.18)',
                    border: '1px solid rgba(255,255,255,0.85)',
                    cursor: 'pointer',
                    zIndex: 10,
                    maxWidth: '90%',
                    boxSizing: 'border-box'
                  }}
                  onClick={() => onNavigate('recommendations')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '1px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#191919', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Shop Look</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#191919', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Textured Tweed</div>
                  <div style={{ fontSize: '0.65rem', color: '#8A8176' }}>$3,500</div>
                </div>
              </div>

              {/* Right Arch: Boutique Interior & Archive (Fixed Size) */}
              <div className="hero-arch-column hero-arch-side">
                <img
                  src="/images/shop_manager.jpg"
                  alt="DROBE Flagship Lounge"
                  className="hero-arch-img"
                  onError={(e) => {
                    e.currentTarget.src = '/images/boutique_atelier.jpg';
                  }}
                />
              </div>

              {/* Bottom Recommendation Guide Strip */}
              <div 
                className="hero-recommendations-strip"
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '10px',
                  right: '10px',
                  background: 'rgba(25, 25, 25, 0.92)',
                  color: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  backdropFilter: 'blur(10px)',
                  zIndex: 20
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                  <Sparkles size={16} color="#D4AF37" style={{ flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      Color & Fabric Guide
                    </div>
                    <div className="hidden sm:block" style={{ fontSize: '0.68rem', color: '#A09C94', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      Curated seasonal palettes
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('recommendations')}
                  style={{
                    background: '#FFFFFF',
                    color: '#191919',
                    border: 'none',
                    borderRadius: '999px',
                    padding: '5px 12px',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    flexShrink: 0
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
      <section style={{
        padding: '5rem 1.5rem',
        maxWidth: '1280px',
        margin: '0 auto',
        borderTop: '1px solid #EAE8E3'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#8A8176', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
            Section 02 · Visual Style Architecture
          </div>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
            fontWeight: 700,
            marginBottom: '1rem',
            color: '#191919'
          }}>
            Explore Fashion Aesthetic Categories
          </h2>
          <p style={{ color: '#666', fontSize: '1rem', lineHeight: 1.6 }}>
            Immerse yourself in ten curated fashion movements, from quiet luxury and high-heat streetwear to regal bridal couture.
          </p>
        </div>

        {/* 10 Category Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
          gap: '20px'
        }}>
          {fashionCategories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => onNavigate('feed')}
              style={{
                background: '#FFFFFF',
                borderRadius: '22px',
                overflow: 'hidden',
                border: '1px solid #EAE8E3',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 25px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.03)';
              }}
            >
              <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                <img
                  src={cat.image}
                  alt={cat.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.currentTarget.src = '/images/hero_editorial.jpg';
                  }}
                />
                <span style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(25, 25, 25, 0.85)',
                  color: '#FFFFFF',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: '999px',
                  backdropFilter: 'blur(4px)'
                }}>
                  {cat.badge}
                </span>
              </div>
              <div style={{ padding: '16px' }}>
                <h3 style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: '#191919',
                  marginBottom: '4px'
                }}>
                  {cat.title}
                </h3>
                <p style={{
                  fontSize: '0.8rem',
                  color: '#777',
                  lineHeight: 1.4,
                  marginBottom: '12px'
                }}>
                  {cat.subtitle}
                </p>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#191919'
                }}>
                  <span>Explore Looks</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FIND YOUR PERSONAL STYLIST */}
      <section style={{
        padding: '5rem 1.5rem',
        maxWidth: '1280px',
        margin: '0 auto',
        borderTop: '1px solid #EAE8E3'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '20px',
          marginBottom: '3rem'
        }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#8A8176', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
              Section 03 · Professional Stylist Marketplace
            </div>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
              fontWeight: 700,
              color: '#191919'
            }}>
              Find Your Personal Stylist
            </h2>
            <p style={{ color: '#666', fontSize: '1rem', marginTop: '6px' }}>
              Certified personal consultants, celebrity advisors, and wedding trousseau experts ready for virtual & physical appointments.
            </p>
          </div>
          <button
            onClick={() => onNavigate('stylists')}
            style={{
              background: '#191919',
              color: '#FFFFFF',
              padding: '12px 24px',
              borderRadius: '999px',
              fontWeight: 600,
              fontSize: '0.9rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>View All Stylists</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Featured Stylists Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: '20px'
        }}>
          {stylists.slice(0, 3).map((st) => (
            <div
              key={st.id}
              style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                padding: '24px',
                border: '1px solid #EAE8E3',
                boxShadow: '0 6px 20px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  <img
                    src={st.user?.avatar_url || '/images/stylist_editorial.jpg'}
                    alt={st.user?.display_name}
                    style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.currentTarget.src = '/images/stylist_editorial.jpg';
                    }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#191919' }}>{st.user?.display_name}</h3>
                      <CheckCircle size={15} color="#2E7D32" />
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#8A8176', fontWeight: 500 }}>{st.category}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', color: '#666', marginTop: '4px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><MapPin size={12} /> {st.base_city}</span>
                      <span>·</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><Star size={12} color="#D4AF37" fill="#D4AF37" /> {st.rating || 5.0}</span>
                      <span>·</span>
                      <span>{st.experience_years || 4}+ yrs exp</span>
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '0.88rem', color: '#555', lineHeight: 1.5, marginBottom: '16px' }}>
                  {st.bio}
                </p>

                {/* Specializations Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                  {(st.specializations || []).slice(0, 3).map((spec: string, i: number) => (
                    <span
                      key={i}
                      style={{
                        background: '#F7F5F0',
                        color: '#666',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        padding: '4px 10px',
                        borderRadius: '999px',
                        border: '1px solid #EAE8E3'
                      }}
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '16px',
                borderTop: '1px solid #EAE8E3'
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#8A8176', textTransform: 'uppercase' }}>Starting from</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#191919' }}>₹{st.starting_price?.toLocaleString()}</div>
                </div>
                <button
                  onClick={() => onNavigate('stylists')}
                  style={{
                    background: '#191919',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '999px',
                    padding: '10px 20px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  View Portfolio
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. DISCOVER BOUTIQUES */}
      <section style={{
        padding: '5rem 1.5rem',
        maxWidth: '1280px',
        margin: '0 auto',
        borderTop: '1px solid #EAE8E3'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '20px',
          marginBottom: '3rem'
        }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#8A8176', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
              Section 04 · Fashion Houses & Boutiques
            </div>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
              fontWeight: 700,
              color: '#191919'
            }}>
              Discover Registered Boutiques
            </h2>
            <p style={{ color: '#666', fontSize: '1rem', marginTop: '6px' }}>
              Explore curated designer boutiques with interactive garment hotspots, appointment booking, and instant styling concierge.
            </p>
          </div>
          <button
            onClick={() => onNavigate('brands')}
            style={{
              background: '#FFFFFF',
              color: '#191919',
              padding: '12px 24px',
              borderRadius: '999px',
              fontWeight: 600,
              fontSize: '0.9rem',
              border: '1px solid #EAE8E3',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>All Boutiques</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Boutiques Showcase */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: '20px'
        }}>
          {brands.slice(0, 3).map((b) => (
            <div
              key={b.id}
              style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                overflow: 'hidden',
                border: '1px solid #EAE8E3',
                boxShadow: '0 6px 20px rgba(0,0,0,0.02)'
              }}
            >
              <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                <img
                  src={b.banner_url || '/images/boutique_maison.jpg'}
                  alt={b.brand_name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.currentTarget.src = '/images/boutique_maison.jpg';
                  }}
                />
                <span style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  background: 'rgba(255,255,255,0.92)',
                  color: '#191919',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: '999px'
                }}>
                  <MapPin size={11} style={{ display: 'inline', marginRight: '3px' }} />
                  {b.city}
                </span>
              </div>
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#191919' }}>{b.brand_name}</h3>
                  {b.is_verified && <CheckCircle size={15} color="#2E7D32" />}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#8A8176', marginBottom: '10px' }}>{b.category}</div>
                <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.5, marginBottom: '16px' }}>
                  {b.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.8rem', color: '#8A8176' }}>{b.products_count || 12} Items on Rack</span>
                  <button
                    onClick={() => onNavigate('brands')}
                    style={{
                      background: '#191919',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '999px',
                      padding: '8px 18px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Explore Store
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FASHION COMMUNITY & TRENDING POSTS */}
      <section style={{
        padding: '5rem 1.5rem',
        maxWidth: '1280px',
        margin: '0 auto',
        borderTop: '1px solid #EAE8E3'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#8A8176', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
            Section 05 · Fashion Social Community
          </div>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
            fontWeight: 700,
            marginBottom: '1rem',
            color: '#191919'
          }}>
            Trending Looks & Community Transformations
          </h2>
          <p style={{ color: '#666', fontSize: '1rem', lineHeight: 1.6 }}>
            Real outfits uploaded by verified creators, personal stylists, and fashion lovers. Tagged with exact brand garments.
          </p>
        </div>

        {/* Community Feed Preview */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '20px'
        }}>
          {posts.slice(0, 4).map((post) => (
            <div
              key={post.id}
              onClick={() => onNavigate('feed')}
              style={{
                background: '#FFFFFF',
                borderRadius: '22px',
                overflow: 'hidden',
                border: '1px solid #EAE8E3',
                cursor: 'pointer'
              }}
            >
              <div style={{ position: 'relative', height: '280px', overflow: 'hidden' }}>
                <img
                  src={post.media?.[0]?.media_url || '/images/hero_editorial.jpg'}
                  alt={post.caption}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.currentTarget.src = '/images/hero_editorial.jpg';
                  }}
                />
                {post.product_tags?.length > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(25, 25, 25, 0.85)',
                    color: '#FFFFFF',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    padding: '4px 10px',
                    borderRadius: '999px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <ShoppingBag size={11} />
                    <span>{post.product_tags.length} Tagged</span>
                  </span>
                )}
              </div>
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <img
                    src={post.author?.avatar_url || '/images/stylist_editorial.jpg'}
                    alt={post.author?.display_name}
                    style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.currentTarget.src = '/images/stylist_editorial.jpg';
                    }}
                  />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#191919' }}>{post.author?.display_name}</span>
                </div>
                <p style={{
                  fontSize: '0.82rem',
                  color: '#555',
                  lineHeight: 1.4,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  marginBottom: '10px'
                }}>
                  {post.caption}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.8rem', color: '#8A8176' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Heart size={14} /> {post.likes_count || 48}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MessageSquare size={14} /> {post.comments_count || 12}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. BRAND & CREATOR COLLABORATIONS */}
      <section style={{
        padding: '5rem 1.5rem',
        maxWidth: '1280px',
        margin: '0 auto',
        borderTop: '1px solid #EAE8E3'
      }}>
        <div style={{
          background: '#191919',
          color: '#FFFFFF',
          borderRadius: '32px',
          padding: '4rem 2.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: '2.5rem',
          alignItems: 'center'
        }}>
          <div>
            <span style={{
              background: 'rgba(255,255,255,0.12)',
              color: '#D4AF37',
              fontSize: '0.8rem',
              fontWeight: 600,
              padding: '6px 14px',
              borderRadius: '999px',
              display: 'inline-block',
              marginBottom: '1rem'
            }}>
              DROBE Creator Network
            </span>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(2rem, 3.5vw, 2.6rem)',
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: '1.2rem'
            }}>
              Where Luxury Brands Meet Fashion Creators & Stylists.
            </h2>
            <p style={{ color: '#B0ACA4', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Boutiques launch seasonal lookbook campaigns, invite verified stylists for collection curation, and contract fashion creators with escrow payment protection.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <button
                onClick={() => onOpenAuth('boutique', 'register')}
                style={{
                  background: '#FFFFFF',
                  color: '#191919',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '12px 24px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Post Brand Campaign
              </button>
              <button
                onClick={() => onOpenAuth('consultant', 'register')}
                style={{
                  background: 'transparent',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '999px',
                  padding: '12px 24px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Apply as Creator / Stylist
              </button>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px'
          }}>
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '20px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Crown size={24} color="#D4AF37" style={{ marginBottom: '10px' }} />
              <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '4px' }}>Curated Campaigns</div>
              <div style={{ fontSize: '0.8rem', color: '#999' }}>Verified luxury brands and boutique lookbook drops with clear milestones.</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '20px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <ShieldCheck size={24} color="#D4AF37" style={{ marginBottom: '10px' }} />
              <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '4px' }}>Escrow Security</div>
              <div style={{ fontSize: '0.8rem', color: '#999' }}>Funds secured before campaign launch and released upon deliverable approval.</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '20px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Camera size={24} color="#D4AF37" style={{ marginBottom: '10px' }} />
              <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '4px' }}>Editorial Rights</div>
              <div style={{ fontSize: '0.8rem', color: '#999' }}>Standardized creator and commercial licensing agreements built-in.</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '20px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <TrendingUp size={24} color="#D4AF37" style={{ marginBottom: '10px' }} />
              <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '4px' }}>Performance Data</div>
              <div style={{ fontSize: '0.8rem', color: '#999' }}>Track clicks, engagement, and direct garment sales from published looks.</div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. JOIN DROBE (4 Dedicated Registration Paths) */}
      <section style={{
        padding: '5rem 1.5rem',
        maxWidth: '1280px',
        margin: '0 auto',
        borderTop: '1px solid #EAE8E3'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#8A8176', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
            Section 07 · Ecosystem Onboarding
          </div>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
            fontWeight: 700,
            marginBottom: '1rem',
            color: '#191919'
          }}>
            Join the DROBE Fashion Ecosystem
          </h2>
          <p style={{ color: '#666', fontSize: '1rem' }}>
            Four dedicated registration and login experiences sharing one secure database.
          </p>
        </div>

        {/* 4 Portal Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px'
        }}>
          {/* Path 1: Customer */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            padding: '28px',
            border: '1px solid #EAE8E3',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '16px',
                background: '#F7F5F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <ShoppingBag size={24} color="#191919" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#191919', marginBottom: '8px' }}>Customer Portal</h3>
              <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.5, marginBottom: '20px' }}>
                Discover visual feeds, book personal stylists, try clothes with AI models, and build saved collections.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => onOpenAuth('customer', 'register')}
                style={{
                  background: '#191919',
                  color: '#FFFFFF',
                  padding: '12px',
                  borderRadius: '999px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Join as Customer
              </button>
              <button
                onClick={() => onOpenAuth('customer', 'signin')}
                style={{
                  background: 'transparent',
                  color: '#8A8176',
                  padding: '8px',
                  borderRadius: '999px',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Sign In to Customer Account
              </button>
            </div>
          </div>

          {/* Path 2: Boutique */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            padding: '28px',
            border: '1px solid #EAE8E3',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '16px',
                background: '#F7F5F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <Crown size={24} color="#191919" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#191919', marginBottom: '8px' }}>Boutique & Brand</h3>
              <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.5, marginBottom: '20px' }}>
                Manage boutique catalog, publish shop-the-look tags, host lookbooks, and collaborate with creators.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => onOpenAuth('boutique', 'register')}
                style={{
                  background: '#191919',
                  color: '#FFFFFF',
                  padding: '12px',
                  borderRadius: '999px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Register as Boutique
              </button>
              <button
                onClick={() => onOpenAuth('boutique', 'signin')}
                style={{
                  background: 'transparent',
                  color: '#8A8176',
                  padding: '8px',
                  borderRadius: '999px',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Sign In to Boutique
              </button>
            </div>
          </div>

          {/* Path 3: Stylist / Consultant */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            padding: '28px',
            border: '1px solid #EAE8E3',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '16px',
                background: '#F7F5F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <Scissors size={24} color="#191919" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#191919', marginBottom: '8px' }}>Stylist & Consultant</h3>
              <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.5, marginBottom: '20px' }}>
                Manage bookings, calendars, service locations, before-and-after portfolios, and direct client earnings.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => onOpenAuth('consultant', 'register')}
                style={{
                  background: '#191919',
                  color: '#FFFFFF',
                  padding: '12px',
                  borderRadius: '999px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Join as Stylist
              </button>
              <button
                onClick={() => onOpenAuth('consultant', 'signin')}
                style={{
                  background: 'transparent',
                  color: '#8A8176',
                  padding: '8px',
                  borderRadius: '999px',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Sign In to Stylist Portal
              </button>
            </div>
          </div>

          {/* Path 4: Admin Access */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            padding: '28px',
            border: '1px solid #EAE8E3',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '16px',
                background: '#F7F5F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <ShieldCheck size={24} color="#191919" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#191919', marginBottom: '8px' }}>Enterprise Admin</h3>
              <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.5, marginBottom: '20px' }}>
                Restricted operations portal. Manage verifications, financial ledgers, staff RBAC, and safety moderation.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => onOpenAuth('admin', 'signin')}
                style={{
                  background: '#191919',
                  color: '#FFFFFF',
                  padding: '12px',
                  borderRadius: '999px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Admin Credentials Login
              </button>
              <span style={{ fontSize: '0.75rem', color: '#8A8176', textAlign: 'center' }}>
                Invitation Only · No Public Sign-up
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        background: '#191919',
        color: '#FFFFFF',
        padding: '4rem 1.5rem 2rem',
        borderTop: '1px solid #333'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <span style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: '1.6rem',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: '#FFFFFF'
              }}>
                DROBE
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#8A8176', lineHeight: 1.6 }}>
              The international luxury fashion social network and professional marketplace. Connecting creators, boutiques, consultants, and clients.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Portals</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem', color: '#B0ACA4', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li style={{ cursor: 'pointer' }} onClick={() => onOpenAuth('customer', 'signin')}>Customer Portal</li>
              <li style={{ cursor: 'pointer' }} onClick={() => onOpenAuth('boutique', 'signin')}>Boutique / Brand Portal</li>
              <li style={{ cursor: 'pointer' }} onClick={() => onOpenAuth('consultant', 'signin')}>Stylist & Consultant Portal</li>
              <li style={{ cursor: 'pointer' }} onClick={() => onOpenAuth('admin', 'signin')}>Administration Desk</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Discovery</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem', color: '#B0ACA4', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li style={{ cursor: 'pointer' }} onClick={() => onNavigate('recommendations')}>Color & Material Guides</li>
              <li style={{ cursor: 'pointer' }} onClick={() => onNavigate('stylists')}>Professional Stylists</li>
              <li style={{ cursor: 'pointer' }} onClick={() => onNavigate('brands')}>Boutique Directory</li>
              <li style={{ cursor: 'pointer' }} onClick={() => onNavigate('styleguides')}>Editorial Style Guides</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Legal & Help</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem', color: '#B0ACA4', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li style={{ cursor: 'pointer' }} onClick={() => setLegalModalOpen('about')}>About DROBE</li>
              <li style={{ cursor: 'pointer' }} onClick={() => setLegalModalOpen('terms')}>Terms of Service</li>
              <li style={{ cursor: 'pointer' }} onClick={() => setLegalModalOpen('privacy')}>Privacy Policy</li>
              <li style={{ cursor: 'pointer' }} onClick={() => setLegalModalOpen('help')}>Help & Support Centre</li>
              <li style={{ cursor: 'pointer' }} onClick={() => setContactModalOpen(true)}>Contact Concierge</li>
            </ul>
          </div>
        </div>

        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          paddingTop: '2rem',
          borderTop: '1px solid #2B2B2B',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.8rem',
          color: '#666'
        }}>
          <div>© 2026 DROBE Technologies Inc. All rights reserved.</div>
          <div>Crafted for international luxury fashion, verified professionals, and bespoke retail.</div>
        </div>
      </footer>

      {/* Legal & Info Modals */}
      {legalModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            maxWidth: '600px',
            width: '100%',
            padding: '30px',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.6rem', marginBottom: '16px' }}>
              {legalModalOpen === 'about' && 'About DROBE'}
              {legalModalOpen === 'terms' && 'Terms of Service'}
              {legalModalOpen === 'privacy' && 'Privacy Policy'}
              {legalModalOpen === 'help' && 'Help & Support Centre'}
            </h3>
            <p style={{ color: '#555', lineHeight: 1.6, fontSize: '0.9rem', marginBottom: '20px' }}>
              {legalModalOpen === 'about' && 'DROBE is a next-generation luxury fashion technology ecosystem that integrates social expression, personal stylist booking, and boutique showroom commerce on a single centralized PostgreSQL architecture.'}
              {legalModalOpen === 'terms' && 'All transactions, appointments, and stylist bookings are subject to 24-hour cancellation policies and escrow security. Boutiques and consultants must maintain verified accreditation.'}
              {legalModalOpen === 'privacy' && 'Your personal fashion preferences, measurements, and payment information are encrypted with banking-grade security and never sold to third parties.'}
              {legalModalOpen === 'help' && 'Need styling assistance, booking dispute resolution, or boutique onboarding support? Our editorial and support desk is available 24/7 at concierge@drobe.style.'}
            </p>
            <button
              onClick={() => setLegalModalOpen(null)}
              style={{
                background: '#191919',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '999px',
                padding: '10px 24px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Contact Concierge Modal */}
      {contactModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            maxWidth: '500px',
            width: '100%',
            padding: '30px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.6rem', marginBottom: '8px' }}>
              Contact DROBE Concierge
            </h3>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '20px' }}>
              Reach our editorial team, boutique onboarding specialists, or general client assistance.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="Your Name"
                style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #EAE8E3' }}
              />
              <input
                type="email"
                placeholder="Email Address"
                style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #EAE8E3' }}
              />
              <textarea
                placeholder="Your message or enquiry..."
                rows={4}
                style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #EAE8E3' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setContactModalOpen(false)}
                style={{
                  background: 'transparent',
                  color: '#666',
                  border: '1px solid #EAE8E3',
                  borderRadius: '999px',
                  padding: '10px 20px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Thank you! Your message has been received by DROBE Concierge.');
                  setContactModalOpen(false);
                }}
                style={{
                  background: '#191919',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '10px 24px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
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
