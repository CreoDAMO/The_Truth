
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Shop = () => {
  const [selectedNFT, setSelectedNFT] = useState('');
  const [merchType, setMerchType] = useState('tshirt');
  const [cart, setCart] = useState([]);

  const nftCollections = [
    {
      id: 'truth',
      name: 'The Truth',
      image: 'https://copper-active-hawk-266.mypinata.cloud/ipfs/bafybeidgadado5nyfxkua3mkiqbxsqkvrbqctkrqap7oghnkb77qo4steq',
      description: 'Original Philosophy - 77 Editions'
    },
    {
      id: 'bonus',
      name: 'Bonus Gift',
      image: 'https://copper-active-hawk-266.mypinata.cloud/ipfs/bafkreibx3bnrvluzzuzving6wnkgt3wzh4tekhequcbyiielyffmfk2j6a',
      description: 'Recursive Demonstration - 145,000 Editions'
    },
    {
      id: 'part-three',
      name: 'Part Three',
      image: 'https://copper-active-hawk-266.mypinata.cloud/ipfs/bafybeib2ujzv6k3m5t4acypn7xs3nufobsiytyrcnxh6aeevrodbuuinwu',
      description: 'Legal Framework - 444 Editions'
    }
  ];

  const merchProducts = [
    {
      id: 'tshirt-truth',
      name: 'The Truth T-Shirt',
      price: 29.99,
      image: 'https://copper-active-hawk-266.mypinata.cloud/ipfs/bafybeidgadado5nyfxkua3mkiqbxsqkvrbqctkrqap7oghnkb77qo4steq',
      type: 'Apparel'
    },
    {
      id: 'hoodie-truth',
      name: 'Recursive Truth Hoodie',
      price: 65.00,
      image: 'https://copper-active-hawk-266.mypinata.cloud/ipfs/bafkreibx3bnrvluzzuzving6wnkgt3wzh4tekhequcbyiielyffmfk2j6a',
      type: 'Apparel'
    },
    {
      id: 'poster-truth',
      name: 'Philosophy Poster',
      price: 35.00,
      image: 'https://copper-active-hawk-266.mypinata.cloud/ipfs/bafybeib2ujzv6k3m5t4acypn7xs3nufobsiytyrcnxh6aeevrodbuuinwu',
      type: 'Art'
    },
    {
      id: 'mug-truth',
      name: 'Truth Coffee Mug',
      price: 18.00,
      image: 'https://copper-active-hawk-266.mypinata.cloud/ipfs/bafybeidgadado5nyfxkua3mkiqbxsqkvrbqctkrqap7oghnkb77qo4steq',
      type: 'Accessories'
    },
    {
      id: 'sticker-pack',
      name: 'Truth Sticker Pack',
      price: 12.00,
      image: 'https://copper-active-hawk-266.mypinata.cloud/ipfs/bafkreibx3bnrvluzzuzving6wnkgt3wzh4tekhequcbyiielyffmfk2j6a',
      type: 'Accessories'
    },
    {
      id: 'notebook',
      name: 'Philosophy Journal',
      price: 24.00,
      image: 'https://copper-active-hawk-266.mypinata.cloud/ipfs/bafybeib2ujzv6k3m5t4acypn7xs3nufobsiytyrcnxh6aeevrodbuuinwu',
      type: 'Accessories'
    }
  ];

  const addToCart = (product) => {
    setCart([...cart, product]);
    alert(`Added ${product.name} to cart!`);
  };

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
        <p className="text-sm text-gray-400 mt-2">Cart: {cart.length} items</p>
      </div>

      {/* AI Merch Generator */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-yellow-400">🤖 AI Merch Generator</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {nftCollections.map(nft => (
            <div
              key={nft.id}
              onClick={() => setSelectedNFT(nft.id)}
              className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                selectedNFT === nft.id
                  ? 'border-yellow-400 bg-yellow-400/10'
                  : 'border-white/10 hover:border-white/30'
              }`}
            >
              <img
                src={nft.image}
                alt={nft.name}
                className="w-full h-48 object-cover rounded-lg mb-3"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <h3 className="font-bold text-lg mb-1">{nft.name}</h3>
              <p className="text-sm text-gray-400">{nft.description}</p>
            </div>
          ))}
        </div>
        <div className="mb-4">
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
            <option value="notebook">Journal</option>
          </select>
        </div>
        <button
          onClick={generateMerch}
          className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-4 rounded-lg hover:shadow-lg transition-all"
        >
          🎨 Generate AI Merch Design
        </button>
      </div>

      {/* Product Gallery */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-6 text-center">Featured Merchandise</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {merchProducts.map(product => (
            <div
              key={product.id}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-yellow-400/50 transition-all"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-cover rounded-lg mb-4"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="mb-2">
                <span className="text-xs px-2 py-1 bg-purple-600/30 rounded">{product.type}</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{product.name}</h3>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-green-400">${product.price}</span>
                <button
                  onClick={() => addToCart(product)}
                  className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg font-semibold transition-all"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Digital Content */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
        <h2 className="text-2xl font-bold mb-6 text-blue-400">📱 Digital Content</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-black/30 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-3">The Truth - Complete Audiobook</h3>
            <p className="text-gray-300 mb-4">25-page philosophical demonstration narrated by the author</p>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-green-400">$35.00</span>
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg">
                Purchase
              </button>
            </div>
          </div>
          <div className="bg-black/30 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-3">The Truth - Original PDF</h3>
            <p className="text-gray-300 mb-4">Complete 25-page work in written form</p>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-green-400">$20.00</span>
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg">
                Purchase
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
