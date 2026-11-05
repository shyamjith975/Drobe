import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Trash2, 
  Edit3, 
  Upload, 
  ShoppingBag, 
  Tag, 
  TrendingUp, 
  Users, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  Eye, 
  ExternalLink, 
  Camera, 
  Compass, 
  MessageSquare, 
  Settings, 
  Layers, 
  MapPin, 
  Calendar, 
  DollarSign,
  X,
  Share2,
  ShieldCheck,
  Award,
  Zap,
  Clock,
  Truck
} from 'lucide-react';
import { api } from '@drobe/api-client';

interface BoutiquePortalViewProps {
  currentUser: any;
  onOpenBooking?: (stylist: any, service?: any) => void;
  onOpenMessages?: () => void;
  onPublishPost?: () => void;
}

export const BoutiquePortalView: React.FC<BoutiquePortalViewProps> = ({
  currentUser,
  onOpenBooking,
  onOpenMessages,
  onPublishPost
}) => {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'products' | 'collections' | 'shopthislook' | 'creators' | 'enquiries' | 'analytics' | 'settings'
  >('dashboard');

  // Boutique state
  const [isVerified, setIsVerified] = useState<boolean>(
    currentUser?.brand_profile?.is_verified ?? currentUser?.profile?.is_verified ?? false
  );

  // Boutique B2B Atelier SaaS & Trials State
  const [boutiqueSub, setBoutiqueSub] = useState<any>({
    tier: 'atelier_club',
    tier_name: 'DROBE Atelier Club',
    price_inr: 4999,
    commission_rate_pct: 12,
    status: 'active',
    billing_cycle: 'monthly',
    search_priority: true,
    unlimited_hotspots: true,
    concierge_trial_access: true,
    direct_stylist_routing: true,
    perks: [
      '12% Platform Take Rate (vs 20% Free)',
      'Featured City Directory Placement',
      'Unlimited Interactive Hotspot Lookbooks',
      'Direct Stylist Trousseau Routing',
      'White Glove At-Home Trial Concierge Fulfillment'
    ]
  });
  const [isUpgradeAtelierOpen, setIsUpgradeAtelierOpen] = useState(false);
  const [conciergeTrials, setConciergeTrials] = useState<any[]>([
    {
      id: 'trial-req-1',
      client_name: 'Priya Nair',
      event: 'Royal Udaipur Palace Wedding',
      scheduled_date: '2026-11-25 · 2:30 PM',
      delivery_address: 'Taj Lake Palace, Udaipur',
      outfits_requested: [
        'Textured wool tweed coat (Blush Pink, Size 38)',
        'Artisanal Silk Handloom Saree (Crimson Gold)'
      ],
      assigned_stylist: 'Maya Nambiar',
      status: 'Ready for Dispatch',
      concierge_fee_credited: true
    }
  ]);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleUpgradeTier = async (tier: string) => {
    try {
      const res = await api.subscriptions.upgradeBoutique(tier, 'monthly');
      setBoutiqueSub(res);
      setIsUpgradeAtelierOpen(false);
      showToast(`Atelier Membership updated to ${res.tier_name}!`);
    } catch (err) {
      setBoutiqueSub({
        tier,
        tier_name: tier === 'couture_circle' ? 'Couture Circle Atelier' : 'DROBE Atelier Club',
        price_inr: tier === 'couture_circle' ? 9999 : 4999,
        commission_rate_pct: tier === 'couture_circle' ? 8 : 12,
        status: 'active'
      });
      setIsUpgradeAtelierOpen(false);
      showToast('Atelier Membership updated!');
    }
  };

  // Products CRUD State
  const [products, setProducts] = useState<any[]>([
    {
      id: 'prod-1',
      name: 'Textured wool tweed coat',
      category: "Women's Outerwear",
      price: 3500,
      discount_price: 3150,
      sizes: ['36', '38', '40', '42'],
      colors: ['Blush Pink', 'Ivory Cream', 'Midnight Charcoal'],
      images: ['https://images.unsplash.com/photo-1539533018447-63fcce667823?auto=format&fit=crop&w=600&q=80'],
      is_available: true,
      stock_count: 14,
      views: 1840,
      clicks: 420
    },
    {
      id: 'prod-2',
      name: 'Bespoke Double-Breasted Linen Blazer',
      category: "Men's Tailoring",
      price: 850,
      discount_price: null,
      sizes: ['38R', '40R', '42R'],
      colors: ['Oatmeal', 'Navy', 'Olive'],
      images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80'],
      is_available: true,
      stock_count: 8,
      views: 920,
      clicks: 185
    },
    {
      id: 'prod-3',
      name: 'Artisanal Silk Handloom Saree',
      category: 'Ethnic Wear',
      price: 1200,
      discount_price: 1050,
      sizes: ['Free Size'],
      colors: ['Crimson Gold', 'Emerald Forest'],
      images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'],
      is_available: true,
      stock_count: 5,
      views: 1420,
      clicks: 310
    }
  ]);

  // Product modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState("Women's Outerwear");
  const [prodPrice, setProdPrice] = useState('3500');
  const [prodDiscountPrice, setProdDiscountPrice] = useState('');
  const [prodSizes, setProdSizes] = useState('36, 38, 40, 42');
  const [prodColors, setProdColors] = useState('Blush Pink, Ivory Cream');
  const [prodImage, setProdImage] = useState('/images/pink_tweed_coat.jpg');

  // Shop This Look Tagging Studio State
  const [studioImage, setStudioImage] = useState('/images/hero_editorial.jpg');
  const [studioTags, setStudioTags] = useState<any[]>([
    { id: 'tag-1', title: 'Textured wool tweed coat', price: '$3,500', x: 48, y: 36, brand: 'Maison Ivory' },
    { id: 'tag-2', title: 'Striped Pleated Silk Dress', price: '$1,250', x: 74, y: 38, brand: 'Maison Ivory' },
    { id: 'tag-3', title: 'Black Italian Leather Tote', price: '$1,800', x: 80, y: 62, brand: 'Maison Ivory' }
  ]);
  const [newTagTitle, setNewTagTitle] = useState('');
  const [newTagPrice, setNewTagPrice] = useState('');
  const [activeStudioPin, setActiveStudioPin] = useState<any | null>(null);

  // Collaboration Campaigns
  const [campaigns, setCampaigns] = useState<any[]>([
    {
      id: 'camp-1',
      title: 'Pre-Fall Tweed & Outerwear Launch 2026',
      budget: '₹1,50,000',
      creatorsCount: 4,
      status: 'Active',
      deliverables: '3 Editorial Posts + 2 Reels + Shop This Look Tags'
    },
    {
      id: 'camp-2',
      title: 'Kerala Handloom Heritage Week',
      budget: '₹85,000',
      creatorsCount: 2,
      status: 'Reviewing Applications',
      deliverables: 'Bridal Styling Transformation Lookbook'
    }
  ]);

  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProdName('');
    setProdCategory("Women's Outerwear");
    setProdPrice('2400');
    setProdDiscountPrice('');
    setProdSizes('S, M, L, XL');
    setProdColors('Charcoal, Oatmeal, Ivory');
    setProdImage('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80');
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = () => {
    if (!prodName.trim()) return;

    if (editingProductId) {
      setProducts(products.map(p => p.id === editingProductId ? {
        ...p,
        name: prodName,
        category: prodCategory,
        price: parseFloat(prodPrice) || 0,
        discount_price: prodDiscountPrice ? parseFloat(prodDiscountPrice) : null,
        sizes: prodSizes.split(',').map(s => s.trim()),
        colors: prodColors.split(',').map(c => c.trim()),
        images: [prodImage]
      } : p));
    } else {
      const newProd = {
        id: `prod-${Date.now()}`,
        name: prodName,
        category: prodCategory,
        price: parseFloat(prodPrice) || 0,
        discount_price: prodDiscountPrice ? parseFloat(prodDiscountPrice) : null,
        sizes: prodSizes.split(',').map(s => s.trim()),
        colors: prodColors.split(',').map(c => c.trim()),
        images: [prodImage],
        is_available: true,
        stock_count: 10,
        views: 1,
        clicks: 0
      };
      setProducts([newProd, ...products]);
    }
    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to remove this garment from your boutique catalog?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleStudioCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    const title = prompt('Enter garment name for this hotspot pin:', 'Designer Silk Scarf');
    if (!title) return;
    const price = prompt('Enter garment price:', '$450');

    const newTag = {
      id: `tag-${Date.now()}`,
      title,
      price: price || '$450',
      x,
      y,
      brand: currentUser?.brand_profile?.brand_name || 'Maison Ivory'
    };
    setStudioTags([...studioTags, newTag]);
    setActiveStudioPin(newTag);
  };

  return (
    <div className="boutique-portal-container w-full max-w-full overflow-x-hidden min-h-[90vh] bg-[#F7F5F0] p-3 sm:p-6 lg:p-8 pb-28 sm:pb-20">
      <div className="max-w-[1280px] mx-auto w-full">

        {/* Portal Header & Verification Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Building2 size={18} color="#191919" />
              <span className="text-xs font-semibold text-[#8A8176] uppercase tracking-wider">
                Boutique & Fashion Brand Portal
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#191919]">
              {currentUser?.brand_profile?.brand_name || 'Maison Ivory Atelier'}
            </h1>
            <p className="text-xs sm:text-sm text-[#666] mt-1">
              Manage collections, showroom interactive hotspots, live catalog, and creator campaigns.
            </p>
          </div>

          {/* Verification Badge Specified in Business Rules */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 18px',
            borderRadius: '999px',
            background: isVerified ? '#E8F5E9' : '#FFF8E1',
            border: `1px solid ${isVerified ? '#A5D6A7' : '#FFE082'}`,
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
          }}>
            {isVerified ? (
              <>
                <CheckCircle size={18} color="#2E7D32" />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1B5E20' }}>Verified Luxury Boutique</div>
                  <div style={{ fontSize: '0.72rem', color: '#388E3C' }}>Listed on public discovery & showroom</div>
                </div>
              </>
            ) : (
              <>
                <AlertCircle size={18} color="#F57F17" />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F57F17' }}>Pending Editorial Verification</div>
                  <div style={{ fontSize: '0.72rem', color: '#8D6E63' }}>Awaiting review by DROBE Administration</div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6 sm:mb-8 border-b border-[#EAE8E3] w-full">
          {[
            { id: 'dashboard', label: 'Boutique Dashboard', icon: TrendingUp },
            { id: 'products', label: 'Product Catalog (CRUD)', icon: ShoppingBag },
            { id: 'shopthislook', label: 'Shop This Look Hotspots', icon: Tag },
            { id: 'creators', label: 'Creator Collaborations', icon: Users },
            { id: 'enquiries', label: 'Customer Enquiries', icon: MessageSquare },
            { id: 'analytics', label: 'Performance Analytics', icon: Compass },
            { id: 'settings', label: 'Boutique Settings', icon: Settings }
          ].map((tabItem) => {
            const Icon = tabItem.icon;
            const active = activeTab === tabItem.id;
            return (
              <button
                key={tabItem.id}
                onClick={() => setActiveTab(tabItem.id as any)}
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold shrink-0 cursor-pointer transition-all border ${
                  active
                    ? 'bg-[#191919] text-white border-[#191919] shadow-sm'
                    : 'bg-white text-[#191919] border-[#EAE8E3] hover:border-[#191919] shadow-xs'
                }`}
              >
                <Icon size={15} />
                <span className="whitespace-nowrap">{tabItem.label}</span>
              </button>
            );
          })}
        </div>

        {/* ----------------- 1. DASHBOARD VIEW ----------------- */}
        {activeTab === 'dashboard' && (
          <div>
            {/* Atelier Club Membership Strip */}
            <div className="bg-[#FFFFFF] rounded-3xl p-5 sm:p-6 border border-[#EAE8E3] flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shadow-xs">
              <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-[#F7F5F0] border border-[#EAE8E3] flex items-center justify-center shrink-0 text-[#D4AF37]">
                  <Award size={24} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm sm:text-base text-[#191919]">
                      {boutiqueSub.tier_name}
                    </span>
                    <span className="bg-[#E8F5E9] text-[#2E7D32] text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border border-[#C8E6C9]">
                      ● {boutiqueSub.commission_rate_pct}% Commission Tier
                    </span>
                  </div>
                  <div className="text-xs text-[#8A8176] mt-0.5">
                    Featured City Directory Placement Active · Unlimited Hotspot Tags · Direct Stylist Trousseau Routing
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={() => setIsUpgradeAtelierOpen(true)}
                  className="bg-[#191919] hover:bg-black text-white px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all shadow-xs"
                >
                  Manage Membership / Upgrade
                </button>
              </div>
            </div>

            {/* At-Home Fitting Concierge Requests Strip */}
            {conciergeTrials.length > 0 && (
              <div className="bg-gradient-to-r from-[#FDFBF7] to-[#F7F5F0] rounded-3xl p-5 sm:p-6 border border-[#EAE8E3] mb-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#191919] text-[#D4AF37] text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Truck size={12} />
                      White Glove At-Home Fitting Request
                    </span>
                    <span className="text-xs font-bold text-[#2E7D32]">● 1 Pending Request</span>
                  </div>
                  <span className="text-xs text-[#8A8176]">₹1,500 Concierge Fee Credited to Atelier</span>
                </div>
                {conciergeTrials.map((tr) => (
                  <div key={tr.id} className="bg-white rounded-2xl p-4 border border-[#EAE8E3] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="font-bold text-sm text-[#191919]">{tr.client_name} · {tr.event}</div>
                      <div className="text-xs text-[#666] mt-0.5">📍 {tr.delivery_address} · 📅 {tr.scheduled_date}</div>
                      <div className="text-xs text-[#8A8176] mt-1">
                        Garments Requested: <strong>{tr.outfits_requested.join(' · ')}</strong>
                      </div>
                      <div className="text-[11px] text-[#2E7D32] mt-0.5">Assigned Stylist Escort: {tr.assigned_stylist}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => showToast('Fitting trunk dispatched with portable steamer & stylist escort!')}
                        className="bg-[#191919] hover:bg-black text-white text-xs font-semibold px-4 py-2 rounded-full cursor-pointer shadow-xs transition-all"
                      >
                        Dispatch Fitting Trunk
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Live Metrics Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
              gap: '16px',
              marginBottom: '2rem'
            }}>
              {[
                { title: 'Total Profile Views', value: '28,490', change: '+18.4% this week', icon: Eye },
                { title: 'Followers & Collectors', value: '4,120', change: '+320 new', icon: Users },
                { title: 'Product Views', value: '14,830', change: '+24.1% via Hotspots', icon: ShoppingBag },
                { title: 'Product Enquiries', value: '86', change: '12 pending response', icon: MessageSquare },
                { title: 'Active Campaigns', value: '2', change: '6 creator applicants', icon: Sparkles }
              ].map((kpi, idx) => {
                const Icon = kpi.icon;
                return (
                  <div
                    key={idx}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '20px',
                      padding: '20px',
                      border: '1px solid #EAE8E3',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.8rem', color: '#8A8176', fontWeight: 600 }}>{kpi.title}</span>
                      <Icon size={18} color="#191919" />
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#191919', fontFamily: "'Playfair Display', Georgia, serif" }}>
                      {kpi.value}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#2E7D32', fontWeight: 600, marginTop: '4px' }}>
                      {kpi.change}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions & Recent Hotspots */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: '20px',
              marginBottom: '2rem'
            }}>
              {/* Hotspot Showroom Promotion */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                padding: '24px',
                border: '1px solid #EAE8E3'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#191919' }}>Digital Lookbook & Hotspots</h3>
                  <button
                    onClick={() => setActiveTab('shopthislook')}
                    style={{
                      background: '#191919',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '999px',
                      padding: '6px 14px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Launch Studio
                  </button>
                </div>
                <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', height: '240px' }}>
                  <img
                    src="https://images.unsplash.com/photo-1539533018447-63fcce667823?auto=format&fit=crop&w=800&q=80"
                    alt="Digital Lookbook"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.currentTarget.src = '/images/boutique_maison.jpg';
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    right: '12px',
                    background: 'rgba(25,25,25,0.85)',
                    color: '#FFFFFF',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    fontSize: '0.8rem',
                    backdropFilter: 'blur(6px)'
                  }}>
                    {studioTags.length} Garments tagged with price pins · Ready for instant customer purchase
                  </div>
                </div>
              </div>

              {/* Popular Products */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                padding: '24px',
                border: '1px solid #EAE8E3'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#191919' }}>Catalog Performance</h3>
                  <button
                    onClick={() => setActiveTab('products')}
                    style={{
                      background: 'transparent',
                      color: '#8A8176',
                      border: 'none',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    View All
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {products.slice(0, 3).map((p) => (
                    <div
                      key={p.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px',
                        borderRadius: '14px',
                        background: '#F7F5F0'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={p.images[0] || '/images/pink_tweed_coat.jpg'}
                          alt={p.name}
                          style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.currentTarget.src = '/images/pink_tweed_coat.jpg';
                          }}
                        />
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#191919' }}>{p.name}</div>
                          <div style={{ fontSize: '0.78rem', color: '#8A8176' }}>${p.price.toLocaleString()} · {p.category}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#191919' }}>{p.clicks} clicks</div>
                        <div style={{ fontSize: '0.75rem', color: '#2E7D32' }}>In Stock</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- 2. PRODUCT MANAGEMENT (FULL CRUD) ----------------- */}
        {activeTab === 'products' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.8rem', fontWeight: 700, color: '#191919' }}>
                  Boutique Garment Catalog
                </h2>
                <p style={{ color: '#666', fontSize: '0.88rem' }}>
                  Add, edit, remove, and manage sizes, colors, and stock for your retail collections.
                </p>
              </div>
              <button
                onClick={handleOpenAddProduct}
                style={{
                  background: '#191919',
                  color: '#FFFFFF',
                  padding: '12px 22px',
                  borderRadius: '999px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Plus size={16} />
                <span>Add New Product</span>
              </button>
            </div>

            {/* Products Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
              gap: '20px'
            }}>
              {products.map((p) => (
                <div
                  key={p.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '22px',
                    overflow: 'hidden',
                    border: '1px solid #EAE8E3',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ position: 'relative', height: '220px' }}>
                      <img
                        src={p.images[0] || '/images/pink_tweed_coat.jpg'}
                        alt={p.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.currentTarget.src = '/images/pink_tweed_coat.jpg';
                        }}
                      />
                      <span style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        background: 'rgba(25,25,25,0.85)',
                        color: '#FFFFFF',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        padding: '4px 10px',
                        borderRadius: '999px'
                      }}>
                        {p.category}
                      </span>
                    </div>

                    <div style={{ padding: '16px' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#191919', marginBottom: '6px' }}>
                        {p.name}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <span style={{ fontSize: '1.15rem', fontWeight: 700, color: '#191919' }}>
                          ${p.price.toLocaleString()}
                        </span>
                        {p.discount_price && (
                          <span style={{ fontSize: '0.9rem', color: '#8A8176', textDecoration: 'line-through' }}>
                            ${p.discount_price.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '6px' }}>
                        <strong>Sizes:</strong> {p.sizes.join(', ')}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#666' }}>
                        <strong>Colors:</strong> {p.colors.join(', ')}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderTop: '1px solid #EAE8E3',
                    background: '#FAFAFA'
                  }}>
                    <div style={{ fontSize: '0.78rem', color: '#8A8176' }}>
                      Stock: {p.stock_count || 10} units
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => {
                          setEditingProductId(p.id);
                          setProdName(p.name);
                          setProdCategory(p.category);
                          setProdPrice(String(p.price));
                          setProdDiscountPrice(p.discount_price ? String(p.discount_price) : '');
                          setProdSizes(p.sizes.join(', '));
                          setProdColors(p.colors.join(', '));
                          setProdImage(p.images[0]);
                          setIsProductModalOpen(true);
                        }}
                        style={{
                          background: '#FFFFFF',
                          border: '1px solid #EAE8E3',
                          borderRadius: '8px',
                          padding: '6px 10px',
                          cursor: 'pointer'
                        }}
                      >
                        <Edit3 size={14} color="#191919" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        style={{
                          background: '#FEEBEE',
                          border: '1px solid #FFCDD2',
                          borderRadius: '8px',
                          padding: '6px 10px',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={14} color="#C62828" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------- 3. SHOP THIS LOOK (HOTSPOTS STUDIO) ----------------- */}
        {activeTab === 'shopthislook' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.8rem', fontWeight: 700, color: '#191919' }}>
                Shop This Look · Hotspot Studio
              </h2>
              <p style={{ color: '#666', fontSize: '0.88rem' }}>
                Click directly anywhere on the mannequin photograph below to drop a garment tag with price and details.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: '20px'
            }}>
              {/* Interactive Mannequin Canvas */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                padding: '20px',
                border: '1px solid #EAE8E3'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#8A8176' }}>
                    Interactive Canvas (Click to Add Pin)
                  </span>
                  <span style={{ fontSize: '0.75rem', background: '#EAE8E3', padding: '3px 8px', borderRadius: '999px' }}>
                    {studioTags.length} Pins Active
                  </span>
                </div>

                <div
                  onClick={handleStudioCanvasClick}
                  style={{
                    position: 'relative',
                    borderRadius: '18px',
                    overflow: 'hidden',
                    cursor: 'crosshair',
                    aspectRatio: '4/5',
                    background: '#EEE'
                  }}
                >
                  <img
                    src={studioImage || '/images/hero_editorial.jpg'}
                    alt="Mannequin Studio"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.currentTarget.src = '/images/hero_editorial.jpg';
                    }}
                  />

                  {/* Rendered Hotspot Pins matching Template Image 1 */}
                  {studioTags.map((tag) => (
                    <div
                      key={tag.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveStudioPin(tag);
                      }}
                      style={{
                        position: 'absolute',
                        left: `${tag.x}%`,
                        top: `${tag.y}%`,
                        transform: 'translate(-50%, -50%)',
                        cursor: 'pointer',
                        zIndex: 10
                      }}
                    >
                      {/* Pulsing Pin Circle */}
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.95)',
                        border: '2px solid #191919',
                        boxShadow: '0 0 15px rgba(0,0,0,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#191919' }} />
                      </div>

                      {/* Popup Card when selected */}
                      {activeStudioPin?.id === tag.id && (
                        <div style={{
                          position: 'absolute',
                          top: '32px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: 'rgba(255, 255, 255, 0.96)',
                          backdropFilter: 'blur(10px)',
                          borderRadius: '16px',
                          padding: '12px 16px',
                          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                          border: '1px solid #EAE8E3',
                          width: '200px',
                          zIndex: 20
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#191919' }}>{tag.title}</div>
                            <button
                              onClick={(ev) => {
                                ev.stopPropagation();
                                setActiveStudioPin(null);
                              }}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                            >
                              <X size={14} color="#8A8176" />
                            </button>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#8A8176', margin: '4px 0' }}>{tag.price}</div>
                          <div style={{ fontSize: '0.72rem', color: '#2E7D32', fontWeight: 600 }}>Sizes: 36, 38, 40...</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tagged Items List & Actions */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                padding: '24px',
                border: '1px solid #EAE8E3'
              }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#191919', marginBottom: '16px' }}>
                  Tagged Garment Hotspots
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                  {studioTags.map((tag) => (
                    <div
                      key={tag.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px',
                        borderRadius: '14px',
                        background: '#F7F5F0',
                        border: '1px solid #EAE8E3'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#191919' }}>{tag.title}</div>
                        <div style={{ fontSize: '0.78rem', color: '#8A8176' }}>{tag.price} · X: {tag.x}% Y: {tag.y}%</div>
                      </div>
                      <button
                        onClick={() => setStudioTags(studioTags.filter(t => t.id !== tag.id))}
                        style={{
                          background: '#FEEBEE',
                          border: '1px solid #FFCDD2',
                          borderRadius: '8px',
                          padding: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={13} color="#C62828" />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => alert('Published tagged look to the DROBE common fashion feed!')}
                  style={{
                    background: '#191919',
                    color: '#FFFFFF',
                    width: '100%',
                    padding: '12px',
                    borderRadius: '999px',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Publish Look with Hotspots
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- 4. CREATOR COLLABORATIONS ----------------- */}
        {activeTab === 'creators' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.8rem', fontWeight: 700, color: '#191919' }}>
                  Creator Collaboration Campaigns
                </h2>
                <p style={{ color: '#666', fontSize: '0.88rem' }}>
                  Contract verified fashion creators and personal stylists with automated escrow protection.
                </p>
              </div>
              <button
                onClick={() => {
                  const title = prompt('Enter campaign title:', 'Resort Wear 2026 Lookbook');
                  if (!title) return;
                  const budget = prompt('Enter budget (INR):', '₹1,00,000');
                  setCampaigns([...campaigns, {
                    id: `camp-${Date.now()}`,
                    title,
                    budget: budget || '₹1,00,000',
                    creatorsCount: 0,
                    status: 'Active',
                    deliverables: '2 Editorial Posts + 1 Video Review'
                  }]);
                }}
                style={{
                  background: '#191919',
                  color: '#FFFFFF',
                  padding: '12px 22px',
                  borderRadius: '999px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Plus size={16} />
                <span>Launch New Campaign</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {campaigns.map((camp) => (
                <div
                  key={camp.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '20px',
                    padding: '24px',
                    border: '1px solid #EAE8E3',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '16px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#191919' }}>{camp.title}</h3>
                      <span style={{
                        background: '#E8F5E9',
                        color: '#2E7D32',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        padding: '3px 10px',
                        borderRadius: '999px'
                      }}>
                        {camp.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '4px' }}>
                      <strong>Deliverables:</strong> {camp.deliverables}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#8A8176' }}>
                      Budget: <strong>{camp.budget}</strong> · {camp.creatorsCount} applicants
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => alert(`Reviewing applications for "${camp.title}"`)}
                      style={{
                        background: '#191919',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '999px',
                        padding: '10px 20px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Review Applicants
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------- 5. CUSTOMER ENQUIRIES ----------------- */}
        {activeTab === 'enquiries' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.8rem', fontWeight: 700, color: '#191919' }}>
                Customer Enquiries & Appointments
              </h2>
              <p style={{ color: '#666', fontSize: '0.88rem' }}>
                Questions from shoppers regarding garment sizing, in-store appointments, and bespoke fittings.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                {
                  customer: 'Priya Nair',
                  item: 'Textured wool tweed coat ($3,500)',
                  query: 'Hi! Is size 38 available for trial at the atelier this Friday afternoon?',
                  time: '18 mins ago',
                  status: 'Unread'
                },
                {
                  customer: 'Rohan Varma',
                  item: 'Bespoke Double-Breasted Linen Blazer ($850)',
                  query: 'Looking to order 2 sets for an upcoming wedding in Kochi. Can buttons be switched to antique brass?',
                  time: '2 hours ago',
                  status: 'Replied'
                }
              ].map((enq, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '20px',
                    padding: '20px',
                    border: '1px solid #EAE8E3',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '14px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#191919' }}>{enq.customer}</span>
                      <span style={{ fontSize: '0.75rem', color: '#8A8176' }}>· {enq.time}</span>
                      {enq.status === 'Unread' && (
                        <span style={{ background: '#191919', color: '#FFF', fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: '999px' }}>
                          NEW
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#8A8176', marginBottom: '6px' }}>Regarding: {enq.item}</div>
                    <p style={{ fontSize: '0.88rem', color: '#444', lineHeight: 1.4 }}>"{enq.query}"</p>
                  </div>
                  <button
                    onClick={onOpenMessages}
                    style={{
                      background: '#191919',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '999px',
                      padding: '8px 18px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Reply
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------- 6. ANALYTICS VIEW ----------------- */}
        {activeTab === 'analytics' && (
          <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '30px', border: '1px solid #EAE8E3' }}>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.8rem', fontWeight: 700, marginBottom: '8px' }}>
              Verified Performance Analytics
            </h2>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '24px' }}>
              Real-time telemetry tracked across customer visits, interactive hotspots, and add-to-bag conversions.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              marginBottom: '30px'
            }}>
              <div style={{ background: '#F7F5F0', padding: '20px', borderRadius: '16px' }}>
                <div style={{ fontSize: '0.8rem', color: '#8A8176' }}>Click-Through Rate</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#191919' }}>18.2%</div>
                <div style={{ fontSize: '0.75rem', color: '#2E7D32' }}>+4.1% vs industry average</div>
              </div>
              <div style={{ background: '#F7F5F0', padding: '20px', borderRadius: '16px' }}>
                <div style={{ fontSize: '0.8rem', color: '#8A8176' }}>AI Virtual Try-On Sessions</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#191919' }}>1,480</div>
                <div style={{ fontSize: '0.75rem', color: '#2E7D32' }}>72% tried on diverse models</div>
              </div>
              <div style={{ background: '#F7F5F0', padding: '20px', borderRadius: '16px' }}>
                <div style={{ fontSize: '0.8rem', color: '#8A8176' }}>Appointment Booking Rate</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#191919' }}>9.4%</div>
                <div style={{ fontSize: '0.75rem', color: '#2E7D32' }}>In-store boutique visits</div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- 7. BOUTIQUE SETTINGS ----------------- */}
        {activeTab === 'settings' && (
          <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '30px', border: '1px solid #EAE8E3', maxWidth: '700px' }}>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.8rem', fontWeight: 700, marginBottom: '8px' }}>
              Boutique Profile & Store Settings
            </h2>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '24px' }}>
              Update opening hours, store address, multiple boutique branches, and staff permissions.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#191919', display: 'block', marginBottom: '6px' }}>
                  Business & Boutique Name
                </label>
                <input
                  type="text"
                  defaultValue={currentUser?.brand_profile?.brand_name || 'Maison Ivory Atelier'}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #EAE8E3' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#191919', display: 'block', marginBottom: '6px' }}>
                  Boutique Store Address
                </label>
                <input
                  type="text"
                  defaultValue="900 North Michigan Avenue, Chicago, Illinois, 60611, United States"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #EAE8E3' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#191919', display: 'block', marginBottom: '6px' }}>
                  Operating Hours
                </label>
                <input
                  type="text"
                  defaultValue="Mon - Sat: 10:00 AM - 9:00 PM · Sun: 11:00 AM - 6:00 PM"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #EAE8E3' }}
                />
              </div>
              <button
                onClick={() => alert('Boutique settings saved!')}
                style={{
                  background: '#191919',
                  color: '#FFFFFF',
                  padding: '12px 24px',
                  borderRadius: '999px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  marginTop: '10px'
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Product Add/Edit Modal */}
      {isProductModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            maxWidth: '550px',
            width: '100%',
            padding: '28px',
            maxHeight: '85vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.6rem', marginBottom: '16px' }}>
              {editingProductId ? 'Edit Boutique Garment' : 'Add New Garment to Catalog'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#191919' }}>Garment Title</label>
                <input
                  type="text"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="e.g. Textured wool tweed coat"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#191919' }}>Category</label>
                <select
                  value={prodCategory}
                  onChange={(e) => setProdCategory(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                >
                  <option value="Women's Outerwear">Women's Outerwear</option>
                  <option value="Men's Tailoring">Men's Tailoring</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Ethnic Wear">Ethnic Wear</option>
                  <option value="Wedding Wear">Wedding Wear</option>
                  <option value="Luxury Fashion">Luxury Fashion</option>
                  <option value="Casual Wear">Casual Wear</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#191919' }}>Price (USD)</label>
                  <input
                    type="number"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#191919' }}>Discount Price (Optional)</label>
                  <input
                    type="number"
                    value={prodDiscountPrice}
                    onChange={(e) => setProdDiscountPrice(e.target.value)}
                    placeholder="e.g. 3150"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#191919' }}>Available Sizes (comma separated)</label>
                <input
                  type="text"
                  value={prodSizes}
                  onChange={(e) => setProdSizes(e.target.value)}
                  placeholder="36, 38, 40, 42"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#191919' }}>Available Colors</label>
                <input
                  type="text"
                  value={prodColors}
                  onChange={(e) => setProdColors(e.target.value)}
                  placeholder="Blush Pink, Ivory Cream"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#191919' }}>Photograph Image URL</label>
                <input
                  type="text"
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setIsProductModalOpen(false)}
                style={{
                  background: 'transparent',
                  color: '#666',
                  border: '1px solid #EAE8E3',
                  borderRadius: '999px',
                  padding: '10px 20px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProduct}
                style={{
                  background: '#191919',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '10px 24px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Save Garment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Atelier Membership Tier Modal */}
      {isUpgradeAtelierOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-[#EAE8E3]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EAE8E3]">
              <div>
                <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider block">B2B SaaS Membership</span>
                <h3 className="font-serif text-xl font-bold text-[#191919]">DROBE Atelier Club Tiers</h3>
              </div>
              <button onClick={() => setIsUpgradeAtelierOpen(false)} className="text-[#8A8176] hover:text-[#191919]">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className={`border-2 rounded-2xl p-4 flex flex-col justify-between ${boutiqueSub.tier === 'atelier_club' ? 'border-[#191919] bg-[#F7F5F0]' : 'border-[#EAE8E3]'}`}>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#8A8176] uppercase block">Atelier Club</span>
                    {boutiqueSub.tier === 'atelier_club' && <span className="text-[10px] bg-[#191919] text-white px-2 py-0.5 rounded-full font-bold">Active</span>}
                  </div>
                  <div className="text-xl font-bold text-[#191919] mt-1">₹4,999 <span className="text-xs font-normal text-[#8A8176]">/ month</span></div>
                  <ul className="text-xs text-[#555] space-y-1.5 mt-3">
                    <li>✓ <strong>12% Commission</strong> (vs 20% Free)</li>
                    <li>✓ Featured City Placement</li>
                    <li>✓ Unlimited Hotspot Tags</li>
                    <li>✓ Direct Stylist Trousseau Routing</li>
                  </ul>
                </div>
                <button
                  onClick={() => handleUpgradeTier('atelier_club')}
                  disabled={boutiqueSub.tier === 'atelier_club'}
                  className="mt-4 w-full bg-[#191919] disabled:opacity-50 hover:bg-black text-white font-bold text-xs py-2 rounded-full cursor-pointer"
                >
                  {boutiqueSub.tier === 'atelier_club' ? 'Current Tier' : 'Select Atelier Club'}
                </button>
              </div>

              <div className={`border-2 rounded-2xl p-4 flex flex-col justify-between relative ${boutiqueSub.tier === 'couture_circle' ? 'border-[#D4AF37] bg-[#FDFBF7]' : 'border-[#EAE8E3]'}`}>
                <span className="absolute -top-2.5 right-4 bg-[#D4AF37] text-[#191919] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Flagship Grade
                </span>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#D4AF37] uppercase block">Couture Circle</span>
                    {boutiqueSub.tier === 'couture_circle' && <span className="text-[10px] bg-[#D4AF37] text-white px-2 py-0.5 rounded-full font-bold">Active</span>}
                  </div>
                  <div className="text-xl font-bold text-[#191919] mt-1">₹9,999 <span className="text-xs font-normal text-[#8A8176]">/ month</span></div>
                  <ul className="text-xs text-[#555] space-y-1.5 mt-3">
                    <li>✓ <strong>8% Commission</strong> (Lowest Rate)</li>
                    <li>✓ #1 Priority in Search & AI Radar</li>
                    <li>✓ Unlimited Hotspots & Video Feeds</li>
                    <li>✓ Dedicated White-Glove Trial Escort</li>
                  </ul>
                </div>
                <button
                  onClick={() => handleUpgradeTier('couture_circle')}
                  disabled={boutiqueSub.tier === 'couture_circle'}
                  className="mt-4 w-full bg-[#D4AF37] disabled:opacity-50 hover:bg-[#C29B27] text-[#191919] font-bold text-xs py-2 rounded-full cursor-pointer shadow-md"
                >
                  {boutiqueSub.tier === 'couture_circle' ? 'Current Tier' : 'Upgrade to Couture Circle'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#191919] text-white px-5 py-3 rounded-full text-xs font-bold shadow-xl border border-white/20 flex items-center gap-2">
          <CheckCircle size={15} className="text-[#81C784]" />
          <span>{toastMsg}</span>
        </div>
      )}

    </div>
  );
};
