export type ActiveTab = 'store' | 'categories' | 'deals' | 'admin' | 'pdp' | 'checkout';

export interface Product {
  id: number;
  name: string;
  sku: string;
  cat: string;
  price: number;
  regular: number;
  discount: number;
  rating: number;
  reviews: number;
  inStock: boolean;
  flash: boolean;
  featured?: boolean;
  alt: string;
  image: string;
  gallery?: string[];
  description?: string;
  variants?: string[];
}

export interface StoreCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
  active: boolean;
}

export interface StoreSettings {
  storeName: string;
  whatsappNumber: string;
  dhakaDeliveryFee: number;
  outsideDhakaDeliveryFee: number;
  tickerText: string;
  isStoreOnline: boolean;
  currencySymbol: string;
}

export interface OrderDetails {
  product: Product;
  variant: string;
  quantity: number;
  courierZone: 'Inside Dhaka' | 'Outside Dhaka';
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  notes?: string;
}
