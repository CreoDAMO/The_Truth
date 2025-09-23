
// Static fallbacks for GitHub Pages deployment
// This handles dynamic content when backend APIs are not available

console.log('🔄 Loading static fallbacks for GitHub Pages...');

// Mock data for treasury and governance
const mockTreasuryData = {
    balance: "2.5 ETH",
    multisigAddress: "0x742d35Cc...C4A", 
    totalTransactions: 1247,
    lastUpdate: new Date().toISOString(),
    kycCompliance: 94.7,
    taxComplianceRate: 98.2
};

const mockGovernanceData = {
    proposals: [
        {
            id: 1,
            title: "Bonus Gift Collection Pricing",
            description: "Should we reduce the Bonus Gift NFT price from 0.039 ETH to 0.025 ETH?",
            yesVotes: 67,
            noVotes: 33,
            status: 'active',
            deadline: "2025-10-01"
        },
        {
            id: 2,
            title: "Treasury Diversification",
            description: "Approve allocation of 15% treasury funds to stable yield protocols",
            yesVotes: 78,
            noVotes: 22,
            status: 'active',
            deadline: "2025-09-30"
        }
    ],
    totalVotingPower: 145000,
    activeProposals: 2
};

const mockPhilosophyMetrics = {
    truthValidationScore: 94.7,
    institutionalTranslationRate: 67.3,
    abundanceImpact: 1313,
    witnessEngagement: 87.2,
    paradoxDemonstration: 98.1
};

const mockAnalyticsData = {
    totalHolders: 42,
    totalVolume: 2.1,
    floorPrice: 0.169,
    truthScore: 94.7,
    monthlyGrowth: 23.4,
    communityEngagement: 89.3
};

// Function to populate loading placeholders with static data
function loadStaticFallbacks() {
    console.log('🎭 Initializing static fallbacks...');
    
    // Treasury data fallbacks
    const treasuryElements = {
        'treasury-balance': mockTreasuryData.balance,
        'multisig-address': mockTreasuryData.multisigAddress,
        'total-transactions': mockTreasuryData.totalTransactions,
        'kyc-compliance': mockTreasuryData.kycCompliance + '%',
        'tax-compliance': mockTreasuryData.taxComplianceRate + '%'
    };

    // Analytics fallbacks
    const analyticsElements = {
        'total-holders': mockAnalyticsData.totalHolders,
        'total-volume': mockAnalyticsData.totalVolume + ' ETH',
        'floor-price': mockAnalyticsData.floorPrice + ' ETH',
        'truth-score': mockAnalyticsData.truthScore + '%',
        'live-holders': mockAnalyticsData.totalHolders,
        'live-volume': mockAnalyticsData.totalVolume,
        'live-price': mockAnalyticsData.floorPrice,
        'monthly-growth': mockAnalyticsData.monthlyGrowth + '%'
    };

    // Philosophy metrics fallbacks
    const philosophyElements = {
        'truth-validation': mockPhilosophyMetrics.truthValidationScore + '%',
        'translation-rate': mockPhilosophyMetrics.institutionalTranslationRate + '%',
        'abundance-impact': mockPhilosophyMetrics.abundanceImpact,
        'witness-engagement': mockPhilosophyMetrics.witnessEngagement + '%',
        'paradox-demo': mockPhilosophyMetrics.paradoxDemonstration + '%'
    };

    // Apply all fallbacks
    const allElements = { ...treasuryElements, ...analyticsElements, ...philosophyElements };
    
    Object.entries(allElements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
            element.classList.remove('loading');
        }
    });

    // Load governance proposals
    loadGovernanceProposals();

    // Replace loading states
    const loadingElements = document.querySelectorAll('.loading-placeholder, .loading');
    loadingElements.forEach(el => {
        if (el.textContent.includes('Loading')) {
            el.textContent = 'Data loaded (static mode)';
            el.classList.remove('loading');
        }
    });

    console.log('✅ Static fallbacks loaded successfully');
}

function loadGovernanceProposals() {
    const proposalsList = document.getElementById('proposals-list');
    if (proposalsList) {
        proposalsList.innerHTML = mockGovernanceData.proposals.map(proposal => `
            <div class="glass rounded-xl p-6 proposal-card">
                <div class="flex justify-between items-start mb-4">
                    <h3 class="text-lg font-semibold">${proposal.title}</h3>
                    <span class="px-3 py-1 bg-green-600 text-green-100 text-sm rounded-full">${proposal.status}</span>
                </div>
                <p class="text-gray-300 mb-4">${proposal.description}</p>
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div class="text-center">
                        <div class="text-2xl font-bold text-green-400">${proposal.yesVotes}%</div>
                        <div class="text-sm text-gray-400">Yes</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-red-400">${proposal.noVotes}%</div>
                        <div class="text-sm text-gray-400">No</div>
                    </div>
                </div>
                <div class="text-sm text-gray-400 mb-3">Deadline: ${proposal.deadline}</div>
                <div class="flex gap-3">
                    <button onclick="showStaticVoteMessage('${proposal.id}', 'yes')" class="flex-1 bg-green-600 hover:bg-green-700 py-2 px-4 rounded-lg">
                        👍 Vote Yes
                    </button>
                    <button onclick="showStaticVoteMessage('${proposal.id}', 'no')" class="flex-1 bg-red-600 hover:bg-red-700 py-2 px-4 rounded-lg">
                        👎 Vote No
                    </button>
                </div>
            </div>
        `).join('');
    }
}

function showStaticVoteMessage(proposalId, vote) {
    alert(`Static mode: Voting ${vote} for proposal ${proposalId}. Connect wallet and use live app for actual voting.`);
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadStaticFallbacks);
} else {
    loadStaticFallbacks();
}

// Export for manual triggering
window.loadStaticFallbacks = loadStaticFallbacks;
