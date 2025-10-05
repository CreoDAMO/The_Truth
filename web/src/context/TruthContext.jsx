import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import coinbaseService from '../services/coinbaseService';

const TruthContext = createContext();

export const useTruth = () => {
  const context = useContext(TruthContext);
  if (!context) {
    throw new Error('useTruth must be used within TruthProvider');
  }
  return context;
};

export const TruthProvider = ({ children }) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [truthBalance, setTruthBalance] = useState('0');
  const [creatorBalance, setCreatorBalance] = useState('0');
  const [nftCount, setNftCount] = useState(0);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [coinbaseProvider, setCoinbaseProvider] = useState(null);
  const [notification, setNotification] = useState(null);

  const connectWallet = async () => {
    try {
      setLoading(true);
      const provider = await coinbaseService.initialize();
      const address = await coinbaseService.connectWallet();

      setWalletAddress(address);
      setWalletConnected(true);
      setCoinbaseProvider(provider);

      // Get balances
      const balance = await coinbaseService.getBalance(address);
      const ethBalance = (balance / 1e18).toFixed(4);
      setTruthBalance(ethBalance);

      // Load token balances from contracts
      if (provider) {
        await loadBalances(address, provider);
      } else {
        setCreatorBalance('0');
        setNftCount(0);
      }

    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const buyWithOnramp = async (amount) => {
    try {
      const result = await coinbaseService.onrampBuy({ amount });
      return result;
    } catch (error) {
      console.error('Onramp error:', error);
      throw error;
    }
  };


  const loadBalances = async (address, web3Provider) => {
    try {
      const truthTokenAddress = '0x8f6cf6f7747e170f4768533b869c339dc3d30a3c';
      const creatorTokenAddress = '0x22b0434e89882f8e6841d340b28427646c015aa7';

      const truthContract = new ethers.Contract(
        truthTokenAddress,
        ['function balanceOf(address) view returns (uint256)'],
        web3Provider
      );

      const creatorContract = new ethers.Contract(
        creatorTokenAddress,
        ['function balanceOf(address) view returns (uint256)'],
        web3Provider
      );

      const [truthBal, creatorBal] = await Promise.all([
        truthContract.balanceOf(address),
        creatorContract.balanceOf(address)
      ]);

      setTruthBalance(ethers.formatEther(truthBal));
      setCreatorBalance(ethers.formatEther(creatorBal));
    } catch (error) {
      console.error('Failed to load balances:', error);
    }
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress(null);
    setTruthBalance('0');
    setCreatorBalance('0');
    setNftCount(0);
    setProvider(null);
    setSigner(null);
    setCoinbaseProvider(null);
  };

  useEffect(() => {
    // This effect might need adjustment if coinbaseService handles its own event listeners
    // For now, keeping the MetaMask specific listeners for fallback or dual support
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setWalletAddress(accounts[0]);
          // If using MetaMask provider, attempt to load balances
          if (provider && !coinbaseProvider) { // Check if not using Coinbase provider
            loadBalances(accounts[0], provider);
          }
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
      // Ensure to remove any Coinbase specific listeners if they exist and are added here
    };
  }, [provider, coinbaseProvider]); // Depend on both providers


  const value = {
    walletConnected,
    walletAddress,
    truthBalance,
    creatorBalance,
    nftCount,
    provider,
    signer,
    loading,
    coinbaseProvider,
    connectWallet,
    disconnectWallet,
    setNftCount,
    buyWithOnramp,
    showNotification,
    notification
  };

  return <TruthContext.Provider value={value}>{children}</TruthContext.Provider>;
};