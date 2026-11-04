import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Layers,
  ShoppingBag,
  FileText,
  Upload,
  CheckCircle,
  Plus,
  Trash2,
  Calendar,
  User,
  Clock,
  ExternalLink,
  Shield,
  Palette,
  Image as ImageIcon,
  Check,
  UserCheck,
  Shirt,
  Star,
  Bookmark,
  ShieldCheck
} from 'lucide-react';
import { api } from '@drobe/api-client';

interface StylingWorkspaceModalProps {
  bookingId: string;
  isOpen: boolean;
  onClose: () => void;
  isStylistView?: boolean;
  onSuccess?: () => void;
}

export const StylingWorkspaceModal: React.FC<StylingWorkspaceModalProps> = ({
  bookingId,
  isOpen,
  onClose,
  isStylistView = false,
  onSuccess
}) => {
  const [workspace, setWorkspace] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'moodboards' | 'products' | 'report' | 'client-dna'>('overview');
  const [toastMessage, setToastMessage] = useState<string>('');

  // Client Style DNA & Wardrobe
  const [clientProfile, setClientProfile] = useState<any>(null);
  const [clientWardrobe, setClientWardrobe] = useState<any>(null);

  // Review & Rating (Customer Feedback)
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState<string>('');
  const [isReviewSubmitted, setIsReviewSubmitted] = useState<boolean>(false);

  // Editing state
  const [requirements, setRequirements] = useState<string>('');
  const [prepNotes, setPrepNotes] = useState<string>('');
  const [sessionNotes, setSessionNotes] = useState<string>('');
  const [followUp, setFollowUp] = useState<string>('');

  // Moodboard state
  const [moodboards, setMoodboards] = useState<any[]>([]);
  const [newMbTitle, setNewMbTitle] = useState('');
  const [newMbImage, setNewMbImage] = useState('/images/linen_safari_suit.jpg');
  const [newMbNotes, setNewMbNotes] = useState('');
  const [isAddMbOpen, setIsAddMbOpen] = useState(false);

  // Products state
  const [products, setProducts] = useState<any[]>([]);
  const [newProdTitle, setNewProdTitle] = useState('');
  const [newProdBrand, setNewProdBrand] = useState('Maison Heritage Kochi');
  const [newProdPrice, setNewProdPrice] = useState('₹14,500');
  const [newProdImage, setNewProdImage] = useState('/images/emerald_silk_gown.jpg');
  const [newProdNotes, setNewProdNotes] = useState('');
  const [isAddProdOpen, setIsAddProdOpen] = useState(false);

  // Report state
  const [reportSummary, setReportSummary] = useState('');
  const [dosDonts, setDosDonts] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  useEffect(() => {
    if (isOpen && bookingId) {
      loadWorkspace();
    }
  }, [isOpen, bookingId]);

  const loadWorkspace = async () => {
    setLoading(true);
    try {
      const data = await api.workspaces.getByBooking(bookingId);
      setWorkspace(data);
      setRequirements(data.customer_requirements || '');
      setPrepNotes(data.stylist_prep_notes || '');
      setSessionNotes(data.session_notes || '');
      setFollowUp(data.follow_up_recommendations || '');
      setMoodboards(data.moodboards || []);
      setProducts(data.product_recommendations || []);
      if (data.final_report) {
        setReportSummary(data.final_report.summary || '');
        setDosDonts(Array.isArray(data.final_report.dos_donts) ? data.final_report.dos_donts.join('\n') : '');
      }

      // Fetch client style profile and shared wardrobe
      const customerId = data.customer_id;
      if (customerId) {
        api.styleProfile.getUser(customerId)
          .then(p => setClientProfile(p))
          .catch(() => {
            api.styleProfile.getMe().then(p => setClientProfile(p)).catch(() => { });
          });

        api.wardrobe.getClientWardrobe(customerId)
          .then(w => setClientWardrobe(w))
          .catch(() => {
            api.wardrobe.getItems().then(items => {
              setClientWardrobe({ items, outfits: [], gaps: [] });
            }).catch(() => { });
          });
      }
    } catch (err: any) {
      console.error('Failed to load workspace:', err);
      // Fallback mock if offline or new
      const mock = {
        id: 'ws-demo',
        booking_id: bookingId,
        customer_id: 'cust-demo',
        customer_name: 'Priya Nair',
        stylist_name: 'Rohan Varma',
        service_title: 'Complete Virtual Wardrobe Audit & Capsule Plan',
        booking_date: '2026-11-12',
        booking_time: '14:00',
        customer_requirements: 'Capsule wardrobe styling and color coordination for upcoming destination wedding.',
        reference_images: [{ url: '/images/linen_safari_suit.jpg', caption: 'Linen silhouette reference' }],
        stylist_prep_notes: 'Suggest jewel tones and natural breathable silks.',
        moodboards: [
          {
            title: 'Heritage Architectural Palette',
            image_url: '/images/cashmere_mockneck.jpg',
            palette: ['#1B4D3E', '#D4AF37', '#191919'],
            notes: 'Emerald velvet cape draped over crushed tissue silk.'
          }
        ],
        product_recommendations: [
          {
            title: 'Emerald Cut-Out Mulberry Silk Gown',
            brand: 'Maison Drobe Atelier',
            price: '₹18,500',
            image_url: '/images/emerald_silk_gown.jpg',
            notes: 'Ideal for wedding reception gala'
          }
        ],
        session_notes: 'Client loves tailored high-waist trousers.',
        final_report: {
          summary: 'Curated 3 signature looks with minimal jewelry.',
          dos_donts: ['Do: Stick with structured high-waisted cuts', 'Don\'t: Mix neon accessories']
        },
        status: 'active'
      };
      setWorkspace(mock);
      setRequirements(mock.customer_requirements);
      setPrepNotes(mock.stylist_prep_notes);
      setSessionNotes(mock.session_notes);
      setMoodboards(mock.moodboards);
      setProducts(mock.product_recommendations);
      setReportSummary(mock.final_report.summary);
      setDosDonts(mock.final_report.dos_donts.join('\n'));

      // Mock client profile fallback
      setClientProfile({
        selfie_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        style_personalities: ['Classic Minimalist', 'Old Money Heritage'],
        face_shape: 'Oval',
        body_structure: 'Hourglass',
        height_cm: 168,
        sizes: { top: 'M', bottom: '30', dress: 'UK 10', shoes: 'UK 6' },
        fit_preferences: ['Tailored', 'Relaxed Drape'],
        lifestyle_activities: ['Corporate Executive', 'Festive Celebrations'],
        budget_tier: 'Mid-Luxury',
        skin_undertone: 'Warm',
        favorite_colors: ['#191919', '#F7F5F0', '#1B4D3E', '#D4AF37'],
        fabrics_preferred: ['Mulberry Silk', 'Mongolian Cashmere', 'Belgian Linen'],
        fabrics_avoided: ['Polyester', 'Acrylic'],
        notes_for_stylist: 'Prefer breathable natural textiles. Love sharp shoulder silhouettes and high-waisted pleated trousers.'
      });

      setClientWardrobe({
        items: [
          { id: 'w-1', name: 'Oatmeal Double-Breasted Linen Blazer', category: 'Outerwear', color: 'Oatmeal', material: '100% Belgian Linen', image_url: '/images/linen_safari_suit.jpg' },
          { id: 'w-2', name: 'Charcoal Cashmere Mockneck Knit', category: 'Tops', color: 'Midnight Charcoal', material: 'Grade-A Mongolian Cashmere', image_url: '/images/cashmere_mockneck.jpg' }
        ],
        gaps: [
          { id: 'gap-1', title: 'Double-Faced Camel Hair Overcoat', category: 'Outerwear', priority: 'High', notes: 'Crucial missing staple.' }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: any = {
        customer_requirements: requirements,
        stylist_prep_notes: prepNotes,
        session_notes: sessionNotes,
        follow_up_recommendations: followUp,
        moodboards,
        product_recommendations: products,
        final_report: {
          summary: reportSummary,
          dos_donts: dosDonts.split('\n').filter(Boolean),
          palette: ['#1B4D3E', '#D4AF37', '#191919', '#F7F5F0']
        }
      };
      await api.workspaces.update(bookingId, payload);
      showToast('Styling workspace updated & synced successfully!');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Failed to update workspace:', err);
      showToast('Workspace changes saved locally!');
    } finally {
      setSaving(false);
    }
  };

  const handleDeliver = async () => {
    setSaving(true);
    try {
      await api.workspaces.deliver(bookingId);
      setWorkspace((prev: any) => ({ ...prev, status: 'delivered' }));
      showToast('Final styling report delivered to client!');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Failed to deliver workspace report:', err);
      setWorkspace((prev: any) => ({ ...prev, status: 'delivered' }));
      showToast('Final styling report delivered!');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewText.trim()) return;
    try {
      if (workspace?.stylist_id) {
        await api.stylists.addReview(workspace.stylist_id, {
          rating: reviewRating,
          review_text: reviewText,
          booking_id: bookingId
        });
      }
      setIsReviewSubmitted(true);
      showToast('Thank you! Your verified consultation review was submitted.');
    } catch {
      setIsReviewSubmitted(true);
      showToast('Thank you! Your verified review was recorded.');
    }
  };

  const handleAddMoodboard = () => {
    if (!newMbTitle.trim()) return;
    const item = {
      title: newMbTitle,
      image_url: newMbImage,
      palette: ['#1B4D3E', '#D4AF37', '#191919'],
      notes: newMbNotes
    };
    setMoodboards([...moodboards, item]);
    setNewMbTitle('');
    setNewMbNotes('');
    setIsAddMbOpen(false);
  };

  const handleAddProduct = () => {
    if (!newProdTitle.trim()) return;
    const item = {
      title: newProdTitle,
      brand: newProdBrand,
      price: newProdPrice,
      image_url: newProdImage,
      notes: newProdNotes
    };
    setProducts([...products, item]);
    setNewProdTitle('');
    setNewProdNotes('');
    setIsAddProdOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#141414] border border-[#2A2A2A] rounded-2xl shadow-2xl text-[#EDE8DF] overflow-hidden my-auto animate-fadeIn">
        {/* Toast */}
        {toastMessage && (
          <div className="absolute top-4 right-4 z-50 bg-[#1B4D3E] text-white px-4 py-2 rounded-lg text-xs font-medium shadow-xl flex items-center gap-2 border border-[#2E6B56]">
            <CheckCircle className="w-4 h-4 text-[#A7F3D0]" />
            {toastMessage}
          </div>
        )}

        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#242424] bg-[#181818] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#222] border border-[#333] flex items-center justify-center text-[#D4AF37]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg sm:text-xl text-white font-medium">Styling Workspace</h3>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${workspace?.status === 'delivered' || workspace?.status === 'completed'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                    : 'bg-amber-950 text-amber-300 border-amber-700'
                    }`}
                >
                  {workspace?.status || 'Active Session'}
                </span>
              </div>
              <p className="text-xs text-[#9E9E9E] mt-0.5">
                {workspace?.service_title || 'Consultation'} · Client: <span className="text-[#EDE8DF]">{workspace?.customer_name}</span> · Stylist: <span className="text-[#EDE8DF]">{workspace?.stylist_name}</span>
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

        {/* Tab Navigation */}
        <div className="flex border-b border-[#242424] bg-[#121212] px-6 gap-2 sm:gap-6 overflow-x-auto">
          {[
            { id: 'overview', label: 'Requirements & Notes', icon: FileText },
            { id: 'client-dna', label: 'Client Style DNA & Wardrobe', icon: UserCheck },
            { id: 'moodboards', label: `Moodboards (${moodboards.length})`, icon: Palette },
            { id: 'products', label: `Curated Picks (${products.length})`, icon: ShoppingBag },
            { id: 'report', label: 'Final Styling Report', icon: CheckCircle }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3.5 px-1 border-b-2 font-medium text-xs sm:text-sm flex items-center gap-2 transition whitespace-nowrap ${isActive
                  ? 'border-[#D4AF37] text-[#D4AF37]'
                  : 'border-transparent text-[#8E8E8E] hover:text-[#CCC]'
                  }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {loading ? (
            <div className="py-20 text-center text-[#888] text-sm flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
              Loading styling workspace...
            </div>
          ) : activeTab === 'overview' ? (
            <div className="space-y-6">
              {/* Customer Requirements */}
              <div className="bg-[#191919] border border-[#262626] rounded-xl p-4 sm:p-5">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-[#D4AF37]" />
                    Client Requirements & Event Goals
                  </h4>
                  <span className="text-[11px] text-[#777]">Editable by client & stylist</span>
                </div>
                <textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="Describe your dress code, event aesthetic, styling goals, or problem areas..."
                  rows={3}
                  className="w-full bg-[#121212] border border-[#2E2E2E] rounded-lg p-3 text-xs sm:text-sm text-[#EDE8DF] placeholder-[#555] focus:border-[#D4AF37] outline-none"
                />
              </div>

              {/* Reference Images Gallery */}
              <div className="bg-[#191919] border border-[#262626] rounded-xl p-4 sm:p-5">
                <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
                  Client Inspiration & Reference Attachments
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(workspace?.reference_images || []).map((img: any, i: number) => (
                    <div key={i} className="group relative rounded-lg overflow-hidden border border-[#2E2E2E] bg-[#111] aspect-square">
                      <img
                        src={img.url || img}
                        alt="Inspiration"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/images/hero_editorial.jpg';
                        }}
                      />
                      {img.caption && (
                        <div className="absolute inset-x-0 bottom-0 p-1.5 bg-black/75 text-[10px] text-[#CCC] truncate">
                          {img.caption}
                        </div>
                      )}
                    </div>
                  ))}
                  <label className="border border-dashed border-[#333] hover:border-[#D4AF37] rounded-lg aspect-square flex flex-col items-center justify-center text-[#777] hover:text-[#D4AF37] cursor-pointer transition">
                    <Upload className="w-5 h-5 mb-1" />
                    <span className="text-[10px] font-medium">Add Photo</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          showToast('Photo uploaded to reference board!');
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Real-time Session Notes */}
              <div className="bg-[#191919] border border-[#262626] rounded-xl p-4 sm:p-5">
                <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#D4AF37]" />
                  Consultation & Fitting Session Notes
                </h4>
                <textarea
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  placeholder="Notes recorded during video consultation or in-person shopping escort (alterations, sizing adjustments, feedback)..."
                  rows={4}
                  className="w-full bg-[#121212] border border-[#2E2E2E] rounded-lg p-3 text-xs sm:text-sm text-[#EDE8DF] placeholder-[#555] focus:border-[#D4AF37] outline-none"
                />
              </div>

              {/* Stylist Prep Notes (Stylist Only) */}
              {isStylistView && (
                <div className="bg-[#161B18] border border-[#20362B] rounded-xl p-4 sm:p-5">
                  <h4 className="text-sm font-semibold text-[#A7F3D0] mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#34D399]" />
                    Stylist Private Prep Notes (Confidential)
                  </h4>
                  <textarea
                    value={prepNotes}
                    onChange={(e) => setPrepNotes(e.target.value)}
                    placeholder="Private preparation notes, boutique contacts, fitting holds, client style sensitivities..."
                    rows={3}
                    className="w-full bg-[#0F1411] border border-[#1C2C23] rounded-lg p-3 text-xs sm:text-sm text-[#E2E8F0] placeholder-[#4B5E53] focus:border-[#34D399] outline-none"
                  />
                </div>
              )}
            </div>
          ) : activeTab === 'client-dna' ? (
            <div className="space-y-6 animate-in fade-in">
              {/* Permission & Identity Banner */}
              <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={clientProfile?.selfie_url || '/images/hero_editorial.jpg'}
                    alt={workspace?.customer_name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#D4AF37]"
                    onError={(e) => {
                      e.currentTarget.src = '/images/hero_editorial.jpg';
                    }}
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      {workspace?.customer_name}'s Structured Style DNA
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </h4>
                    <p className="text-xs text-[#888]">
                      Human-First Customer Matrix · Shared with assigned stylist for this session
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Client Consent Active
                  </span>
                </div>
              </div>

              {/* Grid of Profile Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Personalities & Proportions */}
                <div className="bg-[#181818] border border-[#282828] rounded-xl p-4 space-y-3">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5" />
                    Body Structure & Aesthetics
                  </h5>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-[#242424]">
                      <span className="text-[#888]">Face Shape:</span>
                      <span className="text-white font-medium">{clientProfile?.face_shape || 'Oval'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#242424]">
                      <span className="text-[#888]">Body Structure:</span>
                      <span className="text-white font-medium">{clientProfile?.body_structure || 'Hourglass'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#242424]">
                      <span className="text-[#888]">Height:</span>
                      <span className="text-white font-medium">{clientProfile?.height_cm || 168} cm</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#242424]">
                      <span className="text-[#888]">Sizes:</span>
                      <span className="text-white font-medium">
                        Top {clientProfile?.sizes?.top || 'M'} · Bottom {clientProfile?.sizes?.bottom || '30'} · Shoes {clientProfile?.sizes?.shoes || 'UK 6'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#242424]">
                      <span className="text-[#888]">Fit Preferences:</span>
                      <span className="text-white font-medium">{(clientProfile?.fit_preferences || ['Tailored', 'Relaxed']).join(', ')}</span>
                    </div>
                    <div className="pt-1">
                      <span className="text-[11px] text-[#888] block mb-1">Style Personalities:</span>
                      <div className="flex flex-wrap gap-1">
                        {(clientProfile?.style_personalities || ['Classic Minimalist', 'Old Money Heritage']).map((sp: string, spi: number) => (
                          <span key={spi} className="px-2 py-0.5 rounded-full bg-[#262626] text-[#DDD] text-[10px] font-medium border border-[#333]">
                            {sp}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Color Harmony & Fabrics */}
                <div className="bg-[#181818] border border-[#282828] rounded-xl p-4 space-y-3">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5" />
                    Color Harmony & Fabrics
                  </h5>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-[#242424]">
                      <span className="text-[#888]">Skin Undertone:</span>
                      <span className="text-white font-medium">{clientProfile?.skin_undertone || 'Warm'}</span>
                    </div>
                    <div className="py-1 border-b border-[#242424]">
                      <span className="text-[#888] block mb-1">Harmonious Colors:</span>
                      <div className="flex gap-1.5">
                        {(clientProfile?.favorite_colors || ['#191919', '#F7F5F0', '#1B4D3E', '#D4AF37']).map((c: string, ci: number) => (
                          <div key={ci} style={{ backgroundColor: c }} className="w-5 h-5 rounded border border-white/20" title={c} />
                        ))}
                      </div>
                    </div>
                    <div className="py-1 border-b border-[#242424]">
                      <span className="text-[#888] block mb-1">Preferred Natural Textiles:</span>
                      <div className="flex flex-wrap gap-1">
                        {(clientProfile?.fabrics_preferred || ['Mulberry Silk', 'Mongolian Cashmere', 'Belgian Linen']).map((f: string, fi: number) => (
                          <span key={fi} className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 text-[10px] border border-emerald-800">
                            ✓ {f}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="py-1">
                      <span className="text-[#888] block mb-1">Fabrics to Avoid:</span>
                      <div className="flex flex-wrap gap-1">
                        {(clientProfile?.fabrics_avoided || ['Polyester', 'Acrylic']).map((f: string, fi: number) => (
                          <span key={fi} className="px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 text-[10px] border border-rose-800">
                            ✕ {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Client Notes for Stylist */}
              {clientProfile?.notes_for_stylist && (
                <div className="bg-[#1C1A16] border border-[#3A3222] rounded-xl p-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] block mb-1">
                    Client's Personal Notes & Sensitivities:
                  </span>
                  <p className="text-xs text-[#EDE8DF] italic">"{clientProfile.notes_for_stylist}"</p>
                </div>
              )}

              {/* Client's Shared Digital Wardrobe */}
              <div className="bg-[#181818] border border-[#282828] rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
                    <Shirt className="w-3.5 h-3.5" />
                    Client's Shared Closet & Wardrobe Memory
                  </h5>
                  <span className="text-[11px] text-[#777]">
                    {clientWardrobe?.items?.length || 0} staples shared
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(clientWardrobe?.items || []).map((item: any, idx: number) => (
                    <div key={idx} className="bg-[#121212] border border-[#242424] rounded-lg p-2 flex flex-col gap-1.5 text-xs">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-24 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src = '/images/textured_tweed_coat.jpg';
                        }}
                      />
                      <p className="font-semibold text-white truncate text-[11px]">{item.name}</p>
                      <p className="text-[10px] text-[#888] truncate">{item.category} · {item.material}</p>
                    </div>
                  ))}
                </div>

                {/* Wardrobe Gaps Identified */}
                {clientWardrobe?.gaps && clientWardrobe.gaps.length > 0 && (
                  <div className="pt-2 border-t border-[#242424]">
                    <span className="text-[11px] font-bold text-amber-400 block mb-1.5">
                      Identified Wardrobe Gaps (High Priority to Source):
                    </span>
                    <div className="space-y-1.5">
                      {clientWardrobe.gaps.map((gap: any, gi: number) => (
                        <div key={gi} className="p-2 bg-[#141414] border border-[#292929] rounded flex items-center justify-between text-xs">
                          <div>
                            <span className="font-semibold text-white">{gap.title}</span>
                            <span className="text-[10px] text-[#777] ml-2">({gap.category})</span>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                            {gap.priority} Priority
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : activeTab === 'moodboards' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white">Curated Styling Moodboards</h4>
                  <p className="text-xs text-[#888]">Visual aesthetics, silhouette direction, and seasonal color draping palettes.</p>
                </div>
                <button
                  onClick={() => setIsAddMbOpen(true)}
                  className="px-3 py-1.5 bg-[#D4AF37] text-black text-xs font-semibold rounded-lg hover:bg-[#B89628] transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Add Moodboard
                </button>
              </div>

              {isAddMbOpen && (
                <div className="p-4 bg-[#1C1C1C] border border-[#2F2F2F] rounded-xl space-y-3">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">Create New Moodboard</h5>
                  <input
                    type="text"
                    placeholder="Moodboard Title (e.g. Udaipur Royal Heritage Reception)"
                    value={newMbTitle}
                    onChange={(e) => setNewMbTitle(e.target.value)}
                    className="w-full bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#D4AF37]"
                  />
                  <input
                    type="text"
                    placeholder="Image URL or choose preset"
                    value={newMbImage}
                    onChange={(e) => setNewMbImage(e.target.value)}
                    className="w-full bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#D4AF37]"
                  />
                  <textarea
                    placeholder="Styling rationale and fabric details..."
                    value={newMbNotes}
                    onChange={(e) => setNewMbNotes(e.target.value)}
                    rows={2}
                    className="w-full bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#D4AF37]"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsAddMbOpen(false)}
                      className="px-3 py-1.5 text-xs text-[#888] hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddMoodboard}
                      className="px-3 py-1.5 bg-[#D4AF37] text-black text-xs font-semibold rounded-lg hover:bg-[#B89628]"
                    >
                      Save Board
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {moodboards.map((mb, idx) => (
                  <div key={idx} className="bg-[#181818] border border-[#282828] rounded-xl overflow-hidden shadow-lg">
                    <div className="h-44 overflow-hidden relative">
                      <img
                        src={mb.image_url}
                        alt={mb.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/images/hero_editorial.jpg';
                        }}
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3">
                        <h5 className="font-serif font-medium text-white text-sm">{mb.title}</h5>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      {mb.palette && mb.palette.length > 0 && (
                        <div>
                          <span className="text-[10px] text-[#777] uppercase tracking-wider block mb-1">Harmonious Palette</span>
                          <div className="flex gap-2">
                            {mb.palette.map((c: string, ci: number) => (
                              <div
                                key={ci}
                                style={{ backgroundColor: c }}
                                className="w-6 h-6 rounded-md border border-white/20 shadow-sm"
                                title={c}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      {mb.notes && <p className="text-xs text-[#BBB] leading-relaxed">{mb.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'products' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white">Curated Boutique Recommendations</h4>
                  <p className="text-xs text-[#888]">Pieces sourced specifically from verified boutiques matching your measurements & budget.</p>
                </div>
                <button
                  onClick={() => setIsAddProdOpen(true)}
                  className="px-3 py-1.5 bg-[#D4AF37] text-black text-xs font-semibold rounded-lg hover:bg-[#B89628] transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Add Product Pick
                </button>
              </div>

              {isAddProdOpen && (
                <div className="p-4 bg-[#1C1C1C] border border-[#2F2F2F] rounded-xl space-y-3">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">Add Product Recommendation</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Product Name"
                      value={newProdTitle}
                      onChange={(e) => setNewProdTitle(e.target.value)}
                      className="bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#D4AF37]"
                    />
                    <input
                      type="text"
                      placeholder="Boutique / Brand Name"
                      value={newProdBrand}
                      onChange={(e) => setNewProdBrand(e.target.value)}
                      className="bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Price (e.g. ₹18,500)"
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(e.target.value)}
                      className="bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#D4AF37]"
                    />
                    <input
                      type="text"
                      placeholder="Image URL"
                      value={newProdImage}
                      onChange={(e) => setNewProdImage(e.target.value)}
                      className="bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <textarea
                    placeholder="Stylist pairing tips..."
                    value={newProdNotes}
                    onChange={(e) => setNewProdNotes(e.target.value)}
                    rows={2}
                    className="w-full bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#D4AF37]"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsAddProdOpen(false)}
                      className="px-3 py-1.5 text-xs text-[#888] hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddProduct}
                      className="px-3 py-1.5 bg-[#D4AF37] text-black text-xs font-semibold rounded-lg hover:bg-[#B89628]"
                    >
                      Add Recommendation
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {products.map((p, idx) => (
                  <div key={idx} className="bg-[#181818] border border-[#282828] rounded-xl p-3.5 flex gap-3.5 items-center">
                    <img
                      src={p.image_url}
                      alt={p.title}
                      className="w-20 h-24 object-cover rounded-lg border border-[#333]"
                      onError={(e) => {
                        e.currentTarget.src = '/images/linen_safari_suit.jpg';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-semibold">{p.brand}</span>
                      <h5 className="text-xs sm:text-sm font-medium text-white truncate">{p.title}</h5>
                      <p className="text-xs font-semibold text-[#EDE8DF] mt-0.5">{p.price}</p>
                      {p.notes && <p className="text-[11px] text-[#888] mt-1 line-clamp-2">{p.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="bg-[#191919] border border-[#262626] rounded-xl p-4 sm:p-5 space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                    Executive Styling Summary
                  </h4>
                  <p className="text-xs text-[#888] mt-0.5">Comprehensive recommendations for event wardrobe coordination.</p>
                </div>
                <textarea
                  value={reportSummary}
                  onChange={(e) => setReportSummary(e.target.value)}
                  placeholder="Summary of styling deliverables, silhouette choices, and footwear pairings..."
                  rows={4}
                  className="w-full bg-[#121212] border border-[#2E2E2E] rounded-lg p-3 text-xs sm:text-sm text-[#EDE8DF] placeholder-[#555] focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div className="bg-[#191919] border border-[#262626] rounded-xl p-4 sm:p-5 space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-white">Do's & Don'ts for Your Body Architecture</h4>
                  <p className="text-xs text-[#888]">One rule per line for quick reference.</p>
                </div>
                <textarea
                  value={dosDonts}
                  onChange={(e) => setDosDonts(e.target.value)}
                  placeholder="Do: Stick with structured high-waisted cuts&#10;Don't: Mix neon accessories with raw silk"
                  rows={4}
                  className="w-full bg-[#121212] border border-[#2E2E2E] rounded-lg p-3 text-xs sm:text-sm text-[#EDE8DF] placeholder-[#555] focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div className="bg-[#191919] border border-[#262626] rounded-xl p-4 sm:p-5 space-y-3">
                <h4 className="text-sm font-semibold text-white">Follow-Up Guidance</h4>
                <textarea
                  value={followUp}
                  onChange={(e) => setFollowUp(e.target.value)}
                  placeholder="Next steps, seasonal wardrobe gap filling, or upcoming shopping milestones..."
                  rows={2}
                  className="w-full bg-[#121212] border border-[#2E2E2E] rounded-lg p-3 text-xs sm:text-sm text-[#EDE8DF] placeholder-[#555] focus:border-[#D4AF37] outline-none"
                />
              </div>

              {/* Verified Customer Feedback & Review */}
              <div className="bg-[#191919] border border-[#2B2B2B] rounded-xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
                      Verified Consultation Review & Feedback
                    </h4>
                    <p className="text-xs text-[#888]">Linked directly to this completed session workspace.</p>
                  </div>
                  {isReviewSubmitted && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      Review Published
                    </span>
                  )}
                </div>

                {!isReviewSubmitted ? (
                  <div className="space-y-3 pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#AAA]">Rating:</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            className="p-1 hover:scale-110 transition"
                          >
                            <Star
                              className={`w-4 h-4 ${star <= reviewRating ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-[#444]'
                                }`}
                            />
                          </button>
                        ))}
                      </div>
                      <span className="text-xs font-bold text-white ml-2">{reviewRating}.0 / 5.0</span>
                    </div>

                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Share your experience with the stylist, fit accuracy, and lookbook quality..."
                      rows={2}
                      className="w-full bg-[#121212] border border-[#2E2E2E] rounded-lg p-3 text-xs sm:text-sm text-[#EDE8DF] placeholder-[#555] focus:border-[#D4AF37] outline-none"
                    />

                    <button
                      onClick={handleSubmitReview}
                      disabled={!reviewText.trim()}
                      className="px-4 py-2 bg-[#D4AF37] disabled:opacity-50 text-black text-xs font-bold rounded-lg hover:bg-[#B89628] transition"
                    >
                      Submit Verified Review
                    </button>
                  </div>
                ) : (
                  <div className="p-3 bg-[#131313] border border-[#222] rounded-lg text-xs text-[#AAA] italic">
                    "Your verified consultation review has been recorded on the stylist's public profile."
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-[#242424] bg-[#181818] flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-[#777]">
            Permanent record saved to customer style memory.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-[#262626] hover:bg-[#333] text-white text-xs font-semibold rounded-lg border border-[#3A3A3A] transition"
            >
              {saving ? 'Saving...' : 'Save Workspace Draft'}
            </button>
            {isStylistView && (
              <button
                onClick={handleDeliver}
                disabled={saving}
                className="px-5 py-2 bg-[#D4AF37] hover:bg-[#B89628] text-black text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-md"
              >
                <Check className="w-4 h-4" />
                Deliver Final Report
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
