
/**
 * Dashboard Coordinator - Ensures all 11 dashboards work as a unified system
 * Manages state synchronization, navigation, and cross-dashboard communication
 */

class TruthDashboardCoordinator {
    constructor() {
        this.dashboards = {
            home: { path: '/', name: 'Home Dashboard', active: false },
            analytics: { path: '/analytics', name: 'Analytics Dashboard', active: false },
            governance: { path: '/governance', name: 'Governance Dashboard', active: false },
            community: { path: '/community', name: 'Community Dashboard', active: false },
            payments: { path: '/payments', name: 'Payments Dashboard', active: false },
            liquidity: { path: '/liquidity', name: 'Liquidity Dashboard', active: false },
            social: { path: '/social', name: 'Social Dashboard', active: false },
            ai: { path: '/ai-insights', name: 'AI Insights Dashboard', active: false },
            lawful: { path: '/lawful', name: 'Lawful Dashboard', active: false },
            shop: { path: '/shop', name: 'Shop Dashboard', active: false },
            deploy: { path: '/deploy', name: 'Deploy Dashboard', active: false }
        };
        
        this.sharedState = {};
        this.activeConnections = new Set();
        this.initialized = false;
        
        this.init();
    }
    
    init() {
        console.log('🎛️ Initializing Truth Dashboard Coordinator...');
        
        // Initialize shared state
        this.initializeSharedState();
        
        // Set up cross-dashboard communication
        this.setupCommunication();
        
        // Set up navigation coordination
        this.setupNavigation();
        
        // Set up state synchronization
        this.setupStateSynchronization();
        
        // Mark as initialized
        this.initialized = true;
        
        console.log('✅ Dashboard Coordinator initialized - All 11 dashboards unified');
        
        // Notify all dashboards of coordinator readiness
        window.dispatchEvent(new CustomEvent('dashboardCoordinatorReady', {
            detail: { coordinator: this, dashboards: this.dashboards }
        }));
    }
    
    initializeSharedState() {
        this.sharedState = {
            // Wallet state
            wallet: {
                connected: false,
                address: null,
                network: null
            },
            
            // Token balances
            tokens: {
                truth: 0,
                creator: 0,
                eth: 0
            },
            
            // NFT holdings
            nfts: {
                count: 0,
                collections: {},
                totalValue: 0
            },
            
            // Governance data
            governance: {
                votingPower: 0,
                proposals: [],
                votes: {}
            },
            
            // Liquidity data
            liquidity: {
                positions: [],
                totalValue: 0,
                rewards: 0
            },
            
            // Community data
            community: {
                level: 'Basic',
                engagement: 0,
                rewards: 0
            },
            
            // Analytics data
            analytics: {
                portfolioValue: 0,
                truthScore: 94.7,
                activity: []
            },
            
            // Navigation state
            navigation: {
                currentDashboard: 'home',
                previousDashboard: null,
                history: []
            },
            
            // Sync metadata
            lastUpdated: new Date().toISOString(),
            version: '1.0.0'
        };
    }
    
    setupCommunication() {
        // Listen for state updates from any dashboard
        window.addEventListener('dashboardStateUpdate', (event) => {
            this.handleStateUpdate(event.detail);
        });
        
        // Listen for navigation requests
        window.addEventListener('dashboardNavigationRequest', (event) => {
            this.handleNavigationRequest(event.detail);
        });
        
        // Listen for data sharing requests
        window.addEventListener('dashboardDataShare', (event) => {
            this.handleDataShare(event.detail);
        });
        
        // Set up periodic state broadcast
        setInterval(() => {
            this.broadcastSharedState();
        }, 30000); // Every 30 seconds
    }
    
    setupNavigation() {
        // Override all navigation to go through coordinator
        window.navigateToPage = (page, context = {}) => {
            this.navigateTo(page, context);
        };
        
        // Listen for browser navigation
        window.addEventListener('popstate', (event) => {
            const path = window.location.pathname;
            const dashboard = this.getDashboardFromPath(path);
            this.updateNavigationState(dashboard, { type: 'browser' });
        });
    }
    
    setupStateSynchronization() {
        // Sync with server state periodically
        setInterval(() => {
            this.syncWithServer();
        }, 60000); // Every minute
        
        // Listen for unified ecosystem updates
        window.addEventListener('truthEcosystemUpdate', (event) => {
            this.handleEcosystemUpdate(event.detail);
        });
    }
    
    // State management methods
    updateSharedState(category, data) {
        const previousState = JSON.parse(JSON.stringify(this.sharedState));
        
        if (this.sharedState[category]) {
            this.sharedState[category] = {
                ...this.sharedState[category],
                ...data
            };
        } else {
            this.sharedState[category] = data;
        }
        
        this.sharedState.lastUpdated = new Date().toISOString();
        
        // Broadcast update to all dashboards
        this.broadcastStateChange(category, data, previousState);
        
        console.log(`🔄 Shared state updated for ${category}:`, data);
    }
    
    broadcastStateChange(category, newData, previousState) {
        window.dispatchEvent(new CustomEvent('sharedStateUpdate', {
            detail: {
                category: category,
                data: newData,
                fullState: this.sharedState,
                previousState: previousState
            }
        }));
    }
    
