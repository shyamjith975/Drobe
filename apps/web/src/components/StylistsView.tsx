import React, { useState, useEffect } from 'react';
import { 
  Star, 
  MapPin, 
  CheckCircle, 
  Sparkles, 
  Phone,
  Mail,
  ChevronRight,
  Filter,
  Calendar,
  Clock,
  ShieldCheck,
  Camera,
  Scissors,
  Palette,
  Eye,
  UserCheck
} from 'lucide-react';

import { api } from '@drobe/api-client';

interface StylistsViewProps {
  stylists: any[];
  onOpenBooking: (stylist: any, service?: any) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  currentUser?: any;
  currentRole?: string;
}

export const StylistsView: React.FC<StylistsViewProps> = ({
  stylists,
  onOpenBooking,
  selectedCity,
  setSelectedCity,
  currentUser,
  currentRole,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedStylistId, setExpandedStylistId] = useState<string | null>(null);
  const [dbCities, setDbCities] = useState<string[]>(['All', 'Kochi', 'Bengaluru', 'Mumbai', 'Delhi', 'Kozhikode']);

  const categories = [
    { id: 'All', label: 'All Services', icon: Sparkles },
    { id: 'Fashion Stylist', label: 'Fashion Stylists', icon: Sparkles },
    { id: 'Beauty & Makeup', label: 'Beauty & Hair', icon: Palette },
    { id: 'Fashion Photographer', label: 'Photographers', icon: Camera },
    { id: 'Model & Casting', label: 'Models & Casting', icon: Eye },
    { id: 'Bespoke Designer', label: 'Custom Designers', icon: Scissors }
  ];

  // Extended Creative Professionals Pool covering Section 5 Categories
  const multiCategoryProfessionals = [
    {
      id: 'pro-beauty-1',
      user: {
        display_name: 'Ananya Sharma',
        username: 'ananyamakeup',
        avatar_url: '/images/stylist_maya.jpg'
      },
      category: 'Beauty & Makeup',
      base_city: 'Kochi & Bengaluru',
      rating: 4.95,
      verification_status: 'verified',
      years_experience: 8,
      bio: 'Celebrity and bridal makeup artist specializing in dewy architectural skin, HD airbrush, and South Indian Muhurtham hair couture.',
      services: [
        { id: 'srv-b1', title: 'Luxury Bridal Makeup & Hair Couture', price: 18000, duration_minutes: 180, service_mode: 'home_visit', advance_percentage: 50 },
        { id: 'srv-b2', title: 'Reception Glam & Draping Session', price: 9500, duration_minutes: 90, service_mode: 'physical_shopping', advance_percentage: 50 },
        { id: 'srv-b3', title: 'Virtual Skincare & Bridal Trousseau Prep', price: 3200, duration_minutes: 45, service_mode: 'virtual_consultation', advance_percentage: 50 }
      ]
    },
    {
      id: 'pro-photo-1',
      user: {
        display_name: 'Rohan Varma',
        username: 'rohanvarma',
        avatar_url: '/images/stylist_editorial.jpg'
      },
      category: 'Fashion Photographer',
      base_city: 'Mumbai & Kochi',
      rating: 4.98,
      verification_status: 'verified',
      years_experience: 10,
      bio: 'Vogue & Elle commercial and editorial fashion photographer. Available for high-fashion lookbook campaigns, model portfolios, and bridal editorials.',
      services: [
        { id: 'srv-p1', title: 'Full-Day Commercial Editorial Photoshoot', price: 35000, duration_minutes: 480, service_mode: 'physical_shopping', advance_percentage: 50 },
        { id: 'srv-p2', title: 'Studio Portfolio & Lookbook Shoot (4 Looks)', price: 18500, duration_minutes: 240, service_mode: 'physical_shopping', advance_percentage: 50 },
        { id: 'srv-p3', title: 'Virtual Moodboard & Lighting Consultation', price: 4000, duration_minutes: 60, service_mode: 'virtual_consultation', advance_percentage: 50 }
      ]
    },
    {
      id: 'pro-model-1',
      user: {
        display_name: 'Tara George',
        username: 'tarageorge',
        avatar_url: '/images/shop_manager.jpg'
      },
      category: 'Model & Casting',
      base_city: 'Bengaluru & Kochi',
      rating: 4.92,
      verification_status: 'verified',
      years_experience: 5,
      bio: 'Runway and campaign model featured across Lakmé Fashion Week and artisanal handloom lookbooks. Height: 5\'9", editorial and commercial signed.',
      services: [
        { id: 'srv-m1', title: 'Commercial Brand Campaign Assignment', price: 22000, duration_minutes: 360, service_mode: 'physical_shopping', advance_percentage: 50 },
        { id: 'srv-m2', title: 'Designer E-Commerce & Lookbook Shoot', price: 14000, duration_minutes: 240, service_mode: 'physical_shopping', advance_percentage: 50 }
      ]
    },
    {
      id: 'pro-designer-1',
      user: {
        display_name: 'Siddharth Nair',
        username: 'siddharthbespoke',
        avatar_url: '/images/hero_editorial.jpg'
      },
      category: 'Bespoke Designer',
      base_city: 'Kochi & Delhi',
      rating: 4.96,
      verification_status: 'verified',
      years_experience: 12,
      bio: 'Savile Row trained bespoke tailor and heritage couturier. Specializes in hand-loomed Kasavu bandhgalas, tuxedos, and customized occasion wear.',
      services: [
        { id: 'srv-d1', title: 'Bespoke Suit & Bandhgala Fitting Consultation', price: 5000, duration_minutes: 60, service_mode: 'physical_shopping', advance_percentage: 50 },
        { id: 'srv-d2', title: 'Custom Bridal Gown & Trousseau Design', price: 12000, duration_minutes: 120, service_mode: 'home_visit', advance_percentage: 50 }
      ]
    }
  ];

  // Merge backend stylists with creative professionals pool
  const allProfessionals = [
    ...(stylists && stylists.length > 0 ? stylists.map(s => ({ ...s, category: s.category || 'Fashion Stylist' })) : []),
    ...multiCategoryProfessionals
  ];

  useEffect(() => {
    api.stylists.getCities()
      .then((cities) => {
        if (cities && cities.length > 0) {
          const uniqueCities = ['All', ...Array.from(new Set(cities))];
          setDbCities(uniqueCities);
        }
      })
      .catch(() => {
        // Fallback cities
      });
  }, [stylists]);

  const filteredProfessionals = allProfessionals.filter((s) => {
    const cityQuery = selectedCity.toLowerCase().trim();
    const matchesCity = selectedCity === 'All' || 
      (s.base_city && s.base_city.toLowerCase().includes(cityQuery)) ||
      (s.operating_cities && s.operating_cities.some((c: string) => c.toLowerCase().includes(cityQuery)));
    
    const catQuery = selectedCategory.toLowerCase().trim();
    const matchesCategory = selectedCategory === 'All' || 
      (s.category && s.category.toLowerCase().includes(catQuery));

    return matchesCity && matchesCategory;
  });

  return (
    <div className="w-full space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Editorial Headline */}
      <div className="glass-card p-5 sm:p-8 rounded-3xl border border-white/80 space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-white/60">
          <div>
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#b85d43] font-bold">
              Creative & Beauty Services Marketplace
            </span>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#141414] tracking-tight mt-1">
              Creative Professionals & Artisans
            </h1>
            <p className="text-xs sm:text-sm text-[#7d6f64] font-serif italic mt-0.5">
              Verified fashion stylists, bridal makeup artists, fashion photographers, models, and bespoke couture designers.
            </p>
          </div>

          {/* Filter Category Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`pill-glass text-xs py-1.5 px-3 flex items-center gap-1.5 transition-all ${
                    selectedCategory === cat.id ? 'active' : ''
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic City Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar py-1 text-xs">
          <MapPin className="w-4 h-4 text-[#b85d43] shrink-0" />
          <span className="text-xs font-bold text-[#7d6f64] shrink-0">Filter by City Hub:</span>
          {dbCities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`pill-glass text-xs py-1.5 px-3 shrink-0 ${selectedCity === city ? 'active' : ''}`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Professional Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {filteredProfessionals.map((pro) => {
          const user = pro.user || {};
          const isExpanded = expandedStylistId === pro.id;

          return (
            <div
              key={pro.id}
              className="glass-card p-5 sm:p-6 rounded-3xl flex flex-col justify-between space-y-4 border border-white/80 hover:shadow-xl transition-all"
            >
              {/* Header: Category Badge & Rating */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#b85d43] block">
                    {pro.category || 'Creative Consultant'}
                  </span>
                  <h3 className="font-serif font-bold text-lg text-[#141414]">
                    {user.display_name}
                  </h3>
                </div>
                <div className="flex items-center gap-1 bg-white/70 px-2.5 py-1 rounded-full text-xs font-bold text-[#141414] shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-[#d4af37] text-[#d4af37]" />
                  <span>{pro.rating || '4.9'}</span>
                </div>
              </div>

              {/* Staff Profile Box */}
              <div className="flex items-center gap-3.5 bg-white/45 p-3 rounded-2xl border border-white/70">
                <img
                  src={user.avatar_url || '/images/stylist_editorial.jpg'}
                  alt={user.display_name}
                  className="w-14 h-14 rounded-2xl object-cover border border-white shadow-sm shrink-0"
                  onError={(e) => {
                    e.currentTarget.src = '/images/stylist_editorial.jpg';
                  }}
                />
                <div className="text-xs space-y-0.5 min-w-0">
                  <div className="flex items-center gap-1">
                    <h4 className="font-bold text-sm text-[#141414] truncate">{user.display_name}</h4>
                    {pro.verification_status === 'verified' && (
                      <CheckCircle className="w-3.5 h-3.5 text-[#2d5a46] shrink-0" />
                    )}
                  </div>
                  <p className="text-[#7d6f64] flex items-center gap-1 truncate text-[11px]">
                    <Phone className="w-3 h-3 text-[#2d5a46] shrink-0" />
                    Verified Atelier Concierge
                  </p>
                  <p className="text-[#7d6f64] flex items-center gap-1 truncate text-[11px]">
                    <MapPin className="w-3 h-3 text-[#b85d43] shrink-0" />
                    {pro.base_city} • {pro.years_experience || 6}+ yrs exp
                  </p>
                </div>
              </div>

              {/* Bio */}
              <p className="text-xs text-[#5e564e] line-clamp-2 italic font-serif">
                "{pro.bio || 'Dedicated to architectural silhouettes, bespoke craftsmanship, and luxury curation.'}"
              </p>

              {/* Services & Actions */}
              <div className="pt-2 border-t border-white/60 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#7d6f64]">Sessions from:</span>
                  <span className="font-bold text-sm text-[#141414]">
                    ₹{pro.services?.[0]?.price ? Number(pro.services[0].price).toLocaleString('en-IN') : '2,500'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenBooking(pro)}
                    className="btn-capsule-black flex-1 text-xs py-2.5 px-3 font-semibold text-white hover:text-white"
                  >
                    <Calendar className="w-3.5 h-3.5 text-white" />
                    <span className="text-white hover:text-white font-semibold">
                      {currentUser && currentRole !== 'guest' ? 'Book Consultation' : 'Sign in to Book'}
                    </span>
                  </button>

                  <button
                    onClick={() => setExpandedStylistId(isExpanded ? null : pro.id)}
                    className="icon-btn-glass w-9 h-9 rounded-full"
                    title="View Packages"
                  >
                    <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </button>
                </div>

                {/* Expanded Services Drawer */}
                {isExpanded && pro.services && (
                  <div className="pt-2 space-y-1.5 animate-in fade-in">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7d6f64] block">
                      Verified Service Packages:
                    </span>
                    {pro.services.map((srv: any) => (
                      <div
                        key={srv.id}
                        onClick={() => onOpenBooking(pro, srv)}
                        className="bg-white/70 p-2.5 rounded-xl border border-white hover:bg-white cursor-pointer flex items-center justify-between transition-colors text-xs"
                      >
                        <div>
                          <p className="font-semibold text-[#141414]">{srv.title}</p>
                          <p className="text-[10px] text-[#7d6f64]">{srv.duration_minutes} min • {srv.service_mode ? srv.service_mode.replace('_', ' ') : 'Session'}</p>
                        </div>
                        <span className="font-bold text-[#141414]">₹{Number(srv.price).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
