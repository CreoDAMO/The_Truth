/**
 * Unified Dashboard State Management
 * Connects all Truth NFT ecosystem dashboards as one unified system
 */

// Global ecosystem state
window.TruthEcosystem = window.TruthEcosystem || {
    // Core state
    initialized: false,
    walletConnected: false,
    walletAddress: null,
    currentPage: 'home',

    // Token balances and holdings
    truthBalance: 0,
    creatorBalance: 0,
    nftCount: 0,
    totalNFTValue: 0,

    // Governance and community
    governancePower: 0,
    votingWeight: 0,
    communityLevel: 'Basic',
    truthPowerScore: 94.7,

    // Liquidity and trading
    liquidityPositions: [],
    totalLPValue: 0,
    lpRewards: 0,

    // Analytics and insights
    portfolioValue: 0,
    totalVolume: 0,
    revenueShare: 0,

    // Cross-dashboard methods
    updateGlobalState: function(newState) {
        const previousState = { ...this };
        Object.assign(this, newState);

        console.log('🔄 Truth Ecosystem State Updated:', newState);

        // Broadcast state change to all dashboards
        this.broadcastStateChange(previousState);

        // Update localStorage for persistence
        this.saveState();
    },

    broadcastStateChange: function(previousState) {
        // Notify all dashboards of state changes
        window.dispatchEvent(new CustomEvent('truthEcosystemUpdate', {
            detail: {
                current: this,
                previous: previousState,
                changed: this.getChangedFields(previousState)
            }
        }));

        // Update all visible UI elements
        this.updateAllDashboards();
    },

    getChangedFields: function(previousState) {
        const changed = {};
        for (const key in this) {
            if (typeof this[key] !== 'function' && this[key] !== previousState[key]) {
                changed[key] = {
                    from: previousState[key],
                    to: this[key]
                };
            }
        }
        return changed;
    },

    updateAllDashboards: function() {
        // Update common UI elements across all pages
        this.updateWalletDisplay();
        this.updateBalanceDisplays();
        this.updateMetricsDisplays();
        this.updateNavigationState();
    },

    updateWalletDisplay: function() {
        const walletStatus = document.getElementById('walletStatus');
        const walletConnected = document.getElementById('walletConnected');
        const walletDisconnected = document.getElementById('walletDisconnected');
        const walletAddress = document.getElementById('walletAddress');

        if (walletStatus && walletConnected && walletDisconnected) {
            if (this.walletConnected && this.walletAddress) {
                walletConnected.style.display = 'block';
                walletDisconnected.style.display = 'none';

                if (walletAddress) {
                    walletAddress.textContent = `${this.walletAddress.slice(0, 6)}...${this.walletAddress.slice(-4)}`;
                }
            } else {
                walletConnected.style.display = 'none';
                walletDisconnected.style.display = 'block';
            }
        }
    },

    updateBalanceDisplays: function() {
        // Update token balance displays
        const truthBalance = document.getElementById('truthBalance');
        const creatorBalance = document.getElementById('creatorBalance');

        if (truthBalance) {
            truthBalance.textContent = `${this.truthBalance.toFixed(2)} TRUTH`;
        }

        if (creatorBalance) {
            creatorBalance.textContent = `${this.creatorBalance.toFixed(2)} Creator`;
        }

        // Update governance power
        const truthPowerBar = document.getElementById('truthPowerBar');
        const truthPowerText = document.getElementById('truthPowerText');

        if (truthPowerBar && truthPowerText) {
            const powerPercentage = Math.min(this.governancePower, 100);
            truthPowerBar.style.width = `${powerPercentage}%`;
            truthPowerText.textContent = `${powerPercentage.toFixed(1)}% Voting Power`;
        }
    },

    updateMetricsDisplays: function() {
        // Update ecosystem metrics
        const elements = {
            totalHolders: document.getElementById('totalHolders'),
            totalVolume: document.getElementById('totalVolume'),
            truthPower: document.getElementById('truthPower'),
            portfolioValue: document.getElementById('portfolioValue'),
            revenueAmount: document.getElementById('revenueAmount')
        };

        if (elements.totalVolume) {
            elements.totalVolume.textContent = `${(this.totalVolume / 1000).toFixed(1)}K`;
        }

        if (elements.truthPower) {
            elements.truthPower.textContent = `${this.truthPowerScore.toFixed(1)}%`;
        }

        if (elements.portfolioValue) {
            elements.portfolioValue.textContent = `$${this.portfolioValue.toLocaleString()}`;
        }

        if (elements.revenueAmount) {
            elements.revenueAmount.textContent = `$${this.revenueShare.toFixed(2)}`;
        }
    },

    updateNavigationState: function() {
        // Update navigation active states
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav-links a');

        navLinks.forEach(link => {
            link.classList.remove('active');

            const href = link.getAttribute('href') || link.getAttribute('onclick');
            if (href && href.includes(this.currentPage)) {
                link.classList.add('active');
            }
        });
    },

    // Cross-dashboard navigation with state preservation
    navigateTo: function(page, additionalData = {}) {
        const fromPage = this.currentPage;
        this.currentPage = page;

        // Preserve cross-dashboard context
        const navigationData = {
            fromPage: fromPage,
            timestamp: new Date().toISOString(),
            preservedData: {
                walletConnected: this.walletConnected,
                balances: {
                    truth: this.truthBalance,
                    creator: this.creatorBalance
                },
                ...additionalData
            }
        };

        // Update state with navigation context
        this.updateGlobalState({
            currentPage: page,
            lastNavigation: navigationData
        });

        // Perform navigation
        if (page === 'home') {
            window.location.href = '/';
        } else {
            window.location.href = `/${page}`;
        }

        // Track analytics
        this.trackCrossDashboardNavigation(fromPage, page, additionalData);
    },

    // Data sharing between dashboards
    shareDataBetweenDashboards: function(sourceData, targetDashboards) {
        const sharedData = {
            source: this.currentPage,
            timestamp: new Date().toISOString(),
            data: sourceData,
            targets: targetDashboards
        };

        // Store in session for immediate access
        sessionStorage.setItem('truthSharedData', JSON.stringify(sharedData));

        // Broadcast to open tabs/windows
        localStorage.setItem('truthCrossDashboard', JSON.stringify(sharedData));

        console.log('📊 Data shared between dashboards:', sharedData);

        return sharedData;
    },

    // Centralized wallet connection
    connectWallet: async function() {
        try {
            console.log('🦊 Attempting wallet connection...');

            if (typeof window.ethereum === 'undefined') {
                alert('MetaMask not found! Please install MetaMask.');
                return false;
            }

            // Request account access
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            if (accounts.length === 0) {
                throw new Error('No accounts returned');
            }

            const account = accounts[0];
            console.log('✅ Wallet connected:', account);

            // Switch to Base network if needed
            await this.switchToBase();

            // Initialize Web3 provider
            if (typeof ethers !== 'undefined') {
                this.web3 = new ethers.providers.Web3Provider(window.ethereum);
                this.signer = this.web3.getSigner();
            }

            // Update global state
            this.updateGlobalState({
                walletConnected: true,
                walletAddress: account
            });

            // Update all wallet displays
            this.updateWalletDisplay();

            // Load token balances if ethers is available
            if (this.web3) {
                await this.loadTokenBalances();
            }

            return true;

        } catch (error) {
            console.error('Wallet connection failed:', error);
            alert('Failed to connect wallet. Please try again.');
            return false;
        }
    },

    // Switch to Base network
    switchToBase: async function() {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x2105' }], // Base mainnet
            });
        } catch (switchError) {
            // Network doesn't exist, add it
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: '0x2105',
                            chainName: 'Base',
                            nativeCurrency: {
                                name: 'Ethereum',
                                symbol: 'ETH',
                                decimals: 18
                            },
                            rpcUrls: ['https://mainnet.base.org'],
                            blockExplorerUrls: ['https://basescan.org']
                        }]
                    });
                } catch (addError) {
                    console.error('Failed to add Base network:', addError);
                }
            }
        }
    },

    // Load token balances
    loadTokenBalances: async function() {
        try {
            if (!this.web3 || !this.walletAddress) return;

            // Contract addresses
            const truthTokenAddress = '0x8f6cf6f7747e170f4768533b869c339dc3d30a3c';
            const creatorTokenAddress = '0x22b0434e89882f8e6841d340b28427646c015aa7';

            // ERC20 ABI
            const erc20ABI = [
                "function balanceOf(address owner) view returns (uint256)",
                "function transfer(address to, uint256 amount) returns (bool)",
                "function approve(address spender, uint256 amount) returns (bool)"
            ];

            // Initialize contracts
            const truthContract = new ethers.Contract(truthTokenAddress, erc20ABI, this.signer);
            const creatorContract = new ethers.Contract(creatorTokenAddress, erc20ABI, this.signer);

            // Get balances
            const truthBalance = await truthContract.balanceOf(this.walletAddress);
            const truthFormatted = ethers.utils.formatUnits(truthBalance, 18);

            const creatorBalance = await creatorContract.balanceOf(this.walletAddress);
            const creatorFormatted = ethers.utils.formatUnits(creatorBalance, 18);

            // Update global state
            this.updateGlobalState({
                truthBalance: parseFloat(truthFormatted),
                creatorBalance: parseFloat(creatorFormatted)
            });

        } catch (error) {
            console.error('Failed to load token balances:', error);
        }
    },

    // Initialize unified dashboard system
    initialize: function() {
        if (this.initialized) return;

        console.log('🌐 Initializing Truth Ecosystem Unified Dashboard...');

        // Load saved state
        this.loadState();

        // Set up event listeners
        this.setupEventListeners();

        // Initialize page-specific functionality
        this.initializeCurrentPage();

        // Start monitoring
        this.startUnifiedMonitoring();

        this.initialized = true;
        console.log('✅ Truth Ecosystem Unified Dashboard initialized');
    },

    setupEventListeners: function() {
        // Set up ethereum event listeners for wallet changes
        if (typeof window.ethereum !== 'undefined') {
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length === 0) {
                    this.updateGlobalState({
                        walletConnected: false,
                        walletAddress: null,
                        truthBalance: 0,
                        creatorBalance: 0,
                        governancePower: 0
                    });
                    this.updateWalletDisplay();
                } else {
                    this.updateGlobalState({
                        walletAddress: accounts[0]
                    });
                    this.updateWalletDisplay();
                    // Reload token balances for new account
                    if (this.web3) {
                        this.loadTokenBalances();
                    }
                }
            });

            window.ethereum.on('chainChanged', (chainId) => {
                console.log('Chain changed to:', chainId);
                // Reload page to ensure clean state
                window.location.reload();
            });
        }

        // Set up wallet connection buttons after DOM is ready
        document.addEventListener('DOMContentLoaded', () => {
            this.setupWalletButtons();
        });

        // Also set up immediately if DOM is already ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupWalletButtons();
            });
        } else {
            setTimeout(() => {
                this.setupWalletButtons();
            }, 100);
        }

        // Listen for state changes from other tabs/windows
        window.addEventListener('storage', (e) => {
            if (e.key === 'truthCrossDashboard') {
                const sharedData = JSON.parse(e.newValue);
                this.handleCrossDashboardData(sharedData);
            }
        });

        // Listen for wallet connection changes
        window.addEventListener('walletConnected', (e) => {
            this.updateGlobalState({
                walletConnected: true,
                walletAddress: e.detail.address
            });
        });

        window.addEventListener('walletDisconnected', () => {
            this.updateGlobalState({
                walletConnected: false,
                walletAddress: null,
                truthBalance: 0,
                creatorBalance: 0,
                governancePower: 0
            });
        });

        // Listen for token balance updates
        window.addEventListener('tokenBalanceUpdate', (e) => {
            this.updateGlobalState({
                truthBalance: e.detail.truthBalance || this.truthBalance,
                creatorBalance: e.detail.creatorBalance || this.creatorBalance,
                portfolioValue: e.detail.portfolioValue || this.portfolioValue
            });
        });

        // Listen for liquidity position updates
        window.addEventListener('liquidityUpdate', (e) => {
            this.updateGlobalState({
                liquidityPositions: e.detail.positions || this.liquidityPositions,
                totalLPValue: e.detail.totalValue || this.totalLPValue,
                lpRewards: e.detail.rewards || this.lpRewards
            });
        });
    },

    // Set up wallet connection buttons
    setupWalletButtons: function() {
        // Wait for DOM to be fully loaded
        const setupButtons = () => {
            // Find all wallet connection buttons with multiple selectors
            const selectors = [
                '#connectWallet',
                '.wallet-btn',
                '[onclick*="connectWallet"]',
                'button[class*="connect"]',
                '.btn-connect'
            ];

            let walletButtons = [];
            selectors.forEach(selector => {
                try {
                    const buttons = document.querySelectorAll(selector);
                    walletButtons = [...walletButtons, ...buttons];
                } catch (e) {
                    console.warn('Selector error:', selector, e);
                }
            });

            // Remove duplicates
            walletButtons = [...new Set(walletButtons)];

            walletButtons.forEach((button, index) => {
                try {
                    // Remove existing onclick handlers
                    button.removeAttribute('onclick');

                    // Remove existing event listeners by cloning the node
                    const newButton = button.cloneNode(true);
                    button.parentNode.replaceChild(newButton, button);

                    // Add unified wallet connection handler
                    newButton.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log(`🔗 Wallet button clicked: ${index}`);
                        this.connectWallet();
                    });
                } catch (error) {
                    console.warn('Error setting up wallet button:', error);
                }
            });

            console.log(`🔗 Set up ${walletButtons.length} wallet connection buttons`);
        };

        // Setup immediately and after a delay
        setupButtons();
        setTimeout(setupButtons, 1000);
        setTimeout(setupButtons, 3000);
    },

    initializeCurrentPage: function() {
        const path = window.location.pathname;

        if (path === '/' || path === '/home') {
            this.currentPage = 'home';
        } else {
            this.currentPage = path.replace('/', '') || 'home';
        }

        // Page-specific initialization
        switch (this.currentPage) {
            case 'liquidity':
                this.initializeLiquidityDashboard();
                break;
            case 'governance':
                this.initializeGovernanceDashboard();
                break;
            case 'analytics':
                this.initializeAnalyticsDashboard();
                break;
            default:
                this.initializeHomeDashboard();
        }
    },

    initializeHomeDashboard: function() {
        // Initialize home dashboard with unified state
        console.log('🏠 Initializing Home Dashboard with unified state');
        this.updateAllDashboards();
    },

    initializeLiquidityDashboard: function() {
        console.log('🌊 Initializing Liquidity Dashboard with unified state');

        // Sync liquidity data with global state
        if (this.liquidityPositions.length > 0) {
            this.displayLiquidityPositions();
        }

        // Check for shared data from other dashboards
        const sharedData = sessionStorage.getItem('truthSharedData');
        if (sharedData) {
            const data = JSON.parse(sharedData);
            if (data.targets.includes('liquidity')) {
                this.applySharedDataToLiquidity(data);
            }
        }
    },

    initializeGovernanceDashboard: function() {
        console.log('🗳️ Initializing Governance Dashboard with unified state');

        // Update voting power based on token balances and LP positions
        const votingPower = this.calculateVotingPower();
        this.updateGlobalState({ governancePower: votingPower });
    },

    initializeAnalyticsDashboard: function() {
        console.log('📊 Initializing Analytics Dashboard with unified state');

        // Aggregate data from all sources
        const analyticsData = this.aggregateAnalyticsData();
        this.updateAnalyticsDisplay(analyticsData);
    },

    calculateVotingPower: function() {
        // Calculate voting power based on TRUTH tokens + LP positions
        const tokenPower = this.truthBalance * 0.1; // 10% weight per TRUTH token
        const lpPower = this.totalLPValue * 0.05; // 5% weight per dollar in LP
        const nftPower = this.nftCount * 2; // 2% weight per NFT

        return Math.min(tokenPower + lpPower + nftPower, 100);
    },

    aggregateAnalyticsData: function() {
        return {
            portfolioBreakdown: {
                tokens: this.truthBalance + this.creatorBalance,
                liquidity: this.totalLPValue,
                nfts: this.totalNFTValue,
                rewards: this.lpRewards + this.revenueShare
            },
            performance: {
                totalValue: this.portfolioValue,
                volume: this.totalVolume,
                governancePower: this.governancePower,
                truthPower: this.truthPowerScore
            },
            activity: {
                liquidityPositions: this.liquidityPositions.length,
                nftHoldings: this.nftCount,
                communityLevel: this.communityLevel
            }
        };
    },

    // State persistence
    saveState: function() {
        const stateToSave = { ...this };
        delete stateToSave.initialize;
        delete stateToSave.updateGlobalState;
        delete stateToSave.broadcastStateChange;
        // Remove all function properties
        Object.keys(stateToSave).forEach(key => {
            if (typeof stateToSave[key] === 'function') {
                delete stateToSave[key];
            }
        });

        localStorage.setItem('truthEcosystemState', JSON.stringify(stateToSave));
    },

    loadState: function() {
        const savedState = localStorage.getItem('truthEcosystemState');
        if (savedState) {
            try {
                const state = JSON.parse(savedState);
                Object.assign(this, state);
                console.log('📂 Loaded saved Truth Ecosystem state');
            } catch (error) {
                console.warn('⚠️ Failed to load saved state:', error);
            }
        }
    },

    // Monitoring and updates
    startUnifiedMonitoring: function() {
        // Monitor and sync data every 30 seconds
        setInterval(() => {
            this.syncUnifiedData();
        }, 30000);

        // Monitor for wallet changes
        setInterval(() => {
            this.checkWalletState();
        }, 5000);
    },

    syncUnifiedData: function() {
        console.log('🔄 Syncing unified dashboard data...');

        // This would integrate with real APIs in production
        const mockUpdates = {
            totalVolume: this.totalVolume + Math.random() * 1000,
            portfolioValue: this.portfolioValue + Math.random() * 100,
            truthPowerScore: Math.min(this.truthPowerScore + Math.random() * 0.5, 100)
        };

        this.updateGlobalState(mockUpdates);
    },

    checkWalletState: function() {
        // Check if wallet connection changed
        if (typeof window.ethereum !== 'undefined') {
            window.ethereum.request({ method: 'eth_accounts' })
                .then(accounts => {
                    const isConnected = accounts.length > 0;
                    const address = accounts[0];

                    if (isConnected !== this.walletConnected || address !== this.walletAddress) {
                        this.updateGlobalState({
                            walletConnected: isConnected,
                            walletAddress: address || null
                        });
                    }
                })
                .catch(console.error);
        }
    },

    // Analytics and tracking
    trackCrossDashboardNavigation: function(from, to, data) {
        const event = {
            event: 'cross_dashboard_navigation',
            from: from,
            to: to,
            timestamp: new Date().toISOString(),
            data: data,
            userState: {
                walletConnected: this.walletConnected,
                portfolioValue: this.portfolioValue,
                governancePower: this.governancePower
            }
        };

        // Send to analytics endpoint
        fetch('/api/track-event', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(event)
        }).catch(console.error);

        console.log('📈 Cross-dashboard navigation tracked:', event);
    },

    // Helper methods for dashboard integration
    handleCrossDashboardData: function(sharedData) {
        console.log('📨 Received cross-dashboard data:', sharedData);

        if (sharedData.targets.includes(this.currentPage)) {
            // Apply shared data to current dashboard
            this.applySharedData(sharedData);
        }
    },

    applySharedData: function(sharedData) {
        // Apply shared data based on current dashboard
        switch (this.currentPage) {
            case 'liquidity':
                this.applySharedDataToLiquidity(sharedData);
                break;
            case 'governance':
                this.applySharedDataToGovernance(sharedData);
                break;
            case 'analytics':
                this.applySharedDataToAnalytics(sharedData);
                break;
        }
    },

    applySharedDataToLiquidity: function(sharedData) {
        if (sharedData.data.tokenBalances) {
            // Update liquidity dashboard with token balance data
            this.updateGlobalState({
                truthBalance: sharedData.data.tokenBalances.truth || this.truthBalance,
                creatorBalance: sharedData.data.tokenBalances.creator || this.creatorBalance
            });
        }
    },

    applySharedDataToGovernance: function(sharedData) {
        if (sharedData.data.liquidityData) {
            // Update governance power based on liquidity positions
            const lpValue = Object.values(sharedData.data.liquidityData).reduce((sum, val) => {
                return sum + (parseFloat(val.replace(/[$K]/g, '')) * 1000);
            }, 0);

            this.updateGlobalState({ totalLPValue: lpValue });
        }
    },

    applySharedDataToAnalytics: function(sharedData) {
        // Aggregate all shared data for analytics
        this.updateGlobalState({
            lastSharedData: sharedData,
            crossDashboardSync: new Date().toISOString()
        });
    }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure other scripts are loaded
    setTimeout(() => {
        window.TruthEcosystem.initialize();
    }, 500);
});

console.log('🌐 Truth Ecosystem Unified Dashboard State Manager loaded');