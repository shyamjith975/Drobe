import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  ShoppingBag, 
  Sparkles, 
  Compass, 
  Scissors, 
  Heart, 
  Bookmark, 
  Calendar, 
  MessageSquare, 
  Settings, 
  TrendingUp, 
  Star, 
  MapPin, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  ChevronRight,
  Filter,
  Eye,
  Camera,
  Shirt,
  UserCheck,
  Plus,
  Trash2,
  Ticket,
  QrCode,
  Package,
  Layers,
  ShieldCheck,
  Palette,
  ExternalLink,
  Shield,
  HelpCircle,
  AlertCircle,
  X,
  Send,
  MessageCircle,
  CheckCircle2,
  Zap,
  Award,
  Lock,
  ShieldAlert,
  Percent,
  Users2
} from 'lucide-react';
import { api } from '@drobe/api-client';
import { StylingWorkspaceModal } from './StylingWorkspaceModal';
import { FeedView } from './FeedView';
import { StylistsView } from './StylistsView';
import { FashionRecommendationsView } from './FashionRecommendationsView';

interface CustomerPortalViewProps {
  currentUser: any;
  posts: any[];
  stylists: any[];
  brands: any[];
  onOpenBooking: (stylist: any, service?: any) => void;
  onOpenMessages: () => void;
  onOpenCreatePost: () => void;
  onLikePost?: (id: string) => void;
  onSavePost?: (id: string) => void;
  onAddComment?: (postId: string, content: string) => void;
}

