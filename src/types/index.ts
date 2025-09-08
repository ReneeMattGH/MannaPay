export type Currency = 'BTC' | 'ETH' | 'USDT' | 'USDC' | 'DAI';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'paused' | 'pending';
export type TransactionType = 'subscription' | 'refund' | 'withdrawal' | 'deposit' | 'auto_renewal';
export type PlanType = 'Basic' | 'Standard' | 'Premium' | 'Pro' | 'Enterprise';

export interface Wallet {
  address: string;
  balance: number;
  currency: Currency;
  balances: Record<Currency, number>;
}

export interface Subscription {
  id: string;
  platform: string;
  plan: PlanType;
  duration: number; // in months
  startDate: Date;
  endDate: Date;
  price: number;
  currency: Currency;
  status: SubscriptionStatus;
  autoRenew: boolean;
  credentials?: {
    email: string;
    username?: string;
  };
  nextBillingDate?: Date;
  pausedUntil?: Date;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  platform?: string;
  amount: number;
  currency: Currency;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
  hash?: string; // blockchain transaction hash
  description?: string;
}

export interface Platform {
  id: string;
  name: string;
  logo: string;
  color: string;
  category: 'streaming' | 'software' | 'productivity' | 'gaming' | 'education' | 'news';
  description: string;
  features: string[];
  plans: Partial<Record<PlanType, {
    price: number;
    
    currency: Currency;
    features: string[];
    maxDevices?: number;
    quality?: string;
  }>>;
  supportedCurrencies: Currency[];
  autoRenewalSupported: boolean;
  pauseSupported: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  preferences: {
    defaultCurrency: Currency;
    autoRenewal: boolean;
    notifications: {
      email: boolean;
      push: boolean;
      billing: boolean;
    };
  };
  createdAt: Date;
  lastActive: Date;
}

export interface PaymentMethod {
  id: string;
  type: 'wallet' | 'card' | 'bank';
  name: string;
  currency: Currency;
  address?: string;
  last4?: string;
  isDefault: boolean;
}
