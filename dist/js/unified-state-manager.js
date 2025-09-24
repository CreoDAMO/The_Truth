
// Unified State Manager for The Truth Ecosystem
class TruthEcosystemState {
    constructor() {
        this.state = {
            // Core user state
            walletConnected: false,
            walletAddress: null,
            networkId: null,
            
            // Token balances
            truthBalance: 0,
            creatorBalance: 0,
            ethBalance: 0,
            
            // NFT holdings
            nftCount: 0,
            nftCollections: [],
            
            // Analytics data
            totalVolume: 145700,
            totalHolders: 1247,
            truthScore: 94.7,
            translationGap: 67.3,
            abundanceMultiplier: 13.13,
            
            // Governance
            votingPower: 0,
            activeProposals: [],
            
            // Liquidity
            liquidityPositions: [],
            totalLPValue: 0,
            
            // Community
            communityLevel: 'Basic',
            revenueShare: 0,
            accessLevel: 'Standard',
            
            // System status
            loading: false,
            error: null,
            lastUpdated: null
        };
        
        this.listeners = new Set();
        this.apiCache = new Map();
        this.init();
    }
    
    init() {
        // Initialize with mock data for development
        this.loadMockData();
        
        // Set up periodic updates
        setInterval(() => this.syncData(), 30000);
        
        // Listen for wallet events
        this.setupWalletListeners();
        
        console.log('🌐 Truth Ecosystem State Manager initialized');
    }
    
    loadMockData() {
        // Load realistic mock data for all dashboards
        this.setState({
            totalVolume: 145700 + Math.random() * 1000,
            totalHolders: 1247 + Math.floor(Math.random() * 10),
            truthScore: 94.7 + Math.random() * 0.5,
            translationGap: 67.3 + Math.random() * 2,
            abundanceMultiplier: 13.13 + Math.random() * 0.5,
            
            activeProposals: [
                {
                    id: 1,
                    title: "Bonus Gift Collection Pricing",
                    description: "Should we reduce the Bonus Gift NFT price from 0.039 ETH to 0.025 ETH?",
                    yesVotes: 67,
                    noVotes: 33,
                    totalVotes: 1247,
                    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
                    status: 'active'
                },
                {
                    id: 2,
                    title: "Revenue Distribution",
                    description: "Allocate 15% of audiobook sales revenue to TRUTH token staking rewards?",
                    yesVotes: 82,
                    noVotes: 18,
                    totalVotes: 892,
                    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
                    status: 'active'
                }
            ],
            
            nftCollections: [
                { name: "The Truth Original", supply: 77, minted: 42, price: "0.1695 ETH" },
                { name: "Bonus Gift", supply: 145000, minted: 1250, price: "0.039 ETH" },
                { name: "Part Three", supply: 444, minted: 0, price: "TBD" }
            ],
            
            liquidityPositions: [
                { pair: "TRUTH/ETH", value: 2500, apy: 24.7 },
                { pair: "CREATOR/TRUTH", value: 1200, apy: 18.3 }
            ],
            
            lastUpdated: new Date().toISOString()
        });
    }
    
    setupWalletListeners() {
        if (typeof window.ethereum !== 'undefined') {
            window.ethereum.on('accountsChanged', (accounts) => {
                this.setState({
                    walletConnected: accounts.length > 0,
                    walletAddress: accounts[0] || null
                });
                
                if (accounts[0]) {
                    this.loadWalletData(accounts[0]);
                }
            });
            
            window.ethereum.on('chainChanged', (chainId) => {
                this.setState({ networkId: parseInt(chainId, 16) });
            });
        }
    }
    
    async loadWalletData(address) {
        this.setState({ loading: true });
        
        try {
            // Simulate loading wallet data
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Mock wallet data
            this.setState({
                truthBalance: 2500 + Math.random() * 500,
                creatorBalance: 15000 + Math.random() * 1000,
                ethBalance: 0.5 + Math.random() * 0.5,
                nftCount: Math.floor(Math.random() * 5) + 1,
                votingPower: Math.random() * 100,
                revenueShare: Math.random() * 50,
                loading: false
            });
            
        } catch (error) {
            this.setState({ 
                error: error.message,
                loading: false 
            });
        }
    }
    
