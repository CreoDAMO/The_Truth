
import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk';

class CoinbaseService {
  constructor() {
    this.sdk = null;
    this.provider = null;
    this.signer = null;
    this.capabilities = null;
  }

  async initialize() {
    // Latest SDK v4.3.4+ initialization with enhanced config
    this.sdk = new CoinbaseWalletSDK({
      appName: 'The Truth NFT',
      appLogoUrl: 'https://copper-active-hawk-266.mypinata.cloud/ipfs/bafybeidgadado5nyfxkua3mkiqbxsqkvrbqctkrqap7oghnkb77qo4steq',
      appChainIds: [8453], // Base mainnet
      darkMode: true,
      // New v4.3+ features
      enableMobileWalletLink: true,
      diagnosticLogger: console,
      reloadOnDisconnect: false
    });

    this.provider = this.sdk.makeWeb3Provider();
    
    // Get wallet capabilities (v4.3+ feature)
    await this.getWalletCapabilities();
    
    return this.provider;
  }

  async getWalletCapabilities() {
    try {
      this.capabilities = await this.provider.request({
        method: 'wallet_getCapabilities'
      });
      console.log('Wallet capabilities:', this.capabilities);
      return this.capabilities;
    } catch (error) {
      console.warn('Capabilities not supported:', error);
      return null;
    }
  }

  async connectWallet() {
    if (!this.provider) await this.initialize();
    
    const accounts = await this.provider.request({
      method: 'eth_requestAccounts'
    });
    
    return accounts[0];
  }

  // Enhanced Onramp with Smart Wallet support
  async onrampBuy({ amount, currency = 'ETH', network = 'base' }) {
    const destinationAddress = await this.connectWallet();
    
    const options = {
      appId: import.meta.env.VITE_COINBASE_APP_ID || 'YOUR_APP_ID',
      widgetParameters: {
        destinationWallets: [{
          address: destinationAddress,
          blockchains: [network],
          assets: [currency]
        }],
        defaultExperience: 'buy',
        presetCryptoAmount: amount,
        // Smart Wallet optimization
        partnerUserId: destinationAddress
      },
      // New v4.3+ config
      experienceLoggedIn: 'embedded',
      experienceLoggedOut: 'popup',
      closeOnExit: true,
      closeOnSuccess: true
    };

    const instance = await window.CBPay?.createWidget(options);
    if (instance) {
      instance.open();
      
      return new Promise((resolve, reject) => {
        instance.on('success', (event) => resolve(event));
        instance.on('exit', () => reject(new Error('User closed widget')));
        instance.on('error', (error) => reject(error));
      });
    }
  }

  // Spend Permissions (v4.4 canary feature)
  async requestSpendPermission({ token, amount, period = '1day' }) {
    try {
      const result = await this.provider.request({
        method: 'wallet_grantPermissions',
        params: [{
          signer: {
            type: 'keys'
          },
          permissions: [{
            type: 'native-token-recurring-allowance',
            data: {
              amount,
              period,
              start: Math.floor(Date.now() / 1000)
            }
          }]
        }]
      });
      return result;
    } catch (error) {
      console.warn('Spend permissions not supported:', error);
      return null;
    }
  }

  async sendTransaction({ to, value, data }) {
    if (!this.provider) throw new Error('Provider not initialized');
    
    const txHash = await this.provider.request({
      method: 'eth_sendTransaction',
      params: [{
        from: await this.connectWallet(),
        to,
        value: `0x${parseInt(value).toString(16)}`,
        data
      }]
    });
    
    return txHash;
  }

  // Batch transactions (Smart Wallet feature)
  async sendBatchTransaction(calls) {
    try {
      const account = await this.connectWallet();
      
      const result = await this.provider.request({
        method: 'wallet_sendCalls',
        params: [{
          version: '1.0',
          chainId: '0x2105', // Base
          from: account,
          calls: calls.map(call => ({
            to: call.to,
            value: call.value ? `0x${parseInt(call.value).toString(16)}` : '0x0',
            data: call.data || '0x'
          }))
        }]
      });
      
      return result;
    } catch (error) {
      console.warn('Batch transactions not supported, falling back to sequential:', error);
      const results = [];
      for (const call of calls) {
        const tx = await this.sendTransaction(call);
        results.push(tx);
      }
      return results;
    }
  }

  async getBalance(address) {
    if (!this.provider) await this.initialize();
    
    const balance = await this.provider.request({
      method: 'eth_getBalance',
      params: [address, 'latest']
    });
    
    return parseInt(balance, 16);
  }

  async switchNetwork(chainId) {
    try {
      await this.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }]
      });
    } catch (error) {
      if (error.code === 4902) {
        await this.addNetwork(chainId);
      }
    }
  }

  async addNetwork(chainId) {
    const networks = {
      8453: {
        chainId: '0x2105',
        chainName: 'Base',
        nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['https://mainnet.base.org'],
        blockExplorerUrls: ['https://basescan.org']
      }
    };

    await this.provider.request({
      method: 'wallet_addEthereumChain',
      params: [networks[chainId]]
    });
  }

  // Sign typed data (for gasless transactions)
  async signTypedData(domain, types, value) {
    const account = await this.connectWallet();
    
    const signature = await this.provider.request({
      method: 'eth_signTypedData_v4',
      params: [account, JSON.stringify({ domain, types, value })]
    });
    
    return signature;
  }

  disconnect() {
    if (this.provider) {
      this.provider.disconnect();
    }
    this.sdk = null;
    this.provider = null;
    this.signer = null;
    this.capabilities = null;
  }
}

export default new CoinbaseService();
