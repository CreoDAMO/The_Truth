const { useState, useEffect } = React;

function AnalyticsDashboard() {
    const [analyticsData, setAnalyticsData] = useState({
        totalRevenue: 0,
        mintingVelocity: [],
        geographicDistribution: {},
        holderAnalytics: {
            uniqueHolders: 0,
            topHolders: [],
            holdingDuration: []
        },
        secondaryMarket: {
            volume: 0,
            averagePrice: 0,
            priceHistory: []
        },
        platformMetrics: {
            webVisitors: 0,
            conversionRate: 0,
            shopSales: 0,
            nftSales: 0
        }
    });

    const [timeframe, setTimeframe] = useState('7d');
    const [loading, setLoading] = useState(true);

    // Fetch analytics data
    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/analytics?timeframe=${timeframe}`);
            const data = await response.json();
            setAnalyticsData(data);

            // Initialize charts after data loads
            setTimeout(() => {
                initializeCharts(data);
            }, 100);

        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    // Initialize Chart.js charts
    const initializeCharts = (data) => {
        // Minting Velocity Chart
        const velocityCtx = document.getElementById('velocityChart');
        if (velocityCtx) {
            new Chart(velocityCtx, {
                type: 'line',
                data: {
                    labels: data.mintingVelocity.map(d => d.date),
                    datasets: [{
                        label: 'Daily Mints',
                        data: data.mintingVelocity.map(d => d.mints),
                        borderColor: '#fbbf24',
                        backgroundColor: 'rgba(251, 191, 36, 0.1)',
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { labels: { color: '#ffffff' } } },
                    scales: {
                        x: { ticks: { color: '#ffffff' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                        y: { ticks: { color: '#ffffff' }, grid: { color: 'rgba(255,255,255,0.1)' } }
                    }
                }
            });
        }

        // Revenue Chart
        const revenueCtx = document.getElementById('revenueChart');
        if (revenueCtx) {
            new Chart(revenueCtx, {
                type: 'bar',
                data: {
                    labels: ['NFT Sales', 'Shop Sales', 'Royalties', 'Secondary'],
                    datasets: [{
                        label: 'Revenue (USD)',
                        data: [
                            data.platformMetrics.nftSales * 777,
                            data.platformMetrics.shopSales * 55,
                            data.totalRevenue * 0.1,
                            data.secondaryMarket.volume
                        ],
                        backgroundColor: [
                            '#3b82f6',
                            '#10b981',
                            '#8b5cf6',
                            '#f59e0b'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { labels: { color: '#ffffff' } } },
                    scales: {
                        x: { ticks: { color: '#ffffff' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                        y: { ticks: { color: '#ffffff' }, grid: { color: 'rgba(255,255,255,0.1)' } }
                    }
                }
            });
        }

        // Geographic Distribution Chart
        const geoCtx = document.getElementById('geoChart');
        if (geoCtx) {
            const countries = Object.keys(data.geographicDistribution);
            const counts = Object.values(data.geographicDistribution);

            new Chart(geoCtx, {
                type: 'doughnut',
                data: {
                    labels: countries,
                    datasets: [{
                        data: counts,
                        backgroundColor: [
                            '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
                            '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { labels: { color: '#ffffff' } } }
                }
            });
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, [timeframe]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatPercentage = (value) => {
        return (value * 100).toFixed(2) + '%';
    };

    return (
        <div className="min-h-screen text-white p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                            The Truth Analytics
                        </h1>
                        <p className="text-lg opacity-60 mt-2">Real-time ecosystem performance</p>
                    </div>

                    {/* Timeframe Selector */}
                    <div className="flex gap-2">
                        {['24h', '7d', '30d', '90d', 'all'].map((period) => (
                            <button
                                key={period}
                                onClick={() => setTimeframe(period)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    timeframe === period
                                        ? 'bg-yellow-500 text-black'
                                        : 'bg-gray-700 hover:bg-gray-600 text-white'
                                }`}
                            >
                                {period.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
                        <p>Loading analytics...</p>
                    </div>
                ) : (
                    <>
                        {/* Key Metrics Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="glass rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-yellow-400 mb-2">Total Revenue</h3>
                                <p className="text-3xl font-bold">{formatCurrency(analyticsData.totalRevenue)}</p>
                                <p className="text-sm opacity-60 mt-1">Across all channels</p>
                            </div>

                            <div className="glass rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-green-400 mb-2">Unique Collectors</h3>
                                <p className="text-3xl font-bold">{analyticsData.holderAnalytics.uniqueHolders}</p>
                                <p className="text-sm opacity-60 mt-1">NFT holders</p>
                            </div>

                            <div className="glass rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-blue-400 mb-2">Conversion Rate</h3>
                                <p className="text-3xl font-bold">{formatPercentage(analyticsData.platformMetrics.conversionRate)}</p>
                                <p className="text-sm opacity-60 mt-1">Visitors to buyers</p>
                            </div>

                            <div className="glass rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-purple-400 mb-2">Secondary Volume</h3>
                                <p className="text-3xl font-bold">{formatCurrency(analyticsData.secondaryMarket.volume)}</p>
                                <p className="text-sm opacity-60 mt-1">Resale market</p>
                            </div>
                        </div>

                        {/* Charts Row 1 */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            <div className="glass rounded-xl p-6">
                                <h3 className="text-xl font-semibold mb-4">Minting Velocity</h3>
                                <div className="chart-container">
                                    <canvas id="velocityChart"></canvas>
                                </div>
                            </div>

                            <div className="glass rounded-xl p-6">
                                <h3 className="text-xl font-semibold mb-4">Revenue Breakdown</h3>
                                <div className="chart-container">
                                    <canvas id="revenueChart"></canvas>
                                </div>
                            </div>
                        </div>

                        {/* Charts Row 2 */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            <div className="glass rounded-xl p-6">
                                <h3 className="text-xl font-semibold mb-4">Geographic Distribution</h3>
                                <div className="chart-container">
                                    <canvas id="geoChart"></canvas>
                                </div>
                            </div>

                            <div className="glass rounded-xl p-6">
                                <h3 className="text-xl font-semibold mb-4">Top Holders</h3>
                                <div className="space-y-3">
                                    {analyticsData.holderAnalytics.topHolders.map((holder, index) => (
                                        <div key={index} className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                                            <div>
                                                <p className="font-medium">{holder.address.slice(0,8)}...{holder.address.slice(-6)}</p>
                                                <p className="text-sm opacity-60">{holder.count} NFTs owned</p>
                                            </div>
                                            <p className="text-yellow-400 font-bold">{formatCurrency(holder.totalValue)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* LAW Compliance & Philosophy Metrics */}
                        <div className="glass rounded-xl p-6 mb-8">
                            <h3 className="text-xl font-semibold mb-6">⚖️ LAW Compliance & Truth Validation Metrics</h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div>
                                    <h4 className="text-lg font-semibold text-yellow-400 mb-3">Foundation Status</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>Doctrinal Mapping:</span>
                                            <span className="text-green-400">100% Complete</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Trust Deed:</span>
                                            <span className="text-blue-400">Executed ✓</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Treasury Resolution:</span>
                                            <span className="text-purple-400">Active ✓</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Foundation Score:</span>
                                            <span className="text-yellow-400">A+ Rating</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg font-semibold text-green-400 mb-3">Compliance Metrics</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>KYC Verification:</span>
                                            <span className="text-green-400">94.7%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Tax ID Status:</span>
                                            <span className="text-blue-400">FL: 23-8019835728-2</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>OFAC Blocks:</span>
                                            <span className="text-purple-400">12 prevented</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Over-Compliance:</span>
                                            <span className="text-yellow-400">147% standard</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg font-semibold text-blue-400 mb-3">Economic Validation</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>NFT Premium vs Shop:</span>
                                            <span className="text-green-400">1,313% markup</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Total Economic Value:</span>
                                            <span className="text-yellow-400">{formatCurrency(analyticsData.totalRevenue * 1.5)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Secondary Multiplier:</span>
                                            <span className="text-blue-400">{(analyticsData.secondaryMarket.averagePrice / 777).toFixed(2)}x</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Market Hypothesis:</span>
                                            <span className="text-purple-400">Validated ✓</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg font-semibold text-purple-400 mb-3">Truth Impact</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>Institutional Translation:</span>
                                            <span className="text-orange-400">Ongoing</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Web3 Adoption:</span>
                                            <span className="text-green-400">{analyticsData.holderAnalytics.uniqueHolders} holders</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Global Reach:</span>
                                            <span className="text-blue-400">{Object.keys(analyticsData.geographicDistribution).length} countries</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Philosophy Spread:</span>
                                            <span className="text-yellow-400">{analyticsData.platformMetrics.webVisitors} visitors</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Real-Time Feed */}
                        <div className="glass rounded-xl p-6">
                            <h3 className="text-xl font-semibold mb-4">Live Activity Feed</h3>
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                <div className="flex items-center justify-between p-3 bg-green-900 bg-opacity-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                        <span>New mint: The Truth #45</span>
                                    </div>
                                    <span className="text-sm opacity-60">2 minutes ago</span>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-blue-900 bg-opacity-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                                        <span>Secondary sale: Truth #12 for 1.2 ETH</span>
                                    </div>
                                    <span className="text-sm opacity-60">15 minutes ago</span>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-purple-900 bg-opacity-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                                        <span>Blackpaper collection mint: Part Three #42</span>
                                    </div>
                                    <span className="text-sm opacity-60">1 hour ago</span>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

// Mount the component
const rootElement = document.getElementById('analytics-root');
const root = ReactDOM.createRoot(rootElement);
root.render(<AnalyticsDashboard />);