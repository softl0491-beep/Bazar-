import { useState, useEffect, useMemo } from 'react';
import { Product, StoreSettings } from '../types';

interface StoreViewProps {
  products: Product[];
  settings: StoreSettings;
  onOpenProduct: (product: Product) => void;
  onQuickOrder: (product: Product) => void;
}

export default function StoreView({
  products,
  settings,
  onOpenProduct,
  onQuickOrder,
}: StoreViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [carouselIndex, setCarouselIndex] = useState<number>(0);

  // Flash Countdown Timer state (3 hours, 42 mins, 19 secs)
  const [flashSeconds, setFlashSeconds] = useState<number>(3 * 3600 + 42 * 60 + 19);

  useEffect(() => {
    const timer = setInterval(() => {
      setFlashSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Carousel auto slide
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(slideTimer);
  }, []);

  const formatTimer = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return {
      hrs: String(hrs).padStart(2, '0'),
      mins: String(mins).padStart(2, '0'),
      secs: String(secs).padStart(2, '0'),
    };
  };

  const timerDisplay = formatTimer(flashSeconds);

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((item) => {
        const matchCategory =
          selectedCategory === 'all'
            ? true
            : selectedCategory === 'flash'
            ? item.flash
            : item.cat.toLowerCase() === selectedCategory.toLowerCase();

        const q = searchQuery.toLowerCase().trim();
        const matchSearch =
          q === '' ||
          item.name.toLowerCase().includes(q) ||
          item.sku.toLowerCase().includes(q) ||
          item.cat.toLowerCase().includes(q);

        return matchCategory && matchSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'discount') return b.discount - a.discount;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // featured
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  // Flash product sample (T900)
  const flashProduct = products.find((p) => p.flash) || products[0];

  return (
    <div className="flex flex-col w-full pb-28">
      {/* Search & Category Pills Bar */}
      <div className="sticky top-20 z-30 px-4 py-2 bg-[#faf8ff]/95 backdrop-blur-md border-b border-[#eaedff]">
        <div className="flex items-center gap-2 bg-[#eaedff] rounded-full px-4 py-2 shadow-inner">
          <span className="material-symbols-outlined text-[#0037b0] text-[20px]">search</span>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 50+ items, SKU (e.g. BZ-101)..."
            className="w-full bg-transparent font-sans text-sm text-[#131b2e] placeholder:text-[#747686] focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[#747686] hover:text-[#131b2e]"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        {/* Category Pill Horizontal Scroll */}
        <div className="flex items-center gap-2 overflow-x-auto py-2 no-scrollbar scroll-smooth">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-xs whitespace-nowrap transition-transform active:scale-95 shadow-sm ${
              selectedCategory === 'all'
                ? 'bg-[#0037b0] text-white font-bold'
                : 'bg-[#eaedff] text-[#434655] hover:bg-[#e2e7ff]'
            }`}
          >
            <span>All Items</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                selectedCategory === 'all'
                  ? 'bg-[#1d4ed8] text-[#cad3ff]'
                  : 'bg-[#dae2fd] text-[#0037b0]'
              }`}
            >
              {products.length}
            </span>
          </button>

          {[
            { id: 'gadgets', label: 'Gadgets' },
            { id: 'fashion', label: 'Fashion' },
            { id: 'home', label: 'Home & Kitchen' },
            { id: 'groceries', label: 'Groceries' },
            { id: 'sports', label: 'Sports & Fitness' },
            { id: 'beauty', label: 'Beauty & Care' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-mono text-xs whitespace-nowrap transition-transform active:scale-95 ${
                selectedCategory === cat.id
                  ? 'bg-[#0037b0] text-white font-bold shadow-sm'
                  : 'bg-[#eaedff] text-[#434655] hover:bg-[#e2e7ff]'
              }`}
            >
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Promo Hero Carousel */}
      <section className="px-4 pt-3">
        <div className="relative overflow-hidden rounded-2xl shadow-md bg-gradient-to-r from-[#0037b0] to-[#1d4ed8] text-white">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
          >
            {/* Slide 1 */}
            <div className="min-w-full p-5 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#a33900] text-[#ffc9b6] font-mono text-[10px] uppercase font-bold tracking-wider">
                  Mega Summer Bash
                </span>
                <span className="font-mono text-[11px] bg-white/20 px-2 py-0.5 rounded-full">
                  Slide 1/3
                </span>
              </div>
              <h2 className="font-sans text-xl sm:text-2xl font-extrabold tracking-tight max-w-[85%] mb-1 leading-tight">
                Up to 60% OFF Authentic Gadgets!
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#cad3ff] mb-4">
                Fast delivery inside Dhaka in 24h & 64 districts nationwide.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedCategory('gadgets')}
                  className="px-4 py-2 bg-white text-[#0037b0] font-mono text-xs font-bold rounded-lg shadow hover:bg-[#faf8ff] transition-transform active:scale-95"
                >
                  Shop Deals
                </button>
                <a
                  className="px-3 py-2 bg-[#006c4a] text-white rounded-lg font-mono text-xs font-bold flex items-center gap-1 shadow hover:bg-[#005137]"
                  href={`https://wa.me/${settings.whatsappNumber}?text=Hi%20BazaarHub%2C%20tell%20me%20about%20Summer%20Bazaar%20Offers`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span className="material-symbols-outlined text-[16px]">chat</span>
                  <span>Ask Offer</span>
                </a>
              </div>
            </div>

            {/* Slide 2 */}
            <div className="min-w-full p-5 flex flex-col justify-between relative overflow-hidden bg-gradient-to-r from-[#006c4a] to-[#00714e]">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#85f8c4] text-[#002114] font-mono text-[10px] uppercase font-bold tracking-wider">
                  Fast WhatsApp Commerce
                </span>
                <span className="font-mono text-[11px] bg-white/20 px-2 py-0.5 rounded-full">
                  Slide 2/3
                </span>
              </div>
              <h2 className="font-sans text-xl sm:text-2xl font-extrabold tracking-tight max-w-[90%] mb-1 leading-tight">
                1-Click WhatsApp Order
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#f2f3ff] mb-4">
                Zero lengthy forms. Tap WhatsApp Order, send confirmation, done!
              </p>
              <div className="flex items-center gap-2">
                <a
                  className="px-4 py-2 bg-white text-[#006c4a] font-mono text-xs font-bold rounded-lg shadow"
                  href={`https://wa.me/${settings.whatsappNumber}?text=Hi%20BazaarHub%2C%20I%20want%20to%20order%20directly`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Instant Chat Order
                </a>
              </div>
            </div>

            {/* Slide 3 */}
            <div className="min-w-full p-5 flex flex-col justify-between relative overflow-hidden bg-gradient-to-r from-[#7c2900] to-[#a33900]">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#ffdbce] text-[#370e00] font-mono text-[10px] uppercase font-bold tracking-wider">
                  Pure Organic Harvest
                </span>
                <span className="font-mono text-[11px] bg-white/20 px-2 py-0.5 rounded-full">
                  Slide 3/3
                </span>
              </div>
              <h2 className="font-sans text-xl sm:text-2xl font-extrabold tracking-tight max-w-[85%] mb-1 leading-tight">
                Sundarban Honey & Cold Oil
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#ffc9b6] mb-4">
                100% lab certified raw natural products directly to your dining table.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedCategory('groceries')}
                  className="px-4 py-2 bg-white text-[#7c2900] font-mono text-xs font-bold rounded-lg shadow"
                >
                  Explore Organic
                </button>
              </div>
            </div>
          </div>

          {/* Carousel Dots */}
          <div className="absolute bottom-3 right-4 flex gap-1.5 z-10">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                onClick={() => setCarouselIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  carouselIndex === i ? 'bg-white scale-110' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Quick Category Roundels */}
      <section className="px-4 pt-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-sans text-base sm:text-lg text-[#131b2e] font-bold">
            Featured Categories
          </h3>
          <span
            onClick={() => setSelectedCategory('all')}
            className="font-mono text-xs text-[#0037b0] font-bold cursor-pointer hover:underline"
          >
            View All
          </span>
        </div>

        <div className="grid grid-cols-4 gap-3 text-center">
          {[
            { id: 'gadgets', label: 'Gadgets', icon: 'devices', count: '14', color: 'bg-[#dce1ff] text-[#0037b0]' },
            { id: 'fashion', label: 'Fashion', icon: 'apparel', count: '10', color: 'bg-[#85f8c4] text-[#006c4a]' },
            { id: 'home', label: 'Kitchen', icon: 'kitchen', count: '8', color: 'bg-[#e2e7ff] text-[#0037b0]' },
            { id: 'groceries', label: 'Groceries', icon: 'eco', count: '6', color: 'bg-[#ffdbce] text-[#7c2900]' },
            { id: 'sports', label: 'Sports', icon: 'fitness_center', count: '5', color: 'bg-[#e2e7ff] text-[#0037b0]' },
            { id: 'beauty', label: 'Beauty', icon: 'spa', count: '4', color: 'bg-[#ffdad6] text-[#ba1a1a]' },
            { id: 'flash', label: 'Flash Deals', icon: 'local_fire_department', count: 'Hot', color: 'bg-[#ffb599] text-[#7c2900]' },
            { id: 'all', label: 'Ending Soon', icon: 'hourglass_top', count: 'Few', color: 'bg-[#dae2fd] text-[#434655]' },
          ].map((cat) => (
            <div
              key={cat.label}
              onClick={() => setSelectedCategory(cat.id)}
              className="cursor-pointer flex flex-col items-center gap-1 group active:scale-95 transition-transform"
            >
              <div
                className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full ${cat.color} flex items-center justify-center shadow-sm relative transition-all group-hover:scale-105`}
              >
                <span className="material-symbols-outlined text-[24px]">{cat.icon}</span>
                <span className="absolute -top-1 -right-1 bg-[#006c4a] text-white rounded-full font-mono text-[9px] px-1.5 leading-none py-0.5 font-bold shadow-xs">
                  {cat.count}
                </span>
              </div>
              <span className="font-mono text-[11px] text-[#131b2e] line-clamp-1 font-medium">
                {cat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Flash Deals Countdown Section */}
      <section className="mx-4 mt-5 p-4 rounded-2xl bg-[#f2f3ff] shadow-sm border border-[#eaedff]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span
              className="material-symbols-outlined text-[#7c2900] text-[22px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              local_fire_department
            </span>
            <span className="font-sans text-base font-bold text-[#131b2e]">Flash Hour Deals</span>
          </div>

          {/* Countdown timer display */}
          <div className="flex items-center gap-1 font-mono text-xs font-bold text-white">
            <span className="bg-[#7c2900] px-2 py-0.5 rounded shadow-xs">{timerDisplay.hrs}</span>:
            <span className="bg-[#7c2900] px-2 py-0.5 rounded shadow-xs">{timerDisplay.mins}</span>:
            <span className="bg-[#7c2900] px-2 py-0.5 rounded shadow-xs">{timerDisplay.secs}</span>
          </div>
        </div>

        {/* Quick Flash Product Snippet Card */}
        {flashProduct && (
          <div className="bg-white p-3 rounded-xl shadow-sm flex gap-3 items-center border border-[#eaedff]">
            <div
              onClick={() => onOpenProduct(flashProduct)}
              className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-[#eaedff] cursor-pointer"
            >
              <img
                src={flashProduct.image}
                alt={flashProduct.alt}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-1 left-1 bg-[#ba1a1a] text-white font-mono text-[10px] px-1.5 py-0.2 rounded font-bold">
                -{flashProduct.discount}%
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-[#747686]">SKU: {flashProduct.sku}</span>
                <span className="font-mono text-[11px] text-[#ba1a1a] font-bold">Only 4 left!</span>
              </div>
              <p
                onClick={() => onOpenProduct(flashProduct)}
                className="font-sans text-sm font-bold text-[#131b2e] truncate cursor-pointer hover:text-[#0037b0]"
              >
                {flashProduct.name}
              </p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="font-mono text-base font-bold text-[#0037b0]">
                  ৳ {flashProduct.price.toLocaleString('en-US')}
                </span>
                <span className="font-mono text-xs text-[#747686] line-through">
                  ৳ {flashProduct.regular.toLocaleString('en-US')}
                </span>
              </div>

              {/* Micro stock progress bar */}
              <div className="w-full bg-[#e2e7ff] h-1.5 rounded-full overflow-hidden mt-1.5">
                <div className="bg-[#ba1a1a] h-full rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>

            <button
              onClick={() => onQuickOrder(flashProduct)}
              className="w-10 h-10 rounded-full bg-[#006c4a] text-white flex items-center justify-center shrink-0 shadow active:scale-95 hover:bg-[#005137] transition-all"
              title="Quick WhatsApp Order"
            >
              <span className="material-symbols-outlined text-[20px]">chat</span>
            </button>
          </div>
        )}
      </section>

      {/* Live Catalog Control Bar */}
      <section className="px-4 pt-5 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-sans text-base sm:text-lg text-[#131b2e] font-bold">Browse Products</h3>
            <p className="font-sans text-xs text-[#434655]">
              <span className="font-mono font-bold text-[#0037b0]">{filteredProducts.length}</span> items ready to ship COD
            </p>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1 bg-[#eaedff] px-2.5 py-1.5 rounded-lg shadow-sm">
            <span className="material-symbols-outlined text-[#747686] text-[18px]">sort</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-mono text-xs text-[#131b2e] focus:outline-none pr-1 cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="discount">Highest Discount</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="px-4 py-2">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white rounded-2xl border border-[#eaedff]">
            <div className="w-16 h-16 rounded-full bg-[#eaedff] flex items-center justify-center text-[#747686] mb-3">
              <span className="material-symbols-outlined text-[32px]">manage_search</span>
            </div>
            <h4 className="font-sans text-base font-bold text-[#131b2e] mb-1">
              No matching items found
            </h4>
            <p className="font-sans text-xs text-[#434655] max-w-xs mb-4">
              Try searching with a broader keyword, check your SKU, or reset filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 bg-[#0037b0] text-white rounded-lg font-mono text-xs font-bold shadow"
            >
              Show All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-2.5 shadow-sm border border-[#eaedff] flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <div>
                  <div
                    onClick={() => onOpenProduct(item)}
                    className="relative w-full aspect-square rounded-xl bg-[#eaedff] overflow-hidden mb-2 cursor-pointer group"
                  >
                    <img
                      src={item.image}
                      alt={item.alt}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <span className="absolute top-1.5 left-1.5 bg-[#ba1a1a] text-white font-mono text-[10px] px-1.5 py-0.5 rounded-full font-bold shadow-xs">
                      -{item.discount}%
                    </span>
                    <span
                      className={`absolute bottom-1.5 right-1.5 font-mono text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        item.flash
                          ? 'bg-[#a33900] text-[#ffc9b6]'
                          : 'bg-[#006c4a] text-white'
                      }`}
                    >
                      {item.flash ? 'Flash Deal' : 'In Stock'}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="font-mono text-[10px] text-[#747686] uppercase tracking-wide">
                      {item.sku} • {item.cat}
                    </span>
                    <h4
                      onClick={() => onOpenProduct(item)}
                      className="font-sans text-xs sm:text-sm font-semibold text-[#131b2e] line-clamp-2 mt-0.5 leading-snug cursor-pointer hover:text-[#0037b0]"
                    >
                      {item.name}
                    </h4>

                    <div className="flex items-center gap-1 my-1">
                      <span
                        className="material-symbols-outlined text-[#006c4a] text-[14px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                      <span className="font-mono text-xs font-bold text-[#131b2e]">
                        {item.rating}
                      </span>
                      <span className="font-mono text-[10px] text-[#747686]">
                        ({item.reviews})
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1.5 mt-auto">
                      <span className="font-mono text-sm sm:text-base text-[#0037b0] font-bold">
                        ৳ {item.price.toLocaleString('en-US')}
                      </span>
                      <span className="font-mono text-[11px] text-[#747686] line-through">
                        ৳ {item.regular.toLocaleString('en-US')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-[#eaedff]">
                  <button
                    onClick={() => onQuickOrder(item)}
                    className="flex-1 py-2 px-2 bg-[#006c4a] hover:bg-[#005137] text-white font-mono text-[11px] font-bold rounded-xl flex items-center justify-center gap-1 shadow-xs transition-transform active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[15px]">chat</span>
                    <span>WhatsApp</span>
                  </button>
                  <button
                    onClick={() => onOpenProduct(item)}
                    className="w-8 h-8 rounded-xl bg-[#eaedff] hover:bg-[#e2e7ff] flex items-center justify-center text-[#131b2e] active:scale-95 transition-colors"
                    title="View details"
                  >
                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Trust & Value Proposition Badges */}
      <section className="mx-4 my-6 p-4 rounded-2xl bg-white shadow-sm border border-[#eaedff]">
        <h3 className="font-sans text-base font-bold text-[#131b2e] text-center mb-4">
          Why 150,000+ Trust BazaarHub
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#f2f3ff]">
            <div className="w-9 h-9 rounded-full bg-[#85f8c4] text-[#002114] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">local_shipping</span>
            </div>
            <div>
              <h5 className="font-mono text-xs font-bold text-[#131b2e]">64 Districts COD</h5>
              <p className="font-sans text-[11px] text-[#434655]">Pay when in hand</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#f2f3ff]">
            <div className="w-9 h-9 rounded-full bg-[#dce1ff] text-[#001551] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">verified</span>
            </div>
            <div>
              <h5 className="font-mono text-xs font-bold text-[#131b2e]">100% Genuine</h5>
              <p className="font-sans text-[11px] text-[#434655]">Direct brand intake</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#f2f3ff]">
            <div className="w-9 h-9 rounded-full bg-[#82f5c1] text-[#00714e] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">mark_chat_unread</span>
            </div>
            <div>
              <h5 className="font-mono text-xs font-bold text-[#131b2e]">Instant WhatsApp</h5>
              <p className="font-sans text-[11px] text-[#434655]">Real agent in 2m</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#f2f3ff]">
            <div className="w-9 h-9 rounded-full bg-[#e2e7ff] text-[#0037b0] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">published_with_changes</span>
            </div>
            <div>
              <h5 className="font-mono text-xs font-bold text-[#131b2e]">7-Day Return</h5>
              <p className="font-sans text-[11px] text-[#434655]">No questions asked</p>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Quick WhatsApp Order Button */}
      <a
        aria-label="Quick WhatsApp Order"
        className="fixed right-4 bottom-20 z-40 flex items-center gap-1.5 bg-[#006c4a] hover:bg-[#005137] text-white py-2.5 px-4 rounded-full shadow-[0_8px_20px_-4px_rgba(0,108,74,0.4)] transition-all active:scale-95"
        href={`https://wa.me/${settings.whatsappNumber}?text=Hi%20BazaarHub%2C%20I%20want%20to%20place%20an%20order`}
        rel="noopener noreferrer"
        target="_blank"
      >
        <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
        <span className="font-mono text-xs font-bold tracking-normal">Order Now</span>
        <span className="relative flex h-2.5 w-2.5 ml-0.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#85f8c4] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#85f8c4]"></span>
        </span>
      </a>
    </div>
  );
}
