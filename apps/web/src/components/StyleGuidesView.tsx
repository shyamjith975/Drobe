import React, { useState } from 'react';
import { 
  Sparkles, 
  Palette, 
  CheckCircle, 
  Layers, 
  BookOpen, 
  Calendar, 
  ArrowRight,
  UserCheck
} from 'lucide-react';

interface StyleGuidesViewProps {
  styleGuides: any[];
  onOpenStylistBooking?: (stylistName: string) => void;
}

export const StyleGuidesView: React.FC<StyleGuidesViewProps> = ({
  styleGuides,
  onOpenStylistBooking
}) => {
  const [selectedGuide, setSelectedGuide] = useState<any>(styleGuides[0] || null);

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-300">
      
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-white/40">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#b85d43] font-bold">
            DROBE Sartorial Education
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#141414] tracking-tight mt-1">
            Editorial Style Guides
          </h1>
          <p className="text-xs sm:text-sm text-[#7d6f64] font-serif italic mt-0.5">
            Master outfit combinations, harmonious color palettes, and capsule formulas curated by certified human stylists.
          </p>
        </div>
      </div>

      {/* Guide Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {styleGuides.map((guide) => (
          <button
            key={guide.id}
            onClick={() => setSelectedGuide(guide)}
            className={`pill-glass text-xs py-1.5 px-4 whitespace-nowrap ${
              selectedGuide?.id === guide.id ? 'active' : ''
            }`}
          >
            {guide.category}: {guide.title.split(':')[0]}
          </button>
        ))}
      </div>

      {/* Featured Style Guide Hero Card */}
      {selectedGuide && (
        <article className="glass-card rounded-3xl p-6 sm:p-10 space-y-8 border border-white/80 shadow-xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#b85d43] bg-white/70 px-2.5 py-1 rounded-full border border-white">
                  {selectedGuide.category}
                </span>
                <span className="text-xs text-[#7d6f64] font-medium">Curated by Certified Stylists</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#141414] leading-tight">
                {selectedGuide.title}
              </h2>

              <p className="text-xs sm:text-sm text-[#5e564e] leading-relaxed">
                {selectedGuide.content}
              </p>

              {/* Verified Stylist Endorsement */}
              {selectedGuide.stylist && (
                <div className="p-4 bg-white/60 rounded-2xl border border-white flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedGuide.stylist.user?.avatar_url || '/images/stylist_editorial.jpg'}
                      alt={selectedGuide.stylist.user?.display_name}
                      className="w-12 h-12 rounded-xl object-cover border border-white shadow-sm"
                      onError={(e) => {
                        e.currentTarget.src = '/images/stylist_editorial.jpg';
                      }}
                    />
                    <div className="text-xs">
                      <div className="flex items-center gap-1 font-bold text-[#141414]">
                        <span>{selectedGuide.stylist.user?.display_name}</span>
                        <CheckCircle className="w-3.5 h-3.5 text-[#2d5a46]" />
                      </div>
                      <p className="text-[#7d6f64]">{selectedGuide.stylist.category}</p>
                    </div>
                  </div>

                  {onOpenStylistBooking && (
                    <button
                      onClick={() => onOpenStylistBooking(selectedGuide.stylist.user?.display_name)}
                      className="btn-capsule-black text-xs py-1.5 px-3.5"
                    >
                      <span>Consult</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Visual Lookbook Image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] bg-black/5 border border-white">
              <img
                src={selectedGuide.cover_image || '/images/hero_editorial.jpg'}
                alt={selectedGuide.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/images/hero_editorial.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end p-6">
                <span className="text-xs text-white/95 font-serif italic drop-shadow">
                  Visual Blueprint & Composition Guide
                </span>
              </div>
            </div>

          </div>

          {/* Color Palette & Formulas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/60">
            
            {/* Color Swatches */}
            <div className="bg-white/50 p-5 rounded-2xl border border-white space-y-3">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#b85d43]" />
                <h3 className="font-serif font-bold text-sm text-[#141414]">Harmonious Color Palette</h3>
              </div>
              <div className="flex items-center gap-3">
                {(selectedGuide.color_palette || ['#F4F1EA', '#B85D43', '#2D5A46', '#191919']).map((hex: string, idx: number) => (
                  <div key={idx} className="flex flex-col items-center gap-1.5">
                    <div
                      style={{ backgroundColor: hex }}
                      className="w-10 h-10 rounded-xl border border-white/80 shadow-md"
                    ></div>
                    <span className="font-mono text-[10px] text-[#7d6f64]">{hex}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Sartorial Principles */}
            <div className="bg-white/50 p-5 rounded-2xl border border-white space-y-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#2d5a46]" />
                <h3 className="font-serif font-bold text-sm text-[#141414]">Styling Commandments</h3>
              </div>
              <ul className="text-xs text-[#5e564e] space-y-1.5 list-disc list-inside">
                <li>Balance tailored structured outerwear with fluid drape base layers.</li>
                <li>Limit statement textures to 2 complementary materials per silhouette.</li>
                <li>Invest in virgin wool, mulberry silk, and Normandy flax over synthetic blends.</li>
              </ul>
            </div>

          </div>

        </article>
      )}

    </div>
  );
};