    broadcastSharedState() {
        window.dispatchEvent(new CustomEvent('sharedStateBroadcast', {
            detail: {
                state: this.sharedState,
                activeDashboards: Array.from(this.activeConnections),
                timestamp: new Date().toISOString()
            }
        }));
    }
    
    // Navigation methods
    navigateTo(dashboardKey, context = {}) {
        const dashboard = this.dashboards[dashboardKey];
        if (!dashboard) {
            console.error(`❌ Unknown dashboard: ${dashboardKey}`);
            return;
        }
        
        const previousDashboard = this.sharedState.navigation.currentDashboard;
        
        // Update navigation state
        this.updateNavigationState(dashboardKey, context);
        
        // Prepare navigation data
        const navigationData = {
            from: previousDashboard,
            to: dashboardKey,
            context: context,
            sharedState: this.sharedState,
            timestamp: new Date().toISOString()
        };
        
        // Store navigation data for the target dashboard
        sessionStorage.setItem('dashboardNavigationData', JSON.stringify(navigationData));
        
        // Perform navigation
        window.location.href = dashboard.path;
        
        console.log(`🧭 Navigating from ${previousDashboard} to ${dashboardKey}`, context);
    }
    
    updateNavigationState(dashboardKey, context = {}) {
        const previousDashboard = this.sharedState.navigation.currentDashboard;
        
        this.sharedState.navigation = {
            currentDashboard: dashboardKey,
            previousDashboard: previousDashboard,
            history: [
                ...this.sharedState.navigation.history.slice(-10), // Keep last 10
                {
                    dashboard: dashboardKey,
                    timestamp: new Date().toISOString(),
                    context: context
                }
            ]
        };
        
        // Update dashboard active states
        Object.keys(this.dashboards).forEach(key => {
            this.dashboards[key].active = (key === dashboardKey);
        });
    }
    
    getDashboardFromPath(path) {
        for (const [key, dashboard] of Object.entries(this.dashboards)) {
            if (dashboard.path === path || (path === '/' && key === 'home')) {
                return key;
            }
        }
        return 'home'; // Default fallback
    }
    
    // Event handlers
    handleStateUpdate(updateData) {
        const { dashboard, category, data } = updateData;
        
        // Validate and process the update
        if (category && data) {
            this.updateSharedState(category, { ...data, source: dashboard });
        }
    }
    
    handleNavigationRequest(requestData) {
        const { target, context } = requestData;
        this.navigateTo(target, context);
    }
    
    handleDataShare(shareData) {
        const { source, target, data, type } = shareData;
        
        // Broadcast data share event
        window.dispatchEvent(new CustomEvent('crossDashboardDataShare', {
            detail: {
                source: source,
                target: target,
                data: data,
                type: type,
                timestamp: new Date().toISOString()
            }
        }));
        
        console.log(`📤 Data shared from ${source} to ${target}:`, type);
    }
    
    handleEcosystemUpdate(updateData) {
        // Sync with unified ecosystem state
        const { current, changed } = updateData;
        
        if (changed.walletConnected || changed.walletAddress) {
            this.updateSharedState('wallet', {
                connected: current.walletConnected,
                address: current.walletAddress
            });
        }
        
        if (changed.truthBalance || changed.creatorBalance) {
            this.updateSharedState('tokens', {
                truth: current.truthBalance,
                creator: current.creatorBalance
            });
        }
        
        if (changed.governancePower) {
            this.updateSharedState('governance', {
                votingPower: current.governancePower
            });
        }
    }
    
    // Server synchronization
    async syncWithServer() {
        try {
            const response = await fetch('/api/unified-state');
            const serverState = await response.json();
            
            // Merge server state with local state
            this.mergeServerState(serverState);
            
            console.log('🔄 Synced with server state');
        } catch (error) {
            console.warn('⚠️ Failed to sync with server:', error);
        }
    }
    
    mergeServerState(serverState) {
        // Merge without overwriting local navigation state
        const navigationState = this.sharedState.navigation;
        
        this.sharedState = {
            ...this.sharedState,
            ...serverState,
            navigation: navigationState // Preserve local navigation
        };
        
        this.broadcastSharedState();
    }
    
    // Public API methods
    getSharedState(category = null) {
        return category ? this.sharedState[category] : this.sharedState;
    }
    
    registerDashboard(dashboardKey) {
        this.activeConnections.add(dashboardKey);
        console.log(`📱 Dashboard registered: ${dashboardKey}`);
    }
    
    unregisterDashboard(dashboardKey) {
        this.activeConnections.delete(dashboardKey);
        console.log(`📱 Dashboard unregistered: ${dashboardKey}`);
    }
    
    // Utility methods
    getDashboardStatus() {
        return {
            initialized: this.initialized,
            activeDashboards: Array.from(this.activeConnections),
            currentDashboard: this.sharedState.navigation.currentDashboard,
            totalDashboards: Object.keys(this.dashboards).length,
            sharedStateSize: JSON.stringify(this.sharedState).length
        };
    }
}

// Initialize coordinator when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.TruthDashboardCoordinator = new TruthDashboardCoordinator();
    });
} else {
    window.TruthDashboardCoordinator = new TruthDashboardCoordinator();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TruthDashboardCoordinator;
}
