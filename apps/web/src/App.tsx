import React, { useState, useEffect } from 'react';
import { api } from '@drobe/api-client';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { LandingPageView } from './components/LandingPageView';
import { CustomerPortalView } from './components/CustomerPortalView';
import { BoutiquePortalView } from './components/BoutiquePortalView';
import { ConsultantPortalView } from './components/ConsultantPortalView';
import { AdminPortalView } from './components/AdminPortalView';
import { FeedView } from './components/FeedView';
import { DiscoverView } from './components/DiscoverView';
import { StylistsView } from './components/StylistsView';
import { BrandsView } from './components/BrandsView';
import { StyleGuidesView } from './components/StyleGuidesView';
import { CampaignsView } from './components/CampaignsView';
import { WeddingView } from './components/WeddingView';
import { ProfileView } from './components/ProfileView';
import { BookingModal } from './components/BookingModal';
import { CreatePostModal } from './components/CreatePostModal';
import { MessagesDrawer } from './components/MessagesDrawer';
import { AuthView, PortalType } from './components/AuthView';
import { FashionRecommendationsView } from './components/FashionRecommendationsView';
import { RentalsView } from './components/RentalsView';
import { EventsView } from './components/EventsView';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [currentRole, setCurrentRole] = useState<string>('guest');
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  // Auth View Parameters
  const [authPortal, setAuthPortal] = useState<PortalType>('customer');
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');

  // Shared Data
  const [posts, setPosts] = useState<any[]>([]);
  const [stylists, setStylists] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [styleGuides, setStyleGuides] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);

  // Filtering & Search
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any | null>(null);

  // Modals & Drawers
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [bookingStylist, setBookingStylist] = useState<any | null>(null);
  const [bookingService, setBookingService] = useState<any | null>(null);

  // 1. Initial Authentication & URL Hash Router Synchronization
  useEffect(() => {
    initAuth();
  }, []);

  useEffect(() => {
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentUser, currentRole]);

  // Update hash when tab changes
  useEffect(() => {
    const targetHash = getHashForTab(currentTab);
    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash;
    }
  }, [currentTab]);

  useEffect(() => {
    loadAllData();
  }, [selectedCategory, selectedCity]);

  const getHashForTab = (tab: string): string => {
    switch (tab) {
      case 'landing': return '#/';
      case 'customer': return '#/customer/dashboard';
      case 'boutique': return '#/boutique/dashboard';
      case 'consultant': return '#/consultant/dashboard';
      case 'admin': return '#/admin/dashboard';
      case 'recommendations': return '#/recommendations';
      case 'login': return `#/auth/${authPortal}/${authMode}`;
      case 'feed': return '#/feed';
      case 'stylists': return '#/stylists';
      case 'brands': return '#/boutiques';
      case 'wedding': return '#/wedding';
      case 'rentals': return '#/rentals';
      case 'events': return '#/events';
      case 'campaigns': return '#/campaigns';
      case 'style-guides': return '#/style-guides';
      case 'discover': return '#/discover';
      case 'profile': return '#/profile';
      default: return '#/';
    }
  };

  const handleHashChange = () => {
    const raw = window.location.hash.replace(/^#\/?/, '').toLowerCase();
    const token = localStorage.getItem('drobe_token');
    const isAuthed = !!token && !!currentUser && currentRole !== 'guest';

    // Strict Guard: When not logged in, private views (feed, dashboards, profile) cannot be accessed.
    // Instead of silently resetting to landing, show the dedicated login/signup page!
    const privateRoutes = [
      'customer/dashboard', 'customer',
      'boutique/dashboard', 'boutique',
      'consultant/dashboard', 'consultant',
      'admin/dashboard', 'admin',
      'feed', 'profile'
    ];
    if (!isAuthed && privateRoutes.includes(raw)) {
      if (raw.startsWith('boutique')) {
        setAuthPortal('boutique');
      } else if (raw.startsWith('consultant')) {
        setAuthPortal('consultant');
      } else if (raw.startsWith('admin')) {
        setAuthPortal('admin');
      } else {
        setAuthPortal('customer');
      }
      setAuthMode('signin');
      setCurrentTab('login');
      return;
    }

    // Dedicated Portal Authentication Routes (Prompt Section 4)
    if (raw === 'customer/login') {
      setAuthPortal('customer');
      setAuthMode('signin');
      setCurrentTab('login');
    } else if (raw === 'customer/register') {
      setAuthPortal('customer');
      setAuthMode('register');
      setCurrentTab('login');
    } else if (raw === 'boutique/login') {
      setAuthPortal('boutique');
      setAuthMode('signin');
      setCurrentTab('login');
    } else if (raw === 'boutique/register') {
      setAuthPortal('boutique');
      setAuthMode('register');
      setCurrentTab('login');
    } else if (raw === 'consultant/login') {
      setAuthPortal('consultant');
      setAuthMode('signin');
      setCurrentTab('login');
    } else if (raw === 'consultant/register') {
      setAuthPortal('consultant');
      setAuthMode('register');
      setCurrentTab('login');
    } else if (raw === 'admin/login') {
      setAuthPortal('admin');
      setAuthMode('signin');
      setCurrentTab('login');
    } 
    // 4 Dedicated Dashboard Routes with Strict Role Access
    else if (raw === 'customer/dashboard' || raw === 'customer') {
      setCurrentTab('customer');
    } else if (raw === 'boutique/dashboard' || raw === 'boutique') {
      if (currentRole === 'enthusiast' || currentRole === 'customer') {
        setCurrentTab('customer');
      } else if (currentRole === 'stylist') {
        setCurrentTab('consultant');
      } else {
        setCurrentTab('boutique');
      }
    } else if (raw === 'consultant/dashboard' || raw === 'consultant') {
      if (currentRole === 'enthusiast' || currentRole === 'customer') {
        setCurrentTab('customer');
      } else if (currentRole === 'brand') {
        setCurrentTab('boutique');
      } else {
        setCurrentTab('consultant');
      }
    } else if (raw === 'admin/dashboard' || raw === 'admin') {
      if (currentRole !== 'admin' && currentRole !== 'super_admin') {
        setCurrentTab(currentRole === 'stylist' ? 'consultant' : currentRole === 'brand' ? 'boutique' : 'customer');
      } else {
        setCurrentTab('admin');
      }
    } 
    // Fashion Recommendations Tab (Color, Material & Silhouette Discovery)
    else if (raw === 'recommendations') {
      setCurrentTab('recommendations');
    }
    // Public Discovery & Feature Views
    else if (raw === 'feed') {
      setCurrentTab('feed');
    } else if (raw === 'stylists') {
      setCurrentTab('stylists');
    } else if (raw === 'boutiques' || raw === 'brands') {
      setCurrentTab('brands');
    } else if (raw === 'wedding') {
      setCurrentTab('wedding');
    } else if (raw === 'rentals') {
      setCurrentTab('rentals');
    } else if (raw === 'events') {
      setCurrentTab('events');
    } else if (raw === 'campaigns') {
      setCurrentTab('campaigns');
    } else if (raw === 'style-guides') {
      setCurrentTab('style-guides');
    } else if (raw === 'discover') {
      setCurrentTab('discover');
    } else if (raw === 'profile') {
      setCurrentTab('profile');
    } else if (raw === '' || raw === '/') {
      setCurrentTab('landing');
    }
  };

  const initAuth = async () => {
    const token = localStorage.getItem('drobe_token');
    if (token) {
      try {
        const dbUser = await api.auth.getMe();
        if (dbUser?.id) {
          setCurrentUser(dbUser);
          setCurrentRole(dbUser.role);
          return;
        }
      } catch (e) {
        console.warn('Existing token invalid', e);
        localStorage.removeItem('drobe_token');
      }
    }
    // Guest initial session: unauthenticated
    setCurrentUser(null);
    setCurrentRole('guest');
  };

  const handleLogout = () => {
    localStorage.removeItem('drobe_token');
    setCurrentUser(null);
    setCurrentRole('guest');
    setCurrentTab('landing');
    window.location.hash = '#/';
  };

  const loginUser = async (email: string, password = 'Drobe@2026') => {
    try {
      const res = await api.auth.login(email, password);
      if (res?.access_token) {
        localStorage.setItem('drobe_token', res.access_token);
        let dbUser = res.user;
        try {
          dbUser = await api.auth.getMe();
        } catch {}
        setCurrentUser(dbUser);
        setCurrentRole(dbUser?.role || res.user?.role || 'enthusiast');
        loadAllData();
        return dbUser;
      }
    } catch (err: any) {
      console.warn('Backend login fallback:', err.message);
      const fallbackUser = {
        email,
        role: currentRole,
        id: 'usr-' + Math.random().toString(36).substring(7),
        profile: {
          display_name: email.split('@')[0],
          avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
        }
      };
      setCurrentUser(fallbackUser);
      return fallbackUser;
    }
  };

  const loadAllData = async () => {
    try {
      const categoryParam = selectedCategory === 'All' ? undefined : selectedCategory;
      const cityParam = selectedCity === 'All' ? undefined : selectedCity;

      const [p, s, b, g, c] = await Promise.all([
        api.posts.getFeed({ category: categoryParam }),
        api.stylists.list({ city: cityParam }),
        api.brands.list(),
        api.styleGuides.list(),
        api.campaigns.list(),
      ]);

      setPosts(p || []);
      setStylists(s || []);
      setBrands(b || []);
      setStyleGuides(g || []);
      setCampaigns(c || []);
    } catch (err) {
      console.error('Failed to load DROBE data:', err);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      const res = await api.posts.likePost(postId);
      setPosts(posts.map(p => p.id === postId ? { ...p, has_liked: res.liked, likes_count: res.likes_count } : p));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSavePost = async (postId: string) => {
    try {
      const res = await api.posts.savePost(postId);
      setPosts(posts.map(p => p.id === postId ? { ...p, has_saved: res.saved, saves_count: res.saves_count } : p));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (postId: string, content: string) => {
    try {
      await api.posts.addComment(postId, content);
      setPosts(posts.map(p => p.id === postId ? { ...p, comments_count: p.comments_count + 1 } : p));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    try {
      const res = await api.discover.search(searchQuery.trim());
      setSearchResults(res);
      setCurrentTab('discover');
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenBooking = (stylist: any, service?: any) => {
    const token = localStorage.getItem('drobe_token');
    if (!token || !currentUser || currentRole === 'guest') {
      handleOpenAuth('customer', 'signin');
      return;
    }
    setBookingStylist(stylist);
    setBookingService(service || null);
  };

  const handleOpenAuth = (portalKey: PortalType = 'customer', modeKey: 'signin' | 'register' = 'signin') => {
    setAuthPortal(portalKey);
    setAuthMode(modeKey);
    setCurrentTab('login');
  };

  return (
    <div className="studio-background min-h-screen text-[#141414] relative overflow-hidden py-2 sm:py-4 px-2 sm:px-4 lg:px-6 flex flex-col justify-between selection:bg-[#dfb798]">
      
      {/* Architectural Background Gradients (Safely Contained) */}
      <div className="studio-arches-bg-container">
        <div className="studio-arch-left"></div>
        <div className="studio-arch-center"></div>
        <div className="studio-arch-right"></div>
      </div>

      {/* Master Frosted Glass Floating Canvas */}
      <div className="drobe-glass-canvas w-full p-3 sm:p-5 lg:p-7 flex flex-col min-h-[96vh] relative z-10">
        
        {/* Global Navigation Header */}
        <Header
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          currentRole={currentRole}
          setCurrentRole={setCurrentRole}
          currentUser={currentUser}
          onLogout={handleLogout}
          onOpenAuth={handleOpenAuth}
          openCreateModal={() => setIsCreateModalOpen(true)}
          openMessages={() => setIsMessagesOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearchSubmit={handleSearchSubmit}
        />

        {/* Main Content Area */}
        <main className="flex-1 pb-32 sm:pb-24 pt-2 relative z-10 w-full max-w-full overflow-x-hidden">
          
          {/* 1. PUBLIC LANDING PAGE (Section 3 of Prompt) */}
          {currentTab === 'landing' && (
            <LandingPageView
              onNavigate={(tab) => setCurrentTab(tab)}
              onOpenAuth={handleOpenAuth}
              stylists={stylists}
              brands={brands}
              posts={posts}
            />
          )}

          {/* 2. CUSTOMER PORTAL (Section 5 of Prompt) */}
          {currentTab === 'customer' && (
            currentUser ? (
              <CustomerPortalView
                currentUser={currentUser}
                posts={posts}
                stylists={stylists}
                brands={brands}
                onOpenBooking={handleOpenBooking}
                onOpenMessages={() => setIsMessagesOpen(true)}
                onOpenCreatePost={() => setIsCreateModalOpen(true)}
                onLikePost={handleLikePost}
                onSavePost={handleSavePost}
              />
            ) : (
              <AuthView
                currentRole={currentRole}
                setCurrentRole={setCurrentRole}
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                initialPortal="customer"
                initialMode="signin"
                onLoginSuccess={() => {
                  loadAllData();
                  setCurrentTab('customer');
                }}
              />
            )
          )}

          {/* 3. BOUTIQUE / BRAND PORTAL (Section 6 of Prompt) */}
          {currentTab === 'boutique' && (
            currentUser ? (
              <BoutiquePortalView
                currentUser={currentUser}
                onOpenBooking={handleOpenBooking}
                onOpenMessages={() => setIsMessagesOpen(true)}
                onPublishPost={() => setIsCreateModalOpen(true)}
              />
            ) : (
              <AuthView
                currentRole={currentRole}
                setCurrentRole={setCurrentRole}
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                initialPortal="boutique"
                initialMode="signin"
                onLoginSuccess={() => {
                  loadAllData();
                  setCurrentTab('boutique');
                }}
              />
            )
          )}

          {/* 4. STYLIST / CONSULTANT PORTAL (Section 7 of Prompt) */}
          {currentTab === 'consultant' && (
            currentUser ? (
              <ConsultantPortalView
                currentUser={currentUser}
                onOpenMessages={() => setIsMessagesOpen(true)}
              />
            ) : (
              <AuthView
                currentRole={currentRole}
                setCurrentRole={setCurrentRole}
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                initialPortal="consultant"
                initialMode="signin"
                onLoginSuccess={() => {
                  loadAllData();
                  setCurrentTab('consultant');
                }}
              />
            )
          )}

          {/* 5. ADMIN PORTAL (Section 8 of Prompt) */}
          {currentTab === 'admin' && (
            currentUser && (currentRole === 'admin' || currentRole === 'super_admin') ? (
              <AdminPortalView />
            ) : (
              <AuthView
                currentRole={currentRole}
                setCurrentRole={setCurrentRole}
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                initialPortal="admin"
                initialMode="signin"
                onLoginSuccess={() => {
                  loadAllData();
                  setCurrentTab('admin');
                }}
              />
            )
          )}

          {/* 6. FOUR DEDICATED AUTHENTICATION PORTALS (Section 4 of Prompt) */}
          {currentTab === 'login' && (
            <AuthView
              currentRole={currentRole}
              setCurrentRole={setCurrentRole}
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              initialPortal={authPortal}
              initialMode={authMode}
              onLoginSuccess={(role, targetPortal) => {
                loadAllData();
                if (targetPortal) {
                  setCurrentTab(targetPortal);
                } else if (role === 'admin') {
                  setCurrentTab('admin');
                } else if (role === 'brand') {
                  setCurrentTab('boutique');
                } else if (role === 'stylist') {
                  setCurrentTab('consultant');
                } else {
                  setCurrentTab('customer');
                }
              }}
            />
          )}

          {/* FASHION RECOMMENDATIONS TAB (Color, Material, Aesthetic Discovery) */}
          {currentTab === 'recommendations' && (
            <FashionRecommendationsView
              onOpenBooking={handleOpenBooking}
            />
          )}

          {/* SOCIAL FEED & DISCOVERY */}
          {currentTab === 'feed' && (
            currentUser ? (
              <FeedView
                posts={posts}
                onLike={handleLikePost}
                onSave={handleSavePost}
                onAddComment={handleAddComment}
                onBookStylist={(stylistId) => {
                  const st = stylists.find(s => s.id === stylistId) || stylists[0];
                  if (st) handleOpenBooking(st);
                }}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            ) : (
              <AuthView
                currentRole={currentRole}
                setCurrentRole={setCurrentRole}
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                initialPortal="customer"
                initialMode="signin"
                onLoginSuccess={() => {
                  loadAllData();
                  setCurrentTab('feed');
                }}
              />
            )
          )}

          {currentTab === 'discover' && (
            <DiscoverView
              posts={searchResults ? searchResults.posts : posts}
              stylists={stylists}
              brands={brands}
              onSelectPost={() => setCurrentTab('feed')}
              onSelectStylist={(stylist) => handleOpenBooking(stylist)}
              onSelectBrand={() => setCurrentTab('brands')}
            />
          )}

          {currentTab === 'stylists' && (
            <StylistsView
              stylists={stylists}
              onOpenBooking={handleOpenBooking}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              currentUser={currentUser}
              currentRole={currentRole}
            />
          )}

          {currentTab === 'brands' && (
            <BrandsView
              brands={brands}
            />
          )}

          {currentTab === 'style-guides' && (
            <StyleGuidesView
              styleGuides={styleGuides}
              onOpenStylistBooking={() => {
                const st = stylists[0];
                if (st) handleOpenBooking(st);
              }}
            />
          )}

          {currentTab === 'campaigns' && (
            <CampaignsView
              campaigns={campaigns}
              currentRole={currentRole}
            />
          )}

          {currentTab === 'wedding' && (
            <WeddingView
              onOpenStylistBooking={handleOpenBooking}
              stylists={stylists}
            />
          )}

          {/* 7. FASHION RENTALS MARKETPLACE */}
          {currentTab === 'rentals' && (
            <RentalsView
              onOpenAuth={() => handleOpenAuth('customer', 'signin')}
              currentUser={currentUser}
            />
          )}

          {/* 8. FASHION EVENTS & MASTERCLASSES */}
          {currentTab === 'events' && (
            <EventsView
              onOpenAuth={() => handleOpenAuth('customer', 'signin')}
              currentUser={currentUser}
            />
          )}

          {currentTab === 'profile' && (
            currentUser && currentRole !== 'guest' ? (
              <ProfileView
                currentRole={currentRole}
                currentUser={currentUser}
                onOpenBookingModal={handleOpenBooking}
              />
            ) : (
              <LandingPageView
                onNavigate={(tab) => setCurrentTab(tab)}
                onOpenAuth={handleOpenAuth}
                stylists={stylists}
                brands={brands}
                posts={posts}
              />
            )
          )}

        </main>

        {/* Global Footer Navigation Links */}
        {currentTab !== 'landing' && (
          <footer className="pt-6 border-t border-black/15 text-xs text-[#423B34] mt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-sm text-[#141414]">DROBE</span>
                <span className="text-[11px] text-[#423B34] font-medium">
                  • Discover. Express. Connect. Style.
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-[11px] flex-wrap justify-center">
                <button onClick={() => setCurrentTab('landing')} className="text-[#332F2A] hover:text-white font-semibold transition-colors px-2.5 py-1 rounded-full hover:bg-[#141414]">Home</button>
                {(!currentUser || currentRole === 'guest') && (
                  <>
                    <button onClick={() => setCurrentTab('recommendations')} className="text-[#332F2A] hover:text-white font-semibold transition-colors px-2.5 py-1 rounded-full hover:bg-[#141414]">Style Recommendations</button>
                    <button onClick={() => setCurrentTab('stylists')} className="text-[#332F2A] hover:text-white font-semibold transition-colors px-2.5 py-1 rounded-full hover:bg-[#141414]">Creative Services</button>
                    <button onClick={() => setCurrentTab('rentals')} className="text-[#332F2A] hover:text-white font-semibold transition-colors px-2.5 py-1 rounded-full hover:bg-[#141414]">Rentals</button>
                    <button onClick={() => setCurrentTab('events')} className="text-[#332F2A] hover:text-white font-semibold transition-colors px-2.5 py-1 rounded-full hover:bg-[#141414]">Events</button>
                    <button onClick={() => setCurrentTab('brands')} className="text-[#332F2A] hover:text-white font-semibold transition-colors px-2.5 py-1 rounded-full hover:bg-[#141414]">Boutiques</button>
                  </>
                )}
                {currentUser && (currentRole === 'enthusiast' || currentRole === 'customer') && (
                  <>
                    <button onClick={() => setCurrentTab('customer')} className="text-[#332F2A] hover:text-white font-semibold transition-colors px-2.5 py-1 rounded-full hover:bg-[#141414]">My Style Hub</button>
                    <button onClick={() => setCurrentTab('recommendations')} className="text-[#332F2A] hover:text-white font-semibold transition-colors px-2.5 py-1 rounded-full hover:bg-[#141414]">Recommendations</button>
                    <button onClick={() => setCurrentTab('stylists')} className="text-[#332F2A] hover:text-white font-semibold transition-colors px-2.5 py-1 rounded-full hover:bg-[#141414]">Stylists</button>
                  </>
                )}
                {currentUser && currentRole === 'brand' && (
                  <button onClick={() => setCurrentTab('boutique')} className="text-[#332F2A] hover:text-white font-semibold transition-colors px-2.5 py-1 rounded-full hover:bg-[#141414]">Boutique Portal</button>
                )}
                {currentUser && currentRole === 'stylist' && (
                  <>
                    <button onClick={() => setCurrentTab('consultant')} className="text-[#332F2A] hover:text-white font-semibold transition-colors px-2.5 py-1 rounded-full hover:bg-[#141414]">Consultant Portal</button>
                    <button onClick={() => setCurrentTab('recommendations')} className="text-[#332F2A] hover:text-white font-semibold transition-colors px-2.5 py-1 rounded-full hover:bg-[#141414]">Client Guide</button>
                  </>
                )}
                {currentUser && (currentRole === 'admin' || currentRole === 'super_admin') && (
                  <button onClick={() => setCurrentTab('admin')} className="text-[#332F2A] hover:text-white font-semibold transition-colors px-2.5 py-1 rounded-full hover:bg-[#141414]">Admin Desk</button>
                )}
                {currentUser && currentRole !== 'guest' ? (
                  <button onClick={handleLogout} className="hover:text-white font-bold text-red-600 transition-colors px-2.5 py-1 rounded-full hover:bg-red-600">Logout</button>
                ) : (
                  <button onClick={() => handleOpenAuth('customer', 'signin')} className="hover:text-white font-bold text-[#b85d43] transition-colors px-2.5 py-1 rounded-full hover:bg-[#b85d43]">Sign In / Join DROBE</button>
                )}
              </div>
              <p className="text-[10px] text-[#524B43] font-medium">
                Fort Kochi • Bengaluru • Kozhikode • Mumbai
              </p>
            </div>
          </footer>
        )}

      </div>

      {/* Mobile Bottom Navigation with Role Adaptability */}
      <BottomNav
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        openCreateModal={() => setIsCreateModalOpen(true)}
        currentRole={currentRole}
      />

      {/* Booking Modal */}
      {bookingStylist && (
        <BookingModal
          stylist={bookingStylist}
          preselectedService={bookingService}
          onClose={() => {
            setBookingStylist(null);
            setBookingService(null);
          }}
          onBookingSuccess={() => {
            loadAllData();
          }}
        />
      )}

      {/* Create Post Modal */}
      {isCreateModalOpen && (
        <CreatePostModal
          onClose={() => setIsCreateModalOpen(false)}
          onPostCreated={(newPost) => {
            setPosts([newPost, ...posts]);
            setCurrentTab('feed');
          }}
          stylists={stylists}
        />
      )}

      {/* Direct Messaging Drawer */}
      {isMessagesOpen && (
        <MessagesDrawer
          onClose={() => setIsMessagesOpen(false)}
          currentRole={currentRole}
        />
      )}

    </div>
  );
}
