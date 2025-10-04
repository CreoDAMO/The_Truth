
import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk';

class CoinbaseService {
  constructor() {
    this.sdk = null;
    this.provider = null;
    this.signer = null;
  }

  async initialize() {
    this.sdk = new CoinbaseWalletSDK({
      appName: 'The Truth NFT',
      appLogoUrl: 'https://copper-active-hawk-266.mypinata.cloud/ipfs/bafybeidgadado5nyfxkua3mkiqbxsqkvrbqctkrqap7oghnkb77qo4steq',
      darkMode: true
    });

    this.provider = this.sdk.makeWeb3Provider('https://mainnet.base.org', 8453);
    return this.provider;
  }

  async connectWallet() {
    if (!this.provider) await this.initialize();
    
    const accounts = await this.provider.request({
      method: 'eth_requestAccounts'
    });
    
    return accounts[0];
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
        from: await this.connectWallet(),
        to,
        value: `0x${parseInt(value).toString(16)}`,
        data
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
}

export default new CoinbaseService();
