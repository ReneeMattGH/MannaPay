import React from 'react';
import { useNavigate } from 'react-router-dom';
import { platforms } from '../data/platforms';

interface PlatformCardProps {
  platform: string;
}

const PlatformCard: React.FC<PlatformCardProps> = ({ platform }) => {
  const navigate = useNavigate();
  const platformData = platforms.find(p => p.id === platform);

  if (!platformData) return null;

  const handleSubscribe = () => {
    navigate(`/subscribe/${platform}`);
  };

  return (
    <div className="card card-hover group cursor-pointer">
      <div className="text-center">
        <div className="text-5xl mb-6">{platformData.logo}</div>
        <h3 className="text-2xl font-bold text-white mb-3">{platformData.name}</h3>
        <p className="text-gray-400 mb-4 text-sm">{platformData.description}</p>
        <div className="text-lg font-semibold text-accent mb-6">
          Starting from ${platformData.plans.Basic?.price.toFixed(2)} {platformData.plans.Basic?.currency}
        </div>
        <button
          onClick={handleSubscribe}
          className="w-full btn-primary py-3 text-lg font-semibold group-hover:scale-105"
        >
          Subscribe
        </button>
      </div>
    </div>
  );
};

export default PlatformCard;
