import React, { useState } from 'react';
import { 
  Sparkles, 
  Palette, 
  Layers, 
  Compass, 
  ShoppingBag, 
  Check, 
  ArrowRight, 
  Heart, 
  UserCheck, 
  Sliders, 
  Info,
  Calendar,
  Eye,
  CheckCircle2,
  X
} from 'lucide-react';

interface FashionRecommendationsViewProps {
  onOpenBooking: (stylist: any, service?: any) => void;
  onViewLook?: (item: any) => void;
  onSaveToCollection?: (item: any) => void;
}

export const FashionRecommendationsView: React.FC<FashionRecommendationsViewProps> = ({
  onOpenBooking,
  onViewLook,
  onSaveToCollection
}) => {
  // Filter States
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [selectedAesthetic, setSelectedAesthetic] = useState<string>('all');
  const [selectedSeason, setSelectedSeason] = useState<string>('Pre-Fall 2026');
  const [savedItems, setSavedItems] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [inspectingLook, setInspectingLook] = useState<any | null>(null);

  const colors = [
    { id: 'all', name: 'All Palettes', hex: 'linear-gradient(135deg, #191919, #F7F5F0, #8A8176)' },
    { id: 'charcoal', name: 'Charcoal & Onyx', hex: '#191919', text: 'text-white' },
    { id: 'ivory', name: 'Ivory & Cream', hex: '#F7F5F0', border: 'border-stone-300' },
    { id: 'blush', name: 'Powder Blush Pink', hex: '#F4DCD6' },
    { id: 'taupe', name: 'Warm Taupe & Sand', hex: '#8A8176', text: 'text-white' },
    { id: 'emerald', name: 'Imperial Emerald', hex: '#1B4D3E', text: 'text-white' },
    { id: 'navy', name: 'Midnight Navy', hex: '#1A2A3A', text: 'text-white' },
    { id: 'saffron', name: 'Golden Saffron', hex: '#D4AF37' },
    { id: 'sage', name: 'Muted Sage Green', hex: '#8F9779', text: 'text-white' }
  ];

  const materials = [
    { id: 'all', name: 'All Materials', count: 18 },
    { id: 'tweed', name: 'Textured Wool Tweed', count: 4, badge: 'Heritage' },
    { id: 'cashmere', name: 'Grade-A Mongolian Cashmere', count: 3, badge: 'Ultra-Soft' },
    { id: 'silk', name: 'Mulberry Silk & Georgette', count: 5, badge: 'Lustrous' },
    { id: 'poplin', name: 'Italian Long-Staple Poplin', count: 3, badge: 'Crisp' },
    { id: 'linen', name: 'Normandy Flax Linen', count: 2, badge: 'Breathable' },
    { id: 'leather', name: 'Supple Nappa Calfskin', count: 3, badge: 'Artisanal' },
    { id: 'virgin-wool', name: 'Double-Faced Virgin Wool', count: 4, badge: 'Warm' }
  ];

  const aesthetics = [
    { id: 'all', label: 'All Aesthetics' },
    { id: 'old-money', label: 'Old Money Heritage' },
    { id: 'minimalist', label: 'Quiet Luxury Minimalist' },
    { id: 'parisian', label: 'Parisian Tailored Chic' },
    { id: 'wedding', label: 'Royal Occasion & Wedding' },
    { id: 'streetwear', label: 'High-Fashion Casual' },
    { id: 'korean', label: 'Korean Modern Drape' }
  ];

  // Curated Recommendation Looks
  const recommendationsData = [
    {
      id: 'rec-1',
      title: 'Textured Wool Tweed Coat & Silk Slip',
      category: 'Outerwear & Formal',
      aesthetic: 'old-money',
      color: 'blush',
      colorName: 'Powder Blush Pink & Noir',
      material: 'tweed',
      materialDetails: '85% Virgin Wool, 15% Mulberry Silk Tweed',
      lining: '100% Cupro Silk Lining',
      price: '$3,500',
      priceINR: '₹48,000',
      image: '/images/pink_tweed_coat.jpg',
      stylist: 'Maya Nambiar',
      stylistRole: 'DROBE Lead Fashion Consultant',
      stylistAvatar: '/images/shop_manager.jpg',
      stylistNotes: 'The structured double-breasted tweed silhouette contrasts effortlessly against the fluid interior dress. Pair with black knee-high leather boots for the quintessential Milanese bon-ton look.',
      swatches: ['#F4DCD6', '#191919', '#D4AF37'],
      complementaryPieces: ['Belgian Suede Loafers', 'Structured Handbag with Gold Clasp', 'Silk Twill Scarf']
    },
    {
      id: 'rec-2',
      title: 'Grade-A Cashmere Ribbed Mockneck & Wool Trousers',
      category: 'Knitwear & Tailoring',
      aesthetic: 'minimalist',
      color: 'taupe',
      colorName: 'Warm Taupe & Heather Oatmeal',
      material: 'cashmere',
      materialDetails: '100% Superfine 2-Ply Mongolian Cashmere',
      lining: 'Unlined / Natural Air Weave',
      price: '$1,850',
      priceINR: '₹24,000',
      image: '/images/cashmere_mockneck.jpg',
      stylist: 'Rohan Varma',
      stylistRole: 'Celebrity & Tailoring Stylist',
      stylistAvatar: '/images/stylist_editorial.jpg',
      stylistNotes: 'Tactile minimalism at its apex. The 2-ply ribbed knit offers understated elegance without logo flash. Excellent paired with pleated high-waisted wool trousers.',
      swatches: ['#8A8176', '#EAE8E3', '#2A2A2A'],
      complementaryPieces: ['Nappa Leather Chelsea Boots', 'Minimalist Horn Watch', 'Cashmere Wrap']
    },
    {
      id: 'rec-3',
      title: 'Normandy Flax Linen Relaxed Safari Suit',
      category: 'Tailored Sets',
      aesthetic: 'parisian',
      color: 'ivory',
      colorName: 'Crisp Ivory & Sand Linen',
      material: 'linen',
      materialDetails: '100% Long-Staple Normandy Flax Linen',
      lining: 'Mother-of-Pearl Button Closures',
      price: '$1,400',
      priceINR: '₹18,500',
      image: '/images/linen_safari_suit.jpg',
      stylist: 'Maya Nambiar',
      stylistRole: 'DROBE Lead Fashion Consultant',
      stylistAvatar: '/images/shop_manager.jpg',
      stylistNotes: 'Linen that breathes and develops character with age. Relaxed shoulders and natural slub texture provide effortless European resort chic.',
      swatches: ['#F7F5F0', '#8A8176', '#C2B29D'],
      complementaryPieces: ['Woven Leather Slides', 'Tortoiseshell Sunglasses', 'Canvas Tote']
    },
    {
      id: 'rec-4',
      title: 'Imperial Emerald Silk Accordion Gown',
      category: 'Evening & Occasion',
      aesthetic: 'wedding',
      color: 'emerald',
      colorName: 'Deep Imperial Emerald & Gold',
      material: 'silk',
      materialDetails: '100% Heavy Mulberry Silk Georgette',
      lining: 'French Hand-Rolled Hems',
      price: '$2,900',
      priceINR: '₹38,500',
      image: '/images/emerald_silk_gown.jpg',
      stylist: 'Elena Rostova',
      stylistRole: 'Occasion & Red Carpet Stylist',
      stylistAvatar: '/images/stylist_maya.jpg',
      stylistNotes: 'Permanent sunburst pleats cascade effortlessly with movement. The jewel emerald tone complements both warm and cool skin undertones.',
      swatches: ['#1B4D3E', '#D4AF37', '#0F2820'],
      complementaryPieces: ['Satin Evening Clutch', 'Gold Drop Earrings', 'Velvet Ankle Strap Heels']
    },
    {
      id: 'rec-5',
      title: 'Architectural Poplin Shirt & Pleated Skirt Set',
      category: 'Two-Piece Set',
      aesthetic: 'korean',
      color: 'saffron',
      colorName: 'Golden Saffron & Crisp White',
      material: 'poplin',
      materialDetails: 'Egyptian Giza Long-Staple Cotton Poplin',
      lining: 'Reinforced French Collar',
      price: '$1,650',
      priceINR: '₹22,000',
      image: '/images/poplin_skirt_set.jpg',
      stylist: 'Rohan Varma',
      stylistRole: 'Celebrity & Tailoring Stylist',
      stylistAvatar: '/images/stylist_editorial.jpg',
      stylistNotes: 'A modern Seoul-inspired architectural drape. Crisp white poplin button-down offset by the radiant marigold pleated skirt.',
      swatches: ['#D4AF37', '#FFFFFF', '#191919'],
      complementaryPieces: ['Chunky Polished Loafers', 'Architectural Box Bag', 'Silver Signet Ring']
    },
    {
      id: 'rec-6',
      title: 'Milano Heavy Virgin Wool Double-Faced Overcoat',
      category: 'Outerwear',
      aesthetic: 'old-money',
      color: 'charcoal',
      colorName: 'Charcoal Noir & Slate',
      material: 'virgin-wool',
      materialDetails: '100% Double-Faced Virgin Wool (620 GSM)',
      lining: 'Satin Sleeve Lining with Horn Buttons',
      price: '$3,800',
      priceINR: '₹52,000',
      image: '/images/textured_tweed_coat.jpg',
      stylist: 'Maya Nambiar',
      stylistRole: 'DROBE Lead Fashion Consultant',
      stylistAvatar: '/images/shop_manager.jpg',
      stylistNotes: 'Substantial weight that drapes cleanly without creasing. Styled with a tonal charcoal turtleneck for timeless winter sophistication.',
      swatches: ['#191919', '#3E3E3E', '#EAE8E3'],
      complementaryPieces: ['Cashmere Beanie', 'Polished Calf Chelsea Boots', 'Leather Tech Gloves']
    }
  ];

  // Filter Logic
  const filteredRecommendations = recommendationsData.filter((item) => {
    const matchesColor = selectedColor === 'all' || item.color === selectedColor;
    const matchesMaterial = selectedMaterial === 'all' || item.material === selectedMaterial;
    const matchesAesthetic = selectedAesthetic === 'all' || item.aesthetic === selectedAesthetic;
    return matchesColor && matchesMaterial && matchesAesthetic;
  });

  const handleToggleSave = (id: string, title: string) => {
    if (savedItems.includes(id)) {
      setSavedItems(savedItems.filter(item => item !== id));
      triggerToast(`Removed "${title}" from saved lookbook`);
    } else {
      setSavedItems([...savedItems, id]);
      triggerToast(`Saved "${title}" to your Fashion Moodboard`);
      if (onSaveToCollection) onSaveToCollection({ id, title });
    }
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-300">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#141414] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-3 border border-white/20">
          <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/80 bg-gradient-to-r from-white/60 via-white/40 to-[#F7F5F0]/60 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-gradient-to-bl from-[#dfb798]/20 to-transparent rounded-full blur-2xl pointer-events-none"></div>

        <div className="max-w-2xl relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-white text-[#8A8176] text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            AI Stylist Discovery Engine
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#141414] tracking-tight">
            Curated Recommendations
          </h1>
          <p className="text-sm text-[#7d6f64] leading-relaxed">
            Discover tailored outfit harmonies filtered by luxury fabrics, curated color swatches, and bespoke aesthetics. Backed by certified DROBE fashion consultants.
          </p>
        </div>

        {/* Season Selector */}
        <div className="mt-6 pt-4 border-t border-white/60 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#8A8176]" />
            <span className="text-xs font-semibold text-[#141414]">Active Editorial Season:</span>
            <span className="text-xs font-bold text-[#b85d43] bg-[#b85d43]/10 px-2.5 py-0.5 rounded-full">
              {selectedSeason}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#7d6f64]">
            <span>Showing <strong className="text-[#141414]">{filteredRecommendations.length}</strong> verified matches</span>
            {(selectedColor !== 'all' || selectedMaterial !== 'all' || selectedAesthetic !== 'all') && (
              <button 
                onClick={() => {
                  setSelectedColor('all');
                  setSelectedMaterial('all');
                  setSelectedAesthetic('all');
                }}
                className="text-[11px] underline font-semibold text-[#b85d43] hover:text-[#8f3e28]"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* FILTER CONTROL SUITE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* 1. COLOR PALETTES */}
        <div className="glass-card p-5 rounded-3xl border border-white/80 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/60">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#b85d43]" />
              <h3 className="font-serif font-bold text-sm text-[#141414]">Color Palette</h3>
            </div>
            <span className="text-[10px] text-[#7d6f64] uppercase font-bold tracking-wider">
              {colors.find(c => c.id === selectedColor)?.name}
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
            {colors.map((c) => {
              const isSelected = selectedColor === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedColor(c.id)}
                  className={`p-2 rounded-2xl flex flex-col items-center gap-1.5 transition-all text-center ${
                    isSelected 
                      ? 'bg-[#141414] text-white shadow-md scale-102' 
                      : 'bg-white/40 hover:bg-white/70 text-[#141414] border border-white/60'
                  }`}
                >
                  <div 
                    style={{ background: c.hex }} 
                    className={`w-6 h-6 rounded-full shadow-inner ${c.border || ''} flex items-center justify-center`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white drop-shadow" />}
                  </div>
                  <span className="text-[10px] font-semibold truncate w-full">
                    {c.name.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. MATERIAL & FABRIC */}
        <div className="glass-card p-5 rounded-3xl border border-white/80 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/60">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#8A8176]" />
              <h3 className="font-serif font-bold text-sm text-[#141414]">Material & Fabric</h3>
            </div>
            <span className="text-[10px] text-[#7d6f64] uppercase font-bold tracking-wider">
              {materials.find(m => m.id === selectedMaterial)?.name}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1 max-h-[160px] overflow-y-auto no-scrollbar">
            {materials.map((m) => {
              const isSelected = selectedMaterial === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMaterial(m.id)}
                  className={`text-xs py-1.5 px-3 rounded-full transition-all flex items-center gap-1.5 ${
                    isSelected 
                      ? 'bg-[#141414] text-white font-semibold' 
                      : 'bg-white/50 text-[#141414] hover:bg-white/80 border border-white/70'
                  }`}
                >
                  <span>{m.name}</span>
                  {m.badge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-black/5 text-[#7d6f64]'
                    }`}>
                      {m.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. AESTHETIC & SILHOUETTE */}
        <div className="glass-card p-5 rounded-3xl border border-white/80 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/60">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#d4af37]" />
              <h3 className="font-serif font-bold text-sm text-[#141414]">Silhouette & Aesthetic</h3>
            </div>
            <span className="text-[10px] text-[#7d6f64] uppercase font-bold tracking-wider">
              {aesthetics.find(a => a.id === selectedAesthetic)?.label}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {aesthetics.map((a) => {
              const isSelected = selectedAesthetic === a.id;
              return (
                <button
                  key={a.id}
                  onClick={() => setSelectedAesthetic(a.id)}
                  className={`text-xs py-1.5 px-3 rounded-full transition-all ${
                    isSelected 
                      ? 'bg-[#141414] text-white font-semibold' 
                      : 'bg-white/50 text-[#141414] hover:bg-white/80 border border-white/70'
                  }`}
                >
                  {a.label}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* RECOMMENDATION RESULTS GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#141414]">
            Recommended Outfits & Pairings
          </h2>
          <span className="text-xs text-[#7d6f64]">
            Showing {filteredRecommendations.length} matches
          </span>
        </div>

        {filteredRecommendations.length === 0 ? (
          <div className="glass-card p-12 text-center rounded-3xl border border-white/80 space-y-3">
            <Info className="w-8 h-8 text-[#8A8176] mx-auto opacity-70" />
            <h3 className="font-serif text-lg font-bold text-[#141414]">No looks match this specific combination</h3>
            <p className="text-xs text-[#7d6f64] max-w-md mx-auto">
              Try choosing 'All Materials' or 'All Palettes' to explore our broader pre-fall editorial lookbooks.
            </p>
            <button
              onClick={() => {
                setSelectedColor('all');
                setSelectedMaterial('all');
                setSelectedAesthetic('all');
              }}
              className="btn-capsule-black text-xs py-2 px-5 mt-2"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecommendations.map((item) => {
              const isSaved = savedItems.includes(item.id);

              return (
                <div 
                  key={item.id}
                  className="glass-card rounded-3xl border border-white/80 overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300 group p-2.5 mb-2"
                >
                  {/* Fixed Size Image & Badges Container */}
                  <div className="recom-image-container">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="recom-image"
                      onError={(e) => {
                        e.currentTarget.src = '/images/pink_tweed_coat.jpg';
                      }}
                    />

                    {/* Dark Editorial Vignette Scrim */}
                    <div className="recom-scrim"></div>

                    {/* Category & Aesthetic Tags */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-auto">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-bold text-[#141414] bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm">
                          {item.category}
                        </span>
                        <span className="text-[10px] font-bold text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                          {item.materialDetails.split(',')[0]}
                        </span>
                      </div>

                      {/* Bookmark Button */}
                      <button
                        onClick={() => handleToggleSave(item.id, item.title)}
                        className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#141414] hover:bg-white hover:scale-110 transition-all shadow-md shrink-0"
                        title="Save Look"
                      >
                        <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                      </button>
                    </div>

                    {/* High-Contrast Bottom Editorial Info with Clean Margins & Padding */}
                    <div className="recom-overlay-content">
                      <div className="mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 drop-shadow">
                          {item.colorName}
                        </span>
                      </div>
                      <h3 className="font-serif text-lg font-bold leading-snug text-white drop-shadow-md mb-2">
                        {item.title}
                      </h3>
                      <div className="flex items-center justify-between pt-2 border-t border-white/25">
                        <span className="font-serif text-base font-bold text-white drop-shadow">
                          {item.price}
                        </span>
                        <span className="text-[11px] font-semibold text-white/90 bg-black/50 px-2.5 py-0.5 rounded-full border border-white/20">
                          {item.priceINR}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Editorial Body Details */}
                  <div className="p-4 sm:p-5 space-y-4 flex-1 flex flex-col justify-between">
                    
                    {/* Swatches & Composition */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#7d6f64] uppercase tracking-wider">Palette & Composition</span>
                        <div className="flex items-center gap-1.5">
                          {item.swatches.map((hex, i) => (
                            <span 
                              key={i} 
                              style={{ backgroundColor: hex }} 
                              className="w-3.5 h-3.5 rounded-full border border-white shadow-sm"
                              title={hex}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-[#141414] font-medium bg-white/50 p-2.5 rounded-xl border border-white/60">
                        {item.materialDetails} • <span className="text-[#7d6f64]">{item.lining}</span>
                      </p>
                    </div>

                    {/* Stylist Commentary */}
                    <div className="space-y-1.5 bg-[#F7F5F0]/70 p-3 rounded-2xl border border-[#EAE8E3]">
                      <div className="flex items-center gap-2">
                        <img 
                          src={item.stylistAvatar} 
                          alt={item.stylist} 
                          className="w-5 h-5 rounded-full object-cover border border-white"
                          onError={(e) => {
                            e.currentTarget.src = '/images/shop_manager.jpg';
                          }}
                        />
                        <span className="text-[10px] font-bold text-[#141414]">{item.stylist}</span>
                        <span className="text-[9px] text-[#7d6f64]">({item.stylistRole})</span>
                      </div>
                      <p className="text-[11px] text-[#555] leading-relaxed italic">
                        "{item.stylistNotes}"
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <button
                        onClick={() => {
                          setInspectingLook(item);
                          if (onViewLook) onViewLook(item);
                        }}
                        className="btn-capsule-black text-xs py-2 px-3 flex items-center justify-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Look</span>
                      </button>
                      
                      <button
                        onClick={() => onOpenBooking({ display_name: item.stylist, avatar_url: item.stylistAvatar })}
                        className="pill-glass text-xs py-2 px-3 flex items-center justify-center gap-1.5 hover:bg-white"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-[#b85d43]" />
                        <span>Book Stylist</span>
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* INSPECT LOOK MODAL */}
      {inspectingLook && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="garment-floating-card w-full max-w-2xl p-6 sm:p-8 space-y-6 relative border border-white shadow-2xl">
            
            {/* Modal Header with Title & Close Button */}
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-black/5">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#b85d43] block">
                  Bespoke Editorial Breakdown
                </span>
                <h2 className="font-serif font-bold text-2xl text-[#141414]">
                  {inspectingLook.title}
                </h2>
              </div>
              <button
                onClick={() => setInspectingLook(null)}
                className="icon-btn-glass w-9 h-9 rounded-full shrink-0 shadow-sm hover:scale-105 transition-transform"
                title="Close"
              >
                <X className="w-4 h-4 text-[#141414]" />
              </button>
            </div>

            {/* Modal Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Image & Palettes */}
              <div className="space-y-3">
                <div className="h-80 w-full rounded-2xl overflow-hidden border border-white shadow-sm bg-[#f5ede6]">
                  <img
                    src={inspectingLook.image}
                    alt={inspectingLook.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/images/pink_tweed_coat.jpg';
                    }}
                  />
                </div>
                <div className="flex items-center justify-between bg-white/60 p-3 rounded-2xl border border-white/80">
                  <span className="text-xs font-bold text-[#141414]">Curated Palette</span>
                  <div className="flex items-center gap-2">
                    {inspectingLook.swatches.map((hex: string, i: number) => (
                      <span
                        key={i}
                        style={{ backgroundColor: hex }}
                        className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                        title={hex}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Garment Details & Stylist Recommendation */}
              <div className="space-y-4">
                <div className="bg-white/50 p-4 rounded-2xl border border-white/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#b85d43] uppercase tracking-wide">
                      {inspectingLook.category}
                    </span>
                    <span className="font-serif text-lg font-bold text-[#141414]">
                      {inspectingLook.price} <span className="text-xs text-[#7d6f64] font-sans font-normal">({inspectingLook.priceINR})</span>
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-[#141414]">{inspectingLook.materialDetails}</h4>
                  <p className="text-xs text-[#7d6f64]">Interior: {inspectingLook.lining}</p>
                </div>

                <div className="bg-[#F7F5F0] p-4 rounded-2xl border border-[#EAE8E3] space-y-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={inspectingLook.stylistAvatar}
                      alt={inspectingLook.stylist}
                      className="w-6 h-6 rounded-full object-cover border border-white"
                      onError={(e) => {
                        e.currentTarget.src = '/images/shop_manager.jpg';
                      }}
                    />
                    <div>
                      <h5 className="text-xs font-bold text-[#141414]">{inspectingLook.stylist}</h5>
                      <p className="text-[10px] text-[#7d6f64]">{inspectingLook.stylistRole}</p>
                    </div>
                  </div>
                  <p className="text-xs text-[#555] italic leading-relaxed">
                    "{inspectingLook.stylistNotes}"
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-[#7d6f64] uppercase tracking-wider block">
                    Recommended Complementary Pieces
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {inspectingLook.complementaryPieces.map((piece: string, idx: number) => (
                      <span
                        key={idx}
                        className="text-xs bg-white/70 border border-white px-2.5 py-1 rounded-full text-[#141414] font-medium"
                      >
                        ✓ {piece}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      const stylistInfo = { display_name: inspectingLook.stylist, avatar_url: inspectingLook.stylistAvatar };
                      setInspectingLook(null);
                      onOpenBooking(stylistInfo);
                    }}
                    className="btn-capsule-black w-full py-3 text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Book Consultation for this Look</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
