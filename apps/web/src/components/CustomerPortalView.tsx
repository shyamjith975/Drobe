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
  UserCheck
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
    'dashboard' | 'recommendations' | 'feed' | 'discover' | 'stylists' | 'collections' | 'bookings' | 'settings'
  >('dashboard');

  const [feedCategory, setFeedCategory] = useState<string>('All');
  const [custStylistCity, setCustStylistCity] = useState<string>('All');

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
            { id: 'recommendations', label: 'Color & Fabric Recommendations', icon: Sparkles },
            { id: 'feed', label: 'Fashion Social Feed', icon: Compass },
            { id: 'stylists', label: 'Find Personal Stylists', icon: Scissors },
            { id: 'collections', label: 'Saved Collections', icon: Bookmark },
            { id: 'bookings', label: 'My Bookings', icon: Calendar },
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
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px',
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
    </div>
  );
};
