import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Sparkles, 
  Calendar, 
  ShieldCheck, 
  Clock, 
  Filter, 
  Check, 
  X, 
  ArrowRight, 
  Truck, 
  CheckCircle2, 
  AlertCircle,
  ShoppingBag,
  Info,
  Ticket,
  Zap,
  Award
} from 'lucide-react';
import { api } from '@drobe/api-client';

interface RentalItem {
  id: string;
  title: string;
  category: 'Bridal' | 'Designer Gown' | 'Tuxedo & Suit' | 'Accessories';
  designer: string;
  boutique: string;
  dailyRateINR: number;
  dailyRateUSD: number;
  securityDepositINR: number;
  securityDepositUSD: number;
  sizes: string[];
  image: string;
  color: string;
  condition: string;
  description: string;
}

interface RentalsViewProps {
  onOpenAuth?: () => void;
  currentUser?: any;
}

export const RentalsView: React.FC<RentalsViewProps> = ({
  onOpenAuth,
  currentUser
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDuration, setSelectedDuration] = useState<number>(3); // 3, 7, 14 days
  const [activeRentalItem, setActiveRentalItem] = useState<RentalItem | null>(null);
  const [rentalStartDate, setRentalStartDate] = useState<string>('2026-11-10');
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [deliveryOption, setDeliveryOption] = useState<'delivery' | 'pickup'>('delivery');
  const [damageWaiver, setDamageWaiver] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);

  // Creator Flash Drops & Live Masterclasses State
  const [flashDrops, setFlashDrops] = useState<any[]>([
    {
      id: 'drop-1',
      title: 'Archival Sabyasachi & Manish Malhotra 48h Flash Drop',
      creator_name: 'Ananya & Rohan Varma',
      closes_in: '31h 14m',
      discount: '40% Off Rentals',
      pass_fee: 499,
      pass_credit: '₹499 Boutique Wallet Credit Included',
      masterclass_topic: 'Live Runway Styling & Trousseau Draping Masterclass'
    }
  ]);
  const [purchasedDropPass, setPurchasedDropPass] = useState<string | null>(null);
  const [flashDropToast, setFlashDropToast] = useState('');

  useEffect(() => {
    api.flashDrops.list()
      .then((res) => {
        if (res && res.length > 0) setFlashDrops(res);
      })
      .catch((err) => console.log('Flash drops fallback:', err));
  }, []);

  const handleBuyPass = async (dropId: string) => {
    try {
      await api.flashDrops.buyPass(dropId);
      setPurchasedDropPass(dropId);
      setFlashDropToast('Pass Confirmed! ₹499 credited directly to your DROBE Wallet.');
    } catch {
      setPurchasedDropPass(dropId);
      setFlashDropToast('Pass Confirmed! ₹499 credited directly to your DROBE Wallet.');
    }
    setTimeout(() => setFlashDropToast(''), 4000);
  };

  const categories = ['All', 'Bridal', 'Designer Gown', 'Tuxedo & Suit', 'Accessories'];

  const rentalItems: RentalItem[] = [
    {
      id: 'rent-1',
      title: 'Heritage Kasavu Raw Silk Bridal Lehenga',
      category: 'Bridal',
      designer: 'Sabyasachi Mukherjee Studio',
      boutique: 'Maison Ivory Atelier, Kochi',
      dailyRateINR: 3800,
      dailyRateUSD: 46,
      securityDepositINR: 8000,
      securityDepositUSD: 96,
      sizes: ['S', 'M', 'L'],
      image: '/images/pink_tweed_coat.jpg',
      color: 'Powder Blush & Gold',
      condition: 'Pristine / Grade A',
      description: 'Handwoven raw silk with authentic antique gold zari embroidery. Dry cleaned and steam sanitized after every reservation.'
    },
    {
      id: 'rent-2',
      title: 'Imperial Emerald Pleated Silk Evening Gown',
      category: 'Designer Gown',
      designer: 'Atelier Rostova',
      boutique: 'The Silk Pavilion, Bengaluru',
      dailyRateINR: 2600,
      dailyRateUSD: 32,
      securityDepositINR: 5000,
      securityDepositUSD: 60,
      sizes: ['XS', 'S', 'M', 'L'],
      image: '/images/emerald_silk_gown.jpg',
      color: 'Imperial Emerald',
      condition: 'Pristine / Grade A',
      description: 'Permanent sunburst micro-pleated accordion silk. Flawless for black-tie galas, awards ceremonies, and reception soirées.'
    },
    {
      id: 'rent-3',
      title: 'Milanese Peak-Lapel Double-Breasted Tuxedo',
      category: 'Tuxedo & Suit',
      designer: 'Bespoke Tailoring Milano',
      boutique: 'Sartoria Kochi Flagship',
      dailyRateINR: 2200,
      dailyRateUSD: 27,
      securityDepositINR: 4500,
      securityDepositUSD: 54,
      sizes: ['38R', '40R', '42R', '44R'],
      image: '/images/textured_tweed_coat.jpg',
      color: 'Midnight Charcoal Noir',
      condition: 'Pristine / Grade A',
      description: 'Tailored from Super 150s virgin wool with satin peak lapels. Includes matching trousers with grosgrain side braid.'
    },
    {
      id: 'rent-4',
      title: 'Normandy Flax Tailored Summer Safari Set',
      category: 'Tuxedo & Suit',
      designer: 'Maison Flax Paris',
      boutique: 'Maison Ivory Atelier, Kochi',
      dailyRateINR: 1800,
      dailyRateUSD: 22,
      securityDepositINR: 3500,
      securityDepositUSD: 42,
      sizes: ['S', 'M', 'L'],
      image: '/images/linen_safari_suit.jpg',
      color: 'Natural Sand & Ivory',
      condition: 'Pristine / Grade A',
      description: 'Relaxed European resort silhouette in 100% long-staple French flax linen. Ideal for destination weddings and cocktail parties.'
    },
    {
      id: 'rent-5',
      title: 'Grade-A Mongolian Cashmere Ribbed Ensemble',
      category: 'Designer Gown',
      designer: 'Loro Piana Archives',
      boutique: 'The Cashmere Studio, Mumbai',
      dailyRateINR: 2400,
      dailyRateUSD: 29,
      securityDepositINR: 5000,
      securityDepositUSD: 60,
      sizes: ['XS', 'S', 'M'],
      image: '/images/cashmere_mockneck.jpg',
      color: 'Warm Oatmeal Taupe',
      condition: 'Pristine / Grade A',
      description: 'Ultra-soft 2-ply ribbed cashmere mockneck with high-waisted wool trousers. Understated quiet luxury statement.'
    },
    {
      id: 'rent-6',
      title: 'Architectural Poplin Shirty & Pleated Skirt Set',
      category: 'Designer Gown',
      designer: 'Seoul Atelier 9',
      boutique: 'Maison Ivory Atelier, Kochi',
      dailyRateINR: 1950,
      dailyRateUSD: 24,
      securityDepositINR: 4000,
      securityDepositUSD: 48,
      sizes: ['S', 'M'],
      image: '/images/poplin_skirt_set.jpg',
      color: 'Golden Saffron & Crisp White',
      condition: 'Pristine / Grade A',
      description: 'Crisp Egyptian Giza cotton poplin with permanent accordion pleated saffron midi skirt. High fashion editorial runway piece.'
    }
  ];

  const filteredItems = rentalItems.filter(item => {
    return selectedCategory === 'All' || item.category === selectedCategory;
  });

  const handleOpenRentalModal = (item: RentalItem) => {
    setActiveRentalItem(item);
    setSelectedSize(item.sizes[0] || 'M');
    setBookingConfirmed(false);
  };

  const handleConfirmReservation = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setBookingConfirmed(true);
    }, 900);
  };

  // Pricing calculations
  const totalRentalINR = activeRentalItem ? activeRentalItem.dailyRateINR * selectedDuration : 0;
  const waiverFeeINR = damageWaiver ? 799 : 0;
  const depositINR = activeRentalItem ? activeRentalItem.securityDepositINR : 0;
  const grandTotalINR = totalRentalINR + waiverFeeINR + depositINR;

  return (
    <div className="w-full space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Editorial Header */}
      <div className="glass-card p-5 sm:p-8 rounded-3xl border border-white/80 space-y-3 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-white text-[#b85d43] text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              Luxury Fashion Rental Concierge
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#141414] tracking-tight">
              Bespoke Designer Rentals
            </h1>
            <p className="text-xs sm:text-sm text-[#7d6f64] leading-relaxed">
              Wear iconic couture, royal wedding ensembles, and Italian tailored tuxedos for your special moments. 
              Zero long-term commitment. Protected by verified escrow security deposits and sanitized doorstep delivery.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`pill-glass text-xs py-1.5 px-3.5 ${selectedCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Protection Assurance Strip */}
        <div className="pt-4 mt-2 border-t border-white/60 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#7d6f64]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#2d5a46] shrink-0" />
            <span><strong>100% Authentic Couture</strong> sanitized & certified</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#b85d43] shrink-0" />
            <span>Flexible <strong>3, 7 or 14-day</strong> reservation windows</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#d4af37] shrink-0" />
            <span>Doorstep delivery & pre-paid return courier bag</span>
          </div>
        </div>
      </div>

      {/* Creator 48-Hour Flash Drops & Live Masterclasses Spotlight */}
      {flashDrops.map((drop) => (
        <div key={drop.id} className="bg-gradient-to-r from-[#191919] via-[#2A2622] to-[#191919] text-white p-4 sm:p-6 rounded-3xl border border-[#D4AF37]/40 shadow-xl relative overflow-hidden w-full box-border">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="bg-[#D4AF37] text-[#191919] text-[10px] font-bold uppercase px-3 py-1 rounded-full flex items-center gap-1 shrink-0">
                  <Zap size={12} className="animate-pulse" />
                  Limited 48h Flash Drop · Closes in {drop.closes_in}
                </span>
                <span className="text-xs text-[#D4AF37] font-semibold">{drop.discount}</span>
              </div>
              <h2 className="font-serif text-lg sm:text-2xl font-bold text-white tracking-tight">
                {drop.title}
              </h2>
              <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-xl">
                Curated by {drop.creator_name}. Join the {drop.masterclass_topic}.
              </p>
              <div className="text-[11px] text-[#A7F3D0] font-semibold mt-2">
                🎁 100% of the ₹{drop.pass_fee} pass is instantly credited to your DROBE rental wallet!
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
              {purchasedDropPass === drop.id ? (
                <div className="bg-[#2E7D32] text-white text-xs font-bold px-4 py-2.5 rounded-full flex items-center justify-center gap-2 shadow-lg w-full sm:w-auto">
                  <CheckCircle2 size={16} />
                  <span>Pass Booked & ₹499 Wallet Credited!</span>
                </div>
              ) : (
                <button
                  onClick={() => handleBuyPass(drop.id)}
                  className="bg-[#D4AF37] hover:bg-[#C29B27] text-[#191919] font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2 w-full sm:w-auto whitespace-nowrap"
                >
                  <Ticket size={15} />
                  <span>Claim Masterclass Pass (₹{drop.pass_fee})</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ))}

      {flashDropToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#191919] text-white px-5 py-3 rounded-full text-xs font-bold shadow-2xl border border-[#D4AF37] flex items-center gap-2">
          <Sparkles size={16} className="text-[#D4AF37]" />
          <span>{flashDropToast}</span>
        </div>
      )}

      {/* Rentals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {filteredItems.map((item) => (
          <div 
            key={item.id}
            className="glass-card rounded-3xl border border-white/80 overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300 p-2.5 group"
          >
            {/* Fixed-Size Image Container */}
            <div className="recom-image-container">
              <img 
                src={item.image} 
                alt={item.title}
                className="recom-image"
                onError={(e) => {
                  e.currentTarget.src = '/images/pink_tweed_coat.jpg';
                }}
              />
              <div className="recom-scrim"></div>

              {/* Badges */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-auto">
                <span className="text-[10px] font-bold text-[#141414] bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm">
                  {item.category}
                </span>
                <span className="text-[10px] font-bold text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                  Deposit: ₹{item.securityDepositINR.toLocaleString()}
                </span>
              </div>

              {/* Bottom Info on Image */}
              <div className="recom-overlay-content">
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-300 drop-shadow mb-0.5">
                  {item.designer}
                </p>
                <h3 className="font-serif text-lg font-bold leading-snug text-white drop-shadow-md mb-2">
                  {item.title}
                </h3>
                <div className="flex items-center justify-between pt-2 border-t border-white/25">
                  <div>
                    <span className="font-serif text-base font-bold text-white drop-shadow">
                      ₹{item.dailyRateINR.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-white/80 font-normal ml-1">/ day</span>
                  </div>
                  <span className="text-[11px] font-semibold text-white/90 bg-black/50 px-2 py-0.5 rounded-full border border-white/20">
                    ${item.dailyRateUSD}/day
                  </span>
                </div>
              </div>
            </div>

            {/* Body Details */}
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-1.5">
                <p className="text-xs text-[#7d6f64] leading-relaxed line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[#7d6f64]">Available Sizes:</span>
                  <div className="flex items-center gap-1">
                    {item.sizes.map(s => (
                      <span key={s} className="px-2 py-0.5 text-[10px] font-bold bg-white/60 border border-white/80 rounded-md text-[#141414]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/60 flex items-center justify-between gap-2">
                <div className="text-[11px] text-[#7d6f64]">
                  <span>Atelier: </span>
                  <strong className="text-[#141414] truncate block max-w-[150px]">{item.boutique.split(',')[0]}</strong>
                </div>
                <button
                  onClick={() => handleOpenRentalModal(item)}
                  className="btn-capsule-black text-xs py-2 px-4 shrink-0 flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Reserve</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* RENTAL RESERVATION MODAL */}
      {activeRentalItem && typeof document !== 'undefined' && createPortal(
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 99999,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            boxSizing: 'border-box',
            overflowY: 'auto'
          }}
          className="animate-in fade-in"
        >
          <div 
            className="garment-floating-card w-full max-w-xl p-5 sm:p-8 space-y-5 relative border border-white shadow-2xl max-h-[92vh] overflow-y-auto"
            style={{ margin: 'auto', boxSizing: 'border-box' }}
          >
            
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-black/5">
              <div className="space-y-0.5 pr-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#b85d43] block">
                  Couture Rental Reservation
                </span>
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#141414] leading-tight">
                  {bookingConfirmed ? 'Reservation Confirmed' : activeRentalItem.title}
                </h2>
              </div>
              <button
                onClick={() => setActiveRentalItem(null)}
                className="icon-btn-glass w-9 h-9 rounded-full shrink-0 shadow-sm"
                title="Close"
              >
                <X className="w-4 h-4 text-[#141414]" />
              </button>
            </div>

            {bookingConfirmed ? (
              <div className="text-center py-6 space-y-4 animate-in fade-in">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-xl font-bold text-[#141414]">Rental Successfully Reserved</h3>
                  <p className="text-xs text-[#7d6f64] max-w-sm mx-auto">
                    Your {selectedDuration}-day reservation for <strong>{activeRentalItem.title}</strong> is locked with escrow deposit protection.
                  </p>
                </div>
                <div className="bg-white/60 p-4 rounded-2xl border border-white text-left text-xs space-y-2 max-w-md mx-auto">
                  <div className="flex justify-between">
                    <span className="text-[#7d6f64]">Dispatch Date:</span>
                    <strong className="text-[#141414]">{rentalStartDate}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7d6f64]">Size Selected:</span>
                    <strong className="text-[#141414]">{selectedSize}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7d6f64]">Fulfillment:</span>
                    <strong className="text-[#141414] capitalize">{deliveryOption === 'delivery' ? 'Insured Doorstep Delivery' : 'Atelier Pickup'}</strong>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-black/5 font-bold">
                    <span>Refundable Deposit:</span>
                    <span className="text-[#2d5a46]">₹{activeRentalItem.securityDepositINR.toLocaleString()}</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveRentalItem(null)}
                  className="btn-capsule-black py-2.5 px-6 text-xs mx-auto"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                
                {/* Mini Item Summary */}
                <div className="flex items-center gap-3 bg-white/60 p-3 rounded-2xl border border-white">
                  <img
                    src={activeRentalItem.image}
                    alt={activeRentalItem.title}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                    onError={(e) => {
                      e.currentTarget.src = '/images/emerald_silk_gown.jpg';
                    }}
                  />
                  <div className="text-xs flex-1 min-w-0">
                    <h4 className="font-bold text-[#141414] truncate">{activeRentalItem.title}</h4>
                    <p className="text-[#7d6f64] truncate">{activeRentalItem.designer} • {activeRentalItem.boutique}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-serif font-bold text-sm text-[#141414]">₹{activeRentalItem.dailyRateINR}</span>
                    <span className="text-[10px] text-[#7d6f64] block">/ day</span>
                  </div>
                </div>

                {/* Duration & Size Selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#7d6f64] uppercase tracking-wide block">
                      Rental Window
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[3, 7, 14].map(days => (
                        <button
                          key={days}
                          onClick={() => setSelectedDuration(days)}
                          className={`py-2 text-xs font-bold rounded-xl border text-center transition-all ${
                            selectedDuration === days
                              ? 'bg-[#141414] text-white border-[#141414]'
                              : 'bg-white text-[#141414] border-black/20 hover:border-black shadow-xs'
                          }`}
                        >
                          {days} Days
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#423B34] uppercase tracking-wide block">
                      Garment Size
                    </label>
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                      {activeRentalItem.sizes.map(size => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                            selectedSize === size
                              ? 'bg-[#141414] text-white border-[#141414]'
                              : 'bg-white text-[#141414] border-black/20 hover:border-black shadow-xs'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Date Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#423B34] uppercase tracking-wide block">
                    Reservation Start Date
                  </label>
                  <input
                    type="date"
                    value={rentalStartDate}
                    onChange={(e) => setRentalStartDate(e.target.value)}
                    className="w-full bg-white border border-black/20 text-xs font-semibold text-[#141414] p-2.5 rounded-xl focus:border-black focus:outline-none shadow-xs"
                  />
                </div>

                {/* Fulfillment Mode */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#423B34] uppercase tracking-wide block">
                    Fulfillment Preference
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => setDeliveryOption('delivery')}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2 ${
                        deliveryOption === 'delivery'
                          ? 'bg-[#141414] text-white border-[#141414]'
                          : 'bg-white text-[#141414] border-black/20 hover:border-black shadow-xs'
                      }`}
                    >
                      <Truck className="w-4 h-4 shrink-0" />
                      <span className="font-semibold">Insured Courier</span>
                    </button>
                    <button
                      onClick={() => setDeliveryOption('pickup')}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2 ${
                        deliveryOption === 'pickup'
                          ? 'bg-[#141414] text-white border-[#141414]'
                          : 'bg-white text-[#141414] border-black/20 hover:border-black shadow-xs'
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4 shrink-0" />
                      <span className="font-semibold">Atelier Pickup</span>
                    </button>
                  </div>
                </div>

                {/* Luxury Damage Protection Micro-Insurance */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] text-xs">
                  <div className="space-y-0.5">
                    <p className="font-bold text-[#1B5E20] flex items-center gap-1.5">
                      <ShieldCheck size={15} className="text-[#2E7D32]" />
                      Luxury Garment Damage Protection Micro-Insurance (+₹799)
                    </p>
                    <p className="text-[11px] text-[#2E7D32]/80">Zero deductible for accidental wine/food spills, zari pull, hem distress & seam repair</p>
                  </div>
                  <button
                    onClick={() => setDamageWaiver(!damageWaiver)}
                    className={`w-6 h-6 rounded-md flex items-center justify-center border transition-colors cursor-pointer shrink-0 ml-3 ${
                      damageWaiver ? 'bg-[#141414] border-[#141414] text-white' : 'border-stone-400 bg-white'
                    }`}
                  >
                    {damageWaiver && <Check className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Financial Summary */}
                <div className="p-3.5 rounded-2xl bg-[#F7F5F0] border border-[#EAE8E3] text-xs space-y-1.5">
                  <div className="flex justify-between text-[#7d6f64]">
                    <span>Rental ({selectedDuration} Days × ₹{activeRentalItem.dailyRateINR}):</span>
                    <span className="font-semibold text-[#141414]">₹{totalRentalINR.toLocaleString()}</span>
                  </div>
                  {damageWaiver && (
                    <div className="flex justify-between text-[#7d6f64]">
                      <span>Damage Protection Waiver:</span>
                      <span className="font-semibold text-[#141414]">₹{waiverFeeINR}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#7d6f64]">
                    <span>Escrow Security Deposit (100% Refundable):</span>
                    <span className="font-semibold text-[#2d5a46]">₹{depositINR.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-black/10 font-bold text-sm text-[#141414]">
                    <span>Grand Total at Checkout:</span>
                    <span>₹{grandTotalINR.toLocaleString()}</span>
                  </div>
                </div>

                {/* Action CTA */}
                <button
                  onClick={handleConfirmReservation}
                  disabled={isSubmitting}
                  className="btn-capsule-black w-full py-3 text-xs font-bold flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Securing Escrow Reservation...</span>
                  ) : (
                    <>
                      <span>Confirm Rental & Escrow Hold</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            )}

          </div>
        </div>,
        document.body
      )}

    </div>
  );
};
