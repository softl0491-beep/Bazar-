/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ActiveTab, Product, StoreCategory, StoreSettings } from './types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SETTINGS } from './data/products';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import WhatsAppDrawer from './components/WhatsAppDrawer';
import Toast from './components/Toast';

import StoreView from './views/StoreView';
import ProductDetailView from './views/ProductDetailView';
import WhatsAppCheckoutView from './views/WhatsAppCheckoutView';
import AdminView from './views/AdminView';
import DealsView from './views/DealsView';
import CategoriesView from './views/CategoriesView';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ActiveTab>('store');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<StoreCategory[]>(INITIAL_CATEGORIES);
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);

  // Active product for PDP and Checkout
  const [selectedProduct, setSelectedProduct] = useState<Product>(INITIAL_PRODUCTS[1]); // T900 Ultra 2
  const [checkoutQuantity, setCheckoutQuantity] = useState<number>(1);
  const [checkoutVariant, setCheckoutVariant] = useState<string>('Midnight Black');

  // Quick WhatsApp Drawer state
  const [drawerProduct, setDrawerProduct] = useState<Product | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentTab('pdp');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickOrder = (product: Product) => {
    setDrawerProduct(product);
    setIsDrawerOpen(true);
  };

  const handleOpenFullCheckout = (product: Product, quantity = 1, variant = 'Midnight Black') => {
    setSelectedProduct(product);
    setCheckoutQuantity(quantity);
    setCheckoutVariant(variant);
    setIsDrawerOpen(false);
    setCurrentTab('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] font-sans antialiased flex flex-col selection:bg-[#cad3ff] selection:text-[#001551]">
      {/* Persistent App Header */}
      <Header
        currentTab={currentTab}
        onNavigate={setCurrentTab}
        settings={settings}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full pt-20">
        {currentTab === 'store' && (
          <StoreView
            products={products}
            settings={settings}
            onOpenProduct={handleOpenProduct}
            onQuickOrder={handleQuickOrder}
          />
        )}

        {currentTab === 'pdp' && selectedProduct && (
          <ProductDetailView
            product={selectedProduct}
            settings={settings}
            onBack={() => setCurrentTab('store')}
            onShowToast={showToast}
            onOpenCheckout={handleOpenFullCheckout}
          />
        )}

        {currentTab === 'checkout' && selectedProduct && (
          <WhatsAppCheckoutView
            product={selectedProduct}
            initialQuantity={checkoutQuantity}
            initialVariant={checkoutVariant}
            settings={settings}
            onBack={() => setCurrentTab('store')}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'deals' && (
          <DealsView
            products={products}
            onOpenProduct={handleOpenProduct}
            onQuickOrder={handleQuickOrder}
          />
        )}

        {currentTab === 'categories' && (
          <CategoriesView
            categories={categories}
            products={products}
            onSelectCategory={(catId) => {
              setCurrentTab('store');
            }}
            onOpenProduct={handleOpenProduct}
          />
        )}

        {currentTab === 'admin' && (
          <AdminView
            products={products}
            categories={categories}
            settings={settings}
            onUpdateProducts={setProducts}
            onUpdateCategories={setCategories}
            onUpdateSettings={setSettings}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onNavigate={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Quick WhatsApp Drawer Modal */}
      <WhatsAppDrawer
        product={drawerProduct}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        settings={settings}
        onOpenFullCheckout={handleOpenFullCheckout}
      />

      {/* Global Toast Notification */}
      <Toast message={toastMessage} />
    </div>
  );
}
