import React, { useState } from 'react';
import { 
  Heart, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Palette, 
  Camera, 
  CheckCircle,
  ArrowRight,
  Phone,
  Mail
} from 'lucide-react';

interface WeddingViewProps {
  onOpenStylistBooking: (stylist: any) => void;
  stylists: any[];
}

export const WeddingView: React.FC<WeddingViewProps> = ({
  onOpenStylistBooking,
  stylists
}) => {
  const [activeTab, setActiveTab] = useState<'lookbooks' | 'coordination' | 'services'>('lookbooks');

  const weddingThemes = [
    {
      title: 'Kerala Kasavu Heritage & Gold',
      event: 'Morning Muhurtham & Reception',
      colors: ['#F7F5F0', '#D4AF37', '#191919', '#B85D43'],
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      description: 'Handwoven Balaramapuram Kasavu sarees with hand-carved gold zari, coupled with raw silk ivory jubbas for the groom.'
    },
    {
      title: 'Udaipur Sunset Royal Palette',
      event: 'Palace Sangeet & Cocktails',
      colors: ['#2D5A46', '#D4AF37', '#B85D43', '#191919'],
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      description: 'Deep forest green velvet bandhgalas for men, champagne lehengas with micro-pearl work for women.'
    },
    {
      title: 'Coastal Kumarakom Pastel Resort',
      event: 'Sunset Backwaters Reception',
      colors: ['#EAE8E3', '#B8B1A5', '#8A8176', '#FFFFFF'],
      image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
      description: 'Pure Italian linen double-breasted suits with cream pocket squares, paired with ethereal organza drape sarees.'
    }
  ];

  const weddingStylists = stylists.filter(s => 
    s.category?.toLowerCase().includes('wedding') || s.specializations?.some((sp: string) => sp.toLowerCase().includes('wedding'))
  );

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-white/40">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#b85d43] font-bold">
            DROBE Wedding & Occasions
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#141414] tracking-tight mt-1">
            The Wedding Styling Suite
          </h1>
          <p className="text-xs sm:text-sm text-[#7d6f64] font-serif italic mt-0.5">
            Holistic bridal styling, groom attire curation, family color palette coordination, and Kerala Kasavu heritage consultation.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('lookbooks')}
            className={`pill-glass text-xs py-1.5 px-3.5 ${activeTab === 'lookbooks' ? 'active' : ''}`}
          >
            Curated Themes
          </button>
          <button
            onClick={() => setActiveTab('coordination')}
            className={`pill-glass text-xs py-1.5 px-3.5 ${activeTab === 'coordination' ? 'active' : ''}`}
          >
            Trousseau Guide
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`pill-glass text-xs py-1.5 px-3.5 ${activeTab === 'services' ? 'active' : ''}`}
          >
            Bridal Stylists
          </button>
        </div>
      </div>

      {/* Lookbooks Tab */}
      {activeTab === 'lookbooks' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {weddingThemes.map((theme, idx) => (
            <div
              key={idx}
              className="glass-card rounded-3xl overflow-hidden shadow-xl border border-white/80 flex flex-col justify-between group"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-black/5">
                <img
                  src={theme.image}
                  alt={theme.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = '/images/hero_editorial.jpg';
                  }}
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-[#141414]">
                  {theme.event}
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#141414]">{theme.title}</h3>
                  <p className="text-xs text-[#5e564e] mt-1.5 leading-relaxed">{theme.description}</p>
                </div>

                {/* Color Harmony Palette */}
                <div className="space-y-1.5 pt-2 border-t border-white/60">
                  <span className="text-[10px] font-bold text-[#7d6f64] uppercase tracking-wider block">Palette Harmony</span>
                  <div className="flex items-center gap-2">
                    {theme.colors.map((c, i) => (
                      <div
                        key={i}
                        style={{ backgroundColor: c }}
                        className="w-7 h-7 rounded-lg border border-white/80 shadow-sm"
                      ></div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => onOpenStylistBooking(stylists[0])}
                  className="btn-capsule-black w-full text-xs py-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Book Bridal Consultation</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Coordination & Trousseau Tab */}
      {activeTab === 'coordination' && (
        <div className="glass-card p-6 sm:p-10 rounded-3xl space-y-6 border border-white/80">
          <h2 className="font-serif font-bold text-2xl text-[#141414]">
            Family Trousseau & Color Palette Lock
          </h2>
          <p className="text-xs sm:text-sm text-[#5e564e] leading-relaxed max-w-2xl">
            Avoid color clashes on stage. Our certified wedding stylists orchestrate cohesive shades between the bride, groom, parents, and bridal party across all ceremony functions.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            <div className="bg-white/60 p-4 rounded-2xl border border-white space-y-2 text-xs">
              <span className="font-bold text-[#b85d43]">Function 1: Haldi</span>
              <p className="text-[#5e564e]">Turmeric Gold, Warm Sand, and Raw Ochre linen drapes.</p>
            </div>
            <div className="bg-white/60 p-4 rounded-2xl border border-white space-y-2 text-xs">
              <span className="font-bold text-[#b85d43]">Function 2: Sangeet</span>
              <p className="text-[#5e564e]">Midnight Navy, Emerald Velvet, and Champagne Silk.</p>
            </div>
            <div className="bg-white/60 p-4 rounded-2xl border border-white space-y-2 text-xs">
              <span className="font-bold text-[#b85d43]">Function 3: Muhurtham</span>
              <p className="text-[#5e564e]">Balaramapuram Kasavu Ivory with 24k Gold Zari.</p>
            </div>
            <div className="bg-white/60 p-4 rounded-2xl border border-white space-y-2 text-xs">
              <span className="font-bold text-[#b85d43]">Function 4: Reception</span>
              <p className="text-[#5e564e]">Textured Virgin Wool Tweed, Rose Quartz & Black Tie.</p>
            </div>
          </div>
        </div>
      )}

      {/* Services / Stylists Tab */}
      {activeTab === 'services' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(weddingStylists.length > 0 ? weddingStylists : stylists).map((st) => (
            <div key={st.id} className="glass-card p-6 rounded-3xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={st.user?.avatar_url || '/images/stylist_editorial.jpg'}
                  alt={st.user?.display_name}
                  className="w-16 h-16 rounded-2xl object-cover border border-white shadow-sm"
                  onError={(e) => {
                    e.currentTarget.src = '/images/stylist_editorial.jpg';
                  }}
                />
                <div className="text-xs space-y-1">
                  <h4 className="font-bold text-sm text-[#141414]">{st.user?.display_name}</h4>
                  <p className="text-[#b85d43] font-semibold">{st.category}</p>
                  <p className="text-[#7d6f64]">{st.base_city} • Rating {st.rating || '4.9'}</p>
                </div>
              </div>
              <button
                onClick={() => onOpenStylistBooking(st)}
                className="btn-capsule-black text-xs py-2 px-4 shrink-0"
              >
                Book
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
