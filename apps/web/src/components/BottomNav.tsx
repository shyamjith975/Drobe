import React from 'react';
import { Home, Compass, PlusCircle, Users, User, Sparkles, ShoppingBag, ShieldCheck, Briefcase, Calendar } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openCreateModal: () => void;
  currentRole?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  setCurrentTab,
  openCreateModal,
  currentRole = 'guest'
}) => {
  const getTabsForRole = () => {
    switch (currentRole) {
      case 'enthusiast':
      case 'customer':
        return [
          { id: 'customer', label: 'My Hub', icon: Home },
          { id: 'feed', label: 'Feed', icon: Compass },
          { id: 'create', label: 'Publish', icon: PlusCircle, isAction: true },
          { id: 'rentals', label: 'Rentals', icon: ShoppingBag },
          { id: 'events', label: 'Events', icon: Calendar }
        ];
      case 'stylist':
      case 'consultant':
        return [
          { id: 'consultant', label: 'Stylist Desk', icon: Briefcase },
          { id: 'feed', label: 'Feed', icon: Compass },
          { id: 'create', label: 'Publish', icon: PlusCircle, isAction: true },
          { id: 'rentals', label: 'Rentals', icon: ShoppingBag },
          { id: 'events', label: 'Events', icon: Calendar }
        ];
      case 'brand':
      case 'boutique':
        return [
          { id: 'boutique', label: 'Boutique Desk', icon: ShoppingBag },
          { id: 'feed', label: 'Feed', icon: Compass },
          { id: 'create', label: 'Publish', icon: PlusCircle, isAction: true },
          { id: 'rentals', label: 'Rentals', icon: ShoppingBag },
          { id: 'profile', label: 'Profile', icon: User }
        ];
      case 'admin':
      case 'super_admin':
        return [
          { id: 'admin', label: 'Admin Desk', icon: ShieldCheck },
          { id: 'rentals', label: 'Rentals', icon: ShoppingBag },
          { id: 'events', label: 'Events', icon: Calendar },
          { id: 'profile', label: 'Profile', icon: User }
        ];
      default:
        // Guest / Not Logged In
        return [
          { id: 'landing', label: 'Explore', icon: Compass },
          { id: 'recommendations', label: 'Styles', icon: Sparkles },
          { id: 'rentals', label: 'Rentals', icon: ShoppingBag },
          { id: 'events', label: 'Events', icon: Calendar },
          { id: 'login', label: 'Sign In', icon: User }
        ];
    }
  };

  const tabs = getTabsForRole();

  return (
    <nav className="mobile-glass-dock fixed bottom-0 left-0 right-0 z-40 sm:hidden flex items-center justify-around py-1.5 px-2 safe-bottom" aria-label="Mobile Navigation">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;

        if (tab.isAction) {
          return (
            <button
              key={tab.id}
              onClick={openCreateModal}
              className="flex flex-col items-center justify-center -mt-6 shrink-0 px-1"
              title="Publish New Look"
            >
              <div className="w-12 h-12 rounded-full bg-[#141414] text-white flex items-center justify-center shadow-xl border-2 border-white hover:scale-105 active:scale-95 transition-all">
                <PlusCircle className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-[#141414] mt-0.5">Publish</span>
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1 flex-1 min-w-0 px-0.5 transition-colors ${
              isActive ? 'text-[#141414] font-bold' : 'text-[#7d6f64] hover:text-[#141414]'
            }`}
          >
            <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
            <span className="text-[10px] tracking-tight mt-0.5 truncate w-full text-center px-0.5">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
