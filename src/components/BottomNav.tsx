import { ActiveTab } from '../types';

interface BottomNavProps {
  currentTab: ActiveTab;
  onNavigate: (tab: ActiveTab) => void;
}

export default function BottomNav({ currentTab, onNavigate }: BottomNavProps) {
  const navItems = [
    { id: 'store' as ActiveTab, label: 'Store', icon: 'storefront' },
    { id: 'categories' as ActiveTab, label: 'Categories', icon: 'grid_view' },
    { id: 'deals' as ActiveTab, label: 'Deals', icon: 'local_fire_department' },
    { id: 'admin' as ActiveTab, label: 'Admin', icon: 'dashboard' },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-40 pb-safe bg-white/95 backdrop-blur-xl shadow-[0_-2px_12px_rgba(19,27,46,0.06)] border-t border-[#eaedff]">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
        {navItems.map((item) => {
          const isActive = currentTab === item.id || (item.id === 'store' && (currentTab === 'pdp' || currentTab === 'checkout'));
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center w-16 h-12 transition-all relative ${
                isActive
                  ? 'text-[#0037b0] font-bold'
                  : 'text-[#434655] hover:text-[#131b2e]'
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={item.id === 'deals' && isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span className="font-mono text-[11px] mt-0.5 tracking-tight">{item.label}</span>
              {isActive && (
                <span className="absolute bottom-1 w-5 h-1 bg-[#0037b0] rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
