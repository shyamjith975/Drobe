import React, { useState, useEffect } from 'react';
import { 
  Scissors, 
  Calendar, 
  Clock, 
  MapPin, 
  DollarSign, 
  Star, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Edit3, 
  Camera, 
  Layers, 
  TrendingUp, 
  UserCheck, 
  ArrowRight, 
  FileText, 
  ShieldCheck, 
  Sliders, 
  Settings, 
  MessageSquare,
  Upload,
  Check,
  X,
  Sparkles,
  Shirt,
  Eye,
  Bookmark
} from 'lucide-react';
import { api } from '@drobe/api-client';
import { StylingWorkspaceModal } from './StylingWorkspaceModal';

interface ConsultantPortalViewProps {
  currentUser: any;
  onOpenMessages?: () => void;
  onNavigate?: (tab: string) => void;
}

export const ConsultantPortalView: React.FC<ConsultantPortalViewProps> = ({
  currentUser,
  onOpenMessages,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'bookings' | 'services' | 'availability' | 'locations' | 'portfolio' | 'wallet' | 'reviews' | 'settings' | 'styleguides'
  >('dashboard');

  const [isVerified, setIsVerified] = useState<boolean>(
    currentUser?.stylist_profile?.verification_status === 'verified' || currentUser?.profile?.is_verified || false
  );

  // Styling Workspace Modal State (Section 1.D)
  const [selectedBookingForWorkspace, setSelectedBookingForWorkspace] = useState<string | null>(null);
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);

  // Client Style DNA & Wardrobe Modal State (Section 1.A & 1.E)
  const [selectedClientForDna, setSelectedClientForDna] = useState<{ id: string; name: string } | null>(null);
  const [clientDnaProfile, setClientDnaProfile] = useState<any | null>(null);
  const [clientDnaWardrobe, setClientDnaWardrobe] = useState<any | null>(null);
  const [loadingClientDna, setLoadingClientDna] = useState<boolean>(false);

  // Consultant Operating Cities
  const [operatingCities, setOperatingCities] = useState<string[]>([
    'Kozhikode', 'Kochi', 'Bengaluru', 'Thrissur', 'Kannur'
  ]);
  const [allAvailableCities] = useState<string[]>([
    'Kozhikode', 'Kochi', 'Thrissur', 'Kannur', 'Bengaluru', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad', 'Chicago'
  ]);

  // Services State
  const [services, setServices] = useState<any[]>([
    {
      id: 'srv-1',
      title: 'Full Wardrobe Audit & Capsule Styling',
      category: 'Wardrobe Audit',
      mode: 'physical_shopping',
      duration_minutes: 180,
      price: 6500,
      advance_percentage: 50,
      travel_fee: 500,
      cancellation_policy: 'Free cancellation up to 24 hours prior',
      is_active: true
    },
    {
      id: 'srv-2',
      title: 'Virtual Style & Palette Consultation',
      category: 'Virtual Styling',
      mode: 'virtual_consultation',
      duration_minutes: 60,
      price: 2500,
      advance_percentage: 100,
      travel_fee: 0,
      cancellation_policy: 'Reschedule available up to 4 hours prior',
      is_active: true
    },
    {
      id: 'srv-3',
      title: 'Bridal Trousseau & Wedding Day Curation',
      category: 'Wedding Styling',
      mode: 'wedding_assignment',
      duration_minutes: 360,
      price: 18000,
      advance_percentage: 50,
      travel_fee: 1500,
      cancellation_policy: 'Bespoke event policy; 7 days notice required',
      is_active: true
    }
  ]);

  // Bookings State
  const [bookings, setBookings] = useState<any[]>([
    {
      id: 'bk-101',
      customer_name: 'Priya Nair',
      customer_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      service_title: 'Full Wardrobe Audit & Capsule Styling',
      booking_date: '2026-11-06',
      booking_time: '14:00',
      service_mode: 'physical_shopping',
      status: 'confirmed',
      city: 'Kochi',
      notes: 'Need assistance transitioning to minimalist luxury aesthetics for an upcoming corporate leadership summit.',
      reference_images: [
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80'
      ],
      total_amount: 7000,
      advance_amount: 3500,
      paid_amount: 3500
    },
    {
      id: 'bk-102',
      customer_name: 'Aditya Varma',
      customer_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      service_title: 'Virtual Style & Palette Consultation',
      booking_date: '2026-11-08',
      booking_time: '11:00',
      service_mode: 'virtual_consultation',
      status: 'requested',
      city: 'Bengaluru',
      notes: 'Seeking advice on color analysis and bespoke suit fabric pairing.',
      reference_images: [],
      total_amount: 2500,
      advance_amount: 2500,
      paid_amount: 0
    }
  ]);

  // Wallet Ledger State
  const [wallet, setWallet] = useState<any>({
    available_balance: 14200,
    pending_balance: 3500,
    total_earned: 42800,
    ledger: [
      { id: 'tx-1', date: '2026-10-28', desc: 'Completed: Bridal Styling for Ananya Roy', amount: '+₹14,400', type: 'credit' },
      { id: 'tx-2', date: '2026-10-24', desc: 'Bank Transfer Withdrawal (HDFC-**89)', amount: '-₹20,000', type: 'debit' },
      { id: 'tx-3', date: '2026-10-20', desc: 'Advance: Wardrobe Consultation Priya Nair', amount: '+₹2,800', type: 'credit' }
    ]
  });

  // Availability schedule
  const [weeklySchedule, setWeeklySchedule] = useState([
    { day: 'Monday', active: true, slots: '10:00 AM - 6:00 PM' },
    { day: 'Tuesday', active: true, slots: '10:00 AM - 6:00 PM' },
    { day: 'Wednesday', active: true, slots: '10:00 AM - 6:00 PM' },
    { day: 'Thursday', active: true, slots: '10:00 AM - 6:00 PM' },
    { day: 'Friday', active: true, slots: '10:00 AM - 7:00 PM' },
    { day: 'Saturday', active: true, slots: '11:00 AM - 5:00 PM' },
    { day: 'Sunday', active: false, slots: 'Off / Vacation' }
  ]);

  // Modals & New Service States (Section 1.B: 9 Service Formats)
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [newSrvTitle, setNewSrvTitle] = useState('');
  const [newSrvCategory, setNewSrvCategory] = useState('Personal Styling');
  const [newSrvPrice, setNewSrvPrice] = useState('3500');
  const [newSrvDuration, setNewSrvDuration] = useState('60');
  const [newSrvMode, setNewSrvMode] = useState('virtual_consultation');
  const [newSrvFormatType, setNewSrvFormatType] = useState('remote_video_consultation');
  const [newSrvDeliverables, setNewSrvDeliverables] = useState('Personalized Lookbook PDF, 5 Shoppable Garment Links, Color Harmony Card');
  const [newSrvCancellation, setNewSrvCancellation] = useState('Free cancellation up to 24 hours prior');
  const [newSrvInstantBooking, setNewSrvInstantBooking] = useState(true);

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('10000');
  const [withdrawAccount, setWithdrawAccount] = useState('maya.nambiar@upi');

  // Load live data from Backend API
  useEffect(() => {
    api.bookings.list()
      .then((bks) => {
        if (bks && bks.length > 0) setBookings(bks);
      })
      .catch((err) => console.log('Bookings fallback:', err));

    const stylistId = currentUser?.stylist_profile?.id;
    if (stylistId) {
      api.stylists.get(stylistId)
        .then((data) => {
          if (data?.services && data.services.length > 0) {
            setServices(data.services.map((s: any) => ({
              id: s.id,
              title: s.title,
              category: s.category,
              mode: s.service_mode,
              format_type: s.format_type,
              duration_minutes: s.duration_minutes,
              price: s.price,
              advance_percentage: s.advance_percentage,
              travel_fee: s.travel_fee,
              deliverables: s.deliverables,
              cancellation_policy: s.cancellation_policy,
              is_active: s.is_active
            })));
          }
        })
        .catch((err) => console.log('Services fallback:', err));
    }

    api.payments.getWallet()
      .then((w) => {
        if (w) setWallet(w);
      })
      .catch((err) => console.log('Wallet fallback:', err));
  }, [currentUser]);

  const handleOpenClientDna = async (customerId: string, customerName: string) => {
    setSelectedClientForDna({ id: customerId, name: customerName });
    setLoadingClientDna(true);
    try {
      const profile = await api.styleProfile.getUser(customerId);
      setClientDnaProfile(profile);
    } catch {
      setClientDnaProfile({
        selfie_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        style_personalities: ['Classic Minimalist', 'Old Money Heritage'],
        face_shape: 'Oval',
        body_structure: 'Hourglass',
        height_cm: 168,
        sizes: { top: 'M', bottom: '30', dress: 'UK 10', shoes: 'UK 6' },
        fit_preferences: ['Tailored', 'Relaxed Drape'],
        lifestyle_activities: ['Corporate Executive', 'Festive Celebrations'],
        skin_undertone: 'Warm',
        favorite_colors: ['#191919', '#F7F5F0', '#1B4D3E', '#D4AF37'],
        fabrics_preferred: ['Mulberry Silk', 'Mongolian Cashmere', 'Belgian Linen'],
        fabrics_avoided: ['Polyester', 'Acrylic'],
        notes_for_stylist: 'Prefers natural breathable textiles and clean shoulder lines.'
      });
    }

    try {
      const wardrobe = await api.wardrobe.getClientWardrobe(customerId);
      setClientDnaWardrobe(wardrobe);
    } catch {
      setClientDnaWardrobe({
        items: [
          { id: 'w-1', name: 'Oatmeal Double-Breasted Linen Blazer', category: 'Outerwear', color: 'Oatmeal', material: 'Belgian Linen', image_url: '/images/linen_safari_suit.jpg' },
          { id: 'w-2', name: 'Charcoal Cashmere Mockneck Knit', category: 'Tops', color: 'Midnight Charcoal', material: 'Mongolian Cashmere', image_url: '/images/cashmere_mockneck.jpg' }
        ],
        gaps: [
          { id: 'gap-1', title: 'Double-Faced Camel Hair Overcoat', category: 'Outerwear', priority: 'High', notes: 'Needed for winter business summits.' }
        ]
      });
    } finally {
      setLoadingClientDna(false);
    }
  };

  const handleBookingAction = (bookingId: string, newStatus: string) => {
    setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
    alert(`Booking status updated to ${newStatus}`);
  };

  const handleSaveService = async () => {
    if (!newSrvTitle.trim()) return;
    const deliverablesList = newSrvDeliverables.split(',').map(d => d.trim()).filter(Boolean);
    const payload = {
      title: newSrvTitle,
      description: `Professional styling session: ${newSrvTitle}`,
      category: newSrvCategory,
      service_mode: newSrvMode,
      format_type: newSrvFormatType,
      deliverables: deliverablesList,
      duration_minutes: parseInt(newSrvDuration) || 60,
      price: parseFloat(newSrvPrice) || 0,
      advance_percentage: 50,
      travel_fee: newSrvMode === 'virtual_consultation' || newSrvMode === 'emergency_call_15min' ? 0 : 500,
      cancellation_policy: newSrvCancellation,
      instant_booking_available: newSrvInstantBooking,
      is_active: true
    };

    const stylistId = currentUser?.stylist_profile?.id;
    if (stylistId) {
      try {
        const created = await api.stylists.addService(stylistId, payload);
        setServices(prev => [...prev, created]);
        setIsServiceModalOpen(false);
        alert('Service offering published to DROBE marketplace!');
        return;
      } catch (err: any) {
        console.log('API service add fallback:', err);
      }
    }

    setServices(prev => [...prev, { ...payload, id: `srv-${Date.now()}` }]);
    setIsServiceModalOpen(false);
    alert('Service offering saved!');
  };

  const handleWithdraw = () => {
    const amt = parseFloat(withdrawAmount) || 0;
    if (amt > wallet.available_balance) {
      alert('Withdrawal amount exceeds available balance.');
      return;
    }
    setWallet({
      ...wallet,
      available_balance: wallet.available_balance - amt,
      ledger: [
        {
          id: `tx-${Date.now()}`,
          date: '2026-11-01',
          desc: `Withdrawal to ${withdrawAccount}`,
          amount: `-₹${amt.toLocaleString()}`,
          type: 'debit'
        },
        ...wallet.ledger
      ]
    });
    setIsWithdrawModalOpen(false);
    alert(`Withdrawal request of ₹${amt.toLocaleString()} submitted for admin processing.`);
  };

  return (
    <div className="consultant-portal-container w-full max-w-full overflow-x-hidden min-h-[90vh] bg-[#F7F5F0] p-3 sm:p-6 lg:p-8 pb-28 sm:pb-20">
      <div className="max-w-[1280px] mx-auto w-full">

        {/* Portal Header & Verification Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Scissors size={18} color="#191919" />
              <span className="text-xs font-semibold text-[#8A8176] uppercase tracking-wider">
                Stylist & Fashion Consultant Portal
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#191919]">
              {currentUser?.profile?.display_name || 'Maya Nambiar'}
            </h1>
            <p className="text-xs sm:text-sm text-[#666] mt-1">
              {currentUser?.stylist_profile?.category || 'Bridal & Occasion Stylist'} · Base City: {currentUser?.stylist_profile?.base_city || 'Kochi'}
            </p>
          </div>

          {/* Three-Tier Credibility Verification Badges (Section 1.C) */}
          <div className="flex items-center gap-2 flex-wrap">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '999px',
              background: '#E8F5E9',
              border: '1px solid #A5D6A7',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#1B5E20'
            }} title="Government KYC & Identity Verified">
              <ShieldCheck size={14} color="#2E7D32" />
              <span>Govt ID Verified</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '999px',
              background: '#E3F2FD',
              border: '1px solid #90CAF9',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#0D47A1'
            }} title="Degree & Fashion Institute Certified (NIFT / London College of Fashion)">
              <CheckCircle size={14} color="#1565C0" />
              <span>Institute Certified</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '999px',
              background: '#FFF8E1',
              border: '1px solid #FFE082',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#B78103'
            }} title="DROBE Live Editorial Assessment Passed">
              <Sparkles size={14} color="#D4AF37" />
              <span>DROBE Skill Assessed</span>
            </div>

            <span style={{
              padding: '6px 14px',
              borderRadius: '999px',
              background: '#191919',
              color: '#D4AF37',
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}>
              DROBE Master Stylist · Elite Certified
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6 sm:mb-8 border-b border-[#EAE8E3] w-full">
          {[
            { id: 'dashboard', label: 'Consultant Dashboard', icon: TrendingUp },
            { id: 'styleguides', label: 'Client Style Guides', icon: Sparkles },
            { id: 'bookings', label: 'Client Bookings', icon: Calendar },
            { id: 'services', label: 'Service Offerings', icon: Scissors },
            { id: 'availability', label: 'Calendar & Slots', icon: Clock },
            { id: 'locations', label: 'Service Cities', icon: MapPin },
            { id: 'portfolio', label: 'Portfolio & Transformations', icon: Camera },
            { id: 'wallet', label: 'Earnings & Wallet', icon: DollarSign },
            { id: 'reviews', label: 'Client Reviews', icon: Star },
            { id: 'settings', label: 'Profile Settings', icon: Settings }
          ].map((tabItem) => {
            const Icon = tabItem.icon;
            const active = activeTab === tabItem.id;
            return (
              <button
                key={tabItem.id}
                onClick={() => setActiveTab(tabItem.id as any)}
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold shrink-0 cursor-pointer transition-all border ${
                  active
                    ? 'bg-[#191919] text-white border-[#191919] shadow-sm'
                    : 'bg-white text-[#191919] border-[#EAE8E3] hover:border-[#191919] shadow-xs'
                }`}
              >
                <Icon size={15} />
                <span className="whitespace-nowrap">{tabItem.label}</span>
              </button>
            );
          })}
        </div>

        {/* ----------------- 1. DASHBOARD ----------------- */}
        {activeTab === 'dashboard' && (
          <div>
            {/* KPI Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
              gap: '16px',
              marginBottom: '2rem'
            }}>
              {[
                { title: 'Total Profile Views', value: '18,920', sub: '+24% this month' },
                { title: 'Confirmed Bookings', value: '38', sub: '2 upcoming this week' },
                { title: 'Pending Requests', value: String(bookings.filter(b => b.status === 'requested').length), sub: 'Action required' },
                { title: 'Available Wallet', value: `₹${wallet.available_balance.toLocaleString()}`, sub: 'Instant payout ready' },
                { title: 'Client Rating', value: '5.0 ★', sub: '24 verified reviews' }
              ].map((card, i) => (
                <div
                  key={i}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '20px',
                    padding: '20px',
                    border: '1px solid #EAE8E3',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
                  }}
                >
                  <div style={{ fontSize: '0.8rem', color: '#8A8176', fontWeight: 600, marginBottom: '6px' }}>{card.title}</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#191919', fontFamily: "'Playfair Display', Georgia, serif" }}>
                    {card.value}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#2E7D32', fontWeight: 600, marginTop: '4px' }}>
                    {card.sub}
                  </div>
                </div>
              ))}
            </div>

            {/* Upcoming Appointments Strip */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '24px',
              border: '1px solid #EAE8E3',
              marginBottom: '2rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#191919' }}>Upcoming Styling Appointments</h3>
                <button
                  onClick={() => setActiveTab('bookings')}
                  style={{ background: 'none', border: 'none', color: '#8A8176', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  View All ({bookings.length})
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {bookings.map((b) => (
                  <div
                    key={b.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px',
                      borderRadius: '16px',
                      background: '#F7F5F0',
                      border: '1px solid #EAE8E3',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <img
                        src={b.customer_avatar || '/images/stylist_editorial.jpg'}
                        alt={b.customer_name}
                        style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.currentTarget.src = '/images/stylist_editorial.jpg';
                        }}
                      />
                      <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#191919' }}>{b.customer_name}</div>
                        <div style={{ fontSize: '0.82rem', color: '#8A8176' }}>{b.service_title}</div>
                        <div style={{ fontSize: '0.78rem', color: '#666', marginTop: '2px' }}>
                          📅 {b.booking_date} at {b.booking_time} · 📍 {b.city}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        background: b.status === 'confirmed' ? '#E8F5E9' : '#FFF8E1',
                        color: b.status === 'confirmed' ? '#2E7D32' : '#F57F17'
                      }}>
                        {b.status}
                      </span>
                      {b.status === 'requested' && (
                        <button
                          onClick={() => handleBookingAction(b.id, 'confirmed')}
                          style={{
                            background: '#191919',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '999px',
                            padding: '6px 14px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Accept Request
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ----------------- 2. CLIENT BOOKINGS MANAGEMENT ----------------- */}
        {activeTab === 'bookings' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.8rem', fontWeight: 700, color: '#191919' }}>
                  Client Appointments & Requests
                </h2>
                <p style={{ color: '#666', fontSize: '0.88rem' }}>
                  Review client requirements, uploaded reference images, accept bookings, or suggest alternative dates.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {bookings.map((b) => (
                <div
                  key={b.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '24px',
                    padding: '24px',
                    border: '1px solid #EAE8E3',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <img
                        src={b.customer_avatar || '/images/stylist_editorial.jpg'}
                        alt={b.customer_name}
                        style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.currentTarget.src = '/images/stylist_editorial.jpg';
                        }}
                      />
                      <div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#191919' }}>{b.customer_name}</h3>
                        <div style={{ fontSize: '0.85rem', color: '#8A8176' }}>{b.service_title}</div>
                        <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '4px' }}>
                          Date: <strong>{b.booking_date}</strong> at <strong>{b.booking_time}</strong> · Location: <strong>{b.city}</strong>
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#191919' }}>₹{b.total_amount?.toLocaleString()}</div>
                      <div style={{ fontSize: '0.78rem', color: '#2E7D32' }}>Advance Paid: ₹{b.paid_amount?.toLocaleString()}</div>
                      <span style={{
                        display: 'inline-block',
                        marginTop: '6px',
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
                  </div>

                  {/* Client Style Notes */}
                  <div style={{
                    background: '#F7F5F0',
                    borderRadius: '14px',
                    padding: '14px',
                    marginBottom: '16px',
                    fontSize: '0.85rem',
                    color: '#444'
                  }}>
                    <strong>Client Style Notes:</strong> "{b.notes}"
                  </div>

                  {/* Reference Images */}
                  {b.reference_images?.length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#8A8176', marginBottom: '8px' }}>
                        Client Uploaded Reference Outfits:
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        {b.reference_images.map((img: string, idx: number) => (
                          <img
                            key={idx}
                            src={img || '/images/hero_editorial.jpg'}
                            alt="Reference"
                            style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' }}
                            onError={(e) => {
                              e.currentTarget.src = '/images/hero_editorial.jpg';
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', borderTop: '1px solid #EAE8E3', paddingTop: '16px' }}>
                    {b.status === 'requested' && (
                      <>
                        <button
                          onClick={() => handleBookingAction(b.id, 'confirmed')}
                          style={{
                            background: '#191919',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '999px',
                            padding: '10px 20px',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            cursor: 'pointer'
                          }}
                        >
                          Confirm & Accept Appointment
                        </button>
                        <button
                          onClick={() => {
                            const newDate = prompt('Suggest alternative date (YYYY-MM-DD):', '2026-11-10');
                            if (newDate) handleBookingAction(b.id, `rescheduled_to_${newDate}`);
                          }}
                          style={{
                            background: '#FFFFFF',
                            color: '#191919',
                            border: '1px solid #EAE8E3',
                            borderRadius: '999px',
                            padding: '10px 18px',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            cursor: 'pointer'
                          }}
                        >
                          Suggest Alternative Date
                        </button>
                      </>
                    )}

                    {/* Styling Workspace & Style DNA Action Buttons (Section 1.D & 1.A) */}
                    <button
                      onClick={() => {
                        setSelectedBookingForWorkspace(b.id);
                        setIsWorkspaceModalOpen(true);
                      }}
                      style={{
                        background: '#191919',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '999px',
                        padding: '10px 18px',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 10px rgba(25,25,25,0.15)'
                      }}
                    >
                      <Sparkles size={15} color="#D4AF37" />
                      <span>Open Styling Workspace</span>
                    </button>

                    <button
                      onClick={() => handleOpenClientDna(b.customer_id || 'cust-demo', b.customer_name)}
                      style={{
                        background: '#FFFFFF',
                        color: '#191919',
                        border: '1.5px solid #191919',
                        borderRadius: '999px',
                        padding: '10px 18px',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <UserCheck size={15} />
                      <span>Client Style DNA</span>
                    </button>

                    {b.status === 'confirmed' && (
                      <button
                        onClick={() => handleBookingAction(b.id, 'completed')}
                        style={{
                          background: '#2E7D32',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '999px',
                          padding: '10px 20px',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          cursor: 'pointer'
                        }}
                      >
                        Mark Consultation Completed
                      </button>
                    )}

                    <button
                      onClick={onOpenMessages}
                      style={{
                        background: '#FFFFFF',
                        color: '#191919',
                        border: '1.5px solid #EAE8E3',
                        borderRadius: '999px',
                        padding: '10px 18px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Message Client
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------- 3. SERVICE OFFERINGS (CRUD) ----------------- */}
        {activeTab === 'services' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.8rem', fontWeight: 700, color: '#191919' }}>
                  Professional Styling Services
                </h2>
                <p style={{ color: '#666', fontSize: '0.88rem' }}>
                  Define your virtual consultations, in-person shopping visits, wardrobe audits, and bridal trousseau packages.
                </p>
              </div>
              <button
                onClick={() => setIsServiceModalOpen(true)}
                style={{
                  background: '#191919',
                  color: '#FFFFFF',
                  padding: '12px 22px',
                  borderRadius: '999px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Plus size={16} />
                <span>Create Service</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '20px' }}>
              {services.map((srv) => (
                <div
                  key={srv.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '22px',
                    padding: '24px',
                    border: '1px solid #EAE8E3',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <span style={{
                        background: '#F7F5F0',
                        color: '#8A8176',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        padding: '4px 10px',
                        borderRadius: '999px'
                      }}>
                        {srv.category}
                      </span>
                      <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#191919' }}>
                        ₹{srv.price.toLocaleString()}
                      </div>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#191919', marginBottom: '8px' }}>
                      {srv.title}
                    </h3>
                    <div style={{ fontSize: '0.82rem', color: '#666', lineHeight: 1.5, marginBottom: '16px' }}>
                      Duration: <strong>{srv.duration_minutes} mins</strong> · Advance Required: <strong>{srv.advance_percentage}%</strong>
                      {srv.travel_fee > 0 && <span> · Travel Fee: ₹{srv.travel_fee}</span>}
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '16px',
                    borderTop: '1px solid #EAE8E3'
                  }}>
                    <span style={{ fontSize: '0.78rem', color: '#2E7D32', fontWeight: 600 }}>
                      ● Active for Booking
                    </span>
                    <button
                      onClick={() => setServices(services.filter(s => s.id !== srv.id))}
                      style={{
                        background: '#FEEBEE',
                        border: '1px solid #FFCDD2',
                        borderRadius: '8px',
                        padding: '6px 10px',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={13} color="#C62828" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------- 4. SERVICE CITIES (MULTI-LOCATION) ----------------- */}
        {activeTab === 'locations' && (
          <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '30px', border: '1px solid #EAE8E3', maxWidth: '750px' }}>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.8rem', fontWeight: 700, marginBottom: '8px' }}>
              Service Operating Locations
            </h2>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '24px' }}>
              Select multiple cities where clients can discover you for physical consultations, wedding trousseaus, and home audits.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '24px' }}>
              {allAvailableCities.map((city) => {
                const isSelected = operatingCities.includes(city);
                return (
                  <button
                    key={city}
                    onClick={() => {
                      if (isSelected) {
                        setOperatingCities(operatingCities.filter(c => c !== city));
                      } else {
                        setOperatingCities([...operatingCities, city]);
                      }
                    }}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '999px',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      border: isSelected ? '1px solid #191919' : '1px solid #EAE8E3',
                      background: isSelected ? '#191919' : '#FFFFFF',
                      color: isSelected ? '#FFFFFF' : '#666',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <MapPin size={14} />
                    <span>{city}</span>
                    {isSelected && <Check size={14} />}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => alert(`Saved operating locations: ${operatingCities.join(', ')}`)}
              style={{
                background: '#191919',
                color: '#FFFFFF',
                padding: '12px 24px',
                borderRadius: '999px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Save Service Cities
            </button>
          </div>
        )}

        {/* ----------------- 5. AVAILABILITY & CALENDAR ----------------- */}
        {activeTab === 'availability' && (
          <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '30px', border: '1px solid #EAE8E3', maxWidth: '750px' }}>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.8rem', fontWeight: 700, marginBottom: '8px' }}>
              Weekly Calendar & Slot Schedule
            </h2>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '24px' }}>
              Define active appointment hours, buffer between clients, and instant booking rules. Overlapping confirmed appointments are automatically prevented.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {weeklySchedule.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '14px 18px',
                    borderRadius: '14px',
                    background: item.active ? '#F7F5F0' : '#FAFAFA',
                    border: '1px solid #EAE8E3'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input
                      type="checkbox"
                      checked={item.active}
                      onChange={(e) => {
                        const updated = [...weeklySchedule];
                        updated[idx].active = e.target.checked;
                        setWeeklySchedule(updated);
                      }}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#191919' }}>{item.day}</span>
                  </div>
                  <input
                    type="text"
                    value={item.slots}
                    onChange={(e) => {
                      const updated = [...weeklySchedule];
                      updated[idx].slots = e.target.value;
                      setWeeklySchedule(updated);
                    }}
                    disabled={!item.active}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #EAE8E3',
                      fontSize: '0.85rem',
                      width: '200px'
                    }}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={() => alert('Availability schedule saved successfully!')}
              style={{
                background: '#191919',
                color: '#FFFFFF',
                padding: '12px 24px',
                borderRadius: '999px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Save Calendar Schedule
            </button>
          </div>
        )}

        {/* ----------------- 6. WALLET & EARNINGS ----------------- */}
        {activeTab === 'wallet' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.8rem', fontWeight: 700, color: '#191919' }}>
                  Professional Wallet & Ledger
                </h2>
                <p style={{ color: '#666', fontSize: '0.88rem' }}>
                  Transparent financial ledger tracking client payments, platform commission (20%), and bank transfers.
                </p>
              </div>
              <button
                onClick={() => setIsWithdrawModalOpen(true)}
                style={{
                  background: '#191919',
                  color: '#FFFFFF',
                  padding: '12px 24px',
                  borderRadius: '999px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Request Payout
              </button>
            </div>

            {/* Balances */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
              gap: '16px',
              marginBottom: '2rem'
            }}>
              <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '20px', border: '1px solid #EAE8E3' }}>
                <div style={{ fontSize: '0.8rem', color: '#8A8176' }}>Available Balance</div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#191919', fontFamily: "'Playfair Display', Georgia, serif" }}>
                  ₹{wallet.available_balance.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#2E7D32', fontWeight: 600 }}>Ready for withdrawal</div>
              </div>

              <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '20px', border: '1px solid #EAE8E3' }}>
                <div style={{ fontSize: '0.8rem', color: '#8A8176' }}>Pending Balance</div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#191919', fontFamily: "'Playfair Display', Georgia, serif" }}>
                  ₹{wallet.pending_balance.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#8A8176' }}>Held in escrow until completion</div>
              </div>

              <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '20px', border: '1px solid #EAE8E3' }}>
                <div style={{ fontSize: '0.8rem', color: '#8A8176' }}>Total Career Earnings</div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#191919', fontFamily: "'Playfair Display', Georgia, serif" }}>
                  ₹{wallet.total_earned.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#8A8176' }}>Verified ledger entries</div>
              </div>
            </div>

            {/* Ledger Table */}
            <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '24px', border: '1px solid #EAE8E3' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>Transaction History</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {wallet.ledger.map((entry: any) => (
                  <div
                    key={entry.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px',
                      borderRadius: '12px',
                      background: '#F7F5F0'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#191919' }}>{entry.desc}</div>
                      <div style={{ fontSize: '0.75rem', color: '#8A8176' }}>{entry.date}</div>
                    </div>
                    <div style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: entry.type === 'credit' ? '#2E7D32' : '#C62828'
                    }}>
                      {entry.amount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 10. CLIENT STYLE GUIDES (Stylist Editorial Curation) */}
        {activeTab === 'styleguides' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header & Quick Action */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '24px sm:32px',
              border: '1px solid #EAE8E3',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Sparkles size={18} color="#D4AF37" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#B85D43', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Stylist Curation Hub
                  </span>
                </div>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.8rem', fontWeight: 700, color: '#191919' }}>
                  Client Style Guides & Lookbooks
                </h2>
                <p style={{ color: '#666', fontSize: '0.9rem', maxWidth: '600px' }}>
                  Manually edit garments, upload lookbook photos, customize color harmonies, and duplicate looks to create endless styling options for your clients.
                </p>
              </div>

              <button
                onClick={() => {
                  if (onNavigate) onNavigate('recommendations');
                }}
                style={{
                  background: '#191919',
                  color: '#FFFFFF',
                  padding: '12px 24px',
                  borderRadius: '999px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  border: 'none',
                  boxShadow: '0 4px 14px rgba(25,25,25,0.2)'
                }}
              >
                <Sparkles size={16} color="#D4AF37" />
                <span>Open Full Style Guide Studio</span>
                <ArrowRight size={14} color="#FFFFFF" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '16px' }}>
              <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '20px', border: '1px solid #EAE8E3' }}>
                <div style={{ fontSize: '0.8rem', color: '#8A8176', fontWeight: 600 }}>Active Style Guide Looks</div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#191919', fontFamily: "'Playfair Display', Georgia, serif" }}>6+</div>
                <div style={{ fontSize: '0.75rem', color: '#2E7D32', fontWeight: 600 }}>Unlimited custom variations</div>
              </div>
              <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '20px', border: '1px solid #EAE8E3' }}>
                <div style={{ fontSize: '0.8rem', color: '#8A8176', fontWeight: 600 }}>Curated Color Swatches</div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#191919', fontFamily: "'Playfair Display', Georgia, serif" }}>18</div>
                <div style={{ fontSize: '0.75rem', color: '#8A8176' }}>Across 8 seasonal palettes</div>
              </div>
              <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '20px', border: '1px solid #EAE8E3' }}>
                <div style={{ fontSize: '0.8rem', color: '#8A8176', fontWeight: 600 }}>Client Deliveries</div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#191919', fontFamily: "'Playfair Display', Georgia, serif" }}>34</div>
                <div style={{ fontSize: '0.75rem', color: '#8A8176' }}>100% Client Satisfaction</div>
              </div>
            </div>

            {/* Client Guide Showcase Cards */}
            <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '24px', border: '1px solid #EAE8E3' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#191919' }}>Featured Client Recommendations</h3>
                <button
                  onClick={() => {
                    if (onNavigate) onNavigate('recommendations');
                  }}
                  style={{
                    background: 'transparent',
                    color: '#B85D43',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>Edit in Style Studio</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '16px' }}>
                {[
                  {
                    title: 'Textured Wool Tweed Coat & Silk Slip',
                    cat: 'Outerwear & Formal',
                    price: '$3,500',
                    swatches: ['#F4DCD6', '#191919', '#D4AF37'],
                    img: '/images/pink_tweed_coat.jpg'
                  },
                  {
                    title: 'Grade-A Cashmere Ribbed Mockneck',
                    cat: 'Knitwear & Tailoring',
                    price: '$1,850',
                    swatches: ['#8A8176', '#EAE8E3', '#2A2A2A'],
                    img: '/images/cashmere_mockneck.jpg'
                  },
                  {
                    title: 'Imperial Emerald Silk Accordion Gown',
                    cat: 'Evening & Occasion',
                    price: '$2,900',
                    swatches: ['#1B4D3E', '#D4AF37', '#0F2820'],
                    img: '/images/emerald_silk_gown.jpg'
                  }
                ].map((look, idx) => (
                  <div
                    key={idx}
                    style={{
                      borderRadius: '16px',
                      border: '1px solid #EAE8E3',
                      overflow: 'hidden',
                      background: '#FAF8F5'
                    }}
                  >
                    <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                      <img
                        src={look.img}
                        alt={look.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.currentTarget.src = '/images/pink_tweed_coat.jpg';
                        }}
                      />
                      <span style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        background: 'rgba(0,0,0,0.6)',
                        color: '#FFFFFF',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '999px',
                        textTransform: 'uppercase'
                      }}>
                        {look.cat}
                      </span>
                    </div>
                    <div style={{ padding: '14px' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#191919', marginBottom: '6px' }}>{look.title}</h4>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#B85D43' }}>{look.price}</span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {look.swatches.map((hex, i) => (
                            <span
                              key={i}
                              style={{ width: '12px', height: '12px', borderRadius: '50%', background: hex, border: '1px solid #fff' }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Service Create Modal */}
      {isServiceModalOpen && (
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
            padding: '28px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.6rem', marginBottom: '16px' }}>
              Create Styling Service
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Styling Service Format</label>
                <select
                  value={newSrvFormatType}
                  onChange={(e) => {
                    const fmt = e.target.value;
                    setNewSrvFormatType(fmt);
                    if (fmt === 'emergency_call_15min') {
                      setNewSrvTitle('15-Minute Emergency Style Call');
                      setNewSrvDuration('15');
                      setNewSrvPrice('999');
                      setNewSrvMode('virtual_consultation');
                      setNewSrvDeliverables('15-min instant video guidance, Quick outfit decision, Accessory fix');
                    } else if (fmt === 'in_person_shopping') {
                      setNewSrvTitle('In-Person Shopping Escort');
                      setNewSrvDuration('180');
                      setNewSrvPrice('6500');
                      setNewSrvMode('physical_shopping');
                      setNewSrvDeliverables('3-hour boutique tour, Pre-pulled dressing room racks, Fit alterations guidance');
                    } else if (fmt === 'remote_video_consultation') {
                      setNewSrvTitle('Remote Video Consultation');
                      setNewSrvDuration('60');
                      setNewSrvPrice('2500');
                      setNewSrvMode('virtual_consultation');
                      setNewSrvDeliverables('Personalized Lookbook PDF, 5 Shoppable Links, Color Harmony Card');
                    } else if (fmt === 'wedding_bridal_styling') {
                      setNewSrvTitle('Wedding & Bridal Trousseau Styling');
                      setNewSrvDuration('360');
                      setNewSrvPrice('18000');
                      setNewSrvMode('physical_shopping');
                      setNewSrvDeliverables('Kasavu & Silk Draping Trials, 4-Event Coordinated Lookbook, Jewelry Matching');
                    } else if (fmt === 'office_professional_styling') {
                      setNewSrvTitle('Office & Executive Wardrobe Styling');
                      setNewSrvDuration('90');
                      setNewSrvPrice('4500');
                      setNewSrvMode('virtual_consultation');
                      setNewSrvDeliverables('10-Piece Executive Capsule Plan, Fabric Swatch Guide, Tailoring Checklist');
                    } else if (fmt === 'festival_occasion_styling') {
                      setNewSrvTitle('Festival & Occasion Styling');
                      setNewSrvDuration('75');
                      setNewSrvPrice('3800');
                      setNewSrvMode('virtual_consultation');
                      setNewSrvDeliverables('Festive Handloom Curation, Color Draping Direction, Boutique Shortlist');
                    } else if (fmt === 'travel_holiday_styling') {
                      setNewSrvTitle('Travel & Holiday Capsule Styling');
                      setNewSrvDuration('60');
                      setNewSrvPrice('3200');
                      setNewSrvMode('virtual_consultation');
                      setNewSrvDeliverables('Destination Capsule Matrix, Packing Checklist, Weather-appropriate textiles');
                    } else if (fmt === 'date_night_casual_styling') {
                      setNewSrvTitle('Date-Night & Casual Chic Styling');
                      setNewSrvDuration('45');
                      setNewSrvPrice('2200');
                      setNewSrvMode('virtual_consultation');
                      setNewSrvDeliverables('3 High-Low Outfit Formulas, Scent & Accessory pairings');
                    } else if (fmt === 'family_shopping_assistance') {
                      setNewSrvTitle('Family Shopping & Coordination Assistance');
                      setNewSrvDuration('240');
                      setNewSrvPrice('12500');
                      setNewSrvMode('physical_shopping');
                      setNewSrvDeliverables('Family Color Palette Harmonization, Multi-store shopping routing, Group fittings');
                    }
                  }}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                >
                  <option value="remote_video_consultation">Remote Video Consultation (60 min)</option>
                  <option value="in_person_shopping">In-Person Shopping Escort</option>
                  <option value="emergency_call_15min">Quick Emergency Styling Call (15 min SOS)</option>
                  <option value="wedding_bridal_styling">Wedding & Bridal Styling</option>
                  <option value="office_professional_styling">Office & Professional Wardrobe Styling</option>
                  <option value="festival_occasion_styling">Festival & Occasion Styling</option>
                  <option value="travel_holiday_styling">Travel & Holiday Styling</option>
                  <option value="date_night_casual_styling">Date-Night & Casual Styling</option>
                  <option value="family_shopping_assistance">Family Shopping Assistance</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Service Title</label>
                <input
                  type="text"
                  value={newSrvTitle}
                  onChange={(e) => setNewSrvTitle(e.target.value)}
                  placeholder="e.g. Remote Video Consultation"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Service Mode</label>
                  <select
                    value={newSrvMode}
                    onChange={(e) => setNewSrvMode(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                  >
                    <option value="virtual_consultation">Virtual Video Atelier</option>
                    <option value="physical_shopping">In-Person Physical Visit</option>
                    <option value="emergency_call_15min">Instant Emergency SOS Call</option>
                    <option value="home_visit">Atelier Home Visit</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Category</label>
                  <select
                    value={newSrvCategory}
                    onChange={(e) => setNewSrvCategory(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                  >
                    <option value="Personal Styling">Personal Styling</option>
                    <option value="Virtual Styling">Virtual Styling</option>
                    <option value="Physical Shopping Assistant">Physical Shopping Assistant</option>
                    <option value="Wardrobe Audit">Wardrobe Audit</option>
                    <option value="Wedding Styling">Wedding Styling</option>
                    <option value="Groom Styling">Groom Styling</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Price (INR)</label>
                  <input
                    type="number"
                    value={newSrvPrice}
                    onChange={(e) => setNewSrvPrice(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Duration (Minutes)</label>
                  <input
                    type="number"
                    value={newSrvDuration}
                    onChange={(e) => setNewSrvDuration(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Deliverables (comma-separated)</label>
                <input
                  type="text"
                  value={newSrvDeliverables}
                  onChange={(e) => setNewSrvDeliverables(e.target.value)}
                  placeholder="e.g. Lookbook PDF, 5 Shoppable Links, Color Harmony Card"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Cancellation & Rescheduling Policy</label>
                <input
                  type="text"
                  value={newSrvCancellation}
                  onChange={(e) => setNewSrvCancellation(e.target.value)}
                  placeholder="Free cancellation up to 24 hours prior"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                />
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, marginTop: '4px' }}>
                <input
                  type="checkbox"
                  checked={newSrvInstantBooking}
                  onChange={(e) => setNewSrvInstantBooking(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#191919' }}
                />
                Enable Instant Booking (no manual stylist approval required)
              </label>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setIsServiceModalOpen(false)}
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
                onClick={handleSaveService}
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
                Save Service
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payout Modal */}
      {isWithdrawModalOpen && (
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
            maxWidth: '450px',
            width: '100%',
            padding: '28px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.6rem', marginBottom: '8px' }}>
              Request Payout
            </h3>
            <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '20px' }}>
              Funds will be transferred to your verified UPI ID or Bank Account via RazorpayX.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Amount (INR)</label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>UPI ID or Account Number</label>
                <input
                  type="text"
                  value={withdrawAccount}
                  onChange={(e) => setWithdrawAccount(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setIsWithdrawModalOpen(false)}
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
                onClick={handleWithdraw}
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
                Confirm Payout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styling Workspace Modal (Section 1.D) */}
      {isWorkspaceModalOpen && selectedBookingForWorkspace && (
        <StylingWorkspaceModal
          bookingId={selectedBookingForWorkspace}
          isOpen={isWorkspaceModalOpen}
          onClose={() => setIsWorkspaceModalOpen(false)}
          isStylistView={true}
          onSuccess={() => {
            // refresh data
            api.bookings.list().then(bks => bks && setBookings(bks)).catch(() => {});
          }}
        />
      )}

      {/* Client Style DNA & Wardrobe Modal (Section 1.A & 1.E) */}
      {selectedClientForDna && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100,
          padding: '20px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            maxWidth: '680px',
            width: '100%',
            padding: '28px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img
                  src={clientDnaProfile?.selfie_url || '/images/hero_editorial.jpg'}
                  alt={selectedClientForDna.name}
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #D4AF37' }}
                  onError={(e) => {
                    e.currentTarget.src = '/images/hero_editorial.jpg';
                  }}
                />
                <div>
                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>
                    {selectedClientForDna.name}'s Style DNA
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#2E7D32', fontWeight: 600 }}>
                    ✓ Client Consent Active · Shared with Assigned Stylist
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedClientForDna(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px' }}
              >
                <X size={20} />
              </button>
            </div>

            {loadingClientDna ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                Loading client style matrix...
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Physical Architecture */}
                <div style={{ background: '#F7F5F0', borderRadius: '16px', padding: '16px' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#191919', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Body Structure & Measurements
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', fontSize: '0.82rem' }}>
                    <div><strong>Face Shape:</strong> {clientDnaProfile?.face_shape || 'Oval'}</div>
                    <div><strong>Body Type:</strong> {clientDnaProfile?.body_structure || 'Hourglass'}</div>
                    <div><strong>Height:</strong> {clientDnaProfile?.height_cm || 168} cm</div>
                    <div><strong>Top Size:</strong> {clientDnaProfile?.sizes?.top || 'M'}</div>
                    <div><strong>Bottom Size:</strong> {clientDnaProfile?.sizes?.bottom || '30'}</div>
                    <div><strong>Shoe Size:</strong> {clientDnaProfile?.sizes?.shoes || 'UK 6'}</div>
                  </div>
                </div>

                {/* Color Palette & Undertone */}
                <div style={{ background: '#F7F5F0', borderRadius: '16px', padding: '16px' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#191919', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Color Harmony & Undertone
                  </h4>
                  <div style={{ fontSize: '0.82rem', marginBottom: '8px' }}>
                    <strong>Skin Undertone:</strong> {clientDnaProfile?.skin_undertone || 'Warm'}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Harmonious Swatches:</span>
                    {(clientDnaProfile?.favorite_colors || ['#191919', '#F7F5F0', '#1B4D3E', '#D4AF37']).map((c: string, ci: number) => (
                      <div key={ci} style={{ backgroundColor: c, width: '22px', height: '22px', borderRadius: '4px', border: '1px solid #CCC' }} title={c} />
                    ))}
                  </div>
                </div>

                {/* Fabrics Preferred & Avoided */}
                <div style={{ background: '#F7F5F0', borderRadius: '16px', padding: '16px' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#191919', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Textile Preferences
                  </h4>
                  <div style={{ fontSize: '0.82rem', marginBottom: '6px' }}>
                    <strong style={{ color: '#2E7D32' }}>Preferred Natural Textiles:</strong> {(clientDnaProfile?.fabrics_preferred || ['Mulberry Silk', 'Mongolian Cashmere', 'Belgian Linen']).join(', ')}
                  </div>
                  <div style={{ fontSize: '0.82rem' }}>
                    <strong style={{ color: '#C62828' }}>Fabrics to Avoid:</strong> {(clientDnaProfile?.fabrics_avoided || ['Polyester', 'Acrylic']).join(', ')}
                  </div>
                </div>

                {/* Client Custom Style Notes */}
                {clientDnaProfile?.notes_for_stylist && (
                  <div style={{ background: '#FFF8E1', border: '1px solid #FFE082', borderRadius: '16px', padding: '16px' }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F57F17', marginBottom: '4px', textTransform: 'uppercase' }}>
                      Client Personal Notes
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: '#444', fontStyle: 'italic', margin: 0 }}>
                      "{clientDnaProfile.notes_for_stylist}"
                    </p>
                  </div>
                )}

                {/* Client's Shared Closet & Wardrobe Gaps */}
                {clientDnaWardrobe?.items && clientDnaWardrobe.items.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#191919', marginBottom: '8px', textTransform: 'uppercase' }}>
                      Shared Wardrobe Pieces ({clientDnaWardrobe.items.length})
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' }}>
                      {clientDnaWardrobe.items.map((it: any, iti: number) => (
                        <div key={iti} style={{ background: '#F7F5F0', borderRadius: '10px', padding: '8px', textAlign: 'center', fontSize: '0.75rem' }}>
                          <img
                            src={it.image_url}
                            alt={it.name}
                            style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '6px', marginBottom: '4px' }}
                            onError={(e) => {
                              e.currentTarget.src = '/images/textured_tweed_coat.jpg';
                            }}
                          />
                          <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.name}</div>
                          <div style={{ color: '#888', fontSize: '0.7rem' }}>{it.category}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Wardrobe Gaps to Fill */}
                {clientDnaWardrobe?.gaps && clientDnaWardrobe.gaps.length > 0 && (
                  <div style={{ background: '#FBE9E7', border: '1px solid #FFCCBC', borderRadius: '16px', padding: '16px' }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#D84315', marginBottom: '6px', textTransform: 'uppercase' }}>
                      Missing Staples / Gaps to Source for Client
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {clientDnaWardrobe.gaps.map((g: any, gi: number) => (
                        <div key={gi} style={{ fontSize: '0.82rem', display: 'flex', justifyContent: 'space-between' }}>
                          <span><strong>• {g.title}</strong> ({g.category})</span>
                          <span style={{ fontWeight: 700, color: '#D84315' }}>{g.priority} Priority</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
