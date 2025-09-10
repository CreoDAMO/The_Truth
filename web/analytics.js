const { useState, useEffect } = React;

// Enhanced Analytics Dashboard Component
function AnalyticsApp() {
    const [loading, setLoading] = useState(true);
    const [timeframe, setTimeframe] = useState('24h');
    const [metrics, setMetrics] = useState({
        totalHolders: 1247,
        totalVolume: 145.7,
        avgPrice: 0.169,
        truthScore: 94.7,
        translationGap: 67.3,
        abundanceMultiplier: 13.13,
        geographicData: [],
        priceHistory: [],
        holderGrowth: [],
        philosophyMetrics: {}
    });
    const [charts, setCharts] = useState({});

    // Initialize analytics dashboard
    useEffect(() => {
        setTimeout(() => {
            loadAnalytics();
            setLoading(false);
        }, 1500);
    }, []);

    // Load analytics data
    const loadAnalytics = async () => {
        try {
            // Simulate API call
            const data = await simulateAnalyticsAPI();
            setMetrics(data);
            initializeCharts(data);
        } catch (error) {
            console.error('Analytics load error:', error);
        }
    };

    // Simulate analytics API
    const simulateAnalyticsAPI = async () => {
        return {
            totalHolders: 1247,
            totalVolume: 145.7,
            avgPrice: 0.169,
            truthScore: 94.7,
            translationGap: 67.3,
            abundanceMultiplier: 13.13,
            geographicData: [
                { country: 'United States', holders: 445, percentage: 35.7 },
                { country: 'Canada', holders: 187, percentage: 15.0 },
                { country: 'United Kingdom', holders: 149, percentage: 11.9 },
                { country: 'Germany', holders: 124, percentage: 9.9 },
                { country: 'Australia', holders: 99, percentage: 7.9 },
                { country: 'Netherlands', holders: 87, percentage: 7.0 },
                { country: 'Other', holders: 156, percentage: 12.6 }
            ],
            priceHistory: generatePriceHistory(),
            holderGrowth: generateHolderGrowth(),
            philosophyMetrics: {
                deepAlignment: 23.4,
                surfaceEngagement: 45.2,
                institutionalResistance: 18.7,
                truthSeekers: 12.7
            },
            recentSales: [
                { id: '#1337', price: 0.777, buyer: '0x1234...5678', timestamp: '2 min ago', rarity: 'Legendary' },
                { id: '#777', price: 0.169, buyer: '0xabcd...efgh', timestamp: '15 min ago', rarity: 'Rare' },
                { id: '#42', price: 0.234, buyer: '0x9876...1234', timestamp: '1 hour ago', rarity: 'Epic' }
            ]
        };
    };

    // Generate mock price data
    const generatePriceHistory = () => {
        const data = [];
        const basePrice = 0.169;
        for (let i = 23; i >= 0; i--) {
            data.push({
                time: `${i}:00`,
                price: basePrice + (Math.random() - 0.5) * 0.05,
                volume: Math.floor(Math.random() * 50) + 10
            });
        }
        return data;
    };

    // Generate holder growth data
    const generateHolderGrowth = () => {
        const data = [];
        let holders = 100;
        for (let i = 30; i >= 0; i--) {
            holders += Math.floor(Math.random() * 20) + 5;
            data.push({
                date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
                holders: holders,
                growth: Math.floor(Math.random() * 25) + 5
            });
        }
        return data;
    };

    // Initialize Chart.js charts
    const initializeCharts = (data) => {
        // Price Chart
        if (window.Chart) {
            const priceCtx = document.getElementById('priceChart');
            if (priceCtx && !charts.priceChart) {
                charts.priceChart = new Chart(priceCtx, {
                    type: 'line',
                    data: {
                        labels: data.priceHistory.map(d => d.time),
                        datasets: [{
                            label: 'Price (ETH)',
                            data: data.priceHistory.map(d => d.price),
                            borderColor: '#fbbf24',
                            backgroundColor: 'rgba(251, 191, 36, 0.1)',
                            borderWidth: 3,
                            fill: true,
                            tension: 0.4
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                            y: { 
                                grid: { color: 'rgba(255,255,255,0.1)' },
                                ticks: { color: '#ffffff' }
                            },
                            x: { 
                                grid: { color: 'rgba(255,255,255,0.1)' },
                                ticks: { color: '#ffffff' }
                            }
                        }
                    }
                });
            }

            // Holder Growth Chart
            const holderCtx = document.getElementById('holderChart');
            if (holderCtx && !charts.holderChart) {
                charts.holderChart = new Chart(holderCtx, {
                    type: 'bar',
                    data: {
                        labels: data.holderGrowth.slice(-7).map(d => d.date),
                        datasets: [{
                            label: 'New Holders',
                            data: data.holderGrowth.slice(-7).map(d => d.growth),
                            backgroundColor: 'rgba(59, 130, 246, 0.8)',
                            borderColor: '#3b82f6',
                            borderWidth: 2
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                            y: { 
                                grid: { color: 'rgba(255,255,255,0.1)' },
                                ticks: { color: '#ffffff' }
                            },
                            x: { 
                                grid: { color: 'rgba(255,255,255,0.1)' },
                                ticks: { color: '#ffffff' }
                            }
                        }
                    }
                });
            }

            // Philosophy Metrics Doughnut
            const philosophyCtx = document.getElementById('philosophyChart');
            if (philosophyCtx && !charts.philosophyChart) {
                charts.philosophyChart = new Chart(philosophyCtx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Deep Alignment', 'Surface Engagement', 'Institutional Resistance', 'Truth Seekers'],
                        datasets: [{
                            data: Object.values(data.philosophyMetrics),
                            backgroundColor: [
                                '#10b981',
                                '#3b82f6', 
                                '#ef4444',
                                '#fbbf24'
                            ]
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { 
                                position: 'bottom',
                                labels: { color: '#ffffff' }
                            }
                        }
                    }
                });
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative mb-8">
                        <div className="animate-spin rounded-full h-20 w-20 border-4 border-transparent border-t-yellow-400 border-r-yellow-400 mx-auto"></div>
                        <div className="absolute inset-0 rounded-full h-20 w-20 border-4 border-transparent border-b-orange-400 border-l-orange-400 mx-auto animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
                    </div>
                    <h2 className="text-2xl font-bold text-gradient mb-4">Initializing Analytics Engine</h2>
                    <p className="text-gray-400">Loading ecosystem metrics and blockchain data...</p>
                    <div className="mt-6 flex justify-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900">
            {/* Advanced Navigation */}
            <nav className="nav-glass fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-sm border-b border-purple-500/30 p-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg floating">
                            📊
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gradient">Truth Analytics</h2>
                            <p className="text-xs text-gray-400">Real-time ecosystem insights</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <a href="/" className="px-4 py-2 glass rounded-xl transition-all duration-300 hover:scale-105 text-sm font-medium">Home</a>
                        <a href="/governance" className="px-4 py-2 glass rounded-xl transition-all duration-300 hover:scale-105 text-sm font-medium">Governance</a>
                        <a href="/community" className="px-4 py-2 glass rounded-xl transition-all duration-300 hover:scale-105 text-sm font-medium">Community</a>
                        <a href="/deployment-dashboard" className="px-4 py-2 glass rounded-xl transition-all duration-300 hover:scale-105 text-sm font-medium">Deploy</a>
                    </div>
                </div>
            </nav>

            <div className="pt-24 px-6 pb-12">
                {/* Header */}
                <div className="text-center mb-12 fade-in">
                    <h1 className="text-6xl font-black mb-6 text-gradient floating">The Truth Analytics</h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        "Where data meets philosophy - real-time insights into the translation gap"
                    </p>

                    {/* Timeframe Selector */}
                    <div className="flex justify-center gap-2 mt-8">
                        {['1h', '24h', '7d', '30d', 'All'].map(period => (
                            <button
                                key={period}
                                onClick={() => setTimeframe(period)}
                                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                                    timeframe === period 
                                        ? 'bg-yellow-600 text-white shadow-lg scale-105' 
                                        : 'glass hover:scale-105'
                                }`}
                            >
                                {period}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="masonry-grid mb-12 fade-in">
                    <div className="glass metric-card gradient-card floating" style={{'--accent-color': '#fbbf24'}}>
                        <div className="text-center">
                            <div className="text-4xl mb-4">👥</div>
                            <h3 className="text-lg font-semibold mb-2">Total Holders</h3>
                            <div className="text-3xl font-bold text-yellow-400 mb-2">{metrics.totalHolders.toLocaleString()}</div>
                            <div className="text-sm text-green-400">+12.7% this week</div>
                        </div>
                    </div>

                    <div className="glass metric-card gradient-purple floating-reverse" style={{'--accent-color': '#8b5cf6'}}>
                        <div className="text-center">
                            <div className="text-4xl mb-4">💎</div>
                            <h3 className="text-lg font-semibold mb-2">Total Volume</h3>
                            <div className="text-3xl font-bold text-purple-400 mb-2">{metrics.totalVolume} ETH</div>
                            <div className="text-sm text-green-400">+34.2% this week</div>
                        </div>
                    </div>

                    <div className="glass metric-card gradient-blue floating" style={{'--accent-color': '#3b82f6'}}>
                        <div className="text-center">
                            <div className="text-4xl mb-4">📈</div>
                            <h3 className="text-lg font-semibold mb-2">Average Price</h3>
                            <div className="text-3xl font-bold text-blue-400 mb-2">{metrics.avgPrice} ETH</div>
                            <div className="text-sm text-green-400">+8.4% this week</div>
                        </div>
                    </div>

                    <div className="glass metric-card gradient-green floating-reverse" style={{'--accent-color': '#10b981'}}>
                        <div className="text-center">
                            <div className="text-4xl mb-4">🔮</div>
                            <h3 className="text-lg font-semibold mb-2">Truth Score</h3>
                            <div className="text-3xl font-bold text-green-400 mb-2">{metrics.truthScore}%</div>
                            <div className="text-sm text-yellow-400">Philosophical alignment</div>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid lg:grid-cols-2 gap-8 mb-12">
                    <div className="glass rounded-2xl p-8 floating">
                        <h3 className="text-2xl font-bold mb-6 text-gradient flex items-center">
                            <span className="mr-3">📊</span>Price History (24h)
                        </h3>
                        <div className="chart-container">
                            <canvas id="priceChart"></canvas>
                        </div>
                    </div>

                    <div className="glass rounded-2xl p-8 floating-reverse">
                        <h3 className="text-2xl font-bold mb-6 text-gradient flex items-center">
                            <span className="mr-3">👥</span>Holder Growth (7d)
                        </h3>
                        <div className="chart-container">
                            <canvas id="holderChart"></canvas>
                        </div>
                    </div>
                </div>

                {/* Philosophy Metrics */}
                <div className="grid lg:grid-cols-3 gap-8 mb-12">
                    <div className="lg:col-span-2 glass rounded-2xl p-8 floating">
                        <h3 className="text-2xl font-bold mb-6 text-gradient flex items-center">
                            <span className="mr-3">🧠</span>Philosophy Engagement Breakdown
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="bg-green-900/30 p-4 rounded-lg">
                                    <h4 className="font-semibold text-green-400 mb-2">Deep Alignment: {metrics.philosophyMetrics.deepAlignment}%</h4>
                                    <p className="text-sm text-gray-300">Users who truly understand the institutional translation gap</p>
                                </div>
                                <div className="bg-blue-900/30 p-4 rounded-lg">
                                    <h4 className="font-semibold text-blue-400 mb-2">Surface Engagement: {metrics.philosophyMetrics.surfaceEngagement}%</h4>
                                    <p className="text-sm text-gray-300">Attracted to aesthetics but missing deeper meaning</p>
                                </div>
                                <div className="bg-red-900/30 p-4 rounded-lg">
                                    <h4 className="font-semibold text-red-400 mb-2">Institutional Resistance: {metrics.philosophyMetrics.institutionalResistance}%</h4>
                                    <p className="text-sm text-gray-300">Actively attempting to "translate" or reframe the truth</p>
                                </div>
                                <div className="bg-yellow-900/30 p-4 rounded-lg">
                                    <h4 className="font-semibold text-yellow-400 mb-2">Truth Seekers: {metrics.philosophyMetrics.truthSeekers}%</h4>
                                    <p className="text-sm text-gray-300">Genuinely seeking unfiltered reality</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass rounded-2xl p-8 floating-reverse">
                        <h3 className="text-xl font-bold mb-6 text-gradient">Distribution</h3>
                        <div className="chart-container">
                            <canvas id="philosophyChart"></canvas>
                        </div>
                    </div>
                </div>

                {/* Geographic Distribution */}
                <div className="glass rounded-2xl p-8 mb-12 floating">
                    <h3 className="text-2xl font-bold mb-6 text-gradient flex items-center">
                        <span className="mr-3">🌍</span>Global Distribution
                    </h3>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            {metrics.geographicData.map((country, index) => (
                                <div key={country.country} className="flex items-center justify-between bg-black/30 p-4 rounded-lg hover:bg-black/50 transition-all duration-300 hover:scale-105">
                                    <span className="font-medium">{country.country}</span>
                                    <div className="text-right">
                                        <div className="font-bold text-yellow-400">{country.holders} holders</div>
                                        <div className="text-sm text-gray-400">{country.percentage}%</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-4">
                            <div className="bg-gradient-to-br from-purple-900/50 to-blue-800/30 p-6 rounded-lg">
                                <h4 className="font-semibold mb-4">Translation Gap by Region</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>North America:</span>
                                        <span className="text-red-400">73.2%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Europe:</span>
                                        <span className="text-yellow-400">45.7%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Asia-Pacific:</span>
                                        <span className="text-green-400">23.1%</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-green-900/50 to-teal-800/30 p-6 rounded-lg">
                                <h4 className="font-semibold mb-4">Philosophy Adoption</h4>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-400 mb-2">{metrics.abundanceMultiplier}x</div>
                                    <p className="text-sm text-gray-300">Abundance multiplier effect from proper valuation</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="glass rounded-2xl p-8 floating-reverse">
                    <h3 className="text-2xl font-bold mb-6 text-gradient flex items-center">
                        <span className="mr-3">⚡</span>Recent Sales
                    </h3>
                    <div className="space-y-4">
                        {metrics.recentSales.map((sale, index) => (
                            <div key={sale.id} className="flex items-center justify-between bg-black/30 p-4 rounded-lg hover:bg-black/50 transition-all duration-300 hover:scale-105 hover:border-l-4 hover:border-yellow-400">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                                        {sale.id.slice(-2)}
                                    </div>
                                    <div>
                                        <div className="font-semibold">The Truth NFT {sale.id}</div>
                                        <div className="text-sm text-gray-400">to {sale.buyer}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-yellow-400">{sale.price} ETH</div>
                                    <div className="text-sm text-gray-400">{sale.timestamp}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        ReactDOM.render(<AnalyticsApp />, document.getElementById('analytics-root'));
    });
} else {
    ReactDOM.render(<AnalyticsApp />, document.getElementById('analytics-root'));
}