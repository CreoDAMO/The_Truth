
import React, { useState } from 'react';
import { useTruth } from '../context/TruthContext';

const Social = () => {
  const { walletConnected } = useTruth();
  const [referralCode, setReferralCode] = useState('');
  const [shareMessage, setShareMessage] = useState("Just discovered The Truth NFT - where philosophy meets blockchain!");

  const generateReferralCode = () => {
    if (!walletConnected) {
      alert('Please connect your wallet first');
      return;
    }
    const code = `TRUTH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setReferralCode(code);
    alert(`Your referral code: ${code}\nShare this with friends to earn rewards!`);
  };

  const shareToSocial = (platform) => {
    const shareUrl = encodeURIComponent(window.location.origin);
    const text = encodeURIComponent(shareMessage);
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
      instagram: `https://www.instagram.com/` // Instagram doesn't support URL sharing
    };

    if (platform === 'instagram') {
      alert('Instagram sharing works through the mobile app. Copy this message:\n\n' + shareMessage);
    } else {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
          📱 Social & Viral Features
        </h1>
        <p className="text-xl text-gray-300">Share and grow the Truth community</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Referral System */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
          <h2 className="text-3xl font-bold mb-6 text-pink-300">🎁 Referral Rewards</h2>
          
          <div className="bg-gradient-to-r from-pink-900/30 to-purple-900/30 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">How It Works</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center gap-3">
                <span className="text-pink-400">•</span>
                Share your unique referral code
              </li>
              <li className="flex items-center gap-3">
                <span className="text-pink-400">•</span>
                Earn 0.01 ETH for each NFT mint
              </li>
              <li className="flex items-center gap-3">
                <span className="text-pink-400">•</span>
                Get $10 for subscription referrals
              </li>
              <li className="flex items-center gap-3">
                <span className="text-pink-400">•</span>
                Your friends get discounts too!
              </li>
            </ul>
          </div>

          <div className="bg-black/30 p-6 rounded-lg mb-4">
            <h4 className="font-semibold mb-4">Your Referral Stats</h4>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-pink-400">0</div>
                <div className="text-sm text-gray-400">Total Referrals</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400">$0.00</div>
                <div className="text-sm text-gray-400">Earnings</div>
              </div>
            </div>
          </div>

          <button 
            onClick={generateReferralCode}
            className="w-full bg-pink-600 hover:bg-pink-700 py-3 rounded-lg font-semibold transition-all"
          >
            {referralCode ? 'Generate New Code' : 'Generate Referral Code'}
          </button>
          {referralCode && (
            <div className="mt-3 bg-green-900/30 p-3 rounded-lg border border-green-500/30">
              <p className="text-sm text-gray-400 mb-1">Your Referral Code:</p>
              <p className="text-lg font-bold text-green-400">{referralCode}</p>
            </div>
          )}
        </div>

        {/* Social Sharing */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
          <h2 className="text-3xl font-bold mb-6 text-purple-300">🌐 Social Sharing</h2>
          
          <p className="text-gray-300 mb-6">
            Share your NFT collection and philosophical insights across social media with 
            beautiful embedded previews and custom messaging.
          </p>

          <div className="space-y-3 mb-6">
            <button 
              onClick={() => shareToSocial('twitter')}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 px-4 rounded-lg flex items-center gap-3 transition-all"
            >
              <span>🐦</span>
              Share on Twitter
            </button>
            <button 
              onClick={() => shareToSocial('facebook')}
              className="w-full bg-blue-700 hover:bg-blue-800 py-3 px-4 rounded-lg flex items-center gap-3 transition-all"
            >
              <span>📘</span>
              Share on Facebook
            </button>
            <button 
              onClick={() => shareToSocial('linkedin')}
              className="w-full bg-blue-800 hover:bg-blue-900 py-3 px-4 rounded-lg flex items-center gap-3 transition-all"
            >
              <span>💼</span>
              Share on LinkedIn
            </button>
            <button 
              onClick={() => shareToSocial('instagram')}
              className="w-full bg-pink-600 hover:bg-pink-700 py-3 px-4 rounded-lg flex items-center gap-3 transition-all"
            >
              <span>📷</span>
              Share on Instagram
            </button>
          </div>

          <div className="bg-purple-900/30 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Custom Share Message</h4>
            <textarea
              className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-4 py-3 mb-3 text-white"
              rows={3}
              placeholder="Customize your share message..."
              value={shareMessage}
              onChange={(e) => setShareMessage(e.target.value)}
            />
            <div className="text-xs text-gray-400">
              Preview: 🔮 The Truth NFT | Philosophy meets blockchain | Truth Score: 94.7%
            </div>
          </div>
        </div>
      </div>

      {/* Minting Events */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
        <h2 className="text-3xl font-bold mb-6 text-blue-300">🎉 Live Minting Events</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Upcoming Events</h3>
            <div className="space-y-4">
              <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/30">
                <h4 className="font-semibold mb-2">Truth Milestone: 2000 Holders</h4>
                <p className="text-sm text-gray-400 mb-2">October 25, 2025 at 3:00 PM UTC</p>
                <div className="bg-black/50 rounded-full h-2 mb-1">
                  <div className="bg-purple-500 h-2 rounded-full" style={{width: '62%'}}></div>
                </div>
                <div className="text-xs text-gray-400">1240/2000 holders</div>
              </div>
              <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-500/30">
                <h4 className="font-semibold mb-2">Philosophy Discussion Series</h4>
                <p className="text-sm text-gray-400 mb-2">November 1, 2025 at 7:00 PM UTC</p>
                <p className="text-sm">Monthly live discussion on Truth and institutional gaps</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Event Notifications</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer hover:text-pink-400 transition-colors">
                <input type="checkbox" className="rounded" defaultChecked />
                <span>Email notifications</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer hover:text-pink-400 transition-colors">
                <input type="checkbox" className="rounded" defaultChecked />
                <span>Discord announcements</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer hover:text-pink-400 transition-colors">
                <input type="checkbox" className="rounded" />
                <span>SMS reminders</span>
              </label>
            </div>
            <div className="mt-4 bg-pink-900/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Next Event in:</h4>
              <div className="text-2xl font-bold text-pink-400">21d 14h 27m</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Social;
