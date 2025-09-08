import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Clock, Calendar } from 'lucide-react';

const ActiveSubscriptions: React.FC = () => {
  const { state, dispatch } = useApp();

  const activeSubscriptions = state.subscriptions.filter(sub => sub.status === 'active');

  const handleStopPlan = (subscriptionId: string) => {
    dispatch({ type: 'CANCEL_SUBSCRIPTION', payload: subscriptionId });
    
    // Add refund transaction
    const subscription = state.subscriptions.find(sub => sub.id === subscriptionId);
    if (subscription) {
      dispatch({
        type: 'ADD_TRANSACTION',
        payload: {
          id: `refund_${Date.now()}`,
          type: 'refund',
          platform: subscription.platform,
          amount: subscription.price * 0.8,
          currency: subscription.currency,
          timestamp: new Date(),
          status: 'completed'
        }
      });
    }
  };

  const getProgressPercentage = (subscription: any) => {
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

  const getTimeRemaining = (subscription: any) => {
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

  if (activeSubscriptions.length === 0) {
    return (
      <div className="bg-card-bg rounded-xl p-6 border border-gray-800">
        <h2 className="text-2xl font-bold text-white mb-4">Active Subscriptions</h2>
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">No active subscriptions</div>
          <div className="text-sm text-gray-500">Subscribe to a platform to get started</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card-bg rounded-xl p-6 border border-gray-800">
      <h2 className="text-2xl font-bold text-white mb-6">Active Subscriptions</h2>
      <div className="space-y-4">
        {activeSubscriptions.map((subscription) => (
          <div key={subscription.id} className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                  <span className="text-lg">🎬</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{subscription.platform}</h3>
                  <p className="text-sm text-gray-400">{subscription.plan} Plan</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleStopPlan(subscription.id)}
                  className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                  title="Stop Plan"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Progress</span>
                <span>{getTimeRemaining(subscription)} remaining</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-accent h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage(subscription)}%` }}
                />
              </div>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center space-x-4 text-gray-400">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{subscription.duration} months</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{subscription.price.toFixed(4)} {subscription.currency}</span>
                </div>
              </div>
              <div className="text-accent font-medium">
                {subscription.price.toFixed(4)} {subscription.currency}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveSubscriptions;
