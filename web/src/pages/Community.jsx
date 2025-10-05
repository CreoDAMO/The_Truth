
import React, { useEffect, useState } from 'react';
import { useTruth } from '../context/TruthContext';

const Community = () => {
  const { walletAddress, truthBalance, creatorBalance, showNotification } = useTruth();
  const [holdings, setHoldings] = useState({
    truthTokens: 0,
    creatorCoins: 0,
    communityPower: 0
  });

  useEffect(() => {
    if (walletAddress && (truthBalance || creatorBalance)) {
      // Update holdings when wallet is connected and balances are available
      const truthVal = parseFloat(truthBalance) || 0;
      const creatorVal = parseFloat(creatorBalance) || 0;
      setHoldings({
        truthTokens: truthVal,
        creatorCoins: creatorVal,
        communityPower: calculateCommunityPower(truthVal, creatorVal)
      });
    } else {
      setHoldings({
        truthTokens: 0,
        creatorCoins: 0,
        communityPower: 0
      });
    }
  }, [walletAddress, truthBalance, creatorBalance]);

  const calculateCommunityPower = (truth, creator) => {
    const truthPower = Math.min((parseFloat(truth) / 1000) * 50, 50);
    const creatorPower = Math.min((parseFloat(creator) / 10000) * 50, 50);
    return (truthPower + creatorPower).toFixed(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
          👥 Community Hub
        </h1>
        <p className="text-xl text-gray-300">Connect with fellow Truth holders</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Your Holdings */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-3xl">
              💎
            </div>
            <h3 className="text-2xl font-bold ml-4">Your Holdings</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center bg-black/30 p-4 rounded-lg">
              <div className="text-3xl font-bold text-yellow-400">
                {walletAddress ? holdings.truthTokens.toFixed(2) : '0'}
              </div>
              <div className="text-sm text-gray-400">TRUTH Tokens</div>
            </div>
            <div className="text-center bg-black/30 p-4 rounded-lg">
              <div className="text-3xl font-bold text-green-400">
                {walletAddress ? holdings.creatorCoins.toFixed(2) : '0'}
              </div>
              <div className="text-sm text-gray-400">Creator Coins</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-semibold">Community Power</span>
              <span className="text-2xl font-bold text-blue-400">
                {walletAddress ? `${holdings.communityPower}%` : '0%'}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500" 
                style={{width: walletAddress ? `${holdings.communityPower}%` : '0%'}}
              ></div>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {walletAddress ? 'Based on total token holdings' : 'Connect wallet to see your power'}
            </p>
          </div>
        </div>

        {/* Revenue & Rewards */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center text-3xl">
              💰
            </div>
            <h3 className="text-2xl font-bold ml-4">Revenue Share</h3>
          </div>
          
          <div className="text-center bg-black/30 p-6 rounded-lg mb-4">
            <div className="text-4xl font-bold text-green-400 mb-2">
              ${walletAddress ? (holdings.communityPower * 2.5).toFixed(2) : '0.00'}
            </div>
            <div className="text-sm text-gray-400">Monthly Distribution</div>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">Next Distribution:</span>
              <span className="font-bold text-green-400">15 days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Total Earned:</span>
              <span className="font-bold text-yellow-400">
                ${walletAddress ? (holdings.communityPower * 15).toFixed(2) : '0.00'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Staking Rewards:</span>
              <span className="font-bold text-purple-400">
                {walletAddress ? (holdings.truthTokens * 0.05).toFixed(2) : '0.00'} TRUTH
              </span>
            </div>
          </div>
          
          <button 
            onClick={() => walletAddress ? showNotification('Rewards claimed!', 'success') : showNotification('Connect wallet first', 'error')}
            className="w-full bg-green-600 hover:bg-green-700 px-4 py-3 rounded-lg font-semibold mt-4 transition-all"
            disabled={!walletAddress}
          >
            {walletAddress ? 'Claim Rewards' : 'Connect Wallet'}
          </button>
        </div>

        {/* Community Stats */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <h3 className="text-2xl font-bold mb-6 text-purple-400">📊 Community Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-black/30 rounded-lg">
              <span className="text-gray-300">Total Members:</span>
              <span className="text-2xl font-bold text-blue-400">1,247</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-black/30 rounded-lg">
              <span className="text-gray-300">Active Today:</span>
              <span className="text-2xl font-bold text-green-400">342</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-black/30 rounded-lg">
              <span className="text-gray-300">NFT Holders:</span>
              <span className="text-2xl font-bold text-yellow-400">89</span>
            </div>
          </div>
        </div>
      </div>

      {/* Staking Interface */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 mb-8">
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl flex items-center justify-center text-3xl">
            🔮
          </div>
          <h3 className="text-2xl font-bold ml-4">TRUTH Staking</h3>
        </div>
        
        <p className="text-gray-300 mb-6">
          Stake TRUTH tokens for enhanced rewards, Master Copy priority, and increased governance power.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-red-900/30 to-pink-900/30 rounded-xl p-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-red-400">
                  {walletAddress ? (holdings.truthTokens * 0.3).toFixed(2) : '0'}
                </div>
                <div className="text-sm text-gray-400">Staked</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-pink-400">24.5%</div>
                <div className="text-sm text-gray-400">APY</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <input 
              type="number" 
              className="w-full bg-black/40 border border-pink-400/40 rounded-lg px-4 py-3 text-white placeholder-gray-400"
              placeholder={walletAddress ? `Max: ${holdings.truthTokens.toFixed(2)}` : "Amount to stake"}
              disabled={!walletAddress}
            />
            <button 
              onClick={() => walletAddress ? showNotification('Staking initiated!', 'success') : showNotification('Connect wallet first', 'error')}
              className="w-full bg-pink-600 hover:bg-pink-700 py-3 rounded-lg font-semibold transition-all"
              disabled={!walletAddress}
            >
              {walletAddress ? 'Stake TRUTH' : 'Connect Wallet'}
            </button>
            <button 
              onClick={() => walletAddress ? showNotification('Unstaking initiated!', 'success') : showNotification('Connect wallet first', 'error')}
              className="w-full bg-red-600/80 hover:bg-red-600 py-3 rounded-lg font-semibold transition-all"
              disabled={!walletAddress}
            >
              Unstake
            </button>
          </div>
        </div>
      </div>

      {/* Social Channels */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <h3 className="text-2xl font-bold mb-6 text-green-400">📱 Connect With Us</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <a href="https://twitter.com/TheTruthNFT" target="_blank" rel="noopener noreferrer"
             className="block bg-blue-600/20 hover:bg-blue-600/30 p-6 rounded-lg border border-blue-500/30 transition-all text-center">
            <div className="text-4xl mb-3">🐦</div>
            <div className="font-semibold">Twitter/X</div>
            <div className="text-sm text-gray-400">Follow for updates</div>
          </a>
          <a href="https://discord.gg/thetruth" target="_blank" rel="noopener noreferrer"
             className="block bg-purple-600/20 hover:bg-purple-600/30 p-6 rounded-lg border border-purple-500/30 transition-all text-center">
            <div className="text-4xl mb-3">💬</div>
            <div className="font-semibold">Discord</div>
            <div className="text-sm text-gray-400">Join the community</div>
          </a>
          <a href="https://t.me/TheTruthNFT" target="_blank" rel="noopener noreferrer"
             className="block bg-cyan-600/20 hover:bg-cyan-600/30 p-6 rounded-lg border border-cyan-500/30 transition-all text-center">
            <div className="text-4xl mb-3">✈️</div>
            <div className="font-semibold">Telegram</div>
            <div className="text-sm text-gray-400">Real-time chat</div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Community;
