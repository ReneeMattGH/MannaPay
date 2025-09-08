import { Platform, Currency } from '../types';

export const CURRENCY_RATES: Record<Currency, number> = {
  BTC: 45000,
  ETH: 3000,
  USDT: 1,
  USDC: 1,
  DAI: 1,
};

export const DEFAULT_CURRENCY: Currency = 'USDC';

export const platforms: Platform[] = [

  {
    id: 'netflix',
    name: 'Netflix',
    logo: '🎬',
    color: '#E50914',
    category: 'streaming',
    description: '',
    features: ['4K Ultra HD', 'Multiple profiles', 'Download offline', 'No ads'],
    plans: {
      Basic: { price: 15.99, currency: 'USDC', features: ['SD quality', '1 device'], maxDevices: 1, quality: 'SD' },
      Standard: { price: 22.99, currency: 'USDC', features: ['HD quality', '2 devices'], maxDevices: 2, quality: 'HD' },
      Premium: { price: 29.99, currency: 'USDC', features: ['4K Ultra HD', '4 devices'], maxDevices: 4, quality: '4K' }
    },
    supportedCurrencies: ['USDC'],
    autoRenewalSupported: true,
    pauseSupported: true
  },
  {
    id: 'spotify',
    name: 'Spotify',
    logo: '🎵',
    color: '#1DB954',
    category: 'streaming',
    description: '',
    features: ['Ad-free music', 'Offline downloads', 'High quality audio', 'Podcasts'],
    plans: {
      Basic: { price: 9.99, currency: 'USDC', features: ['Ad-supported', 'Mobile only'], maxDevices: 1 },
      Standard: { price: 15.99, currency: 'USDC', features: ['Ad-free', 'All devices', 'Offline downloads'], maxDevices: 5 },
      Premium: { price: 19.99, currency: 'USDC', features: ['HiFi quality', 'Family plan', 'Exclusive content'], maxDevices: 6 }
    },
    supportedCurrencies: ['USDC'],
    autoRenewalSupported: true,
    pauseSupported: false
  },
  {
    id: 'youtube',
    name: 'YouTube Premium',
    logo: '📺',
    color: '#FF0000',
    category: 'streaming',
    description: '',
    features: ['No ads', 'Background play', 'Offline downloads', 'YouTube Music'],
    plans: {
      Basic: { price: 11.99, currency: 'USDC', features: ['Ad-free videos', 'Background play'], maxDevices: 1 },
      Standard: { price: 18.99, currency: 'USDC', features: ['All devices', 'Offline downloads'], maxDevices: 5 },
      Premium: { price: 27.99, currency: 'USDC', features: ['Family plan', 'YouTube Music'], maxDevices: 6 }
    },
    supportedCurrencies: ['USDC'],
    autoRenewalSupported: true,
    pauseSupported: true
  },
  {
    id: 'disney',
    name: 'Disney+',
    logo: '🏰',
    color: '#113CCF',
    category: 'streaming',
    description: '',
    features: ['4K Ultra HD', 'Multiple profiles', 'Download offline', 'Exclusive content'],
    plans: {
      Basic: { price: 7.99, currency: 'USDC', features: ['HD quality', '2 devices'], maxDevices: 2, quality: 'HD' },
      Standard: { price: 10.99, currency: 'USDC', features: ['4K quality', '4 devices'], maxDevices: 4, quality: '4K' },
      Premium: { price: 13.99, currency: 'USDC', features: ['4K + HDR', 'Unlimited devices'], maxDevices: 10, quality: '4K HDR' }
    },
    supportedCurrencies: ['USDC'],
    autoRenewalSupported: true,
    pauseSupported: true
  },
  {
    id: 'prime',
    name: 'Prime Video',
    logo: '📺',
    color: '#00A8E1',
    category: 'streaming',
    description: '',
    features: ['4K Ultra HD', 'HDR', 'Download offline', 'X-Ray'],
    plans: {
      Basic: { price: 8.99, currency: 'USDC', features: ['HD quality', '2 devices'], maxDevices: 2, quality: 'HD' },
      Standard: { price: 12.99, currency: 'USDC', features: ['4K quality', '3 devices'], maxDevices: 3, quality: '4K' },
      Premium: { price: 18.99, currency: 'USDC', features: ['4K + HDR', 'Unlimited devices'], maxDevices: 10, quality: '4K HDR' }
    },
    supportedCurrencies: ['USDC'],
    autoRenewalSupported: true,
    pauseSupported: true
  },

  // Software Platforms
  {
    id: 'adobe',
    name: 'Adobe Creative Cloud',
    logo: '🎨',
    color: '#FF0000',
    category: 'software',
    description: '',
    features: ['Photoshop', 'Illustrator', 'Premiere Pro', 'After Effects', 'Cloud storage'],
    plans: {
      Basic: { price: 20.99, currency: 'USDC', features: ['Photoshop + Lightroom', '20GB storage'], maxDevices: 2 },
      Standard: { price: 52.99, currency: 'USDC', features: ['All apps', '100GB storage'], maxDevices: 2 },
      Premium: { price: 79.99, currency: 'USDC', features: ['All apps', '1TB storage', 'Fonts'], maxDevices: 2 }
    },
    supportedCurrencies: ['USDC'],
    autoRenewalSupported: true,
    pauseSupported: false
  },
  {
    id: 'microsoft',
    name: 'Microsoft 365',
    logo: '📊',
    color: '#0078D4',
    category: 'productivity',
    description: '',
    features: ['Word', 'Excel', 'PowerPoint', 'OneDrive', 'Teams'],
    plans: {
      Basic: { price: 5.99, currency: 'USDC', features: ['Web apps', '1TB OneDrive'], maxDevices: 5 },
      Standard: { price: 8.99, currency: 'USDC', features: ['Desktop apps', '1TB OneDrive'], maxDevices: 5 },
      Premium: { price: 12.99, currency: 'USDC', features: ['All features', '5TB OneDrive', 'Advanced security'], maxDevices: 5 }
    },
    supportedCurrencies: ['USDC'],
    autoRenewalSupported: true,
    pauseSupported: false
  },
  {
    id: 'notion',
    name: 'Notion',
    logo: '📝',
    color: '#000000',
    category: 'productivity',
    description: '',
    features: ['Unlimited pages', 'Team collaboration', 'Templates', 'API access'],
    plans: {
      Basic: { price: 4.99, currency: 'USDC', features: ['Personal use', '5MB file uploads'], maxDevices: 1 },
      Standard: { price: 8.99, currency: 'USDC', features: ['Team workspace', 'Unlimited file uploads'], maxDevices: 5 },
      Premium: { price: 15.99, currency: 'USDC', features: ['Advanced features', 'Admin tools'], maxDevices: 10 }
    },
    supportedCurrencies: ['USDC'],
    autoRenewalSupported: true,
    pauseSupported: true
  },

  // Gaming Platforms
  {
    id: 'steam',
    name: 'Steam',
    logo: '🎮',
    color: '#171a21',
    category: 'gaming',
    description: '',
    features: ['Game library', 'Cloud saves', 'Community features', 'Steam Workshop'],
    plans: {
      Basic: { price: 4.99, currency: 'USDC', features: ['Basic features', 'Limited cloud storage'], maxDevices: 5 },
      Standard: { price: 9.99, currency: 'USDC', features: ['Enhanced features', 'More cloud storage'], maxDevices: 10 },
      Premium: { price: 19.99, currency: 'USDC', features: ['All features', 'Unlimited cloud storage'], maxDevices: 20 }
    },
    supportedCurrencies: ['USDC'],
    autoRenewalSupported: false,
    pauseSupported: false
  },

  // Education Platforms
  {
    id: 'coursera',
    name: 'Coursera',
    logo: '🎓',
    color: '#0056D3',
    category: 'education',
    description: '',
    features: ['Unlimited courses', 'Certificates', 'Mobile app', 'Offline viewing'],
    plans: {
      Basic: { price: 39.99, currency: 'USDC', features: ['Limited courses', 'No certificates'], maxDevices: 3 },
      Standard: { price: 59.99, currency: 'USDC', features: ['Unlimited courses', 'Certificates'], maxDevices: 5 },
      Premium: { price: 99.99, currency: 'USDC', features: ['All courses', 'Specializations', 'Projects'], maxDevices: 10 }
    },
    supportedCurrencies: ['USDC'],
    autoRenewalSupported: true,
    pauseSupported: true
  }
];
