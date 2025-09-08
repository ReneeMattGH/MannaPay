import React, { useState } from 'react';
import { ArrowLeft, Play, Pause, X, Calendar, Clock, DollarSign, Settings, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Subscription, SubscriptionStatus } from '../types';

const Subscriptions: React.FC = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');

  const activeSubscriptions = state.subscriptions.filter(sub => 
    sub.status === 'active' || sub.status === 'paused'
  );
  
  const pastSubscriptions = state.subscriptions.filter(sub => 
    sub.status === 'cancelled' || sub.status === 'expired'
  );

  const handlePauseSubscription = (subscriptionId: string) => {
    dispatch({ type: 'PAUSE_SUBSCRIPTION', payload: subscriptionId });
  };

  const handleResumeSubscription = (subscriptionId: string) => {
    dispatch({ type: 'RESUME_SUBSCRIPTION', payload: subscriptionId });
  };

  const handleCancelSubscription = (subscriptionId: string) => {
    dispatch({ type: 'CANCEL_SUBSCRIPTION', payload: subscriptionId });
  };

  const getStatusColor = (status: SubscriptionStatus) => {
    switch (status) {
      case 'active':
        return 'text-success bg-success/10 border-success/20';
      case 'paused':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'cancelled':
        return 'text-error bg-error/10 border-error/20';
      case 'expired':
        return 'text-gray-400 bg-gray-800 border-gray-700';
      default:
        return 'text-gray-400 bg-gray-800 border-gray-700';
    }
  };

  const getStatusIcon = (status: SubscriptionStatus) => {
    switch (status) {
      case 'active':
        return <Play className="w-4 h-4" />;
      case 'paused':
        return <Pause className="w-4 h-4" />;
      case 'cancelled':
        return <X className="w-4 h-4" />;
      case 'expired':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getProgressPercentage = (subscription: Subscription) => {
    const now = new Date();
    const start = new Date(subscription.startDate);
    const end = new Date(subscription.endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return 0;
    }
    
    const total = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  const getTimeRemaining = (subscription: Subscription) => {
    const now = new Date();
    const end = new Date(subscription.endDate);
    
    if (isNaN(end.getTime())) {
      return 'Invalid date';
    }
    
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return `${days}d ${hours}h`;
  };

  const formatDate = (date: Date | string) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(dateObj);
  };

  const renderSubscriptionCard = (subscription: Subscription) => (
    <div key={subscription.id} className="card card-hover">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-accent to-blue-500 rounded-xl flex items-center justify-center">
            <span className="text-2xl">🎬</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{subscription.platform}</h3>
            <p className="text-gray-400">{subscription.plan} Plan</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(subscription.status)}`}>
          {getStatusIcon(subscription.status)}
          <span className="capitalize">{subscription.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">${subscription.price.toFixed(2)}</div>
          <div className="text-sm text-gray-400">Price</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{subscription.duration}</div>
          <div className="text-sm text-gray-400">Months</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{subscription.currency}</div>
          <div className="text-sm text-gray-400">Currency</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{getTimeRemaining(subscription)}</div>
          <div className="text-sm text-gray-400">Remaining</div>
        </div>
      </div>

      {subscription.status === 'active' && (
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Progress</span>
            <span>{getTimeRemaining(subscription)} remaining</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-accent to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage(subscription)}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
        <div className="flex items-center space-x-1">
          <Calendar className="w-4 h-4" />
          <span>Started: {formatDate(subscription.startDate)}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4" />
          <span>Ends: {formatDate(subscription.endDate)}</span>
        </div>
      </div>

      {subscription.credentials && (
        <div className="bg-gray-800 rounded-lg p-3 mb-4">
          <div className="text-sm text-gray-400 mb-1">Account Details</div>
          <div className="text-white font-mono text-sm">
            {subscription.credentials.email}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {subscription.status === 'active' && (
            <>
              <button
                onClick={() => handlePauseSubscription(subscription.id)}
                className="btn-secondary px-4 py-2 text-sm"
              >
                <Pause className="w-4 h-4 mr-1" />
                Pause
              </button>
              <button
                onClick={() => handleCancelSubscription(subscription.id)}
                className="btn-ghost text-error hover:bg-error/10 px-4 py-2 text-sm"
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </button>
            </>
          )}
          {subscription.status === 'paused' && (
            <button
              onClick={() => handleResumeSubscription(subscription.id)}
              className="btn-primary px-4 py-2 text-sm"
            >
              <Play className="w-4 h-4 mr-1" />
              Resume
            </button>
          )}
        </div>
        <button className="btn-ghost px-4 py-2 text-sm">
          <Eye className="w-4 h-4 mr-1" />
          Details
        </button>
      </div>
    </div>
  );

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
            <h1 className="text-2xl font-bold text-white">My Subscriptions</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-400">
              {activeSubscriptions.length} Active • {pastSubscriptions.length} Past
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-800 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-6 py-3 rounded-md font-medium transition-all ${
              activeTab === 'active'
                ? 'bg-accent text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Active ({activeSubscriptions.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-6 py-3 rounded-md font-medium transition-all ${
              activeTab === 'past'
                ? 'bg-accent text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Past ({pastSubscriptions.length})
          </button>
        </div>

        {/* Content */}
        {activeTab === 'active' ? (
          <div>
            {activeSubscriptions.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Settings className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">No Active Subscriptions</h3>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  You don't have any active subscriptions yet. Browse our available platforms to get started.
                </p>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="btn-primary px-8 py-3"
                >
                  Browse Platforms
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {activeSubscriptions.map(renderSubscriptionCard)}
              </div>
            )}
          </div>
        ) : (
          <div>
            {pastSubscriptions.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">No Past Subscriptions</h3>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  Your subscription history will appear here once you cancel or expire subscriptions.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {pastSubscriptions.map(renderSubscriptionCard)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscriptions;
