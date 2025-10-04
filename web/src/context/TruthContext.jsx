
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

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
  const [truthBalance, setTruthBalance] = useState(0);
  const [creatorBalance, setCreatorBalance] = useState(0);
  const [nftCount, setNftCount] = useState(0);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    try {
      setLoading(true);
      if (!window.ethereum) {
        alert('Please install MetaMask');
        return;
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const web3Signer = await web3Provider.getSigner();
      
      setProvider(web3Provider);
      setSigner(web3Signer);
      setWalletAddress(accounts[0]);
      setWalletConnected(true);

      await loadBalances(accounts[0], web3Provider);
    } catch (error) {
      console.error('Wallet connection failed:', error);
    } finally {
      setLoading(false);
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

  const disconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress(null);
    setTruthBalance(0);
    setCreatorBalance(0);
    setNftCount(0);
    setProvider(null);
    setSigner(null);
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setWalletAddress(accounts[0]);
          if (provider) loadBalances(accounts[0], provider);
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
    };
  }, [provider]);

  const value = {
    walletConnected,
    walletAddress,
    truthBalance,
    creatorBalance,
    nftCount,
    provider,
    signer,
    loading,
    connectWallet,
    disconnectWallet,
    setNftCount
  };

  return <TruthContext.Provider value={value}>{children}</TruthContext.Provider>;
};
