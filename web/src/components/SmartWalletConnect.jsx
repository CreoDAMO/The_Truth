
import React, { useState, useEffect } from 'react';
import coinbaseService from '../services/coinbaseService';

const SmartWalletConnect = ({ onConnect, onDisconnect }) => {
  const [connecting, setConnecting] = useState(false);
  const [walletInfo, setWalletInfo] = useState(null);
  const [capabilities, setCapabilities] = useState(null);

  const handleConnect = async () => {
    try {
      setConnecting(true);
      const address = await coinbaseService.connectWallet();
      const caps = await coinbaseService.getWalletCapabilities();
      
      setWalletInfo({ address });
      setCapabilities(caps);
      
      if (onConnect) onConnect({ address, capabilities: caps });
    } catch (error) {
      console.error('Connection failed:', error);
      alert('Failed to connect wallet');
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = () => {
    coinbaseService.disconnect();
    setWalletInfo(null);
    setCapabilities(null);
    if (onDisconnect) onDisconnect();
  };

  return (
    <div className="smart-wallet-connect">
      {!walletInfo ? (
        <button
          onClick={handleConnect}
          disabled={connecting}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
        >
          {connecting ? (
            <>
              <span className="animate-spin inline-block mr-2">⏳</span>
              Connecting...
            </>
          ) : (
            <>
              <span className="mr-2">🔵</span>
              Connect Smart Wallet
            </>
          )}
        </button>
      ) : (
        <div className="flex items-center gap-4">
          <div className="bg-white/5 backdrop-blur px-4 py-2 rounded-lg">
            <div className="text-xs text-gray-400">Connected</div>
            <div className="font-mono text-sm">
              {walletInfo.address.slice(0, 6)}...{walletInfo.address.slice(-4)}
            </div>
          </div>
          
          {capabilities?.['8453']?.atomicBatch?.supported && (
            <div className="text-xs bg-green-600/20 text-green-400 px-3 py-1 rounded">
              ⚡ Batch TX Supported
            </div>
          )}
          
          <button
            onClick={handleDisconnect}
            className="bg-red-600/20 hover:bg-red-600/30 text-red-400 px-4 py-2 rounded-lg transition-all"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

export default SmartWalletConnect;
