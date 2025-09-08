import React, { useState } from 'react';
import { ArrowLeft, User, Bell, Shield, CreditCard, Globe, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  const handleDisconnect = () => {
    dispatch({ type: 'DISCONNECT_WALLET' });
    navigate('/');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'network', label: 'Network', icon: Globe },
  ];

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Profile Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
            <input
              type="text"
              className="input"
              placeholder="Enter your display name"
              defaultValue={state.userProfile?.name || ''}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              type="email"
              className="input"
              placeholder="Enter your email"
              defaultValue={state.userProfile?.email || ''}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Wallet Address</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                className="input flex-1"
                value={state.wallet?.address || ''}
                readOnly
              />
              <button className="btn-secondary px-3 py-2 text-sm">Copy</button>
            </div>
          </div>
        </div>
        <button className="btn-primary mt-4">Save Changes</button>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Email Notifications</h4>
              <p className="text-gray-400 text-sm">Receive updates via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Push Notifications</h4>
              <p className="text-gray-400 text-sm">Receive browser notifications</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Billing Alerts</h4>
              <p className="text-gray-400 text-sm">Get notified about subscription renewals</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Security Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Two-Factor Authentication</h4>
              <p className="text-gray-400 text-sm">Add an extra layer of security</p>
            </div>
            <button className="btn-secondary">Enable</button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Session Timeout</h4>
              <p className="text-gray-400 text-sm">Automatically log out after inactivity</p>
            </div>
            <select className="input w-32">
              <option>15 minutes</option>
              <option>30 minutes</option>
              <option>1 hour</option>
              <option>Never</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPaymentTab = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Payment Methods</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="text-white font-medium">USDC Wallet</h4>
                <p className="text-gray-400 text-sm">Primary payment method</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white font-medium">
                {state.wallet?.balances.USDC?.toFixed(2) || '0.00'} USDC
              </div>
              <div className="text-gray-400 text-sm">Available</div>
            </div>
          </div>
        </div>
        <button className="btn-primary mt-4">Add Payment Method</button>
      </div>
    </div>
  );

  const renderNetworkTab = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Network Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Network</label>
            <select className="input" defaultValue="testnet">
              <option value="testnet">Stacks Testnet (Active)</option>
              <option value="mainnet">Stacks Mainnet</option>
            </select>
            <p className="text-xs text-gray-400 mt-1">Currently using testnet for development and testing</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">RPC Endpoint</label>
            <input
              type="text"
              className="input"
              placeholder="https://api.testnet.hiro.so"
              defaultValue="https://api.testnet.hiro.so"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Auto-refresh Balance</h4>
              <p className="text-gray-400 text-sm">Automatically update wallet balance</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
        <button className="btn-primary mt-4">Save Network Settings</button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'security':
        return renderSecurityTab();
      case 'payment':
        return renderPaymentTab();
      case 'network':
        return renderNetworkTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="bg-card-bg border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
          </div>
          <button
            onClick={handleDisconnect}
            className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Disconnect</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-accent text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
