
import React from 'react';

const Social = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
          📱 Social Network
        </h1>
        <p className="text-xl text-gray-300">Share and connect with the community</p>
      </div>

      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-12 border border-white/10 text-center">
        <div className="text-6xl mb-6">🚀</div>
        <h2 className="text-3xl font-bold mb-4">Coming Soon</h2>
        <p className="text-gray-300 text-lg mb-8">
          Decentralized social features are in development
        </p>
        <div className="flex gap-4 justify-center">
          <a href="https://twitter.com/TheTruthNFT" target="_blank" rel="noopener noreferrer"
             className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all">
            Follow on Twitter
          </a>
          <a href="https://discord.gg/thetruth" target="_blank" rel="noopener noreferrer"
             className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-all">
            Join Discord
          </a>
        </div>
      </div>
    </div>
  );
};

export default Social;
