import { useState, useEffect } from 'react';
import { Product } from '../types';

interface DealsViewProps {
  products: Product[];
  onOpenProduct: (product: Product) => void;
  onQuickOrder: (product: Product) => void;
}

export default function DealsView({
  products,
  onOpenProduct,
  onQuickOrder,
}: DealsViewProps) {
  const flashProducts = products.filter((p) => p.flash || p.discount >= 35);
  const [secondsLeft, setSecondsLeft] = useState(3 * 3600 + 42 * 60 + 19);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hrs = Math.floor(secondsLeft / 3600);
  const mins = Math.floor((secondsLeft % 3600) / 60);
  const secs = secondsLeft % 60;

  return (
    <div className="flex flex-col w-full pb-28 max-w-2xl mx-auto px-4 space-y-4 pt-2">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#7c2900] via-[#a33900] to-[#7c2900] text-white p-5 rounded-2xl shadow-md relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="px-3 py-0.5 rounded-full bg-[#ffdbce] text-[#370e00] font-mono text-xs font-bold uppercase tracking-wider">
            Limited Flash Hour
          </span>
          <div className="flex items-center gap-1 font-mono text-xs font-bold">
            <span className="bg-black/40 px-2 py-0.5 rounded">{String(hrs).padStart(2, '0')}</span>:
            <span className="bg-black/40 px-2 py-0.5 rounded">{String(mins).padStart(2, '0')}</span>:
            <span className="bg-black/40 px-2 py-0.5 rounded">{String(secs).padStart(2, '0')}</span>
          </div>
        </div>
        <h2 className="font-sans text-xl sm:text-2xl font-extrabold tracking-tight mb-1">
          Exclusive Flash Discounts
        </h2>
        <p className="font-sans text-xs text-[#ffc9b6]">
          Save up to 48% on verified authentic products with rapid nationwide Cash on Delivery.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {flashProducts.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-2.5 shadow-sm border border-[#eaedff] flex flex-col justify-between transition-transform hover:-translate-y-1"
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
                />
                <span className="absolute top-1.5 left-1.5 bg-[#ba1a1a] text-white font-mono text-[10px] px-1.5 py-0.5 rounded-full font-bold shadow-xs">
                  -{item.discount}%
                </span>
                <span className="absolute bottom-1.5 right-1.5 bg-[#a33900] text-[#ffc9b6] font-mono text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  Flash Deal
                </span>
              </div>

              <span className="font-mono text-[10px] text-[#747686] uppercase tracking-wide">
                {item.sku} • {item.cat}
              </span>
              <h4
                onClick={() => onOpenProduct(item)}
                className="font-sans text-xs sm:text-sm font-semibold text-[#131b2e] line-clamp-2 mt-0.5 cursor-pointer hover:text-[#0037b0]"
              >
                {item.name}
              </h4>

              <div className="flex items-baseline gap-1.5 mt-2">
                <span className="font-mono text-sm sm:text-base text-[#0037b0] font-bold">
                  ৳ {item.price.toLocaleString('en-US')}
                </span>
                <span className="font-mono text-[11px] text-[#747686] line-through">
                  ৳ {item.regular.toLocaleString('en-US')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-[#eaedff]">
              <button
                onClick={() => onQuickOrder(item)}
                className="flex-1 py-2 px-2 bg-[#006c4a] hover:bg-[#005137] text-white font-mono text-[11px] font-bold rounded-xl flex items-center justify-center gap-1 shadow-xs active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-[15px]">chat</span>
                <span>WhatsApp</span>
              </button>
              <button
                onClick={() => onOpenProduct(item)}
                className="w-8 h-8 rounded-xl bg-[#eaedff] hover:bg-[#e2e7ff] flex items-center justify-center text-[#131b2e] active:scale-95 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">visibility</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
