import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  MessageSquare, 
  PlusCircle, 
  User, 
  LogOut,
  Sparkles,
  Menu,
  X,
  Compass,
  Scissors,
  ShoppingBag,
  Calendar,
  Layers,
  Crown,
  ShieldCheck,
  ChevronRight,
  Home
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentRole: string;
  setCurrentRole: (role: string) => void;
  currentUser?: any | null;
  onLogout: () => void;
  onOpenAuth?: (portal?: 'customer' | 'boutique' | 'consultant' | 'admin', mode?: 'signin' | 'register') => void;
  openCreateModal: () => void;
  openMessages: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  currentRole,
  setCurrentRole,
  currentUser,
  onLogout,
  onOpenAuth,
  openCreateModal,
  openMessages,
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  unreadCount = 2
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const isLoggedIn = !!currentUser && currentRole !== 'guest';

  // Dynamic Navigation Tabs Based Strictly on Authentication & Role
  const getNavTabs = () => {
    // 1. UNLOGGED / GUEST: Full public discovery
    if (!isLoggedIn) {
      return [
        { id: 'landing', label: 'Home', icon: Home },
        { id: 'recommendations', label: 'Style Recommendations', icon: Sparkles },
        { id: 'stylists', label: 'Find Personal Stylists', icon: Scissors },
        { id: 'brands', label: 'Boutique Directory', icon: Crown },
      ];
    }

    // 2. LOGGED IN CUSTOMER: Customer views & discovery
    if (currentRole === 'enthusiast' || currentRole === 'customer') {
      return [
        { id: 'customer', label: 'My Style Hub', icon: Home },
        { id: 'feed', label: 'Fashion Feed', icon: Compass },
        { id: 'recommendations', label: 'Color & Fabric Guide', icon: Sparkles },
        { id: 'stylists', label: 'Creative Services', icon: Scissors },
        { id: 'rentals', label: 'Fashion Rentals', icon: ShoppingBag },
        { id: 'events', label: 'Events & Masterclasses', icon: Calendar },
        { id: 'brands', label: 'Boutiques', icon: Crown },
        { id: 'landing', label: 'Explore DROBE', icon: Compass },
      ];
    }

    // 3. LOGGED IN STYLIST / CONSULTANT: Stylist portal & tools
    if (currentRole === 'stylist' || currentRole === 'consultant') {
      return [
        { id: 'consultant', label: 'Stylist Portal', icon: Scissors },
        { id: 'recommendations', label: 'Client Styling Guide', icon: Sparkles },
        { id: 'rentals', label: 'Rental Inventory', icon: ShoppingBag },
        { id: 'events', label: 'Masterclasses & Workshops', icon: Calendar },
        { id: 'feed', label: 'Fashion Feed', icon: Compass },
        { id: 'landing', label: 'Explore DROBE', icon: Compass },
      ];
    }

    // 4. LOGGED IN BOUTIQUE: Boutique portal & tools
    if (currentRole === 'brand' || currentRole === 'boutique') {
      return [
        { id: 'boutique', label: 'Boutique Portal', icon: Crown },
        { id: 'rentals', label: 'Rental Management', icon: ShoppingBag },
        { id: 'feed', label: 'Fashion Feed', icon: Compass },
        { id: 'landing', label: 'Explore DROBE', icon: Compass },
      ];
    }

    // 5. LOGGED IN ADMIN: Admin enterprise portal
    if (currentRole === 'admin' || currentRole === 'super_admin') {
      return [
        { id: 'admin', label: 'Admin Enterprise Portal', icon: ShieldCheck },
        { id: 'rentals', label: 'Rental Moderation', icon: ShoppingBag },
        { id: 'events', label: 'Event Management', icon: Calendar },
        { id: 'feed', label: 'Fashion Feed', icon: Compass },
        { id: 'landing', label: 'Explore DROBE', icon: Compass },
      ];
    }

    return [{ id: 'landing', label: 'Home', icon: Home }];
  };

  const navTabs = getNavTabs();

  // All Comprehensive Navigation Destinations for the Mobile Menu
  const allPlatformSections = [
    { id: 'landing', label: 'DROBE Editorial Home', desc: 'Front-row aesthetics & visual movements', icon: Home },
    { id: 'recommendations', label: 'Style & Material Guides', desc: 'Curated color palettes & textiles', icon: Sparkles },
    { id: 'stylists', label: 'Find Personal Stylists', desc: 'Verified consultants & bridal advisors', icon: Scissors },
    { id: 'brands', label: 'Luxury Boutique Directory', desc: 'Ateliers & boutique showrooms', icon: Crown },
    { id: 'rentals', label: 'High-Fashion Rentals', desc: 'Designer couture rental vault', icon: ShoppingBag },
    { id: 'events', label: 'Masterclasses & Runways', desc: 'Boutique previews & styling events', icon: Calendar },
    { id: 'feed', label: 'Community Fashion Feed', desc: 'Creator looks & shop-the-tag outfits', icon: Compass },
    { id: 'discover', label: 'Explore & Celebrity Looks', desc: 'Recreate couture red carpet looks', icon: Layers }
  ];

  const handleSelectTab = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="w-full pb-2 mb-4 sm:mb-6 relative z-30">
      
      {/* Click-outside backdrop for notifications */}
      {notifDropdownOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/5 backdrop-blur-[1px]"
          onClick={() => setNotifDropdownOpen(false)}
        />
      )}

      {/* Main Top Header Bar */}
      <div className="flex items-center justify-between gap-2 sm:gap-4 w-full">
        
        {/* Left: Brand Logo & Title (Never wrapped, strict bounds) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 max-w-[200px] sm:max-w-xs">
          <button 
            onClick={() => setCurrentTab('landing')} 
            className="icon-btn-glass group w-8 h-8 sm:w-9 sm:h-9 shrink-0"
            title="DROBE Home"
          >
            {/* Editorial Emblem */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="#141414" fillOpacity="0.08"/>
              <path d="M7 9C7 7.5 9 5 12 5C15 5 17 7.5 17 9C17 12 12 13 12 15M12 18V19" stroke="#141414" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="12" r="3" fill="#B85D43"/>
            </svg>
          </button>

          <button 
            onClick={() => setCurrentTab('landing')} 
            className="text-left focus:outline-none shrink-0"
          >
            <span className="font-serif text-xl sm:text-2xl lg:text-3xl tracking-tight text-[#141414] font-bold block leading-none">
              DROBE
            </span>
            <span className="text-[9px] tracking-widest uppercase text-[#7d6f64] font-semibold hidden 2xl:block mt-0.5">
              Fashion Network & Marketplace
            </span>
          </button>
        </div>

        {/* Center: Frosted Glass Nav Tabs (Desktop lg:flex with strict min-width and safe margins) */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/90 backdrop-blur-md p-1.5 rounded-full border border-black/10 shadow-xs overflow-x-auto no-scrollbar whitespace-nowrap min-w-0 max-w-[46vw] 2xl:max-w-[54vw] mx-1 sm:mx-2 shrink">
          {navTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`pill-glass text-xs py-1.5 px-2.5 2xl:px-3 transition-all shrink-0 ${
                currentTab === tab.id ? 'active' : ''
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Right Section: Auth vs Logged-In Controls + Mobile Menu Icon */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* Frosted Capsule Search Bar (Desktop only) */}
          <form 
            onSubmit={onSearchSubmit}
            className="hidden xl:flex items-center relative shrink-0"
          >
            <div className="search-capsule w-40 2xl:w-56">
              <Search className="w-3.5 h-3.5 text-[#7d6f64]" />
              <input
                type="text"
                placeholder="Search DROBE..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          {/* ======================================================== */}
          {/* CASE A: USER IS LOGGED IN                                */}
          {/* ======================================================== */}
          {isLoggedIn ? (
            <>
              {/* Publish Look Button */}
              <button
                onClick={openCreateModal}
                className="btn-capsule-black hidden md:inline-flex text-xs py-1.5 px-3 shrink-0"
                title="Publish Look"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Publish</span>
              </button>

              {/* Direct Messages Button */}
              <button
                onClick={openMessages}
                className="icon-btn-glass w-8 h-8 sm:w-9 sm:h-9 shrink-0"
                title="Direct Messages"
              >
                <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#141414]" />
              </button>

              {/* Notifications Popover */}
              <div className="relative shrink-0">
                <button
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  className="icon-btn-glass w-8 h-8 sm:w-9 sm:h-9 relative"
                  title="Notifications"
                >
                  <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#141414]" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#b85d43] rounded-full ring-2 ring-white"></span>
                  )}
                </button>

                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 sm:w-80 glass-card p-4 z-50 animate-in fade-in slide-in-from-top-2 border border-white">
                    <div className="flex items-center justify-between pb-2 border-b border-white/60">
                      <h4 className="font-serif font-bold text-xs text-[#141414]">Notifications</h4>
                      <span className="text-[10px] text-[#7d6f64]">2 new updates</span>
                    </div>
                    <div className="divide-y divide-white/40 text-xs mt-2">
                      <div className="py-2">
                        <p className="font-semibold text-[#141414]">Consultation Confirmed with Maya Nambiar</p>
                        <p className="text-[11px] text-[#7d6f64] mt-0.5">Wardrobe Audit scheduled for Nov 12 at 2:00 PM.</p>
                      </div>
                      <div className="py-2">
                        <p className="font-semibold text-[#141414]">Pre-Fall 2026 Collection Live</p>
                        <p className="text-[11px] text-[#7d6f64] mt-0.5">Explore tailored wool and cashmere recommendations.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User Identity Avatar */}
              <div 
                onClick={() => setCurrentTab(currentRole === 'enthusiast' ? 'customer' : currentRole)}
                className="flex items-center gap-1.5 bg-white/60 border border-white/80 py-1 px-2 rounded-full shadow-xs cursor-pointer hover:bg-white transition shrink-0"
                title="Open Profile"
              >
                <img
                  src={currentUser?.profile?.avatar_url || '/images/stylist_editorial.jpg'}
                  alt="Profile"
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover border border-white"
                  onError={(e) => {
                    e.currentTarget.src = '/images/stylist_editorial.jpg';
                  }}
                />
                <span className="text-xs font-bold text-[#141414] hidden md:inline truncate max-w-[80px]">
                  {currentUser?.profile?.display_name?.split(' ')[0] || 'User'}
                </span>
              </div>

              {/* Prominent Logout Button (Desktop) */}
              <button
                onClick={onLogout}
                className="pill-glass text-xs py-1.5 px-2.5 sm:px-3 hidden sm:flex items-center gap-1 text-red-600 border border-red-200/80 hover:bg-red-50 transition-colors shadow-xs shrink-0"
                title="Log Out of DROBE"
              >
                <LogOut className="w-3.5 h-3.5 text-red-500" />
                <span className="font-bold text-red-600">Logout</span>
              </button>
            </>
          ) : (
            /* ======================================================== */
            /* CASE B: USER IS NOT LOGGED IN                            */
            /* ======================================================== */
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                onClick={() => {
                  if (onOpenAuth) onOpenAuth('customer', 'signin');
                  else setCurrentTab('login');
                }}
                className="bg-white text-[#141414] border-1.5 border-[#141414] text-[11px] sm:text-xs py-1.5 px-2.5 sm:px-4 rounded-full font-bold shadow-xs flex items-center gap-1 hover:bg-[#141414] hover:text-white transition-all group shrink-0"
              >
                <User className="w-3.5 h-3.5 text-[#b85d43] group-hover:text-white transition-colors" />
                <span>Sign In</span>
              </button>

              <button
                onClick={() => {
                  if (onOpenAuth) onOpenAuth('customer', 'register');
                  else setCurrentTab('login');
                }}
                className="btn-capsule-black text-[11px] sm:text-xs py-1.5 px-2.5 sm:px-4 shadow-xs shrink-0 flex items-center justify-center font-bold"
                style={{ backgroundColor: '#141414', color: '#FFFFFF' }}
                title="Join DROBE"
              >
                <span className="font-bold text-white whitespace-nowrap">Join DROBE</span>
              </button>
            </div>
          )}

          {/* ======================================================== */}
          {/* MOBILE MENU ICON (Toggles Full-Data Slide Drawer)        */}
          {/* ======================================================== */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden icon-btn-glass w-8 h-8 sm:w-9 sm:h-9 shrink-0 flex items-center justify-center relative ml-0.5"
            aria-label="Open Navigation Menu"
            title="Open DROBE Menu"
          >
            <Menu className="w-4 h-4 text-[#141414]" />
            {isLoggedIn && unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#b85d43] rounded-full ring-2 ring-white"></span>
            )}
          </button>

        </div>

      </div>

      {/* ======================================================== */}
      {/* MOBILE FULL-DATA SLIDE DRAWER (All Sections & Details)  */}
      {/* ======================================================== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          
          {/* Semi-transparent dark blur backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Slide-in Panel */}
          <div className="relative w-full max-w-sm sm:max-w-md bg-[#FAF8F5] text-[#141414] h-full shadow-2xl flex flex-col justify-between overflow-y-auto z-10 border-l border-[#EAE8E3] animate-in slide-in-from-right duration-300">
            
            {/* Drawer Top Header */}
            <div className="p-4 sm:p-5 border-b border-[#EAE8E3] flex items-center justify-between sticky top-0 bg-[#FAF8F5]/95 backdrop-blur-md z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#141414] text-white flex items-center justify-center">
                  <span className="font-serif font-bold text-sm">D</span>
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#141414] leading-none">DROBE</h3>
                  <span className="text-[10px] tracking-wider text-[#8A8176] uppercase font-semibold">
                    Luxury Fashion Ecosystem
                  </span>
                </div>
              </div>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[#141414] transition-colors"
                aria-label="Close Menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-4 sm:p-5 space-y-6 flex-1">
              
              {/* Quick Search */}
              <div>
                <form 
                  onSubmit={(e) => {
                    onSearchSubmit(e);
                    setMobileMenuOpen(false);
                  }}
                  className="relative"
                >
                  <Search className="w-4 h-4 text-[#7d6f64] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search styles, boutiques, consultants..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white text-xs text-[#141414] pl-10 pr-4 py-2.5 rounded-2xl border border-[#EAE8E3] focus:outline-none focus:border-[#141414] shadow-xs"
                  />
                </form>
              </div>

              {/* User Identity Banner (If Logged In) */}
              {isLoggedIn ? (
                <div className="bg-white rounded-2xl p-3.5 border border-[#EAE8E3] shadow-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={currentUser?.profile?.avatar_url || '/images/stylist_editorial.jpg'}
                      alt="User avatar"
                      className="w-10 h-10 rounded-full object-cover border border-[#EAE8E3]"
                      onError={(e) => {
                        e.currentTarget.src = '/images/stylist_editorial.jpg';
                      }}
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-[#141414] truncate">
                        {currentUser?.profile?.display_name || 'Active Member'}
                      </p>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#141414]/5 text-[#8A8176] font-semibold uppercase tracking-wider">
                        {currentRole === 'enthusiast' ? 'Customer' : currentRole}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="p-2 rounded-xl text-red-600 hover:bg-red-50 transition"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onOpenAuth) onOpenAuth('customer', 'signin');
                      else setCurrentTab('login');
                    }}
                    className="bg-white text-[#141414] border-2 border-[#141414] text-xs py-2 px-3 text-center font-bold rounded-full hover:bg-[#141414] hover:text-white transition-all shadow-xs"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onOpenAuth) onOpenAuth('customer', 'register');
                      else setCurrentTab('login');
                    }}
                    className="btn-capsule-black text-xs py-2 px-3 text-center font-bold w-full flex items-center justify-center shadow-xs"
                    style={{ backgroundColor: '#141414', color: '#FFFFFF' }}
                  >
                    <span className="font-bold text-white">Join DROBE</span>
                  </button>
                </div>
              )}

              {/* PLATFORM SECTIONS (All Data Navigation) */}
              <div className="space-y-2">
                <div className="text-[10px] font-bold text-[#8A8176] uppercase tracking-wider px-1">
                  Platform Destinations
                </div>
                
                <div className="space-y-1">
                  {allPlatformSections.map((sec) => {
                    const Icon = sec.icon;
                    const isActive = currentTab === sec.id;
                    return (
                      <button
                        key={sec.id}
                        onClick={() => handleSelectTab(sec.id)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-2xl transition-all text-left ${
                          isActive 
                            ? 'bg-[#141414] text-white shadow-sm' 
                            : 'hover:bg-white text-[#141414]'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isActive ? 'bg-white/15 text-white' : 'bg-black/5 text-[#141414]'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-xs truncate leading-tight">{sec.label}</p>
                            <p className={`text-[10px] truncate leading-tight ${
                              isActive ? 'text-white/70' : 'text-[#7d6f64]'
                            }`}>
                              {sec.desc}
                            </p>
                          </div>
                        </div>

                        <ChevronRight className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-white/60' : 'text-[#8A8176]'
                        }`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* DEDICATED PROFESSIONAL PORTALS */}
              <div className="space-y-2 pt-2 border-t border-[#EAE8E3]">
                <div className="text-[10px] font-bold text-[#8A8176] uppercase tracking-wider px-1">
                  Professional Workspaces & Desks
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onOpenAuth) onOpenAuth('customer', 'signin');
                      else setCurrentTab('customer');
                    }}
                    className="p-3 bg-white rounded-xl border border-[#EAE8E3] hover:border-[#141414] text-left transition shadow-xs"
                  >
                    <div className="font-bold text-[#141414] text-[11px]">Customer Hub</div>
                    <div className="text-[10px] text-[#7d6f64]">Style DNA & Closet</div>
                  </button>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onOpenAuth) onOpenAuth('boutique', 'signin');
                      else setCurrentTab('boutique');
                    }}
                    className="p-3 bg-white rounded-xl border border-[#EAE8E3] hover:border-[#141414] text-left transition shadow-xs"
                  >
                    <div className="font-bold text-[#141414] text-[11px]">Boutique Desk</div>
                    <div className="text-[10px] text-[#7d6f64]">Rack & Lookbooks</div>
                  </button>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onOpenAuth) onOpenAuth('consultant', 'signin');
                      else setCurrentTab('consultant');
                    }}
                    className="p-3 bg-white rounded-xl border border-[#EAE8E3] hover:border-[#141414] text-left transition shadow-xs"
                  >
                    <div className="font-bold text-[#141414] text-[11px]">Stylist Desk</div>
                    <div className="text-[10px] text-[#7d6f64]">Client Workspaces</div>
                  </button>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onOpenAuth) onOpenAuth('admin', 'signin');
                      else setCurrentTab('admin');
                    }}
                    className="p-3 bg-white rounded-xl border border-[#EAE8E3] hover:border-[#141414] text-left transition shadow-xs"
                  >
                    <div className="font-bold text-[#141414] text-[11px]">Admin Desk</div>
                    <div className="text-[10px] text-[#7d6f64]">Verifications & RBAC</div>
                  </button>
                </div>
              </div>

            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-[#EAE8E3] bg-white/70 text-center text-[10px] text-[#8A8176]">
              <p className="font-medium">DROBE Luxury Fashion Ecosystem</p>
              <p className="text-[9px] mt-0.5">Kochi • Bengaluru • Kozhikode • Mumbai</p>
            </div>

          </div>

        </div>
      )}

    </header>
  );
};
