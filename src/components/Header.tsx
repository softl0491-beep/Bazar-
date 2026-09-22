import { ActiveTab, StoreSettings } from '../types';
import { BRAND_LOGO_URL, USER_AVATAR_URL } from '../data/products';

interface HeaderProps {
  currentTab: ActiveTab;
  onNavigate: (tab: ActiveTab) => void;
  settings: StoreSettings;
  onSearchClick?: () => void;
}

export default function Header({ currentTab, onNavigate, settings, onSearchClick }: HeaderProps) {
  const isSubPage = currentTab === 'pdp' || currentTab === 'checkout';

  const getSubTitle = () => {
    switch (currentTab) {
      case 'store':
        return 'Home';
      case 'pdp':
        return 'Product Detail';
      case 'checkout':
        return 'Whatsapp Checkout';
      case 'admin':
        return 'Admin Dashboard';
      case 'categories':
        return 'Categories';
      case 'deals':
        return 'Flash Deals';
      default:
        return 'Store';
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-[#faf8ff]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#eaedff]">
      {/* Top Delivery Announcement Banner */}
      <div className="bg-[#006c4a] text-white px-4 py-1 text-center font-mono text-[11px] sm:text-xs flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap tracking-wide">
        <span>{settings.tickerText}</span>
      </div>

      {/* Main Navbar */}
      <div className="h-16 px-4 flex items-center justify-between gap-2 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 min-w-0">
          {isSubPage ? (
            <button
              onClick={() => onNavigate('store')}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#eaedff] transition-colors text-[#131b2e] shrink-0"
              aria-label="Go back"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
          ) : null}

          <div 
            onClick={() => onNavigate('store')}
            className="flex items-center gap-2 cursor-pointer select-none group shrink-0"
          >
            <img
              src={BRAND_LOGO_URL}
              alt="BazaarHub Official Logo"
              className="h-7 sm:h-8 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col min-w-0">
              <span className="font-sans text-base sm:text-lg text-[#0037b0] tracking-tight font-bold leading-none">
                BazaarHub
              </span>
              <span className="font-mono text-[10px] sm:text-xs text-[#434655] font-semibold truncate">
                {getSubTitle()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              if (currentTab !== 'store') onNavigate('store');
              if (onSearchClick) onSearchClick();
            }}
            aria-label="Search Catalog"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#eaedff] hover:bg-[#e2e7ff] transition-colors text-[#131b2e]"
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
          </button>

          <a
            aria-label="Chat on WhatsApp"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#82f5c1] hover:bg-[#85f8c4] text-[#00714e] transition-transform active:scale-95 shadow-sm"
            href={`https://wa.me/${settings.whatsappNumber}?text=Hi%20BazaarHub%2C%20I%20have%20an%20inquiry%20regarding%20products`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="material-symbols-outlined text-[20px]">chat</span>
          </a>

          <button
            onClick={() => onNavigate('admin')}
            title="Admin Dashboard"
            className="w-10 h-10 flex items-center justify-center rounded-full relative group"
          >
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-[#0037b0]/25 group-hover:ring-[#0037b0] transition-all"
              src={USER_AVATAR_URL}
            />
            {settings.isStoreOnline && (
              <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-[#006c4a] border-2 border-white"></span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
