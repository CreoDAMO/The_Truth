// Static fallbacks for GitHub Pages deployment
// This handles dynamic content when backend APIs are not available

console.log('🔄 Loading static fallbacks for GitHub Pages...');

// Mock data for treasury and governance
const mockTreasuryData = {
    balance: "2.5 ETH",
    multisigAddress: "0x742d35Cc...C4A",
    totalTransactions: 1247,
    lastUpdate: new Date().toISOString()
};

const mockGovernanceData = {
    proposals: [
        {
            id: 1,
            title: "Bonus Gift Collection Pricing",
            description: "Should we reduce the Bonus Gift NFT price from 0.039 ETH to 0.025 ETH?",
            yesVotes: 67,
            noVotes: 33,
            status: 'active'
        }
    ]
};

const mockPhilosophyMetrics = {
    truthValidationScore: 94.7,
    institutionalTranslationRate: 67.3,
    abundanceImpact: 1313,
    witnessEngagement: 87.2,
    paradoxDemonstration: 98.1
};

// Function to populate loading placeholders with static data
function populateStaticData() {
    console.log('📊 Populating static data...');
    
    // Treasury data
    const treasuryElements = {
        'treasury-balance': mockTreasuryData.balance,
        'multisig-address': mockTreasuryData.multisigAddress,
        'total-transactions': mockTreasuryData.totalTransactions
    };
    
    // Philosophy metrics
    const philosophyElements = {
        'truth-score': mockPhilosophyMetrics.truthValidationScore + '%',
        'translation-rate': mockPhilosophyMetrics.institutionalTranslationRate + '%',
        'abundance-impact': mockPhilosophyMetrics.abundanceImpact,
        'witness-engagement': mockPhilosophyMetrics.witnessEngagement + '%'
    };
    
    // Populate elements if they exist
    Object.entries({...treasuryElements, ...philosophyElements}).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            if (element.textContent.includes('Loading')) {
                element.textContent = value;
                element.style.color = '#4CAF50';
            }
        }
    });
}

// Client-side blockchain integration for Base Network
async function loadBlockchainData() {
    if (typeof ethers !== 'undefined') {
        try {
            console.log('🔗 Connecting to Base Network...');
            const provider = new ethers.providers.JsonRpcProvider("https://mainnet.base.org");
            
            // Check if we can connect
            const network = await provider.getNetwork();
            console.log('✅ Connected to network:', network.name);
            
            // You can add real contract calls here when contracts are deployed
            // const contract = new ethers.Contract(contractAddress, abi, provider);
            // const balance = await contract.balanceOf(address);
            
        } catch (error) {
            console.log('⚠️ Blockchain connection failed, using static data');
            populateStaticData();
        }
    } else {
        console.log('📊 Ethers.js not available, using static data');
        populateStaticData();
    }
}

// Initialize static fallbacks when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            populateStaticData();
            loadBlockchainData();
        }, 1000);
    });
} else {
    setTimeout(() => {
        populateStaticData();
        loadBlockchainData();
    }, 1000);
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        mockTreasuryData,
        mockGovernanceData, 
        mockPhilosophyMetrics,
        populateStaticData,
        loadBlockchainData
    };
}