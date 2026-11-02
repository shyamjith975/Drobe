import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Ticket, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  X, 
  ArrowRight, 
  QrCode, 
  Share2, 
  Award,
  Video
} from 'lucide-react';

interface EventItem {
  id: string;
  title: string;
  category: 'Fashion Show' | 'Masterclass' | 'Workshop' | 'Networking';
  date: string;
  time: string;
  city: string;
  venue: string;
  isVirtual: boolean;
  instructor: string;
  instructorRole: string;
  instructorAvatar: string;
  priceINR: number;
  priceUSD: number;
  vipPriceINR: number;
  totalSeats: number;
  seatsLeft: number;
  image: string;
  description: string;
  topics: string[];
}

interface EventsViewProps {
  onOpenAuth?: () => void;
  currentUser?: any;
}

export const EventsView: React.FC<EventsViewProps> = ({
  onOpenAuth,
  currentUser
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeEvent, setActiveEvent] = useState<EventItem | null>(null);
  const [ticketTier, setTicketTier] = useState<'standard' | 'vip'>('standard');
  const [attendeeName, setAttendeeName] = useState<string>(currentUser?.profile?.display_name || '');
  const [attendeeEmail, setAttendeeEmail] = useState<string>(currentUser?.email || '');
  const [ticketQuantity, setTicketQuantity] = useState<number>(1);
  const [isBooking, setIsBooking] = useState<boolean>(false);
  const [confirmedTicket, setConfirmedTicket] = useState<any | null>(null);

  const categories = ['All', 'Fashion Show', 'Masterclass', 'Workshop', 'Networking'];

  const events: EventItem[] = [
    {
      id: 'event-1',
      title: 'Milanese Sartorial & Kasavu Heritage Runway',
      category: 'Fashion Show',
      date: 'Nov 22, 2026',
      time: '6:30 PM - 9:30 PM IST',
      city: 'Kochi',
      venue: 'Grand Hyatt Bolgatty Waterfront Pavilion',
      isVirtual: false,
      instructor: 'Vikram Menon & Maya Nambiar',
      instructorRole: 'Couture Directors & Lead Curators',
      instructorAvatar: '/images/shop_manager.jpg',
      priceINR: 1800,
      priceUSD: 22,
      vipPriceINR: 4500,
      totalSeats: 250,
      seatsLeft: 34,
      image: '/images/hero_editorial.jpg',
      description: 'An exclusive dual-curated runway unveiling Pre-Fall 2026 couture, merging Balaramapuram handloom gold with Italian architectural silhouettes.',
      topics: ['Live Couture Showcase', 'Atelier Meet & Greet', 'Champagne Reception', 'Front Row Gifting']
    },
    {
      id: 'event-2',
      title: 'Bespoke Personal Styling & Wardrobe Audit Masterclass',
      category: 'Masterclass',
      date: 'Nov 29, 2026',
      time: '11:00 AM - 2:00 PM IST',
      city: 'Bengaluru',
      venue: 'The Leela Palace Ballroom (Live Stream Available)',
      isVirtual: true,
      instructor: 'Maya Nambiar',
      instructorRole: 'Lead Personal Stylist & Vogue Contributor',
      instructorAvatar: '/images/stylist_editorial.jpg',
      priceINR: 1200,
      priceUSD: 15,
      vipPriceINR: 2800,
      totalSeats: 80,
      seatsLeft: 12,
      image: '/images/pink_tweed_coat.jpg',
      description: 'Hands-on intensive masterclass on color harmonies, silhouette balancing, capsule wardrobe curation, and certified personal styling consulting.',
      topics: ['Palette Theory & Swatching', 'Body Proportion Geometry', 'Client Consultation Workflows', 'DROBE Stylist Certification']
    },
    {
      id: 'event-3',
      title: 'Editorial Fashion Photography & Studio Lighting Workshop',
      category: 'Workshop',
      date: 'Dec 05, 2026',
      time: '10:00 AM - 5:00 PM IST',
      city: 'Mumbai',
      venue: 'Famous Studios, Mahalakshmi',
      isVirtual: false,
      instructor: 'Rohan Varma',
      instructorRole: 'Celebrity & Commercial Fashion Photographer',
      instructorAvatar: '/images/stylist_maya.jpg',
      priceINR: 3200,
      priceUSD: 39,
      vipPriceINR: 6500,
      totalSeats: 40,
      seatsLeft: 7,
      image: '/images/linen_safari_suit.jpg',
      description: 'Full-day studio workshop working with signed agency models, strobe diffusion, medium format framing, and high fashion post-production.',
      topics: ['3-Point Strobe Modifiers', 'Directing High Fashion Models', 'Tethered Capture & Grading', 'Portfolio Critique Session']
    },
    {
      id: 'event-4',
      title: 'Bridal Couture & Royal Kasavu Coordination Symposium',
      category: 'Networking',
      date: 'Dec 12, 2026',
      time: '4:00 PM - 8:00 PM IST',
      city: 'Kochi',
      venue: 'Brunton Boatyard Colonial Atelier',
      isVirtual: false,
      instructor: 'Elena Rostova & Priya Nair',
      instructorRole: 'Bridal Concierge & Trousseau Directors',
      instructorAvatar: '/images/shop_manager.jpg',
      priceINR: 1500,
      priceUSD: 18,
      vipPriceINR: 3500,
      totalSeats: 120,
      seatsLeft: 28,
      image: '/images/emerald_silk_gown.jpg',
      description: 'Connect with South India’s premier wedding couturiers, jewelry curators, and hair/makeup artists in an intimate heritage setting.',
      topics: ['Muhurtham Palette Curation', 'Heritage Jewelry Matching', 'Vendor Escrow Bookings', 'Direct Designer Access']
    }
  ];

  const filteredEvents = events.filter(e => {
    return selectedCategory === 'All' || e.category === selectedCategory;
  });

  const handleOpenTicketModal = (item: EventItem) => {
    setActiveEvent(item);
    setConfirmedTicket(null);
    setTicketTier('standard');
    setTicketQuantity(1);
  };

  const handleBookTicket = () => {
    setIsBooking(true);
    setTimeout(() => {
      setIsBooking(false);
      setConfirmedTicket({
        ticketId: `DRB-EVT-${Math.floor(100000 + Math.random() * 900000)}`,
        tier: ticketTier,
        quantity: ticketQuantity,
        eventTitle: activeEvent?.title,
        date: activeEvent?.date,
        time: activeEvent?.time,
        venue: activeEvent?.venue,
        attendeeName: attendeeName || 'Priya Nair',
        amountPaidINR: activeEvent ? (ticketTier === 'vip' ? activeEvent.vipPriceINR : activeEvent.priceINR) * ticketQuantity : 0
      });
    }, 800);
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Editorial Header */}
      <div className="glass-card p-5 sm:p-8 rounded-3xl border border-white/80 space-y-3 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-white text-[#b85d43] text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              Atelier Experiences & Masterclasses
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#141414] tracking-tight">
              Fashion Events & Masterclasses
            </h1>
            <p className="text-xs sm:text-sm text-[#7d6f64] leading-relaxed">
              Experience the pulse of haute couture. Attend high-fashion runway shows, photography workshops, 
              and certified styling masterclasses led by India and Europe’s foremost industry leaders.
            </p>
          </div>

          {/* Filter Pills */}
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

        {/* Benefits Strip */}
        <div className="pt-4 mt-2 border-t border-white/60 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#7d6f64]">
          <div className="flex items-center gap-2">
            <Ticket className="w-4 h-4 text-[#2d5a46] shrink-0" />
            <span><strong>Instant Digital Pass</strong> with verified QR access</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#b85d43] shrink-0" />
            <span><strong>Certified Attendance</strong> & skill completion credit</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#d4af37] shrink-0" />
            <span><strong>Exclusive Networking</strong> with designers & editors</span>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {filteredEvents.map((item) => (
          <div 
            key={item.id}
            className="glass-card rounded-3xl border border-white/80 overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300 p-2.5 group"
          >
            {/* Image Container with Fixed Dimensions */}
            <div className="recom-image-container !h-[260px] sm:!h-[280px]">
              <img 
                src={item.image} 
                alt={item.title}
                className="recom-image"
                onError={(e) => {
                  e.currentTarget.src = '/images/hero_editorial.jpg';
                }}
              />
              <div className="recom-scrim"></div>

              {/* Badges */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-auto">
                <span className="text-[10px] font-bold text-[#141414] bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm">
                  {item.category}
                </span>
                <span className="text-[10px] font-bold text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1">
                  {item.isVirtual ? <Video className="w-3 h-3 text-[#d4af37]" /> : <MapPin className="w-3 h-3 text-amber-300" />}
                  <span>{item.city}</span>
                </span>
              </div>

              {/* Bottom Info on Image */}
              <div className="recom-overlay-content">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-200 drop-shadow mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{item.date} • {item.time}</span>
                </div>
                <h3 className="font-serif text-lg font-bold leading-snug text-white drop-shadow-md">
                  {item.title}
                </h3>
              </div>
            </div>

            {/* Body */}
            <div className="p-4 space-y-3.5 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <p className="text-xs text-[#7d6f64] leading-relaxed line-clamp-2">
                  {item.description}
                </p>

                {/* Topics Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.topics.map((t, idx) => (
                    <span key={idx} className="text-[10px] font-medium bg-white/70 border border-white/90 text-[#141414] px-2 py-0.5 rounded-full">
                      ✓ {t}
                    </span>
                  ))}
                </div>

                {/* Venue and Instructor */}
                <div className="pt-2 flex items-center justify-between text-xs text-[#7d6f64]">
                  <div className="flex items-center gap-2">
                    <img 
                      src={item.instructorAvatar} 
                      alt={item.instructor}
                      className="avatar-sm rounded-full object-cover border border-white shrink-0"
                      style={{ width: '24px', height: '24px', minWidth: '24px', minHeight: '24px', maxWidth: '24px', maxHeight: '24px', borderRadius: '50%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.currentTarget.src = '/images/shop_manager.jpg';
                      }}
                    />
                    <div>
                      <span className="font-bold text-[#141414] block leading-none">{item.instructor}</span>
                      <span className="text-[10px] text-[#7d6f64]">{item.instructorRole}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#b85d43] font-bold block">{item.seatsLeft} seats left</span>
                    <span className="text-[10px] text-[#7d6f64]">of {item.totalSeats} total</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 border-t border-white/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#7d6f64] uppercase font-bold tracking-wider block">Pass from</span>
                  <span className="font-serif font-bold text-base text-[#141414]">₹{item.priceINR.toLocaleString()}</span>
                  <span className="text-[10px] text-[#7d6f64] ml-1">(${item.priceUSD})</span>
                </div>
                <button
                  onClick={() => handleOpenTicketModal(item)}
                  className="btn-capsule-black text-xs py-2 px-4 flex items-center gap-1.5"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>Book Digital Pass</span>
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* TICKET BOOKING MODAL */}
      {activeEvent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="garment-floating-card w-full max-w-xl p-5 sm:p-8 space-y-5 relative border border-white shadow-2xl max-h-[92vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-black/5">
              <div className="space-y-0.5 pr-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#b85d43] block">
                  Official Event Registration
                </span>
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#141414] leading-tight">
                  {confirmedTicket ? 'Digital Pass Issued' : activeEvent.title}
                </h2>
              </div>
              <button
                onClick={() => setActiveEvent(null)}
                className="icon-btn-glass w-9 h-9 rounded-full shrink-0 shadow-sm"
                title="Close"
              >
                <X className="w-4 h-4 text-[#141414]" />
              </button>
            </div>

            {confirmedTicket ? (
              <div className="text-center py-4 space-y-4 animate-in fade-in">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-xl font-bold text-[#141414]">Pass Confirmed & Added to Wallet</h3>
                  <p className="text-xs text-[#7d6f64]">
                    Present this encrypted QR code at the reception desk for instant check-in.
                  </p>
                </div>

                {/* Digital Ticket Pass Card */}
                <div className="bg-white p-5 rounded-3xl border border-black/10 shadow-lg text-left max-w-sm mx-auto space-y-3 relative overflow-hidden">
                  <div className="flex justify-between items-start border-b border-black/5 pb-2">
                    <div>
                      <span className="text-[9px] uppercase font-bold tracking-wider text-[#b85d43] block">DROBE Atelier Pass</span>
                      <h4 className="font-serif font-bold text-sm text-[#141414] leading-snug">{confirmedTicket.eventTitle}</h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#141414] text-white uppercase">
                      {confirmedTicket.tier}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#7d6f64]">
                    <div>
                      <span>Date & Time</span>
                      <strong className="block text-[#141414] text-xs">{confirmedTicket.date}</strong>
                    </div>
                    <div className="text-right">
                      <span>Pass Holder</span>
                      <strong className="block text-[#141414] text-xs">{confirmedTicket.attendeeName}</strong>
                    </div>
                  </div>

                  {/* Simulated QR Code */}
                  <div className="pt-2 flex flex-col items-center justify-center border-t border-dashed border-black/15">
                    <div className="w-24 h-24 bg-stone-100 border border-stone-300 rounded-xl flex items-center justify-center shadow-inner my-1">
                      <QrCode className="w-16 h-16 text-[#141414]" />
                    </div>
                    <span className="font-mono text-[10px] text-[#7d6f64] tracking-widest">{confirmedTicket.ticketId}</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveEvent(null)}
                  className="btn-capsule-black py-2.5 px-6 text-xs mx-auto"
                >
                  Return to Events
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                
                {/* Event Summary */}
                <div className="bg-white/60 p-3 rounded-2xl border border-white text-xs space-y-1">
                  <p className="font-bold text-[#141414]">{activeEvent.venue}</p>
                  <p className="text-[#7d6f64]">{activeEvent.date} • {activeEvent.time}</p>
                </div>

                {/* Tier Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#423B34] uppercase tracking-wide block">
                    Choose Ticket Tier
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => setTicketTier('standard')}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        ticketTier === 'standard'
                          ? 'bg-[#141414] text-white border-[#141414] shadow-md'
                          : 'bg-white text-[#141414] border-black/20 hover:border-black shadow-xs'
                      }`}
                    >
                      <strong className="block text-sm">General Admission</strong>
                      <span className="text-[11px] block mt-0.5 opacity-80">Full event & live session access</span>
                      <span className="font-serif font-bold text-sm block mt-2">₹{activeEvent.priceINR.toLocaleString()}</span>
                    </button>

                    <button
                      onClick={() => setTicketTier('vip')}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        ticketTier === 'vip'
                          ? 'bg-[#141414] text-white border-[#141414] shadow-md'
                          : 'bg-white text-[#141414] border-black/20 hover:border-black shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <strong className="block text-sm">VIP Atelier Pass</strong>
                        <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                      </div>
                      <span className="text-[11px] block mt-0.5 opacity-80">Front row, meet & greet + gift bag</span>
                      <span className="font-serif font-bold text-sm block mt-2">₹{activeEvent.vipPriceINR.toLocaleString()}</span>
                    </button>
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-black/15 shadow-xs text-xs">
                  <span className="font-bold text-[#141414]">Ticket Quantity</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                      className="w-7 h-7 rounded-lg bg-white border border-stone-400 font-bold flex items-center justify-center text-[#141414] hover:bg-neutral-100"
                    >
                      -
                    </button>
                    <span className="font-bold text-sm text-[#141414]">{ticketQuantity}</span>
                    <button
                      onClick={() => setTicketQuantity(Math.min(5, ticketQuantity + 1))}
                      className="w-7 h-7 rounded-lg bg-white border border-stone-400 font-bold flex items-center justify-center text-[#141414] hover:bg-neutral-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Attendee Info Inputs */}
                <div className="space-y-2 text-xs">
                  <div>
                    <label className="text-[11px] font-bold text-[#423B34] uppercase block mb-1">Attendee Name</label>
                    <input
                      type="text"
                      value={attendeeName}
                      onChange={(e) => setAttendeeName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full bg-white border border-black/20 text-xs font-semibold text-[#141414] p-2.5 rounded-xl focus:border-black focus:outline-none shadow-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#423B34] uppercase block mb-1">Email for Digital QR Delivery</label>
                    <input
                      type="email"
                      value={attendeeEmail}
                      onChange={(e) => setAttendeeEmail(e.target.value)}
                      placeholder="your.email@drobe.com"
                      className="w-full bg-white border border-black/20 text-xs font-semibold text-[#141414] p-2.5 rounded-xl focus:border-black focus:outline-none shadow-xs"
                    />
                  </div>
                </div>

                {/* Total */}
                <div className="p-3.5 rounded-2xl bg-[#F7F5F0] border border-[#EAE8E3] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[#7d6f64] block">Total Amount ({ticketQuantity} {ticketTier === 'vip' ? 'VIP' : 'Standard'} Pass):</span>
                    <strong className="font-serif text-lg text-[#141414]">
                      ₹{((ticketTier === 'vip' ? activeEvent.vipPriceINR : activeEvent.priceINR) * ticketQuantity).toLocaleString()}
                    </strong>
                  </div>
                  <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full font-bold">
                    Zero Booking Fee
                  </span>
                </div>

                <button
                  onClick={handleBookTicket}
                  disabled={isBooking}
                  className="btn-capsule-black w-full py-3 text-xs font-bold flex items-center justify-center gap-2"
                >
                  {isBooking ? (
                    <span>Issuing Digital Pass...</span>
                  ) : (
                    <>
                      <span>Complete Registration & Issue Pass</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
