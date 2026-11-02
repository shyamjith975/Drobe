import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Palette, 
  Layers, 
  ShoppingBag, 
  Check, 
  ArrowRight, 
  Heart, 
  UserCheck, 
  Calendar, 
  Eye, 
  CheckCircle2, 
  X, 
  Plus, 
  Edit3, 
  Trash2, 
  Copy, 
  Upload, 
  RotateCcw, 
  Tag, 
  SlidersHorizontal,
  Scissors
} from 'lucide-react';

interface FashionRecommendationsViewProps {
  onOpenBooking: (stylist: any, service?: any) => void;
  onViewLook?: (item: any) => void;
  onSaveToCollection?: (item: any) => void;
  currentRole?: string;
  currentUser?: any;
}

export const FashionRecommendationsView: React.FC<FashionRecommendationsViewProps> = ({
  onOpenBooking,
  onViewLook,
  onSaveToCollection,
  currentRole,
  currentUser
}) => {
  const isStylist = currentRole === 'stylist' || currentRole === 'consultant';

  // Filter States
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [selectedAesthetic, setSelectedAesthetic] = useState<string>('all');
  const [selectedSeason, setSelectedSeason] = useState<string>('Pre-Fall 2026');
  const [savedItems, setSavedItems] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [inspectingLook, setInspectingLook] = useState<any | null>(null);

  // Stylist View Filters
  const [stylistFilterMode, setStylistFilterMode] = useState<'all' | 'custom' | 'archive'>('all');

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

  // Default Curated Recommendations Data
  const defaultRecommendationsData = [
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
      complementaryPieces: ['Belgian Suede Loafers', 'Structured Handbag with Gold Clasp', 'Silk Twill Scarf'],
      occasion: 'Winter Daywear & Gallery Openings',
      isCustom: false
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
      complementaryPieces: ['Nappa Leather Chelsea Boots', 'Minimalist Horn Watch', 'Cashmere Wrap'],
      occasion: 'Executive Capsule & Private Travel',
      isCustom: false
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
      complementaryPieces: ['Woven Leather Slides', 'Tortoiseshell Sunglasses', 'Canvas Tote'],
      occasion: 'Summer Riviera & Resort Lounging',
      isCustom: false
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
      stylistAvatar: '/images/stylist_editorial.jpg',
      stylistNotes: 'Permanent sunburst pleats cascade effortlessly with movement. The jewel emerald tone complements both warm and cool skin undertones.',
      swatches: ['#1B4D3E', '#D4AF37', '#0F2820'],
      complementaryPieces: ['Satin Evening Clutch', 'Gold Drop Earrings', 'Velvet Ankle Strap Heels'],
      occasion: 'Black Tie Gala & Reception Evening',
      isCustom: false
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
      complementaryPieces: ['Chunky Polished Loafers', 'Architectural Box Bag', 'Silver Signet Ring'],
      occasion: 'Creative Industry Events & Luncheons',
      isCustom: false
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
      image: '/images/hero_editorial.jpg',
      stylist: 'Maya Nambiar',
      stylistRole: 'DROBE Lead Fashion Consultant',
      stylistAvatar: '/images/shop_manager.jpg',
      stylistNotes: 'Substantial weight that drapes cleanly without creasing. Styled with a tonal charcoal turtleneck for timeless winter sophistication.',
      swatches: ['#191919', '#3E3E3E', '#EAE8E3'],
      complementaryPieces: ['Cashmere Beanie', 'Polished Calf Chelsea Boots', 'Leather Tech Gloves'],
      occasion: 'Autumn / Winter Urban Commutes',
      isCustom: false
    }
  ];

  // Recommendations State backed by localStorage
  const STORAGE_KEY = 'drobe_stylist_recommendations';
  const [recommendations, setRecommendations] = useState<any[]>(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse cached recommendations:', e);
    }
    return defaultRecommendationsData;
  });

  // Sync to localStorage
  const persistRecommendations = (updated: any[]) => {
    setRecommendations(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to persist recommendations to localStorage:', e);
    }
  };

  // Curation / Editing Modal State
  const [isCuratingModalOpen, setIsCuratingModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Modal Form States
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('Outerwear & Formal');
  const [formAesthetic, setFormAesthetic] = useState('old-money');
  const [formColor, setFormColor] = useState('blush');
  const [formColorName, setFormColorName] = useState('Powder Blush Pink & Noir');
  const [formMaterial, setFormMaterial] = useState('tweed');
  const [formMaterialDetails, setFormMaterialDetails] = useState('85% Virgin Wool, 15% Mulberry Silk Tweed');
  const [formLining, setFormLining] = useState('100% Cupro Silk Lining');
  const [formPrice, setFormPrice] = useState('$2,800');
  const [formPriceINR, setFormPriceINR] = useState('₹36,000');
  const [formImage, setFormImage] = useState('/images/pink_tweed_coat.jpg');
  const [formStylistNotes, setFormStylistNotes] = useState('');
  const [formSwatches, setFormSwatches] = useState<string[]>(['#F4DCD6', '#191919', '#D4AF37']);
  const [formComplementary, setFormComplementary] = useState<string[]>(['Belgian Suede Loafers', 'Silk Twill Scarf']);
  const [formOccasion, setFormOccasion] = useState('Bespoke Client Wardrobe');
  const [newTagInput, setNewTagInput] = useState('');
  const [newSwatchInput, setNewSwatchInput] = useState('#D4AF37');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Open Create New Look Modal
  const handleOpenCreateModal = () => {
    setEditingItemId(null);
    setFormTitle('');
    setFormCategory('Outerwear & Formal');
    setFormAesthetic('old-money');
    setFormColor('blush');
    setFormColorName('Custom Curated Palette');
    setFormMaterial('cashmere');
    setFormMaterialDetails('Grade-A Double-Faced Cashmere');
    setFormLining('Hand-Rolled Silk Interior Finish');
    setFormPrice('$2,400');
    setFormPriceINR('₹32,000');
    setFormImage('/images/cashmere_mockneck.jpg');
    setFormStylistNotes('Tailored specifically for refined personal expression. Seamlessly coordinates with high-waisted tailored trousers and gold accents.');
    setFormSwatches(['#191919', '#D4AF37', '#F7F5F0']);
    setFormComplementary(['Suede Chelsea Boots', 'Structured Minimalist Tote', 'Gold Signet Ring']);
    setFormOccasion('Client Seasonal Wardrobe Capsule');
    setIsCuratingModalOpen(true);
  };

  // Open Edit Existing Look Modal
  const handleOpenEditModal = (item: any) => {
    setEditingItemId(item.id);
    setFormTitle(item.title || '');
    setFormCategory(item.category || 'Outerwear & Formal');
    setFormAesthetic(item.aesthetic || 'old-money');
    setFormColor(item.color || 'charcoal');
    setFormColorName(item.colorName || 'Curated Palette');
    setFormMaterial(item.material || 'tweed');
    setFormMaterialDetails(item.materialDetails || '');
    setFormLining(item.lining || '');
    setFormPrice(item.price || '$2,500');
    setFormPriceINR(item.priceINR || '₹35,000');
    setFormImage(item.image || '/images/pink_tweed_coat.jpg');
    setFormStylistNotes(item.stylistNotes || '');
    setFormSwatches(item.swatches || ['#191919', '#D4AF37']);
    setFormComplementary(item.complementaryPieces || ['Loafers', 'Silk Scarf']);
    setFormOccasion(item.occasion || 'Client Style Consultation');
    setIsCuratingModalOpen(true);
  };

  // Duplicate Look ("Create so many options")
  const handleDuplicateLook = (item: any) => {
    const cloned = {
      ...item,
      id: `rec-custom-${Date.now()}`,
      title: `${item.title} (Option ${Math.floor(Math.random() * 90 + 10)})`,
      isCustom: true
    };
    const updated = [cloned, ...recommendations];
    persistRecommendations(updated);
    triggerToast(`Created new variation: "${cloned.title}"`);
  };

  // Delete Look
  const handleDeleteLook = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to remove "${title}" from your style guides?`)) {
      const updated = recommendations.filter(item => item.id !== id);
      persistRecommendations(updated);
      triggerToast(`Removed "${title}" from style guides`);
    }
  };

  // Reset to Defaults
  const handleResetDefaults = () => {
    if (window.confirm('Reset all recommendations to DROBE original catalog presets?')) {
      persistRecommendations(defaultRecommendationsData);
      triggerToast('Reset recommendations to DROBE defaults');
    }
  };

  // Handle Image File Upload (converts to base64 data URL)
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB. Please choose a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormImage(event.target.result as string);
          triggerToast('Lookbook image loaded successfully');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Add Complementary Piece Tag
  const handleAddComplementary = () => {
    if (newTagInput.trim() && !formComplementary.includes(newTagInput.trim())) {
      setFormComplementary([...formComplementary, newTagInput.trim()]);
      setNewTagInput('');
    }
  };

  // Remove Complementary Piece Tag
  const handleRemoveComplementary = (tag: string) => {
    setFormComplementary(formComplementary.filter(t => t !== tag));
  };

  // Add Color Swatch
  const handleAddSwatch = () => {
    if (newSwatchInput && !formSwatches.includes(newSwatchInput)) {
      setFormSwatches([...formSwatches, newSwatchInput]);
    }
  };

  // Remove Color Swatch
  const handleRemoveSwatch = (hex: string) => {
    if (formSwatches.length <= 1) {
      alert('Must retain at least 1 color swatch.');
      return;
    }
    setFormSwatches(formSwatches.filter(s => s !== hex));
  };

  // Save Look Form Submit
  const handleSaveLook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert('Please enter a Look Title.');
      return;
    }

    const stylistName = currentUser?.profile?.display_name || 'Maya Nambiar';
    const stylistRole = currentUser?.stylist_profile?.category || 'Certified DROBE Stylist';
    const stylistAvatar = currentUser?.profile?.avatar_url || '/images/stylist_editorial.jpg';

    if (editingItemId) {
      // Edit existing look
      const updated = recommendations.map((item) => {
        if (item.id === editingItemId) {
          return {
            ...item,
            title: formTitle,
            category: formCategory,
            aesthetic: formAesthetic,
            color: formColor,
            colorName: formColorName,
            material: formMaterial,
            materialDetails: formMaterialDetails,
            lining: formLining,
            price: formPrice,
            priceINR: formPriceINR,
            image: formImage,
            stylistNotes: formStylistNotes,
            swatches: formSwatches,
            complementaryPieces: formComplementary,
            occasion: formOccasion,
            stylist: stylistName,
            stylistRole: stylistRole,
            stylistAvatar: stylistAvatar,
            isCustom: true
          };
        }
        return item;
      });
      persistRecommendations(updated);
      triggerToast(`Updated style guide look: "${formTitle}"`);
    } else {
      // Create new look
      const newLook = {
        id: `rec-custom-${Date.now()}`,
        title: formTitle,
        category: formCategory,
        aesthetic: formAesthetic,
        color: formColor,
        colorName: formColorName,
        material: formMaterial,
        materialDetails: formMaterialDetails,
        lining: formLining,
        price: formPrice,
        priceINR: formPriceINR,
        image: formImage,
        stylist: stylistName,
        stylistRole: stylistRole,
        stylistAvatar: stylistAvatar,
        stylistNotes: formStylistNotes,
        swatches: formSwatches,
        complementaryPieces: formComplementary,
        occasion: formOccasion,
        isCustom: true
      };
      persistRecommendations([newLook, ...recommendations]);
      triggerToast(`Curated & added new style look: "${formTitle}"`);
    }

    setIsCuratingModalOpen(false);
  };

  // Filter Logic
  const filteredRecommendations = recommendations.filter((item) => {
    const matchesColor = selectedColor === 'all' || item.color === selectedColor;
    const matchesMaterial = selectedMaterial === 'all' || item.material === selectedMaterial;
    const matchesAesthetic = selectedAesthetic === 'all' || item.aesthetic === selectedAesthetic;

    if (isStylist) {
      if (stylistFilterMode === 'custom') return item.isCustom && matchesColor && matchesMaterial && matchesAesthetic;
      if (stylistFilterMode === 'archive') return !item.isCustom && matchesColor && matchesMaterial && matchesAesthetic;
    }

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

  const customLooksCount = recommendations.filter(r => r.isCustom).length;

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-300">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#141414] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-3 border border-white/20">
          <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner: Stylist Studio Mode vs Customer Discovery */}
      {isStylist ? (
        <div className="glass-card p-5 sm:p-7 md:p-8 rounded-3xl border border-white/80 bg-gradient-to-r from-white/70 via-stone-50/60 to-[#F7F5F0]/70 relative overflow-hidden shadow-sm">
          <div className="absolute right-0 top-0 w-80 h-80 bg-gradient-to-bl from-[#d4af37]/15 to-transparent rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141414] text-white text-[11px] font-bold uppercase tracking-wider">
                <Scissors className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                <span>Stylist Editorial Studio · Client Style Guide Curation</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#141414] tracking-tight break-words">
                Client Style Guides & Custom Options
              </h1>
              <p className="text-xs sm:text-sm text-[#7d6f64] leading-relaxed break-words">
                Curate bespoke look recommendations, upload editorial photography, customize material compositions, and craft personalized styling commentary for your clients. Create unlimited styling variations with instant duplication.
              </p>
            </div>

            {/* Stylist Quick Studio Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
              <button
                onClick={handleOpenCreateModal}
                className="bg-[#141414] text-white hover:bg-black font-bold text-xs py-3 px-5 rounded-full shadow-lg flex items-center justify-center gap-2 transition-all"
                style={{ backgroundColor: '#141414', color: '#FFFFFF' }}
              >
                <Plus className="w-4 h-4 text-[#d4af37]" />
                <span className="whitespace-nowrap font-bold text-white">+ Curate New Style Look</span>
              </button>

              <button
                onClick={handleResetDefaults}
                className="bg-white text-[#141414] hover:bg-stone-100 border border-black/15 font-bold text-xs py-3 px-4 rounded-full shadow-xs flex items-center justify-center gap-1.5 transition-all"
                title="Restore DROBE Original Presets"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#7d6f64]" />
                <span className="whitespace-nowrap">Reset Presets</span>
              </button>
            </div>
          </div>

          {/* Stylist Secondary Filter Tabs Strip */}
          <div className="mt-6 pt-4 border-t border-black/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[#7d6f64] font-semibold">View Scope:</span>
              <div className="flex items-center gap-1.5 bg-white/70 p-1 rounded-full border border-black/10">
                <button
                  onClick={() => setStylistFilterMode('all')}
                  className={`px-3 py-1 rounded-full font-bold transition-all ${
                    stylistFilterMode === 'all' 
                      ? 'bg-[#141414] text-white shadow-xs' 
                      : 'text-[#7d6f64] hover:text-[#141414]'
                  }`}
                  style={stylistFilterMode === 'all' ? { backgroundColor: '#141414', color: '#FFFFFF' } : {}}
                >
                  All Looks ({recommendations.length})
                </button>
                <button
                  onClick={() => setStylistFilterMode('custom')}
                  className={`px-3 py-1 rounded-full font-bold transition-all ${
                    stylistFilterMode === 'custom' 
                      ? 'bg-[#141414] text-white shadow-xs' 
                      : 'text-[#7d6f64] hover:text-[#141414]'
                  }`}
                  style={stylistFilterMode === 'custom' ? { backgroundColor: '#141414', color: '#FFFFFF' } : {}}
                >
                  My Uploads ({customLooksCount})
                </button>
                <button
                  onClick={() => setStylistFilterMode('archive')}
                  className={`px-3 py-1 rounded-full font-bold transition-all ${
                    stylistFilterMode === 'archive' 
                      ? 'bg-[#141414] text-white shadow-xs' 
                      : 'text-[#7d6f64] hover:text-[#141414]'
                  }`}
                  style={stylistFilterMode === 'archive' ? { backgroundColor: '#141414', color: '#FFFFFF' } : {}}
                >
                  DROBE Presets ({recommendations.length - customLooksCount})
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#7d6f64]">
              <span>Active: <strong className="text-[#141414]">{filteredRecommendations.length}</strong> matching options</span>
            </div>
          </div>
        </div>
      ) : (
        /* Customer Discovery Header Banner */
        <div className="glass-card p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-white/80 bg-gradient-to-r from-white/60 via-white/40 to-[#F7F5F0]/60 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-80 bg-gradient-to-bl from-[#dfb798]/20 to-transparent rounded-full blur-2xl pointer-events-none"></div>

          <div className="max-w-2xl relative z-10 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-white text-[#8A8176] text-[11px] font-bold uppercase tracking-wider max-w-full">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
              <span className="truncate">AI Stylist Discovery Engine</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#141414] tracking-tight break-words">
              Curated Style Recommendations
            </h1>
            <p className="text-xs sm:text-sm text-[#7d6f64] leading-relaxed break-words">
              Discover tailored outfit harmonies filtered by luxury fabrics, curated color swatches, and bespoke aesthetics. Backed by certified DROBE fashion consultants.
            </p>
          </div>

          {/* Season Selector */}
          <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-white/60 flex flex-wrap items-center justify-between gap-3">
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
      )}

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
                      ? 'bg-white shadow-md border-2 border-[#141414]' 
                      : 'bg-white/40 hover:bg-white/70 border border-black/10'
                  }`}
                >
                  <span
                    style={{ background: c.hex }}
                    className={`w-7 h-7 rounded-full shadow-sm flex items-center justify-center ${
                      c.border || 'border border-black/20'
                    }`}
                  >
                    {isSelected && (
                      <Check className={`w-3.5 h-3.5 drop-shadow ${c.id === 'ivory' || c.id === 'blush' ? 'text-black' : 'text-white'}`} />
                    )}
                  </span>
                  <span className="text-[10px] font-semibold text-[#141414] leading-tight line-clamp-1 truncate w-full">
                    {c.id === 'all' ? 'All' : c.id}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. TEXTILE & FABRICS */}
        <div className="glass-card p-5 rounded-3xl border border-white/80 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/60">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#8A8176]" />
              <h3 className="font-serif font-bold text-sm text-[#141414]">Fabric & Weave</h3>
            </div>
            <span className="text-[10px] text-[#7d6f64] uppercase font-bold tracking-wider">
              {materials.find(m => m.id === selectedMaterial)?.name}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1 max-h-56 overflow-y-auto no-scrollbar">
            {materials.map((m) => {
              const isSelected = selectedMaterial === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMaterial(m.id)}
                  className={`text-xs py-1.5 px-3 rounded-full font-bold flex items-center gap-1.5 transition-all ${
                    isSelected 
                      ? 'bg-[#141414] text-white shadow-sm' 
                      : 'bg-white/50 text-[#141414] border border-black/15 hover:bg-white'
                  }`}
                  style={isSelected ? { backgroundColor: '#141414', color: '#FFFFFF' } : {}}
                >
                  <span>{m.name}</span>
                  {m.badge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full uppercase font-bold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-[#b85d43]/10 text-[#b85d43]'
                    }`}>
                      {m.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. AESTHETIC HARMONY */}
        <div className="glass-card p-5 rounded-3xl border border-white/80 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/60">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#2d5a46]" />
              <h3 className="font-serif font-bold text-sm text-[#141414]">Aesthetic Movement</h3>
            </div>
            <span className="text-[10px] text-[#7d6f64] uppercase font-bold tracking-wider">
              {aesthetics.find(a => a.id === selectedAesthetic)?.label}
            </span>
          </div>

          <div className="space-y-1.5 pt-1">
            {aesthetics.map((a) => {
              const isSelected = selectedAesthetic === a.id;
              return (
                <button
                  key={a.id}
                  onClick={() => setSelectedAesthetic(a.id)}
                  className={`w-full text-left px-3.5 py-2 rounded-2xl text-xs font-semibold flex items-center justify-between transition-all ${
                    isSelected 
                      ? 'bg-[#141414] text-white font-bold shadow-sm' 
                      : 'bg-white/40 hover:bg-white text-[#141414]'
                  }`}
                  style={isSelected ? { backgroundColor: '#141414', color: '#FFFFFF' } : {}}
                >
                  <span>{a.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#d4af37]" />}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* RECOMMENDATION RESULTS SHOWCASE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif font-bold text-xl text-[#141414]">
            {isStylist ? 'Active Client Style Guides & Options' : 'Curated Stylist Outfits'}
          </h2>
          <span className="text-xs text-[#7d6f64]">
            {filteredRecommendations.length} {filteredRecommendations.length === 1 ? 'Look' : 'Looks'} Available
          </span>
        </div>

        {filteredRecommendations.length === 0 ? (
          <div className="glass-card p-12 text-center rounded-3xl space-y-3">
            <ShoppingBag className="w-8 h-8 text-[#8A8176] mx-auto" />
            <h3 className="font-serif font-bold text-base text-[#141414]">No style combinations match your active filters</h3>
            <p className="text-xs text-[#7d6f64] max-w-sm mx-auto">
              Try adjusting your color palette or textile filters to explore other seasonal harmonies.
            </p>
            {isStylist ? (
              <button
                onClick={handleOpenCreateModal}
                className="btn-capsule-black text-xs py-2 px-5 mt-2"
                style={{ backgroundColor: '#141414', color: '#FFFFFF' }}
              >
                + Curate Look for this Category
              </button>
            ) : (
              <button
                onClick={() => {
                  setSelectedColor('all');
                  setSelectedMaterial('all');
                  setSelectedAesthetic('all');
                }}
                className="btn-capsule-black text-xs py-2 px-5 mt-2"
                style={{ backgroundColor: '#141414', color: '#FFFFFF' }}
              >
                View All Recommendations
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecommendations.map((item) => {
              const isSaved = savedItems.includes(item.id);
              return (
                <div 
                  key={item.id}
                  className="glass-card rounded-3xl overflow-hidden border border-white/80 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  {/* Image Container with Fixed Dimension */}
                  <div className="recom-image-container relative overflow-hidden bg-neutral-100">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = '/images/pink_tweed_coat.jpg';
                      }}
                    />
                    
                    {/* Top Action Tags & Stylist Controls */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white px-2.5 py-1 rounded-full backdrop-blur-md border border-white/20">
                        {item.category}
                      </span>
                      
                      <div className="flex items-center gap-1.5">
                        {isStylist ? (
                          <>
                            {/* Duplicate & Remix Look */}
                            <button
                              onClick={() => handleDuplicateLook(item)}
                              className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#141414] flex items-center justify-center shadow-md transition-all hover:scale-110"
                              title="Duplicate & Remix this Look"
                            >
                              <Copy className="w-3.5 h-3.5 text-[#141414]" />
                            </button>

                            {/* Edit Look */}
                            <button
                              onClick={() => handleOpenEditModal(item)}
                              className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#141414] flex items-center justify-center shadow-md transition-all hover:scale-110"
                              title="Edit Look Details & Photos"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-[#b85d43]" />
                            </button>

                            {/* Delete Look */}
                            <button
                              onClick={() => handleDeleteLook(item.id, item.title)}
                              className="w-8 h-8 rounded-full bg-white/90 hover:bg-red-50 text-red-500 flex items-center justify-center shadow-md transition-all hover:scale-110"
                              title="Delete from Style Guides"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-600" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleToggleSave(item.id, item.title)}
                            className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                            title={isSaved ? "Saved to Moodboard" : "Save to Moodboard"}
                          >
                            <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : 'text-[#141414]'}`} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Gradient Overlay for Text Visibility */}
                    <div className="recom-overlay-gradient"></div>

                    {/* Bottom Image Overlay Details */}
                    <div className="recom-overlay-content">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 drop-shadow">
                          {item.colorName}
                        </span>
                        {item.isCustom && (
                          <span className="text-[9px] font-bold bg-[#d4af37] text-[#141414] px-2 py-0.5 rounded-full">
                            Custom Client Look
                          </span>
                        )}
                      </div>
                      <h3 className="font-serif text-base sm:text-lg font-bold leading-snug text-white drop-shadow-md mb-2 break-words">
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
                  <div className="p-3 sm:p-5 space-y-3 sm:space-y-4 flex-1 flex flex-col justify-between">
                    
                    {/* Swatches & Composition */}
                    <div className="space-y-1.5 sm:space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] sm:text-[11px] font-bold text-[#7d6f64] uppercase tracking-wider">Palette & Composition</span>
                        <div className="flex items-center gap-1.5">
                          {item.swatches.map((hex: string, i: number) => (
                            <span 
                              key={i} 
                              style={{ backgroundColor: hex }} 
                              className="w-3.5 h-3.5 rounded-full border border-white shadow-sm"
                              title={hex}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-[#141414] font-medium bg-white/50 p-2 sm:p-2.5 rounded-xl border border-white/60 break-words leading-relaxed">
                        {item.materialDetails} • <span className="text-[#7d6f64]">{item.lining}</span>
                      </p>
                    </div>

                    {/* Stylist Commentary */}
                    <div className="space-y-1.5 bg-[#F7F5F0]/70 p-2.5 sm:p-3 rounded-2xl border border-[#EAE8E3]">
                      <div className="flex items-center gap-2 min-w-0">
                        <img 
                          src={item.stylistAvatar} 
                          alt={item.stylist} 
                          className="rounded-full object-cover border border-white shrink-0 shadow-sm"
                          style={{
                            width: '26px',
                            height: '26px',
                            minWidth: '26px',
                            minHeight: '26px',
                            maxWidth: '26px',
                            maxHeight: '26px',
                            borderRadius: '50%',
                            objectFit: 'cover'
                          }}
                          onError={(e) => {
                            e.currentTarget.src = '/images/shop_manager.jpg';
                          }}
                        />
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-[11px] font-bold text-[#141414] leading-tight truncate">{item.stylist}</span>
                          <span className="text-[9px] text-[#7d6f64] leading-tight truncate">({item.stylistRole})</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-[#555] leading-relaxed italic break-words">
                        "{item.stylistNotes}"
                      </p>
                    </div>

                    {/* Action Buttons: Stylist Mode vs Customer Mode */}
                    {isStylist ? (
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="bg-[#141414] text-white text-xs py-2 px-2 sm:px-3 rounded-full font-bold flex items-center justify-center gap-1.5 hover:bg-black transition-all shadow-sm"
                          style={{ backgroundColor: '#141414', color: '#FFFFFF' }}
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#d4af37]" />
                          <span className="truncate text-white font-bold">Edit Look</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            setInspectingLook(item);
                            if (onViewLook) onViewLook(item);
                          }}
                          className="bg-white text-[#141414] border border-black/20 text-xs py-2 px-2 sm:px-3 rounded-full font-bold flex items-center justify-center gap-1.5 hover:bg-stone-100 transition-all shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#141414]" />
                          <span className="truncate">Client View</span>
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <button
                          onClick={() => {
                            setInspectingLook(item);
                            if (onViewLook) onViewLook(item);
                          }}
                          className="btn-capsule-black text-xs py-2 px-2 sm:px-3 flex items-center justify-center gap-1 sm:gap-1.5 text-center min-w-0"
                          style={{ backgroundColor: '#141414', color: '#FFFFFF' }}
                        >
                          <Eye className="w-3.5 h-3.5 shrink-0 text-white" />
                          <span className="truncate text-white font-bold">Inspect Look</span>
                        </button>
                        
                        <button
                          onClick={() => onOpenBooking({ display_name: item.stylist, avatar_url: item.stylistAvatar })}
                          className="bg-white text-[#141414] border-2 border-[#141414] text-xs py-2 px-2 sm:px-3 rounded-full font-bold flex items-center justify-center gap-1 sm:gap-1.5 hover:bg-[#141414] hover:text-white transition-all text-center min-w-0 shadow-xs group"
                        >
                          <UserCheck className="w-3.5 h-3.5 text-[#b85d43] group-hover:text-white transition-colors shrink-0" />
                          <span className="truncate font-bold">Book Stylist</span>
                        </button>
                      </div>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ==============================================================================
         STYLIST MANUAL EDITING & UPLOADING MODAL ("create so many options")
      ============================================================================== */}
      {isCuratingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white/95 backdrop-blur-xl w-full max-w-3xl p-5 sm:p-7 rounded-3xl border border-white shadow-2xl relative max-h-[92vh] overflow-y-auto space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-black/10">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#b85d43] block">
                  DROBE Stylist Editorial Studio
                </span>
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#141414]">
                  {editingItemId ? 'Edit Client Style Guide Look' : 'Curate New Client Style Guide Look'}
                </h2>
                <p className="text-xs text-[#7d6f64]">
                  Upload lookbook photography, define bespoke color harmonies, and detail luxury materials for your clients.
                </p>
              </div>
              <button
                onClick={() => setIsCuratingModalOpen(false)}
                className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-[#141414] flex items-center justify-center shrink-0 transition-transform hover:scale-105"
                title="Close"
              >
                <X className="w-4 h-4 text-[#141414]" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveLook} className="space-y-5">
              
              {/* Row 1: Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#141414] block">Look Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ivory Raw Silk Kurta with Emerald Bandi"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full bg-stone-50 border border-black/15 text-xs text-[#141414] font-semibold p-3 rounded-2xl focus:outline-none focus:border-[#141414]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#141414] block">Garment Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-stone-50 border border-black/15 text-xs text-[#141414] font-semibold p-3 rounded-2xl focus:outline-none focus:border-[#141414]"
                  >
                    <option value="Outerwear & Formal">Outerwear & Formal</option>
                    <option value="Knitwear & Tailoring">Knitwear & Tailoring</option>
                    <option value="Tailored Sets">Tailored Sets</option>
                    <option value="Evening & Occasion">Evening & Occasion</option>
                    <option value="Two-Piece Set">Two-Piece Set</option>
                    <option value="Bridal Trousseau">Bridal Trousseau</option>
                    <option value="Resort & Casual Chic">Resort & Casual Chic</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Aesthetic & Occasion Target */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#141414] block">Aesthetic Movement</label>
                  <select
                    value={formAesthetic}
                    onChange={(e) => setFormAesthetic(e.target.value)}
                    className="w-full bg-stone-50 border border-black/15 text-xs text-[#141414] font-semibold p-3 rounded-2xl focus:outline-none focus:border-[#141414]"
                  >
                    <option value="old-money">Old Money Heritage</option>
                    <option value="minimalist">Quiet Luxury Minimalist</option>
                    <option value="parisian">Parisian Tailored Chic</option>
                    <option value="wedding">Royal Occasion & Wedding</option>
                    <option value="streetwear">High-Fashion Casual</option>
                    <option value="korean">Korean Modern Drape</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#141414] block">Client Occasion Target</label>
                  <input
                    type="text"
                    placeholder="e.g. Wedding Reception, Corporate Executive, Weekend Capsule"
                    value={formOccasion}
                    onChange={(e) => setFormOccasion(e.target.value)}
                    className="w-full bg-stone-50 border border-black/15 text-xs text-[#141414] font-semibold p-3 rounded-2xl focus:outline-none focus:border-[#141414]"
                  />
                </div>
              </div>

              {/* Row 3: Image Upload & Preset Gallery */}
              <div className="space-y-2 p-4 bg-stone-50 rounded-2xl border border-black/10">
                <label className="text-xs font-bold text-[#141414] flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#b85d43]" />
                  <span>Garment Photography & Lookbook Image</span>
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  {/* Image Preview */}
                  <div className="h-32 rounded-xl overflow-hidden border border-black/15 bg-white relative">
                    <img 
                      src={formImage} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/images/pink_tweed_coat.jpg';
                      }}
                    />
                    <span className="absolute bottom-1 right-1 text-[9px] bg-black/60 text-white px-1.5 py-0.5 rounded">
                      Preview
                    </span>
                  </div>

                  {/* Upload File Control */}
                  <div className="sm:col-span-2 space-y-2">
                    <div>
                      <span className="text-[11px] text-[#7d6f64] font-semibold block mb-1">
                        1. Upload Image from Your Device:
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#141414] file:text-white hover:file:bg-black cursor-pointer"
                      />
                    </div>

                    <div>
                      <span className="text-[11px] text-[#7d6f64] font-semibold block mb-1">
                        2. Or Select a Curated DROBE Look:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { label: 'Tweed Coat', url: '/images/pink_tweed_coat.jpg' },
                          { label: 'Cashmere', url: '/images/cashmere_mockneck.jpg' },
                          { label: 'Emerald Gown', url: '/images/emerald_silk_gown.jpg' },
                          { label: 'Linen Safari', url: '/images/linen_safari_suit.jpg' },
                          { label: 'Poplin Set', url: '/images/poplin_skirt_set.jpg' },
                          { label: 'Editorial Ateliér', url: '/images/stylist_editorial.jpg' }
                        ].map((preset) => (
                          <button
                            type="button"
                            key={preset.label}
                            onClick={() => setFormImage(preset.url)}
                            className={`text-[10px] px-2.5 py-1 rounded-full border transition-all ${
                              formImage === preset.url 
                                ? 'bg-[#141414] text-white border-[#141414] font-bold' 
                                : 'bg-white text-[#141414] border-black/15 hover:bg-stone-100'
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 4: Colors, Palette Name & Swatches */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-black/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#141414] flex items-center gap-2">
                    <Palette className="w-4 h-4 text-[#d4af37]" />
                    <span>Color Palette & Hex Swatches</span>
                  </label>
                  <span className="text-[10px] text-[#7d6f64]">Click chip to remove swatch</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-[#7d6f64] block mb-1">Color Family</label>
                    <select
                      value={formColor}
                      onChange={(e) => setFormColor(e.target.value)}
                      className="w-full bg-white border border-black/15 text-xs text-[#141414] font-semibold p-2.5 rounded-xl"
                    >
                      <option value="charcoal">Charcoal & Noir</option>
                      <option value="ivory">Ivory & Cream</option>
                      <option value="blush">Powder Blush</option>
                      <option value="taupe">Taupe & Sand</option>
                      <option value="emerald">Imperial Emerald</option>
                      <option value="navy">Midnight Navy</option>
                      <option value="saffron">Golden Saffron</option>
                      <option value="sage">Muted Sage</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#7d6f64] block mb-1">Editorial Palette Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Noir & Champagne Sand"
                      value={formColorName}
                      onChange={(e) => setFormColorName(e.target.value)}
                      className="w-full bg-white border border-black/15 text-xs text-[#141414] font-semibold p-2.5 rounded-xl"
                    />
                  </div>
                </div>

                {/* Swatches Chips & Color Picker */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs font-semibold text-[#7d6f64]">Active Swatches:</span>
                  {formSwatches.map((hex, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => handleRemoveSwatch(hex)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-black/15 bg-white text-xs shadow-xs hover:border-red-400 group"
                      title="Click to remove swatch"
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-black/20" style={{ backgroundColor: hex }} />
                      <span className="font-mono text-[10px] text-[#141414]">{hex}</span>
                      <X className="w-3 h-3 text-[#7d6f64] group-hover:text-red-500" />
                    </button>
                  ))}

                  <div className="inline-flex items-center gap-1 ml-auto">
                    <input
                      type="color"
                      value={newSwatchInput}
                      onChange={(e) => setNewSwatchInput(e.target.value)}
                      className="w-7 h-7 rounded-full cursor-pointer border border-black/20 p-0"
                      title="Pick hex color"
                    />
                    <button
                      type="button"
                      onClick={handleAddSwatch}
                      className="bg-stone-200 hover:bg-stone-300 text-[#141414] text-[11px] font-bold py-1 px-2.5 rounded-full"
                    >
                      + Add Swatch
                    </button>
                  </div>
                </div>
              </div>

              {/* Row 5: Material, Composition & Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#141414] block">Textile Composition Details</label>
                  <input
                    type="text"
                    placeholder="e.g. 100% Superfine 2-Ply Mongolian Cashmere"
                    value={formMaterialDetails}
                    onChange={(e) => setFormMaterialDetails(e.target.value)}
                    className="w-full bg-stone-50 border border-black/15 text-xs text-[#141414] font-semibold p-3 rounded-2xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#141414] block">Interior Lining & Hardware</label>
                  <input
                    type="text"
                    placeholder="e.g. 100% Cupro Silk Lining, Horn Buttons"
                    value={formLining}
                    onChange={(e) => setFormLining(e.target.value)}
                    className="w-full bg-stone-50 border border-black/15 text-xs text-[#141414] font-semibold p-3 rounded-2xl"
                  />
                </div>
              </div>

              {/* Pricing (USD & INR) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#141414] block">Price (USD)</label>
                  <input
                    type="text"
                    placeholder="$2,500"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full bg-stone-50 border border-black/15 text-xs text-[#141414] font-semibold p-3 rounded-2xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#141414] block">Price (INR)</label>
                  <input
                    type="text"
                    placeholder="₹35,000"
                    value={formPriceINR}
                    onChange={(e) => setFormPriceINR(e.target.value)}
                    className="w-full bg-stone-50 border border-black/15 text-xs text-[#141414] font-semibold p-3 rounded-2xl"
                  />
                </div>
              </div>

              {/* Stylist Editorial Styling Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#141414] block">Stylist Editorial Advice & Guidance *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide your professional guidance for wearing this look, layering instructions, and footwear pairings..."
                  value={formStylistNotes}
                  onChange={(e) => setFormStylistNotes(e.target.value)}
                  className="w-full bg-stone-50 border border-black/15 text-xs text-[#141414] font-medium p-3 rounded-2xl leading-relaxed focus:outline-none focus:border-[#141414]"
                />
              </div>

              {/* Complementary Recommended Pieces Manager */}
              <div className="space-y-2 p-4 bg-stone-50 rounded-2xl border border-black/10">
                <label className="text-xs font-bold text-[#141414] flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#b85d43]" />
                  <span>Recommended Complementary Accessories & Pieces</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {formComplementary.map((piece, i) => (
                    <span
                      key={i}
                      className="bg-white border border-black/15 px-2.5 py-1 rounded-full text-xs font-medium text-[#141414] inline-flex items-center gap-1.5"
                    >
                      <span>✓ {piece}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveComplementary(piece)}
                        className="text-[#7d6f64] hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Add accessory (e.g. Belgian Loafers, Silk pocket square...)"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddComplementary();
                      }
                    }}
                    className="flex-1 bg-white border border-black/15 text-xs text-[#141414] p-2.5 rounded-xl focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddComplementary}
                    className="bg-[#141414] text-white text-xs font-bold py-2.5 px-4 rounded-xl hover:bg-black"
                    style={{ backgroundColor: '#141414', color: '#FFFFFF' }}
                  >
                    + Add Piece
                  </button>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-3 border-t border-black/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCuratingModalOpen(false)}
                  className="bg-stone-100 hover:bg-stone-200 text-[#141414] text-xs font-bold py-2.5 px-5 rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#141414] hover:bg-black text-white text-xs font-bold py-2.5 px-7 rounded-full shadow-lg flex items-center gap-2"
                  style={{ backgroundColor: '#141414', color: '#FFFFFF' }}
                >
                  <Check className="w-4 h-4 text-[#d4af37]" />
                  <span className="font-bold text-white">{editingItemId ? 'Update Style Look' : 'Publish to Style Guides'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

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
                <div className="h-80 w-full rounded-2xl overflow-hidden border border-white shadow-sm bg-[#f5ede6] relative" style={{ height: '320px', maxHeight: '320px' }}>
                  <img
                    src={inspectingLook.image}
                    alt={inspectingLook.title}
                    className="w-full h-full object-cover"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
                  <div className="flex items-center gap-2.5">
                    <img
                      src={inspectingLook.stylistAvatar}
                      alt={inspectingLook.stylist}
                      className="rounded-full object-cover border border-white shrink-0 shadow-sm"
                      style={{
                        width: '36px',
                        height: '36px',
                        minWidth: '36px',
                        minHeight: '36px',
                        maxWidth: '36px',
                        maxHeight: '36px',
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        e.currentTarget.src = '/images/shop_manager.jpg';
                      }}
                    />
                    <div className="min-w-0">
                      <h5 className="text-xs font-bold text-[#141414] leading-tight truncate">{inspectingLook.stylist}</h5>
                      <p className="text-[10px] text-[#7d6f64] leading-tight truncate">{inspectingLook.stylistRole}</p>
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
                    style={{ backgroundColor: '#141414', color: '#FFFFFF' }}
                  >
                    <UserCheck className="w-4 h-4 text-white" />
                    <span className="text-white font-bold">Book Consultation for this Look</span>
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
