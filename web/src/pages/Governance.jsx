
import React, { useState, useEffect } from 'react';
import { useTruth } from '../context/TruthContext';

const Governance = () => {
  const { walletConnected, truthBalance } = useTruth();
  const [proposals, setProposals] = useState([]);

  useEffect(() => {
    loadProposals();
  }, []);

  const loadProposals = async () => {
    try {
      const response = await fetch('/api/governance/proposals');
      const data = await response.json();
      setProposals(data || []);
    } catch (error) {
      console.error('Failed to load proposals:', error);
      setProposals([
        {
          id: 1,
          title: 'Increase Liquidity Pool Allocation',
          description: 'Proposal to allocate 15% of treasury to TRUTH/ETH liquidity pool',
          status: 'Active',
          yesVotes: 67,
          noVotes: 33
        }
      ]);
    }
  };

  const vote = async (proposalId, voteChoice) => {
    if (!walletConnected) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      const response = await fetch('/api/governance/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposalId, vote: voteChoice })
      });
      
      if (response.ok) {
        alert('Vote recorded successfully!');
        loadProposals();
      }
    } catch (error) {
      console.error('Vote failed:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          🗳️ Governance Dashboard
        </h1>
        <p className="text-xl text-gray-300">Community-driven decision making</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {proposals.length > 0 ? (
            proposals.map(proposal => (
              <div key={proposal.id} className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{proposal.title}</h3>
                  <span className="px-3 py-1 bg-green-600 text-green-100 text-sm rounded-full">
                    {proposal.status}
                  </span>
                </div>
                <p className="text-gray-300 mb-6">{proposal.description}</p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">{proposal.yesVotes}%</div>
                    <div className="text-sm text-gray-400">Yes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-400">{proposal.noVotes}%</div>
                    <div className="text-sm text-gray-400">No</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => vote(proposal.id, 'yes')}
                    className="flex-1 bg-green-600 hover:bg-green-700 py-3 px-6 rounded-lg font-semibold transition-all"
                  >
                    👍 Vote Yes
                  </button>
                  <button
                    onClick={() => vote(proposal.id, 'no')}
                    className="flex-1 bg-red-600 hover:bg-red-700 py-3 px-6 rounded-lg font-semibold transition-all"
                  >
                    👎 Vote No
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-12 border border-white/10 text-center">
              <h3 className="text-xl font-semibold mb-2">No Active Proposals</h3>
              <p className="text-gray-400">Check back later for community governance proposals</p>
            </div>
          )}
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-bold mb-4 text-purple-400">Your Voting Power</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-300">TRUTH Tokens:</span>
              <span className="font-bold text-yellow-400">{truthBalance}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Voting Power:</span>
              <span className="font-bold text-green-400">
                {walletConnected ? 'Active' : 'Connect Wallet'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Governance;
