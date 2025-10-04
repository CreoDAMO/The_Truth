import React, { useState, useEffect } from 'react';
import { useTruth } from '../context/TruthContext';

const Payments = () => {
  const { walletConnected, walletAddress, truthBalance, creatorBalance, buyWithOnramp } = useTruth();
  const [showOnramp, setShowOnramp] = useState(false);

  useEffect(() => {
    // Load Coinbase Pay SDK
    const script = document.createElement('script');
    script.src = 'https://pay.coinbase.com/pay.umd.min.js';
    script.async = true;
    document.body.appendChild(script);

    return () => document.body.removeChild(script);
  }, []);

  const [activeTab, setActiveTab] = useState('nft-mint');
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    } else {
      alert('Please install MetaMask to use this feature');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-green-400 to-yellow-400 bg-clip-text text-transparent">
          💳 Payments & Trading
        </h1>
        <p className="text-xl text-gray-300">Multiple payment methods for maximum accessibility</p>

        {!account ? (
          <button
            onClick={connectWallet}
            className="mt-4 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-all"
          >
            Connect Wallet
          </button>
        ) : (
          <div className="mt-4 text-green-400">
            Connected: {account.slice(0, 6)}...{account.slice(-4)}
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 bg-black/50 p-2 rounded-lg mb-8">
        {[
          { id: 'nft-mint', label: 'NFT Minting' },
          { id: 'gasless', label: 'Gasless Minting' },
          { id: 'fiat', label: 'Fiat to NFT' },
          { id: 'subscription', label: 'Subscriptions' },
          { id: 'crypto', label: 'Multi-Token' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 px-4 rounded-md transition-all ${
              activeTab === tab.id
                ? 'bg-green-600 text-white'
                : 'text-green-300 hover:text-white hover:bg-green-600/30'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* NFT Minting */}
      {activeTab === 'nft-mint' && (
        <div>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-blue-400/50 transition-all">
              <img
                src="https://copper-active-hawk-266.mypinata.cloud/ipfs/bafybeidgadado5nyfxkua3mkiqbxsqkvrbqctkrqap7oghnkb77qo4steq"
                alt="The Truth NFT"
                className="w-full h-48 object-cover rounded-lg mb-4"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div className="text-4xl mb-4 hidden">🎯</div>
              <h3 className="text-xl font-bold mb-2 text-blue-400">The Truth NFT</h3>
              <p className="text-gray-300 mb-4">77 unique editions - Original collection</p>
              <div className="text-3xl font-bold text-green-400 mb-2">0.169 ETH</div>
              <div className="text-sm text-gray-400 mb-4">~$777 USD • Pay with TRUTH: 1000 tokens</div>
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-3 rounded-lg font-semibold hover:shadow-lg transition-all mb-2">
                Mint with ETH
              </button>
              <button className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
                Mint with TRUTH
              </button>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-green-400/50 transition-all">
              <img
                src="https://copper-active-hawk-266.mypinata.cloud/ipfs/bafkreibx3bnrvluzzuzving6wnkgt3wzh4tekhequcbyiielyffmfk2j6a"
                alt="Bonus Gift NFT"
                className="w-full h-48 object-cover rounded-lg mb-4"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div className="text-4xl mb-4 hidden">🎁</div>
              <h3 className="text-xl font-bold mb-2 text-green-400">Bonus Gift</h3>
              <p className="text-gray-300 mb-4">145,000 editions - Community entry</p>
              <div className="text-3xl font-bold text-green-400 mb-2">0.039 ETH</div>
              <div className="text-sm text-gray-400 mb-4">~$145 USD • Pay with CREATOR: 5000 coins</div>
              <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 py-3 rounded-lg font-semibold hover:shadow-lg transition-all mb-2">
                Mint with ETH
              </button>
              <button className="w-full bg-gradient-to-r from-orange-600 to-red-600 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
                Mint with CREATOR
              </button>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-yellow-400/50 transition-all">
              <img
                src="https://copper-active-hawk-266.mypinata.cloud/ipfs/bafybeib2ujzv6k3m5t4acypn7xs3nufobsiytyrcnxh6aeevrodbuuinwu"
                alt="Part Three NFT"
                className="w-full h-48 object-cover rounded-lg mb-4"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div className="text-4xl mb-4 hidden">📜</div>
              <h3 className="text-xl font-bold mb-2 text-yellow-400">Part Three</h3>
              <p className="text-gray-300 mb-4">444 editions - Legal framework</p>
              <div className="text-3xl font-bold text-green-400 mb-2">0.478 ETH</div>
              <div className="text-sm text-gray-400 mb-4">~$1,777 USD • Pay with TRUTH: 2500 tokens</div>
              <button className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 py-3 rounded-lg font-semibold hover:shadow-lg transition-all mb-2">
                Mint with ETH
              </button>
              <button className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
                Mint with TRUTH
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-6 rounded-lg border border-purple-500/30">
            <h3 className="text-xl font-bold mb-3 text-purple-300">💰 Payment Options</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">💎 ETH Payment</h4>
                <p className="text-gray-300">Standard blockchain payment with MetaMask or any Web3 wallet</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🔮 TRUTH Token Payment</h4>
                <p className="text-gray-300">Get 10% discount + bonus governance rights when paying with TRUTH</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">👤 Creator Coin Payment</h4>
                <p className="text-gray-300">Exclusive community benefits + early access to future drops</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">💵 Stablecoin Payment</h4>
                <p className="text-gray-300">Use USDC or DAI for price stability and convenience</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gasless Minting */}
      {activeTab === 'gasless' && (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
          <h2 className="text-3xl font-bold mb-6 text-purple-300">⚡ Gasless Minting</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">How It Works</h3>
              <ul className="space-y-3 text-gray-300">
                <li>• No ETH required for gas fees</li>
                <li>• Meta-transactions sponsored by platform</li>
                <li>• Instant minting without blockchain complexity</li>
                <li>• Perfect for new Web3 users</li>
              </ul>
            </div>
            <div className="space-y-4">
              <div className="bg-purple-900/30 p-6 rounded-lg">
                <h4 className="font-semibold mb-2">The Truth NFT</h4>
                <p className="text-sm text-gray-400 mb-4">Gasless mint - Pay only NFT price</p>
                <button className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg">
                  Gasless Mint - 0.169 ETH
                </button>
              </div>
              <div className="bg-blue-900/30 p-6 rounded-lg">
                <h4 className="font-semibold mb-2">Bonus Gift</h4>
                <p className="text-sm text-gray-400 mb-4">Gasless mint - No gas fees</p>
                <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg">
                  Gasless Mint - 0.039 ETH
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fiat to NFT */}
      {activeTab === 'fiat' && (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
          <h2 className="text-3xl font-bold mb-6 text-blue-300">💳 Direct Fiat to NFT</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">No Crypto? No Problem!</h3>
              <ul className="space-y-3 text-gray-300 mb-6">
                <li>• Pay with credit/debit card</li>
                <li>• Automatic wallet creation</li>
                <li>• Secure private key backup</li>
                <li>• Instant NFT delivery</li>
              </ul>
              <div className="bg-yellow-900/30 p-4 rounded-lg">
                <p className="text-yellow-300 text-sm">
                  🔐 Your wallet will be created automatically and securely backed up.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <input type="email" placeholder="Email address" className="w-full bg-black/50 border border-gray-600 rounded-lg px-4 py-3" />
              <input type="text" placeholder="Card number" className="w-full bg-black/50 border border-gray-600 rounded-lg px-4 py-3" />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="MM/YY" className="bg-black/50 border border-gray-600 rounded-lg px-4 py-3" />
                <input type="text" placeholder="CVC" className="bg-black/50 border border-gray-600 rounded-lg px-4 py-3" />
              </div>
              <select className="w-full bg-black/50 border border-gray-600 rounded-lg px-4 py-3">
                <option>The Truth NFT - $777</option>
                <option>Bonus Gift NFT - $145</option>
                <option>Part Three NFT - $1,777</option>
              </select>
              <button className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg font-semibold">
                Purchase with Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subscriptions */}
      {activeTab === 'subscription' && (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 p-8 rounded-2xl border border-purple-500/30">
            <h3 className="text-2xl font-bold mb-4">Monthly Access</h3>
            <div className="text-4xl font-bold mb-4">$29.99<span className="text-lg font-normal">/month</span></div>
            <ul className="space-y-3 text-gray-300 mb-6">
              <li>• Basic content library access</li>
              <li>• Community Discord access</li>
              <li>• Monthly philosophy sessions</li>
              <li>• Email newsletter</li>
            </ul>
            <button className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg font-semibold">
              Subscribe Monthly
            </button>
          </div>

          <div className="bg-gradient-to-br from-yellow-900/50 to-orange-800/30 p-8 rounded-2xl border border-yellow-500/30">
            <h3 className="text-2xl font-bold mb-4">Yearly Access</h3>
            <div className="text-4xl font-bold mb-4">$299.99<span className="text-lg font-normal">/year</span></div>
            <ul className="space-y-3 text-gray-300 mb-6">
              <li>• Full content library access</li>
              <li>• Premium Discord channels</li>
              <li>• Weekly live sessions</li>
              <li>• Quarterly NFT airdrops</li>
              <li>• Governance voting rights</li>
            </ul>
            <button className="w-full bg-yellow-600 hover:bg-yellow-700 py-3 rounded-lg font-semibold">
              Subscribe Yearly
            </button>
          </div>
        </div>
      )}

      {/* Multi-Token Payments */}
      {activeTab === 'crypto' && (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
          <h2 className="text-3xl font-bold mb-6 text-cyan-300">🪙 Multi-Token Payments</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              { symbol: 'TRUTH', name: 'Truth Token', price: '1000', icon: '🔮', address: '0x8f6cf6f7747e170f4768533b869c339dc3d30a3c', featured: true },
              { symbol: 'CREATOR', name: 'Creator Coin', price: '5000', icon: '👤', address: '0x22b0434e89882f8e6841d340b28427646c015aa7', featured: true },
              { symbol: 'USDC', name: 'USD Coin', price: '777.00', icon: '💵', address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913' },
              { symbol: 'DAI', name: 'DAI Stablecoin', price: '777.00', icon: '💰', address: '0x50c5725949a6f0c72e6c4a641f24049a917db0cb' },
              { symbol: 'WETH', name: 'Wrapped ETH', price: '0.169', icon: '⟐', address: '0x4200000000000000000000000000000000000006' },
              { symbol: 'ETH', name: 'Ethereum', price: '0.169', icon: '💎', address: 'native' }
            ].map(token => (
              <div 
                key={token.symbol} 
                className={`bg-black/50 p-6 rounded-lg border transition-all ${
                  token.featured 
                    ? 'border-yellow-400 bg-yellow-400/10' 
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                {token.featured && (
                  <div className="mb-2">
                    <span className="text-xs px-2 py-1 bg-yellow-600 rounded">FEATURED</span>
                  </div>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{token.icon}</span>
                  <div>
                    <div className="font-bold text-lg">{token.symbol}</div>
                    <div className="text-sm text-gray-400">{token.name}</div>
                  </div>
                </div>
                <div className="text-2xl font-bold mb-2">{token.price} {token.symbol}</div>
                {token.address && (
                  <div className="text-xs text-gray-500 mb-4 font-mono break-all">
                    {token.address.slice(0, 10)}...{token.address.slice(-8)}
                  </div>
                )}
                <button className={`w-full py-2 rounded-lg text-sm font-semibold transition-all ${
                  token.featured
                    ? 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:shadow-lg'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600'
                }`}
                onClick={() => {
                  if (token.symbol === 'ETH' || token.symbol === 'WETH') {
                    // Handle ETH/WETH payment - potentially direct call or link
                    alert(`Initiate ETH/WETH payment for ${token.price} ${token.symbol}`);
                  } else if (token.address) {
                    // For other tokens, assume it's a custom payment flow
                    alert(`Initiate ${token.symbol} payment for ${token.price} ${token.symbol}`);
                  }
                }}
                >
                  Pay with {token.symbol}
                </button>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 p-6 rounded-lg border border-yellow-500/30">
            <h3 className="text-xl font-bold mb-3 text-yellow-400">🎯 Token Benefits</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2 text-yellow-300">TRUTH Token Holders</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• 10% discount on all NFT purchases</li>
                  <li>• Governance voting rights</li>
                  <li>• Staking rewards (coming soon)</li>
                  <li>• Priority minting access</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-orange-300">Creator Coin Holders</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Exclusive content library access</li>
                  <li>• Discord community perks</li>
                  <li>• Early access to new releases</li>
                  <li>• Direct creator interaction</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;