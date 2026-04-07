export type Language = 'en' | 'it';

export type PaymentMethod = 'BTC' | 'LTC' | 'ETH' | 'XMR' | 'TON' | 'USDT' | 'SOL';

export type ProductType = 'Reserved Handle' | 'Vanity Link' | 'Access Package' | 'License Drop';

export interface Product {
  id: string;
  title: string;
  platform: string;
  category: ProductType;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  meaningLanguage: 'English' | 'Italian' | 'Universal';
  priceUsd: number;
  featured: boolean;
  status: 'draft' | 'published' | 'hidden';
  tags: string[];
  shortDescription: string;
  deliveryDescription: string;
  previewDetails: string[];
  stockAvailable: number;
  createdAt: string;
}

export interface DashboardStats {
  totalRevenueUsd: number;
  totalOrders: number;
  paidOrders: number;
  lowStockProducts: number;
}

export interface AdminSettings {
  brandName: string;
  heroLabel: string;
  supportEmail: string;
  payments: PaymentMethod[];
}

export interface Order {
  id: string;
  publicId: string;
  customerEmail: string;
  productId: string;
  productTitle: string;
  paymentMethod: PaymentMethod;
  totalUsd: number;
  status: 'awaiting_payment' | 'paid' | 'delivered' | 'cancelled';
  createdAt: string;
  deliveredAt?: string;
  delivery?: {
    accessId?: string;
    secret?: string;
    email?: string;
    emailSecret?: string;
    note?: string;
  };
}

export interface InventoryEntryInput {
  accessId: string;
  secret: string;
  email: string;
  emailSecret: string;
  note: string;
}
