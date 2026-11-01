import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  MapPin, 
  Calendar, 
  Bookmark, 
  Grid, 
  Wallet, 
  ArrowDownLeft, 
  CreditCard, 
  Sparkles, 
  Clock, 
  AlertCircle,
  Phone,
  Mail
} from 'lucide-react';
import { api } from '@drobe/api-client';

interface ProfileViewProps {
  currentRole: string;
  currentUser?: any | null;
  onOpenBookingModal?: (stylist: any) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ currentRole, currentUser }) => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'wallet' | 'saved'>('bookings');
  const [bookings, setBookings] = useState<any[]>([]);
  const [walletData, setWalletData] = useState<any | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState('5000');
  const [withdrawMsg, setWithdrawMsg] = useState('');

  useEffect(() => {
    loadBookings();
    if (currentRole === 'stylist') {
      loadWallet();
    }
  }, [currentRole, currentUser]);

  const loadBookings = async () => {
    try {
      const data = await api.bookings.list();
      setBookings(data);
    } catch {
      setBookings([
        {
          id: 'bk-drobe-8901',
          stylist_name: 'Elena Rostova',
          service_title: 'Private Bespoke Wardrobe Audit & Capsule Plan',
          service_mode: 'virtual_consultation',
          booking_date: '2026-11-12',
          booking_time: '14:00',
          status: 'confirmed',
          total_amount: 4800,
          paid_amount: 2400,
          currency: 'INR'
        }
      ]);
    }
  };

  const loadWallet = async () => {
    try {
      const data = await api.payments.getWallet();
      setWalletData(data);
    } catch {
      setWalletData({
        available_balance: 18500,
        pending_escrow_balance: 7500,
        total_earned: 42000,
        currency: 'INR',
        recent_ledger: [
          { id: 'tx-1', description: 'Advance for Virtual Consultation', amount: 2400, type: 'credit', created_at: '2026-10-28' },
          { id: 'tx-2', description: 'Escrow Release for Kochi Bridal Session', amount: 12000, type: 'credit', created_at: '2026-10-25' }
        ]
      });
    }
  };

  const roleProfiles: Record<string, any> = {
    enthusiast: {
      name: 'Priya Nair',
      handle: 'priya_nair',
      role: 'Fashion Enthusiast & Shopper',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      bio: 'Fashion enthusiast, minimalist aesthetics & vintage architecture.',
      city: 'Kochi & Bengaluru'
    },
    stylist: {
      name: 'Rohan Varma',
      handle: 'rohan_varma_style',
      role: 'Lead Celebrity Stylist & Atelier Director',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      bio: 'Celebrity & Wedding Menswear Stylist. Trained in London & Milan. Specializing in bespoke tailoring & Old Money aesthetics.',
      city: 'Kozhikode & Mumbai'
    },
    creator: {
      name: 'Ananya Roy',
      handle: 'ananya_creates',
      role: 'Fashion Creator & Visual Director',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      bio: 'Fashion creator exploring quiet luxury, sustainable textiles and coastal looks.',
      city: 'Mumbai'
    },
    brand: {
      name: 'Maison Ivory',
      handle: 'maison_ivory',
      role: 'Luxury Sustainable Atelier',
      avatar: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=400&q=80',
      bio: 'Minimalist sartorial label inspired by earthy textures and understated luxury.',
      city: 'Bengaluru & Kochi'
    },
    admin: {
      name: 'Vikramaditya Menon',
      handle: 'drobe_admin',
      role: 'Platform Operations & Moderation Lead',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      bio: 'DROBE Lead Editorial & Operations Director.',
      city: 'Kochi & Bengaluru'
    }
  };

  // Dynamically resolve profile from DB user record if available
  const pData = roleProfiles[currentRole] || roleProfiles.enthusiast;
  const profile = {
    name: currentUser?.profile?.display_name || pData.name,
    handle: currentUser?.profile?.username || pData.handle,
    role: currentUser?.role ? `${currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}` : pData.role,
    avatar: currentUser?.profile?.avatar_url || pData.avatar,
    bio: currentUser?.profile?.bio || pData.bio,
    city: currentUser?.profile?.city || pData.city,
    email: currentUser?.email || 'verified@drobe.style',
    userId: currentUser?.id || 'drobe-usr-core'
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-300">
      
      {/* Profile Header Card */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/80 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <img
            src={profile.avatar || '/images/stylist_editorial.jpg'}
            alt={profile.name}
            className="w-24 h-24 rounded-3xl object-cover border-2 border-white shadow-xl"
            onError={(e) => {
              e.currentTarget.src = '/images/stylist_editorial.jpg';
            }}
          />
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl font-serif font-bold text-[#141414]">{profile.name}</h2>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#b85d43] bg-white/70 px-2.5 py-0.5 rounded-full border border-white">
                {profile.role}
              </span>
            </div>
            <p className="text-xs text-[#7d6f64]">@{profile.handle} • {profile.city}</p>
            <p className="text-xs text-[#5e564e] italic max-w-xl font-serif pt-1">
              "{profile.bio}"
            </p>
          </div>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/60">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pill-glass text-xs py-1.5 px-4 ${activeTab === 'bookings' ? 'active' : ''}`}
          >
            My Appointments ({bookings.length})
          </button>
          {currentRole === 'stylist' && (
            <button
              onClick={() => setActiveTab('wallet')}
              className={`pill-glass text-xs py-1.5 px-4 ${activeTab === 'wallet' ? 'active' : ''}`}
            >
              Escrow Wallet & Payouts
            </button>
          )}
          <button
            onClick={() => setActiveTab('saved')}
            className={`pill-glass text-xs py-1.5 px-4 ${activeTab === 'saved' ? 'active' : ''}`}
          >
            Saved Lookbooks
          </button>
        </div>
      </div>

      {/* Bookings View */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#141414]">Styling Appointments & Consultations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookings.map((bk) => (
              <div key={bk.id} className="glass-card p-5 rounded-2xl border border-white/80 space-y-3 shadow-md">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#b85d43] tracking-wider block">
                      Confirmed Appointment
                    </span>
                    <h4 className="font-bold text-sm text-[#141414] mt-0.5">{bk.service_title}</h4>
                    <p className="text-xs text-[#7d6f64]">Stylist: {bk.stylist_name}</p>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#2d5a46] border border-emerald-200">
                    {bk.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-white/60 text-[#5e564e]">
                  <span>Date: {bk.booking_date} at {bk.booking_time}</span>
                  <span className="font-bold text-[#141414]">Paid: ₹{Number(bk.paid_amount).toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stylist Wallet View */}
      {activeTab === 'wallet' && walletData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card p-5 rounded-2xl border border-white text-xs space-y-1">
              <span className="text-[#7d6f64] font-bold uppercase text-[10px]">Available Balance</span>
              <p className="text-2xl font-bold text-[#141414]">₹{walletData.available_balance?.toLocaleString('en-IN')}</p>
            </div>
            <div className="glass-card p-5 rounded-2xl border border-white text-xs space-y-1">
              <span className="text-[#7d6f64] font-bold uppercase text-[10px]">Pending Escrow</span>
              <p className="text-2xl font-bold text-[#b85d43]">₹{walletData.pending_escrow_balance?.toLocaleString('en-IN')}</p>
            </div>
            <div className="glass-card p-5 rounded-2xl border border-white text-xs space-y-1">
              <span className="text-[#7d6f64] font-bold uppercase text-[10px]">Total Lifetime Earned</span>
              <p className="text-2xl font-bold text-[#2d5a46]">₹{walletData.total_earned?.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
