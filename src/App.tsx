import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider, useApp } from './context/AppContext';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import SubscriptionFlow from './components/SubscriptionFlow';
import Settings from './components/Settings';
import Subscriptions from './components/Subscriptions';

const AppContent: React.FC = () => {
  const { state } = useApp();

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={state.isConnected ? <Dashboard /> : <LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/subscribe/:platform" element={<SubscriptionFlow />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
        </Routes>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0b1220',
              color: '#white',
              border: '1px solid #374151',
            },
          }}
        />
      </div>
    </Router>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
