import { useState, useEffect } from 'react';
import { Product, StoreSettings } from '../types';

interface WhatsAppDrawerProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  settings: StoreSettings;
  onOpenFullCheckout?: (product: Product, quantity: number, variant: string) => void;
}

export default function WhatsAppDrawer({
  product,
  isOpen,
  onClose,
  settings,
  onOpenFullCheckout,
}: WhatsAppDrawerProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [deliveryArea, setDeliveryArea] = useState('Dhaka Metro (24-48 Hours - ৳60 COD)');

  useEffect(() => {
    if (product) {
      setQuantity(1);
      setSelectedVariant(product.variants?.[0] || 'Standard');
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const getDeliveryFee = () => {
    if (deliveryArea.includes('Dhaka Metro')) return 60;
    if (deliveryArea.includes('Chittagong')) return 100;
    if (deliveryArea.includes('Sylhet')) return 120;
    return 130;
  };

  const deliveryFee = getDeliveryFee();
  const totalPrice = product.price * quantity;
  const grandTotal = totalPrice + deliveryFee;

  const rawMessage = `Hi BazaarHub, I want to order this item Cash On Delivery:
📦 Product: ${product.name}
🏷️ SKU: ${product.sku}
🎨 Variant: ${selectedVariant}
🔢 Quantity: ${quantity}
💰 Total Item Price: ৳${totalPrice.toLocaleString('en-US')}
🚚 Delivery Area: ${deliveryArea}
💵 Estimated Payable: ৳${grandTotal.toLocaleString('en-US')}

Please confirm my order delivery!`;

  const waLink = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(rawMessage)}`;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end justify-center transition-opacity"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md bg-white rounded-t-2xl p-5 shadow-2xl max-h-[85vh] overflow-y-auto animate-slide-up border-t border-[#eaedff]">
        <div className="w-12 h-1.5 bg-[#eaedff] rounded-full mx-auto mb-4 cursor-pointer" onClick={onClose} />

        {/* Header */}
        <div className="flex items-start justify-between pb-2 border-b border-[#eaedff]">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#006c4a] inline-block animate-pulse"></span>
              <span className="font-mono text-xs text-[#006c4a] font-bold uppercase tracking-wider">
                Direct WhatsApp Checkout
              </span>
            </div>
            <h3 className="font-sans text-base font-bold text-[#131b2e] mt-1 line-clamp-1">
              {product.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#eaedff] hover:bg-[#e2e7ff] flex items-center justify-center text-[#747686] hover:text-[#131b2e] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Item Snapshot */}
        <div className="flex items-center gap-3 p-3 bg-[#f2f3ff] rounded-xl my-3">
          <div className="w-16 h-16 rounded-lg bg-white overflow-hidden shrink-0 border border-[#eaedff]">
            <img
              src={product.image}
              alt={product.alt}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-mono text-xs text-[#747686]">
              SKU: {product.sku} • {product.cat.toUpperCase()}
            </p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="font-mono text-base font-bold text-[#0037b0]">
                ৳ {product.price.toLocaleString('en-US')}
              </span>
              <span className="font-mono text-xs text-[#747686] line-through">
                ৳ {product.regular.toLocaleString('en-US')}
              </span>
            </div>
            <span className="font-mono text-[11px] text-[#006c4a] font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              In-stock & verified
            </span>
          </div>
        </div>

        {/* Variants if available */}
        {product.variants && product.variants.length > 0 && (
          <div className="mb-3">
            <label className="block font-mono text-xs text-[#434655] font-semibold mb-1.5">
              Select Variant:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {product.variants.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setSelectedVariant(v)}
                  className={`px-3 py-1 rounded-full text-xs font-mono font-semibold transition-all ${
                    selectedVariant === v
                      ? 'bg-[#0037b0] text-white shadow-sm'
                      : 'bg-[#eaedff] text-[#434655] hover:bg-[#e2e7ff]'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity and Area */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-[#131b2e] font-semibold">Quantity</span>
            <div className="flex items-center gap-3 bg-[#eaedff] px-3 py-1 rounded-full">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="text-[#131b2e] font-bold text-[18px] leading-none active:scale-90 px-1"
              >
                -
              </button>
              <span className="font-mono text-base font-bold text-[#0037b0] min-w-[20px] text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                className="text-[#131b2e] font-bold text-[18px] leading-none active:scale-90 px-1"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs text-[#434655] mb-1 font-semibold">
              Delivery City / Area (Cash On Delivery)
            </label>
            <select
              value={deliveryArea}
              onChange={(e) => setDeliveryArea(e.target.value)}
              className="w-full bg-[#eaedff] rounded-lg px-3 py-2 text-[#131b2e] font-sans text-xs sm:text-sm focus:outline-none border border-transparent focus:border-[#0037b0]"
            >
              <option value="Dhaka Metro (24-48 Hours - ৳60 COD)">Dhaka Metro (24-48 Hours - ৳60 COD)</option>
              <option value="Chittagong Metro (48 Hours - ৳100 COD)">Chittagong Metro (48 Hours - ৳100 COD)</option>
              <option value="Sylhet, Rajshahi, Khulna (72 Hours - ৳120 COD)">Sylhet, Rajshahi, Khulna (72 Hours - ৳120 COD)</option>
              <option value="Other 60 Districts Nationwide (72 Hours - ৳130 COD)">Other 60 Districts Nationwide (72 Hours - ৳130 COD)</option>
            </select>
          </div>

          {/* WhatsApp Pre-filled payload preview */}
          <div className="p-3 rounded-lg bg-[#eaedff] text-[#434655] font-mono text-[11px] leading-relaxed break-words border border-[#dae2fd]">
            <span className="font-bold text-[#131b2e] block mb-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#006c4a]">preview</span>
              Live WhatsApp Message Payload:
            </span>
            <p className="text-[#434655] whitespace-pre-wrap">{rawMessage}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 bg-[#006c4a] hover:bg-[#005137] text-white font-mono text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[20px]">chat</span>
            <span>Send WhatsApp Order Now</span>
          </a>

          {onOpenFullCheckout && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenFullCheckout(product, quantity, selectedVariant);
              }}
              className="w-full py-2.5 px-4 bg-[#eaedff] hover:bg-[#e2e7ff] text-[#0037b0] font-mono text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">receipt_long</span>
              <span>Open Dedicated Checkout Screen</span>
            </button>
          )}
        </div>

        <p className="font-mono text-[10px] text-center text-[#747686] mt-3">
          Official BazaarHub Verified Commerce WhatsApp (+880 1700-000000)
        </p>
      </div>
    </div>
  );
}
