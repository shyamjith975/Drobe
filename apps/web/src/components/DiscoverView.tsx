import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  MapPin,
  Star,
  ArrowUpRight,
  CheckCircle,
  Tag,
  ShieldCheck,
  TrendingDown,
  Calendar,
  Building2,
  ShoppingBag,
  Scissors,
  Users,
  ChevronRight,
  Palette,
  ExternalLink
} from 'lucide-react';
import { api } from '@drobe/api-client';
import { CelebrityLookModal } from './CelebrityLookModal';

interface DiscoverViewProps {
  posts: any[];
  stylists: any[];
  brands: any[];
  onSelectPost: (post: any) => void;
  onSelectStylist: (stylist: any) => void;
  onSelectBrand: (brand: any) => void;
  onOpenBooking?: (stylist: any, service?: any) => void;
  onNavigateOccasions?: () => void;
  onNavigateStudios?: () => void;
}

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  posts,
  stylists,
  brands,
  onSelectPost,
  onSelectStylist,
  onSelectBrand,
  onOpenBooking,
  onNavigateOccasions,
  onNavigateStudios
}) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [celebrityLooks, setCelebrityLooks] = useState<any[]>([]);
  const [selectedCelebLook, setSelectedCelebLook] = useState<any | null>(null);
  const [studios, setStudios] = useState<any[]>([]);

  const defaultCelebLooks = [
    {
      id: 'celeb-look-1',
      title: 'Royal Udaipur Palace Reception Silhouette',
      celebrity_name: 'Deepika Padukone Inspired',
      event_name: 'Royal Udaipur Palace Wedding Gala',
      image_url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      description: 'Deep emerald velvet cape gown with handcrafted antique gold zardozi borders and fluid tissue silk lehenga drape.',
      original_designer: 'Sabyasachi Mukherjee Couture',
      original_price_est: '₹4,80,000',
      silhouette_type: 'Regal Draped Cape & Floor-Length Bias Column',
      key_fabrics: 'Silk Velvet, Zardozi Hand-Work, Mulberry Tissue',
      color_palette: ['#1B4D3E', '#D4AF37', '#191919'],
      breakdown_items: [
        {
          piece_name: 'Zardozi Hand-Embroidered Velvet Cape',
          luxury_original_cost: '₹2,10,000',
          drobe_alternative_title: 'Emerald Silk Velvet Cape',
          boutique_name: 'Maison Heritage Kochi',
          price: '₹26,500',
          image_url: '/images/emerald_silk_gown.jpg'
        },
        {
          piece_name: 'Bias-Cut Pure Charmeuse Inner Slip',
          luxury_original_cost: '₹1,20,000',
          drobe_alternative_title: 'Mulberry Silk Slip Gown',
          boutique_name: 'Atelier Fort Kochi',
          price: '₹14,200',
          image_url: '/images/poplin_skirt_set.jpg'
        },
        {
          piece_name: 'Antique Polki Kundan Choker Pair',
          luxury_original_cost: '₹1,50,000',
          drobe_alternative_title: 'Handcrafted Heritage Polki Choker',
          boutique_name: 'Malabar Heritage Vault',
          price: '₹12,800',
          image_url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80'
        }
      ],
      budget_recreation_cost: '₹53,500',
      savings_percentage: 88,
      stylist_notes: 'The key to recreating this regal look without couture markup is investing in heavyweight velvet drape and keeping jewelry focused on a single statement antique choker.',
      reviewed_by_stylist_name: 'Maya Nambiar',
      is_expert_reviewed: true
    },
    {
      id: 'celeb-look-2',
      title: 'Old Money Venetian Black-Tie Tuxedo',
      celebrity_name: 'Jacob Elordi Inspired',
      event_name: 'Venice Film Festival Premiere & Gala',
      image_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      description: 'Unstructured midnight navy double-breasted tuxedo with satin peak lapels and fluid high-rise trousers.',
      original_designer: 'Bottega Veneta Sartorial',
      original_price_est: '₹3,90,000',
      silhouette_type: 'Relaxed Double-Breasted Tailoring',
      key_fabrics: 'Super 150s Merino Wool, Silk Satin Lapels',
      color_palette: ['#0B1B3D', '#191919', '#F7F5F0'],
      breakdown_items: [
        {
          piece_name: 'Midnight Navy Double-Breasted Tuxedo',
          luxury_original_cost: '₹2,80,000',
          drobe_alternative_title: 'Bespoke Navy Wool Tuxedo',
          boutique_name: 'Rohan Varma Sartorial',
          price: '₹32,000',
          image_url: '/images/linen_safari_suit.jpg'
        },
        {
          piece_name: 'Patent Leather Belgian Opera Pumps',
          luxury_original_cost: '₹1,10,000',
          drobe_alternative_title: 'Handcrafted Black Suede Slippers',
          boutique_name: 'Maison Artisans',
          price: '₹9,500',
          image_url: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80'
        }
      ],
      budget_recreation_cost: '₹41,500',
      savings_percentage: 89,
      stylist_notes: 'Focus on the waist suppression and high-rise trouser drape. Keep shirt collar points sharp and skip the cummerbund for modern elegance.',
      reviewed_by_stylist_name: 'Rohan Varma',
      is_expert_reviewed: true
    }
  ];

  const defaultStudios = [
    {
      id: 'studio-kochi',
      name: 'DROBE Atelier & Experience Centre · Kochi',
      city: 'Kochi',
      address: 'Atelier 4, Panampilly Nagar Waterfront Avenue, Kochi, Kerala 682036',
      image_url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80',
      rating: 4.96,
      reviews_count: 58,
      services: ['In-Person Draping', 'Silhouette Mapping', 'Senior Stylist Consultation', 'Boutique Fittings'],
      contact_phone: '+91 484 231 9900'
    },
    {
      id: 'studio-blr',
      name: 'DROBE Sartorial Lounge · Bengaluru',
      city: 'Bengaluru',
      address: '12th Main Road, Indiranagar, Bengaluru, Karnataka 560038',
      image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
      rating: 4.94,
      reviews_count: 72,
      services: ['Executive Wardrobe Fitting', 'Fabric Swatch Analysis', 'Studio Lookbook Shoot'],
      contact_phone: '+91 80 4120 7700'
    },
    {
      id: 'studio-calicut',
      name: 'DROBE Heritage Styling Studio · Kozhikode',
      city: 'Kozhikode',
      address: 'Beach Road Boulevard, Kozhikode, Kerala 673032',
      image_url: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80',
      rating: 4.97,
      reviews_count: 39,
      services: ['Bridal Trousseau Curation', 'Handloom Draping', 'Jewelry Matching'],
      contact_phone: '+91 495 276 4411'
    }
  ];

  const creatorCollections = [
    {
      id: 'creator-1',
      name: 'Aanya Sen',
      handle: '@aanyasen',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      collectionTitle: 'Monsoon Resort & Raw Silk Edit',
      category: 'Resort & Festive',
      itemsCount: 6,
      isExpertReviewed: true,
      reviewedBy: 'Maya Nambiar (Senior Stylist)',
      heroImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      bio: 'Visual artist and luxury content creator exploring slow fashion and handloom silhouettes.'
    },
    {
      id: 'creator-2',
      name: 'Kabir Mehta',
      handle: '@kabirsartorial',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
      collectionTitle: 'Contemporary Minimalist Tailoring',
      category: 'Tailored Luxury',
      itemsCount: 8,
      isExpertReviewed: true,
      reviewedBy: 'Rohan Varma (Master Stylist)',
      heroImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
      bio: 'Men’s style curator focused on neutral palettes, unstructured Italian tailoring, and Kerala Kasavu accents.'
    }
  ];

  useEffect(() => {
    // 1. Fetch Celebrity Looks
    api.celebrityLooks.list()
      .then((res) => {
        if (res && res.length > 0) {
          setCelebrityLooks(res);
        } else {
          setCelebrityLooks(defaultCelebLooks);
        }
      })
      .catch(() => {
        setCelebrityLooks(defaultCelebLooks);
      });

    // 2. Fetch Partner Experience Studios
    api.studios.list()
      .then((res) => {
        if (res && res.length > 0) {
          setStudios(res);
        } else {
          setStudios(defaultStudios);
        }
      })
      .catch(() => {
        setStudios(defaultStudios);
      });
  }, []);

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

  const activeCelebLooks = celebrityLooks.length > 0 ? celebrityLooks : defaultCelebLooks;
  const activeStudios = studios.length > 0 ? studios : defaultStudios;

  return (
    <div className="w-full space-y-14 animate-in fade-in duration-300">
      
      {/* Editorial Headline */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-widest text-[#b85d43] font-bold">
          Visual Discovery · Editorial Couture · Creator Collaborations
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif text-[#141414] font-bold">
          Curated Sartorial Trends & Recreate
        </h1>
        <p className="text-xs sm:text-sm text-[#7d6f64] font-serif italic">
          Discover human-crafted styling formulas, celebrity look breakdowns with verified boutique alternatives, and certified physical styling studios.
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

      {/* ---------------- SECTION 1.F: CELEBRITY & DESIGNER-INSPIRED "RECREATE THE LOOK" ---------------- */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 border-b border-[#2D2D2D]/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#b85d43] uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              Couture Architecture · Recreate the Look
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#141414] mt-0.5">
              Celebrity & Designer-Inspired Recreations
            </h2>
            <p className="text-xs text-[#7d6f64]">
              High-fashion couture silhouettes reverse-engineered with certified DROBE boutique alternatives & stylist direction.
            </p>
          </div>
          <span className="text-xs text-[#8A8176] font-medium hidden sm:block">
            Connected to Multi-Professional Booking
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeCelebLooks.map((look) => (
            <div
              key={look.id}
              className="bg-[#181818] text-[#EDE8DF] rounded-3xl overflow-hidden border border-[#2B2B2B] shadow-xl hover:shadow-2xl transition flex flex-col justify-between group"
            >
              {/* Image & Price Comparison Card Header */}
              <div className="relative aspect-[16/10] overflow-hidden bg-black/40">
                <img
                  src={look.image_url}
                  alt={look.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = '/images/emerald_silk_gown.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-black/30 to-transparent" />
                
                {/* Badges on Top */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                  {look.is_expert_reviewed && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-600/60 backdrop-blur-md flex items-center gap-1 shadow">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      DROBE Expert Reviewed
                    </span>
                  )}
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/70 text-[#D4AF37] border border-[#D4AF37]/40 backdrop-blur-md">
                    {look.event_name}
                  </span>
                </div>

                {/* Savings Callout Pill Bottom Left */}
                <div className="absolute bottom-3 left-3 bg-[#1F1F1F]/90 backdrop-blur-md border border-[#333] px-3 py-1.5 rounded-xl flex items-center gap-2">
                  <div className="text-left">
                    <span className="text-[9px] uppercase tracking-wider text-[#888] block">Estimated Savings</span>
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5">
                      <TrendingDown className="w-3 h-3" />
                      {look.savings_percentage}% Off Couture
                    </span>
                  </div>
                  <div className="h-6 w-px bg-[#333]" />
                  <div className="text-left">
                    <span className="text-[9px] uppercase tracking-wider text-[#888] block">DROBE Recreation</span>
                    <span className="text-xs font-bold text-white">{look.budget_recreation_cost}</span>
                  </div>
                </div>
              </div>

              {/* Body Details */}
              <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#D4AF37] uppercase tracking-wider">
                      {look.celebrity_name}
                    </span>
                    <span className="text-[11px] text-[#888] line-through">
                      Couture: {look.original_price_est}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#D4AF37] transition">
                    {look.title}
                  </h3>
                  <p className="text-xs text-[#AAA] line-clamp-2 leading-relaxed">
                    {look.description}
                  </p>
                </div>

                {/* Palette & Fabrics */}
                <div className="pt-2 border-t border-[#262626] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-[#777] uppercase font-semibold">Palette:</span>
                    <div className="flex gap-1">
                      {(look.color_palette || ['#1B4D3E', '#D4AF37', '#191919']).map((c: string, ci: number) => (
                        <div
                          key={ci}
                          style={{ backgroundColor: c }}
                          className="w-4 h-4 rounded-full border border-white/20"
                          title={c}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-[11px] text-[#BBB] font-medium truncate max-w-[180px]">
                    {look.silhouette_type}
                  </span>
                </div>

                {/* Stylist Endorsement Quote */}
                <div className="bg-[#121212] p-3 rounded-xl border border-[#222] text-[11px] text-[#999] italic">
                  "{look.stylist_notes?.slice(0, 95)}..."
                  <span className="block not-italic font-semibold text-[#D4AF37] text-[10px] mt-1">
                    — Reviewed by {look.reviewed_by_stylist_name}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedCelebLook(look)}
                    className="flex-1 py-2.5 px-3 bg-[#262626] hover:bg-[#333] text-white text-xs font-semibold rounded-xl border border-[#3A3A3A] transition flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>View Breakdown & Pieces</span>
                  </button>
                  <button
                    onClick={() => {
                      if (onOpenBooking && stylists.length > 0) {
                        const matchedStylist = stylists.find(s => s.user?.display_name?.toLowerCase().includes(look.reviewed_by_stylist_name.toLowerCase())) || stylists[0];
                        onOpenBooking(matchedStylist);
                      } else {
                        setSelectedCelebLook(look);
                      }
                    }}
                    className="py-2.5 px-3.5 bg-[#D4AF37] hover:bg-[#C29E2E] text-black text-xs font-bold rounded-xl transition flex items-center gap-1.5 shrink-0 shadow-md"
                  >
                    <Scissors className="w-3.5 h-3.5" />
                    <span>Recreate Look</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- SECTION 1.G: CREATOR COLLABORATIONS & SHOPPABLE EDITS ---------------- */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2 border-b border-white/40">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#b85d43] uppercase tracking-wider">
              <Users className="w-4 h-4 text-[#b85d43]" />
              Creator Collaborations & Edits
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#141414] mt-0.5">
              Creator-Curated Shoppable Collections
            </h2>
            <p className="text-xs text-[#7d6f64]">
              High-aesthetic creator lookbooks with tagged boutique pieces and optional DROBE Expert Reviewed badges.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {creatorCollections.map((creator) => (
            <div
              key={creator.id}
              className="glass-card rounded-2xl overflow-hidden border border-white/80 p-4 sm:p-5 flex flex-col justify-between space-y-4 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
                    onError={(e) => {
                      e.currentTarget.src = '/images/stylist_editorial.jpg';
                    }}
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-sm text-[#141414]">{creator.name}</h4>
                      <CheckCircle className="w-3.5 h-3.5 text-[#2d5a46]" />
                    </div>
                    <p className="text-xs text-[#7d6f64]">{creator.handle}</p>
                  </div>
                </div>

                {creator.isExpertReviewed && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 shrink-0">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Expert Reviewed
                  </span>
                )}
              </div>

              {/* Hero Image of Curated Collection */}
              <div className="h-48 rounded-xl overflow-hidden relative group">
                <img
                  src={creator.heroImage}
                  alt={creator.collectionTitle}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = '/images/hero_editorial.jpg';
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3 text-white">
                  <span className="text-[10px] uppercase font-bold text-[#D4AF37] block">Curated Capsule</span>
                  <h5 className="font-serif font-bold text-sm">{creator.collectionTitle}</h5>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <p className="text-[#555] italic">"{creator.bio}"</p>
                <div className="flex items-center justify-between text-[11px] text-[#7d6f64] pt-1 border-t border-white/50">
                  <span>Category: <strong className="text-[#141414]">{creator.category}</strong></span>
                  <span>{creator.itemsCount} Shoppable Pieces</span>
                </div>
                <div className="text-[10px] text-emerald-800 font-medium">
                  Verified by: {creator.reviewedBy}
                </div>
              </div>

              <button
                onClick={() => onSelectPost(posts[0] || {})}
                className="btn-capsule-black w-full text-xs py-2 px-3 flex items-center justify-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Shop Creator's Curated Edits</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- SECTION 1.H: PARTNER STYLING STUDIOS & EXPERIENCE CENTRES ---------------- */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2 border-b border-white/40">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#b85d43] uppercase tracking-wider">
              <Building2 className="w-4 h-4 text-[#b85d43]" />
              Certified Experience Centres & Ateliers
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#141414] mt-0.5">
              Partner Styling Studios & Ateliers
            </h2>
            <p className="text-xs text-[#7d6f64]">
              Physical destination lounges across Kochi, Bengaluru & Kozhikode for seasonal draping, silhouette proportion analysis & senior styling consultations.
            </p>
          </div>
          {onNavigateStudios && (
            <button
              onClick={onNavigateStudios}
              className="text-xs text-[#b85d43] font-bold hover:underline flex items-center gap-1"
            >
              View Studio Schedule
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {activeStudios.map((studio) => (
            <div
              key={studio.id}
              className="glass-card rounded-2xl overflow-hidden border border-white/80 p-4 sm:p-5 flex flex-col justify-between space-y-3 hover:shadow-lg transition"
            >
              <div className="h-40 rounded-xl overflow-hidden relative">
                <img
                  src={studio.image_url}
                  alt={studio.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/images/boutique_atelier.jpg';
                  }}
                />
                <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full text-[11px] font-bold text-[#D4AF37] flex items-center gap-1">
                  <Star className="w-3 h-3 fill-[#D4AF37]" />
                  {studio.rating || '4.95'}
                </div>
                <div className="absolute bottom-2.5 left-2.5 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-semibold text-white flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#b85d43]" />
                  {studio.city}
                </div>
              </div>

              <div>
                <h4 className="font-serif font-bold text-sm text-[#141414] line-clamp-1">{studio.name}</h4>
                <p className="text-[11px] text-[#7d6f64] line-clamp-2 mt-0.5">{studio.address}</p>
              </div>

              {/* Studio Services Pills */}
              <div className="flex flex-wrap gap-1">
                {(studio.services || ['Draping', 'Silhouette Mapping', 'Stylist Consultation']).slice(0, 3).map((srv: string, si: number) => (
                  <span key={si} className="text-[9px] px-2 py-0.5 bg-white/70 text-[#555] rounded-md font-medium border border-white/80">
                    ✓ {srv}
                  </span>
                ))}
              </div>

              <div className="pt-2 border-t border-white/50 flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#7d6f64]">Verified Lounge</span>
                <button
                  onClick={() => {
                    if (onNavigateStudios) {
                      onNavigateStudios();
                    } else if (onOpenBooking && stylists.length > 0) {
                      onOpenBooking(stylists[0]);
                    }
                  }}
                  className="px-3 py-1.5 bg-[#141414] hover:bg-black text-white text-xs font-semibold rounded-lg transition flex items-center gap-1"
                >
                  <Calendar className="w-3 h-3" />
                  <span>Book Atelier Pass</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Stylists Spotlight Bar */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/40">
          <div>
            <h2 className="text-xl font-serif font-bold text-[#141414]">Featured Human Stylists & Specialists</h2>
            <p className="text-xs text-[#7d6f64]">Verified professionals with 3-tier credibility certifications</p>
          </div>
          <button
            onClick={() => onSelectStylist(stylists[0])}
            className="text-xs text-[#b85d43] font-bold hover:underline flex items-center gap-1"
          >
            All Creative Talent
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
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
        <h2 className="text-xl font-serif font-bold text-[#141414]">Trending Visual Lookbooks & Formulas</h2>
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

      {/* ---------------- CELEBRITY LOOK MODAL ---------------- */}
      <CelebrityLookModal
        look={selectedCelebLook}
        isOpen={!!selectedCelebLook}
        onClose={() => setSelectedCelebLook(null)}
        onRequestStylist={(look) => {
          setSelectedCelebLook(null);
          if (onOpenBooking && stylists.length > 0) {
            const matchedStylist = stylists.find(s => s.user?.display_name?.toLowerCase().includes(look.reviewed_by_stylist_name?.toLowerCase())) || stylists[0];
            onOpenBooking(matchedStylist);
          }
        }}
        onBookOccasionTeam={(look) => {
          setSelectedCelebLook(null);
          if (onNavigateOccasions) {
            onNavigateOccasions();
          } else if (onOpenBooking && stylists.length > 0) {
            onOpenBooking(stylists[0]);
          }
        }}
      />

    </div>
  );
};
