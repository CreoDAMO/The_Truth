
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Shop = () => {
  const [selectedNFT, setSelectedNFT] = useState('');
  const [merchType, setMerchType] = useState('tshirt');

  const generateMerch = () => {
    if (!selectedNFT) {
      alert('Please select an NFT first');
      return;
    }
    alert('AI merch generation coming soon!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all"
        >
          <span>←</span>
          <span>Back to Home</span>
        </Link>
      </div>
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
          🛍️ The Truth Shop
        </h1>
        <p className="text-xl text-gray-300">AI-Generated merch from your NFT collection</p>
      </div>

      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-yellow-400">🤖 AI Merch Generator</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Select Your NFT</label>
            <select
              value={selectedNFT}
              onChange={(e) => setSelectedNFT(e.target.value)}
              className="w-full p-3 bg-black/30 rounded-lg border border-gray-600 text-white"
            >
              <option value="">Choose an NFT...</option>
              <option value="1">The Truth #1 - Original Philosophy</option>
              <option value="77">The Truth #77 - Master Copy</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Merchandise Type</label>
            <select
              value={merchType}
              onChange={(e) => setMerchType(e.target.value)}
              className="w-full p-3 bg-black/30 rounded-lg border border-gray-600 text-white"
            >
              <option value="tshirt">T-Shirt</option>
              <option value="hoodie">Hoodie</option>
              <option value="poster">Poster</option>
              <option value="mug">Coffee Mug</option>
              <option value="sticker">Sticker Pack</option>
            </select>
          </div>
        </div>
        <button
          onClick={generateMerch}
          className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-4 rounded-lg hover:shadow-lg transition-all"
        >
          🎨 Generate AI Merch Design
        </button>
      </div>
    </div>
  );
};

export default Shop;
