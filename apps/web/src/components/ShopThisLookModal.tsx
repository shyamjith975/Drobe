import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  ShoppingBag, 
  Tag, 
  ExternalLink, 
  CheckCircle2, 
  Heart, 
  ShieldCheck, 
  MapPin,
  Sparkles
} from 'lucide-react';

export interface TaggedProduct {
  id: string;
  name: string;
  category: string;
  brand: string;
  priceINR: number;
  priceUSD: number;
  sizes: string[];
  inStock: boolean;
  image?: string;
  storeCity: string;
}

export interface ShopThisLookProps {
  look: {
    title: string;
    image: string;
    curator: string;
    curatorRole: string;
    products: TaggedProduct[];
  };
  onClose: () => void;
  onAddToCart?: (product: TaggedProduct, size: string) => void;
}

export const ShopThisLookModal: React.FC<ShopThisLookProps> = ({
  look,
  onClose,
  onAddToCart
}) => {
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [purchasedProducts, setPurchasedProducts] = useState<string[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSelectSize = (productId: string, size: string) => {
    setSelectedSizes(prev => ({ ...prev, [productId]: size }));
  };

  const handleBuyItem = (prod: TaggedProduct) => {
    const size = selectedSizes[prod.id] || prod.sizes[0];
    if (onAddToCart) onAddToCart(prod, size);
    setPurchasedProducts(prev => [...prev, prod.id]);
    setToastMsg(`Added "${prod.name}" (${size}) to Bag`);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const modalContent = (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(0, 0, 0, 0.65)',
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
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 bg-[#141414] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-3 border border-white/20">
          <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
          <span className="text-xs font-medium">{toastMsg}</span>
        </div>
      )}

      <div 
        className="garment-floating-card w-full max-w-3xl p-5 sm:p-8 space-y-6 relative border border-white shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-3 border-b border-black/5">
          <div className="space-y-0.5 pr-2">
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-[#b85d43]">
              <Tag className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Shop This Look • Verified Boutiques</span>
            </div>
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#141414] leading-tight">
              {look.title}
            </h2>
            <p className="text-xs text-[#7d6f64]">
              Curated by <strong>{look.curator}</strong> ({look.curatorRole})
            </p>
          </div>
          <button
            onClick={onClose}
            className="icon-btn-glass w-9 h-9 rounded-full shrink-0 shadow-sm"
            title="Close"
          >
            <X className="w-4 h-4 text-[#141414]" />
          </button>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          
          {/* Left: Look Visual Preview */}
          <div className="md:col-span-5 space-y-3">
            <div className="recom-image-container !h-[340px] md:!h-[400px]">
              <img
                src={look.image}
                alt={look.title}
                className="recom-image"
                onError={(e) => {
                  e.currentTarget.src = '/images/pink_tweed_coat.jpg';
                }}
              />
              <div className="recom-scrim"></div>
              <div className="recom-overlay-content">
                <span className="text-[10px] bg-white/95 text-[#141414] px-2.5 py-1 rounded-full font-bold shadow-sm inline-block mb-1">
                  {look.products.length} Tagged Garments
                </span>
                <p className="text-xs text-white drop-shadow font-serif italic">
                  Tap any item on the right to select sizing and purchase directly from verified boutiques.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Tagged Garments List */}
          <div className="md:col-span-7 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#7d6f64] uppercase tracking-wide">
                Tagged Boutique Pieces
              </span>
              <span className="text-[11px] text-[#2d5a46] font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Escrow Checkout
              </span>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {look.products.map((prod) => {
                const currentSize = selectedSizes[prod.id] || prod.sizes[0];
                const isBought = purchasedProducts.includes(prod.id);

                return (
                  <div
                    key={prod.id}
                    className="p-3.5 rounded-2xl bg-white/60 border border-white hover:bg-white transition-all space-y-2.5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-xs">
                        <span className="text-[10px] font-bold text-[#b85d43] uppercase tracking-wider block">
                          {prod.category}
                        </span>
                        <h4 className="font-bold text-sm text-[#141414]">{prod.name}</h4>
                        <p className="text-[#7d6f64] flex items-center gap-1 mt-0.5">
                          <span>{prod.brand}</span>
                          <span>•</span>
                          <MapPin className="w-3 h-3 text-[#b85d43]" />
                          <span>{prod.storeCity}</span>
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-serif font-bold text-base text-[#141414]">
                          ₹{prod.priceINR.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-[#7d6f64] block">(${prod.priceUSD})</span>
                      </div>
                    </div>

                    {/* Sizing & Add to Bag CTA */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-black/5">
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-[11px] text-[#7d6f64] mr-1">Size:</span>
                        {prod.sizes.map(sz => (
                          <button
                            key={sz}
                            onClick={() => handleSelectSize(prod.id, sz)}
                            className={`px-2 py-0.5 text-[10px] font-semibold rounded-md border transition-all ${
                              currentSize === sz
                                ? 'bg-[#141414] text-white border-[#141414]'
                                : 'bg-white/80 text-[#141414] border-stone-200 hover:border-black'
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => handleBuyItem(prod)}
                        className={`text-xs py-1.5 px-3 rounded-full font-bold flex items-center gap-1.5 transition-all ${
                          isBought
                            ? 'bg-emerald-600 text-white'
                            : 'btn-capsule-black'
                        }`}
                      >
                        {isBought ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Shop Piece</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total Look Estimate */}
            <div className="p-3.5 rounded-2xl bg-[#F7F5F0] border border-[#EAE8E3] flex items-center justify-between text-xs">
              <div>
                <span className="text-[#7d6f64] block">Complete Ensemble (All {look.products.length} Pieces):</span>
                <strong className="font-serif text-base text-[#141414]">
                  ₹{look.products.reduce((acc, p) => acc + p.priceINR, 0).toLocaleString()}
                </strong>
              </div>
              <span className="text-[10px] text-[#b85d43] font-bold">
                Direct Boutique Dispatch
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
};
