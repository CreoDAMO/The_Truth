
import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk';

class CoinbaseService {
  constructor() {
    this.sdk = null;
    this.provider = null;
    this.signer = null;
    this.capabilities = null;
  }

  async initialize() {
    try {
      // Check if SDK is available
      if (typeof CoinbaseWalletSDK === 'undefined') {
        throw new Error('Coinbase Wallet SDK not loaded');
      }

      this.sdk = new CoinbaseWalletSDK({
        appName: 'The Truth NFT',
        appLogoUrl: 'https://copper-active-hawk-266.mypinata.cloud/ipfs/bafybeidgadado5nyfxkua3mkiqbxsqkvrbqctkrqap7oghnkb77qo4steq',
        darkMode: true,
        reloadOnDisconnect: false,
        preference: {
          options: 'smartWalletOnly',
        },
      });

      this.provider = this.sdk.makeWeb3Provider({
        rpc: 'https://mainnet.base.org',
        chainId: 8453
      });
      
      return this.provider;
    } catch (error) {
      console.error('Coinbase SDK initialization failed:', error);
      // Fallback to window.ethereum if available
      if (window.ethereum) {
        console.log('Falling back to window.ethereum provider');
        this.provider = window.ethereum;
        return this.provider;
      }
      throw error;
    }
  }

  async connectWallet() {
    if (!this.provider) await this.initialize();
    
    const accounts = await this.provider.request({
      method: 'eth_requestAccounts'
    });
    
    if (accounts[0]) {
      await this.loadWalletCapabilities(accounts[0]);
    }
    
    return accounts[0];
  }

  async loadWalletCapabilities(address) {
    try {
      this.capabilities = await this.provider.request({
        method: 'wallet_getCapabilities',
        params: [address]
      });
      
      console.log('Wallet Capabilities:', this.capabilities);
      return this.capabilities;
    } catch (error) {
      console.error('Failed to load wallet capabilities:', error);
      return null;
    }
  }

  getCapabilities() {
    return this.capabilities;
  }

  hasCapability(chainId, capability) {
    if (!this.capabilities || !this.capabilities[chainId]) return false;
    return this.capabilities[chainId][capability]?.supported === true;
  }

  async createSpendPermission({ token, allowance, period, durationSeconds }) {
    const account = await this.getConnectedAddress();
    const now = Math.floor(Date.now() / 1000);
    
    const permission = {
      account,
      spender: account,
      token,
      allowance,
      period,
      start: now,
      end: now + durationSeconds,
      salt: BigInt(Date.now()),
      extraData: '0x'
    };

    try {
      const signature = await this.provider.request({
        method: 'eth_signTypedData',
        params: [account, JSON.stringify(this.getSpendPermissionTypedData(permission))]
      });

      return { permission, signature };
    } catch (error) {
      console.error('Failed to create spend permission:', error);
      throw error;
    }
  }

  getSpendPermissionTypedData(permission) {
    return {
      types: {
        SpendPermission: [
          { name: 'account', type: 'address' },
          { name: 'spender', type: 'address' },
          { name: 'token', type: 'address' },
          { name: 'allowance', type: 'uint256' },
          { name: 'period', type: 'uint48' },
          { name: 'start', type: 'uint48' },
          { name: 'end', type: 'uint48' },
          { name: 'salt', type: 'uint256' },
          { name: 'extraData', type: 'bytes' }
        ]
      },
      primaryType: 'SpendPermission',
      domain: {
        name: 'SpendPermissionManager',
        version: '1',
        chainId: 8453,
        verifyingContract: '0x...'
      },
      message: permission
    };
  }

  async sendBatchTransaction(calls) {
    if (!this.hasCapability('0x2105', 'atomic')) {
      throw new Error('Wallet does not support batch transactions');
    }

    try {
      const result = await this.provider.request({
        method: 'wallet_sendCalls',
        params: [{
          version: '1.0',
          from: await this.getConnectedAddress(),
          calls
        }]
      });

      return result;
    } catch (error) {
      console.error('Batch transaction failed:', error);
      throw error;
    }
  }

  async sendGaslessTransaction({ to, value, data }) {
    const account = await this.getConnectedAddress();

    if (this.hasCapability('0x2105', 'paymasterService')) {
      return await this.sendBatchTransaction([{
        to,
        value: value || '0x0',
        data: data || '0x'
      }]);
    }

    return await this.sendTransaction({ to, value, data });
  }

  async onrampBuy({ amount, currency = 'ETH', network = 'base' }) {
    const options = {
      appId: process.env.VITE_COINBASE_APP_ID,
      widgetParameters: {
        destinationWallets: [{
          address: await this.connectWallet(),
          blockchains: [network],
          assets: [currency]
        }],
        defaultExperience: 'buy',
        presetCryptoAmount: amount
      }
    };

    const onrampInstance = window.CBPay.createWidget(options);
    onrampInstance.open();
    
    return new Promise((resolve) => {
      onrampInstance.on('success', (event) => resolve(event));
    });
  }

  async sendTransaction({ to, value, data }) {
    if (!this.provider) throw new Error('Provider not initialized');
    
    const txHash = await this.provider.request({
      method: 'eth_sendTransaction',
      params: [{
        from: await this.getConnectedAddress(),
        to,
        value: value ? `0x${parseInt(value).toString(16)}` : '0x0',
        data: data || '0x'
      }]
    });
    
    return txHash;
  }

  async getBalance(address) {
    if (!this.provider) await this.initialize();
    
    const balance = await this.provider.request({
      method: 'eth_getBalance',
      params: [address, 'latest']
    });
    
    return parseInt(balance, 16);
  }

  async getConnectedAddress() {
    const accounts = await this.provider.request({
      method: 'eth_accounts'
    });
    
    if (!accounts || accounts.length === 0) {
      throw new Error('No connected wallet');
    }
    
    return accounts[0];
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
      },
      84532: {
        chainId: '0x14a34',
        chainName: 'Base Sepolia',
        nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['https://sepolia.base.org'],
        blockExplorerUrls: ['https://sepolia.basescan.org']
      }
    };

    await this.provider.request({
      method: 'wallet_addEthereumChain',
      params: [networks[chainId]]
    });
  }

  async requestBasename(desiredName) {
    try {
      const result = await this.provider.request({
        method: 'wallet_registerName',
        params: [{
          name: desiredName,
          type: 'basename'
        }]
      });

      return result;
    } catch (error) {
      console.error('Basename registration failed:', error);
      throw error;
    }
  }

  async personalSign(message) {
    const account = await this.getConnectedAddress();
    
    return await this.provider.request({
      method: 'personal_sign',
      params: [message, account]
    });
  }
}

export default new CoinbaseService();
