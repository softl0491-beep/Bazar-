import { useState, useMemo } from 'react';
import { Product, StoreCategory, StoreSettings } from '../types';

interface AdminViewProps {
  products: Product[];
  categories: StoreCategory[];
  settings: StoreSettings;
  onUpdateProducts: (products: Product[]) => void;
  onUpdateCategories: (categories: StoreCategory[]) => void;
  onUpdateSettings: (settings: StoreSettings) => void;
  onShowToast: (msg: string) => void;
}

export default function AdminView({
  products,
  categories,
  settings,
  onUpdateProducts,
  onUpdateCategories,
  onUpdateSettings,
  onShowToast,
}: AdminViewProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'add' | 'categories' | 'settings'>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');

  // Form states for Add Item
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState('Electronics');
  const [newSku, setNewSku] = useState('BZH-NEW-882');
  const [newRegularPrice, setNewRegularPrice] = useState('1950');
  const [newSalePrice, setNewSalePrice] = useState('1450');
  const [newImageUrl, setNewImageUrl] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuCY71tZhlqyLu3yNWlGUmdaCLbkyxH0J1dMUVwivJFR2gaQo4wK7go7tPetTrD6eMNeY6oQ82iyQottsyjiKjH5eLyYxpx6VQ-4jWa3TkVtJqMBK0AVLlGw5sig3wMdnJWBe6K0ii1UGj2erxt2PXkE2LhnoJTA8vliOi_d1ZBo0NufnAJkhhPfjIaCPTc3PT-AZXVHKgasJbPohOF0CPRkj-u1mx69kNLdavVfXY1w7bLWqhlbxxKm');
  const [isNewFeatured, setIsNewFeatured] = useState(false);
  const [isNewFlash, setIsNewFlash] = useState(false);

  // Settings form states
  const [localStoreName, setLocalStoreName] = useState(settings.storeName);
  const [localWaNumber, setLocalWaNumber] = useState(settings.whatsappNumber);
  const [localDhakaFee, setLocalDhakaFee] = useState(settings.dhakaDeliveryFee);
  const [localOutsideDhakaFee, setLocalOutsideDhakaFee] = useState(settings.outsideDhakaDeliveryFee);
  const [localTicker, setLocalTicker] = useState(settings.tickerText);

  // Computed metrics
  const outOfStockCount = useMemo(() => products.filter((p) => !p.inStock).length, [products]);
  const flashCount = useMemo(() => products.filter((p) => p.flash).length, [products]);

  // Discount calculation for add form
  const computedDiscount = useMemo(() => {
    const reg = parseFloat(newRegularPrice) || 0;
    const sale = parseFloat(newSalePrice) || 0;
    if (reg > 0 && sale > 0 && sale < reg) {
      return Math.round(((reg - sale) / reg) * 100);
    }
    return 0;
  }, [newRegularPrice, newSalePrice]);

  // Toggle Store Online / Offline
  const toggleStoreOnline = () => {
    const nextStatus = !settings.isStoreOnline;
    onUpdateSettings({ ...settings, isStoreOnline: nextStatus });
    onShowToast(nextStatus ? 'Store is now Live and accepting orders!' : 'Store orders temporarily paused.');
  };

  // Toggle Stock for a product
  const handleToggleStock = (productId: number) => {
    const updated = products.map((p) => {
      if (p.id === productId) {
        const nextStock = !p.inStock;
        onShowToast(`${p.name} marked as ${nextStock ? 'In Stock' : 'Out of Stock'}`);
        return { ...p, inStock: nextStock };
      }
      return p;
    });
    onUpdateProducts(updated);
  };

  // Toggle Flash Badge
  const handleToggleBadge = (productId: number, badge: 'flash' | 'featured') => {
    const updated = products.map((p) => {
      if (p.id === productId) {
        const nextVal = badge === 'flash' ? !p.flash : !p.featured;
        onShowToast(`${badge === 'flash' ? 'Flash Deal' : 'Featured'} status updated`);
        return {
          ...p,
          [badge]: nextVal,
        };
      }
      return p;
    });
    onUpdateProducts(updated);
  };

  // Inline Price change
  const handlePriceChange = (productId: number, field: 'price' | 'regular', val: number) => {
    const updated = products.map((p) => {
      if (p.id === productId) {
        const nextP = { ...p, [field]: val };
        if (nextP.regular > 0 && nextP.price < nextP.regular) {
          nextP.discount = Math.round(((nextP.regular - nextP.price) / nextP.regular) * 100);
        }
        return nextP;
      }
      return p;
    });
    onUpdateProducts(updated);
    onShowToast(`Updated ${field === 'price' ? 'Sale' : 'Regular'} price to ৳${val}`);
  };

  // Delete product
  const handleDeleteProduct = (productId: number) => {
    const target = products.find((p) => p.id === productId);
    const updated = products.filter((p) => p.id !== productId);
    onUpdateProducts(updated);
    onShowToast(`Removed "${target?.name || 'Product'}" from catalog`);
  };

  // Auto SKU generator
  const handleGenerateSKU = () => {
    const num = Math.floor(100 + Math.random() * 900);
    const code = `BZH-PRD-${num}`;
    setNewSku(code);
    onShowToast(`Generated SKU: ${code}`);
  };

  // Handle Add Product Submit
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newProd: Product = {
      id: Date.now(),
      name: newName.trim(),
      sku: newSku.trim() || `BZH-${Date.now()}`,
      cat: newCat.toLowerCase(),
      regular: parseFloat(newRegularPrice) || 0,
      price: parseFloat(newSalePrice) || 0,
      discount: computedDiscount,
      rating: 5.0,
      reviews: 1,
      inStock: true,
      flash: isNewFlash,
      featured: isNewFeatured,
      alt: newName.trim(),
      image: newImageUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCY71tZhlqyLu3yNWlGUmdaCLbkyxH0J1dMUVwivJFR2gaQo4wK7go7tPetTrD6eMNeY6oQ82iyQottsyjiKjH5eLyYxpx6VQ-4jWa3TkVtJqMBK0AVLlGw5sig3wMdnJWBe6K0ii1UGj2erxt2PXkE2LhnoJTA8vliOi_d1ZBo0NufnAJkhhPfjIaCPTc3PT-AZXVHKgasJbPohOF0CPRkj-u1mx69kNLdavVfXY1w7bLWqhlbxxKm',
      variants: ['Standard Option'],
      description: 'Authentic imported merchandise with 6-month seller warranty and fast Dhaka dispatch.'
    };

    onUpdateProducts([newProd, ...products]);
    onShowToast(`Published "${newProd.name}" to store catalog!`);
    setNewName('');
    setActiveTab('products');
  };

  // Save Store Settings
  const handleSaveSettings = () => {
    onUpdateSettings({
      ...settings,
      storeName: localStoreName,
      whatsappNumber: localWaNumber,
      dhakaDeliveryFee: Number(localDhakaFee),
      outsideDhakaDeliveryFee: Number(localOutsideDhakaFee),
      tickerText: localTicker,
    });
    onShowToast('Store settings & delivery rates saved successfully!');
  };

  // Test WhatsApp ping
  const handleTestPing = () => {
    const cleanNum = localWaNumber.replace(/[^0-9]/g, '');
    const fullNum = cleanNum.startsWith('880') ? cleanNum : `880${cleanNum}`;
    window.open(`https://wa.me/${fullNum}?text=Hello%20BazaarHub%20Store%20Manager%2C%20system%20test%20ping%20successful!`, '_blank');
    onShowToast('Opening WhatsApp test channel...');
  };

  // Filter products for admin table
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchCat = selectedCat === 'All' || item.cat.toLowerCase().includes(selectedCat.toLowerCase());
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        q === '' ||
        item.name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.cat.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [products, selectedCat, searchQuery]);

  return (
    <div className="flex flex-col w-full pb-28 max-w-2xl mx-auto px-4 space-y-4 pt-2">
      {/* Admin Live Status Banner */}
      <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-[#eaedff] flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative flex h-3.5 w-3.5 shrink-0">
            {settings.isStoreOnline && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#006c4a] opacity-75"></span>
            )}
            <span
              className={`relative inline-flex rounded-full h-3.5 w-3.5 ${
                settings.isStoreOnline ? 'bg-[#006c4a]' : 'bg-[#ba1a1a]'
              }`}
            ></span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-mono text-xs text-[#131b2e] truncate font-bold">Store Status</span>
            <span
              className={`font-sans text-xs font-semibold truncate ${
                settings.isStoreOnline ? 'text-[#006c4a]' : 'text-[#ba1a1a]'
              }`}
            >
              {settings.isStoreOnline ? 'Active & Accepting Orders' : 'Store Paused (Offline)'}
            </span>
          </div>
        </div>

        <button
          onClick={toggleStoreOnline}
          className={`px-3 py-1.5 rounded-full font-mono text-xs font-bold active:scale-95 transition-transform flex items-center gap-1 shadow-xs ${
            settings.isStoreOnline
              ? 'bg-[#82f5c1] text-[#00714e]'
              : 'bg-[#ffdad6] text-[#93000a]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">power_settings_new</span>
          <span>{settings.isStoreOnline ? 'Online' : 'Offline'}</span>
        </button>
      </div>

      {/* Metric Quick Stats */}
      <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4">
        {/* Stat 1 */}
        <div className="min-w-[130px] flex-1 bg-white p-3 rounded-2xl shadow-sm border border-[#eaedff] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#434655]">
            <span className="font-mono text-[11px] font-semibold">Catalog</span>
            <span className="material-symbols-outlined text-[18px] text-[#0037b0]">inventory_2</span>
          </div>
          <div className="mt-2">
            <span className="font-mono text-xl font-bold text-[#131b2e]">{products.length}</span>
            <p className="font-sans text-[10px] text-[#434655]">Total Items</p>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="min-w-[130px] flex-1 bg-white p-3 rounded-2xl shadow-sm border border-[#eaedff] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#00714e]">
            <span className="font-mono text-[11px] font-semibold">Orders (Today)</span>
            <span className="material-symbols-outlined text-[18px] text-[#006c4a]">chat_bubble</span>
          </div>
          <div className="mt-2">
            <span className="font-mono text-xl font-bold text-[#006c4a]">38</span>
            <p className="font-sans text-[10px] text-[#434655]">via WhatsApp</p>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="min-w-[130px] flex-1 bg-white p-3 rounded-2xl shadow-sm border border-[#eaedff] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#ba1a1a]">
            <span className="font-mono text-[11px] font-semibold">Stock Alert</span>
            <span className="material-symbols-outlined text-[18px]">warning</span>
          </div>
          <div className="mt-2">
            <span className="font-mono text-xl font-bold text-[#ba1a1a]">{outOfStockCount}</span>
            <p className="font-sans text-[10px] text-[#434655]">Out of Stock</p>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="min-w-[130px] flex-1 bg-white p-3 rounded-2xl shadow-sm border border-[#eaedff] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#7c2900]">
            <span className="font-mono text-[11px] font-semibold">Flash Deals</span>
            <span className="material-symbols-outlined text-[18px]">local_fire_department</span>
          </div>
          <div className="mt-2">
            <span className="font-mono text-xl font-bold text-[#7c2900]">{flashCount}</span>
            <p className="font-sans text-[10px] text-[#434655]">Active Promos</p>
          </div>
        </div>
      </div>

      {/* Segmented Navigation Bar */}
      <div className="w-full bg-[#eaedff] p-1 rounded-2xl flex gap-1 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex-1 min-w-[75px] py-2 text-center rounded-xl font-mono text-xs transition-all ${
            activeTab === 'products'
              ? 'bg-white text-[#0037b0] font-bold shadow-xs'
              : 'text-[#434655] hover:text-[#131b2e]'
          }`}
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab('add')}
          className={`flex-1 min-w-[90px] py-2 text-center rounded-xl font-mono text-xs transition-all ${
            activeTab === 'add'
              ? 'bg-white text-[#0037b0] font-bold shadow-xs'
              : 'text-[#434655] hover:text-[#131b2e]'
          }`}
        >
          + Add Item
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex-1 min-w-[80px] py-2 text-center rounded-xl font-mono text-xs transition-all ${
            activeTab === 'categories'
              ? 'bg-white text-[#0037b0] font-bold shadow-xs'
              : 'text-[#434655] hover:text-[#131b2e]'
          }`}
        >
          Categories
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 min-w-[100px] py-2 text-center rounded-xl font-mono text-xs transition-all ${
            activeTab === 'settings'
              ? 'bg-white text-[#0037b0] font-bold shadow-xs'
              : 'text-[#434655] hover:text-[#131b2e]'
          }`}
        >
          Store Settings
        </button>
      </div>

      {/* TAB 1: PRODUCT MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="flex flex-col space-y-3">
          {/* Search and Category Filter */}
          <div className="flex flex-col gap-2">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[20px] text-[#747686]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, SKU, or category..."
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-white text-[#131b2e] font-sans text-xs sm:text-sm placeholder:text-[#747686] focus:outline-none shadow-xs border border-[#eaedff]"
              />
            </div>

            <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
              {['All', 'Gadgets', 'Fashion', 'Home', 'Groceries'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={`px-3 py-1 rounded-full font-mono text-xs whitespace-nowrap transition-all ${
                    selectedCat === cat
                      ? 'bg-[#0037b0] text-white font-bold shadow-xs'
                      : 'bg-[#eaedff] text-[#434655] hover:bg-[#e2e7ff]'
                  }`}
                >
                  {cat} {cat === 'All' && `(${products.length})`}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards List */}
          <div className="flex flex-col space-y-3">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className={`bg-white p-3 rounded-2xl shadow-sm border border-[#eaedff] flex flex-col space-y-2 transition-opacity ${
                  !p.inStock ? 'opacity-75' : ''
                }`}
              >
                <div className="flex gap-3">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-[#eaedff] border border-[#eaedff]">
                    <img src={p.image} alt={p.alt} className="w-full h-full object-cover" />
                    {p.flash && (
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-[#7c2900] text-white font-mono text-[9px] font-bold">
                        Sale
                      </span>
                    )}
                    {!p.inStock && (
                      <span className="absolute inset-0 bg-black/60 flex items-center justify-center font-mono text-[10px] text-white font-bold">
                        Sold Out
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-1">
                      <div className="min-w-0">
                        <span className="font-mono text-[10px] text-[#0037b0] uppercase font-bold tracking-wider">
                          {p.cat}
                        </span>
                        <h3 className="font-sans text-xs sm:text-sm font-bold text-[#131b2e] truncate">
                          {p.name}
                        </h3>
                        <p className="font-mono text-[11px] text-[#747686]">SKU: {p.sku}</p>
                      </div>

                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="text-[#747686] hover:text-[#ba1a1a] p-1 transition-colors"
                        title="Delete product"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>

                    {/* Price Inline Editing */}
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center bg-[#eaedff] px-2 py-0.5 rounded-lg border border-[#dae2fd]">
                        <span className="font-mono text-xs text-[#0037b0] mr-1 font-bold">৳</span>
                        <input
                          type="number"
                          value={p.price}
                          onChange={(e) => handlePriceChange(p.id, 'price', Number(e.target.value))}
                          className="w-16 bg-transparent font-mono text-xs text-[#0037b0] focus:outline-none font-bold"
                        />
                      </div>
                      <div className="flex items-center bg-[#f2f3ff] px-2 py-0.5 rounded-lg border border-[#eaedff]">
                        <span className="font-mono text-xs text-[#747686] mr-1">৳</span>
                        <input
                          type="number"
                          value={p.regular}
                          onChange={(e) => handlePriceChange(p.id, 'regular', Number(e.target.value))}
                          className="w-16 bg-transparent font-mono text-xs text-[#747686] line-through focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Controls Row */}
                <div className="pt-2 flex items-center justify-between border-t border-[#eaedff]">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggleBadge(p.id, 'flash')}
                      className={`px-2 py-1 rounded-md font-mono text-[11px] flex items-center gap-0.5 active:scale-95 transition-all ${
                        p.flash
                          ? 'bg-[#ffdbce] text-[#370e00] font-bold'
                          : 'bg-[#eaedff] text-[#434655]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[13px]">bolt</span> Flash
                    </button>
                    <button
                      onClick={() => handleToggleBadge(p.id, 'featured')}
                      className={`px-2 py-1 rounded-md font-mono text-[11px] flex items-center gap-0.5 active:scale-95 transition-all ${
                        p.featured
                          ? 'bg-[#85f8c4] text-[#002114] font-bold'
                          : 'bg-[#eaedff] text-[#434655]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[13px]">star</span> Featured
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono text-[11px] font-bold ${
                        p.inStock ? 'text-[#006c4a]' : 'text-[#ba1a1a]'
                      }`}
                    >
                      {p.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                    <button
                      onClick={() => handleToggleStock(p.id)}
                      className={`w-9 h-5 rounded-full relative p-0.5 transition-colors cursor-pointer ${
                        p.inStock ? 'bg-[#006c4a]' : 'bg-[#c4c5d7]'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full shadow-xs transition-transform ${
                          p.inStock ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      ></div>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ADD PRODUCT FORM */}
      {activeTab === 'add' && (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#eaedff] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#eaedff]">
            <div>
              <h2 className="font-sans text-base font-bold text-[#131b2e]">Publish New Product</h2>
              <p className="font-sans text-xs text-[#434655]">
                Instant sync with WhatsApp catalog and storefront
              </p>
            </div>
            <button
              type="button"
              onClick={handleGenerateSKU}
              className="px-2.5 py-1.5 rounded-lg bg-[#eaedff] hover:bg-[#e2e7ff] text-[#0037b0] font-mono text-xs font-semibold flex items-center gap-1 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[16px]">autorenew</span> Auto SKU
            </button>
          </div>

          <form className="space-y-3" onSubmit={handleAddProduct}>
            <div>
              <label className="font-mono text-xs text-[#131b2e] font-semibold block mb-1">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Premium Basmati Rice (5kg)"
                className="w-full h-11 px-3 rounded-xl bg-[#f2f3ff] text-[#131b2e] font-sans text-xs sm:text-sm focus:outline-none border border-[#eaedff] focus:border-[#0037b0]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-mono text-xs text-[#131b2e] font-semibold block mb-1">
                  Category
                </label>
                <select
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#f2f3ff] text-[#131b2e] font-mono text-xs focus:outline-none border border-[#eaedff]"
                >
                  <option value="Gadgets">Gadgets</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Home">Home & Kitchen</option>
                  <option value="Groceries">Groceries</option>
                  <option value="Sports">Sports & Fitness</option>
                  <option value="Beauty">Beauty & Care</option>
                </select>
              </div>

              <div>
                <label className="font-mono text-xs text-[#131b2e] font-semibold block mb-1">
                  SKU Identifier
                </label>
                <input
                  type="text"
                  value={newSku}
                  onChange={(e) => setNewSku(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#f2f3ff] text-[#131b2e] font-mono text-xs focus:outline-none border border-[#eaedff]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-mono text-xs text-[#131b2e] font-semibold block mb-1">
                  Regular Price (৳)
                </label>
                <input
                  type="number"
                  required
                  value={newRegularPrice}
                  onChange={(e) => setNewRegularPrice(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#f2f3ff] text-[#131b2e] font-mono text-xs focus:outline-none border border-[#eaedff]"
                />
              </div>

              <div>
                <label className="font-mono text-xs text-[#131b2e] font-semibold block mb-1">
                  Sale Price (৳)
                </label>
                <input
                  type="number"
                  required
                  value={newSalePrice}
                  onChange={(e) => setNewSalePrice(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#f2f3ff] text-[#131b2e] font-mono text-xs focus:outline-none border border-[#eaedff]"
                />
              </div>
            </div>

            {/* Computed Discount */}
            <div className="p-2.5 px-3 rounded-xl bg-[#eaedff] flex items-center justify-between">
              <span className="font-sans text-xs text-[#434655]">Computed Customer Discount:</span>
              <span className="font-mono text-xs text-[#7c2900] font-bold">
                {computedDiscount > 0 ? `${computedDiscount}% Off (Save ৳${parseFloat(newRegularPrice) - parseFloat(newSalePrice)})` : '0% Off'}
              </span>
            </div>

            <div>
              <label className="font-mono text-xs text-[#131b2e] font-semibold block mb-1">
                Product Image URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-1 h-11 px-3 rounded-xl bg-[#f2f3ff] text-[#131b2e] font-mono text-xs focus:outline-none border border-[#eaedff] truncate"
                />
                <button
                  type="button"
                  onClick={() => onShowToast('Image URL confirmed')}
                  className="px-3 rounded-xl bg-[#eaedff] hover:bg-[#e2e7ff] text-[#131b2e] font-mono text-xs flex items-center"
                >
                  <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 py-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isNewFeatured}
                  onChange={(e) => setIsNewFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0037b0]"
                />
                <span className="font-mono text-xs text-[#131b2e]">Mark as Featured</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isNewFlash}
                  onChange={(e) => setIsNewFlash(e.target.checked)}
                  className="w-4 h-4 rounded text-[#7c2900]"
                />
                <span className="font-mono text-xs text-[#131b2e]">Flash Deal Promo</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full h-12 mt-2 rounded-xl bg-[#0037b0] hover:bg-[#1d4ed8] text-white font-mono text-sm font-bold shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">cloud_upload</span>
              <span>Save & Publish Item</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: CATEGORIES MANAGEMENT */}
      {activeTab === 'categories' && (
        <div className="flex flex-col space-y-3">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#eaedff] flex items-center justify-between">
            <div>
              <h2 className="font-sans text-base font-bold text-[#131b2e]">Store Categories</h2>
              <p className="font-sans text-xs text-[#434655]">
                {categories.length} Live Categories in Navigation
              </p>
            </div>
            <button
              onClick={() => {
                const name = prompt('Enter new category name:');
                if (name && name.trim()) {
                  const newC: StoreCategory = {
                    id: name.toLowerCase().replace(/\s+/g, '-'),
                    name: name.trim(),
                    icon: 'category',
                    count: 0,
                    active: true,
                  };
                  onUpdateCategories([...categories, newC]);
                  onShowToast(`Category "${name}" created!`);
                }
              }}
              className="p-2 rounded-xl bg-[#0037b0] text-white active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
            </button>
          </div>

          <div className="space-y-2">
            {categories.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-3 bg-white rounded-2xl shadow-xs border border-[#eaedff]"
              >
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-[#eaedff] flex items-center justify-center text-[#0037b0]">
                    <span className="material-symbols-outlined text-[22px]">{c.icon}</span>
                  </span>
                  <div>
                    <h4 className="font-sans text-xs sm:text-sm font-bold text-[#131b2e]">{c.name}</h4>
                    <span className="font-mono text-[11px] text-[#747686]">{c.count} Products</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-[#85f8c4] text-[#002114] font-mono text-[10px] font-bold">
                    Active
                  </span>
                  <button
                    onClick={() => onShowToast(`Reordered "${c.name}" priority`)}
                    className="p-1 text-[#747686] hover:text-[#0037b0]"
                  >
                    <span className="material-symbols-outlined text-[18px]">drag_handle</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: STORE SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#eaedff] space-y-4">
          <div>
            <h2 className="font-sans text-base font-bold text-[#131b2e]">Store & WhatsApp Setup</h2>
            <p className="font-sans text-xs text-[#434655]">
              Manage order dispatch routing & buyer policies
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="font-mono text-xs text-[#131b2e] font-semibold block mb-1">
                Marketplace Store Name
              </label>
              <input
                type="text"
                value={localStoreName}
                onChange={(e) => setLocalStoreName(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-[#f2f3ff] text-[#131b2e] font-sans text-xs sm:text-sm focus:outline-none border border-[#eaedff]"
              />
            </div>

            <div>
              <label className="font-mono text-xs text-[#131b2e] font-semibold block mb-1">
                Primary WhatsApp Business Number
              </label>
              <div className="flex gap-2">
                <div className="flex-1 flex items-center bg-[#f2f3ff] rounded-xl px-3 border border-[#eaedff]">
                  <span className="font-mono text-xs text-[#006c4a] font-bold mr-2">🇧🇩 +880</span>
                  <input
                    type="text"
                    value={localWaNumber.replace(/^880/, '')}
                    onChange={(e) => setLocalWaNumber(`880${e.target.value.replace(/[^0-9]/g, '')}`)}
                    className="flex-1 bg-transparent font-mono text-xs text-[#131b2e] focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleTestPing}
                  className="px-3 rounded-xl bg-[#006c4a] hover:bg-[#005137] text-white font-mono text-xs font-bold flex items-center gap-1 active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-[16px]">send</span> Test Ping
                </button>
              </div>
              <p className="font-sans text-[11px] text-[#747686] mt-1">
                All buyer checkout prompts initiate a chat with this line.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-mono text-xs text-[#131b2e] font-semibold block mb-1">
                  Inside Dhaka (৳)
                </label>
                <input
                  type="number"
                  value={localDhakaFee}
                  onChange={(e) => setLocalDhakaFee(Number(e.target.value))}
                  className="w-full h-11 px-3 rounded-xl bg-[#f2f3ff] text-[#131b2e] font-mono text-xs focus:outline-none border border-[#eaedff]"
                />
              </div>

              <div>
                <label className="font-mono text-xs text-[#131b2e] font-semibold block mb-1">
                  Outside Dhaka (৳)
                </label>
                <input
                  type="number"
                  value={localOutsideDhakaFee}
                  onChange={(e) => setLocalOutsideDhakaFee(Number(e.target.value))}
                  className="w-full h-11 px-3 rounded-xl bg-[#f2f3ff] text-[#131b2e] font-mono text-xs focus:outline-none border border-[#eaedff]"
                />
              </div>
            </div>

            <div>
              <label className="font-mono text-xs text-[#131b2e] font-semibold block mb-1">
                Top Header Ticker Broadcast
              </label>
              <textarea
                value={localTicker}
                onChange={(e) => setLocalTicker(e.target.value)}
                rows={2}
                className="w-full p-2.5 rounded-xl bg-[#f2f3ff] text-[#131b2e] font-sans text-xs focus:outline-none resize-none border border-[#eaedff]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-mono text-xs text-[#131b2e] font-semibold block mb-1">
                  Currency Code
                </label>
                <input
                  type="text"
                  disabled
                  value="BDT (৳)"
                  className="w-full h-11 px-3 rounded-xl bg-[#eaedff] text-[#434655] font-mono text-xs"
                />
              </div>

              <div>
                <label className="font-mono text-xs text-[#131b2e] font-semibold block mb-1">
                  Payment Methods
                </label>
                <input
                  type="text"
                  disabled
                  value="COD + bKash / Nagad"
                  className="w-full h-11 px-3 rounded-xl bg-[#eaedff] text-[#434655] font-mono text-xs"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveSettings}
              className="w-full h-12 rounded-xl bg-[#0037b0] hover:bg-[#1d4ed8] text-white font-mono text-sm font-bold shadow-md active:scale-[0.98] transition-all mt-2"
            >
              Save Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
