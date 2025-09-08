import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowUpRight, ArrowDownLeft, RefreshCw } from 'lucide-react';

const TransactionHistory: React.FC = () => {
  const { state } = useApp();

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'subscription':
        return <ArrowUpRight className="w-4 h-4 text-red-400" />;
      case 'refund':
        return <ArrowDownLeft className="w-4 h-4 text-green-400" />;
      case 'withdrawal':
        return <RefreshCw className="w-4 h-4 text-blue-400" />;
      default:
        return <ArrowUpRight className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'subscription':
        return 'text-red-400';
      case 'refund':
        return 'text-green-400';
      case 'withdrawal':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  const formatDate = (date: Date | string) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj);
  };

  if (state.transactions.length === 0) {
    return (
      <div className="bg-card-bg rounded-xl p-6 border border-gray-800">
        <h2 className="text-2xl font-bold text-white mb-4">Transaction History</h2>
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">No transactions yet</div>
          <div className="text-sm text-gray-500">Your transactions will appear here</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card-bg rounded-xl p-6 border border-gray-800">
      <h2 className="text-2xl font-bold text-white mb-6">Transaction History</h2>
      <div className="space-y-3">
        {state.transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700">
            <div className="flex items-center space-x-3">
              {getTransactionIcon(transaction.type)}
              <div>
                <div className="text-white font-medium capitalize">
                  {transaction.type} {transaction.platform && `- ${transaction.platform}`}
                </div>
                <div className="text-sm text-gray-400">
                  {formatDate(transaction.timestamp)}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                {transaction.type === 'subscription' ? '-' : '+'}{transaction.amount.toFixed(4)} {transaction.currency}
              </div>
              <div className="text-sm text-gray-400 capitalize">
                {transaction.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory;
