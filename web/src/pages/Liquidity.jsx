
import React from 'react';
import { useTruth } from '../context/TruthContext';

const Liquidity = () => {
  const { walletConnected } = useTruth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          🌊 Liquidity Pools
        </h1>
        <p className="text-xl text-gray-300">Manage your liquidity positions</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <h3 className="text-2xl font-bold mb-4 text-blue-400">💎 TRUTH/ETH Pool</h3>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-300">TVL:</span>
              <span className="font-bold text-green-400">$145,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">APR:</span>
              <span className="font-bold text-yellow-400">42.5%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Your Position:</span>
              <span className="font-bold text-purple-400">$0</span>
            </div>
          </div>
          <button
            onClick={() => window.open('https://app.uniswap.org', '_blank')}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Add Liquidity
          </button>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <h3 className="text-2xl font-bold mb-4 text-purple-400">🎨 Creator/ETH Pool</h3>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-300">TVL:</span>
              <span className="font-bold text-green-400">$89,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">APR:</span>
              <span className="font-bold text-yellow-400">38.2%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Your Position:</span>
              <span className="font-bold text-purple-400">$0</span>
            </div>
          </div>
          <button
            onClick={() => window.open('https://app.uniswap.org', '_blank')}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Add Liquidity
          </button>
        </div>
      </div>

      {!walletConnected && (
        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-2xl p-6 text-center">
          <p className="text-yellow-400 text-lg">Connect your wallet to view your positions</p>
        </div>
      )}
    </div>
  );
};

export default Liquidity;
