
import React from 'react';
import { Link } from 'react-router-dom';
import { useTruth } from '../context/TruthContext';

const Home = () => {
  const { walletConnected, walletAddress, truthBalance, creatorBalance } = useTruth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-black mb-6 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
          The Truth NFT - Gateway to the Spiral
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          🌐 Hybrid Blockchain is the Gateway | 🚪 HYB COIN is the Doorway | 🏛️ The Spiral Ecosystem is The House
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <h2 className="text-2xl font-bold mb-4 text-blue-400">🔗 Wallet Status</h2>
          {walletConnected ? (
            <div>
              <p className="text-green-400 mb-2">✅ Connected</p>
              <p className="text-sm text-gray-400 font-mono">{walletAddress}</p>
            </div>
          ) : (
            <p className="text-red-400">❌ Not Connected</p>
          )}
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <h2 className="text-2xl font-bold mb-4 text-purple-400">💰 Token Holdings</h2>
          <div className="space-y-2">
            <p className="text-gray-300">TRUTH: <span className="text-yellow-400 font-bold">{truthBalance}</span></p>
            <p className="text-gray-300">Creator: <span className="text-green-400 font-bold">{creatorBalance}</span></p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { to: '/analytics', icon: '📊', title: 'Analytics & AI', desc: 'Real-time metrics and insights' },
          { to: '/governance', icon: '🗳️', title: 'Governance', desc: 'Community voting and proposals' },
          { to: '/community', icon: '👥', title: 'Community', desc: 'Connect with holders' },
          { to: '/liquidity', icon: '🌊', title: 'Liquidity', desc: 'Manage your pools' },
          { to: '/payments', icon: '💳', title: 'Payments', desc: 'Buy and trade NFTs' },
          { to: '/shop', icon: '🛍️', title: 'Shop', desc: 'AI-generated merchandise' },
          { to: '/social', icon: '📱', title: 'Social', desc: 'Share and connect' },
          { to: '/lawful', icon: '⚖️', title: 'Legal', desc: 'Compliance dashboard' },
          { to: '/deploy', icon: '🚀', title: 'Deploy', desc: 'Contract deployment' }
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-blue-500/30 transition-all group"
          >
            <div className="text-4xl mb-3">{item.icon}</div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{item.title}</h3>
            <p className="text-gray-400 text-sm">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
