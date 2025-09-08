// Minimal, compile-safe Stacks client (Phase 1)
// - Wallet connect via Leather (if available)
// - Network config (testnet/mainnet)
// - Tx status + STX balance via Hiro API
// - USDC balance placeholder until contract is provided

export type StacksNetworkName = 'testnet' | 'mainnet';

export interface StacksConfig {
  network: StacksNetworkName;
  rpcUrl: string;
  explorerTxBase: string;
}

export interface StacksWalletConnection {
  address: string;
}

export interface TxStatusResult {
  status: 'pending' | 'confirmed' | 'failed';
}

export interface BalancesResult {
  STX: number;
  USDC: number; // placeholder until contract id provided
}

const DEFAULTS: Record<StacksNetworkName, StacksConfig> = {
  testnet: {
    network: 'testnet',
    rpcUrl: 'https://api.testnet.hiro.so',
    explorerTxBase: 'https://explorer.stacks.co/txid',
  },
  mainnet: {
    network: 'mainnet',
    rpcUrl: 'https://api.hiro.so',
    explorerTxBase: 'https://explorer.stacks.co/txid',
  },
};

class StacksClient {
  private config: StacksConfig;

  constructor(network: StacksNetworkName = 'testnet') {
    this.config = DEFAULTS[network];
  }

  setNetwork(network: StacksNetworkName) {
    this.config = DEFAULTS[network];
  }

  getConfig() {
    return this.config;
  }

  // Leather connect (no stacks.js imports; compile-safe)
  async connectWallet(): Promise<StacksWalletConnection | null> {
    try {
      if (typeof window !== 'undefined' && (window as any).LeatherProvider) {
        const leather = (window as any).LeatherProvider;
        const response = await leather.request('getAddresses', {
          network: this.config.network,
        });
        if (response?.addresses?.length) {
          return { address: response.addresses[0].address };
        }
      }
      return null;
    } catch (e) {
      console.error('StacksClient.connectWallet error', e);
      return null;
    }
  }

  // Get STX balance from Hiro API (microstx -> stx)
  async getStxBalance(address: string): Promise<number> {
    try {
      const url = `${this.config.rpcUrl}/extended/v1/address/${address}/stx`;
      const res = await fetch(url);
      if (!res.ok) return 0;
      const data = await res.json();
      const micro = Number(data?.balance ?? 0);
      return micro / 1_000_000;
    } catch (e) {
      console.error('getStxBalance error', e);
      return 0;
    }
  }

  // Placeholder until USDC contract is supplied
  async getBalances(address: string): Promise<BalancesResult> {
    const STX = await this.getStxBalance(address);
    // TODO: replace with real USDC read-only call once contract id is provided
    const USDC = 0;
    return { STX, USDC };
  }

  async getTxStatus(txId: string): Promise<TxStatusResult> {
    try {
      const url = `${this.config.rpcUrl}/extended/v1/tx/${txId}`;
      const res = await fetch(url);
      if (!res.ok) return { status: 'failed' };
      const data = await res.json();
      const status = String(data?.tx_status || '').toLowerCase();
      if (status === 'success') return { status: 'confirmed' };
      if (status === 'pending') return { status: 'pending' };
      return { status: 'failed' };
    } catch (e) {
      console.error('getTxStatus error', e);
      return { status: 'failed' };
    }
  }

  txExplorerUrl(txId: string): string {
    return `${this.config.explorerTxBase}/${txId}?chain=${this.config.network}`;
  }
}

export const stacksClient = new StacksClient('testnet');
export default stacksClient;
