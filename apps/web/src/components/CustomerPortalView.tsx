import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Sparkles, 
  Compass, 
  Scissors, 
  Heart, 
  Bookmark, 
  Calendar, 
  MessageSquare, 
  Settings, 
  TrendingUp, 
  Star, 
  MapPin, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  ChevronRight,
  Filter,
  Eye,
  Camera,
  Shirt,
  UserCheck,
  Plus,
  Trash2,
  Ticket,
  QrCode,
  Package,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { FeedView } from './FeedView';
import { StylistsView } from './StylistsView';
import { FashionRecommendationsView } from './FashionRecommendationsView';

interface CustomerPortalViewProps {
  currentUser: any;
  posts: any[];
  stylists: any[];
  brands: any[];
  onOpenBooking: (stylist: any, service?: any) => void;
  onOpenMessages: () => void;
  onOpenCreatePost: () => void;
  onLikePost?: (id: string) => void;
  onSavePost?: (id: string) => void;
}

export const CustomerPortalView: React.FC<CustomerPortalViewProps> = ({
  currentUser,
  posts,
  stylists,
  brands,
  onOpenBooking,
  onOpenMessages,
  onOpenCreatePost,
  onLikePost,
  onSavePost
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'dashboard' | 'recommendations' | 'wardrobe' | 'rentals' | 'feed' | 'discover' | 'stylists' | 'collections' | 'bookings' | 'settings'
  >('dashboard');

  const [feedCategory, setFeedCategory] = useState<string>('All');
  const [custStylistCity, setCustStylistCity] = useState<string>('All');
  const [actionToast, setActionToast] = useState<string>('');

  // ----------------- DIGITAL WARDROBE (Section 7) -----------------
  const [wardrobeCategory, setWardrobeCategory] = useState<string>('All');
  const [isAddPieceOpen, setIsAddPieceOpen] = useState(false);
  const [newPieceName, setNewPieceName] = useState('');
  const [newPieceCat, setNewPieceCat] = useState('Outerwear');
  const [newPieceMaterial, setNewPieceMaterial] = useState('Belgian Linen');
  const [newPieceColor, setNewPieceColor] = useState('Oatmeal');
  const [newPieceSeason, setNewPieceSeason] = useState('Spring / Summer');
  const [newPieceImage, setNewPieceImage] = useState('/images/linen_safari_suit.jpg');

  const [wardrobeItems, setWardrobeItems] = useState<any[]>([
    {
      id: 'w-1',
      name: 'Oatmeal Double-Breasted Linen Blazer',
      category: 'Outerwear',
      color: 'Oatmeal',
      material: '100% Belgian Linen',
      season: 'Spring / Summer',
      image: '/images/linen_safari_suit.jpg',
      occasions: ['Smart Casual', 'Brunch', 'Gallery Opening']
    },
    {
      id: 'w-2',
      name: 'Charcoal Cashmere Mockneck Knit',
      category: 'Tops',
      color: 'Midnight Charcoal',
      material: 'Grade-A Mongolian Cashmere',
      season: 'Autumn / Winter',
      image: '/images/cashmere_mockneck.jpg',
      occasions: ['Executive Meeting', 'Travel', 'Dinner']
    },
    {
      id: 'w-3',
      name: 'Tailored Wide-Leg Pleated Trousers',
      category: 'Bottoms',
      color: 'Ivory Cream',
      material: 'Virgin Tropical Wool',
      season: 'All Season',
      image: '/images/poplin_skirt_set.jpg',
      occasions: ['Office', 'Formal', 'Resort']
    },
    {
      id: 'w-4',
      name: 'Emerald Cut-Out Bias Silk Gown',
      category: 'Eveningwear',
      color: 'Deep Emerald',
      material: 'Heavy Mulberry Silk Charmeuse',
      season: 'Special Occasions',
      image: '/images/emerald_silk_gown.jpg',
      occasions: ['Gala', 'Wedding Reception', 'Sangeet']
    }
  ]);

  const [outfitCombos, setOutfitCombos] = useState<any[]>([
    {
      id: 'combo-1',
      name: 'Old Money Summer Executive',
      occasion: 'Business Casual',
      pieces: ['Oatmeal Double-Breasted Linen Blazer', 'Tailored Wide-Leg Pleated Trousers'],
      image: '/images/linen_safari_suit.jpg',
      stylistNotes: 'Pair with Belgian calf suede loafers and a minimal silver signet ring.'
    },
    {
      id: 'combo-2',
      name: 'Winter Monochrome Minimalist',
      occasion: 'Evening Dinner',
      pieces: ['Charcoal Cashmere Mockneck Knit', 'Tailored Wide-Leg Pleated Trousers'],
      image: '/images/cashmere_mockneck.jpg',
      stylistNotes: 'Drape an oversized wool overcoat and unstructured leather tote.'
    }
  ]);

  // ----------------- FASHION RENTALS & EVENT PASSES (Section 5.8 & 5.9) -----------------
  const [customerRentals, setCustomerRentals] = useState<any[]>([
    {
      id: 'rnt-1',
      garment_title: 'Sabyasachi Heritage Raw Silk Embroidered Sherwani',
      boutique: 'Heritage Bridal Vault · Delhi',
      rental_period: '7 Days (Nov 10 – Nov 17)',
      return_due: '2026-11-17',
      rental_fee: 14500,
      security_deposit: 25000,
      status: 'Confirmed & Dispatching',
      image: '/images/linen_safari_suit.jpg'
    },
    {
      id: 'rnt-2',
      garment_title: 'Maison Margiela Sculptural Tailored Wool Cape',
      boutique: 'Archival Runway Lounge · Mumbai',
      rental_period: '3 Days (Nov 04 – Nov 07)',
      return_due: '2026-11-07',
      rental_fee: 6800,
      security_deposit: 15000,
      status: 'In Transit',
      image: '/images/pink_tweed_coat.jpg'
    }
  ]);

  const [customerPasses, setCustomerPasses] = useState<any[]>([
    {
      id: 'tkt-1',
      event_title: 'DROBE Kochi Couture Runway & Atelier Gala',
      date: 'Saturday, Nov 22, 2026 · 6:00 PM',
      venue: 'Grand Hyatt Waterfront Ballroom, Bolgatty, Kochi',
      tier: 'Front Row VIP Pass',
      price: 3500,
      ticket_code: 'DRB-RUNWAY-8429',
      status: 'Confirmed'
    },
    {
      id: 'tkt-2',
      event_title: 'Masterclass: Editorial Fashion & Lookbook Direction',
      date: 'Sunday, Nov 29, 2026 · 11:00 AM',
      venue: 'Studio Ivory Light & Sound, Panampilly Nagar, Kochi',
      tier: 'Studio Participant Seat',
      price: 4200,
      ticket_code: 'DRB-EDU-3912',
      status: 'Confirmed'
    }
  ]);

  const [qrPassModalItem, setQrPassModalItem] = useState<any | null>(null);

  const showToast = (msg: string) => {
    setActionToast(msg);
    setTimeout(() => setActionToast(''), 3500);
  };

  const [bookingFilter, setBookingFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');

  // Customer Saved Collections Specified in Section 5.8
  const [savedBoards, setSavedBoards] = useState<any[]>([
    {
      id: 'board-1',
      title: 'Old Money & Quiet Luxury',
      itemsCount: 14,
      cover: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
      tag: 'Old Money'
    },
    {
      id: 'board-2',
      title: 'Wedding & Destination Looks',
      itemsCount: 8,
      cover: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
      tag: 'Wedding'
    },
    {
      id: 'board-3',
      title: 'Casual Weekend & Streetwear',
      itemsCount: 22,
      cover: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=600&q=80',
      tag: 'Casual'
    },
    {
      id: 'board-4',
      title: 'Office & Tailored Minimalist',
      itemsCount: 11,
      cover: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
      tag: 'Formal'
    }
  ]);

  // Customer Bookings Specified in Section 5.9
  const [customerBookings, setCustomerBookings] = useState<any[]>([
    {
      id: 'cbk-1',
      stylist_name: 'Maya Nambiar',
      stylist_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      service_title: 'Full Wardrobe Audit & Capsule Styling',
      booking_date: '2026-11-06',
      booking_time: '14:00',
      service_mode: 'physical_shopping',
      status: 'confirmed',
      total_amount: 7000,
      paid_amount: 3500,
      city: 'Kochi'
    },
    {
      id: 'cbk-2',
      stylist_name: 'Rohan Varma',
      stylist_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      service_title: 'Virtual Style & Palette Consultation',
      booking_date: '2026-11-12',
      booking_time: '16:30',
      service_mode: 'virtual_consultation',
      status: 'pending',
      total_amount: 2500,
      paid_amount: 0,
      city: 'Kozhikode'
    }
  ]);

  return (
    <div className="customer-portal-root" style={{ background: '#F7F5F0', minHeight: '90vh', padding: '2rem 1.5rem 6rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* Customer Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '2rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Sparkles size={18} color="#191919" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#8A8176', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Customer Experience Portal
              </span>
            </div>
            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '2.4rem',
              fontWeight: 700,
              color: '#191919'
            }}>
              Welcome, {currentUser?.profile?.display_name || 'Priya Nair'}
            </h1>
            <p style={{ color: '#666', fontSize: '0.95rem' }}>
              Discover looks tailored to your interests: {currentUser?.profile?.fashion_interests?.join(' · ') || 'Old Money · Minimalist · Wedding'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setActiveSubTab('recommendations')}
              style={{
                background: '#191919',
                color: '#FFFFFF',
                padding: '12px 22px',
                borderRadius: '999px',
                fontWeight: 600,
                fontSize: '0.88rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 15px rgba(25,25,25,0.15)'
              }}
            >
              <Sparkles size={16} color="#d4af37" />
              <span>Explore Style Recommendations</span>
            </button>
          </div>
        </div>

        {/* Customer Portal Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '12px',
          marginBottom: '2rem',
          borderBottom: '1px solid #EAE8E3'
        }}>
          {[
            { id: 'dashboard', label: 'My Style Hub', icon: TrendingUp },
            { id: 'recommendations', label: 'Color & Fabric Guide', icon: Sparkles },
            { id: 'wardrobe', label: 'Digital Wardrobe & Outfits', icon: Shirt },
            { id: 'rentals', label: 'My Rentals & Event Passes', icon: Ticket },
            { id: 'feed', label: 'Fashion Social Feed', icon: Compass },
            { id: 'stylists', label: 'Creative & Beauty Talent', icon: Scissors },
            { id: 'collections', label: 'Saved Collections', icon: Bookmark },
            { id: 'bookings', label: 'Stylist Consultations', icon: Calendar },
            { id: 'settings', label: 'Account & Interests', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: '999px',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  border: active ? '1px solid #191919' : '1px solid #EAE8E3',
                  background: active ? '#191919' : '#FFFFFF',
                  color: active ? '#FFFFFF' : '#666',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: active ? '0 4px 12px rgba(25,25,25,0.12)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ----------------- 1. MY STYLE HUB (DASHBOARD) ----------------- */}
        {activeSubTab === 'dashboard' && (
          <div>
            {/* Profile Completion Strip */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '22px',
              padding: '20px 24px',
              border: '1px solid #EAE8E3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '2rem'
            }}>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#191919', marginBottom: '2px' }}>
                  Style Profile: 85% Complete
                </div>
                <div style={{ fontSize: '0.82rem', color: '#8A8176' }}>
                  Add your exact sizing and shoe preferences for 1-click tailored suggestions.
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '140px', height: '8px', background: '#EAE8E3', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: '85%', height: '100%', background: '#191919' }} />
                </div>
                <button
                  onClick={() => setActiveSubTab('settings')}
                  style={{
                    background: '#F7F5F0',
                    color: '#191919',
                    border: '1px solid #EAE8E3',
                    borderRadius: '999px',
                    padding: '8px 16px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Complete Profile
                </button>
              </div>
            </div>

            {/* Recommended Looks & Flagship Spotlight */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: '20px',
              marginBottom: '2.5rem'
            }}>
              {/* Style Recommendations Spotlight */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                padding: '24px',
                border: '1px solid #EAE8E3',
                position: 'relative'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#B85D43' }}>Editorial & Stylist Curated</span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#191919' }}>Color & Fabric Recommendations</h3>
                  </div>
                  <button
                    onClick={() => setActiveSubTab('recommendations')}
                    style={{
                      background: '#191919',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '999px',
                      padding: '8px 18px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Explore Guide
                  </button>
                </div>

                <div style={{ position: 'relative', borderRadius: '18px', overflow: 'hidden', height: '240px' }}>
                  <img
                    src="/images/pink_tweed_coat.jpg"
                    alt="Fashion Recommendations"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    background: 'rgba(255,255,255,0.92)',
                    backdropFilter: 'blur(8px)',
                    padding: '8px 14px',
                    borderRadius: '14px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: '#141414'
                  }}>
                    Color Palette & Material Analysis Active
                  </div>
                </div>
              </div>

              {/* Suggested Stylists Nearby */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                padding: '24px',
                border: '1px solid #EAE8E3'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#8A8176' }}>Top Rated in Your City</span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#191919' }}>Suggested Personal Stylists</h3>
                  </div>
                  <button
                    onClick={() => setActiveSubTab('stylists')}
                    style={{ background: 'none', border: 'none', color: '#8A8176', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}
                  >
                    View All
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {stylists.slice(0, 3).map((st) => (
                    <div
                      key={st.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px',
                        borderRadius: '16px',
                        background: '#F7F5F0',
                        border: '1px solid #EAE8E3'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={st.user?.avatar_url || '/images/stylist_editorial.jpg'}
                          alt={st.user?.display_name}
                          style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.currentTarget.src = '/images/stylist_editorial.jpg';
                          }}
                        />
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#191919' }}>{st.user?.display_name}</div>
                          <div style={{ fontSize: '0.78rem', color: '#8A8176' }}>{st.category} · ★ {st.rating || 5.0}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => onOpenBooking(st)}
                        style={{
                          background: '#191919',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '999px',
                          padding: '6px 14px',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Book
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Saved Collections Showcase */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#191919', fontFamily: "'Playfair Display', Georgia, serif" }}>
                  My Saved Style Collections
                </h3>
                <button
                  onClick={() => setActiveSubTab('collections')}
                  style={{ background: 'none', border: 'none', color: '#8A8176', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Manage Boards
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                {savedBoards.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => setActiveSubTab('collections')}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      border: '1px solid #EAE8E3',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ height: '140px', overflow: 'hidden' }}>
                      <img
                        src={b.cover}
                        alt={b.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.currentTarget.src = '/images/hero_editorial.jpg';
                        }}
                      />
                    </div>
                    <div style={{ padding: '14px' }}>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#191919' }}>{b.title}</div>
                      <div style={{ fontSize: '0.78rem', color: '#8A8176', marginTop: '2px' }}>{b.itemsCount} curated garments</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ----------------- 2. COLOR & FABRIC RECOMMENDATIONS ----------------- */}
        {activeSubTab === 'recommendations' && (
          <FashionRecommendationsView
            onOpenBooking={onOpenBooking}
            onSaveToCollection={(item) => {
              setSavedBoards(prev => [
                ...prev,
                {
                  id: 'board-rec-' + Date.now(),
                  title: item.title,
                  itemsCount: 1,
                  cover: '/images/pink_tweed_coat.jpg',
                  tag: 'Curated Look'
                }
              ]);
            }}
          />
        )}

        {/* ----------------- 2.5. DIGITAL WARDROBE & CAPSULE OUTFITS (Section 7) ----------------- */}
        {activeSubTab === 'wardrobe' && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '2rem'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Shirt size={18} color="#191919" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#8A8176', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Section 7 · Personal Wardrobe Management
                  </span>
                </div>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '2.2rem', fontWeight: 700, color: '#191919' }}>
                  Digital Wardrobe & Outfits
                </h2>
                <p style={{ color: '#666', fontSize: '0.9rem', maxWidth: '650px' }}>
                  Digitize your closet, create occasion-ready capsule outfit combinations, and request certified stylist audits to eliminate wardrobe fatigue.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setIsAddPieceOpen(true)}
                  style={{
                    background: '#191919',
                    color: '#FFFFFF',
                    padding: '12px 22px',
                    borderRadius: '999px',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 15px rgba(25,25,25,0.15)'
                  }}
                >
                  <Plus size={16} />
                  <span>Add Wardrobe Piece</span>
                </button>

                <button
                  onClick={() => {
                    const st = stylists[0] || { id: 'stylist-maya', user: { display_name: 'Maya Nambiar' } };
                    onOpenBooking(st, {
                      id: 'srv-audit',
                      title: 'Professional Wardrobe Audit & Capsule Plan',
                      price: 6500,
                      duration_minutes: 180,
                      service_mode: 'home_visit'
                    });
                  }}
                  style={{
                    background: '#FFFFFF',
                    color: '#191919',
                    padding: '12px 20px',
                    borderRadius: '999px',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    border: '1px solid #EAE8E3',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Sparkles size={15} color="#d4af37" />
                  <span>Request Stylist Wardrobe Audit</span>
                </button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '24px' }}>
              {['All', 'Outerwear', 'Tops', 'Bottoms', 'Eveningwear'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setWardrobeCategory(cat)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '999px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    border: wardrobeCategory === cat ? '1px solid #191919' : '1px solid #EAE8E3',
                    background: wardrobeCategory === cat ? '#191919' : '#FFFFFF',
                    color: wardrobeCategory === cat ? '#FFFFFF' : '#666',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Wardrobe Items Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
              gap: '20px',
              marginBottom: '3rem'
            }}>
              {wardrobeItems
                .filter(item => wardrobeCategory === 'All' || item.category === wardrobeCategory)
                .map((item) => (
                  <div
                    key={item.id}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '22px',
                      overflow: 'hidden',
                      border: '1px solid #EAE8E3',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
                    }}
                  >
                    <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.currentTarget.src = '/images/linen_safari_suit.jpg';
                        }}
                      />
                      <span style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        background: 'rgba(255,255,255,0.92)',
                        backdropFilter: 'blur(6px)',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: '#191919'
                      }}>
                        {item.category}
                      </span>
                    </div>

                    <div style={{ padding: '18px' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#191919', marginBottom: '4px' }}>
                        {item.name}
                      </h3>
                      <div style={{ fontSize: '0.8rem', color: '#8A8176', marginBottom: '10px' }}>
                        {item.material} · {item.color}
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                        {item.occasions?.map((occ: string, i: number) => (
                          <span
                            key={i}
                            style={{
                              background: '#F7F5F0',
                              color: '#666',
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              padding: '2px 8px',
                              borderRadius: '999px'
                            }}
                          >
                            {occ}
                          </span>
                        ))}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #F7F5F0' }}>
                        <span style={{ fontSize: '0.75rem', color: '#8A8176' }}>{item.season}</span>
                        <button
                          onClick={() => {
                            setWardrobeItems(wardrobeItems.filter(w => w.id !== item.id));
                            showToast(`"${item.name}" removed from wardrobe.`);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#C62828',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Trash2 size={13} />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Saved Capsule Outfits Combinations */}
            <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '28px', border: '1px solid #EAE8E3', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.6rem', fontWeight: 700, color: '#191919' }}>
                    Curated Capsule Outfit Ensembles
                  </h3>
                  <p style={{ color: '#666', fontSize: '0.85rem' }}>
                    Complete silhouettes assembled from your digital wardrobe items for planned events and workweeks.
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '20px' }}>
                {outfitCombos.map((combo) => (
                  <div
                    key={combo.id}
                    style={{
                      border: '1px solid #EAE8E3',
                      borderRadius: '18px',
                      overflow: 'hidden',
                      background: '#FDFBF7'
                    }}
                  >
                    <div style={{ height: '180px', overflow: 'hidden' }}>
                      <img
                        src={combo.image}
                        alt={combo.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div style={{ padding: '18px' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, background: '#191919', color: '#FFF', padding: '3px 8px', borderRadius: '999px' }}>
                        {combo.occasion}
                      </span>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#191919', marginTop: '8px', marginBottom: '6px' }}>
                        {combo.name}
                      </h4>
                      <div style={{ fontSize: '0.8rem', color: '#555', marginBottom: '10px' }}>
                        <strong>Ensemble:</strong> {combo.pieces.join(' + ')}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#8A8176', background: '#FFFFFF', padding: '10px', borderRadius: '10px', border: '1px solid #EAE8E3' }}>
                        💡 <em>{combo.stylistNotes}</em>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ----------------- 2.8. FASHION RENTALS & EVENT PASSES (Section 5.8 & 5.9) ----------------- */}
        {activeSubTab === 'rentals' && (
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Ticket size={18} color="#191919" />
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#8A8176', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Section 5.8 & 5.9 · Active Reservations & Passes
                </span>
              </div>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '2.2rem', fontWeight: 700, color: '#191919' }}>
                My Rentals & Event Passes
              </h2>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>
                Monitor high-fashion garment return deadlines, security deposit escrows, and access digital QR admission passes for masterclasses & runway showcases.
              </p>
            </div>

            {/* Section A: Active Garment Rentals */}
            <div style={{ marginBottom: '3rem' }}>
              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.5rem', fontWeight: 700, color: '#191919', marginBottom: '14px' }}>
                Active Garment Rentals (Escrow Protected)
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {customerRentals.map((rnt) => (
                  <div
                    key={rnt.id}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '22px',
                      padding: '20px',
                      border: '1px solid #EAE8E3',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '16px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <img
                        src={rnt.image}
                        alt={rnt.garment_title}
                        style={{ width: '80px', height: '90px', borderRadius: '14px', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#191919' }}>
                          {rnt.garment_title}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: '#8A8176', marginTop: '2px' }}>
                          {rnt.boutique} · <strong>{rnt.rental_period}</strong>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#191919', marginTop: '4px' }}>
                          📅 Return Due: <strong>{rnt.return_due}</strong> · Security Deposit: <strong>₹{rnt.security_deposit.toLocaleString()} (Held in Escrow)</strong>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        background: '#E8F5E9',
                        color: '#2E7D32'
                      }}>
                        {rnt.status}
                      </span>
                      <button
                        onClick={() => showToast(`Return courier pickup scheduled for "${rnt.garment_title}". Courier dispatch partner notified.`)}
                        style={{
                          background: '#191919',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '999px',
                          padding: '10px 18px',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Schedule Return Pickup
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section B: Event Admission Passes */}
            <div>
              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.5rem', fontWeight: 700, color: '#191919', marginBottom: '14px' }}>
                Digital Event & Masterclass Passes
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '20px' }}>
                {customerPasses.map((pass) => (
                  <div
                    key={pass.id}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '22px',
                      padding: '24px',
                      border: '1px solid #EAE8E3',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, background: '#F7F5F0', color: '#8A8176', padding: '3px 10px', borderRadius: '999px' }}>
                          {pass.tier}
                        </span>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#2E7D32' }}>
                          ● {pass.status}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#191919', marginBottom: '6px' }}>
                        {pass.event_title}
                      </h4>
                      <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '4px' }}>
                        📅 {pass.date}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#8A8176', marginBottom: '16px' }}>
                        📍 {pass.venue}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #F7F5F0' }}>
                      <div style={{ fontSize: '0.78rem', color: '#191919', fontFamily: 'monospace' }}>
                        {pass.ticket_code}
                      </div>
                      <button
                        onClick={() => setQrPassModalItem(pass)}
                        style={{
                          background: '#191919',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '999px',
                          padding: '8px 16px',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <QrCode size={14} />
                        <span>View QR Ticket</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ----------------- 3. FASHION SOCIAL FEED ----------------- */}
        {activeSubTab === 'feed' && (
          <FeedView
            posts={posts}
            onLike={onLikePost || (() => {})}
            onSave={onSavePost || (() => {})}
            onAddComment={() => {}}
            onBookStylist={(stylistId) => {
              const st = stylists.find(s => s.id === stylistId) || stylists[0];
              if (st) onOpenBooking(st);
            }}
            selectedCategory={feedCategory}
            setSelectedCategory={setFeedCategory}
          />
        )}

        {/* ----------------- 4. FIND PERSONAL STYLISTS ----------------- */}
        {activeSubTab === 'stylists' && (
          <StylistsView
            stylists={stylists}
            onOpenBooking={onOpenBooking}
            selectedCity={custStylistCity}
            setSelectedCity={setCustStylistCity}
          />
        )}

        {/* ----------------- 5. SAVED COLLECTIONS ----------------- */}
        {activeSubTab === 'collections' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.8rem', fontWeight: 700, color: '#191919' }}>
                Saved Outfit Collections
              </h2>
              <p style={{ color: '#666', fontSize: '0.88rem' }}>
                Organize your mood boards, shopping wishlists, and wedding inspiration into distinct collections.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {savedBoards.map((b) => (
                <div
                  key={b.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '22px',
                    overflow: 'hidden',
                    border: '1px solid #EAE8E3',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
                  }}
                >
                  <div style={{ height: '180px', overflow: 'hidden' }}>
                    <img
                      src={b.cover}
                      alt={b.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.currentTarget.src = '/images/hero_editorial.jpg';
                      }}
                    />
                  </div>
                  <div style={{ padding: '18px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, background: '#F7F5F0', padding: '3px 8px', borderRadius: '999px', color: '#8A8176' }}>
                      {b.tag}
                    </span>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#191919', marginTop: '8px', marginBottom: '4px' }}>
                      {b.title}
                    </h3>
                    <div style={{ fontSize: '0.82rem', color: '#666', marginBottom: '14px' }}>
                      {b.itemsCount} garments saved from feeds & boutiques
                    </div>
                    <button
                      onClick={() => alert(`Opening collection board "${b.title}"`)}
                      style={{
                        background: '#191919',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '999px',
                        padding: '8px 18px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      View Board
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------- 6. MY BOOKINGS MANAGEMENT ----------------- */}
        {activeSubTab === 'bookings' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.8rem', fontWeight: 700, color: '#191919' }}>
                My Stylist Consultations & Appointments
              </h2>
              <p style={{ color: '#666', fontSize: '0.88rem' }}>
                Track upcoming virtual consultations, in-person wardrobe audits, and payment confirmations.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {customerBookings.map((b) => (
                <div
                  key={b.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '20px',
                    padding: '20px',
                    border: '1px solid #EAE8E3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '14px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <img
                      src={b.stylist_avatar || '/images/stylist_editorial.jpg'}
                      alt={b.stylist_name}
                      style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.currentTarget.src = '/images/stylist_editorial.jpg';
                      }}
                    />
                    <div>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: '#191919' }}>{b.stylist_name}</div>
                      <div style={{ fontSize: '0.85rem', color: '#8A8176' }}>{b.service_title}</div>
                      <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '2px' }}>
                        📅 {b.booking_date} at {b.booking_time} · 📍 {b.city}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#191919' }}>₹{b.total_amount?.toLocaleString()}</div>
                      <span style={{
                        display: 'inline-block',
                        padding: '3px 10px',
                        borderRadius: '999px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        background: b.status === 'confirmed' ? '#E8F5E9' : '#FFF8E1',
                        color: b.status === 'confirmed' ? '#2E7D32' : '#F57F17'
                      }}>
                        {b.status}
                      </span>
                    </div>

                    <button
                      onClick={onOpenMessages}
                      style={{
                        background: '#F7F5F0',
                        color: '#191919',
                        border: '1px solid #EAE8E3',
                        borderRadius: '999px',
                        padding: '8px 16px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Message Stylist
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------- 7. SETTINGS ----------------- */}
        {activeSubTab === 'settings' && (
          <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '30px', border: '1px solid #EAE8E3', maxWidth: '650px' }}>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.8rem', fontWeight: 700, marginBottom: '8px' }}>
              Customer Style Preferences & Security
            </h2>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '24px' }}>
              Manage your fashion aesthetic tags, notification channels, and shipping addresses.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#191919', display: 'block', marginBottom: '6px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue={currentUser?.profile?.display_name || 'Priya Nair'}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #EAE8E3' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#191919', display: 'block', marginBottom: '6px' }}>
                  Home City
                </label>
                <input
                  type="text"
                  defaultValue={currentUser?.profile?.city || 'Kochi'}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #EAE8E3' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#191919', display: 'block', marginBottom: '6px' }}>
                  Preferred Aesthetic Categories (comma separated)
                </label>
                <input
                  type="text"
                  defaultValue="Old Money, Minimalist, Wedding & Occasion"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #EAE8E3' }}
                />
              </div>

              <button
                onClick={() => alert('Customer preferences saved!')}
                style={{
                  background: '#191919',
                  color: '#FFFFFF',
                  padding: '12px 24px',
                  borderRadius: '999px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  marginTop: '10px'
                }}
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Add Wardrobe Piece Modal */}
      {isAddPieceOpen && (
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
            maxWidth: '520px',
            width: '100%',
            padding: '28px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.6rem', marginBottom: '6px', color: '#191919' }}>
              Add Garment to Digital Wardrobe
            </h3>
            <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '20px' }}>
              Upload details to catalog your wardrobe for bespoke capsule planning and styling audits.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#191919' }}>Garment Title</label>
                <input
                  type="text"
                  placeholder="e.g. Ivory Wool Double-Breasted Trench"
                  value={newPieceName}
                  onChange={(e) => setNewPieceName(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#191919' }}>Category</label>
                  <select
                    value={newPieceCat}
                    onChange={(e) => setNewPieceCat(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                  >
                    <option value="Outerwear">Outerwear</option>
                    <option value="Tops">Tops</option>
                    <option value="Bottoms">Bottoms</option>
                    <option value="Eveningwear">Eveningwear</option>
                    <option value="Footwear">Footwear</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#191919' }}>Season</label>
                  <select
                    value={newPieceSeason}
                    onChange={(e) => setNewPieceSeason(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                  >
                    <option value="All Season">All Season</option>
                    <option value="Spring / Summer">Spring / Summer</option>
                    <option value="Autumn / Winter">Autumn / Winter</option>
                    <option value="Monsoon / Resort">Monsoon / Resort</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#191919' }}>Fabric / Material</label>
                  <input
                    type="text"
                    value={newPieceMaterial}
                    onChange={(e) => setNewPieceMaterial(e.target.value)}
                    placeholder="e.g. 100% Raw Silk"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#191919' }}>Color / Shade</label>
                  <input
                    type="text"
                    value={newPieceColor}
                    onChange={(e) => setNewPieceColor(e.target.value)}
                    placeholder="e.g. Oatmeal Cream"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#191919' }}>Select Garment Image</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginTop: '6px' }}>
                  {[
                    '/images/linen_safari_suit.jpg',
                    '/images/cashmere_mockneck.jpg',
                    '/images/emerald_silk_gown.jpg',
                    '/images/poplin_skirt_set.jpg'
                  ].map((img, i) => (
                    <div
                      key={i}
                      onClick={() => setNewPieceImage(img)}
                      style={{
                        height: '70px',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: newPieceImage === img ? '2px solid #191919' : '1px solid #EAE8E3'
                      }}
                    >
                      <img src={img} alt="Choice" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setIsAddPieceOpen(false)}
                style={{ background: '#F7F5F0', color: '#191919', border: '1px solid #EAE8E3', borderRadius: '999px', padding: '10px 20px', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!newPieceName.trim()) return;
                  const newItem = {
                    id: 'w-' + Date.now(),
                    name: newPieceName.trim(),
                    category: newPieceCat,
                    color: newPieceColor.trim() || 'Ivory',
                    material: newPieceMaterial.trim() || 'Cotton Blend',
                    season: newPieceSeason,
                    image: newPieceImage,
                    occasions: ['Smart Casual', 'Event']
                  };
                  setWardrobeItems([newItem, ...wardrobeItems]);
                  setNewPieceName('');
                  setIsAddPieceOpen(false);
                  showToast(`"${newItem.name}" added to your digital wardrobe.`);
                }}
                style={{ background: '#191919', color: '#FFFFFF', border: 'none', borderRadius: '999px', padding: '10px 24px', fontWeight: 600, cursor: 'pointer' }}
              >
                Save Garment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Digital QR Ticket Admission Modal */}
      {qrPassModalItem && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '26px',
            maxWidth: '440px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            border: '1px solid #EAE8E3',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            {/* Header Badge */}
            <div style={{ background: '#191919', color: '#FFFFFF', padding: '24px 24px 18px', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#D4AF37', fontWeight: 700 }}>
                  DROBE Official Admission Pass
                </span>
                <span style={{ background: '#D4AF37', color: '#191919', fontSize: '0.68rem', fontWeight: 800, padding: '2px 8px', borderRadius: '999px' }}>
                  {qrPassModalItem.tier}
                </span>
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.4rem', fontWeight: 700, lineHeight: 1.2 }}>
                {qrPassModalItem.event_title}
              </h3>
            </div>

            {/* Ticket Body */}
            <div style={{ padding: '24px' }}>
              <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: '#555', lineHeight: 1.5 }}>
                <div>📅 <strong>{qrPassModalItem.date}</strong></div>
                <div>📍 <strong>{qrPassModalItem.venue}</strong></div>
              </div>

              {/* Simulated QR Code Canvas */}
              <div style={{
                background: '#FDFBF7',
                border: '2px dashed #EAE8E3',
                borderRadius: '18px',
                padding: '20px',
                textAlign: 'center',
                marginBottom: '18px'
              }}>
                <div style={{
                  width: '150px',
                  height: '150px',
                  margin: '0 auto 12px',
                  background: '#FFFFFF',
                  borderRadius: '14px',
                  padding: '12px',
                  border: '1px solid #191919',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                }}>
                  <QrCode size={120} color="#191919" />
                </div>
                <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.95rem', color: '#191919', letterSpacing: '0.08em' }}>
                  {qrPassModalItem.ticket_code}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#8A8176', marginTop: '4px' }}>
                  Scan at venue entrance check-in kiosk for wristband & gift bag
                </div>
              </div>

              <button
                onClick={() => setQrPassModalItem(null)}
                style={{
                  width: '100%',
                  background: '#191919',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '12px',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Toast Notification */}
      {actionToast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#191919',
          color: '#FFFFFF',
          padding: '12px 22px',
          borderRadius: '999px',
          fontSize: '0.85rem',
          fontWeight: 600,
          boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          border: '1px solid rgba(255,255,255,0.15)'
        }}>
          <CheckCircle size={16} color="#81C784" />
          <span>{actionToast}</span>
        </div>
      )}

      </div>
  );
};
