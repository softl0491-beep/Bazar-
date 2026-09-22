import { useState, useMemo } from 'react';
import { Product, StoreSettings } from '../types';

interface ProductDetailViewProps {
  product: Product;
  settings: StoreSettings;
  onBack: () => void;
  onShowToast: (msg: string) => void;
  onOpenCheckout: (product: Product, quantity: number, variant: string) => void;
}

export default function ProductDetailView({
  product,
  settings,
  onBack,
  onShowToast,
  onOpenCheckout,
}: ProductDetailViewProps) {
  const galleryImages = useMemo(() => {
    if (product.gallery && product.gallery.length > 0) {
      return product.gallery;
    }
    return [
      product.image,
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBpq2yZgqsVCt6kLJ9crQh54g_l4EO5c_bEflDgGqKPIj3tL_2-aVZIXAwQyqpo0zHlLsH-fhDfkdfJXAoHI7hCpQ6P3g6lMECHBjDjEtTMwPyrgzitMCyIN79i9Xkoo4L3eeHrWB46DZmB9xNXEZAyBjKaZIm65f6CS_EZvS4Os0AT2qZTm9d9i0-CNZmDf37lG-Mt5bUObQH6In-Rn-ji29zWJAHu7wp8q05k8YZ3ajCKQHbE9I_j',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAeePs0zydsBH-4lcQAwMKjc4cKbcWltkeWpfzaWdYYIzYojpv7jo_817N8YTQJx18dnCplNvnRoFrBQfUuNtDX7_m9SRhhoVi1iCC2fCS_W525PLQfBvUUE3XUanCW7PTeWdDjvpZhTuI_RneMwoV4276qN-5oeOmMK3LZB6CUzV59YYAefl6ryMj_nUMhp0sbRultC0IV4QW0bHVwByw0cqfhYiFaX4ZFiBEkB3vy7-w_Ra6DJ3-e',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD4D7KRMh0Oow3FRO2JS4wlncZsy6xQ6vY9WXbKczHQk5H7YBhhSlKAYXf9WMlNap6GrFu8ncQjvJCPrRlWzNkLzP2GBUGDdNkLAB8gChp6CMprnxF5ukSfgz-WfAIw8RC-BqI3pa4uW74YRpqJeEhqRmtLAO5TU1zFSs4F83skTZ8WKjRRI0rUGXvt7cmqpC62LMS69PXQ1jrtB2dBHszhKB3GjzDxb9yKI_whPmm5cY1wyi8EPvIh'
    ];
  }, [product]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || 'Midnight Black');
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [activeTab, setActiveTab] = useState<'specs' | 'warranty' | 'delivery'>('specs');
  const [copiedCode, setCopiedCode] = useState(false);

  const totalPrice = product.price * quantity;
  const savings = (product.regular - product.price) * quantity;

  // Realtime WhatsApp message compilation
  const waOrderMessage = useMemo(() => {
    const nameStr = customerName.trim() || '[Enter Name]';
    const addrStr = customerAddress.trim() || '[Enter District/Address]';

    return `Hello BazaarHub, I want to order:
• Product: ${product.name}
• SKU: ${product.sku}
• Variant: ${selectedVariant}
• Quantity: ${quantity}
• Total Price: ৳${totalPrice.toLocaleString('en-US')} + Delivery
• Customer Name: ${nameStr}
• Delivery Address: ${addrStr}
Please confirm availability and dispatch date.`;
  }, [product, selectedVariant, quantity, totalPrice, customerName, customerAddress]);

  const waOrderLink = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(waOrderMessage)}`;

  const handleCopyCode = () => {
    const code = `${product.sku}-${selectedVariant.replace(/\s+/g, '').toUpperCase()}-Q${quantity}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    setCopiedCode(true);
    onShowToast(`Copied order code: ${code}`);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${product.name} - BazaarHub`,
        text: `Order ${product.name} via WhatsApp Cash on Delivery!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
      }
      onShowToast('Product URL copied to clipboard!');
    }
  };

  return (
    <div className="flex flex-col w-full pb-32 max-w-2xl mx-auto">
      {/* Micro Breadcrumb Bar */}
      <section className="px-4 py-2 flex items-center justify-between bg-[#f2f3ff] text-[#434655] font-mono text-xs border-b border-[#eaedff]">
        <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap py-1">
          <button onClick={onBack} className="hover:text-[#0037b0] transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">storefront</span>
            <span>Home</span>
          </button>
          <span className="material-symbols-outlined text-[14px] text-[#747686]">chevron_right</span>
          <span className="text-[#434655]">{product.cat.toUpperCase()}</span>
          <span className="material-symbols-outlined text-[14px] text-[#747686]">chevron_right</span>
          <span className="text-[#0037b0] font-bold truncate max-w-[120px]">{product.name}</span>
        </div>

        <button
          onClick={handleShare}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#eaedff] hover:bg-[#e2e7ff] text-[#0037b0] font-mono text-xs shadow-xs active:scale-95 transition-transform shrink-0"
        >
          <span className="material-symbols-outlined text-[15px]">share</span>
          <span>Share</span>
        </button>
      </section>

      {/* Product Image Gallery */}
      <section className="px-4 pt-3 pb-2">
        <div className="relative w-full aspect-square rounded-2xl bg-[#eaedff] overflow-hidden shadow-sm border border-[#eaedff]">
          <img
            src={galleryImages[activeImageIndex]}
            alt={product.alt}
            className="w-full h-full object-cover transition-all duration-300"
          />

          {/* Floating badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
            <span className="px-2.5 py-1 rounded-full bg-[#a33900] text-[#ffc9b6] font-mono text-xs shadow-md font-bold tracking-wider">
              {product.discount}% OFF
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#006c4a] text-white font-mono text-xs shadow-md flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              Original Authenticated
            </span>
          </div>

          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-[#283044]/85 text-[#eef0ff] backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-mono">
            <span className="material-symbols-outlined text-[14px]">photo_camera</span>
            <span>{activeImageIndex + 1} / {galleryImages.length} Photos</span>
          </div>
        </div>

        {/* Thumbnails */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar">
          {galleryImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden shadow-xs transition-all p-0.5 border-2 ${
                activeImageIndex === idx
                  ? 'border-[#0037b0] opacity-100 scale-105'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover rounded-lg" />
            </button>
          ))}
        </div>
      </section>

      {/* Product Title & Status */}
      <section className="px-4 pt-2">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="font-mono text-xs text-[#0037b0] font-bold tracking-wide uppercase">
            SKU: {product.sku}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#82f5c1] text-[#00714e] font-mono text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#006c4a] animate-pulse"></span>
            In Stock (Dhaka Hub)
          </span>
        </div>

        <h2 className="font-sans text-xl sm:text-2xl font-bold text-[#131b2e] tracking-tight leading-snug">
          {product.name}
        </h2>

        {/* Social Proof */}
        <div className="flex items-center gap-2 mt-2 pt-1 pb-1">
          <div className="flex items-center bg-[#e2e7ff] px-2 py-0.5 rounded-lg">
            <span className="material-symbols-outlined text-[16px] text-[#a33900]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span className="font-mono text-xs font-bold text-[#131b2e] ml-1">{product.rating}</span>
          </div>
          <span className="font-sans text-xs text-[#434655]">{product.reviews} Verified Reviews</span>
          <span className="text-[#747686] text-xs">•</span>
          <span className="font-mono text-xs text-[#006c4a] font-bold flex items-center gap-0.5">
            <span className="material-symbols-outlined text-[14px]">chat</span>
            820+ WhatsApp Orders
          </span>
        </div>
      </section>

      {/* Price & Local Value Proposition */}
      <section className="mx-4 mt-3 p-4 rounded-2xl bg-[#f2f3ff] shadow-sm border border-[#eaedff]">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl sm:text-3xl text-[#0037b0] font-extrabold tracking-tight">
              ৳{product.price.toLocaleString('en-US')}
            </span>
            <span className="font-mono text-sm line-through text-[#747686]">
              ৳{product.regular.toLocaleString('en-US')}
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[#ffdbce] text-[#370e00] font-mono text-xs font-bold">
            Save ৳{savings.toLocaleString('en-US')} Today
          </span>
        </div>

        {/* Logistics Banner */}
        <div className="mt-3 pt-2 space-y-1.5 border-t border-[#dae2fd]">
          <div className="flex items-center gap-2 text-[#131b2e] font-sans text-xs">
            <span className="material-symbols-outlined text-[#0037b0] text-[18px]">local_shipping</span>
            <span>৳60 Dhaka Metro (24h) | ৳120 Nationwide (48h)</span>
          </div>
          <div className="flex items-center gap-2 text-[#131b2e] font-sans text-xs">
            <span className="material-symbols-outlined text-[#006c4a] text-[18px]">payments</span>
            <span>Cash on Delivery available (Pay after unboxing check)</span>
          </div>
        </div>
      </section>

      {/* Variants & Quantity */}
      <section className="px-4 mt-4 space-y-4">
        {/* Color Variants */}
        {product.variants && product.variants.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-mono text-xs text-[#131b2e] font-semibold">Select Color Variant:</span>
              <span className="font-mono text-xs font-bold text-[#0037b0]">{selectedVariant}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {product.variants.map((variant) => {
                const isSelected = selectedVariant === variant;
                let swatchColor = 'bg-slate-900';
                if (variant.toLowerCase().includes('grey') || variant.toLowerCase().includes('gray') || variant.toLowerCase().includes('white')) {
                  swatchColor = 'bg-slate-400';
                } else if (variant.toLowerCase().includes('orange') || variant.toLowerCase().includes('gold')) {
                  swatchColor = 'bg-amber-600';
                } else if (variant.toLowerCase().includes('green')) {
                  swatchColor = 'bg-emerald-600';
                } else if (variant.toLowerCase().includes('blue')) {
                  swatchColor = 'bg-blue-600';
                }

                return (
                  <button
                    key={variant}
                    type="button"
                    onClick={() => setSelectedVariant(variant)}
                    className={`relative p-2.5 rounded-xl shadow-xs flex flex-col items-center gap-1 active:scale-95 transition-all border ${
                      isSelected
                        ? 'bg-[#0037b0] text-white border-[#0037b0]'
                        : 'bg-[#eaedff] text-[#131b2e] border-transparent hover:bg-[#e2e7ff]'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full ${swatchColor} shadow-inner border border-white/30`} />
                    <span className="font-mono text-[11px] font-semibold truncate max-w-[90%]">{variant}</span>
                    {isSelected && (
                      <span className="material-symbols-outlined text-[16px] absolute top-1.5 right-1.5">
                        check_circle
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Quantity Stepper */}
        <div className="p-3 rounded-xl bg-[#f2f3ff] flex items-center justify-between border border-[#eaedff]">
          <div>
            <span className="font-mono text-xs text-[#131b2e] font-bold block">Quantity</span>
            <span className="font-sans text-[11px] text-[#434655]">Max 5 units per order</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white rounded-full shadow-xs p-1 border border-[#eaedff]">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-full bg-[#eaedff] hover:bg-[#e2e7ff] flex items-center justify-center text-[#131b2e] active:scale-90 transition-transform"
              >
                <span className="material-symbols-outlined text-[18px]">remove</span>
              </button>
              <span className="w-10 text-center font-mono text-base text-[#131b2e] font-bold">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(5, q + 1))}
                className="w-8 h-8 rounded-full bg-[#eaedff] hover:bg-[#e2e7ff] flex items-center justify-center text-[#131b2e] active:scale-90 transition-transform"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Direct WhatsApp Ordering Section (Core Feature) */}
      <section className="mx-4 mt-5 p-4 rounded-2xl bg-[#82f5c1]/30 border-2 border-[#006c4a]/30 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-[#006c4a] text-[24px]">electric_bolt</span>
          <h3 className="font-sans text-base sm:text-lg font-bold text-[#006c4a]">
            1-Click WhatsApp Ordering
          </h3>
        </div>
        <p className="font-sans text-xs text-[#131b2e] mb-3 leading-relaxed">
          Skip the tedious checkout forms! Click below to send pre-formatted order details directly to our verified WhatsApp support desk.
        </p>

        {/* Quick Customer Info inputs */}
        <div className="space-y-2 mb-3">
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Your Name (e.g. Tanvir Ahmed)"
            className="w-full px-3 py-2.5 rounded-xl bg-white text-[#131b2e] font-sans text-xs sm:text-sm placeholder:text-[#747686] focus:outline-none shadow-xs border border-[#eaedff] focus:border-[#006c4a]"
          />
          <input
            type="text"
            value={customerAddress}
            onChange={(e) => setCustomerAddress(e.target.value)}
            placeholder="Delivery District & Thana (e.g. Mirpur-10, Dhaka)"
            className="w-full px-3 py-2.5 rounded-xl bg-white text-[#131b2e] font-sans text-xs sm:text-sm placeholder:text-[#747686] focus:outline-none shadow-xs border border-[#eaedff] focus:border-[#006c4a]"
          />
        </div>

        {/* Live Dynamic WhatsApp Message Preview */}
        <div className="mb-3 p-3 rounded-xl bg-white text-[#131b2e] shadow-inner border border-[#82f5c1]">
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#eaedff] text-xs font-mono">
            <span className="flex items-center gap-1 text-[#006c4a] font-bold">
              <span className="material-symbols-outlined text-[14px]">preview</span>
              Live WhatsApp Message Payload
            </span>
            <span className="text-[#747686] text-[10px]">Auto-Updated</span>
          </div>
          <pre className="font-mono text-[11px] leading-relaxed whitespace-pre-wrap select-all text-[#131b2e]">
            {waOrderMessage}
          </pre>
        </div>

        {/* Main WhatsApp Action Button */}
        <a
          href={waOrderLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 px-4 rounded-xl bg-[#006c4a] hover:bg-[#005137] text-white font-mono text-sm font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.98] transition-all"
        >
          <span className="material-symbols-outlined text-[22px]">chat</span>
          <span>অর্ডার করুন হোয়াটসঅ্যাপে (Order via WhatsApp)</span>
        </a>

        {/* Secondary Triggers */}
        <div className="flex items-center justify-between gap-2 mt-2.5">
          <a
            href={`tel:+${settings.whatsappNumber}`}
            className="flex-1 py-2 px-2.5 rounded-lg bg-white hover:bg-[#faf8ff] text-[#00714e] font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs border border-[#eaedff]"
          >
            <span className="material-symbols-outlined text-[16px]">call</span>
            <span>Call Hotline</span>
          </a>
          <button
            type="button"
            onClick={handleCopyCode}
            className="flex-1 py-2 px-2.5 rounded-lg bg-white hover:bg-[#faf8ff] text-[#00714e] font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs border border-[#eaedff]"
          >
            <span className="material-symbols-outlined text-[16px]">
              {copiedCode ? 'check' : 'content_copy'}
            </span>
            <span>{copiedCode ? 'Copied!' : 'Copy Order Code'}</span>
          </button>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="px-4 mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="p-3 rounded-xl bg-[#eaedff] flex flex-col items-center justify-center gap-1 shadow-xs border border-[#dae2fd]">
          <span className="material-symbols-outlined text-[#0037b0] text-[22px]">verified_user</span>
          <span className="font-mono text-xs font-bold text-[#131b2e]">6M Warranty</span>
          <span className="font-sans text-[10px] text-[#434655]">Seller Replacement</span>
        </div>
        <div className="p-3 rounded-xl bg-[#eaedff] flex flex-col items-center justify-center gap-1 shadow-xs border border-[#dae2fd]">
          <span className="material-symbols-outlined text-[#006c4a] text-[22px]">published_with_changes</span>
          <span className="font-mono text-xs font-bold text-[#131b2e]">7 Days Return</span>
          <span className="font-sans text-[10px] text-[#434655]">Hassle-free Exchange</span>
        </div>
        <div className="p-3 rounded-xl bg-[#eaedff] flex flex-col items-center justify-center gap-1 shadow-xs border border-[#dae2fd]">
          <span className="material-symbols-outlined text-[#a33900] text-[22px]">inventory_2</span>
          <span className="font-mono text-xs font-bold text-[#131b2e]">Open Box Check</span>
          <span className="font-sans text-[10px] text-[#434655]">Verify before paying</span>
        </div>
      </section>

      {/* Interactive Tabs */}
      <section className="px-4 mt-5">
        <div className="flex items-center gap-2 bg-[#eaedff] p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('specs')}
            className={`flex-1 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
              activeTab === 'specs'
                ? 'bg-white text-[#0037b0] shadow-sm'
                : 'text-[#434655] hover:text-[#131b2e]'
            }`}
          >
            Specifications
          </button>
          <button
            onClick={() => setActiveTab('warranty')}
            className={`flex-1 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
              activeTab === 'warranty'
                ? 'bg-white text-[#0037b0] shadow-sm'
                : 'text-[#434655] hover:text-[#131b2e]'
            }`}
          >
            Warranty
          </button>
          <button
            onClick={() => setActiveTab('delivery')}
            className={`flex-1 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
              activeTab === 'delivery'
                ? 'bg-white text-[#0037b0] shadow-sm'
                : 'text-[#434655] hover:text-[#131b2e]'
            }`}
          >
            Delivery Policy
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'specs' && (
          <div className="mt-3 p-4 rounded-2xl bg-[#f2f3ff] shadow-xs space-y-2.5 border border-[#eaedff]">
            <div className="flex justify-between py-1.5 font-sans text-xs border-b border-[#eaedff]">
              <span className="text-[#434655]">Display</span>
              <span className="font-semibold text-[#131b2e]">2.09-inch HD Infinite IPS Screen</span>
            </div>
            <div className="flex justify-between py-1.5 font-sans text-xs border-b border-[#eaedff]">
              <span className="text-[#434655]">Connectivity</span>
              <span className="font-semibold text-[#131b2e]">Bluetooth 5.2 (High-Definition Calling)</span>
            </div>
            <div className="flex justify-between py-1.5 font-sans text-xs border-b border-[#eaedff]">
              <span className="text-[#434655]">Battery Life</span>
              <span className="font-semibold text-[#131b2e]">Up to 3-5 Days (Wireless Magnetic)</span>
            </div>
            <div className="flex justify-between py-1.5 font-sans text-xs border-b border-[#eaedff]">
              <span className="text-[#434655]">Sensors</span>
              <span className="font-semibold text-[#131b2e]">Heart Rate, SpO2, Sleep, Pedometer</span>
            </div>
            <div className="flex justify-between py-1.5 font-sans text-xs border-b border-[#eaedff]">
              <span className="text-[#434655]">Water Resistance</span>
              <span className="font-semibold text-[#131b2e]">IP67 Splash & Sweatproof</span>
            </div>
            <div className="flex justify-between py-1.5 font-sans text-xs">
              <span className="text-[#434655]">App Support</span>
              <span className="font-semibold text-[#131b2e]">FitPro (Android & iOS compatible)</span>
            </div>
          </div>
        )}

        {activeTab === 'warranty' && (
          <div className="mt-3 p-4 rounded-2xl bg-[#f2f3ff] shadow-xs space-y-3 font-sans text-xs text-[#131b2e] border border-[#eaedff]">
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[#0037b0] text-[20px] shrink-0 mt-0.5">verified</span>
              <div>
                <span className="font-mono text-xs font-bold block text-[#131b2e]">
                  6 Months Official BazaarHub Seller Warranty
                </span>
                <p className="text-[#434655] mt-0.5 leading-relaxed">
                  Covers manufacturing defects, internal sensor malfunctions, and battery issues. Does not cover physical water damage or shattered screen.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 pt-2 border-t border-[#eaedff]">
              <span className="material-symbols-outlined text-[#006c4a] text-[20px] shrink-0 mt-0.5">help_center</span>
              <div>
                <span className="font-mono text-xs font-bold block text-[#131b2e]">
                  Warranty Claim Procedure
                </span>
                <p className="text-[#434655] mt-0.5 leading-relaxed">
                  Directly message our WhatsApp support desk with your order number and invoice copy. Our Dhaka courier partner will pick up the package from your doorstep.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'delivery' && (
          <div className="mt-3 p-4 rounded-2xl bg-[#f2f3ff] shadow-xs space-y-3 font-sans text-xs text-[#131b2e] border border-[#eaedff]">
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[#0037b0] text-[20px] shrink-0 mt-0.5">local_shipping</span>
              <div>
                <span className="font-mono text-xs font-bold block text-[#131b2e]">
                  Dhaka Metropolitan Area
                </span>
                <p className="text-[#434655] mt-0.5 leading-relaxed">
                  Standard Delivery within 24 hours. Delivery fee is ৳60. Same-day express dispatch available on morning WhatsApp orders.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 pt-2 border-t border-[#eaedff]">
              <span className="material-symbols-outlined text-[#a33900] text-[20px] shrink-0 mt-0.5">public</span>
              <div>
                <span className="font-mono text-xs font-bold block text-[#131b2e]">
                  All Other 63 Districts in Bangladesh
                </span>
                <p className="text-[#434655] mt-0.5 leading-relaxed">
                  Delivered via Steadfast / RedX Courier within 48 to 72 hours. Delivery fee is ৳120 with full Cash on Delivery.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Customer Reviews & Social Proof */}
      <section className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-sans text-base font-bold text-[#131b2e]">Verified Customer Reviews</h3>
            <p className="font-sans text-xs text-[#434655]">Real feedback from verified buyers across BD</p>
          </div>
          <div className="text-right">
            <span className="font-mono text-base font-bold text-[#131b2e]">4.9 / 5</span>
            <div className="flex text-[#a33900]">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {/* Review 1 */}
          <div className="p-3.5 rounded-2xl bg-[#f2f3ff] shadow-xs border border-[#eaedff]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#dce1ff] flex items-center justify-center font-mono font-bold text-[#0037b0] text-xs">
                  RA
                </div>
                <div>
                  <span className="font-mono text-xs font-bold text-[#131b2e] block">Rafiul Alam</span>
                  <span className="font-sans text-[11px] text-[#006c4a] flex items-center gap-1 font-semibold">
                    <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    Verified WhatsApp Buyer (Dhanmondi)
                  </span>
                </div>
              </div>
              <span className="font-mono text-[10px] text-[#747686]">2 days ago</span>
            </div>
            <p className="font-sans text-xs text-[#131b2e] leading-relaxed">
              "WhatsApp e message korar 15 minuter moddhe order confirm hoise. Call quality is very clear and the screen brightness is unbelievable for ৳1,450. Battery lasts 3 days easily!"
            </p>
            <div className="flex items-center gap-2 mt-2.5">
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-white shadow-inner border border-[#eaedff]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB73JsDO5FSyy5INS8izANFRWsUTJ8Mn-4j9oSPaANEAP3vWdzjbGKJUpP-g4AVLUeVP4UssQK4qRL6o6wfINJViB2T4WktF-lTKgTspXZvdQ2jIeMLqnmwLxpXSoY-KimJ2vdQzhAoq-cf-YZsXHtT8RORBWv9msN2HGtWv5j_TDGnkotiXu_RuPPH0aSfBoZZjP928RZNlhA2_1jxUc8YaSPiexsJ0CoJu_LX3IAvv3hux7JMthbU"
                  alt="Customer review photo of smartwatch"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Review 2 */}
          <div className="p-3.5 rounded-2xl bg-[#f2f3ff] shadow-xs border border-[#eaedff]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#85f8c4] flex items-center justify-center font-mono font-bold text-[#006c4a] text-xs">
                  SZ
                </div>
                <div>
                  <span className="font-mono text-xs font-bold text-[#131b2e] block">Sadia Zaman</span>
                  <span className="font-sans text-[11px] text-[#006c4a] flex items-center gap-1 font-semibold">
                    <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    Verified WhatsApp Buyer (Chittagong)
                  </span>
                </div>
              </div>
              <span className="font-mono text-[10px] text-[#747686]">1 week ago</span>
            </div>
            <p className="font-sans text-xs text-[#131b2e] leading-relaxed">
              "I ordered the Ocean Orange strap for my brother. Beautiful sports packaging and genuine product received via Steadfast courier within 2 days. Highly recommended."
            </p>
          </div>
        </div>
      </section>

      {/* Frequently Bought Together */}
      <section className="mt-6 px-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-sans text-base font-bold text-[#131b2e]">Frequently Bought Together</h3>
          <span className="font-mono text-xs text-[#0037b0] font-bold">Bundle Deal</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {/* Related 1 */}
          <div className="p-3 rounded-2xl bg-[#f2f3ff] shadow-xs border border-[#eaedff] flex flex-col justify-between">
            <div>
              <div className="relative w-full aspect-square rounded-xl bg-white overflow-hidden mb-2 border border-[#eaedff]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5yRbFB6lkDfQHZ2piMDXEnqZIOGHNVhF5UuJ4MHsEXQTytLWtq1AVd5C9Q3W27laRGewsvPrdU40UKc-kOtnqyMd4ZeCeJvNnhyygTSSdrHF_4R2OJ4Ciy1DsiQmAvU0Mbq1cfiNW_ZxJ-fUH1Q5BTXRSDDlQZIQGA1U2i6TL7ODGIBzp7uA0MH4tWoDuRaMk0GM47GHKbWOucFTq9Zvp1uJlZdb8MLl7l81Dt0iQg_nTyprQ86SE"
                  alt="Fast Magnetic Charger"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-[#a33900] text-[#ffc9b6] font-mono text-[10px] font-bold">
                  Bundle
                </span>
              </div>
              <h4 className="font-sans text-xs font-bold text-[#131b2e] line-clamp-1">Fast Magnetic Charger</h4>
              <span className="font-mono text-sm text-[#0037b0] font-bold block mt-0.5">৳350</span>
            </div>
            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=Hello%20BazaarHub,%20I%20also%20want%20to%20add%20Fast%20Magnetic%20Charger%20(৳350)%20to%20my%20order.`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 w-full py-2 px-2 rounded-xl bg-[#e2e7ff] hover:bg-[#dce1ff] text-[#0037b0] font-mono text-[11px] font-bold flex items-center justify-center gap-1 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[15px]">add_shopping_cart</span>
              <span>Add with Watch</span>
            </a>
          </div>

          {/* Related 2 */}
          <div className="p-3 rounded-2xl bg-[#f2f3ff] shadow-xs border border-[#eaedff] flex flex-col justify-between">
            <div>
              <div className="relative w-full aspect-square rounded-xl bg-white overflow-hidden mb-2 border border-[#eaedff]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrhWw9uZYNU65XI0ex8zOX8hblzCfXSWy3hu2lwh5-A4ozMLm6Bs6b6pJ-MMKfFZk8Gb13rMnWmtyAbf384FM9mWwvrdrLdqbWwTnGRluySZfQ2JPMnzpiXQ7sHiQyJrbgKMcdbLJFBp4bZwfPuUS8vDmG-R_X7qkQzNXY6YS7vWib1sLvocfEuHX9OQfNCgwicIpeeT21cKWWxK-OEDvCGyOCaDeYEJakgiBilartzZlJ5rqzDsub"
                  alt="Alpine Loop Straps"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-[#006c4a] text-white font-mono text-[10px] font-bold">
                  Strap Pack
                </span>
              </div>
              <h4 className="font-sans text-xs font-bold text-[#131b2e] line-clamp-1">Alpine Loop Straps (3x)</h4>
              <span className="font-mono text-sm text-[#0037b0] font-bold block mt-0.5">৳490</span>
            </div>
            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=Hello%20BazaarHub,%20I%20also%20want%20to%20add%20Alpine%20Loop%20Straps%20Pack%20(৳490)%20to%20my%20order.`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 w-full py-2 px-2 rounded-xl bg-[#e2e7ff] hover:bg-[#dce1ff] text-[#0037b0] font-mono text-[11px] font-bold flex items-center justify-center gap-1 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[15px]">add_shopping_cart</span>
              <span>Add with Watch</span>
            </a>
          </div>
        </div>
      </section>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#faf8ff]/95 backdrop-blur-xl shadow-[0_-4px_16px_rgba(0,0,0,0.06)] border-t border-[#eaedff] px-4 py-3 pb-safe flex items-center gap-2 max-w-md mx-auto">
        <div className="shrink-0 flex flex-col">
          <span className="font-mono text-[10px] text-[#434655] uppercase tracking-wider font-semibold">Total Price</span>
          <span className="font-mono text-xl text-[#0037b0] font-extrabold leading-tight">
            ৳{totalPrice.toLocaleString('en-US')}
          </span>
        </div>

        <a
          href={waOrderLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 h-12 rounded-xl bg-[#006c4a] hover:bg-[#005137] text-white font-mono text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-[0.98] transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">chat</span>
          <span>অর্ডার করুন (WhatsApp)</span>
        </a>

        <button
          onClick={() => onOpenCheckout(product, quantity, selectedVariant)}
          title="Open Full Checkout Form"
          className="h-12 px-3 rounded-xl bg-[#eaedff] hover:bg-[#e2e7ff] text-[#0037b0] font-mono text-xs font-bold flex items-center justify-center gap-1 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">receipt</span>
        </button>
      </div>
    </div>
  );
}
