
const { useState, useEffect } = React;

// Error Boundary Component
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Analytics Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return React.createElement('div', { className: 'error-boundary' },
                React.createElement('h3', null, '📊 Analytics Temporarily Unavailable'),
                React.createElement('p', null, 'Please refresh the page or try again later.'),
                React.createElement('button', {
                    onClick: () => this.setState({ hasError: false, error: null })
                }, 'Retry')
            );
        }
        return this.props.children;
    }
}

// Analytics Dashboard Component
function AnalyticsApp() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        totalRevenue: 0,
        totalSupply: 77,
        mintedCount: 0,
        holders: 0,
        collections: [],
        recentTransactions: [],
        geographicData: [],
        recentActivity: []
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        loadAnalyticsData();
    }, []);

    const loadAnalyticsData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Load data from multiple endpoints
            const [analyticsRes, geoRes, activityRes] = await Promise.allSettled([
                fetch('/api/analytics'),
                fetch('/api/analytics/geographic'),
                fetch('/api/analytics/recent-activity')
            ]);

            let analyticsData = {
                totalSupply: 77,
                mintedCount: 0,
                totalRevenue: "0 ETH",
                holders: 0,
                collections: [
                    { name: "The Truth Original", supply: 77, minted: 0, price: "0.169 ETH" },
                    { name: "Bonus Gift", supply: 145000, minted: 0, price: "Free" },
                    { name: "Part Three", supply: 444, minted: 0, price: "TBD" }
                ],
                recentTransactions: []
            };

            let geographicData = [
                { country: 'United States', holders: 0, percentage: 0 },
                { country: 'Canada', holders: 0, percentage: 0 },
                { country: 'United Kingdom', holders: 0, percentage: 0 },
                { country: 'Germany', holders: 0, percentage: 0 },
                { country: 'Other', holders: 0, percentage: 0 }
            ];

            let recentActivity = [];

            // Process successful responses
            if (analyticsRes.status === 'fulfilled' && analyticsRes.value.ok) {
                analyticsData = await analyticsRes.value.json();
            }
            if (geoRes.status === 'fulfilled' && geoRes.value.ok) {
                geographicData = await geoRes.value.json();
            }
            if (activityRes.status === 'fulfilled' && activityRes.value.ok) {
                recentActivity = await activityRes.value.json();
            }

            setData({
                ...analyticsData,
                geographicData,
                recentActivity
            });

        } catch (err) {
            console.error('Analytics loading error:', err);
            setError('Failed to load analytics data. Using demo data.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return React.createElement('div', { className: 'flex items-center justify-center min-h-screen' },
            React.createElement('div', { className: 'text-center' },
                React.createElement('div', { className: 'relative mb-6' },
                    React.createElement('div', { className: 'animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-yellow-400 border-r-yellow-400 mx-auto' }),
                    React.createElement('div', { className: 'absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-b-orange-400 border-l-orange-400 mx-auto animate-spin', style: { animationDirection: 'reverse', animationDuration: '1.5s' } })
                ),
                React.createElement('p', { className: 'text-xl font-medium text-gradient' }, 'Loading Analytics Dashboard...'),
                React.createElement('p', { className: 'text-sm text-gray-400 mt-2' }, 'Fetching ecosystem metrics')
            )
        );
    }

    return React.createElement('div', { className: 'min-h-screen text-white' },
        // Navigation
        React.createElement('nav', { className: 'nav-glass fixed top-0 w-full z-50 backdrop-blur-md' },
            React.createElement('div', { className: 'max-w-7xl mx-auto px-6 flex justify-between items-center h-16' },
                React.createElement('div', { className: 'flex items-center space-x-4' },
                    React.createElement('div', { className: 'w-14 h-14 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg floating' }, '📊'),
                    React.createElement('div', null,
                        React.createElement('h2', { className: 'text-2xl font-bold text-gradient' }, 'Truth Analytics'),
                        React.createElement('p', { className: 'text-sm text-gray-400' }, 'Real-time Ecosystem Metrics')
                    )
                ),
                React.createElement('div', { className: 'flex gap-4' },
                    React.createElement('a', { href: '/', className: 'px-5 py-3 glass rounded-xl transition-all duration-300 hover:scale-105 text-sm font-medium' }, 'Home'),
                    React.createElement('a', { href: '/governance', className: 'px-5 py-3 glass rounded-xl transition-all duration-300 hover:scale-105 text-sm font-medium' }, 'Governance'),
                    React.createElement('a', { href: '/community', className: 'px-5 py-3 glass rounded-xl transition-all duration-300 hover:scale-105 text-sm font-medium' }, 'Community'),
                    React.createElement('a', { href: '/lawful', className: 'px-5 py-3 glass rounded-xl transition-all duration-300 hover:scale-105 text-sm font-medium' }, 'Legal')
                )
            )
        ),

        // Main Content
        React.createElement('div', { className: 'max-w-7xl mx-auto px-6 pt-28 pb-16' },
            // Header
            React.createElement('div', { className: 'text-center mb-20 fade-in' },
                React.createElement('h1', { className: 'text-7xl font-black mb-8 text-gradient floating' }, 'Truth Analytics'),
                React.createElement('p', { className: 'text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed' }, 'Real-time insights into The Truth NFT ecosystem performance and community metrics')
            ),

            // Error Display
            error && React.createElement('div', { className: 'glass rounded-xl p-6 mb-8 border-yellow-400 border-l-4' },
                React.createElement('p', { className: 'text-yellow-400' }, '⚠️ ', error)
            ),

            // Metrics Grid
            React.createElement('div', { className: 'masonry-grid fade-in' },
                // Key Metrics Card
                React.createElement('div', { className: 'glass metric-card rounded-xl p-8 floating gradient-card' },
                    React.createElement('h3', { className: 'text-2xl font-bold mb-6 text-gradient flex items-center' },
                        React.createElement('span', { className: 'mr-3 text-3xl' }, '💎'),
                        'Key Metrics'
                    ),
                    React.createElement('div', { className: 'grid grid-cols-2 gap-6' },
                        React.createElement('div', { className: 'text-center' },
                            React.createElement('div', { className: 'text-3xl font-bold text-yellow-400 mb-2' }, data.totalSupply),
                            React.createElement('div', { className: 'text-sm text-gray-400' }, 'Total Supply')
                        ),
                        React.createElement('div', { className: 'text-center' },
                            React.createElement('div', { className: 'text-3xl font-bold text-green-400 mb-2' }, data.mintedCount),
                            React.createElement('div', { className: 'text-sm text-gray-400' }, 'Minted')
                        ),
                        React.createElement('div', { className: 'text-center' },
                            React.createElement('div', { className: 'text-3xl font-bold text-blue-400 mb-2' }, data.holders),
                            React.createElement('div', { className: 'text-sm text-gray-400' }, 'Holders')
                        ),
                        React.createElement('div', { className: 'text-center' },
                            React.createElement('div', { className: 'text-3xl font-bold text-purple-400 mb-2' }, data.totalRevenue),
                            React.createElement('div', { className: 'text-sm text-gray-400' }, 'Revenue')
                        )
                    )
                ),

                // Collections Overview
                React.createElement('div', { className: 'glass metric-card rounded-xl p-8 floating-reverse gradient-purple' },
                    React.createElement('h3', { className: 'text-2xl font-bold mb-6 text-gradient flex items-center' },
                        React.createElement('span', { className: 'mr-3 text-3xl' }, '🎨'),
                        'Collections'
                    ),
                    React.createElement('div', { className: 'space-y-4' },
                        data.collections.map((collection, index) =>
                            React.createElement('div', { key: index, className: 'bg-black/20 rounded-xl p-4' },
                                React.createElement('div', { className: 'flex justify-between items-center mb-2' },
                                    React.createElement('h4', { className: 'font-bold text-white' }, collection.name),
                                    React.createElement('span', { className: 'text-sm text-purple-400' }, collection.price)
                                ),
                                React.createElement('div', { className: 'flex justify-between text-sm text-gray-400' },
                                    React.createElement('span', null, `Supply: ${collection.supply}`),
                                    React.createElement('span', null, `Minted: ${collection.minted}`)
                                )
                            )
                        )
                    )
                ),

                // Geographic Distribution
                React.createElement('div', { className: 'glass metric-card rounded-xl p-8 floating gradient-blue' },
                    React.createElement('h3', { className: 'text-2xl font-bold mb-6 text-gradient flex items-center' },
                        React.createElement('span', { className: 'mr-3 text-3xl' }, '🌍'),
                        'Global Distribution'
                    ),
                    React.createElement('div', { className: 'space-y-3' },
                        data.geographicData.map((country, index) =>
                            React.createElement('div', { key: index, className: 'flex justify-between items-center' },
                                React.createElement('span', { className: 'text-gray-300' }, country.country),
                                React.createElement('span', { className: 'font-bold text-blue-400' }, `${country.holders} (${country.percentage}%)`)
                            )
                        )
                    )
                ),

                // Recent Activity
                React.createElement('div', { className: 'glass metric-card rounded-xl p-8 floating-reverse gradient-green' },
                    React.createElement('h3', { className: 'text-2xl font-bold mb-6 text-gradient flex items-center' },
                        React.createElement('span', { className: 'mr-3 text-3xl' }, '⚡'),
                        'Recent Activity'
                    ),
                    React.createElement('div', { className: 'space-y-3 max-h-64 overflow-y-auto' },
                        data.recentActivity.length > 0 
                            ? data.recentActivity.map((activity, index) =>
                                React.createElement('div', { key: index, className: 'flex items-center space-x-3 p-3 bg-black/20 rounded-lg' },
                                    React.createElement('div', { className: 'text-xl' }, '📈'),
                                    React.createElement('div', null,
                                        React.createElement('p', { className: 'text-white text-sm' }, activity.type),
                                        React.createElement('p', { className: 'text-gray-400 text-xs' }, activity.timestamp)
                                    )
                                )
                            )
                            : React.createElement('p', { className: 'text-gray-400 text-center py-8' }, 'No recent activity to display')
                    )
                )
            ),

            // Refresh Button
            React.createElement('div', { className: 'text-center mt-12' },
                React.createElement('button', {
                    onClick: loadAnalyticsData,
                    disabled: loading,
                    className: 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 disabled:opacity-50 px-8 py-4 rounded-lg font-bold text-xl transition-all transform hover:scale-105 text-black'
                }, loading ? '⏳ Loading...' : '🔄 Refresh Data')
            )
        )
    );
}

