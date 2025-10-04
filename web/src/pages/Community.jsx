
import React from 'react';

const Community = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
          👥 Community Hub
        </h1>
        <p className="text-xl text-gray-300">Connect with fellow Truth holders</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <h3 className="text-2xl font-bold mb-4 text-green-400">📱 Social Channels</h3>
          <div className="space-y-3">
            <a href="https://twitter.com/TheTruthNFT" target="_blank" rel="noopener noreferrer"
               className="block bg-blue-600/20 hover:bg-blue-600/30 p-4 rounded-lg border border-blue-500/30 transition-all">
              🐦 Twitter/X - Follow for updates
            </a>
            <a href="https://discord.gg/thetruth" target="_blank" rel="noopener noreferrer"
               className="block bg-purple-600/20 hover:bg-purple-600/30 p-4 rounded-lg border border-purple-500/30 transition-all">
              💬 Discord - Join the community
            </a>
            <a href="https://t.me/TheTruthNFT" target="_blank" rel="noopener noreferrer"
               className="block bg-cyan-600/20 hover:bg-cyan-600/30 p-4 rounded-lg border border-cyan-500/30 transition-all">
              ✈️ Telegram - Real-time chat
            </a>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <h3 className="text-2xl font-bold mb-4 text-purple-400">📊 Community Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Total Members:</span>
              <span className="text-2xl font-bold text-blue-400">1,247</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Active Today:</span>
              <span className="text-2xl font-bold text-green-400">342</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">NFT Holders:</span>
              <span className="text-2xl font-bold text-yellow-400">89</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
