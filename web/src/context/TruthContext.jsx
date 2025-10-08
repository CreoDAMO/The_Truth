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
  const [walletConnected, setWalletConnected] = useState(() => {
    return localStorage.getItem('walletConnected') === 'true';
  });
  const [walletAddress, setWalletAddress] = useState(() => {
    return localStorage.getItem('walletAddress') || null;
  });
  const [truthBalance, setTruthBalance] = useState(0);
  const [creatorBalance, setCreatorBalance] = useState(0);
  const [nftCount, setNftCount] = useState(0);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [coinbaseProvider, setCoinbaseProvider] = useState(null);
  const [platformSignatureVerified, setPlatformSignatureVerified] = useState(() => {
    return localStorage.getItem('platformSignatureVerified') === 'true';
  });

  const connectWallet = async () => {
    try {
      setLoading(true);
      const provider = await coinbaseService.initialize();
      const address = await coinbaseService.connectWallet();

      // Store wallet connection in localStorage
      localStorage.setItem('walletAddress', address);
      localStorage.setItem('walletConnected', 'true');

      setWalletAddress(address);
      setWalletConnected(true);
      setCoinbaseProvider(provider);

      // Request platform signature (Tier 1: Platform Connection)
      if (!platformSignatureVerified) {
        try {
          const message = `Welcome to The Truth NFT Platform!\n\nBy signing this message, you confirm your connection to the platform.\n\nWallet: ${address}\nTimestamp: ${new Date().toISOString()}\n\nThis signature will NOT trigger any blockchain transactions.`;
          
          const signature = await coinbaseService.personalSign(message);
          
          if (signature) {
            setPlatformSignatureVerified(true);
            localStorage.setItem('platformSignatureVerified', 'true');
            console.log('Platform signature verified successfully');
          }
        } catch (sigError) {
          console.error('Signature declined:', sigError);
          // Continue even if signature is declined - wallet is still connected
        }
      }

      // Get balances
      const balance = await coinbaseService.getBalance(address);
      setTruthBalance(balance.toString());

      setCreatorBalance(0);
      setNftCount(0);

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

  const disconnectWallet = () => {
    // Clear localStorage
    localStorage.removeItem('walletAddress');
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('platformSignatureVerified');
    
    setWalletConnected(false);
    setWalletAddress(null);
    setTruthBalance(0);
    setCreatorBalance(0);
    setNftCount(0);
    setProvider(null);
    setSigner(null);
    setCoinbaseProvider(null);
    setPlatformSignatureVerified(false);
  };

  // Tier 2: NFT Minting Signature
  const requestMintingSignature = async (nftData) => {
    try {
      const message = `Authorize NFT Minting\n\nYou are about to mint a new Truth NFT.\n\nNFT Details:\n${JSON.stringify(nftData, null, 2)}\n\nWallet: ${walletAddress}\nTimestamp: ${new Date().toISOString()}\n\nThis will trigger a blockchain transaction.`;
      
      const signature = await coinbaseService.personalSign(message);
      return signature;
    } catch (error) {
      console.error('Minting signature declined:', error);
      throw error;
    }
  };

  // Tier 3: Smart Contract Deployment Signature
  const requestDeploymentSignature = async (contractData) => {
    try {
      const message = `Authorize Smart Contract Deployment\n\nYou are about to deploy a smart contract.\n\nContract Details:\n${JSON.stringify(contractData, null, 2)}\n\nWallet: ${walletAddress}\nTimestamp: ${new Date().toISOString()}\n\nThis will trigger a blockchain transaction.`;
      
      const signature = await coinbaseService.personalSign(message);
      return signature;
    } catch (error) {
      console.error('Deployment signature declined:', error);
      throw error;
    }
  };

  // Auto-restore wallet connection on page load
  useEffect(() => {
    const restoreWallet = async () => {
      const savedAddress = localStorage.getItem('walletAddress');
      const savedConnected = localStorage.getItem('walletConnected');
      
      if (savedAddress && savedConnected === 'true') {
        try {
          // Re-initialize provider without prompting user
          const provider = await coinbaseService.initialize();
          setCoinbaseProvider(provider);
          
          // Check if still connected
          const currentAddress = await coinbaseService.getConnectedAddress();
          if (currentAddress && currentAddress.toLowerCase() === savedAddress.toLowerCase()) {
            console.log('Wallet connection restored:', currentAddress);
            
            // Get balance
            const balance = await coinbaseService.getBalance(currentAddress);
            setTruthBalance(balance.toString());
          } else {
            // Clear if addresses don't match
            disconnectWallet();
          }
        } catch (error) {
          console.log('Could not restore wallet connection:', error);
          // Clear localStorage if restoration fails
          disconnectWallet();
        }
      }
    };
    
    restoreWallet();
  }, []); // Run once on mount

  useEffect(() => {
    // This effect might need adjustment if coinbaseService handles its own event listeners
    // For now, keeping the MetaMask specific listeners for fallback or dual support
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setWalletAddress(accounts[0]);
          localStorage.setItem('walletAddress', accounts[0]);
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
    platformSignatureVerified,
    connectWallet,
    disconnectWallet,
    setNftCount,
    buyWithOnramp,
    requestMintingSignature,
    requestDeploymentSignature
  };

  return <TruthContext.Provider value={value}>{children}</TruthContext.Provider>;
};