export const CustomerPortalView: React.FC<CustomerPortalViewProps> = ({
  currentUser,
  posts,
  stylists,
  brands,
  onOpenBooking,
  onOpenMessages,
  onOpenCreatePost,
  onLikePost,
  onSavePost,
  onAddComment
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'dashboard' | 'style-profile' | 'occasions' | 'recommendations' | 'wardrobe' | 'studios' | 'rentals' | 'feed' | 'discover' | 'stylists' | 'collections' | 'bookings' | 'settings'
  >('dashboard');

  const [feedCategory, setFeedCategory] = useState<string>('All');
  const [custStylistCity, setCustStylistCity] = useState<string>('All');
  const [actionToast, setActionToast] = useState<string>('');
  const [showAllMobileTabs, setShowAllMobileTabs] = useState<boolean>(true);

  // ----------------- STYLING WORKSPACE MODAL (Section 1.D) -----------------
  const [selectedBookingForWorkspace, setSelectedBookingForWorkspace] = useState<string | null>(null);
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);

  // ----------------- STYLE PROFILE STATE (Section 1.A) -----------------
  const [styleProfile, setStyleProfile] = useState<any>({
    selfie_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    style_personalities: ['Classic Minimalist', 'Old Money Heritage', 'Understated Chic'],
    face_shape: 'Oval',
    body_structure: 'Hourglass',
    height_cm: 168,
    sizes: { top: 'M', bottom: '30', dress: 'UK 10', shoes: 'UK 6' },
    fit_preferences: ['Tailored', 'Relaxed Drape', 'High-Rise'],
    lifestyle_activities: ['Corporate Executive', 'Weekend Gallery Openings', 'Festive Celebrations'],
    occasion_needs: ['Destination Wedding Guest (Udaipur)', 'Autumn Capsule Wardrobe'],
    budget_tier: 'Mid-Luxury',
    budget_ranges: {
      tops: '₹3,500 - ₹8,000',
      dresses: '₹8,000 - ₹25,000',
      occasion_wear: '₹20,000 - ₹65,000',
      accessories: '₹4,000 - ₹15,000'
    },
    skin_undertone: 'Warm',
    favorite_colors: ['#191919', '#F7F5F0', '#1B4D3E', '#D4AF37', '#9E7B66'],
    colors_to_avoid: ['Neon Green', 'Mustard Yellow', 'Electric Blue'],
    fabrics_preferred: ['Mulberry Silk', 'Mongolian Cashmere', 'Belgian Linen', 'Virgin Wool'],
    fabrics_avoided: ['Polyester', 'Acrylic', 'Nylon Blends'],
    share_with_stylists: true,
    notes_for_stylist: 'Prefer breathable natural textiles. Love sharp shoulder silhouettes and high-waisted pleated trousers. No loud neon accents.'
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // ----------------- WARDROBE GAPS (Section 1.E) -----------------
  const [wardrobeGaps, setWardrobeGaps] = useState<any[]>([
    {
      id: 'gap-1',
      title: 'Double-Faced Camel Hair Overcoat',
      category: 'Outerwear',
      priority: 'High',
      notes: 'Crucial missing staple to bridge winter business attire and formal eveningwear.',
      recommended_by_stylist: true,
      stylist_name: 'Rohan Varma'
    },
    {
      id: 'gap-2',
      title: 'Structured Top-Handle Box Bag in Espresso Box Calf',
      category: 'Accessories',
      priority: 'Medium',
      notes: 'Everyday structured luxury bag to elevate casual denim and knit combinations.',
      recommended_by_stylist: false
    }
  ]);
  const [isAddGapOpen, setIsAddGapOpen] = useState(false);
  const [newGapTitle, setNewGapTitle] = useState('');
  const [newGapCat, setNewGapCat] = useState('Outerwear');
  const [newGapPriority, setNewGapPriority] = useState('High');
  const [newGapNotes, setNewGapNotes] = useState('');

  // ----------------- OCCASION PROJECTS (Section 2) -----------------
  const [occasionProjects, setOccasionProjects] = useState<any[]>([
    {
      id: 'occ-1',
      title: 'Royal Udaipur Palace Wedding & Reception',
      occasion_type: 'Wedding',
      event_date: '2026-12-18',
      city: 'Udaipur',
      total_budget: 120000,
      status: 'active',
      notes: '4-day destination wedding at Taj Lake Palace, Udaipur. Multi-professional coordinated schedule.',
      palette_theme: {
        title: 'Emerald, Antique Gold & Ivory',
        swatches: ['#1B4D3E', '#D4AF37', '#F7F5F0', '#4A0E17', '#EAE8E3']
      },
      group_members: [
        { id: 'gm-1', name: 'Priya Nair (You)', role: 'Host / Bride', phone: '+91 98470 12345', assigned_garment: 'Emerald Cut-Out Bias Silk Gown', sizing: 'UK 10', split_amount: 24000, payment_status: 'paid' },
        { id: 'gm-2', name: 'Ananya Sen', role: 'Maid of Honor', phone: '+91 98471 22334', assigned_garment: 'Handloom Raw Silk Saree in Antique Gold', sizing: 'M', split_amount: 16500, payment_status: 'paid' },
        { id: 'gm-3', name: 'Meera Joseph', role: 'Bridesmaid', phone: '+91 98472 33445', assigned_garment: 'Maison Heritage Pleated Tissue Gown', sizing: 'S', split_amount: 14500, payment_status: 'pending' },
        { id: 'gm-4', name: 'Siddharth Roy', role: 'Groomsman', phone: '+91 98473 44556', assigned_garment: 'Double-Breasted Raw Silk Bandhgala', sizing: '40R', split_amount: 18000, payment_status: 'paid' }
      ],
      escrow_package: {
        package_value: 120000,
        bundle_discount: 8500,
        damage_protection_fee: 1499,
        net_payable: 112999,
        deposit_paid: 45199,
        remaining_balance: 67800,
        status: 'milestone_1_released',
        damage_protection: true,
        milestones: [
          { name: 'Milestone 1: 40% Atelier & Stylist Lock', amount: 45199, status: 'released' },
          { name: 'Milestone 2: 30% Mid-Fitting & Trousseau Signoff', amount: 33900, status: 'escrow_locked' },
          { name: 'Milestone 3: 30% Post-Event Return & Completion', amount: 33900, status: 'pending' }
        ]
      },
      concierge_trial: {
        status: 'scheduled',
        trial_date: '2026-11-25',
        trial_time: '14:30',
        delivery_address: 'Taj Lake Palace, Lake Pichola, Udaipur',
        concierge_fee: 1500,
        fee_credited_to_purchase: true,
        selected_outfits: [
          'Emerald Cut-Out Bias Silk Gown',
          'Heritage Raw Silk Embroidered Sherwani',
          'Milanese Peak-Lapel Double-Breasted Tuxedo'
        ]
      },
      booked_services: [
        { role: 'Personal Stylist', professional_name: 'Rohan Varma', service: 'Full Wedding Wardrobe Curation', status: 'confirmed', fee: 12000 },
        { role: 'Bridal Stylist', professional_name: 'Maya Nambiar', service: 'Kasavu & Trousseau Styling', status: 'confirmed', fee: 18000 },
        { role: 'Makeup Artist', professional_name: 'Zara Khan Studio', service: 'Bridal HD Glam & Hair', status: 'confirmed', fee: 28000 },
        { role: 'Editorial Photographer', professional_name: 'Lumière Atelier', service: 'Palace Portraiture', status: 'confirmed', fee: 38000 },
        { role: 'Boutique Attire', boutique_name: 'Maison Heritage Kochi', service: 'Emerald Velvet Gown', status: 'purchased', fee: 24000 }
      ]
    }
  ]);
  const [isAddOccasionOpen, setIsAddOccasionOpen] = useState(false);
  const [newOccasionTitle, setNewOccasionTitle] = useState('');

  // ----------------- HIGH-VALUE BUSINESS EXTENSIONS STATE -----------------
  // 1. Radar Alerts
  const [radarAlerts, setRadarAlerts] = useState<any[]>([
    {
      id: 'alert-1',
      occasion_id: 'occ-1',
      occasion_title: 'Royal Udaipur Palace Wedding & Reception',
      days_remaining: 23,
      severity: 'urgent',
      title: 'Trousseau Fitting Deadline Approaching',
      message: 'Final fitting slot must be locked 14 days prior to event to guarantee master atelier alterations.',
      action_label: 'Book At-Home Trial Concierge',
      action_type: 'trial'
    },
    {
      id: 'alert-2',
      occasion_id: 'occ-1',
      occasion_title: 'Royal Udaipur Palace Wedding & Reception',
      days_remaining: 23,
      severity: 'info',
      title: 'Bridal Party Palette Theme Harmonized',
      message: 'Emerald Velvet & Antique Gold swatches approved for 4 attendants. View group sizing.',
      action_label: 'Review Group Room',
      action_type: 'group'
    }
  ]);

  // 2. DROBE Club Customer Subscription
  const [customerSub, setCustomerSub] = useState<any>({
    tier: 'quarterly_reset',
    tier_name: 'Quarterly Wardrobe Reset',
    price_inr: 3999,
    billing_cycle: 'quarterly',
    status: 'active',
    resets_total: 4,
    resets_remaining: 3,
    assigned_stylist_name: 'Maya Nambiar',
    next_reset_date: '2026-11-28',
    perks: [
      'Quarterly 1-on-1 Wardrobe Audit & Edit',
      'Continuous Digital Wardrobe Memory curation',
      'Unlimited WhatsApp Concierge queries',
      'Priority booking for Atelier Concierge Trials',
      '10% off circular consignment rental listings'
    ]
  });
  const [isScheduleResetOpen, setIsScheduleResetOpen] = useState(false);
  const [isUpgradeSubOpen, setIsUpgradeSubOpen] = useState(false);
  const [resetDate, setResetDate] = useState('2026-11-28');
  const [resetSeason, setResetSeason] = useState('Winter / Festive 2026');
  const [resetNotes, setResetNotes] = useState('Refresh wedding trousseau & black tie outerwear');

  // 3. Sovereign Escrow Checkout Modal
  const [isEscrowCheckoutOpen, setIsEscrowCheckoutOpen] = useState(false);
  const [selectedOccasionForEscrow, setSelectedOccasionForEscrow] = useState<any>(null);
  const [includeDamageProtection, setIncludeDamageProtection] = useState(true);

  // 4. Group Occasion Room ("Split the Tab") Modal
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [memberOccasionId, setMemberOccasionId] = useState<string>('occ-1');
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Bridesmaid');
  const [newMemberPhone, setNewMemberPhone] = useState('+91 98471 22334');
  const [newMemberGarment, setNewMemberGarment] = useState('Handloom Raw Silk Saree in Antique Gold');
  const [newMemberSizing, setNewMemberSizing] = useState('M');
  const [newMemberSplit, setNewMemberSplit] = useState(16500);

  // 5. At-Home White Glove Concierge Trial Modal
  const [isConciergeTrialOpen, setIsConciergeTrialOpen] = useState(false);
  const [trialOccasionId, setTrialOccasionId] = useState<string>('occ-1');
  const [trialDate, setTrialDate] = useState('2026-11-25');
  const [trialTime, setTrialTime] = useState('14:30');
  const [trialAddress, setTrialAddress] = useState('Taj Lake Palace, Lake Pichola, Udaipur');
  const [trialOutfits, setTrialOutfits] = useState<string[]>([
    'Emerald Cut-Out Bias Silk Gown',
    'Heritage Raw Silk Embroidered Sherwani',
    'Milanese Peak-Lapel Double-Breasted Tuxedo'
  ]);

  // 6. Closet-to-Rental Consignment Modal
  const [isConsignOpen, setIsConsignOpen] = useState(false);
  const [selectedConsignItem, setSelectedConsignItem] = useState<any>(null);
  const [consignDailyPrice, setConsignDailyPrice] = useState(3500);
  const [consignSecurityDeposit, setConsignSecurityDeposit] = useState(7000);

  // 7. WhatsApp Concierge Interactive Drawer
  const [isWhatsAppDrawerOpen, setIsWhatsAppDrawerOpen] = useState(false);
  const [waInputMessage, setWaInputMessage] = useState('');
  const [waChatHistory, setWaChatHistory] = useState<any[]>([
    {
      sender: 'stylist',
      text: 'Namaste Priya! I am your DROBE WhatsApp Personal Styling Concierge. Looking for a custom ensemble, luxury trial fitting, or immediate outfit pairing?',
      time: '11:42 AM'
    }
  ]);
  const [waChatLoading, setWaChatLoading] = useState(false);
  const [newOccasionType, setNewOccasionType] = useState('Wedding');
  const [newOccasionDate, setNewOccasionDate] = useState('2026-12-20');
  const [newOccasionCity, setNewOccasionCity] = useState('Udaipur');
  const [newOccasionBudget, setNewOccasionBudget] = useState(85000);

  // ----------------- DIGITAL WARDROBE (Section 1.E) -----------------
  const [wardrobeCategory, setWardrobeCategory] = useState<string>('All');
  const [isAddPieceOpen, setIsAddPieceOpen] = useState(false);
  const [newPieceName, setNewPieceName] = useState('');
  const [newPieceCat, setNewPieceCat] = useState('Outerwear');
  const [newPieceMaterial, setNewPieceMaterial] = useState('Belgian Linen');
  const [newPieceColor, setNewPieceColor] = useState('Oatmeal');
  const [newPieceSeason, setNewPieceSeason] = useState('Spring / Summer');
  const [newPieceImage, setNewPieceImage] = useState('/images/linen_safari_suit.jpg');

  const [wardrobeItems, setWardrobeItems] = useState<any[]>([
    {
      id: 'w-1',
      name: 'Oatmeal Double-Breasted Linen Blazer',
      category: 'Outerwear',
      color: 'Oatmeal',
      material: '100% Belgian Linen',
      season: 'Spring / Summer',
      image: '/images/linen_safari_suit.jpg',
      occasions: ['Smart Casual', 'Brunch', 'Gallery Opening']
    },
    {
      id: 'w-2',
      name: 'Charcoal Cashmere Mockneck Knit',
      category: 'Tops',
      color: 'Midnight Charcoal',
      material: 'Grade-A Mongolian Cashmere',
      season: 'Autumn / Winter',
      image: '/images/cashmere_mockneck.jpg',
      occasions: ['Executive Meeting', 'Travel', 'Dinner']
    },
    {
      id: 'w-3',
      name: 'Tailored Wide-Leg Pleated Trousers',
      category: 'Bottoms',
      color: 'Ivory Cream',
      material: 'Virgin Tropical Wool',
      season: 'All Season',
      image: '/images/poplin_skirt_set.jpg',
      occasions: ['Office', 'Formal', 'Resort']
    },
    {
      id: 'w-4',
      name: 'Emerald Cut-Out Bias Silk Gown',
      category: 'Eveningwear',
      color: 'Deep Emerald',
      material: 'Heavy Mulberry Silk Charmeuse',
      season: 'Special Occasions',
      image: '/images/emerald_silk_gown.jpg',
      occasions: ['Gala', 'Wedding Reception', 'Sangeet'],
      is_consigned_for_rental: true,
      rental_price_per_day: 3500,
      consignment_payout_pct: 60,
      consignment_earnings_total: 14000,
      consignment_status: 'active'
    }
  ]);

  const [outfitCombos, setOutfitCombos] = useState<any[]>([
    {
      id: 'combo-1',
      name: 'Old Money Summer Executive',
      occasion: 'Business Casual',
      pieces: ['Oatmeal Double-Breasted Linen Blazer', 'Tailored Wide-Leg Pleated Trousers'],
      image: '/images/linen_safari_suit.jpg',
      stylistNotes: 'Pair with Belgian calf suede loafers and a minimal silver signet ring.'
    },
    {
      id: 'combo-2',
      name: 'Winter Monochrome Minimalist',
      occasion: 'Evening Dinner',
      pieces: ['Charcoal Cashmere Mockneck Knit', 'Tailored Wide-Leg Pleated Trousers'],
      image: '/images/cashmere_mockneck.jpg',
      stylistNotes: 'Drape an oversized wool overcoat and unstructured leather tote.'
    }
  ]);

  // ----------------- PARTNER STYLING STUDIOS (Section 1.H) -----------------
  const [studios, setStudios] = useState<any[]>([]);
  const [selectedStudioForBooking, setSelectedStudioForBooking] = useState<any | null>(null);
  const [selectedStudioService, setSelectedStudioService] = useState<any | null>(null);
  const [studioApptDate, setStudioApptDate] = useState<string>('2026-11-20');
  const [studioApptTime, setStudioApptTime] = useState<string>('11:00');
  const [studioApptNotes, setStudioApptNotes] = useState<string>('');
  const [isBookingStudioOpen, setIsBookingStudioOpen] = useState<boolean>(false);
  const [selectedStudioCity, setSelectedStudioCity] = useState<string>('All');

  // ----------------- FASHION RENTALS & EVENT PASSES -----------------
  const [customerRentals, setCustomerRentals] = useState<any[]>([
    {
      id: 'rnt-1',
      garment_title: 'Sabyasachi Heritage Raw Silk Embroidered Sherwani',
      boutique: 'Heritage Bridal Vault · Delhi',
      rental_period: '7 Days (Nov 10 – Nov 17)',
      return_due: '2026-11-17',
      rental_fee: 14500,
      security_deposit: 25000,
      status: 'Confirmed & Dispatching',
      image: '/images/linen_safari_suit.jpg'
    },
    {
      id: 'rnt-2',
      garment_title: 'Maison Margiela Sculptural Tailored Wool Cape',
      boutique: 'Archival Runway Lounge · Mumbai',
      rental_period: '3 Days (Nov 04 – Nov 07)',
      return_due: '2026-11-07',
      rental_fee: 6800,
      security_deposit: 15000,
      status: 'In Transit',
      image: '/images/pink_tweed_coat.jpg'
    }
  ]);

  const [customerPasses, setCustomerPasses] = useState<any[]>([
    {
      id: 'tkt-1',
      event_title: 'DROBE Kochi Couture Runway & Atelier Gala',
      date: 'Saturday, Nov 22, 2026 · 6:00 PM',
      venue: 'Grand Hyatt Waterfront Ballroom, Bolgatty, Kochi',
      tier: 'Front Row VIP Pass',
      price: 3500,
      ticket_code: 'DRB-RUNWAY-8429',
      status: 'Confirmed'
    },
    {
      id: 'tkt-2',
      event_title: 'Masterclass: Editorial Fashion & Lookbook Direction',
      date: 'Sunday, Nov 29, 2026 · 11:00 AM',
      venue: 'Studio Ivory Light & Sound, Panampilly Nagar, Kochi',
      tier: 'Studio Participant Seat',
      price: 4200,
      ticket_code: 'DRB-EDU-3912',
      status: 'Confirmed'
    }
  ]);

  const [qrPassModalItem, setQrPassModalItem] = useState<any | null>(null);

  const showToast = (msg: string) => {
    setActionToast(msg);
    setTimeout(() => setActionToast(''), 3500);
  };

  const [bookingFilter, setBookingFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');

  // Customer Saved Collections
  const [savedBoards, setSavedBoards] = useState<any[]>([
    {
      id: 'board-1',
      title: 'Old Money & Quiet Luxury',
      itemsCount: 14,
      cover: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
      tag: 'Old Money'
    },
    {
      id: 'board-2',
      title: 'Wedding & Destination Looks',
      itemsCount: 8,
      cover: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
      tag: 'Wedding'
    },
    {
      id: 'board-3',
      title: 'Casual Weekend & Streetwear',
      itemsCount: 22,
      cover: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=600&q=80',
      tag: 'Casual'
    },
    {
      id: 'board-4',
      title: 'Office & Tailored Minimalist',
      itemsCount: 11,
      cover: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
      tag: 'Formal'
    }
  ]);

  // Customer Bookings
  const [customerBookings, setCustomerBookings] = useState<any[]>([
    {
      id: 'cbk-1',
      stylist_name: 'Maya Nambiar',
      stylist_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      service_title: 'Full Wardrobe Audit & Capsule Styling',
      booking_date: '2026-11-06',
      booking_time: '14:00',
      service_mode: 'physical_shopping',
      status: 'confirmed',
      total_amount: 7000,
      paid_amount: 3500,
      city: 'Kochi'
    },
    {
      id: 'cbk-2',
      stylist_name: 'Rohan Varma',
      stylist_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      service_title: 'Virtual Style & Palette Consultation',
      booking_date: '2026-11-12',
      booking_time: '16:30',
      service_mode: 'virtual_consultation',
      status: 'pending',
      total_amount: 2500,
      paid_amount: 0,
      city: 'Kozhikode'
    }
  ]);

  useEffect(() => {
    // 1. Fetch style profile from backend
    api.styleProfile.getMe()
      .then((data) => {
        if (data) setStyleProfile(data);
      })
      .catch((err) => console.log('Style profile load fallback:', err));

    // 2. Fetch wardrobe items from backend
    api.wardrobe.getItems()
      .then((items) => {
        if (items && items.length > 0) {
          setWardrobeItems(items.map((it: any) => ({
            id: it.id,
            name: it.name,
            category: it.category,
            color: it.color,
            material: it.material,
            season: it.tags?.join(', ') || 'All Season',
            image: it.image_url,
            occasions: it.tags || ['Occasion']
          })));
        }
      })
      .catch((err) => console.log('Wardrobe items load fallback:', err));

    // 3. Fetch wardrobe gaps from backend
    api.wardrobe.getGaps()
      .then((gaps) => {
        if (gaps && gaps.length > 0) setWardrobeGaps(gaps);
      })
      .catch((err) => console.log('Wardrobe gaps load fallback:', err));

    // 4. Fetch occasion projects from backend
    api.occasions.list()
      .then((projects) => {
        if (projects && projects.length > 0) setOccasionProjects(projects);
      })
      .catch((err) => console.log('Occasion projects load fallback:', err));

    // 5. Fetch bookings from backend
    api.bookings.list()
      .then((bks) => {
        if (bks && bks.length > 0) setCustomerBookings(bks);
      })
      .catch((err) => console.log('Bookings load fallback:', err));

    // 6. Fetch partner studios (Section 1.H)
    api.studios.list()
      .then((stds) => {
        if (stds && stds.length > 0) setStudios(stds);
      })
      .catch((err) => console.log('Studios load fallback:', err));

    // 7. Fetch proactive occasion radar alerts
    api.occasions.getRadarAlerts()
      .then((alerts) => {
        if (alerts && alerts.length > 0) setRadarAlerts(alerts);
      })
      .catch((err) => console.log('Radar alerts load fallback:', err));

    // 8. Fetch DROBE Club customer membership
    api.subscriptions.getCustomerMe()
      .then((sub) => {
        if (sub) setCustomerSub(sub);
      })
      .catch((err) => console.log('Customer sub load fallback:', err));
  }, []);

  const handleSaveStyleProfile = async () => {
    setSavingProfile(true);
    try {
      const updated = await api.styleProfile.updateMe(styleProfile);
      setStyleProfile(updated);
      showToast('My Style Profile updated & saved to backend!');
    } catch (err: any) {
      console.error('Failed to update style profile:', err);
      showToast('Profile saved locally!');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleCreateWardrobePiece = async () => {
    if (!newPieceName.trim()) return;
    try {
      const payload = {
        name: newPieceName,
        category: newPieceCat,
        material: newPieceMaterial,
        color: newPieceColor,
        image_url: newPieceImage,
        tags: [newPieceSeason, 'Curated'],
        shared_with_stylist: true
      };
      const created = await api.wardrobe.createItem(payload);
      setWardrobeItems(prev => [
        {
          id: created.id,
          name: created.name,
          category: created.category,
          color: created.color,
          material: created.material,
          season: newPieceSeason,
          image: created.image_url,
          occasions: ['Everyday Chic']
        },
        ...prev
      ]);
      setNewPieceName('');
      setIsAddPieceOpen(false);
      showToast('Garment added to your Digital Wardrobe!');
    } catch (err) {
      setWardrobeItems(prev => [
        {
          id: `w-${Date.now()}`,
          name: newPieceName,
          category: newPieceCat,
          color: newPieceColor,
          material: newPieceMaterial,
          season: newPieceSeason,
          image: newPieceImage,
          occasions: ['Everyday Chic']
        },
        ...prev
      ]);
      setNewPieceName('');
      setIsAddPieceOpen(false);
      showToast('Garment added to your Digital Wardrobe!');
    }
  };

  const handleDeleteWardrobePiece = async (id: string) => {
    try {
      await api.wardrobe.deleteItem(id);
    } catch (err) {
      console.log('Delete fallback');
    }
    setWardrobeItems(prev => prev.filter(item => item.id !== id));
    showToast('Garment removed from wardrobe.');
  };

  const handleCreateWardrobeGap = async () => {
    if (!newGapTitle.trim()) return;
    try {
      const payload = {
        title: newGapTitle,
        category: newGapCat,
        priority: newGapPriority,
        notes: newGapNotes,
        recommended_by_stylist: false
      };
      const created = await api.wardrobe.createGap(payload);
      setWardrobeGaps(prev => [created, ...prev]);
    } catch (err) {
      setWardrobeGaps(prev => [
        {
          id: `gap-${Date.now()}`,
          title: newGapTitle,
          category: newGapCat,
          priority: newGapPriority,
          notes: newGapNotes,
          recommended_by_stylist: false
        },
        ...prev
      ]);
    }
    setNewGapTitle('');
    setNewGapNotes('');
    setIsAddGapOpen(false);
    showToast('Wardrobe gap recorded!');
  };

  const handleCreateOccasionProject = async () => {
    if (!newOccasionTitle.trim()) return;
    try {
      const payload = {
        title: newOccasionTitle,
        occasion_type: newOccasionType,
        event_date: newOccasionDate,
        city: newOccasionCity,
        total_budget: Number(newOccasionBudget),
        booked_services: [
          { role: 'Personal Stylist', professional_name: 'Maya Nambiar', service: 'Trousseau Consultation', status: 'confirmed', fee: 18000 }
        ],
        notes: 'Coordinated multi-professional project'
      };
      const created = await api.occasions.create(payload);
      setOccasionProjects(prev => [created, ...prev]);
    } catch (err) {
      setOccasionProjects(prev => [
        {
          id: `occ-${Date.now()}`,
          title: newOccasionTitle,
          occasion_type: newOccasionType,
          event_date: newOccasionDate,
          city: newOccasionCity,
          total_budget: Number(newOccasionBudget),
          booked_services: [
            { role: 'Personal Stylist', professional_name: 'Maya Nambiar', service: 'Trousseau Consultation', status: 'confirmed', fee: 18000 }
          ],
          status: 'active'
        },
        ...prev
      ]);
    }
    setNewOccasionTitle('');
    setIsAddOccasionOpen(false);
    showToast('Occasion project workspace initialized!');
  };

  const handleFundEscrow = async (projectId: string) => {
    try {
      const res = await api.occasions.checkoutBundle(projectId, {
        include_damage_protection: includeDamageProtection,
        damage_protection_fee: 1499,
        payment_method: 'card',
        deposit_percentage: 40
      });
      setOccasionProjects(prev => prev.map(p => {
        if (p.id === projectId) {
          return {
            ...p,
            escrow_package: res.escrow_package || {
              status: 'funded_40_percent',
              deposit_paid: 45199,
              remaining_balance: 67800,
              damage_protection: includeDamageProtection,
              milestones: [
                { name: 'Milestone 1: 40% Atelier & Stylist Lock', amount: 45199, status: 'released' },
                { name: 'Milestone 2: 30% Mid-Fitting & Trousseau Signoff', amount: 33900, status: 'escrow_locked' },
                { name: 'Milestone 3: 30% Post-Event Return & Completion', amount: 33900, status: 'pending' }
              ]
            }
          };
        }
        return p;
      }));
      setIsEscrowCheckoutOpen(false);
      showToast('Sovereign Escrow funded! 40% released, 60% locked safely.');
    } catch (err) {
      setOccasionProjects(prev => prev.map(p => {
        if (p.id === projectId) {
          return {
            ...p,
            escrow_package: {
              ...(p.escrow_package || {}),
              status: 'milestone_1_released',
              damage_protection: includeDamageProtection
            }
          };
        }
        return p;
      }));
      setIsEscrowCheckoutOpen(false);
      showToast('Sovereign Escrow package funded!');
    }
  };

  const handleAddGroupMember = async () => {
    if (!newMemberName.trim()) return;
    try {
      const payload = {
        name: newMemberName,
        role: newMemberRole,
        phone: newMemberPhone,
        assigned_garment: newMemberGarment,
        sizing: newMemberSizing,
        split_amount: Number(newMemberSplit) || 15000
      };
      const res = await api.occasions.addGroupMember(memberOccasionId, payload);
      setOccasionProjects(prev => prev.map(p => {
        if (p.id === memberOccasionId) {
          return {
            ...p,
            group_members: res.group_members || [
              ...(p.group_members || []),
              { id: `gm-${Date.now()}`, ...payload, payment_status: 'pending' }
            ]
          };
        }
        return p;
      }));
      setIsAddMemberOpen(false);
      setNewMemberName('');
      showToast(`Added ${newMemberName} to Bridal Party Roster!`);
    } catch (err) {
      setOccasionProjects(prev => prev.map(p => {
        if (p.id === memberOccasionId) {
          return {
            ...p,
            group_members: [
              ...(p.group_members || []),
              { id: `gm-${Date.now()}`, name: newMemberName, role: newMemberRole, phone: newMemberPhone, assigned_garment: newMemberGarment, sizing: newMemberSizing, split_amount: Number(newMemberSplit) || 15000, payment_status: 'pending' }
            ]
          };
        }
        return p;
      }));
      setIsAddMemberOpen(false);
      setNewMemberName('');
      showToast(`Added ${newMemberName} to Bridal Party Roster!`);
    }
  };

  const handleToggleMemberPayment = async (projectId: string, memberId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'paid' ? 'pending' : 'paid';
    try {
      await api.occasions.updateMemberPayment(projectId, memberId, nextStatus);
    } catch (err) {
      console.log('Update payment fallback');
    }
    setOccasionProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const updated = (p.group_members || []).map((m: any) => 
          m.id === memberId ? { ...m, payment_status: nextStatus } : m
        );
        return { ...p, group_members: updated };
      }
      return p;
    }));
    showToast(`Payment updated: Marked ${nextStatus.toUpperCase()}!`);
  };

  const handleBookConciergeTrial = async () => {
    try {
      const payload = {
        trial_date: trialDate,
        trial_time: trialTime,
        delivery_address: trialAddress,
        selected_outfit_ids: trialOutfits,
        notes: 'VIP White-Glove Trial with portable steam station and senior stylist assistant'
      };
      const res = await api.occasions.bookConciergeTrial(trialOccasionId, payload);
      setOccasionProjects(prev => prev.map(p => {
        if (p.id === trialOccasionId) {
          return {
            ...p,
            concierge_trial: res.concierge_trial || {
              status: 'scheduled',
              trial_date: trialDate,
              trial_time: trialTime,
              delivery_address: trialAddress,
              concierge_fee: 1500,
              fee_credited_to_purchase: true,
              selected_outfits: trialOutfits
            }
          };
        }
        return p;
      }));
      setIsConciergeTrialOpen(false);
      showToast('White-Glove At-Home Trial confirmed! Stylist assigned.');
    } catch (err) {
      setOccasionProjects(prev => prev.map(p => {
        if (p.id === trialOccasionId) {
          return {
            ...p,
            concierge_trial: {
              status: 'scheduled',
              trial_date: trialDate,
              trial_time: trialTime,
              delivery_address: trialAddress,
              concierge_fee: 1500,
              fee_credited_to_purchase: true,
              selected_outfits: trialOutfits
            }
          };
        }
        return p;
      }));
      setIsConciergeTrialOpen(false);
      showToast('At-Home Trial booked successfully!');
    }
  };

  const handleConsignItem = async () => {
    if (!selectedConsignItem) return;
    try {
      await api.wardrobe.consignToRental(selectedConsignItem.id, {
        rental_price_per_day: Number(consignDailyPrice) || 3500,
        security_deposit_inr: Number(consignSecurityDeposit) || 7000
      });
    } catch (err) {
      console.log('Consign fallback');
    }
    setWardrobeItems(prev => prev.map(item => {
      if (item.id === selectedConsignItem.id) {
        return {
          ...item,
          is_consigned_for_rental: true,
          rental_price_per_day: consignDailyPrice,
          consignment_payout_pct: 60,
          consignment_earnings_total: item.consignment_earnings_total || 0,
          consignment_status: 'active'
        };
      }
      return item;
    }));
    setIsConsignOpen(false);
    showToast('Piece consigned to Circular Rental Vault! 60% take-home active.');
  };

  const handleScheduleReset = async () => {
    try {
      const res = await api.subscriptions.scheduleReset(resetDate, resetSeason, resetNotes);
      setCustomerSub(res);
      setIsScheduleResetOpen(false);
      showToast('Wardrobe Audit Reset scheduled with your assigned stylist!');
    } catch (err) {
      setCustomerSub((prev: any) => ({
        ...prev,
        next_reset_date: resetDate,
        resets_remaining: Math.max(0, (prev?.resets_remaining || 3) - 1)
      }));
      setIsScheduleResetOpen(false);
      showToast('Reset scheduled successfully!');
    }
  };

  const handleUpgradeSub = async (tier: string) => {
    try {
      const res = await api.subscriptions.subscribeCustomer(tier, 'annual');
      setCustomerSub(res);
      setIsUpgradeSubOpen(false);
      showToast(`Upgraded to ${res.tier_name}!`);
    } catch (err) {
      setCustomerSub({
        tier: 'annual_elite',
        tier_name: 'Annual Elite Sovereign Club',
        price_inr: 12999,
        billing_cycle: 'annual',
        status: 'active',
        resets_total: 6,
        resets_remaining: 6,
        assigned_stylist_name: 'Maya Nambiar',
        next_reset_date: resetDate
      });
      setIsUpgradeSubOpen(false);
      showToast('Upgraded to Annual Elite Sovereign Club!');
    }
  };

  const handleSendWaMessage = async () => {
    if (!waInputMessage.trim()) return;
    const userText = waInputMessage;
    setWaInputMessage('');
    setWaChatHistory(prev => [
      ...prev,
      { sender: 'client', text: userText, time: 'Just now' }
    ]);
    setWaChatLoading(true);
    try {
      const res = await api.whatsapp.askStylist({
        message: userText,
        occasion_type: 'Wedding & Gala'
      });
      setWaChatHistory(prev => [
        ...prev,
        {
          sender: 'stylist',
          text: res.stylist_reply || 'Found exquisite options from our verified boutique ateliers:',
          recommendations: res.recommended_items || [],
          actions: res.quick_actions || ['Order Sample / At-Home Trial', 'Book Stylist Fitting', 'Continue in WhatsApp'],
          time: 'Just now'
        }
      ]);
    } catch (err) {
      setWaChatHistory(prev => [
        ...prev,
        {
          sender: 'stylist',
          text: 'I recommend our Emerald Cut-Out Bias Silk Gown from Maison Heritage or the Bespoke Linen Safari Suit. Would you like an At-Home Trial?',
          recommendations: [
            { id: 'wa-rec-1', title: 'Emerald Cut-Out Bias Silk Gown', price_inr: 24000, boutique: 'Maison Heritage' }
          ],
          actions: ['Order Sample / At-Home Trial', 'Book Stylist Fitting', 'Continue in WhatsApp'],
          time: 'Just now'
        }
      ]);
    } finally {
      setWaChatLoading(false);
    }
  };

  const handleBookStudio = async () => {
    if (!selectedStudioForBooking || !selectedStudioService) return;
    try {
      const payload = {
        service_title: selectedStudioService.title,
        appointment_date: studioApptDate,
        appointment_time: studioApptTime,
        price: selectedStudioService.price,
        notes: studioApptNotes
      };
      await api.studios.book(selectedStudioForBooking.id, payload);
      showToast(`Studio appointment confirmed at ${selectedStudioForBooking.name}!`);
      setIsBookingStudioOpen(false);
      setCustomerPasses(prev => [
        {
          id: `studio-${Date.now()}`,
          event_title: `${selectedStudioService.title} · ${selectedStudioForBooking.name}`,
          date: `${studioApptDate} at ${studioApptTime}`,
          venue: selectedStudioForBooking.address,
          tier: 'Certified Experience Centre Pass',
          price: selectedStudioService.price,
          ticket_code: `DRB-STUDIO-${Math.floor(1000 + Math.random() * 9000)}`,
          status: 'Confirmed'
        },
        ...prev
      ]);
    } catch {
      showToast(`Studio appointment confirmed at ${selectedStudioForBooking.name}!`);
      setIsBookingStudioOpen(false);
      setCustomerPasses(prev => [
        {
          id: `studio-${Date.now()}`,
          event_title: `${selectedStudioService.title} · ${selectedStudioForBooking.name}`,
          date: `${studioApptDate} at ${studioApptTime}`,
          venue: selectedStudioForBooking.address,
          tier: 'Certified Experience Centre Pass',
          price: selectedStudioService.price,
          ticket_code: `DRB-STUDIO-${Math.floor(1000 + Math.random() * 9000)}`,
          status: 'Confirmed'
        },
        ...prev
      ]);
    }
  };

  return (
    <div className="customer-portal-root w-full max-w-full overflow-x-hidden min-h-[90vh] bg-[#F7F5F0] p-3 sm:p-6 lg:p-8 pb-28 sm:pb-20">
      <div className="max-w-[1280px] mx-auto w-full">

        {/* Customer Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={16} color="#191919" />
              <span className="text-xs font-semibold text-[#8A8176] uppercase tracking-wider">
                Customer Experience Portal
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#191919]">
              Welcome, {currentUser?.profile?.display_name || 'Priya Nair'}
            </h1>
            <p className="text-xs sm:text-sm text-[#666] mt-1">
              Discover looks tailored to your interests: {currentUser?.profile?.fashion_interests?.join(' · ') || 'Old Money · Minimalist · Wedding'}
            </p>
          </div>

          <div className="flex gap-2.5 shrink-0">
            <button
              onClick={() => setActiveSubTab('recommendations')}
              className="w-full sm:w-auto bg-[#191919] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer hover:bg-black transition-all"
            >
              <Sparkles size={15} color="#d4af37" />
              <span>Explore Style Recommendations</span>
            </button>
          </div>
        </div>

        {/* ==============================================================================
            CUSTOMER SUB-NAVIGATION: REDESIGNED FOR 100% VISIBILITY ON ALL SCREENS
        ============================================================================== */}

        {/* 1. MOBILE VIEW (Screen < md): 2-Column Visual Grid of All 12 Functions */}
        <div className="block md:hidden mb-6">
          {/* Active View Quick Selector Bar */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '10px 14px',
            border: '1px solid #EAE8E3',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#8A8176' }}>
                View:
              </span>
              <select
                value={activeSubTab}
                onChange={(e) => setActiveSubTab(e.target.value as any)}
                style={{
                  border: 'none',
                  background: '#F7F5F0',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  color: '#191919',
                  padding: '4px 8px',
                  borderRadius: '8px',
                  outline: 'none',
                  cursor: 'pointer',
                  maxWidth: '170px'
                }}
              >
                {[
                  { id: 'dashboard', label: 'My Style Hub' },
                  { id: 'style-profile', label: 'My Style Profile' },
                  { id: 'occasions', label: 'Occasion Projects' },
                  { id: 'recommendations', label: 'Color & Fabric Guide' },
                  { id: 'wardrobe', label: 'Digital Wardrobe & Memory' },
                  { id: 'studios', label: 'Partner Studios & Experience' },
                  { id: 'rentals', label: 'My Rentals & Event Passes' },
                  { id: 'feed', label: 'Fashion Social Feed' },
                  { id: 'stylists', label: 'Creative & Beauty Talent' },
                  { id: 'collections', label: 'Saved Collections' },
                  { id: 'bookings', label: 'Stylist Consultations' },
                  { id: 'settings', label: 'Account & Interests' }
                ].map(t => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={() => setShowAllMobileTabs(prev => !prev)}
              style={{
                background: showAllMobileTabs ? '#191919' : '#F7F5F0',
                color: showAllMobileTabs ? '#FFFFFF' : '#191919',
                border: '1px solid #EAE8E3',
                borderRadius: '999px',
                padding: '5px 10px',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {showAllMobileTabs ? 'Hide Grid' : 'All 12 Features ▾'}
            </button>
          </div>

          {/* 2-Column Responsive Luxury Function Grid (All 12 Functions Fully Visible without Scrolling!) */}
          {showAllMobileTabs && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '8px',
              marginBottom: '16px'
            }}>
              {[
                { id: 'dashboard', label: 'My Style Hub', shortDesc: 'Radar & resets', icon: TrendingUp },
                { id: 'style-profile', label: 'My Style Profile', shortDesc: 'DNA & sizing', icon: UserCheck },
                { id: 'occasions', label: 'Occasion Projects', shortDesc: 'Bridal workspaces', icon: Layers },
                { id: 'recommendations', label: 'Color & Fabric Guide', shortDesc: 'Textile guides', icon: Sparkles },
                { id: 'wardrobe', label: 'Digital Wardrobe', shortDesc: 'Memory & gaps', icon: Shirt },
                { id: 'studios', label: 'Partner Studios', shortDesc: 'Bespoke centres', icon: MapPin },
                { id: 'rentals', label: 'Rentals & Passes', shortDesc: 'Vault & QR passes', icon: Ticket },
                { id: 'feed', label: 'Fashion Feed', shortDesc: 'Shop creator looks', icon: Compass },
                { id: 'stylists', label: 'Creative Talent', shortDesc: 'Verified stylists', icon: Scissors },
                { id: 'collections', label: 'Saved Collections', shortDesc: 'Curated looks', icon: Bookmark },
                { id: 'bookings', label: 'Consultations', shortDesc: 'Active bookings', icon: Calendar },
                { id: 'settings', label: 'Account & Settings', shortDesc: 'Preferences & info', icon: Settings }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeSubTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setActiveSubTab(tab.id as any);
                    }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: '12px 10px',
                      borderRadius: '16px',
                      border: isActive ? '1.5px solid #191919' : '1px solid #EAE8E3',
                      background: isActive ? '#191919' : '#FFFFFF',
                      color: isActive ? '#FFFFFF' : '#191919',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: isActive ? '0 4px 12px rgba(25,25,25,0.15)' : '0 1px 4px rgba(0,0,0,0.02)',
                      position: 'relative'
                    }}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '10px',
                      background: isActive ? '#333333' : '#F7F5F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '8px'
                    }}>
                      <Icon size={16} color={isActive ? '#D4AF37' : '#191919'} />
                    </div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, lineHeight: 1.2 }}>
                      {tab.label}
                    </div>
                    <div style={{
                      fontSize: '0.66rem',
                      color: isActive ? 'rgba(255,255,255,0.7)' : '#8A8176',
                      marginTop: '2px',
                      lineHeight: 1.2
                    }}>
                      {tab.shortDesc}
                    </div>
                    {isActive && (
                      <span style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        background: '#D4AF37'
                      }} />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 2. DESKTOP VIEW (Screen >= md): Full Categorized Pills Bar */}
        <div className="hidden md:flex flex-col gap-2 mb-6 w-full">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.95)',
            padding: '6px',
            borderRadius: '999px',
            border: '1px solid #EAE8E3',
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            width: '100%',
            boxSizing: 'border-box'
          }} className="no-scrollbar">
            {[
              { id: 'dashboard', label: 'My Style Hub', icon: TrendingUp },
              { id: 'style-profile', label: 'My Style Profile', icon: UserCheck },
              { id: 'occasions', label: 'Occasion Projects', icon: Layers },
              { id: 'recommendations', label: 'Color & Fabric Guide', icon: Sparkles },
              { id: 'wardrobe', label: 'Digital Wardrobe & Memory', icon: Shirt },
              { id: 'studios', label: 'Partner Studios & Experience', icon: MapPin },
              { id: 'rentals', label: 'My Rentals & Event Passes', icon: Ticket },
              { id: 'feed', label: 'Fashion Social Feed', icon: Compass },
              { id: 'stylists', label: 'Creative & Beauty Talent', icon: Scissors },
              { id: 'collections', label: 'Saved Collections', icon: Bookmark },
              { id: 'bookings', label: 'Stylist Consultations', icon: Calendar },
              { id: 'settings', label: 'Account & Interests', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveSubTab(tab.id as any)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '999px',
                    fontSize: '0.78rem',
                    fontWeight: isActive ? 700 : 500,
                    whiteSpace: 'nowrap',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    background: isActive ? '#191919' : 'transparent',
                    color: isActive ? '#FFFFFF' : '#444444'
                  }}
                >
                  <Icon size={14} color={isActive ? '#D4AF37' : '#8A8176'} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ----------------- 1. MY STYLE HUB (DASHBOARD) ----------------- */}
        {activeSubTab === 'dashboard' && (
          <div>
            {/* --- 1.0. OCCASION RADAR & PROACTIVE AUTOMATED ALERTS --- */}
            {radarAlerts.length > 0 && (() => {
              const primaryAlert = radarAlerts[0] || {};
              const occTitle = primaryAlert.occasion || primaryAlert.occasion_title || 'Royal Destination Wedding & Sangeet';
              const daysRemaining = primaryAlert.countdown_days ?? primaryAlert.days_remaining ?? 23;
              const radarMessage = primaryAlert.message || (primaryAlert.recommended_look 
                ? `Curated Ensemble: ${primaryAlert.recommended_look} in ${primaryAlert.city || 'Udaipur'}${primaryAlert.paired_stylist ? ` · Lead Stylist: ${primaryAlert.paired_stylist}` : ''}.` 
                : 'Proactive styling analysis active. Private at-home fittings and bespoke boutique locks ready for booking.');
              const urgencyBadge = primaryAlert.urgency || 'Active Countdown';
              
              return (
                <div 
                  style={{
                    background: 'linear-gradient(135deg, #1C1A18 0%, #292522 50%, #1A1715 100%)',
                    color: '#FFFFFF',
                    borderRadius: '24px',
                    padding: '24px',
                    marginBottom: '28px',
                    border: '1px solid rgba(212, 175, 55, 0.45)',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 12px 36px rgba(0,0,0,0.2)',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />
                  <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'rgba(212, 175, 55, 0.22)',
                          color: '#F3E5AB',
                          padding: '4px 12px',
                          borderRadius: '999px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          border: '1px solid rgba(212, 175, 55, 0.45)'
                        }}>
                          <Zap size={13} className="animate-pulse" color="#D4AF37" />
                          <span>Occasion Radar · {urgencyBadge}</span>
                        </span>
                        <span style={{ fontSize: '0.78rem', color: '#EAE8E3', fontWeight: 600 }}>
                          Next: {occTitle}
                        </span>
                      </div>
                      <h3 style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: '1.45rem',
                        fontWeight: 700,
                        color: '#FFFFFF',
                        lineHeight: 1.25,
                        margin: '6px 0'
                      }}>
                        {daysRemaining} Days Until Your Destination Occasion
                      </h3>
                      <p style={{
                        fontSize: '0.85rem',
                        color: 'rgba(255, 255, 255, 0.9)',
                        lineHeight: 1.45,
                        maxWidth: '720px',
                        margin: 0
                      }}>
                        {radarMessage}
                      </p>
                    </div>
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
                      <button
                        onClick={() => {
                          setTrialOccasionId(primaryAlert.occasion_id || primaryAlert.project_id || 'occ-1');
                          setIsConciergeTrialOpen(true);
                        }}
                        style={{
                          background: '#D4AF37',
                          color: '#191919',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          padding: '11px 20px',
                          borderRadius: '999px',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          whiteSpace: 'nowrap',
                          boxShadow: '0 4px 14px rgba(212, 175, 55, 0.35)',
                          transition: 'all 0.15s'
                        }}
                      >
                        <Sparkles size={15} color="#191919" />
                        <span>{primaryAlert.action_label || 'Book At-Home Trial'}</span>
                      </button>
                      <button
                        onClick={() => setActiveSubTab('occasions')}
                        style={{
                          background: 'rgba(255, 255, 255, 0.12)',
                          color: '#FFFFFF',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          padding: '11px 18px',
                          borderRadius: '999px',
                          border: '1px solid rgba(255, 255, 255, 0.28)',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.15s'
                        }}
                      >
                        <span>Occasion Room</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Additional Radar Bulletins */}
                  {radarAlerts.length > 1 && (
                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.15)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '10px' }}>
                      {radarAlerts.slice(1).map((alert: any) => {
                        const secTitle = alert.occasion || alert.title || 'Upcoming Gala';
                        const secMsg = alert.recommended_look || alert.message || (alert.city ? `Event in ${alert.city} · ${alert.urgency || ''}` : '');
                        return (
                          <div 
                            key={alert.id} 
                            style={{
                              background: 'rgba(255, 255, 255, 0.08)',
                              borderRadius: '16px',
                              padding: '12px 14px',
                              border: '1px solid rgba(255, 255, 255, 0.18)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '12px'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                              <CheckCircle2 size={16} color="#81C784" style={{ flexShrink: 0 }} />
                              <div style={{ minWidth: 0 }}>
                                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {secTitle}
                                </div>
                                <div style={{ fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.8)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {secMsg}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                if (alert.action_type === 'trial' || alert.action_label?.includes('Trial')) {
                                  setTrialOccasionId(alert.project_id || alert.occasion_id || 'occ-1');
                                  setIsConciergeTrialOpen(true);
                                } else {
                                  setActiveSubTab('occasions');
                                }
                              }}
                              style={{
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                color: '#D4AF37',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                flexShrink: 0
                              }}
                            >
                              {alert.action_label || 'Review Look'} →
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* --- 1.1. DROBE CLUB PERSONAL STYLING SUBSCRIPTION STRIP --- */}
            <div className="bg-[#FFFFFF] rounded-3xl p-4 sm:p-6 border border-[#EAE8E3] flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 sm:mb-8 shadow-xs w-full overflow-hidden">
              <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-[#F7F5F0] border border-[#EAE8E3] flex items-center justify-center shrink-0 text-[#D4AF37]">
                  <Award size={24} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm sm:text-base text-[#191919]">
                      DROBE Club · {customerSub?.tier_name || 'Quarterly Reset Member'}
                    </span>
                    <span className="bg-[#E8F5E9] text-[#2E7D32] text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border border-[#C8E6C9]">
                      ● Active VIP
                    </span>
                  </div>
                  <div className="text-xs text-[#8A8176] mt-0.5">
                    Assigned Lead Stylist: <strong>{customerSub?.assigned_stylist_name || 'Maya Nambiar'}</strong> · Next Audit Reset: <strong>{customerSub?.next_reset_date || 'Nov 28, 2026'}</strong>
                  </div>
                  <div className="text-[11px] text-[#B85D43] font-semibold mt-1">
                    ✨ {customerSub?.resets_remaining || 3} of {customerSub?.resets_total || 4} Seasonal Audits remaining this year
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0 w-full md:w-auto">
                <button
                  onClick={() => setIsScheduleResetOpen(true)}
                  className="flex-1 sm:flex-none text-center bg-[#191919] hover:bg-black text-white px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all shadow-xs"
                >
                  Schedule Reset Audit
                </button>
                <button
                  onClick={() => setIsUpgradeSubOpen(true)}
                  className="flex-1 sm:flex-none text-center bg-[#F7F5F0] hover:bg-[#EAE8E3] text-[#191919] border border-[#EAE8E3] px-3.5 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all"
                >
                  Upgrade Tier
                </button>
              </div>
            </div>

            {/* Profile Completion Strip */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '16px 20px',
              border: '1px solid #EAE8E3',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              marginBottom: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              width: '100%',
              boxSizing: 'border-box',
              overflow: 'hidden'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#191919' }}>
                  Style Profile: 85% Complete
                </div>
                <div style={{ fontSize: '0.78rem', color: '#8A8176' }}>
                  Add your exact sizing and shoe preferences for 1-click tailored suggestions.
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', marginTop: '8px' }}>
                <div style={{ width: '100%', height: '8px', background: '#EAE8E3', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: '85%', height: '100%', background: '#191919', borderRadius: '999px' }} />
                </div>
                <div>
                  <button
                    onClick={() => setActiveSubTab('style-profile')}
                    style={{
                      background: '#F7F5F0',
                      color: '#191919',
                      border: '1px solid #EAE8E3',
                      borderRadius: '999px',
                      padding: '7px 15px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxSizing: 'border-box'
                    }}
                  >
                    Complete Style DNA →
                  </button>
                </div>
              </div>
            </div>

            {/* Recommended Looks & Flagship Spotlight */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: '20px',
              marginBottom: '2.5rem',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              {/* Style Recommendations Spotlight */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                padding: '18px',
                border: '1px solid #EAE8E3',
                position: 'relative',
                overflow: 'hidden',
                boxSizing: 'border-box'
              }}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3.5 w-full">
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#B85D43', display: 'block' }}>
                      Editorial & Stylist Curated
                    </span>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#191919', lineHeight: 1.25, marginTop: '2px' }}>
                      Color & Fabric Recommendations
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveSubTab('recommendations')}
                    style={{
                      background: '#191919',
                      color: '#FFFFFF',
                      padding: '7px 14px',
                      borderRadius: '999px',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                      flexShrink: 0,
                      alignSelf: 'flex-start'
                    }}
                  >
                    Explore Guide
                  </button>
                </div>

                <div style={{ position: 'relative', borderRadius: '18px', overflow: 'hidden', height: '240px' }}>
                  <img
                    src="/images/pink_tweed_coat.jpg"
                    alt="Fashion Recommendations"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.currentTarget.src = '/images/hero_editorial.jpg';
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    maxWidth: 'calc(100% - 32px)',
                    background: 'rgba(255,255,255,0.92)',
                    backdropFilter: 'blur(8px)',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: '#141414',
                    boxSizing: 'border-box'
                  }}>
                    Color Palette & Material Analysis Active
                  </div>
                </div>
              </div>

              {/* Suggested Stylists Nearby */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                padding: '20px',
                border: '1px solid #EAE8E3',
                overflow: 'hidden',
                boxSizing: 'border-box'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  marginBottom: '16px'
                }}>
                  <div style={{ minWidth: 0 }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8A8176', display: 'block' }}>
                      Top Rated in Your City
                    </span>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#191919', lineHeight: 1.25, marginTop: '2px' }}>
                      Suggested Personal Stylists
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveSubTab('stylists')}
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#191919',
                      textDecoration: 'underline',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                  >
                    View All
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {stylists.slice(0, 3).map((st) => (
                    <div
                      key={st.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px',
                        borderRadius: '16px',
                        background: '#F7F5F0',
                        border: '1px solid #EAE8E3'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={st.user?.avatar_url || '/images/stylist_editorial.jpg'}
                          alt={st.user?.display_name}
                          style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.currentTarget.src = '/images/stylist_editorial.jpg';
                          }}
                        />
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#191919' }}>{st.user?.display_name}</div>
                          <div style={{ fontSize: '0.78rem', color: '#8A8176' }}>{st.category} · ★ {st.rating || 5.0}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => onOpenBooking(st)}
                        style={{
                          background: '#191919',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '999px',
                          padding: '6px 14px',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Book
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Saved Collections Showcase */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#191919', fontFamily: "'Playfair Display', Georgia, serif" }}>
                  My Saved Style Collections
                </h3>
                <button
                  onClick={() => setActiveSubTab('collections')}
                  style={{ background: 'none', border: 'none', color: '#191919', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Manage Boards
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '16px' }}>
                {savedBoards.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => setActiveSubTab('collections')}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      border: '1px solid #EAE8E3',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ height: '140px', overflow: 'hidden' }}>
                      <img
                        src={b.cover}
                        alt={b.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.currentTarget.src = '/images/hero_editorial.jpg';
                        }}
                      />
                    </div>
                    <div style={{ padding: '14px' }}>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#191919' }}>{b.title}</div>
                      <div style={{ fontSize: '0.78rem', color: '#8A8176', marginTop: '2px' }}>{b.itemsCount} curated garments</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ----------------- 1.5. MY STYLE PROFILE (Section 1.A) ----------------- */}
        {activeSubTab === 'style-profile' && (
          <div className="space-y-6">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <UserCheck size={18} color="#191919" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#8A8176', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Structured Customer Style DNA
                  </span>
                </div>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '2.2rem', fontWeight: 700, color: '#191919' }}>
                  My Style Profile
                </h2>
                <p style={{ color: '#666', fontSize: '0.92rem', maxWidth: '700px' }}>
                  Your personal visual identity matrix. Reusable across stylists, makeup artists, and boutiques with your permission.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleSaveStyleProfile}
                  disabled={savingProfile}
                  style={{
                    background: '#191919',
                    color: '#FFFFFF',
                    padding: '12px 26px',
                    borderRadius: '999px',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 15px rgba(25,25,25,0.18)'
                  }}
                >
                  <CheckCircle size={16} color="#D4AF37" />
                  <span>{savingProfile ? 'Saving...' : 'Save Style Profile'}</span>
                </button>
              </div>
            </div>

            {/* Privacy & Professional Sharing Consent Bar */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              padding: '18px 24px',
              border: '1px solid #EAE8E3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '14px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: styleProfile.share_with_stylists ? '#E8F5E9' : '#FFF3E0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={22} color={styleProfile.share_with_stylists ? '#2E7D32' : '#E65100'} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#191919' }}>Professional Access Permissions</h4>
                  <p style={{ fontSize: '0.8rem', color: '#666' }}>
                    {styleProfile.share_with_stylists
                      ? 'Enabled: Booked stylists, MUAs, and boutiques can securely view your sizing & color preferences.'
                      : 'Private: Only you can view your style profile.'}
                  </p>
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>
                <input
                  type="checkbox"
                  checked={styleProfile.share_with_stylists}
                  onChange={(e) => setStyleProfile({ ...styleProfile, share_with_stylists: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: '#191919', cursor: 'pointer' }}
                />
                Share with booked professionals
              </label>
            </div>

            {/* Profile Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {/* Card 1: Portrait & Style Personality Questionnaire */}
              <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '26px', border: '1px solid #EAE8E3' }}>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.25rem', fontWeight: 700, color: '#191919', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Camera size={18} color="#D4AF37" />
                  Self-Perception & Style Personality
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                  <img
                    src={styleProfile.selfie_url || '/images/hero_editorial.jpg'}
                    alt="Selfie"
                    style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #D4AF37' }}
                    onError={(e) => {
                      e.currentTarget.src = '/images/hero_editorial.jpg';
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#777', textTransform: 'uppercase', display: 'block' }}>Profile Portrait URL</label>
                    <input
                      type="text"
                      value={styleProfile.selfie_url || ''}
                      onChange={(e) => setStyleProfile({ ...styleProfile, selfie_url: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '1px solid #DDD', fontSize: '0.82rem', marginTop: '4px' }}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#191919', display: 'block', marginBottom: '8px' }}>
                    Select Your Style Personalities
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {[
                      'Classic Minimalist',
                      'Old Money Heritage',
                      'Understated Chic',
                      'Bohemian Elegance',
                      'Casual Parisian',
                      'Royal Traditional',
                      'Avant-Garde Tailored',
                      'Streetwear High-Low'
                    ].map((personality) => {
                      const isSelected = (styleProfile.style_personalities || []).includes(personality);
                      return (
                        <button
                          key={personality}
                          onClick={() => {
                            const current = styleProfile.style_personalities || [];
                            const updated = isSelected
                              ? current.filter((p: string) => p !== personality)
                              : [...current, personality];
                            setStyleProfile({ ...styleProfile, style_personalities: updated });
                          }}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '999px',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            border: isSelected ? '1.5px solid #191919' : '1px solid #DDD',
                            background: isSelected ? '#191919' : '#F9F8F5',
                            color: isSelected ? '#FFFFFF' : '#444',
                            cursor: 'pointer',
                            transition: 'all 0.15s'
                          }}
                        >
                          {personality}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Card 2: Face Shape & Body Structure Architecture */}
              <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '26px', border: '1px solid #EAE8E3' }}>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.25rem', fontWeight: 700, color: '#191919', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={18} color="#D4AF37" />
                  Body Architecture & Proportions
                </h3>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#191919', display: 'block', marginBottom: '6px' }}>
                    Face Shape
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {['Oval', 'Round', 'Square', 'Heart', 'Diamond', 'Oblong'].map((shape) => (
                      <button
                        key={shape}
                        onClick={() => setStyleProfile({ ...styleProfile, face_shape: shape })}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          border: styleProfile.face_shape === shape ? '1.5px solid #191919' : '1px solid #DDD',
                          background: styleProfile.face_shape === shape ? '#191919' : '#FFFFFF',
                          color: styleProfile.face_shape === shape ? '#FFFFFF' : '#444',
                          cursor: 'pointer'
                        }}
                      >
                        {shape}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#191919', display: 'block', marginBottom: '6px' }}>
                    Body Structure
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {['Hourglass', 'Rectangle', 'Inverted Triangle', 'Pear / Spoon', 'Athletic'].map((structure) => (
                      <button
                        key={structure}
                        onClick={() => setStyleProfile({ ...styleProfile, body_structure: structure })}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          border: styleProfile.body_structure === structure ? '1.5px solid #191919' : '1px solid #DDD',
                          background: styleProfile.body_structure === structure ? '#191919' : '#FFFFFF',
                          color: styleProfile.body_structure === structure ? '#FFFFFF' : '#444',
                          cursor: 'pointer'
                        }}
                      >
                        {structure}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#777', textTransform: 'uppercase' }}>Height (cm)</label>
                    <input
                      type="number"
                      value={styleProfile.height_cm || 168}
                      onChange={(e) => setStyleProfile({ ...styleProfile, height_cm: parseInt(e.target.value) || 168 })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '1px solid #DDD', fontSize: '0.85rem', marginTop: '4px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#777', textTransform: 'uppercase' }}>Shoe Size</label>
                    <input
                      type="text"
                      value={styleProfile.sizes?.shoes || 'UK 6'}
                      onChange={(e) => setStyleProfile({ ...styleProfile, sizes: { ...styleProfile.sizes, shoes: e.target.value } })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '1px solid #DDD', fontSize: '0.85rem', marginTop: '4px' }}
                    />
                  </div>
                </div>
              </div>

              {/* Card 3: Exact Sizing & Fit Preferences */}
              <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '26px', border: '1px solid #EAE8E3' }}>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.25rem', fontWeight: 700, color: '#191919', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shirt size={18} color="#D4AF37" />
                  Sizing & Fit Formulations
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#777' }}>Top Size</label>
                    <input
                      type="text"
                      value={styleProfile.sizes?.top || 'M'}
                      onChange={(e) => setStyleProfile({ ...styleProfile, sizes: { ...styleProfile.sizes, top: e.target.value } })}
                      style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #DDD', fontSize: '0.82rem', marginTop: '4px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#777' }}>Bottom Waist</label>
                    <input
                      type="text"
                      value={styleProfile.sizes?.bottom || '30'}
                      onChange={(e) => setStyleProfile({ ...styleProfile, sizes: { ...styleProfile.sizes, bottom: e.target.value } })}
                      style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #DDD', fontSize: '0.82rem', marginTop: '4px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#777' }}>Dress Sizing</label>
                    <input
                      type="text"
                      value={styleProfile.sizes?.dress || 'UK 10'}
                      onChange={(e) => setStyleProfile({ ...styleProfile, sizes: { ...styleProfile.sizes, dress: e.target.value } })}
                      style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #DDD', fontSize: '0.82rem', marginTop: '4px' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#191919', display: 'block', marginBottom: '6px' }}>
                    Preferred Fit Silhouettes
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {['Tailored', 'Relaxed Drape', 'Oversized', 'Structured', 'Bodycon', 'High-Rise'].map((fit) => {
                      const isSelected = (styleProfile.fit_preferences || []).includes(fit);
                      return (
                        <button
                          key={fit}
                          onClick={() => {
                            const cur = styleProfile.fit_preferences || [];
                            const upd = isSelected ? cur.filter((f: string) => f !== fit) : [...cur, fit];
                            setStyleProfile({ ...styleProfile, fit_preferences: upd });
                          }}
                          style={{
                            padding: '5px 12px',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            border: isSelected ? '1.5px solid #191919' : '1px solid #DDD',
                            background: isSelected ? '#191919' : '#FFFFFF',
                            color: isSelected ? '#FFFFFF' : '#555',
                            cursor: 'pointer'
                          }}
                        >
                          {fit}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Card 4: Color Harmony & Fabric Sensitivities (Human-First Preference) */}
              <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '26px', border: '1px solid #EAE8E3' }}>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.25rem', fontWeight: 700, color: '#191919', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Palette size={18} color="#D4AF37" />
                  Color Undertone & Natural Textiles
                </h3>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#191919', display: 'block', marginBottom: '6px' }}>
                    Skin Undertone (Human-Assessed)
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['Warm', 'Cool', 'Neutral', 'Olive'].map((tone) => (
                      <button
                        key={tone}
                        onClick={() => setStyleProfile({ ...styleProfile, skin_undertone: tone })}
                        style={{
                          flex: 1,
                          padding: '7px 0',
                          borderRadius: '8px',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          border: styleProfile.skin_undertone === tone ? '1.5px solid #191919' : '1px solid #DDD',
                          background: styleProfile.skin_undertone === tone ? '#191919' : '#FFFFFF',
                          color: styleProfile.skin_undertone === tone ? '#FFFFFF' : '#444',
                          cursor: 'pointer'
                        }}
                      >
                        {tone}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#191919', display: 'block', marginBottom: '6px' }}>
                    Favorite Signature Colors
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {(styleProfile.favorite_colors || []).map((hex: string, idx: number) => (
                      <div
                        key={idx}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          backgroundColor: hex,
                          border: '1.5px solid rgba(0,0,0,0.15)',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                        }}
                        title={hex}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#191919', display: 'block', marginBottom: '4px' }}>
                    Preferred Natural Textiles
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {(styleProfile.fabrics_preferred || ['Mulberry Silk', 'Mongolian Cashmere', 'Belgian Linen']).map((fab: string, fi: number) => (
                      <span key={fi} style={{ background: '#E8F5E9', color: '#1B5E20', fontSize: '0.72rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px' }}>
                        ✓ {fab}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 5: Lifestyle, Occasions & Budget Matrix */}
              <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '26px', border: '1px solid #EAE8E3' }}>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.25rem', fontWeight: 700, color: '#191919', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShoppingBag size={18} color="#D4AF37" />
                  Budget Tier & Lifestyle Focus
                </h3>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#191919', display: 'block', marginBottom: '6px' }}>
                    Budget Investment Tier
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {['Accessible Chic', 'Mid-Luxury', 'High Luxury / Couture', 'Bespoke Designer'].map((tier) => (
                      <button
                        key={tier}
                        onClick={() => setStyleProfile({ ...styleProfile, budget_tier: tier })}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          border: styleProfile.budget_tier === tier ? '1.5px solid #191919' : '1px solid #DDD',
                          background: styleProfile.budget_tier === tier ? '#191919' : '#FFFFFF',
                          color: styleProfile.budget_tier === tier ? '#FFFFFF' : '#444',
                          cursor: 'pointer'
                        }}
                      >
                        {tier}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#191919', display: 'block', marginBottom: '6px' }}>
                    Active Occasion Requirements
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {(styleProfile.occasion_needs || []).map((need: string, ni: number) => (
                      <span key={ni} style={{ background: '#F7F5F0', border: '1px solid #DDD', color: '#333', fontSize: '0.75rem', fontWeight: 600, padding: '4px 10px', borderRadius: '999px' }}>
                        🎯 {need}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 6: Notes for Booked Professionals */}
              <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '26px', border: '1px solid #EAE8E3' }}>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.25rem', fontWeight: 700, color: '#191919', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MessageSquare size={18} color="#D4AF37" />
                  Notes for Stylist & Makeup Artists
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#888', marginBottom: '8px' }}>
                  Specify specific textile sensitivities, comfort boundaries, style icons, or fitting preferences.
                </p>
                <textarea
                  value={styleProfile.notes_for_stylist || ''}
                  onChange={(e) => setStyleProfile({ ...styleProfile, notes_for_stylist: e.target.value })}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid #DDD',
                    fontSize: '0.85rem',
                    color: '#333',
                    lineHeight: 1.5,
                    resize: 'none'
                  }}
                  placeholder="e.g. Love tailored pleats and monochromatic layering. Avoid polyester blends."
                />
              </div>
            </div>
          </div>
        )}

        {/* ----------------- 2. OCCASION PROJECTS & WORKSPACES (Section 2) ----------------- */}
        {activeSubTab === 'occasions' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '2rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Layers size={18} color="#191919" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#8A8176', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Multi-Professional Occasion Workspaces
                  </span>
                </div>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '2.2rem', fontWeight: 700, color: '#191919' }}>
                  Occasion Project Workspaces
                </h2>
                <p style={{ color: '#666', fontSize: '0.92rem', maxWidth: '750px' }}>
                  Hire stylists, makeup artists, hair specialists, and photographers for one unified occasion (Wedding, Gala, Red Carpet, Editorial). Coordinated schedule and milestone payments.
                </p>
              </div>

              <button
                onClick={() => setIsAddOccasionOpen(true)}
                style={{
                  background: '#191919',
                  color: '#FFFFFF',
                  padding: '12px 22px',
                  borderRadius: '999px',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 15px rgba(25,25,25,0.15)'
                }}
              >
                <Plus size={16} />
                <span>Initialize Occasion Project</span>
              </button>
            </div>

            {/* Occasion Project Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {occasionProjects.map((occ) => (
                <div
                  key={occ.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '24px',
                    padding: '28px',
                    border: '1px solid #EAE8E3',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#B85D43', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {occ.occasion_type} Workspace · {occ.city}
                      </span>
                      <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.6rem', fontWeight: 700, color: '#191919', marginTop: '2px' }}>
                        {occ.title}
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>
                        📅 Target Event Date: <strong>{occ.event_date}</strong> · Coordinated Multi-Professional Roster
                      </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.75rem', color: '#8A8176', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>Total Project Budget</span>
                      <span style={{ fontSize: '1.6rem', fontWeight: 700, color: '#191919', fontFamily: "'Playfair Display', Georgia, serif" }}>
                        ₹{Number(occ.total_budget || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Booked Team Members Strip */}
                  <div style={{ borderTop: '1px solid #EAE8E3', paddingTop: '24px', marginTop: '24px', marginBottom: '28px' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#191919', textTransform: 'uppercase', marginBottom: '14px', letterSpacing: '0.04em' }}>
                      Assigned Professional Team & Attire Sourcing:
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '14px' }}>
                      {(occ.booked_services || []).map((srv: any, si: number) => (
                        <div
                          key={si}
                          style={{
                            background: '#F7F5F0',
                            borderRadius: '16px',
                            padding: '16px',
                            border: '1px solid #EAE8E3',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            minHeight: '135px',
                            boxSizing: 'border-box'
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#8A8176', textTransform: 'uppercase' }}>{srv.role}</span>
                              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#2E7D32', textTransform: 'uppercase' }}>● {srv.status}</span>
                            </div>
                            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#191919' }}>{srv.professional_name || srv.boutique_name}</div>
                            <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '3px' }}>{srv.service}</div>
                          </div>
                          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#191919', marginTop: '10px' }}>
                            ₹{Number(srv.fee || 0).toLocaleString('en-IN')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* --- OCCASION SOVEREIGN ESCROW & DAMAGE PROTECTION SUMMARY --- */}
                  <div style={{ borderTop: '1px solid #EAE8E3', paddingTop: '28px', marginTop: '28px' }}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#191919] flex items-center gap-1.5">
                            <Lock size={14} className="text-[#D4AF37]" />
                            Occasion Sovereign Escrow & Milestone Protection
                          </span>
                          <span className="bg-[#E8F5E9] text-[#2E7D32] text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border border-[#C8E6C9]">
                            ● 40% Advance Released
                          </span>
                        </div>
                        <p className="text-xs text-[#8A8176] mt-1">
                          Payments are safely held in DROBE Sovereign Escrow and released in 3 milestones upon your explicit approval.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedOccasionForEscrow(occ);
                          setIsEscrowCheckoutOpen(true);
                        }}
                        className="self-start sm:self-auto bg-[#191919] hover:bg-black text-white text-xs font-semibold px-4 py-2 rounded-full cursor-pointer transition-all shadow-xs flex items-center gap-1.5 shrink-0"
                      >
                        <ShieldCheck size={14} className="text-[#81C784]" />
                        <span>Manage Sovereign Escrow</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-6">
                      <div className="bg-[#F7F5F0] rounded-2xl p-4 border border-[#EAE8E3] flex flex-col justify-between min-h-[115px]">
                        <div>
                          <span className="text-[11px] font-bold text-[#8A8176] uppercase block mb-1">Bundle Savings</span>
                          <div className="text-base font-bold text-[#2E7D32]">-₹8,500 Discount</div>
                        </div>
                        <div className="text-[11px] text-[#666] mt-2">Multi-service bundling active across 5 booked professionals</div>
                      </div>
                      <div className="bg-[#F7F5F0] rounded-2xl p-4 border border-[#EAE8E3] flex flex-col justify-between min-h-[115px]">
                        <div>
                          <span className="text-[11px] font-bold text-[#8A8176] uppercase block mb-1">Garment Damage Protection</span>
                          <div className="text-base font-bold text-[#191919] flex items-center gap-1.5">
                            <ShieldCheck size={16} className="text-[#81C784]" />
                            +₹1,499 Active
                          </div>
                        </div>
                        <div className="text-[11px] text-[#666] mt-2">Zero-deductible silk, velvet & zari accidental damage coverage</div>
                      </div>
                      <div className="bg-[#F7F5F0] rounded-2xl p-4 border border-[#EAE8E3] flex flex-col justify-between min-h-[115px]">
                        <div>
                          <span className="text-[11px] font-bold text-[#8A8176] uppercase block mb-1">Escrow Balance</span>
                          <div className="text-base font-bold text-[#191919]">₹67,800 Locked</div>
                        </div>
                        <div className="text-[11px] text-[#666] mt-2">Milestone 2 (30%) & Milestone 3 (30%) held safely</div>
                      </div>
                    </div>
                  </div>

                  {/* --- BRIDAL PARTY / GROUP OCCASION ROOM ("SPLIT THE TAB") --- */}
                  <div style={{ borderTop: '1px solid #EAE8E3', paddingTop: '28px', marginTop: '28px' }}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#191919] flex items-center gap-1.5">
                            <Users2 size={14} className="text-[#B85D43]" />
                            Bridal Party & Group Room · Split the Tab
                          </span>
                          <span className="bg-[#FFF8E1] text-[#F57F17] text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border border-[#FFE082]">
                            4 Attendants
                          </span>
                        </div>
                        <p className="text-xs text-[#8A8176] mt-1">
                          Coordinate palette swatches, individual sizing, and track split payments across bridesmaids & groomsmen.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setMemberOccasionId(occ.id);
                          setIsAddMemberOpen(true);
                        }}
                        className="self-start sm:self-auto bg-[#F7F5F0] hover:bg-[#EAE8E3] text-[#191919] border border-[#EAE8E3] text-xs font-semibold px-4 py-2 rounded-full cursor-pointer transition-all flex items-center gap-1.5 shrink-0"
                      >
                        <Plus size={14} />
                        <span>Invite Group Member</span>
                      </button>
                    </div>

                    {/* Palette Harmony Swatches */}
                    <div className="bg-[#F7F5F0] rounded-2xl p-4 sm:p-5 border border-[#EAE8E3] mb-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Palette size={16} className="text-[#8A8176]" />
                        <span className="text-xs font-bold text-[#191919]">Approved Group Palette:</span>
                        <span className="text-xs text-[#8A8176]">{occ.palette_theme?.title || 'Emerald, Antique Gold & Ivory'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {(occ.palette_theme?.swatches || ['#1B4D3E', '#D4AF37', '#F7F5F0', '#4A0E17', '#EAE8E3']).map((hex: string, hi: number) => (
                          <div
                            key={hi}
                            className="w-6 h-6 rounded-full border border-black/20 shadow-xs cursor-pointer hover:scale-110 transition-transform"
                            style={{ backgroundColor: hex }}
                            title={hex}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Group Member Roster */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                      {(occ.group_members || []).map((member: any) => (
                        <div 
                          key={member.id} 
                          className="bg-white rounded-2xl p-4 border border-[#EAE8E3] shadow-xs flex flex-col justify-between"
                          style={{ minHeight: '180px', boxSizing: 'border-box' }}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-bold text-[#8A8176] uppercase">{member.role}</span>
                              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                                member.payment_status === 'paid'
                                  ? 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]'
                                  : 'bg-[#FFF8E1] text-[#F57F17] border-[#FFE082]'
                              }`}>
                                {member.payment_status === 'paid' ? '● Paid' : '○ Pending'}
                              </span>
                            </div>
                            <div className="font-bold text-xs text-[#191919]">{member.name}</div>
                            <div className="text-[11px] text-[#8A8176] mt-1 truncate">{member.assigned_garment}</div>
                            <div className="text-[11px] text-[#666] mt-0.5">Size: {member.sizing} · {member.phone}</div>
                          </div>
                          <div className="mt-4 pt-3 border-t border-[#F0ECE4] flex items-center justify-between">
                            <span className="text-xs font-bold text-[#191919]">₹{Number(member.split_amount).toLocaleString('en-IN')}</span>
                            <button
                              onClick={() => handleToggleMemberPayment(occ.id, member.id, member.payment_status)}
                              className="text-[10px] font-semibold text-[#8A8176] hover:text-[#191919] underline cursor-pointer"
                            >
                              Toggle Paid
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* --- AT-HOME WHITE-GLOVE TRIAL CONCIERGE --- */}
                  <div style={{ borderTop: '1px solid #EAE8E3', paddingTop: '28px', marginTop: '28px' }}>
                    <div className="bg-gradient-to-r from-[#FDFBF7] to-[#F7F5F0] rounded-2xl p-5 sm:p-6 border border-[#EAE8E3] flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="bg-[#191919] text-[#D4AF37] text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <Sparkles size={11} />
                            White Glove At-Home Trial Concierge
                          </span>
                          <span className="text-xs font-semibold text-[#2E7D32]">● Scheduled</span>
                        </div>
                        <div className="text-sm font-bold text-[#191919]">
                          Private Fitting at {occ.concierge_trial?.delivery_address || 'Taj Lake Palace, Udaipur'}
                        </div>
                        <div className="text-xs text-[#666] mt-1">
                          Date: <strong>{occ.concierge_trial?.trial_date || '2026-11-25'} at {occ.concierge_trial?.trial_time || '14:30'}</strong> · Concierge Fee: ₹1,500 (100% credited against final ensemble purchase)
                        </div>
                        <div className="text-[11px] text-[#8A8176] mt-1">
                          Reserved Outfits: {(occ.concierge_trial?.selected_outfits || []).join(' · ')}
                        </div>
                      </div>
                      <div className="shrink-0 flex items-center gap-2">
                        <button
                          onClick={() => {
                            setTrialOccasionId(occ.id);
                            setIsConciergeTrialOpen(true);
                          }}
                          className="bg-[#191919] hover:bg-black text-white text-xs font-semibold px-4 py-2 rounded-full cursor-pointer transition-all shadow-xs"
                        >
                          Modify / Book New Trial
                        </button>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', paddingTop: '20px', marginTop: '28px', borderTop: '1px solid #EAE8E3' }}>
                    <span style={{ fontSize: '0.82rem', color: '#777', fontStyle: 'italic' }}>
                      {occ.notes || 'Coordinated multi-professional occasion schedule.'}
                    </span>
                    <button
                      onClick={() => setActiveSubTab('stylists')}
                      style={{
                        background: '#191919',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '999px',
                        padding: '8px 18px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      + Hire Additional Team Specialist
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------- 2.5. DIGITAL WARDROBE & CAPSULE OUTFITS (Section 1.E) ----------------- */}
        {activeSubTab === 'wardrobe' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '2rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Shirt size={18} color="#191919" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#8A8176', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Digital Wardrobe & Memory
                  </span>
                </div>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '2.2rem', fontWeight: 700, color: '#191919' }}>
                  Digital Wardrobe & Memory
                </h2>
                <p style={{ color: '#666', fontSize: '0.9rem', maxWidth: '700px' }}>
                  Digitize your closet, track identified wardrobe gaps with certified stylists, and store your look combinations.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setIsAddPieceOpen(true)}
                  style={{
                    background: '#191919',
                    color: '#FFFFFF',
                    padding: '12px 22px',
                    borderRadius: '999px',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 15px rgba(25,25,25,0.15)'
                  }}
                >
                  <Plus size={16} />
                  <span>Add Wardrobe Piece</span>
                </button>

                <button
                  onClick={() => setIsAddGapOpen(true)}
                  style={{
                    background: '#FFFFFF',
                    color: '#191919',
                    padding: '12px 20px',
                    borderRadius: '999px',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    border: '1px solid #EAE8E3',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Sparkles size={15} color="#d4af37" />
                  <span>Record Wardrobe Gap</span>
                </button>
              </div>
            </div>

            {/* Wardrobe Gaps Showcase Bar (Section 1.E) */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              padding: '20px 24px',
              border: '1px solid #EAE8E3',
              marginBottom: '2rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#191919' }}>
                    Identified Wardrobe Gaps & Missing Staples
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: '#8A8176' }}>
                    Items highlighted by you and assigned stylists to complete your seasonal capsule.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddGapOpen(true)}
                  style={{ background: 'none', border: 'none', color: '#191919', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  + Add Gap
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '14px' }}>
                {wardrobeGaps.map((gap) => (
                  <div
                    key={gap.id}
                    style={{
                      background: '#F7F5F0',
                      borderRadius: '16px',
                      padding: '16px',
                      border: '1px solid #EAE8E3'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#8A8176', textTransform: 'uppercase' }}>{gap.category}</span>
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '999px',
                        background: gap.priority === 'High' ? '#FEEBEE' : '#FFF8E1',
                        color: gap.priority === 'High' ? '#C62828' : '#F57F17'
                      }}>
                        {gap.priority} Priority
                      </span>
                    </div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#191919' }}>{gap.title}</div>
                    <p style={{ fontSize: '0.78rem', color: '#666', marginTop: '4px' }}>{gap.notes}</p>
                    {gap.recommended_by_stylist && (
                      <div style={{ fontSize: '0.72rem', color: '#D4AF37', fontWeight: 700, marginTop: '8px' }}>
                        ★ Recommended by Stylist {gap.stylist_name}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '24px' }}>
              {['All', 'Outerwear', 'Tops', 'Bottoms', 'Eveningwear'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setWardrobeCategory(cat)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '999px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    border: wardrobeCategory === cat ? '1px solid #191919' : '1px solid #EAE8E3',
                    background: wardrobeCategory === cat ? '#191919' : '#FFFFFF',
                    color: wardrobeCategory === cat ? '#FFFFFF' : '#666',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Wardrobe Items Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
              gap: '20px',
              marginBottom: '3rem'
            }}>
              {wardrobeItems
                .filter(item => wardrobeCategory === 'All' || item.category === wardrobeCategory)
                .map((item) => (
                  <div
                    key={item.id}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '22px',
                      overflow: 'hidden',
                      border: '1px solid #EAE8E3',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
                    }}
                  >
                    <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.currentTarget.src = '/images/linen_safari_suit.jpg';
                        }}
                      />
                      <span style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        background: 'rgba(255,255,255,0.92)',
                        backdropFilter: 'blur(6px)',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: '#191919'
                      }}>
                        {item.category}
                      </span>
                    </div>

                    <div style={{ padding: '18px' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#191919', marginBottom: '4px' }}>
                        {item.name}
                      </h3>
                      <div style={{ fontSize: '0.8rem', color: '#8A8176', marginBottom: '10px' }}>
                        {item.material} · {item.color}
                      </div>

                      {/* Closet-to-Rental Consignment Section */}
                      <div className="mt-2.5 pt-2.5 border-t border-[#F7F5F0]">
                        {item.is_consigned_for_rental ? (
                          <div className="bg-[#E8F5E9] rounded-xl p-2 border border-[#C8E6C9] mb-2">
                            <div className="flex items-center justify-between text-[11px] font-bold text-[#1B5E20]">
                              <span>● Consigned for Rental</span>
                              <span>₹{Number(item.rental_price_per_day || 3500).toLocaleString('en-IN')}/day</span>
                            </div>
                            <div className="text-[10px] text-[#2E7D32] flex items-center justify-between mt-0.5">
                              <span>60% Take-Home Payout</span>
                              <span>Earned: ₹{Number(item.consignment_earnings_total || 14000).toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedConsignItem(item);
                              setIsConsignOpen(true);
                            }}
                            className="w-full bg-[#F7F5F0] hover:bg-[#EAE8E3] text-[#191919] border border-[#EAE8E3] text-xs font-semibold py-1.5 px-3 rounded-full mb-2 cursor-pointer transition-all flex items-center justify-center gap-1.5"
                          >
                            <TrendingUp size={13} className="text-[#2E7D32]" />
                            <span>Consign for Rental (60% Payout)</span>
                          </button>
                        )}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #F7F5F0' }}>
                        <span style={{ fontSize: '0.75rem', color: '#8A8176' }}>{item.season}</span>
                        <button
                          onClick={() => handleDeleteWardrobePiece(item.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#C62828',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Trash2 size={13} />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ----------------- 2.7. PARTNER STYLING STUDIOS (Section 1.H) ----------------- */}
        {activeSubTab === 'studios' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '2rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <MapPin size={18} color="#191919" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#8A8176', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Physical Experience Centres & Certified Studios
                  </span>
                </div>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '2.2rem', fontWeight: 700, color: '#191919' }}>
                  Partner Styling Studios & Ateliers
                </h2>
                <p style={{ color: '#666', fontSize: '0.92rem', maxWidth: '750px' }}>
                  Physical experience centres in major cities. Book private in-person appointments for physical seasonal color draping, body proportion mapping, and senior stylist consultations.
                </p>
              </div>

              {/* City Filter Pills */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['All', 'Kochi', 'Bengaluru', 'Kozhikode', 'Mumbai'].map((city) => (
                  <button
                    key={city}
                    onClick={() => setSelectedStudioCity(city)}
                    style={{
                      padding: '8px 18px',
                      borderRadius: '999px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      border: selectedStudioCity === city ? '1.5px solid #191919' : '1px solid #DDD',
                      background: selectedStudioCity === city ? '#191919' : '#FFFFFF',
                      color: selectedStudioCity === city ? '#FFFFFF' : '#444',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* Studios Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '24px' }}>
              {(studios.length > 0 ? studios : [
                {
                  id: 'studio-kochi',
                  name: 'DROBE Atelier & Experience Centre · Kochi',
                  city: 'Kochi',
                  address: 'Atelier 4, Panampilly Nagar Waterfront Avenue, Kochi, Kerala 682036',
                  image_url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80',
                  rating: 4.96,
                  reviews_count: 58,
                  contact_phone: '+91 484 231 9900',
                  operating_hours: '10:00 AM - 8:00 PM (Tue - Sun)',
                  services: [
                    { title: 'Seasonal Colour Draping & Skin Undertone Analysis', duration_minutes: 60, price: 3500, description: 'Instrument and physical fabric draping to determine your ideal seasonal palette.' },
                    { title: 'Body Proportion & Silhouette Mapping', duration_minutes: 45, price: 2800, description: 'Architectural silhouette analysis to determine garment cuts and necklines.' },
                    { title: 'Senior Stylist Consultation & Printed Dossier', duration_minutes: 90, price: 6000, description: '1-on-1 private consultation with bound printed style dossier and digital lookbook.' }
                  ]
                },
                {
                  id: 'studio-blr',
                  name: 'DROBE Sartorial Lounge · Bengaluru',
                  city: 'Bengaluru',
                  address: '12th Main Road, Indiranagar, Bengaluru, Karnataka 560038',
                  image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
                  rating: 4.94,
                  reviews_count: 72,
                  contact_phone: '+91 80 4120 7700',
                  operating_hours: '10:30 AM - 8:30 PM (Tue - Sun)',
                  services: [
                    { title: 'Executive Wardrobe & Capsule Strategy', duration_minutes: 75, price: 4500, description: 'Strategic capsule planning for executives and leaders.' },
                    { title: 'Seasonal Colour Draping & Undertone Scan', duration_minutes: 60, price: 3500, description: 'Comprehensive physical fabric drape testing across 12 seasonal palettes.' }
                  ]
                },
                {
                  id: 'studio-calicut',
                  name: 'DROBE Heritage Styling Studio · Kozhikode',
                  city: 'Kozhikode',
                  address: 'Beach Road Boulevard, Kozhikode, Kerala 673032',
                  image_url: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80',
                  rating: 4.97,
                  reviews_count: 39,
                  contact_phone: '+91 495 276 4411',
                  operating_hours: '11:00 AM - 8:00 PM (Daily)',
                  services: [
                    { title: 'South Indian Wedding & Groom Wardrobe Curation', duration_minutes: 90, price: 5500, description: 'Bespoke linen, raw silk, and handloom styling with master craftsman fitting.' },
                    { title: 'Personal Color & Silhouette Analysis', duration_minutes: 60, price: 3200, description: 'In-studio drape assessment and custom color swatch card.' }
                  ]
                }
              ])
              .filter(st => selectedStudioCity === 'All' || (st.city && st.city.toLowerCase().includes(selectedStudioCity.toLowerCase())))
              .map((st) => (
                <div
                  key={st.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    border: '1px solid #EAE8E3',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                  }}
                >
                  <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                    <img
                      src={st.image_url}
                      alt={st.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.currentTarget.src = '/images/hero_editorial.jpg';
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      background: 'rgba(25,25,25,0.85)',
                      backdropFilter: 'blur(8px)',
                      color: '#FFFFFF',
                      padding: '4px 12px',
                      borderRadius: '999px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Star size={12} fill="#D4AF37" color="#D4AF37" />
                      <span>{st.rating} ({st.reviews_count || 40})</span>
                    </div>
                  </div>

                  <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#B85D43', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {st.city} Hub · Certified Experience Centre
                      </span>
                      <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.35rem', fontWeight: 700, color: '#191919', marginTop: '4px', marginBottom: '8px' }}>
                        {st.name}
                      </h3>
                      <p style={{ fontSize: '0.82rem', color: '#666', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                        <MapPin size={14} color="#8A8176" />
                        {st.address}
                      </p>
                      <p style={{ fontSize: '0.78rem', color: '#888', marginBottom: '16px' }}>
                        🕒 {st.operating_hours} · 📞 {st.contact_phone}
                      </p>

                      <div style={{ borderTop: '1px solid #EAE8E3', paddingTop: '16px', marginBottom: '16px' }}>
                        <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#191919', textTransform: 'uppercase', marginBottom: '10px' }}>
                          In-Studio Services Available:
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {(st.services || []).map((srv: any, si: number) => (
                            <div
                              key={si}
                              style={{
                                background: '#F7F5F0',
                                borderRadius: '12px',
                                padding: '10px 14px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                              }}
                            >
                              <div>
                                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#191919' }}>{srv.title}</div>
                                <div style={{ fontSize: '0.75rem', color: '#888' }}>{srv.duration_minutes} mins · Physical draping & analysis</div>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#191919' }}>₹{Number(srv.price).toLocaleString('en-IN')}</div>
                                <button
                                  onClick={() => {
                                    setSelectedStudioForBooking(st);
                                    setSelectedStudioService(srv);
                                    setIsBookingStudioOpen(true);
                                  }}
                                  style={{
                                    marginTop: '4px',
                                    background: '#191919',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    borderRadius: '999px',
                                    padding: '4px 12px',
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    cursor: 'pointer'
                                  }}
                                >
                                  Book Slot
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------- 2.8. FASHION RENTALS & EVENT PASSES ----------------- */}
        {activeSubTab === 'rentals' && (
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Ticket size={18} color="#191919" />
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#8A8176', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Active Reservations & Passes
                </span>
              </div>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '2.2rem', fontWeight: 700, color: '#191919' }}>
                My Rentals & Event Passes
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {customerPasses.map((pass) => (
                <div
                  key={pass.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '20px',
                    padding: '20px',
                    border: '1px solid #EAE8E3',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#2E7D32', textTransform: 'uppercase' }}>● {pass.status}</span>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#191919', marginTop: '4px' }}>{pass.event_title}</h3>
                    <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '4px' }}>📅 {pass.date}</p>
                    <p style={{ fontSize: '0.78rem', color: '#888', marginTop: '2px' }}>📍 {pass.venue}</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #F7F5F0' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#191919' }}>{pass.tier}</span>
                    <button
                      onClick={() => setQrPassModalItem(pass)}
                      style={{
                        background: '#191919',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '999px',
                        padding: '6px 14px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <QrCode size={14} />
                      <span>View Pass</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------- 3. FASHION RECOMMENDATIONS ----------------- */}
        {activeSubTab === 'recommendations' && (
          <FashionRecommendationsView
            currentUser={currentUser}
            onOpenBooking={onOpenBooking}
          />
        )}

        {/* ----------------- 4. FASHION FEED ----------------- */}
        {activeSubTab === 'feed' && (
          <FeedView
            posts={posts}
            onLike={onLikePost}
            onSave={onSavePost}
            onAddComment={onAddComment || ((postId, text) => api.posts.addComment(postId, text))}
            selectedCategory={feedCategory}
            setSelectedCategory={setFeedCategory}
            onBookStylist={(stylistId) => {
              const st = stylists.find(s => s.id === stylistId) || stylists[0];
              if (st) onOpenBooking(st);
            }}
          />
        )}

        {/* ----------------- 5. CREATIVE & BEAUTY TALENT ----------------- */}
        {activeSubTab === 'stylists' && (
          <StylistsView
            stylists={stylists}
            onOpenBooking={onOpenBooking}
            selectedCity={custStylistCity}
            setSelectedCity={setCustStylistCity}
            currentUser={currentUser}
          />
        )}

        {/* ----------------- 6. SAVED COLLECTIONS ----------------- */}
        {activeSubTab === 'collections' && (
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '2.2rem', fontWeight: 700, color: '#191919' }}>
                Saved Style Collections
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '20px' }}>
              {savedBoards.map((b) => (
                <div key={b.id} style={{ background: '#FFFFFF', borderRadius: '20px', overflow: 'hidden', border: '1px solid #EAE8E3' }}>
                  <img
                    src={b.cover}
                    alt={b.title}
                    style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.currentTarget.src = '/images/hero_editorial.jpg';
                    }}
                  />
                  <div style={{ padding: '16px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#191919' }}>{b.title}</h3>
                    <p style={{ fontSize: '0.8rem', color: '#888' }}>{b.itemsCount} saved looks</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------- 7. STYLIST CONSULTATIONS / BOOKINGS ----------------- */}
        {activeSubTab === 'bookings' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '2.2rem', fontWeight: 700, color: '#191919' }}>
                  My Stylist Consultations
                </h2>
                <p style={{ color: '#666', fontSize: '0.88rem' }}>
                  Access your interactive Styling Workspace, moodboards, recommendations, and delivered reports.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {customerBookings.map((b) => (
                <div
                  key={b.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '24px',
                    padding: '24px',
                    border: '1px solid #EAE8E3',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <img
                      src={b.stylist_avatar || '/images/stylist_editorial.jpg'}
                      alt={b.stylist_name}
                      style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.currentTarget.src = '/images/stylist_editorial.jpg';
                      }}
                    />
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#191919' }}>{b.stylist_name}</h3>
                      <div style={{ fontSize: '0.85rem', color: '#8A8176' }}>{b.service_title}</div>
                      <div style={{ fontSize: '0.78rem', color: '#666', marginTop: '2px' }}>
                        📅 {b.booking_date} at {b.booking_time} · 📍 {b.city}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '999px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      background: b.status === 'confirmed' ? '#E8F5E9' : '#FFF8E1',
                      color: b.status === 'confirmed' ? '#2E7D32' : '#F57F17'
                    }}>
                      {b.status}
                    </span>

                    {/* Styling Workspace Trigger Button (Section 1.D) */}
                    <button
                      onClick={() => {
                        setSelectedBookingForWorkspace(b.id);
                        setIsWorkspaceModalOpen(true);
                      }}
                      style={{
                        background: '#191919',
                        color: '#D4AF37',
                        border: '1.5px solid #D4AF37',
                        borderRadius: '999px',
                        padding: '8px 18px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Sparkles size={14} color="#D4AF37" />
                      <span>Open Styling Workspace</span>
                    </button>

                    <button
                      onClick={onOpenMessages}
                      style={{
                        background: '#F7F5F0',
                        color: '#191919',
                        border: '1px solid #EAE8E3',
                        borderRadius: '999px',
                        padding: '8px 16px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Message Stylist
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------- 8. ACCOUNT & SETTINGS ----------------- */}
        {activeSubTab === 'settings' && (
          <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '30px', border: '1px solid #EAE8E3', maxWidth: '750px' }}>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '2rem', fontWeight: 700, marginBottom: '8px' }}>
              Account Settings & Preferences
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Display Name</label>
                <input
                  type="text"
                  defaultValue={currentUser?.profile?.display_name || 'Priya Nair'}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Email Address</label>
                <input
                  type="email"
                  defaultValue={currentUser?.email || 'customer@drobe.style'}
                  disabled
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px', background: '#F9F8F5' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Base City</label>
                <input
                  type="text"
                  defaultValue={currentUser?.profile?.city || 'Kochi'}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                />
              </div>
              <button
                onClick={() => showToast('Account preferences updated!')}
                style={{
                  background: '#191919',
                  color: '#FFFFFF',
                  padding: '12px 24px',
                  borderRadius: '999px',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  border: 'none',
                  cursor: 'pointer',
                  alignSelf: 'flex-start',
                  marginTop: '10px'
                }}
              >
                Save Settings
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ----------------- MODALS ----------------- */}

      {/* Styling Workspace Modal (Section 1.D) */}
      {isWorkspaceModalOpen && selectedBookingForWorkspace && (
        <StylingWorkspaceModal
          bookingId={selectedBookingForWorkspace}
          isOpen={isWorkspaceModalOpen}
          onClose={() => setIsWorkspaceModalOpen(false)}
          isStylistView={false}
          onSuccess={() => {
            api.bookings.list().then((bks) => bks && setCustomerBookings(bks)).catch(() => {});
          }}
        />
      )}

      {/* Studio Appointment Booking Modal (Section 1.H) */}
      {isBookingStudioOpen && selectedStudioForBooking && selectedStudioService && typeof document !== 'undefined' && createPortal(
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '16px',
          boxSizing: 'border-box',
          overflowY: 'auto'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            maxWidth: '520px',
            width: '100%',
            padding: '24px',
            maxHeight: '90vh',
            overflowY: 'auto',
            margin: 'auto',
            boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#B85D43', textTransform: 'uppercase' }}>
                  {selectedStudioForBooking.city} Experience Centre
                </span>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.4rem', fontWeight: 700, margin: '2px 0 0' }}>
                  Book Studio Appointment
                </h3>
              </div>
              <button
                onClick={() => setIsBookingStudioOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ background: '#F7F5F0', borderRadius: '16px', padding: '16px', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#191919' }}>{selectedStudioService.title}</div>
              <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '2px' }}>{selectedStudioForBooking.name}</div>
              <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '2px' }}>📍 {selectedStudioForBooking.address}</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#191919', marginTop: '8px' }}>
                ₹{Number(selectedStudioService.price).toLocaleString('en-IN')} · {selectedStudioService.duration_minutes} mins
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Select Appointment Date</label>
                <input
                  type="date"
                  value={studioApptDate}
                  onChange={(e) => setStudioApptDate(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #DDD', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Select Time Slot</label>
                <select
                  value={studioApptTime}
                  onChange={(e) => setStudioApptTime(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #DDD', marginTop: '4px' }}
                >
                  <option value="10:30">10:30 AM</option>
                  <option value="11:30">11:30 AM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="15:30">03:30 PM</option>
                  <option value="17:00">05:00 PM</option>
                  <option value="18:30">06:30 PM</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Notes / Occasion Context</label>
                <textarea
                  value={studioApptNotes}
                  onChange={(e) => setStudioApptNotes(e.target.value)}
                  placeholder="Tell the studio team about your upcoming event, color queries, or bespoke fitting preferences..."
                  rows={3}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #DDD', marginTop: '4px', resize: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setIsBookingStudioOpen(false)}
                style={{
                  background: 'transparent',
                  color: '#666',
                  border: '1px solid #DDD',
                  borderRadius: '999px',
                  padding: '10px 20px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleBookStudio}
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
                Confirm Studio Appointment
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Add Wardrobe Piece Modal */}
      {isAddPieceOpen && typeof document !== 'undefined' && createPortal(
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '16px',
          boxSizing: 'border-box',
          overflowY: 'auto'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            maxWidth: '480px',
            width: '100%',
            padding: '24px',
            maxHeight: '90vh',
            overflowY: 'auto',
            margin: 'auto',
            boxSizing: 'border-box'
          }}>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.6rem', marginBottom: '16px' }}>
              Add Garment to Digital Wardrobe
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Garment Name</label>
                <input
                  type="text"
                  value={newPieceName}
                  onChange={(e) => setNewPieceName(e.target.value)}
                  placeholder="e.g. Double-Breasted Linen Blazer"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Category</label>
                  <select
                    value={newPieceCat}
                    onChange={(e) => setNewPieceCat(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                  >
                    <option value="Outerwear">Outerwear</option>
                    <option value="Tops">Tops</option>
                    <option value="Bottoms">Bottoms</option>
                    <option value="Eveningwear">Eveningwear</option>
                    <option value="Shoes">Shoes</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Material</label>
                  <input
                    type="text"
                    value={newPieceMaterial}
                    onChange={(e) => setNewPieceMaterial(e.target.value)}
                    placeholder="e.g. 100% Belgian Linen"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Color</label>
                  <input
                    type="text"
                    value={newPieceColor}
                    onChange={(e) => setNewPieceColor(e.target.value)}
                    placeholder="e.g. Oatmeal"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Season</label>
                  <input
                    type="text"
                    value={newPieceSeason}
                    onChange={(e) => setNewPieceSeason(e.target.value)}
                    placeholder="e.g. Spring / Summer"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Photo Image URL</label>
                <input
                  type="text"
                  value={newPieceImage}
                  onChange={(e) => setNewPieceImage(e.target.value)}
                  placeholder="/images/linen_safari_suit.jpg"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setIsAddPieceOpen(false)}
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
                onClick={handleCreateWardrobePiece}
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
        </div>,
        document.body
      )}

      {/* Add Wardrobe Gap Modal */}
      {isAddGapOpen && typeof document !== 'undefined' && createPortal(
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '16px',
          boxSizing: 'border-box',
          overflowY: 'auto'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            maxWidth: '460px',
            width: '100%',
            padding: '24px',
            maxHeight: '90vh',
            overflowY: 'auto',
            margin: 'auto',
            boxSizing: 'border-box'
          }}>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.5rem', marginBottom: '16px' }}>
              Record Wardrobe Gap
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Missing Item Title</label>
                <input
                  type="text"
                  value={newGapTitle}
                  onChange={(e) => setNewGapTitle(e.target.value)}
                  placeholder="e.g. Double-Faced Camel Hair Overcoat"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Category</label>
                  <select
                    value={newGapCat}
                    onChange={(e) => setNewGapCat(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                  >
                    <option value="Outerwear">Outerwear</option>
                    <option value="Tops">Tops</option>
                    <option value="Bottoms">Bottoms</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Shoes">Shoes</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Priority</label>
                  <select
                    value={newGapPriority}
                    onChange={(e) => setNewGapPriority(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Styling Rationale</label>
                <textarea
                  value={newGapNotes}
                  onChange={(e) => setNewGapNotes(e.target.value)}
                  placeholder="Why is this piece needed? What existing pieces will it pair with?"
                  rows={3}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px', resize: 'none' }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setIsAddGapOpen(false)}
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
                onClick={handleCreateWardrobeGap}
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
                Record Gap
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Initialize Occasion Project Modal */}
      {isAddOccasionOpen && typeof document !== 'undefined' && createPortal(
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '16px',
          boxSizing: 'border-box',
          overflowY: 'auto'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            maxWidth: '500px',
            width: '100%',
            padding: '24px',
            maxHeight: '90vh',
            overflowY: 'auto',
            margin: 'auto',
            boxSizing: 'border-box'
          }}>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.6rem', marginBottom: '16px' }}>
              Initialize Occasion Project Workspace
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Project Title</label>
                <input
                  type="text"
                  value={newOccasionTitle}
                  onChange={(e) => setNewOccasionTitle(e.target.value)}
                  placeholder="e.g. Royal Udaipur Palace Wedding & Reception"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Occasion Type</label>
                  <select
                    value={newOccasionType}
                    onChange={(e) => setNewOccasionType(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Engagement">Engagement</option>
                    <option value="Gala / Red Carpet">Gala / Red Carpet</option>
                    <option value="Editorial Photoshoot">Editorial Photoshoot</option>
                    <option value="Executive Summit">Executive Summit</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Destination City</label>
                  <input
                    type="text"
                    value={newOccasionCity}
                    onChange={(e) => setNewOccasionCity(e.target.value)}
                    placeholder="e.g. Udaipur"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Event Date</label>
                  <input
                    type="date"
                    value={newOccasionDate}
                    onChange={(e) => setNewOccasionDate(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Total Budget (INR)</label>
                  <input
                    type="number"
                    value={newOccasionBudget}
                    onChange={(e) => setNewOccasionBudget(Number(e.target.value) || 0)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                  />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setIsAddOccasionOpen(false)}
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
                onClick={handleCreateOccasionProject}
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
                Create Workspace
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* QR Pass Inspection Modal */}
      {qrPassModalItem && typeof document !== 'undefined' && createPortal(
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '16px',
          boxSizing: 'border-box',
          overflowY: 'auto'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            maxWidth: '420px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            animation: 'fadeIn 0.2s ease-out',
            margin: 'auto',
            maxHeight: '90vh',
            boxSizing: 'border-box'
          }}>
            <div style={{ background: '#191919', color: '#FFFFFF', padding: '24px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#D4AF37' }}>
                DROBE Verified Concierge Access
              </span>
              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.4rem', fontWeight: 700, marginTop: '6px' }}>
                {qrPassModalItem.event_title}
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#8A8176', marginTop: '2px' }}>
                Tier: {qrPassModalItem.tier}
              </p>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: '#555', lineHeight: 1.5 }}>
                <div>📅 <strong>{qrPassModalItem.date}</strong></div>
                <div>📍 <strong>{qrPassModalItem.venue}</strong></div>
              </div>

              <div style={{
                background: '#FDFBF7',
                border: '2px dashed #EAE8E3',
                borderRadius: '18px',
                padding: '20px',
                textAlign: 'center',
                marginBottom: '18px'
              }}>
                <div style={{
                  width: '150px',
                  height: '150px',
                  margin: '0 auto 12px',
                  background: '#FFFFFF',
                  borderRadius: '14px',
                  padding: '12px',
                  border: '1px solid #191919',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                }}>
                  <QrCode size={120} color="#191919" />
                </div>
                <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.95rem', color: '#191919', letterSpacing: '0.08em' }}>
                  {qrPassModalItem.ticket_code}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#8A8176', marginTop: '4px' }}>
                  Scan at venue entrance check-in kiosk for entry
                </div>
              </div>

              <button
                onClick={() => setQrPassModalItem(null)}
                style={{
                  width: '100%',
                  background: '#191919',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '12px',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ======================================================== */}
      {/* FLOATING WHATSAPP INTERACTIVE CONCIERGE BUTTON & DRAWER */}
      {/* ======================================================== */}
      <button
        onClick={() => setIsWhatsAppDrawerOpen(true)}
        className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-30 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm px-4 py-3 rounded-full shadow-xl flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95 border-2 border-white"
        title="Chat with DROBE Stylist on WhatsApp"
      >
        <MessageCircle size={18} />
        <span className="hidden sm:inline">Ask Stylist (WhatsApp)</span>
        <span className="sm:hidden">Stylist</span>
      </button>

      {/* WhatsApp Interactive Concierge Modal */}
      {isWhatsAppDrawerOpen && typeof document !== 'undefined' && createPortal(
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 99999,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          boxSizing: 'border-box',
          overflowY: 'auto'
        }}>
          <div className="bg-[#FFFFFF] rounded-3xl w-full max-w-[440px] shadow-2xl border border-[#EAE8E3] overflow-hidden flex flex-col h-[600px] max-h-[90vh] animate-in fade-in slide-in-from-bottom-4 duration-200" style={{ margin: 'auto' }}>
            {/* Header */}
            <div className="bg-[#075E54] text-white p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                    alt="Stylist"
                    className="w-10 h-10 rounded-full object-cover border border-white/20"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#25D366] rounded-full border-2 border-[#075E54]" />
                </div>
                <div>
                  <div className="font-bold text-sm leading-tight">Maya · DROBE Concierge</div>
                  <div className="text-[11px] text-white/80">WhatsApp Direct · Instant Advice</div>
                </div>
              </div>
              <button
                onClick={() => setIsWhatsAppDrawerOpen(false)}
                className="text-white/80 hover:text-white p-1 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#EFEAE2]">
              {waChatHistory.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.sender === 'client' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs sm:text-sm leading-relaxed shadow-xs ${
                      msg.sender === 'client'
                        ? 'bg-[#E1FFC7] text-[#191919] rounded-br-none'
                        : 'bg-white text-[#191919] rounded-bl-none'
                    }`}
                  >
                    <p>{msg.text}</p>

                    {/* Stylist Recommendations Cards */}
                    {msg.recommendations && msg.recommendations.length > 0 && (
                      <div className="mt-2.5 space-y-2">
                        {msg.recommendations.map((rec: any, ri: number) => (
                          <div key={ri} className="bg-[#F7F5F0] rounded-xl p-2 border border-[#EAE8E3]">
                            <div className="font-bold text-xs text-[#191919]">{rec.title}</div>
                            <div className="text-[11px] text-[#666] flex items-center justify-between mt-0.5">
                              <span>{rec.boutique}</span>
                              <span className="font-bold text-[#191919]">₹{Number(rec.price_inr).toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Quick Action Pills */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-black/5 flex flex-wrap gap-1.5">
                        {msg.actions.map((act: string, ai: number) => (
                          <button
                            key={ai}
                            onClick={() => {
                              if (act.includes('Trial')) {
                                setIsWhatsAppDrawerOpen(false);
                                setIsConciergeTrialOpen(true);
                              } else {
                                showToast(`Action selected: ${act}`);
                              }
                            }}
                            className="bg-[#128C7E] hover:bg-[#075E54] text-white text-[10px] font-bold py-1 px-2.5 rounded-full cursor-pointer transition-colors"
                          >
                            {act}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="text-[9px] text-[#8A8176] text-right mt-1">{msg.time}</div>
                  </div>
                </div>
              ))}

              {waChatLoading && (
                <div className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 text-xs text-[#8A8176] w-fit shadow-xs">
                  <Sparkles size={13} className="text-[#D4AF37] animate-spin" />
                  <span>Stylist is curating suggestions...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-[#F0F2F5] border-t border-[#EAE8E3] flex items-center gap-2 shrink-0">
              <input
                type="text"
                placeholder="Ask about looks, fabrics, rental sizing..."
                value={waInputMessage}
                onChange={(e) => setWaInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendWaMessage();
                }}
                className="flex-1 bg-white border border-[#EAE8E3] rounded-full px-4 py-2 text-xs sm:text-sm focus:outline-none focus:border-[#075E54]"
              />
              <button
                onClick={handleSendWaMessage}
                disabled={!waInputMessage.trim() || waChatLoading}
                className="bg-[#075E54] hover:bg-[#128C7E] disabled:opacity-50 text-white w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-colors shrink-0"
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* --- MODAL 1: SCHEDULE RESET AUDIT --- */}
      {isScheduleResetOpen && typeof document !== 'undefined' && createPortal(
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 99999,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            boxSizing: 'border-box',
            overflowY: 'auto'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsScheduleResetOpen(false);
          }}
        >
          <div 
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '24px 20px',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35)',
              border: '1px solid #EAE8E3',
              margin: 'auto',
              position: 'relative',
              boxSizing: 'border-box'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', paddingBottom: '12px', borderBottom: '1px solid #EAE8E3' }}>
              <div>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>
                  DROBE Club Member Perk
                </span>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.25rem', fontWeight: 700, color: '#191919', marginTop: '2px' }}>
                  Schedule Seasonal Wardrobe Reset
                </h3>
              </div>
              <button 
                onClick={() => setIsScheduleResetOpen(false)} 
                style={{ background: '#F7F5F0', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#191919' }}
              >
                <X size={18} />
              </button>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#666', lineHeight: 1.45, marginBottom: '14px' }}>
              Your assigned lead stylist will review your digital wardrobe, retire outdated items, and source 5 new capsule pieces for your upcoming season.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '18px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#191919', display: 'block', marginBottom: '4px' }}>Target Consultation Date</label>
                <input
                  type="date"
                  value={resetDate}
                  onChange={(e) => setResetDate(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #EAE8E3', borderRadius: '12px', padding: '10px 12px', fontSize: '0.8rem', fontWeight: 600 }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#191919', display: 'block', marginBottom: '4px' }}>Seasonal Focus</label>
                <select
                  value={resetSeason}
                  onChange={(e) => setResetSeason(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #EAE8E3', borderRadius: '12px', padding: '10px 12px', fontSize: '0.8rem', fontWeight: 600 }}
                >
                  <option value="Winter / Festive 2026">Winter / Festive 2026 (Weddings & Galas)</option>
                  <option value="Spring / Summer 2027">Spring / Summer 2027 (Linen & Resort Capsule)</option>
                  <option value="Monsoon Business 2027">Monsoon Business 2027 (Water-Resistant Tailoring)</option>
                  <option value="Autumn Executive 2027">Autumn Executive 2027 (Cashmere & Fine Wool)</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#191919', display: 'block', marginBottom: '4px' }}>Styling Notes & Specific Goals</label>
                <textarea
                  rows={3}
                  value={resetNotes}
                  onChange={(e) => setResetNotes(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #EAE8E3', borderRadius: '12px', padding: '10px 12px', fontSize: '0.8rem' }}
                  placeholder="e.g. Audit wedding guest trousseau and add tailored linen pieces."
                />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setIsScheduleResetOpen(false)}
                style={{ flex: 1, background: '#F7F5F0', color: '#191919', fontWeight: 700, fontSize: '0.8rem', padding: '10px 16px', borderRadius: '999px', border: '1px solid #EAE8E3', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleScheduleReset}
                style={{ flex: 1, background: '#191919', color: '#FFFFFF', fontWeight: 700, fontSize: '0.8rem', padding: '10px 16px', borderRadius: '999px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,0.18)' }}
              >
                Confirm Reset Appointment
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* --- MODAL 2: UPGRADE SUBSCRIPTION TIER --- */}
      {isUpgradeSubOpen && typeof document !== 'undefined' && createPortal(
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 99999,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            boxSizing: 'border-box',
            overflowY: 'auto'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsUpgradeSubOpen(false);
          }}
        >
          <div 
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '24px 20px',
              maxWidth: '560px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35)',
              border: '1px solid #EAE8E3',
              margin: 'auto',
              position: 'relative',
              boxSizing: 'border-box'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #EAE8E3' }}>
              <div>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>
                  DROBE Club Memberships
                </span>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.25rem', fontWeight: 700, color: '#191919', marginTop: '2px' }}>
                  Choose Your Personal Styling Tier
                </h3>
              </div>
              <button 
                onClick={() => setIsUpgradeSubOpen(false)} 
                style={{ background: '#F7F5F0', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#191919' }}
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '20px' }}>
              <div style={{ border: '2px solid #EAE8E3', borderRadius: '18px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8A8176', textTransform: 'uppercase', display: 'block' }}>Quarterly Reset</span>
                  <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#191919', marginTop: '4px' }}>
                    ₹3,999 <span style={{ fontSize: '0.74rem', fontWeight: 400, color: '#8A8176' }}>/ quarter</span>
                  </div>
                  <ul style={{ fontSize: '0.76rem', color: '#555', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px', listStyle: 'none', padding: 0 }}>
                    <li>✓ 4 Seasonal Audits per year</li>
                    <li>✓ Digital wardrobe curator</li>
                    <li>✓ Unlimited WhatsApp concierge</li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => handleUpgradeSub('quarterly_reset')}
                  style={{ marginTop: '16px', width: '100%', background: '#F7F5F0', color: '#191919', fontWeight: 700, fontSize: '0.78rem', padding: '8px 12px', borderRadius: '999px', border: '1px solid #EAE8E3', cursor: 'pointer' }}
                >
                  Select Quarterly
                </button>
              </div>

              <div style={{ border: '2px solid #D4AF37', background: '#FDFBF7', borderRadius: '18px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
                <span style={{ position: 'absolute', top: '-10px', right: '14px', background: '#D4AF37', color: '#191919', fontSize: '0.62rem', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', textTransform: 'uppercase' }}>
                  Most Popular
                </span>
                <div>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#D4AF37', textTransform: 'uppercase', display: 'block' }}>Annual Elite Sovereign</span>
                  <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#191919', marginTop: '4px' }}>
                    ₹12,999 <span style={{ fontSize: '0.74rem', fontWeight: 400, color: '#8A8176' }}>/ year</span>
                  </div>
                  <ul style={{ fontSize: '0.76rem', color: '#555', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px', listStyle: 'none', padding: 0 }}>
                    <li>✓ 6 Seasonal Wardrobe Audits</li>
                    <li>✓ Dedicated Senior Stylist escort</li>
                    <li>✓ 2 Free At-Home White-Glove Trials</li>
                    <li>✓ 20% off Circular Consignments</li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => handleUpgradeSub('annual_elite')}
                  style={{ marginTop: '16px', width: '100%', background: '#191919', color: '#FFFFFF', fontWeight: 700, fontSize: '0.78rem', padding: '8px 12px', borderRadius: '999px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                >
                  Upgrade to Annual Elite
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* --- MODAL 3: SOVEREIGN ESCROW CHECKOUT --- */}
      {isEscrowCheckoutOpen && selectedOccasionForEscrow && typeof document !== 'undefined' && createPortal(
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 99999,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            boxSizing: 'border-box',
            overflowY: 'auto'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsEscrowCheckoutOpen(false);
          }}
        >
          <div 
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '24px 20px',
              maxWidth: '520px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35)',
              border: '1px solid #EAE8E3',
              margin: 'auto',
              position: 'relative',
              boxSizing: 'border-box'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #EAE8E3' }}>
              <div>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>
                  Sovereign Escrow Bundle
                </span>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.25rem', fontWeight: 700, color: '#191919', marginTop: '2px' }}>
                  {selectedOccasionForEscrow.title}
                </h3>
              </div>
              <button 
                onClick={() => setIsEscrowCheckoutOpen(false)} 
                style={{ background: '#F7F5F0', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#191919' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ background: '#F7F5F0', borderRadius: '16px', padding: '14px', border: '1px solid #EAE8E3', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#555' }}>
                <span>5 Booked Services Total</span>
                <span style={{ fontWeight: 700, color: '#191919' }}>₹1,20,000</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2E7D32', fontWeight: 600 }}>
                <span>Multi-Professional Occasion Bundle (-10%)</span>
                <span>-₹8,500</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid #EAE8E3' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={includeDamageProtection}
                    onChange={(e) => setIncludeDamageProtection(e.target.checked)}
                    style={{ accentColor: '#191919' }}
                  />
                  <span>Garment Damage Protection Insurance</span>
                </label>
                <span style={{ fontWeight: 700, color: '#191919' }}>+₹1,499</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 700, color: '#191919', paddingTop: '8px', borderTop: '1px solid #EAE8E3' }}>
                <span>Net Total</span>
                <span>₹{includeDamageProtection ? '1,12,999' : '1,11,500'}</span>
              </div>
            </div>

            <div style={{ background: '#E8F5E9', borderRadius: '14px', padding: '12px', border: '1px solid #C8E6C9', marginBottom: '18px', fontSize: '0.76rem', color: '#1B5E20' }}>
              <div style={{ fontWeight: 700, marginBottom: '2px' }}>● Escrow Milestone Release Structure</div>
              <div>40% Advance on Booking (₹45,199) released now. The remaining 60% stays locked safely until fittings and event delivery are signed off.</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setIsEscrowCheckoutOpen(false)}
                style={{ flex: 1, background: '#F7F5F0', color: '#191919', fontWeight: 700, fontSize: '0.8rem', padding: '10px 16px', borderRadius: '999px', border: '1px solid #EAE8E3', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleFundEscrow(selectedOccasionForEscrow.id)}
                style={{ flex: 1, background: '#191919', color: '#FFFFFF', fontWeight: 700, fontSize: '0.8rem', padding: '10px 16px', borderRadius: '999px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,0.18)' }}
              >
                Fund Escrow (₹45,199)
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* --- MODAL 4: INVITE GROUP OCCASION MEMBER --- */}
      {isAddMemberOpen && typeof document !== 'undefined' && createPortal(
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 99999,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            boxSizing: 'border-box',
            overflowY: 'auto'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddMemberOpen(false);
          }}
        >
          <div 
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '24px 20px',
              maxWidth: '460px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35)',
              border: '1px solid #EAE8E3',
              margin: 'auto',
              position: 'relative',
              boxSizing: 'border-box'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #EAE8E3' }}>
              <div>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#B85D43', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>
                  Bridal Party / Group Room
                </span>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.25rem', fontWeight: 700, color: '#191919', marginTop: '2px' }}>
                  Invite Attendant & Split Tab
                </h3>
              </div>
              <button 
                onClick={() => setIsAddMemberOpen(false)} 
                style={{ background: '#F7F5F0', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#191919' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '18px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#191919', display: 'block', marginBottom: '4px' }}>Attendant Name</label>
                <input
                  type="text"
                  placeholder="e.g. Diya Sharma"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #EAE8E3', borderRadius: '12px', padding: '10px 12px', fontSize: '0.8rem', fontWeight: 600 }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#191919', display: 'block', marginBottom: '4px' }}>Role</label>
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #EAE8E3', borderRadius: '12px', padding: '10px 12px', fontSize: '0.8rem', fontWeight: 600 }}
                >
                  <option value="Bridesmaid">Bridesmaid</option>
                  <option value="Maid of Honor">Maid of Honor</option>
                  <option value="Groomsman">Groomsman</option>
                  <option value="Best Man">Best Man</option>
                  <option value="Family VIP">Family VIP</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#191919', display: 'block', marginBottom: '4px' }}>Assigned Ensemble</label>
                <input
                  type="text"
                  placeholder="e.g. Handloom Raw Silk Saree in Antique Gold"
                  value={newMemberGarment}
                  onChange={(e) => setNewMemberGarment(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #EAE8E3', borderRadius: '12px', padding: '10px 12px', fontSize: '0.8rem' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#191919', display: 'block', marginBottom: '4px' }}>Size</label>
                  <input
                    type="text"
                    value={newMemberSizing}
                    onChange={(e) => setNewMemberSizing(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #EAE8E3', borderRadius: '12px', padding: '10px 12px', fontSize: '0.8rem', fontWeight: 600 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#191919', display: 'block', marginBottom: '4px' }}>Split Share (₹)</label>
                  <input
                    type="number"
                    value={newMemberSplit}
                    onChange={(e) => setNewMemberSplit(Number(e.target.value))}
                    style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #EAE8E3', borderRadius: '12px', padding: '10px 12px', fontSize: '0.8rem', fontWeight: 600 }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setIsAddMemberOpen(false)}
                style={{ flex: 1, background: '#F7F5F0', color: '#191919', fontWeight: 700, fontSize: '0.8rem', padding: '10px 16px', borderRadius: '999px', border: '1px solid #EAE8E3', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddGroupMember}
                style={{ flex: 1, background: '#191919', color: '#FFFFFF', fontWeight: 700, fontSize: '0.8rem', padding: '10px 16px', borderRadius: '999px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,0.18)' }}
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* --- MODAL 5: AT-HOME WHITE GLOVE TRIAL CONCIERGE --- */}
      {isConciergeTrialOpen && typeof document !== 'undefined' && createPortal(
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 99999,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            boxSizing: 'border-box',
            overflowY: 'auto'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsConciergeTrialOpen(false);
          }}
        >
          <div 
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '24px 20px',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35)',
              border: '1px solid #EAE8E3',
              margin: 'auto',
              position: 'relative',
              boxSizing: 'border-box'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', paddingBottom: '12px', borderBottom: '1px solid #EAE8E3' }}>
              <div>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>
                  White-Glove Service
                </span>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.25rem', fontWeight: 700, color: '#191919', marginTop: '2px' }}>
                  Book At-Home Fitting Concierge
                </h3>
              </div>
              <button 
                onClick={() => setIsConciergeTrialOpen(false)} 
                style={{ background: '#F7F5F0', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#191919' }}
              >
                <X size={18} />
              </button>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#666', lineHeight: 1.45, marginBottom: '14px' }}>
              Select 3 luxury ensembles from your occasion wishlist. A dedicated assistant stylist will deliver them in garment trunks with a garment steamer and pins for private at-home fitting.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '18px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#191919', display: 'block', marginBottom: '4px' }}>Trial Date</label>
                  <input
                    type="date"
                    value={trialDate}
                    onChange={(e) => setTrialDate(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #EAE8E3', borderRadius: '12px', padding: '10px 12px', fontSize: '0.8rem', fontWeight: 600 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#191919', display: 'block', marginBottom: '4px' }}>Preferred Time</label>
                  <input
                    type="time"
                    value={trialTime}
                    onChange={(e) => setTrialTime(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #EAE8E3', borderRadius: '12px', padding: '10px 12px', fontSize: '0.8rem', fontWeight: 600 }}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#191919', display: 'block', marginBottom: '4px' }}>Delivery Address / Hotel</label>
                <input
                  type="text"
                  value={trialAddress}
                  onChange={(e) => setTrialAddress(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #EAE8E3', borderRadius: '12px', padding: '10px 12px', fontSize: '0.8rem' }}
                />
              </div>
              <div style={{ background: '#F7F5F0', borderRadius: '16px', padding: '12px', border: '1px solid #EAE8E3', fontSize: '0.78rem', color: '#555' }}>
                <div style={{ fontWeight: 700, color: '#191919', marginBottom: '6px' }}>Selected 3 Garments for Trial:</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {trialOutfits.map((outfit, oi) => (
                    <div key={oi} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#D4AF37', fontSize: '0.8rem' }}>●</span>
                      <span style={{ fontSize: '0.76rem' }}>{outfit}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #EAE8E3', fontSize: '0.72rem', color: '#2E7D32', fontWeight: 600 }}>
                  Concierge Fee: ₹1,500 (100% credited against your final purchase)
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setIsConciergeTrialOpen(false)}
                style={{ flex: 1, background: '#F7F5F0', color: '#191919', fontWeight: 700, fontSize: '0.8rem', padding: '10px 16px', borderRadius: '999px', border: '1px solid #EAE8E3', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBookConciergeTrial}
                style={{ flex: 1, background: '#191919', color: '#FFFFFF', fontWeight: 700, fontSize: '0.8rem', padding: '10px 16px', borderRadius: '999px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,0.18)' }}
              >
                Confirm Trial Booking
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* --- MODAL 6: CONSIGN WARDROBE PIECE FOR CIRCULAR RENTAL --- */}
      {isConsignOpen && selectedConsignItem && typeof document !== 'undefined' && createPortal(
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 99999,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            boxSizing: 'border-box',
            overflowY: 'auto'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsConsignOpen(false);
          }}
        >
          <div 
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '24px 20px',
              maxWidth: '460px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35)',
              border: '1px solid #EAE8E3',
              margin: 'auto',
              position: 'relative',
              boxSizing: 'border-box'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #EAE8E3' }}>
              <div>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#2E7D32', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>
                  Circular Consignment
                </span>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.25rem', fontWeight: 700, color: '#191919', marginTop: '2px' }}>
                  Consign Piece for Rental
                </h3>
              </div>
              <button 
                onClick={() => setIsConsignOpen(false)} 
                style={{ background: '#F7F5F0', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#191919' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#191919' }}>{selectedConsignItem.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#8A8176', marginTop: '2px' }}>{selectedConsignItem.material} · {selectedConsignItem.color}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '18px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#191919', display: 'block', marginBottom: '4px' }}>Daily Rental Price (₹)</label>
                <input
                  type="number"
                  value={consignDailyPrice}
                  onChange={(e) => setConsignDailyPrice(Number(e.target.value))}
                  style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #EAE8E3', borderRadius: '12px', padding: '10px 12px', fontSize: '0.8rem', fontWeight: 600 }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#191919', display: 'block', marginBottom: '4px' }}>Security Deposit (₹)</label>
                <input
                  type="number"
                  value={consignSecurityDeposit}
                  onChange={(e) => setConsignSecurityDeposit(Number(e.target.value))}
                  style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #EAE8E3', borderRadius: '12px', padding: '10px 12px', fontSize: '0.8rem', fontWeight: 600 }}
                />
              </div>
              <div style={{ background: '#E8F5E9', borderRadius: '14px', padding: '12px', border: '1px solid #C8E6C9', fontSize: '0.76rem', color: '#1B5E20' }}>
                <div style={{ fontWeight: 700 }}>60% Owner Take-Home Payout</div>
                <div style={{ fontSize: '0.72rem', marginTop: '2px' }}>
                  You earn <strong>₹{Math.round(consignDailyPrice * 0.6).toLocaleString('en-IN')}/day</strong> each time this piece is reserved. DROBE manages logistics, sanitization, and damage insurance.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setIsConsignOpen(false)}
                style={{ flex: 1, background: '#F7F5F0', color: '#191919', fontWeight: 700, fontSize: '0.8rem', padding: '10px 16px', borderRadius: '999px', border: '1px solid #EAE8E3', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConsignItem}
                style={{ flex: 1, background: '#191919', color: '#FFFFFF', fontWeight: 700, fontSize: '0.8rem', padding: '10px 16px', borderRadius: '999px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,0.18)' }}
              >
                List on Rental Vault
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Floating Action Toast Notification */}
      {actionToast && typeof document !== 'undefined' && createPortal(
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#191919',
          color: '#FFFFFF',
          padding: '12px 22px',
          borderRadius: '999px',
          fontSize: '0.85rem',
          fontWeight: 600,
          boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
          zIndex: 999999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          border: '1px solid rgba(255,255,255,0.15)'
        }}>
          <CheckCircle size={16} color="#81C784" />
          <span>{actionToast}</span>
        </div>,
        document.body
      )}

    </div>
  );
};