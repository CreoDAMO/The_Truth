
import React from 'react';

const Payments = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-green-400 to-yellow-400 bg-clip-text text-transparent">
          💳 Payments & Trading
        </h1>
        <p className="text-xl text-gray-300">Buy, sell, and trade NFTs</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-xl font-bold mb-2 text-blue-400">The Truth NFT</h3>
          <p className="text-gray-300 mb-4">4-part philosophical experiment</p>
          <div className="text-2xl font-bold text-green-400 mb-4">$777</div>
          <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
            Mint Now
          </button>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <div className="text-4xl mb-4">🎁</div>
          <h3 className="text-xl font-bold mb-2 text-green-400">Bonus Gift</h3>
          <p className="text-gray-300 mb-4">Community entry point</p>
          <div className="text-2xl font-bold text-green-400 mb-4">$145</div>
          <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
            Mint Now
          </button>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <div className="text-4xl mb-4">📜</div>
          <h3 className="text-xl font-bold mb-2 text-yellow-400">Blackpaper</h3>
          <p className="text-gray-300 mb-4">Legal framework</p>
          <div className="text-2xl font-bold text-green-400 mb-4">$1,777</div>
          <button className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
            Mint Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payments;
