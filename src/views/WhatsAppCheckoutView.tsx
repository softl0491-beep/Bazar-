import { useState, useMemo } from 'react';
import { Product, StoreSettings } from '../types';

interface WhatsAppCheckoutViewProps {
  product: Product;
  initialQuantity?: number;
  initialVariant?: string;
  settings: StoreSettings;
  onBack: () => void;
  onShowToast: (msg: string) => void;
}

export default function WhatsAppCheckoutView({
  product,
  initialQuantity = 1,
  initialVariant,
  settings,
  onBack,
  onShowToast,
}: WhatsAppCheckoutViewProps) {
  const [qty, setQty] = useState(initialQuantity);
  const [selectedVariant, setSelectedVariant] = useState(initialVariant || product.variants?.[0] || 'Midnight Black');
  const [courierZone, setCourierZone] = useState<'Inside Dhaka' | 'Outside Dhaka'>('Inside Dhaka');
  
  const [customerName, setCustomerName] = useState('Rafiqul Islam');
  const [customerPhone, setCustomerPhone] = useState('1712889944');
  const [customerAddress, setCustomerAddress] = useState('House 24, Road 3, Mirpur 10, Dhaka');
  const [notes, setNotes] = useState('Please call before coming');

  const deliveryFee = courierZone === 'Inside Dhaka' ? settings.dhakaDeliveryFee : settings.outsideDhakaDeliveryFee;
  const subtotal = product.price * qty;
  const grandTotal = subtotal + deliveryFee;

  // Auto-compiled WhatsApp message
  const compiledMessage = useMemo(() => {
    const custName = customerName.trim() || 'Customer';
    const custPhone = customerPhone.trim() ? `+880 ${customerPhone.trim()}` : 'Pending';
    const custAddr = customerAddress.trim() || 'Delivery address will be provided in chat';
    const noteLine = notes.trim() ? `\n📝 *Notes:* ${notes.trim()}` : '';

    return `🛍️ *NEW ORDER - BAZAARHUB*
━━━━━━━━━━━━━━━━━━
📦 *Product:* ${product.name}
🏷️ *SKU:* ${product.sku}
🎨 *Variant:* ${selectedVariant}
🔢 *Qty:* ${qty}
💵 *Price:* ৳${subtotal.toLocaleString('en-US')}
🚚 *Delivery:* ৳${deliveryFee} (${courierZone})
💰 *Total Payable:* ৳${grandTotal.toLocaleString('en-US')} (Cash on Delivery)
━━━━━━━━━━━━━━━━━━
👤 *Customer:* ${custName}
📞 *Phone:* ${custPhone}
📍 *Address:* ${custAddr}${noteLine}
━━━━━━━━━━━━━━━━━━
Please confirm availability and dispatch today!`;
  }, [product, selectedVariant, qty, subtotal, deliveryFee, courierZone, customerName, customerPhone, customerAddress, notes]);

  const waCheckoutUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(compiledMessage)}`;

  const handleCopyMessage = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(compiledMessage);
      onShowToast('Order message copied to clipboard!');
    } else {
      onShowToast('Please select and copy the preview text.');
    }
  };

  return (
    <div className="flex flex-col w-full pb-28 max-w-2xl mx-auto px-4">
      {/* Trust Bar & Header Context */}
      <div className="pt-3 pb-2">
        <div className="flex items-center justify-between bg-[#f2f3ff] rounded-2xl p-3 border border-[#eaedff] shadow-xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006c4a] text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified_user
            </span>
            <div>
              <span className="font-mono text-[10px] text-[#006c4a] uppercase tracking-wider block font-bold">
                Official Fast Checkout
              </span>
              <span className="font-sans text-sm sm:text-base text-[#131b2e] font-bold leading-tight">
                Order via WhatsApp
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-[#82f5c1]/50 text-[#00714e] px-2.5 py-1 rounded-full border border-[#006c4a]/20">
            <span className="w-2 h-2 rounded-full bg-[#006c4a] animate-pulse"></span>
            <span className="font-mono text-xs font-bold">2 Min Reply</span>
          </div>
        </div>

        {/* Quick Trust Badges */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#eaedff] text-center border border-[#dae2fd]">
            <span className="material-symbols-outlined text-[#0037b0] text-[18px]">credit_card_off</span>
            <span className="font-mono text-[10px] text-[#434655] mt-0.5 font-semibold">No Card Needed</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#eaedff] text-center border border-[#dae2fd]">
            <span className="material-symbols-outlined text-[#006c4a] text-[18px]">payments</span>
            <span className="font-mono text-[10px] text-[#434655] mt-0.5 font-semibold">Cash on Delivery</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#eaedff] text-center border border-[#dae2fd]">
            <span className="material-symbols-outlined text-[#a33900] text-[18px]">visibility</span>
            <span className="font-mono text-[10px] text-[#434655] mt-0.5 font-semibold">Open-Box Check</span>
          </div>
        </div>
      </div>

      {/* Main Checkout Sections */}
      <div className="flex flex-col gap-4 mt-2">
        {/* 1. Order Summary Card */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-[#eaedff]">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#eaedff]">
            <span className="font-mono text-xs text-[#131b2e] font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#0037b0] text-[18px]">inventory_2</span>
              Selected Item
            </span>
            <span className="font-mono text-[11px] bg-[#dce1ff] text-[#001551] px-2 py-0.5 rounded-full font-bold">
              Verified Stock
            </span>
          </div>

          <div className="flex gap-3 items-start">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#eaedff] shrink-0 border border-[#eaedff]">
              <img
                src={product.image}
                alt={product.alt}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <h2 className="font-sans text-sm sm:text-base text-[#131b2e] font-bold truncate">
                {product.name}
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-mono text-[11px] text-[#747686]">SKU: {product.sku}</span>
                <span className="w-1 h-1 rounded-full bg-[#c4c5d7]"></span>
                <span className="font-mono text-[11px] text-[#006c4a] font-bold">In Dhaka Hub</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="font-mono text-base text-[#0037b0] font-bold">
                  ৳{product.price.toLocaleString('en-US')}
                </span>

                {/* Quantity Stepper */}
                <div className="flex items-center bg-[#eaedff] rounded-lg p-0.5">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-7 h-7 flex items-center justify-center rounded-md bg-white text-[#131b2e] hover:bg-[#faf8ff] transition-colors active:scale-95 shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">remove</span>
                  </button>
                  <span className="font-mono text-xs font-bold px-3 text-[#131b2e]">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.min(10, q + 1))}
                    className="w-7 h-7 flex items-center justify-center rounded-md bg-white text-[#131b2e] hover:bg-[#faf8ff] transition-colors active:scale-95 shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Variant Selection Chips */}
          {product.variants && product.variants.length > 0 && (
            <div className="mt-3 p-2.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff]">
              <span className="font-mono text-[11px] text-[#434655] block mb-1.5 font-semibold">
                Variant Selection:
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {product.variants.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setSelectedVariant(v)}
                    className={`font-mono text-xs px-2.5 py-1 rounded-full font-semibold transition-all ${
                      selectedVariant === v
                        ? 'bg-[#0037b0] text-white shadow-xs'
                        : 'bg-[#eaedff] text-[#131b2e] hover:bg-[#e2e7ff]'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Courier Zone Selector */}
          <div className="mt-4">
            <label className="font-mono text-xs text-[#434655] block mb-1.5 font-semibold">
              Select Courier Zone:
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#eaedff] rounded-xl">
              <button
                type="button"
                onClick={() => setCourierZone('Inside Dhaka')}
                className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg font-mono text-xs font-bold transition-all ${
                  courierZone === 'Inside Dhaka'
                    ? 'bg-white text-[#0037b0] shadow-sm'
                    : 'text-[#434655] hover:text-[#131b2e]'
                }`}
              >
                <span>Inside Dhaka</span>
                <span className="text-[10px] font-normal opacity-80">
                  ৳{settings.dhakaDeliveryFee} • 24-48 Hours
                </span>
              </button>

              <button
                type="button"
                onClick={() => setCourierZone('Outside Dhaka')}
                className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg font-mono text-xs font-bold transition-all ${
                  courierZone === 'Outside Dhaka'
                    ? 'bg-white text-[#0037b0] shadow-sm'
                    : 'text-[#434655] hover:text-[#131b2e]'
                }`}
              >
                <span>Outside Dhaka</span>
                <span className="text-[10px] font-normal opacity-80">
                  ৳{settings.outsideDhakaDeliveryFee} • 48-72 Hours
                </span>
              </button>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="mt-4 space-y-2 pt-2 border-t border-[#eaedff]">
            <div className="flex justify-between items-center text-[#434655] font-sans text-xs">
              <span>Subtotal ({qty} item{qty > 1 ? 's' : ''})</span>
              <span className="font-mono font-bold text-[#131b2e]">
                ৳{subtotal.toLocaleString('en-US')}
              </span>
            </div>
            <div className="flex justify-between items-center text-[#434655] font-sans text-xs">
              <span className="flex items-center gap-1">
                Delivery Charge
                <span className="text-[10px] bg-[#eaedff] px-1.5 py-0.5 rounded text-[#0037b0] font-mono">
                  {courierZone}
                </span>
              </span>
              <span className="font-mono text-[#131b2e]">৳{deliveryFee}</span>
            </div>
            <div className="flex justify-between items-center pt-2 mt-1 bg-[#f2f3ff] p-3 rounded-xl border border-[#eaedff]">
              <div>
                <span className="font-mono text-xs font-bold text-[#131b2e] block">Total Payable</span>
                <span className="font-mono text-[11px] text-[#006c4a] font-bold">Pay Cash Upon Delivery</span>
              </div>
              <span className="font-mono text-xl text-[#0037b0] font-extrabold">
                ৳{grandTotal.toLocaleString('en-US')}
              </span>
            </div>
          </div>
        </section>

        {/* 2. Customer Pre-fill Form */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-[#eaedff]">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#eaedff]">
            <span className="font-mono text-xs text-[#131b2e] font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#0037b0] text-[18px]">person_pin</span>
              Delivery Details
            </span>
            <span className="font-mono text-[10px] text-[#006c4a] bg-[#82f5c1]/40 px-2 py-0.5 rounded-full font-bold">
              Auto-compiles to WhatsApp
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="font-mono text-[11px] text-[#434655] block mb-1 font-semibold">
                Your Full Name
              </label>
              <div className="flex items-center bg-[#f2f3ff] rounded-xl px-3 py-2 border border-[#eaedff] focus-within:border-[#0037b0]">
                <span className="material-symbols-outlined text-[#747686] text-[18px] mr-2">badge</span>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Rafiqul Islam"
                  className="bg-transparent w-full text-[#131b2e] font-sans text-xs sm:text-sm focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-mono text-[11px] text-[#434655] block mb-1 font-semibold">
                WhatsApp / Contact Number
              </label>
              <div className="flex items-center bg-[#f2f3ff] rounded-xl px-3 py-2 border border-[#eaedff] focus-within:border-[#0037b0]">
                <span className="font-mono text-xs font-bold text-[#0037b0] mr-2">+880</span>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="1712345678"
                  className="bg-transparent w-full text-[#131b2e] font-mono text-xs sm:text-sm focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-mono text-[11px] text-[#434655] block mb-1 font-semibold">
                Full Delivery Address (House/Road, Area)
              </label>
              <div className="flex items-start bg-[#f2f3ff] rounded-xl px-3 py-2 border border-[#eaedff] focus-within:border-[#0037b0]">
                <span className="material-symbols-outlined text-[#747686] text-[18px] mr-2 mt-0.5">home_pin</span>
                <textarea
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="House 12, Road 4, Sector 7, Uttara, Dhaka"
                  rows={2}
                  className="bg-transparent w-full text-[#131b2e] font-sans text-xs sm:text-sm focus:outline-none resize-none"
                />
              </div>
            </div>

            <div>
              <label className="font-mono text-[11px] text-[#434655] block mb-1 font-semibold">
                Special Instruction (Optional)
              </label>
              <div className="flex items-center bg-[#f2f3ff] rounded-xl px-3 py-2 border border-[#eaedff] focus-within:border-[#0037b0]">
                <span className="material-symbols-outlined text-[#747686] text-[18px] mr-2">edit_note</span>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Please deliver after 5:00 PM"
                  className="bg-transparent w-full text-[#131b2e] font-sans text-xs sm:text-sm focus:outline-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 3. Live WhatsApp Chat Preview */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-[#eaedff]">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#eaedff]">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#006c4a] text-[18px]">chat_bubble</span>
              <span className="font-mono text-xs text-[#131b2e] font-bold">Live Message Preview</span>
            </div>
            <span className="font-mono text-[10px] text-[#747686]">Sends to BazaarHub Official</span>
          </div>

          {/* WhatsApp Mock Bubble */}
          <div className="bg-[#f2f3ff] rounded-2xl p-3 border border-[#eaedff]">
            <div className="flex items-center gap-2 mb-2 pb-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-[#eaedff]">
              <div className="w-6 h-6 rounded-full bg-[#82f5c1] flex items-center justify-center text-[#00714e]">
                <span className="material-symbols-outlined text-[14px]">support_agent</span>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-xs font-bold text-[#131b2e] flex items-center gap-1">
                  BazaarHub Verified Agent
                  <span className="material-symbols-outlined text-[#0037b0] text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                </span>
                <span className="font-mono text-[10px] text-[#006c4a] font-semibold">Online • Replies instantly</span>
              </div>
            </div>

            {/* Balloon */}
            <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-xs border border-[#eaedff] text-[#131b2e] font-mono text-[11px] leading-relaxed whitespace-pre-wrap select-all">
              {compiledMessage}
              <div className="flex justify-end items-center gap-1 mt-2 text-[10px] text-[#747686]">
                <span>Just now</span>
                <span className="material-symbols-outlined text-[14px] text-[#006c4a]">done_all</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Conversion Action Buttons */}
        <div className="flex flex-col gap-2">
          <a
            href={waCheckoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-14 bg-[#006c4a] hover:bg-[#005137] active:scale-[0.98] transition-all rounded-2xl shadow-lg flex items-center justify-center gap-2 text-white font-mono text-sm sm:text-base font-bold"
          >
            <span className="material-symbols-outlined text-[24px]">chat</span>
            <span>Open WhatsApp to Complete Order</span>
          </a>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleCopyMessage}
              className="h-11 bg-white hover:bg-[#faf8ff] active:scale-[0.98] text-[#131b2e] font-mono text-xs font-bold rounded-xl shadow-xs border border-[#eaedff] flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px] text-[#747686]">content_copy</span>
              <span>Copy Message</span>
            </button>
            <a
              href={`tel:+${settings.whatsappNumber}`}
              className="h-11 bg-white hover:bg-[#faf8ff] active:scale-[0.98] text-[#131b2e] font-mono text-xs font-bold rounded-xl shadow-xs border border-[#eaedff] flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px] text-[#0037b0]">call</span>
              <span>Call Helpline</span>
            </a>
          </div>
        </div>

        {/* 5. FAQ Accordions */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-[#eaedff]">
          <h3 className="font-mono text-xs font-bold text-[#131b2e] mb-3 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#0037b0] text-[18px]">help_center</span>
            Frequently Asked Questions
          </h3>

          <div className="space-y-2">
            <details className="group bg-[#f2f3ff] rounded-xl p-3 cursor-pointer border border-[#eaedff]" open>
              <summary className="flex items-center justify-between font-mono text-xs font-bold text-[#131b2e] select-none list-none">
                <span>How does WhatsApp checkout work?</span>
                <span className="material-symbols-outlined text-[#747686] group-open:rotate-180 transition-transform text-[18px]">
                  expand_more
                </span>
              </summary>
              <p className="font-sans text-xs text-[#434655] mt-2 leading-relaxed">
                Tapping the green button pre-fills your complete order into WhatsApp. Our verified representative instantly registers the parcel in our Dhaka dispatch hub without requiring advance payment.
              </p>
            </details>

            <details className="group bg-[#f2f3ff] rounded-xl p-3 cursor-pointer border border-[#eaedff]">
              <summary className="flex items-center justify-between font-mono text-xs font-bold text-[#131b2e] select-none list-none">
                <span>Can I inspect the parcel before paying?</span>
                <span className="material-symbols-outlined text-[#747686] group-open:rotate-180 transition-transform text-[18px]">
                  expand_more
                </span>
              </summary>
              <p className="font-sans text-xs text-[#434655] mt-2 leading-relaxed">
                Yes! All BazaarHub courier parcels include mandatory Open-Box Verification. You can turn on and check the item in front of the delivery rider before handing over cash.
              </p>
            </details>

            <details className="group bg-[#f2f3ff] rounded-xl p-3 cursor-pointer border border-[#eaedff]">
              <summary className="flex items-center justify-between font-mono text-xs font-bold text-[#131b2e] select-none list-none">
                <span>Can I pay via bKash or Nagad on delivery?</span>
                <span className="material-symbols-outlined text-[#747686] group-open:rotate-180 transition-transform text-[18px]">
                  expand_more
                </span>
              </summary>
              <p className="font-sans text-xs text-[#434655] mt-2 leading-relaxed">
                Absolutely. You can hand over cash or scan the courier rider’s official bKash/Nagad merchant QR code when your package arrives at your doorstep.
              </p>
            </details>
          </div>
        </section>
      </div>
    </div>
  );
}
