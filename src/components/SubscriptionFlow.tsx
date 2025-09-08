import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Wallet, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { platforms } from '../data/platforms';
import { testnetService } from '../services/testnetService';
import toast from 'react-hot-toast';

const SubscriptionFlow: React.FC = () => {
  const { platform } = useParams<{ platform: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [step, setStep] = useState(1);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [selectedPlan, setSelectedPlan] = useState<'Basic' | 'Standard' | 'Premium'>('Basic');
  const [duration, setDuration] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [txId, setTxId] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<'pending' | 'confirmed' | 'failed'>('pending');

  const platformData = platforms.find(p => p.id === platform);

  if (!platformData) {
    return <div>Platform not found</div>;
  }

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (credentials.email === 'stack@gmail.com' && credentials.password === 'stack@1234') {
      setStep(2);
    } else {
      toast.error('Invalid credentials. Use stack@gmail.com / stack@1234');
    }
  };

  const handlePlanSelect = () => {
    setStep(3);
  };

  const handleConfirmSubscription = async () => {
    setIsProcessing(true);
    
    const planData = platformData.plans[selectedPlan];
    if (!planData) return;
    
    try {
      // Send payment using testnet service (mocked)
      const paymentResult = await testnetService.sendPayment(
        'SP2C2M5XYZ123456789',
        planData.price * duration,
        planData.currency
      );
      
      if (paymentResult.success && paymentResult.txId) {
        setTxId(paymentResult.txId);
        setTxStatus('pending');
        
        // Wait for transaction confirmation
        const status = await testnetService.getTransactionStatus(paymentResult.txId);
        setTxStatus(status);
        
        if (status === 'confirmed') {
          const subscription = {
            id: `sub_${Date.now()}`,
            platform: platformData.name,
            plan: selectedPlan,
            duration,
            startDate: new Date(),
            endDate: new Date(Date.now() + duration * 30 * 24 * 60 * 60 * 1000),
            price: planData.price * duration,
            currency: planData.currency,
            status: 'active' as const,
            autoRenew: true,
            credentials: {
              email: credentials.email,
              username: credentials.email.split('@')[0]
            }
          };

          dispatch({ type: 'ADD_SUBSCRIPTION', payload: subscription });
          dispatch({
            type: 'ADD_TRANSACTION',
            payload: {
              id: `tx_${Date.now()}`,
              type: 'subscription',
              platform: platformData.name,
              amount: subscription.price,
              currency: planData.currency,
              timestamp: new Date(),
              status: 'completed',
              hash: paymentResult.txId
            }
          });

          toast.success('Subscription activated successfully!');
          navigate('/dashboard');
        } else {
          toast.error('Transaction failed. Please try again.');
        }
      } else {
        toast.error(paymentResult.error || 'Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const planData = platformData.plans[selectedPlan];
  const totalPrice = planData ? planData.price * duration : 0;

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{platformData.logo}</div>
            <div>
              <h1 className="text-2xl font-bold text-white">{platformData.name}</h1>
              <p className="text-gray-400">Subscribe to {platformData.name}</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNum ? 'bg-accent text-white' : 'bg-gray-700 text-gray-400'
                }`}>
                  {step > stepNum ? <Check className="w-4 h-4" /> : stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > stepNum ? 'bg-accent' : 'bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Credentials */}
        {step === 1 && (
          <div className="bg-card-bg rounded-xl p-6 border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-4">Account Credentials</h2>
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <div className="text-sm text-gray-400">
                Demo credentials: stack@gmail.com / stack@1234
              </div>
              <button
                type="submit"
                className="w-full bg-accent hover:bg-accent/90 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Continue
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Plan Selection */}
        {step === 2 && (
          <div className="bg-card-bg rounded-xl p-6 border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-6">Select Plan</h2>
            
            {/* Plan Options */}
            <div className="space-y-4 mb-6">
              {(['Basic', 'Standard', 'Premium'] as const).map((plan) => {
                const planData = platformData.plans[plan];
                if (!planData) return null;
                
                return (
                  <div
                    key={plan}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedPlan === plan
                        ? 'border-accent bg-accent/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                    onClick={() => setSelectedPlan(plan)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{plan}</h3>
                        <p className="text-gray-400">
                          {planData.features.join(', ')}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-accent">
                          {planData.price.toFixed(4)} {planData.currency}
                        </div>
                        <div className="text-sm text-gray-400">per month</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Duration Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent"
              >
                {[1, 3, 6, 12].map((months) => (
                  <option key={months} value={months}>
                    {months} {months === 1 ? 'month' : 'months'}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handlePlanSelect}
              className="w-full bg-accent hover:bg-accent/90 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="bg-card-bg rounded-xl p-6 border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-6">Confirm Subscription</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-400">Platform:</span>
                <span className="text-white">{platformData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Plan:</span>
                <span className="text-white">{selectedPlan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Duration:</span>
                <span className="text-white">{duration} {duration === 1 ? 'month' : 'months'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Price per month:</span>
                <span className="text-white">{planData?.price.toFixed(4)} {planData?.currency}</span>
              </div>
              <div className="border-t border-gray-700 pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-white">Total:</span>
                  <span className="text-accent">{totalPrice.toFixed(4)} {planData?.currency}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <Wallet className="w-5 h-5 text-accent" />
                <div>
                  <div className="text-sm text-gray-400">Payment Method</div>
                  <div className="text-white font-medium">USDC Wallet (Testnet)</div>
                </div>
              </div>
            </div>

            {txId && (
              <div className="bg-gray-900/50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-400">Transaction Status</div>
                    <div className={`font-medium ${
                      txStatus === 'confirmed' ? 'text-success' :
                      txStatus === 'pending' ? 'text-warning' :
                      'text-error'
                    }`}>
                      {txStatus === 'confirmed' ? 'Confirmed' :
                       txStatus === 'pending' ? 'Pending Confirmation' :
                       'Failed'}
                    </div>
                  </div>
                  {txId && (
                    <a
                      href={`https://explorer.stacks.co/txid/${txId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-accent hover:text-accent-hover"
                    >
                      <span className="text-sm">View on Explorer</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
                {txId && (
                  <div className="mt-2 text-xs text-gray-400 font-mono">
                    {txId}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleConfirmSubscription}
              disabled={isProcessing}
              className="w-full bg-accent hover:bg-accent/90 disabled:opacity-50 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>Confirm & Pay</span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionFlow;