// Initialize with proper React 18/legacy compatibility
function initializeAnalytics() {
    const container = document.getElementById('analytics-root');
    if (!container) {
        console.error('Analytics root container not found');
        return;
    }

    try {
        if (typeof ReactDOM.createRoot !== 'undefined') {
            // React 18
            const root = ReactDOM.createRoot(container);
            root.render(React.createElement(ErrorBoundary, null, React.createElement(AnalyticsApp)));
        } else {
            // Legacy React
            ReactDOM.render(React.createElement(ErrorBoundary, null, React.createElement(AnalyticsApp)), container);
        }
        console.log('✅ Analytics dashboard initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize analytics dashboard:', error);
        container.innerHTML = `
            <div class="error-boundary">
                <h3>📊 Analytics Dashboard Error</h3>
                <p>Failed to initialize: ${error.message}</p>
                <button onclick="location.reload()">Refresh Page</button>
            </div>
        `;
    }
}

// Auto-initialize when DOM is ready and integrate with unified state
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeAnalytics();
        integrateWithUnifiedState();
    });
} else {
    initializeAnalytics();
    integrateWithUnifiedState();
}

// Integration with unified ecosystem state
function integrateWithUnifiedState() {
    // Listen for unified state updates
    window.addEventListener('truthEcosystemUpdate', (event) => {
        const { current, changed } = event.detail;
        
        // Update analytics data based on unified state changes
        if (changed.walletConnected || changed.truthBalance || changed.creatorBalance) {
            loadAnalyticsData();
        }
        
        // Update wallet display in analytics
        if (changed.walletConnected) {
            updateAnalyticsWalletDisplay(current);
        }
    });
    
    // Initialize with current unified state if available
    if (window.TruthEcosystem && window.TruthEcosystem.initialized) {
        updateAnalyticsWalletDisplay(window.TruthEcosystem);
    }
}

function updateAnalyticsWalletDisplay(state) {
    // Update analytics dashboard with wallet state
    const walletElements = document.querySelectorAll('.wallet-status, .wallet-indicator');
    walletElements.forEach(element => {
        if (state.walletConnected) {
            element.textContent = `Connected: ${state.walletAddress?.slice(0, 6)}...${state.walletAddress?.slice(-4)}`;
            element.className = element.className.replace('disconnected', 'connected');
        } else {
            element.textContent = 'Not Connected';
            element.className = element.className.replace('connected', 'disconnected');
        }
    });
}
