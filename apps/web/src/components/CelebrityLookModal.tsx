import React from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Sparkles,
  ShieldCheck,
  ShoppingBag,
  Scissors,
  Camera,
  CheckCircle,
  TrendingDown,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface CelebrityLookModalProps {
  look: any;
  isOpen: boolean;
  onClose: () => void;
  onRequestStylist?: (look: any) => void;
  onBookOccasionTeam?: (look: any) => void;
}

export const CelebrityLookModal: React.FC<CelebrityLookModalProps> = ({
  look,
  isOpen,
  onClose,
  onRequestStylist,
  onBookOccasionTeam
}) => {
  if (!isOpen || !look) return null;

  const modalContent = (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto'
      }}
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#141414] border border-[#2A2A2A] rounded-2xl shadow-2xl text-[#EDE8DF] overflow-hidden my-auto animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#242424] bg-[#181818] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#222] border border-[#333] flex items-center justify-center text-[#D4AF37]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg sm:text-xl text-white font-medium">{look.title}</h3>
                {look.is_expert_reviewed && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    DROBE Expert Reviewed
                  </span>
                )}
              </div>
              <p className="text-xs text-[#9E9E9E] mt-0.5">
                Inspiration: <span className="text-[#EDE8DF] font-medium">{look.celebrity_name}</span> · {look.event_name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#888] hover:text-white rounded-lg hover:bg-[#252525] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Hero Look Info & Comparison Banner */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center bg-[#1A1A1A] border border-[#2B2B2B] rounded-2xl p-4 sm:p-5">
            <div className="md:col-span-4 h-64 rounded-xl overflow-hidden relative shadow-lg">
              <img
                src={look.image_url}
                alt={look.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/images/hero_editorial.jpg';
                }}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3">
                <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-semibold">Haute Couture</span>
                <p className="text-xs text-white font-medium truncate">{look.original_designer}</p>
              </div>
            </div>

            <div className="md:col-span-8 space-y-4">
              <div>
                <span className="text-[11px] font-semibold text-[#D4AF37] uppercase tracking-wider">Aesthetic Architecture</span>
                <h4 className="font-serif text-lg text-white font-medium mt-0.5">{look.silhouette_type}</h4>
                <p className="text-xs text-[#BBB] mt-1.5 leading-relaxed">{look.description}</p>
              </div>

              {/* Price & Savings Comparison Box */}
              <div className="grid grid-cols-3 gap-3 p-3.5 bg-[#121212] border border-[#282828] rounded-xl text-center">
                <div>
                  <span className="text-[10px] text-[#777] uppercase tracking-wider block">Couture Price</span>
                  <span className="text-xs sm:text-sm font-semibold text-[#999] line-through mt-0.5 block">{look.original_price_est}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#D4AF37] uppercase tracking-wider block font-bold">DROBE Recreation</span>
                  <span className="text-xs sm:text-sm font-bold text-white mt-0.5 block">{look.budget_recreation_cost}</span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-400 uppercase tracking-wider block font-bold">Estimated Savings</span>
                  <span className="text-xs sm:text-sm font-bold text-emerald-400 mt-0.5 flex items-center justify-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5" />
                    {look.savings_percentage}%
                  </span>
                </div>
              </div>

              {/* Palette & Fabrics */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <div>
                  <span className="text-[10px] text-[#777] uppercase tracking-wider block mb-1">Color Palette</span>
                  <div className="flex gap-1.5">
                    {(look.color_palette || ['#1B4D3E', '#D4AF37', '#191919']).map((c: string, ci: number) => (
                      <div
                        key={ci}
                        style={{ backgroundColor: c }}
                        className="w-5 h-5 rounded-md border border-white/20 shadow-sm"
                        title={c}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <span className="text-[10px] text-[#777] uppercase tracking-wider block mb-1">Textile Direction</span>
                  <span className="text-xs text-[#DDD] font-medium">{look.key_fabrics}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown Items with DROBE Boutique Alternatives */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                Outfit Breakdown & Verified Boutique Alternatives
              </h4>
              <span className="text-xs text-[#888]">Directly sourceable from DROBE partners</span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {(look.breakdown_items || []).map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-[#181818] border border-[#272727] rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={item.image_url}
                      alt={item.piece_name}
                      className="w-14 h-16 object-cover rounded-lg border border-[#333] shrink-0"
                      onError={(e) => {
                        e.currentTarget.src = '/images/textured_tweed_coat.jpg';
                      }}
                    />
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#888] font-semibold">{item.piece_name}</span>
                      <h5 className="text-xs sm:text-sm font-medium text-white">{item.drobe_alternative_title}</h5>
                      <p className="text-xs text-[#D4AF37] font-medium mt-0.5">
                        {item.boutique_name} · <span className="text-white font-bold">{item.price}</span>
                        {item.luxury_original_cost && (
                          <span className="text-[#666] line-through ml-2 text-[11px]">{item.luxury_original_cost}</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (onRequestStylist) onRequestStylist(look);
                    }}
                    className="px-3 py-1.5 bg-[#262626] hover:bg-[#333] text-white text-xs font-semibold rounded-lg border border-[#3A3A3A] transition flex items-center gap-1.5 self-end sm:self-center"
                  >
                    View Boutique Piece
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Stylist Expert Review */}
          <div className="bg-[#191919] border border-[#262626] rounded-xl p-4 sm:p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Stylist Direction Note
              </span>
              <span className="text-[11px] text-[#888]">Reviewed by {look.reviewed_by_stylist_name}</span>
            </div>
            <p className="text-xs sm:text-sm text-[#CCC] leading-relaxed italic">
              "{look.stylist_notes}"
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-[#242424] bg-[#181818] flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-[#777]">
            Connect this look directly to multiple styling services.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (onRequestStylist) onRequestStylist(look);
              }}
              className="px-4 py-2 bg-[#262626] hover:bg-[#333] text-white text-xs font-semibold rounded-lg border border-[#3A3A3A] transition flex items-center gap-1.5"
            >
              <Scissors className="w-4 h-4 text-[#D4AF37]" />
              Request Stylist Recreate
            </button>
            <button
              onClick={() => {
                if (onBookOccasionTeam) onBookOccasionTeam(look);
              }}
              className="px-5 py-2 bg-[#D4AF37] hover:bg-[#B89628] text-black text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              Book Multi-Professional Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
};
