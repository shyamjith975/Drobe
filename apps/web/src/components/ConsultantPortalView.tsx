import React, { useState } from 'react';
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
  X
} from 'lucide-react';
import { api } from '@drobe/api-client';

interface ConsultantPortalViewProps {
  currentUser: any;
  onOpenMessages?: () => void;
}

export const ConsultantPortalView: React.FC<ConsultantPortalViewProps> = ({
  currentUser,
  onOpenMessages
}) => {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'bookings' | 'services' | 'availability' | 'locations' | 'portfolio' | 'wallet' | 'reviews' | 'settings'
  >('dashboard');

  const [isVerified, setIsVerified] = useState<boolean>(
    currentUser?.stylist_profile?.verification_status === 'verified' || currentUser?.profile?.is_verified || false
  );

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

  // Modals
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [newSrvTitle, setNewSrvTitle] = useState('');
  const [newSrvCategory, setNewSrvCategory] = useState('Personal Styling');
  const [newSrvPrice, setNewSrvPrice] = useState('3500');
  const [newSrvDuration, setNewSrvDuration] = useState('90');
  const [newSrvMode, setNewSrvMode] = useState('virtual_consultation');

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('10000');
  const [withdrawAccount, setWithdrawAccount] = useState('maya.nambiar@upi');

  const handleBookingAction = (bookingId: string, newStatus: string) => {
    setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
    alert(`Booking status updated to ${newStatus}`);
  };

  const handleSaveService = () => {
    if (!newSrvTitle.trim()) return;
    const newSrv = {
      id: `srv-${Date.now()}`,
      title: newSrvTitle,
      category: newSrvCategory,
      mode: newSrvMode,
      duration_minutes: parseInt(newSrvDuration) || 60,
      price: parseFloat(newSrvPrice) || 0,
      advance_percentage: 50,
      travel_fee: newSrvMode === 'virtual_consultation' ? 0 : 500,
      cancellation_policy: '24 hours notice required',
      is_active: true
    };
    setServices([...services, newSrv]);
    setIsServiceModalOpen(false);
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
    <div className="consultant-portal-container" style={{ background: '#F7F5F0', minHeight: '90vh', padding: '2rem 1.5rem 6rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* Portal Header & Verification Badge */}
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
              <Scissors size={20} color="#191919" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#8A8176', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Stylist & Fashion Consultant Portal
              </span>
            </div>
            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '2.4rem',
              fontWeight: 700,
              color: '#191919'
            }}>
              {currentUser?.profile?.display_name || 'Maya Nambiar'}
            </h1>
            <p style={{ color: '#666', fontSize: '0.95rem' }}>
              {currentUser?.stylist_profile?.category || 'Bridal & Occasion Stylist'} · Base City: {currentUser?.stylist_profile?.base_city || 'Kochi'}
            </p>
          </div>

          {/* Verification Badge Specified in Business Rules */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 18px',
            borderRadius: '999px',
            background: isVerified ? '#E8F5E9' : '#FFF8E1',
            border: `1px solid ${isVerified ? '#A5D6A7' : '#FFE082'}`,
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
          }}>
            {isVerified ? (
              <>
                <CheckCircle size={18} color="#2E7D32" />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1B5E20' }}>Verified Professional Stylist</div>
                  <div style={{ fontSize: '0.72rem', color: '#388E3C' }}>Instant public booking active</div>
                </div>
              </>
            ) : (
              <>
                <AlertCircle size={18} color="#F57F17" />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F57F17' }}>Pending Professional Verification</div>
                  <div style={{ fontSize: '0.72rem', color: '#8D6E63' }}>Profile credentials under review by Admin</div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '12px',
          marginBottom: '2rem',
          borderBottom: '1px solid #EAE8E3'
        }}>
          {[
            { id: 'dashboard', label: 'Consultant Dashboard', icon: TrendingUp },
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
                <span>{tabItem.label}</span>
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
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
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
                        color: '#666',
                        border: '1px solid #EAE8E3',
                        borderRadius: '999px',
                        padding: '10px 18px',
                        fontSize: '0.85rem',
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
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
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
            padding: '28px'
          }}>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.6rem', marginBottom: '16px' }}>
              Create Styling Service
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Service Title</label>
                <input
                  type="text"
                  value={newSrvTitle}
                  onChange={(e) => setNewSrvTitle(e.target.value)}
                  placeholder="e.g. Red Carpet & Gala Styling"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                />
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
            padding: '28px'
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

    </div>
  );
};
