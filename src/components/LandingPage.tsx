import React, { useEffect } from 'react';
import { Wallet, Zap, Shield, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { testnetService } from '../services/testnetService';

const LandingPage: React.FC = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (state.isConnected) {
      navigate('/dashboard');
    }
  }, [state.isConnected, navigate]);

  const handleConnectWallet = async () => {
    try {
      const walletInfo = await testnetService.connectWallet();
      if (walletInfo) {
        dispatch({ type: 'CONNECT_WALLET', payload: walletInfo });
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      {/* Header */}
      <header className="px-6 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            
            <span className="text-3xl font-bold text-white">MannaPay</span>
          </div>
          
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight">
            Pay for
            <span className="text-gradient block">Subscriptions</span>
            with USDC
          </h1>
          <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            MannaPay - Your Wallet. Your control.

          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <button
              onClick={handleConnectWallet}
              className="px-12 py-4 text-xl font-semibold text-orange-500 border-2 border-transparent rounded transition duration-300 hover:border-white hover:rounded-lg"
            >
              Connect Leather Wallet
            </button>
            
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            
            
            
            
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-10 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-orange-500 text-lg">
            Built for Stacks Hacker House ;)
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
