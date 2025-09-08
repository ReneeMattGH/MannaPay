import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Wallet, Subscription, Transaction, Platform, UserProfile, PaymentMethod, Currency } from '../types';

interface AppState {
  wallet: Wallet | null;
  subscriptions: Subscription[];
  transactions: Transaction[];
  userProfile: UserProfile | null;
  paymentMethods: PaymentMethod[];
  isConnected: boolean;
  selectedCurrency: Currency;
}

type AppAction =
  | { type: 'CONNECT_WALLET'; payload: Wallet }
  | { type: 'DISCONNECT_WALLET' }
  | { type: 'ADD_SUBSCRIPTION'; payload: Subscription }
  | { type: 'CANCEL_SUBSCRIPTION'; payload: string }
  | { type: 'PAUSE_SUBSCRIPTION'; payload: string }
  | { type: 'RESUME_SUBSCRIPTION'; payload: string }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_BALANCE'; payload: { currency: Currency; amount: number } }
  | { type: 'SET_CURRENCY'; payload: Currency }
  | { type: 'ADD_PAYMENT_METHOD'; payload: PaymentMethod }
  | { type: 'UPDATE_USER_PROFILE'; payload: Partial<UserProfile> }
  | { type: 'LOAD_SAVED_DATA' }
  | { type: 'SAVE_DATA' };

const initialState: AppState = {
  wallet: null,
  subscriptions: [],
  transactions: [],
  userProfile: null,
  paymentMethods: [],
  isConnected: false,
  selectedCurrency: 'USDC',
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'CONNECT_WALLET':
      return {
        ...state,
        wallet: action.payload,
        isConnected: true,
      };
    case 'DISCONNECT_WALLET':
      return {
        ...state,
        wallet: null,
        isConnected: false,
        subscriptions: [],
        transactions: [],
      };
    case 'ADD_SUBSCRIPTION':
      return {
        ...state,
        subscriptions: [...state.subscriptions, action.payload],
        wallet: state.wallet ? {
          ...state.wallet,
          balances: {
            ...state.wallet.balances,
            [action.payload.currency]: state.wallet.balances[action.payload.currency] - action.payload.price
          }
        } : null,
      };
    case 'CANCEL_SUBSCRIPTION':
      const subscription = state.subscriptions.find(sub => sub.id === action.payload);
      if (subscription && state.wallet) {
        const refundAmount = subscription.price * 0.8; // 80% refund
        return {
          ...state,
          subscriptions: state.subscriptions.map(sub =>
            sub.id === action.payload ? { ...sub, status: 'cancelled' as const } : sub
          ),
          wallet: {
            ...state.wallet,
            balances: {
              ...state.wallet.balances,
              [subscription.currency]: state.wallet.balances[subscription.currency] + refundAmount
            }
          },
        };
      }
      return state;
    case 'PAUSE_SUBSCRIPTION':
      return {
        ...state,
        subscriptions: state.subscriptions.map(sub =>
          sub.id === action.payload ? { ...sub, status: 'paused' as const } : sub
        ),
      };
    case 'RESUME_SUBSCRIPTION':
      return {
        ...state,
        subscriptions: state.subscriptions.map(sub =>
          sub.id === action.payload ? { ...sub, status: 'active' as const } : sub
        ),
      };
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };
    case 'UPDATE_BALANCE':
      return {
        ...state,
        wallet: state.wallet ? { 
          ...state.wallet, 
          balances: {
            ...state.wallet.balances,
            [action.payload.currency]: action.payload.amount
          }
        } : null,
      };
    case 'SET_CURRENCY':
      return {
        ...state,
        selectedCurrency: action.payload,
      };
    case 'ADD_PAYMENT_METHOD':
      return {
        ...state,
        paymentMethods: [...state.paymentMethods, action.payload],
      };
    case 'UPDATE_USER_PROFILE':
      return {
        ...state,
        userProfile: state.userProfile ? { ...state.userProfile, ...action.payload } : action.payload as UserProfile,
      };
    case 'LOAD_SAVED_DATA':
      const savedData = localStorage.getItem('mannapay_data');
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          // Convert date strings back to Date objects
          if (parsed.subscriptions) {
            parsed.subscriptions = parsed.subscriptions.map((sub: any) => ({
              ...sub,
              startDate: new Date(sub.startDate),
              endDate: new Date(sub.endDate),
              nextBillingDate: sub.nextBillingDate ? new Date(sub.nextBillingDate) : undefined,
              pausedUntil: sub.pausedUntil ? new Date(sub.pausedUntil) : undefined,
            }));
          }
          if (parsed.transactions) {
            parsed.transactions = parsed.transactions.map((tx: any) => ({
              ...tx,
              timestamp: new Date(tx.timestamp),
            }));
          }
          if (parsed.userProfile) {
            parsed.userProfile = {
              ...parsed.userProfile,
              createdAt: new Date(parsed.userProfile.createdAt),
              lastActive: new Date(parsed.userProfile.lastActive),
            };
          }
          return { ...state, ...parsed };
        } catch (error) {
          console.error('Failed to load saved data:', error);
        }
      }
      return state;
    case 'SAVE_DATA':
      const dataToSave = {
        wallet: state.wallet,
        subscriptions: state.subscriptions,
        transactions: state.transactions,
        userProfile: state.userProfile,
        paymentMethods: state.paymentMethods,
        selectedCurrency: state.selectedCurrency,
      };
      localStorage.setItem('mannapay_data', JSON.stringify(dataToSave));
      return state;
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Balance updates are now handled by individual components

  // Load saved data on mount
  useEffect(() => {
    dispatch({ type: 'LOAD_SAVED_DATA' });
  }, []);

  // Save data whenever state changes
  useEffect(() => {
    if (state.isConnected) {
      dispatch({ type: 'SAVE_DATA' });
    }
  }, [state.wallet, state.subscriptions, state.transactions, state.userProfile, state.paymentMethods, state.selectedCurrency]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
