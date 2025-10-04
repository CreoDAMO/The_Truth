import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTruth } from '../context/TruthContext';
import { useTheme } from '../hooks/useTheme';

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { walletConnected, walletAddress, connectWallet } = useTruth();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { path: '/', label: '🏠 Home', exact: true },
    { path: '/analytics', label: '📊 Analytics & AI' },
    { path: '/governance', label: '🗳️ Governance' },
    { path: '/community', label: '👥 Community' },
    { path: '/liquidity', label: '🌊 Liquidity' },
    { path: '/payments', label: '💳 Payments' },
    { path: '/social', label: '📱 Social' },
    { path: '/lawful', label: '⚖️ Legal' },
    { path: '/shop', label: '🛍️ Shop' },
    { path: '/deploy', label: '🚀 Deploy' }
  ];

  const isActive = (path, exact) => {
    return exact ? location.pathname === path : location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            🌐 The Truth NFT
          </Link>

          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(item.path, item.exact)
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <button
            onClick={connectWallet}
            className="hidden lg:block px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
          >
            {walletConnected
              ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(38)}`
              : 'Connect Wallet'}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/5"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-black/95 backdrop-blur-xl border-b border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-medium ${
                  isActive(item.path, item.exact)
                    ? 'bg-blue-600/20 text-blue-400'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={() => {
                connectWallet();
                setMobileMenuOpen(false);
              }}
              className="w-full px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-base font-semibold"
            >
              {walletConnected
                ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(38)}`
                : 'Connect Wallet'}
            </button>
          </div>
        </div>
      )}
       <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
    </nav>
  );
};

export default Navigation;