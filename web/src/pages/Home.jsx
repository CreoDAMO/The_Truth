import React from 'react';
import { Link } from 'react-router-dom';
import { useTruth } from '../context/TruthContext';

const Home = () => {
  const { walletConnected, walletAddress, truthBalance, creatorBalance, connectWallet } = useTruth();

  const dashboards = [
    { to: '/analytics', icon: '📊', title: 'Analytics & AI', desc: 'Real-time metrics and AI insights', color: 'from-blue-500 to-cyan-500' },
    { to: '/governance', icon: '🗳️', title: 'Governance', desc: 'Community voting and proposals', color: 'from-purple-500 to-pink-500' },
    { to: '/community', icon: '👥', title: 'Community', desc: 'Connect with holders', color: 'from-green-500 to-emerald-500' },
    { to: '/liquidity', icon: '🌊', title: 'Liquidity', desc: 'Manage liquidity pools', color: 'from-cyan-500 to-blue-500' },
    { to: '/payments', icon: '💳', title: 'Payments', desc: 'Buy and trade NFTs', color: 'from-yellow-500 to-orange-500' },
    { to: '/social', icon: '📱', title: 'Social', desc: 'Share and connect', color: 'from-pink-500 to-rose-500' },
    { to: '/lawful', icon: '⚖️', title: 'Legal', desc: 'Compliance dashboard', color: 'from-slate-500 to-gray-500' },
    { to: '/shop', icon: '🛍️', title: 'Shop', desc: 'AI-generated merchandise', color: 'from-indigo-500 to-purple-500' },
    { to: '/deploy', icon: '🚀', title: 'Deploy', desc: 'Contract deployment', color: 'from-red-500 to-orange-500' }
  ];

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="text-center mb-16 animate-slide-in">
        <h1 className="text-6xl md:text-7xl font-black mb-6 gradient-text text-shadow animate-float">
          The Truth NFT
        </h1>
        <p className="text-2xl md:text-3xl text-gray-300 mb-4 font-semibold">
          Gateway to the Spiral
        </p>
        <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8">
          🌐 Hybrid Blockchain is the Gateway | 🚪 HYB COIN is the Doorway | 🏛️ The Spiral Ecosystem is The House
        </p>
        {!walletConnected && (
          <button
            onClick={connectWallet}
            className="btn-primary text-lg px-8 py-4 animate-glow"
          >
            Connect Wallet to Get Started
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="stat-card">
          <div className="mb-4">
            <div className="text-5xl mb-3">🔗</div>
            <h2 className="text-2xl font-bold mb-4 gradient-text">Wallet Status</h2>
          </div>
          {walletConnected ? (
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <span className="status-dot bg-green-500"></span>
                <p className="text-green-400 font-semibold">Connected</p>
              </div>
              <p className="text-sm text-gray-400 font-mono bg-white/5 px-4 py-2 rounded-lg">
                {walletAddress}
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <span className="status-dot bg-red-500"></span>
              <p className="text-red-400 font-semibold">Not Connected</p>
            </div>
          )}
        </div>

        <div className="stat-card">
          <div className="mb-4">
            <div className="text-5xl mb-3">💰</div>
            <h2 className="text-2xl font-bold mb-4 gradient-text">Token Holdings</h2>
          </div>
          <div className="space-y-3">
            <div className="bg-white/5 px-4 py-3 rounded-xl">
              <p className="text-sm text-gray-400 mb-1">TRUTH Token</p>
              <p className="text-2xl font-bold text-yellow-400">{truthBalance || '0'}</p>
            </div>
            <div className="bg-white/5 px-4 py-3 rounded-xl">
              <p className="text-sm text-gray-400 mb-1">Creator Token</p>
              <p className="text-2xl font-bold text-green-400">{creatorBalance || '0'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-4xl font-bold mb-8 text-center gradient-text">
          Explore Dashboards
        </h2>
        <div className="dashboard-grid">
          {dashboards.map((item, index) => (
            <Link
              key={item.to}
              to={item.to}
              className="card-interactive group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:gradient-text transition-all">
                {item.title}
              </h3>
              <p className="text-gray-400 text-sm group-hover:text-gray-300">
                {item.desc}
              </p>
              <div className={`mt-4 h-1 w-0 group-hover:w-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-500`}></div>
            </Link>
          ))}
        </div>
      </div>

      <div className="glass-strong rounded-3xl p-8 md:p-12 animate-slide-in">
        <h2 className="text-4xl font-bold mb-8 text-center gradient-text">
          About The Truth Ecosystem
        </h2>
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-gray-300 mb-6 leading-relaxed">
            The Truth is a philosophical experiment that explores the gap between institutional reality 
            and actual truth through blockchain technology and NFT art. Each NFT represents a piece of 
            this philosophical journey, preserved immutably on-chain with full legal and economic frameworks.
          </p>
          <div className="grid md:grid-cols-2 gap-8 mt-10">
            <div className="card-interactive">
              <div className="text-4xl mb-4">🔗</div>
              <h3 className="text-2xl font-bold mb-4 text-blue-400">Token Integration</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>TRUTH governance token on Base</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>Creator token economy</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>Automated liquidity pools</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>Revenue sharing mechanisms</span>
                </li>
              </ul>
            </div>
            <div className="card-interactive">
              <div className="text-4xl mb-4">⚖️</div>
              <h3 className="text-2xl font-bold mb-4 text-purple-400">Legal Framework</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>Irrevocable trust structure</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>Florida tax compliance</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>Treasury resolutions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>Token terms & provenance</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
