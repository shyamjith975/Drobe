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
  ShieldCheck
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
  const [dbCities, setDbCities] = useState<string[]>(['All', 'Kochi', 'Kozhikode', 'Bengaluru', 'Mumbai', 'Delhi', 'Chicago']);

  const categories = ['All', 'Creative Director', 'Personal Stylist', 'Wedding Stylist', 'Celebrity Stylist'];

  useEffect(() => {
    api.stylists.getCities()
      .then((cities) => {
        if (cities && cities.length > 0) {
          const uniqueCities = ['All', ...Array.from(new Set(cities))];
          setDbCities(uniqueCities);
        }
      })
      .catch(() => {
        // Fallback to distinct cities from stylists prop
        if (stylists && stylists.length > 0) {
          const extracted = new Set<string>(['All']);
          stylists.forEach(s => {
            if (s.base_city) extracted.add(s.base_city.split('•')[0].split('&')[0].trim());
            (s.operating_cities || []).forEach((c: string) => extracted.add(c.trim()));
          });
          setDbCities(Array.from(extracted));
        }
      });
  }, [stylists]);

  const filteredStylists = stylists.filter((s) => {
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
    <div className="w-full space-y-8 animate-in fade-in duration-300">
      
      {/* Editorial Headline */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-white/40">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#b85d43] font-bold">
            Staff Concierge & Certified Talent
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#141414] tracking-tight mt-1">
            Certified Stylists & Atelier Staff
          </h1>
          <p className="text-xs sm:text-sm text-[#7d6f64] font-serif italic mt-0.5">
            Zero AI algorithms. Direct 1-on-1 consultations with verified celebrity stylists, bridal consultants, and personal wardrobe directors.
          </p>
        </div>

        {/* Filter Category Pills */}
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

      {/* Dynamic City Filter Pills fetched from DB */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar py-1">
        <MapPin className="w-4 h-4 text-[#b85d43] shrink-0" />
        <span className="text-xs font-bold text-[#7d6f64] shrink-0">City Hub:</span>
        {dbCities.map((city) => (
          <button
            key={city}
            onClick={() => setSelectedCity(city)}
            className={`pill-glass text-xs py-1.5 px-3.5 ${selectedCity === city ? 'active' : ''}`}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Stylist Cards Grid (Styled directly like the Staff / Shop Manager card from Template Image 1 & 2!) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStylists.map((stylist) => {
          const user = stylist.user || {};
          const isExpanded = expandedStylistId === stylist.id;

          return (
            <div
              key={stylist.id}
              className="glass-card p-6 rounded-3xl flex flex-col justify-between space-y-5"
            >
              {/* Header: Category Badge & Rating */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#b85d43]">
                    {stylist.category || 'Lead Atelier Stylist'}
                  </span>
                  <h3 className="font-serif font-bold text-lg text-[#141414]">
                    {user.display_name}
                  </h3>
                </div>
                <div className="flex items-center gap-1 bg-white/70 px-2.5 py-1 rounded-full text-xs font-bold text-[#141414] shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-[#d4af37] text-[#d4af37]" />
                  <span>{stylist.rating || '4.9'}</span>
                </div>
              </div>

              {/* Staff Profile Box (Template Image 1 Staff Box) */}
              <div className="flex items-center gap-4 bg-white/45 p-3.5 rounded-2xl border border-white/70">
                <img
                  src={user.avatar_url || '/images/stylist_editorial.jpg'}
                  alt={user.display_name}
                  className="w-16 h-16 rounded-2xl object-cover border border-white shadow-sm shrink-0"
                  onError={(e) => {
                    e.currentTarget.src = '/images/stylist_editorial.jpg';
                  }}
                />
                <div className="text-xs space-y-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <h4 className="font-bold text-sm text-[#141414] truncate">{user.display_name}</h4>
                    {stylist.verification_status === 'verified' && (
                      <CheckCircle className="w-3.5 h-3.5 text-[#2d5a46] shrink-0" />
                    )}
                  </div>
                  <p className="text-[#7d6f64] flex items-center gap-1 truncate">
                    <Phone className="w-3 h-3 text-[#2d5a46] shrink-0" />
                    +91 98470 12345
                  </p>
                  <p className="text-[#7d6f64] flex items-center gap-1 truncate">
                    <Mail className="w-3 h-3 text-[#b85d43] shrink-0" />
                    stylist@{user.username || 'drobe'}.style
                  </p>
                  <p className="text-[#7d6f64] flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-stone-500 shrink-0" />
                    {stylist.base_city} • {stylist.years_experience || 6}+ yrs exp
                  </p>
                </div>
              </div>

              {/* Bio snippet */}
              <p className="text-xs text-[#5e564e] line-clamp-2 italic font-serif">
                "{stylist.bio || 'Dedicated to architectural silhouettes, bespoke draping, and capsule wardrobe curation.'}"
              </p>

              {/* Services & Actions */}
              <div className="pt-2 border-t border-white/60 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#7d6f64]">Consultations from:</span>
                  <span className="font-bold text-sm text-[#141414]">
                    ₹{stylist.services?.[0]?.price ? Number(stylist.services[0].price).toLocaleString('en-IN') : '2,500'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenBooking(stylist)}
                    className="btn-capsule-black flex-1 text-xs py-2.5 px-4 font-semibold text-white hover:text-white"
                  >
                    <Calendar className="w-3.5 h-3.5 text-white" />
                    <span className="text-white hover:text-white font-semibold">
                      {currentUser && currentRole !== 'guest' ? 'Book Consultation' : 'Sign in to Book Consultation'}
                    </span>
                  </button>

                  <button
                    onClick={() => setExpandedStylistId(isExpanded ? null : stylist.id)}
                    className="icon-btn-glass w-9 h-9 rounded-full"
                    title="View Packages"
                  >
                    <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </button>
                </div>

                {/* Expanded Services Drawer */}
                {isExpanded && stylist.services && (
                  <div className="pt-2 space-y-2 animate-in fade-in">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7d6f64] block">
                      Available Service Packages:
                    </span>
                    {stylist.services.map((srv: any) => (
                      <div
                        key={srv.id}
                        onClick={() => onOpenBooking(stylist, srv)}
                        className="bg-white/70 p-2.5 rounded-xl border border-white hover:bg-white cursor-pointer flex items-center justify-between transition-colors text-xs"
                      >
                        <div>
                          <p className="font-semibold text-[#141414]">{srv.title}</p>
                          <p className="text-[10px] text-[#7d6f64]">{srv.duration_minutes} min • {srv.service_mode.replace('_', ' ')}</p>
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