    setState(newState) {
        const oldState = { ...this.state };
        this.state = { ...this.state, ...newState };
        
        // Notify all listeners
        this.listeners.forEach(listener => {
            try {
                listener(this.state, oldState);
            } catch (error) {
                console.error('Error in state listener:', error);
            }
        });
        
        // Update DOM elements
        this.updateDOM();
    }
    
    subscribe(listener) {
        this.listeners.add(listener);
        
        // Return unsubscribe function
        return () => {
            this.listeners.delete(listener);
        };
    }
    
    updateDOM() {
        // Update common elements across all dashboards
        this.updateElement('truthBalance', `${this.state.truthBalance.toFixed(2)} TRUTH`);
        this.updateElement('creatorBalance', `${this.state.creatorBalance.toFixed(2)} Creator`);
        this.updateElement('totalHolders', this.state.totalHolders.toLocaleString());
        this.updateElement('totalVolume', `${(this.state.totalVolume / 1000).toFixed(1)}K`);
        this.updateElement('truthScore', `${this.state.truthScore.toFixed(1)}%`);
        this.updateElement('revenueAmount', `$${this.state.revenueShare.toFixed(2)}`);
        this.updateElement('communityPower', `${this.state.votingPower.toFixed(1)}%`);
        this.updateElement('accessLevel', this.state.accessLevel);
        
        // Update wallet status
        const walletStatus = document.getElementById('walletStatus');
        if (walletStatus) {
            walletStatus.textContent = this.state.walletConnected 
                ? `${this.state.walletAddress?.slice(0, 6)}...${this.state.walletAddress?.slice(-4)}`
                : 'Not Connected';
        }
        
        // Update progress bars
        this.updateProgressBar('powerProgress', this.state.votingPower);
        this.updateProgressBar('truthPowerBar', this.state.truthScore);
    }
    
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
    
    updateProgressBar(id, percentage) {
        const element = document.getElementById(id);
        if (element) {
            element.style.width = `${Math.min(percentage, 100)}%`;
        }
    }
    
    async syncData() {
        // Simulate real-time data updates
        const updates = {
            totalVolume: this.state.totalVolume + Math.random() * 100,
            truthScore: Math.min(this.state.truthScore + Math.random() * 0.1, 100),
            lastUpdated: new Date().toISOString()
        };
        
        this.setState(updates);
    }
    
    // API methods for dashboards
    async getAnalyticsData() {
        return {
            totalSupply: 77,
            mintedCount: 42,
            totalRevenue: "12.5 ETH",
            holders: this.state.totalHolders,
            collections: this.state.nftCollections,
            recentTransactions: [
                { hash: "0x123...", amount: "0.1695 ETH", timestamp: new Date().toISOString() },
                { hash: "0x456...", amount: "0.039 ETH", timestamp: new Date().toISOString() }
            ]
        };
    }
    
    async getGovernanceData() {
        return {
            proposals: this.state.activeProposals,
            totalVotingPower: 5000,
            activeProposals: this.state.activeProposals.length
        };
    }
    
    async getCommunityData() {
        return {
            totalHolders: this.state.totalHolders,
            activeMembers: Math.floor(this.state.totalHolders * 0.8),
            truthScore: this.state.truthScore,
            engagement: 87.2,
            geographicDistribution: [
                { country: "US", holders: 15 },
                { country: "UK", holders: 8 },
                { country: "Canada", holders: 5 },
                { country: "Germany", holders: 4 },
                { country: "Other", holders: 3 }
            ]
        };
    }
    
    async getLiquidityData() {
        return {
            positions: this.state.liquidityPositions,
            totalValue: this.state.totalLPValue,
            rewards: this.state.revenueShare
        };
    }
}

// Global instance
window.TruthEcosystem = new TruthEcosystemState();

// Helper function for dashboards to connect
window.connectToTruthEcosystem = function(callback) {
    return window.TruthEcosystem.subscribe(callback);
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TruthEcosystemState;
}
