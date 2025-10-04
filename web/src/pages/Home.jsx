
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
import React from 'react';
import { useTruth } from '../context/TruthContext';

const Home = () => {
  const { walletConnected, connectWallet } = useTruth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-black mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
          The Truth NFT
        </h1>
        <p className="text-2xl text-gray-300 mb-8">
          A philosophical experiment preserved on-chain
        </p>
        {!walletConnected && (
          <button
            onClick={connectWallet}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 rounded-lg text-xl font-bold shadow-lg transition-all"
          >
            Connect Wallet
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10">
          <img 
            src="https://bronze-worried-bat-61.mypinata.cloud/ipfs/QmYvPMxLWZBFdaaTotx1CTNYQYtQKRPte2wZ44L5DnF9hp" 
            alt="The Truth Original NFT"
            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <h3 className="text-xl font-bold mb-2 text-purple-400">The Truth Original</h3>
            <p className="text-gray-300 mb-4">77 unique philosophical NFTs</p>
            <div className="text-2xl font-bold text-green-400">0.169 ETH</div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10">
          <img 
            src="https://bronze-worried-bat-61.mypinata.cloud/ipfs/QmR4oUm1XwdB1Ho1BxYxyLvB7yPbBJ9WLe5YYBkeZALY5p" 
            alt="Bonus Gift NFT"
            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <h3 className="text-xl font-bold mb-2 text-green-400">Bonus Gift</h3>
            <p className="text-gray-300 mb-4">145,000 community access NFTs</p>
            <div className="text-2xl font-bold text-green-400">0.039 ETH</div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10">
          <img 
            src="https://bronze-worried-bat-61.mypinata.cloud/ipfs/QmPSj2VJLCahU6vrE9qN5DwEBPxC1YKyoTdx1PzXS4iqRj" 
            alt="Part Three Blackpaper NFT"
            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <h3 className="text-xl font-bold mb-2 text-yellow-400">Part Three</h3>
            <p className="text-gray-300 mb-4">444 Blackpaper NFTs</p>
            <div className="text-2xl font-bold text-green-400">TBD</div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
        <h2 className="text-3xl font-bold mb-6 text-center">About The Truth</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 text-lg mb-4">
            The Truth is a philosophical experiment that explores the gap between institutional reality 
            and actual truth through blockchain technology and NFT art.
          </p>
          <p className="text-gray-300 text-lg mb-4">
            Each NFT represents a piece of this philosophical journey, preserved immutably on-chain 
            with full legal and economic frameworks.
          </p>
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div>
              <h3 className="text-xl font-bold mb-3 text-blue-400">🔗 Token Integration</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• TRUTH governance token on Base</li>
                <li>• Creator token economy</li>
                <li>• Automated liquidity pools</li>
                <li>• Revenue sharing mechanisms</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3 text-purple-400">⚖️ Legal Framework</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Irrevocable trust structure</li>
                <li>• Florida tax compliance</li>
                <li>• Treasury resolutions</li>
                <li>• Token terms & provenance</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
