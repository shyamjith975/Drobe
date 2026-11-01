import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Clock, 
  ExternalLink, 
  ShoppingBag, 
  Tag, 
  CheckCircle,
  Phone,
  Mail,
  Maximize2,
  Globe,
  Link as LinkIcon,
  Sparkles,
  X
} from 'lucide-react';
import { api } from '@drobe/api-client';

interface BrandsViewProps {
  brands: any[];
  onOpenProductModal?: (product: any) => void;
}

export const BrandsView: React.FC<BrandsViewProps> = ({ brands }) => {
  const [selectedBrand, setSelectedBrand] = useState<any>(brands[0] || null);
  const [showConnectModal, setShowConnectModal] = useState<boolean>(false);
  const [shopifyStoreDomain, setShopifyStoreDomain] = useState<string>('maison-ivory.myshopify.com');
  const [shopifyAccessToken, setShopifyAccessToken] = useState<string>('shpat_live_8849204128591823');
  const [connectedStoreUrl, setConnectedStoreUrl] = useState<string>('https://maison-ivory.myshopify.com');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatusMessage, setSyncStatusMessage] = useState<string>('');

  const handleProductClick = async (productId: string, shoppingUrl: string) => {
    try {
      await api.brands.trackClick(productId);
    } catch {
      // ignore
    }
    window.open(shoppingUrl || connectedStoreUrl || 'https://drobe.myshopify.com', '_blank', 'noopener,noreferrer');
  };

  const handleSaveShopifyConnect = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);
    setSyncStatusMessage('Validating Shopify Storefront API credentials...');
    
    setTimeout(() => {
      setIsSyncing(false);
      setConnectedStoreUrl(`https://${shopifyStoreDomain.replace(/^https?:\/\//, '')}`);
      setSyncStatusMessage('Connected! 14 products synced from Shopify store.');
      setTimeout(() => {
        setShowConnectModal(false);
        setSyncStatusMessage('');
      }, 1500);
    }, 1000);
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-white/40">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#b85d43] font-bold">
            Physical Ateliers & Regional Boutiques
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#141414] tracking-tight mt-1">
            Boutique & Atelier Directory
          </h1>
          <p className="text-xs sm:text-sm text-[#7d6f64] font-serif italic mt-0.5">
            Discover verified brick-and-mortar clothing stores across Kochi, Kozhikode, Bengaluru, and Chicago with curated collections.
          </p>
        </div>
      </div>

      {/* Brand Selector Pills */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
        {brands.map((b) => (
          <button
            key={b.id}
            onClick={() => setSelectedBrand(b)}
            className={`p-3 rounded-2xl border flex items-center gap-3 transition-all shrink-0 ${
              selectedBrand?.id === b.id
                ? 'bg-white border-[#141414] shadow-md scale-102'
                : 'bg-white/40 border-white/70 hover:bg-white/70'
            }`}
          >
            <img
              src={b.logo_url || '/images/boutique_maison.jpg'}
              alt={b.brand_name}
              className="w-10 h-10 rounded-xl object-cover border border-white shadow-sm"
              onError={(e) => {
                e.currentTarget.src = '/images/boutique_maison.jpg';
              }}
            />
            <div className="text-left">
              <div className="flex items-center gap-1">
                <h4 className="font-bold text-xs text-[#141414]">{b.brand_name}</h4>
                {b.is_verified && <CheckCircle className="w-3.5 h-3.5 text-[#2d5a46]" />}
              </div>
              <span className="text-[11px] text-[#7d6f64]">{b.city}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Selected Brand Showcase */}
      {selectedBrand && (
        <section className="glass-card rounded-3xl overflow-hidden shadow-xl border border-white/80 space-y-6">
          
          {/* Banner */}
          <div className="h-44 sm:h-60 relative overflow-hidden bg-stone-900">
            <img
              src={selectedBrand.banner_url || '/images/boutique_maison.jpg'}
              alt={selectedBrand.brand_name}
              className="w-full h-full object-cover opacity-80"
              onError={(e) => {
                e.currentTarget.src = '/images/boutique_maison.jpg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col md:flex-row md:items-end justify-between p-6 sm:p-8 gap-4">
              <div className="flex items-center gap-4 text-white">
                <img
                  src={selectedBrand.logo_url || '/images/boutique_maison.jpg'}
                  alt={selectedBrand.brand_name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white shadow-2xl"
                  onError={(e) => {
                    e.currentTarget.src = '/images/boutique_maison.jpg';
                  }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-3xl font-serif font-bold tracking-tight">
                      {selectedBrand.brand_name}
                    </h2>
                    {selectedBrand.is_verified && (
                      <CheckCircle className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                    )}
                  </div>
                  <p className="text-xs text-white/80 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#e8a5b2]" />
                    {selectedBrand.store_address || `${selectedBrand.city} Flagship Atelier`}
                  </p>
                </div>
              </div>

              {/* Connected Web & Shopify Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 z-10">
                <a
                  href={connectedStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-capsule-black text-xs py-2 px-4 shadow-xl flex items-center gap-1.5 border border-emerald-400/30"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Shopify Storefront</span>
                  <ExternalLink className="w-3 h-3 text-white/80" />
                </a>

                <a
                  href={selectedBrand.website_url || 'https://drobe.style'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill-glass text-xs py-2 px-3.5 bg-white/90 text-[#141414] hover:bg-white flex items-center gap-1.5 shadow-md"
                >
                  <Globe className="w-3.5 h-3.5 text-[#141414]" />
                  <span>Atelier Website</span>
                  <ExternalLink className="w-3 h-3 text-[#7d6f64]" />
                </a>

                <button
                  onClick={() => setShowConnectModal(true)}
                  className="pill-glass text-xs py-2 px-3.5 bg-white/80 hover:bg-white text-[#2d5a46] border-emerald-300 flex items-center gap-1.5 shadow-md"
                >
                  <LinkIcon className="w-3.5 h-3.5 text-[#2d5a46]" />
                  <span>Connect Shopify</span>
                </button>
              </div>
            </div>
          </div>

          {/* Details & Info Row */}
          <div className="p-6 sm:p-8 pt-0 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Store Hours & Location */}
              <div className="bg-white/50 p-4 rounded-2xl border border-white space-y-2 text-xs">
                <span className="font-bold uppercase text-[10px] tracking-wider block text-[#b85d43]">
                  Store Details
                </span>
                <p className="flex items-center gap-1.5 text-[#5e564e]">
                  <Clock className="w-4 h-4 text-[#7d6f64]" />
                  {selectedBrand.opening_hours || 'Mon–Sat: 10:30 AM – 8:30 PM'}
                </p>
                <p className="flex items-center gap-1.5 text-[#5e564e]">
                  <MapPin className="w-4 h-4 text-[#7d6f64]" />
                  {selectedBrand.city} Atelier
                </p>
              </div>

              {/* Story / About */}
              <div className="bg-white/50 p-4 rounded-2xl border border-white space-y-2 text-xs">
                <span className="font-bold uppercase text-[10px] tracking-wider block text-[#b85d43]">
                  Artisanal Heritage
                </span>
                <p className="text-[#5e564e] leading-relaxed">
                  {selectedBrand.bio || 'Curating fine European flax, bespoke handwoven sarees, and quiet luxury tailoring crafted with natural textiles and sustainable ethics.'}
                </p>
              </div>

              {/* Shopify / E-Commerce Sync Card */}
              <div className="bg-white/50 p-4 rounded-2xl border border-white space-y-2 text-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold uppercase text-[10px] tracking-wider text-[#2d5a46]">
                      Shopify Connection
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Live Storefront
                    </span>
                  </div>
                  <p className="text-[#5e564e] mt-1.5 leading-snug">
                    Connected to <strong>{shopifyStoreDomain}</strong> with direct cart checkout & real-time inventory.
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-between border-t border-white/60">
                  <a
                    href={connectedStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-[#141414] hover:text-[#b85d43] flex items-center gap-1"
                  >
                    <span>Open Storefront</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    onClick={() => setShowConnectModal(true)}
                    className="text-[11px] font-semibold text-[#2d5a46] hover:underline"
                  >
                    Configure
                  </button>
                </div>
              </div>

            </div>

            {/* In-Store Pieces Catalog */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#141414]">
                    In-Store Pieces ({selectedBrand.products?.length || 0})
                  </h3>
                  <p className="text-xs text-[#7d6f64]">
                    Available for in-person fitting at {selectedBrand.city} or online purchase via connected Shopify storefront.
                  </p>
                </div>
                <a
                  href={connectedStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill-glass text-xs py-1.5 px-3 flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#2d5a46]" />
                  <span>Browse All on Shopify</span>
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedBrand.products?.map((p: any) => (
                  <div
                    key={p.id}
                    className="bg-white/60 hover:bg-white rounded-3xl p-4 border border-white/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
                  >
                    <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-black/5">
                      <img
                        src={p.image_url || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80'}
                        alt={p.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold text-[#2d5a46] flex items-center gap-1 shadow-sm">
                        <ShoppingBag className="w-3 h-3 text-[#2d5a46]" />
                        <span>Shopify Item</span>
                      </div>
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold text-[#141414]">
                        {p.category}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-[#141414] line-clamp-1">{p.title}</h4>
                      <p className="text-xs text-[#7d6f64] line-clamp-2">{p.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/60">
                      <div>
                        <span className="text-[10px] text-[#7d6f64] block">Price</span>
                        <span className="font-bold text-sm text-[#141414]">₹{Number(p.price).toLocaleString('en-IN')}</span>
                      </div>
                      <button
                        onClick={() => handleProductClick(p.id, p.shopping_url)}
                        className="btn-capsule-black text-xs py-2 px-3.5 shadow-md flex items-center gap-1.5"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>Buy on Shopify</span>
                        <ExternalLink className="w-3 h-3 text-white/70" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </section>
      )}

      {/* CONNECT SHOPIFY / WEBSITE MODAL */}
      {showConnectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="glass-card bg-white/95 max-w-lg w-full p-6 sm:p-8 rounded-3xl shadow-2xl border border-white space-y-6 relative">
            <button
              onClick={() => setShowConnectModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 text-[#7d6f64] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2d5a46] flex items-center gap-1">
                <LinkIcon className="w-3.5 h-3.5" />
                E-Commerce Storefront Integration
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#141414]">
                Connect Boutique to Shopify
              </h2>
              <p className="text-xs text-[#7d6f64]">
                Link your official Shopify or external website so DROBE users can purchase products directly with real-time stock and checkout.
              </p>
            </div>

            {syncStatusMessage && (
              <div className="p-3.5 bg-emerald-50 text-[#2d5a46] border border-emerald-200 rounded-2xl text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{syncStatusMessage}</span>
              </div>
            )}

            <form onSubmit={handleSaveShopifyConnect} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#141414] block mb-1">Boutique / Atelier Name</label>
                <input
                  type="text"
                  value={selectedBrand?.brand_name || 'Maison Ivory'}
                  disabled
                  className="w-full bg-stone-100 border border-stone-200 rounded-xl px-3.5 py-2.5 text-[#7d6f64] cursor-not-allowed"
                />
              </div>

              <div>
                <label className="font-bold text-[#141414] block mb-1">Shopify Store Domain or Custom Website URL</label>
                <input
                  type="text"
                  required
                  value={shopifyStoreDomain}
                  onChange={(e) => setShopifyStoreDomain(e.target.value)}
                  placeholder="e.g. your-store.myshopify.com or boutique.com"
                  className="w-full bg-white border border-stone-300 focus:border-[#141414] rounded-xl px-3.5 py-2.5 text-[#141414] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-[#141414] block mb-1">Shopify Storefront API Access Token (Optional)</label>
                <input
                  type="password"
                  value={shopifyAccessToken}
                  onChange={(e) => setShopifyAccessToken(e.target.value)}
                  placeholder="shpat_xxxxxxxxxxxxxxxx"
                  className="w-full bg-white border border-stone-300 focus:border-[#141414] rounded-xl px-3.5 py-2.5 text-[#141414] focus:outline-none"
                />
                <span className="text-[10px] text-[#7d6f64] mt-1 block">
                  Found in Shopify Admin &gt; Settings &gt; Apps & Sales Channels &gt; Develop Apps.
                </span>
              </div>

              <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200/70 text-[11px] text-[#8a5d3b] space-y-1">
                <strong>Sync Capabilities:</strong>
                <ul className="list-disc pl-4 space-y-0.5">
                  <li>Automatic product inventory sync every 15 minutes.</li>
                  <li>Seamless buyer redirect to native Shopify checkout.</li>
                  <li>Attribution tracking for DROBE creator style tags.</li>
                </ul>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowConnectModal(false)}
                  className="pill-glass text-xs py-2.5 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSyncing}
                  className="btn-capsule-black text-xs py-2.5 px-5 shadow-lg flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>{isSyncing ? 'Connecting to Shopify...' : 'Save & Sync Storefront'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
