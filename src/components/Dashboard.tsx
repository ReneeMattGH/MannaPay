import React, { useEffect } from 'react';
import { Wallet, LogOut, Settings, Bell, CreditCard } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { testnetService } from '../services/testnetService';
import PlatformCard from './PlatformCard';
import ActiveSubscriptions from './ActiveSubscriptions';
import TransactionHistory from './TransactionHistory';

const Dashboard: React.FC = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  const handleDisconnect = () => {
    dispatch({ type: 'DISCONNECT_WALLET' });
  };

  
  useEffect(() => {
    const updateBalance = async () => {
      if (state.isConnected && state.wallet) {
        try {
          const balances = await testnetService.getBalance(state.wallet.address);
          dispatch({
            type: 'UPDATE_BALANCE',
            payload: { currency: 'USDC', amount: balances.USDC }
          });
        } catch (error) {
          console.error('Failed to update balance:', error);
        }
      }
    };
    updateBalance();
    const interval = setInterval(updateBalance, 30000);

    return () => clearInterval(interval);
  }, [state.isConnected, state.wallet, dispatch]);

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="bg-card-bg border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            
            <span className="text-2xl font-bold text-white">MannaPay</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/subscriptions')}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="My Subscriptions"
            >
              <CreditCard className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button 
              onClick={() => navigate('/settings')}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={handleDisconnect}
              className="p-2 text-gray-400 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Wallet Info */}
        <div className="card card-hover mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Wallet Balance</h2>
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-4xl font-bold text-gradient">
                  {state.wallet?.balances.USDC?.toFixed(2) || '0.00'} USDC
                </div>
                <div className="text-gray-400 text-lg">
                  ≈ ${state.wallet?.balances.USDC?.toFixed(2) || '0.00'} USD
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {state.wallet?.balances && Object.entries(state.wallet.balances).map(([currency, balance]) => (
                  <div key={currency} className={`text-center p-3 rounded-lg ${
                    currency === 'USDC' ? 'bg-accent/10 border border-accent/20' : 'bg-gray-800'
                  }`}>
                    <div className="text-lg font-semibold text-white">{balance.toFixed(2)}</div>
                    <div className="text-sm text-gray-400">{currency}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400 mb-1">Wallet Address</div>
              <div className="text-sm text-white font-mono bg-gray-800 px-3 py-2 rounded-lg">
                {state.wallet?.address}
              </div>
            </div>
          </div>
        </div>

        {/* Platform Cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Available Platforms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <PlatformCard platform="netflix" />
            <PlatformCard platform="spotify" />
            <PlatformCard platform="youtube" />
            <PlatformCard platform="disney" />
            <PlatformCard platform="prime" />
            <PlatformCard platform="adobe" />
            <PlatformCard platform="microsoft" />
            <PlatformCard platform="notion" />
            <PlatformCard platform="steam" />
            <PlatformCard platform="coursera" />
          </div>
        </div>

        {/* Active Subscriptions */}
        <div className="mb-8">
          <ActiveSubscriptions />
        </div>

        {/* Transaction History */}
        <div>
          <TransactionHistory />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
