
import React from 'react';

const Deploy = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
          🚀 Deployment Dashboard
        </h1>
        <p className="text-xl text-gray-300">Contract deployment and management</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <h3 className="text-2xl font-bold mb-4 text-blue-400">📋 Contract Status</h3>
          <div className="space-y-3">
            <div className="bg-black/30 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">The Truth NFT</span>
                <span className="text-green-400">✅ Deployed</span>
              </div>
              <div className="text-xs text-gray-400 font-mono">0x8f6c...30a3c</div>
            </div>
            <div className="bg-black/30 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">TRUTH Token</span>
                <span className="text-green-400">✅ Deployed</span>
              </div>
              <div className="text-xs text-gray-400 font-mono">0x8f6c...30a3c</div>
            </div>
            <div className="bg-black/30 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Creator Token</span>
                <span className="text-green-400">✅ Deployed</span>
              </div>
              <div className="text-xs text-gray-400 font-mono">0x22b0...5aa7</div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <h3 className="text-2xl font-bold mb-4 text-purple-400">🔧 Admin Actions</h3>
          <div className="space-y-3">
            <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold transition-all">
              Toggle Minting
            </button>
            <button className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg font-semibold transition-all">
              Update Metadata
            </button>
            <button className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg font-semibold transition-all">
              Withdraw Funds
            </button>
            <button className="w-full bg-yellow-600 hover:bg-yellow-700 py-3 rounded-lg font-semibold transition-all">
              Verify Contracts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deploy;
