import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  MessageSquare, 
  PlusCircle, 
  Menu, 
  X, 
  User, 
  LogOut,
  Layers,
  Compass,
  Scissors,
  Bookmark,
  ShoppingBag
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
        { id: 'landing', label: 'Home' },
        { id: 'recommendations', label: 'Style Recommendations' },
        { id: 'stylists', label: 'Creative Services' },
        { id: 'rentals', label: 'Fashion Rentals' },
        { id: 'events', label: 'Events & Masterclasses' },
        { id: 'brands', label: 'Boutique Directory' },
      ];
    }

    // 2. LOGGED IN CUSTOMER: Customer views & discovery
    if (currentRole === 'enthusiast' || currentRole === 'customer') {
      return [
        { id: 'customer', label: 'My Style Hub' },
        { id: 'feed', label: 'Fashion Feed' },
        { id: 'recommendations', label: 'Color & Fabric Guide' },
        { id: 'stylists', label: 'Creative Services' },
        { id: 'rentals', label: 'Fashion Rentals' },
        { id: 'events', label: 'Events & Masterclasses' },
        { id: 'brands', label: 'Boutiques' },
        { id: 'landing', label: 'Explore DROBE' },
      ];
    }

    // 3. LOGGED IN STYLIST / CONSULTANT: Stylist portal & tools
    if (currentRole === 'stylist' || currentRole === 'consultant') {
      return [
        { id: 'consultant', label: 'Stylist Portal' },
        { id: 'recommendations', label: 'Client Styling Guide' },
        { id: 'rentals', label: 'Rental Inventory' },
        { id: 'events', label: 'Masterclasses & Workshops' },
        { id: 'feed', label: 'Fashion Feed' },
        { id: 'landing', label: 'Explore DROBE' },
      ];
    }

    // 4. LOGGED IN BOUTIQUE: Boutique portal & tools
    if (currentRole === 'brand' || currentRole === 'boutique') {
      return [
        { id: 'boutique', label: 'Boutique Portal' },
        { id: 'rentals', label: 'Rental Management' },
        { id: 'feed', label: 'Fashion Feed' },
        { id: 'landing', label: 'Explore DROBE' },
      ];
    }

    // 5. LOGGED IN ADMIN: Admin enterprise portal
    if (currentRole === 'admin' || currentRole === 'super_admin') {
      return [
        { id: 'admin', label: 'Admin Enterprise Portal' },
        { id: 'rentals', label: 'Rental Moderation' },
        { id: 'events', label: 'Event Management' },
        { id: 'feed', label: 'Fashion Feed' },
        { id: 'landing', label: 'Explore DROBE' },
      ];
    }

    return [{ id: 'landing', label: 'Home' }];
  };

  const navTabs = getNavTabs();

  const closeAllDropdowns = () => {
    setMobileMenuOpen(false);
    setNotifDropdownOpen(false);
  };

  return (
    <header className="w-full pb-4 mb-6 sm:mb-8 relative z-30">
      
      {/* Click-outside backdrop */}
      {(notifDropdownOpen || mobileMenuOpen) && (
        <div 
          className="fixed inset-0 z-40 bg-black/5 backdrop-blur-[1px]"
          onClick={closeAllDropdowns}
        />
      )}

      <div className="flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCurrentTab('landing')} 
            className="icon-btn-glass group"
            title="DROBE Home"
          >
            {/* Editorial Emblem */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="#141414" fillOpacity="0.08"/>
              <path d="M7 9C7 7.5 9 5 12 5C15 5 17 7.5 17 9C17 12 12 13 12 15M12 18V19" stroke="#141414" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="12" r="3" fill="#B85D43"/>
            </svg>
          </button>

          <button 
            onClick={() => setCurrentTab('landing')} 
            className="text-left focus:outline-none"
          >
            <span className="font-serif text-2xl sm:text-3xl tracking-tight text-[#141414] font-bold block leading-none">
              DROBE
            </span>
            <span className="text-[9px] tracking-widest uppercase text-[#7d6f64] font-semibold hidden sm:block mt-0.5">
              Fashion Network & Marketplace
            </span>
          </button>
        </div>

        {/* Center: Frosted Glass Nav Tabs */}
        <nav className="hidden xl:flex items-center gap-1.5 bg-white/40 backdrop-blur-md p-1.5 rounded-full border border-white/70 shadow-sm overflow-x-auto no-scrollbar whitespace-nowrap shrink-0">
          {navTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`pill-glass text-xs py-1.5 px-3.5 transition-all ${
                currentTab === tab.id ? 'active' : ''
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Right Section: Auth vs Logged-In Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* Frosted Capsule Search Bar */}
          <form 
            onSubmit={onSearchSubmit}
            className="hidden md:flex items-center relative"
          >
            <div className="search-capsule">
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
                className="btn-capsule-black hidden sm:inline-flex text-xs py-2 px-3.5"
                title="Publish Look"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Publish</span>
              </button>

              {/* Direct Messages Drawer Button */}
              <button
                onClick={openMessages}
                className="icon-btn-glass w-9 h-9"
                title="Direct Messages"
              >
                <MessageSquare className="w-4 h-4 text-[#141414]" />
              </button>

              {/* Notifications Popover */}
              <div className="relative">
                <button
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  className="icon-btn-glass w-9 h-9 relative"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4 text-[#141414]" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#b85d43] rounded-full ring-2 ring-white"></span>
                  )}
                </button>

                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 glass-card p-4 z-50 animate-in fade-in slide-in-from-top-2 border border-white">
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

              {/* User Identity Avatar & Display Name */}
              <div className="flex items-center gap-2 bg-white/50 border border-white/70 py-1 px-2.5 rounded-full shadow-sm">
                <img
                  src={currentUser?.profile?.avatar_url || '/images/stylist_editorial.jpg'}
                  alt="Profile"
                  className="w-7 h-7 rounded-full object-cover border border-white"
                  onError={(e) => {
                    e.currentTarget.src = '/images/stylist_editorial.jpg';
                  }}
                />
                <span className="text-xs font-bold text-[#141414] hidden md:inline truncate max-w-[100px]">
                  {currentUser?.profile?.display_name?.split(' ')[0] || 'User'}
                </span>
                <span className="text-[9px] px-1.5 py-0.5 bg-black/5 text-[#7d6f64] rounded-full uppercase font-bold hidden lg:inline">
                  {currentRole === 'enthusiast' ? 'Customer' : currentRole}
                </span>
              </div>



              {/* PROMINENT LOGOUT BUTTON */}
              <button
                onClick={onLogout}
                className="pill-glass text-xs py-1.5 px-3 flex items-center gap-1.5 hover:bg-red-50 hover:text-red-600 transition-colors border border-red-200/60 shadow-sm"
                title="Log Out of DROBE"
              >
                <LogOut className="w-3.5 h-3.5 text-red-500" />
                <span className="font-bold text-red-600 hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            /* ======================================================== */
            /* CASE B: USER IS NOT LOGGED IN                            */
            /* ======================================================== */
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (onOpenAuth) onOpenAuth('customer', 'signin');
                  else setCurrentTab('login');
                }}
                className="pill-glass text-xs py-1.5 px-4 font-bold text-[#141414] hover:bg-white shadow-sm flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-[#b85d43]" />
                <span>Sign In</span>
              </button>

              <button
                onClick={() => {
                  if (onOpenAuth) onOpenAuth('customer', 'register');
                  else setCurrentTab('login');
                }}
                className="btn-capsule-black text-xs py-1.5 px-4 shadow-sm"
              >
                <span>Join DROBE</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden icon-btn-glass w-9 h-9"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

        </div>

      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="xl:hidden mt-3 glass-card p-4 rounded-3xl space-y-3 animate-in slide-in-from-top-3 border border-white">
          <form onSubmit={onSearchSubmit} className="mb-2">
            <div className="relative">
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-[#7d6f64]" />
              <input
                type="text"
                placeholder="Search DROBE..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/70 text-xs text-[#141414] pl-9 pr-3 py-2 rounded-full border border-white focus:outline-none"
              />
            </div>
          </form>

          <div className="grid grid-cols-2 gap-2">
            {navTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setCurrentTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-colors ${
                  currentTab === tab.id ? 'bg-[#141414] text-white' : 'bg-white/40 text-[#141414] hover:bg-white/70'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Mobile Authentication / Logout Footer */}
          <div className="pt-3 border-t border-white/60 flex items-center justify-between">
            {isLoggedIn ? (
              <div className="w-full flex items-center justify-between">
                <div className="text-xs">
                  <p className="font-bold text-[#141414]">{currentUser?.profile?.display_name || 'Active User'}</p>
                  <p className="text-[10px] text-[#7d6f64] capitalize">{currentRole}</p>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="pill-glass text-xs py-1.5 px-4 font-bold text-red-600 border border-red-200 flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-500" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="w-full grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenAuth) onOpenAuth('customer', 'signin');
                    else setCurrentTab('login');
                  }}
                  className="pill-glass text-xs py-2 text-center font-bold"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenAuth) onOpenAuth('customer', 'register');
                    else setCurrentTab('login');
                  }}
                  className="btn-capsule-black text-xs py-2 text-center"
                >
                  Join DROBE
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </header>
  );
};
