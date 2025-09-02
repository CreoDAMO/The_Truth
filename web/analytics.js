
const { useState, useEffect, useRef } = React;

function AnalyticsDashboard() {
    const [analyticsData, setAnalyticsData] = useState({
        totalRevenue: 42500,
        mintingVelocity: [
            { date: '2025-01-26', mints: 12 },
            { date: '2025-01-27', mints: 8 },
            { date: '2025-01-28', mints: 15 },
            { date: '2025-01-29', mints: 22 },
            { date: '2025-01-30', mints: 18 },
            { date: '2025-01-31', mints: 25 },
            { date: '2025-02-01', mints: 30 }
        ],
        geographicDistribution: {
            'United States': 45,
            'Canada': 12,
            'United Kingdom': 8,
            'Germany': 6,
            'Japan': 4,
            'Australia': 3
        },
        holderAnalytics: {
            uniqueHolders: 78,
            topHolders: [
                { address: '0x1234567890abcdef1234567890abcdef12345678', count: 5, totalValue: 3885 },
                { address: '0xabcdef1234567890abcdef1234567890abcdef12', count: 4, totalValue: 3108 },
                { address: '0x567890abcdef1234567890abcdef1234567890ab', count: 3, totalValue: 2331 },
                { address: '0xdef1234567890abcdef1234567890abcdef1234', count: 3, totalValue: 2331 },
                { address: '0x890abcdef1234567890abcdef1234567890abcd', count: 2, totalValue: 1554 }
            ],
            holdingDuration: [15, 23, 8, 45, 12, 67, 34]
        },
        secondaryMarket: {
            volume: 15600,
            averagePrice: 1050,
            priceHistory: [
                { date: '2025-01-26', price: 777 },
                { date: '2025-01-27', price: 850 },
                { date: '2025-01-28', price: 920 },
                { date: '2025-01-29', price: 1100 },
                { date: '2025-01-30', price: 1050 },
                { date: '2025-01-31', price: 1200 },
                { date: '2025-02-01', price: 1150 }
            ]
        },
        platformMetrics: {
            webVisitors: 5200,
            conversionRate: 0.042,
            shopSales: 85,
            nftSales: 57
        }
    });

    const [timeframe, setTimeframe] = useState('7d');
    const [loading, setLoading] = useState(false);
    const [animateCards, setAnimateCards] = useState(false);
    const observerRef = useRef();

    // Intersection Observer for scroll animations
    useEffect(() => {
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.1 }
        );

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);

    // Animate elements on mount
    useEffect(() => {
        setTimeout(() => setAnimateCards(true), 300);
        
        // Add fade-in animation to elements
        const elements = document.querySelectorAll('.fade-in');
        elements.forEach((el) => {
            if (observerRef.current) {
                observerRef.current.observe(el);
            }
        });
    }, []);

    // Fetch analytics data
    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/analytics?timeframe=${timeframe}`);
            if (response.ok) {
                const data = await response.json();
                setAnalyticsData(data);
            }
        } catch (error) {
            console.log('Using default analytics data:', error.message);
        } finally {
            setLoading(false);
            setTimeout(() => {
                initializeCharts();
            }, 500);
        }
    };

    // Enhanced Chart.js initialization with modern styling
    const initializeCharts = () => {
        try {
            Object.values(Chart.instances || {}).forEach(chart => {
                if (chart && typeof chart.destroy === 'function') {
                    chart.destroy();
                }
            });

            const chartOptions = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                    legend: { 
                        labels: { 
                            color: '#ffffff',
                            font: { family: 'Inter', size: 12, weight: '500' }
                        }
                    }
                },
                scales: {
                    x: { 
                        ticks: { 
                            color: '#9ca3af',
                            font: { family: 'Inter', size: 11 }
                        }, 
                        grid: { 
                            color: 'rgba(255,255,255,0.05)',
                            drawBorder: false
                        } 
                    },
                    y: { 
                        ticks: { 
                            color: '#9ca3af',
                            font: { family: 'Inter', size: 11 }
                        }, 
                        grid: { 
                            color: 'rgba(255,255,255,0.05)',
                            drawBorder: false
                        } 
                    }
                },
                elements: {
                    point: {
                        radius: 6,
                        hoverRadius: 8,
                        backgroundColor: '#fbbf24',
                        borderColor: '#ffffff',
                        borderWidth: 2
                    }
                }
            };

            // Minting Velocity Chart with enhanced styling
            const velocityCtx = document.getElementById('velocityChart');
            if (velocityCtx) {
                new Chart(velocityCtx, {
                    type: 'line',
                    data: {
                        labels: analyticsData.mintingVelocity.map(d => d.date),
                        datasets: [{
                            label: 'Daily Mints',
                            data: analyticsData.mintingVelocity.map(d => d.mints),
                            borderColor: '#fbbf24',
                            backgroundColor: 'rgba(251, 191, 36, 0.1)',
                            fill: true,
                            tension: 0.4,
                            borderWidth: 3,
                            pointBackgroundColor: '#fbbf24',
                            pointBorderColor: '#ffffff',
                            pointBorderWidth: 2,
                            pointRadius: 6,
                            pointHoverRadius: 8
                        }]
                    },
                    options: chartOptions
                });
            }

            // Revenue Chart with gradient bars
            const revenueCtx = document.getElementById('revenueChart');
            if (revenueCtx) {
                new Chart(revenueCtx, {
                    type: 'bar',
                    data: {
                        labels: ['NFT Sales', 'Shop Sales', 'Royalties', 'Secondary'],
                        datasets: [{
                            label: 'Revenue (USD)',
                            data: [
                                analyticsData.platformMetrics.nftSales * 777,
                                analyticsData.platformMetrics.shopSales * 55,
                                analyticsData.totalRevenue * 0.1,
                                analyticsData.secondaryMarket.volume
                            ],
                            backgroundColor: [
                                'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                'linear-gradient(135deg, #10b981, #047857)',
                                'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                                'linear-gradient(135deg, #f59e0b, #d97706)'
                            ],
                            borderRadius: 8,
                            borderSkipped: false
                        }]
                    },
                    options: {
                        ...chartOptions,
                        scales: {
                            ...chartOptions.scales,
                            y: {
                                ...chartOptions.scales.y,
                                beginAtZero: true
                            }
                        }
                    }
                });
            }

            // Geographic Distribution with enhanced colors
            const geoCtx = document.getElementById('geoChart');
            if (geoCtx) {
                const countries = Object.keys(analyticsData.geographicDistribution);
                const counts = Object.values(analyticsData.geographicDistribution);

                new Chart(geoCtx, {
                    type: 'doughnut',
                    data: {
                        labels: countries,
                        datasets: [{
                            data: counts,
                            backgroundColor: [
                                '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
                                '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
                            ],
                            borderWidth: 0,
                            hoverOffset: 8
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: '60%',
                        plugins: { 
                            legend: { 
                                labels: { 
                                    color: '#ffffff',
                                    font: { family: 'Inter', size: 12, weight: '500' },
                                    padding: 20
                                },
                                position: 'bottom'
                            }
                        }
                    }
                });
            }
        } catch (error) {
            console.error('Chart initialization error:', error);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, [timeframe]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            notation: 'compact',
            compactDisplay: 'short'
        }).format(amount);
    };

    const formatPercentage = (value) => {
        return (value * 100).toFixed(2) + '%';
    };

    return React.createElement('div', { className: "min-h-screen text-white" },
        // Enhanced Navigation Bar
        React.createElement('nav', { className: "nav-glass fixed top-0 left-0 right-0 z-50 p-4" },
            React.createElement('div', { className: "max-w-7xl mx-auto flex justify-between items-center" },
                React.createElement('div', { className: "flex items-center space-x-4" },
                    React.createElement('div', { className: "w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg" }),
                    React.createElement('h2', { className: "text-xl font-bold text-gradient" }, "The Truth Analytics")
                ),
                React.createElement('div', { className: "flex gap-3" },
                    ['Home', 'Governance', 'Community'].map((item, index) => 
                        React.createElement('a', { 
                            key: item,
                            href: item === 'Home' ? '/' : `/${item.toLowerCase()}`, 
                            className: "px-4 py-2 glass rounded-lg transition-all duration-300 hover:scale-105 text-sm font-medium" 
                        }, item)
                    )
                )
            )
        ),
        
        React.createElement('div', { className: "pt-20 p-6" },
            React.createElement('div', { className: "max-w-7xl mx-auto" },
                // Enhanced Header
                React.createElement('div', { className: "text-center mb-12 fade-in" },
                    React.createElement('h1', { 
                        className: "text-6xl font-bold text-gradient mb-4 floating" 
                    }, "The Truth Analytics"),
                    React.createElement('p', { className: "text-xl text-gray-300 font-medium mb-2" }, "Real-time ecosystem performance"),
                    React.createElement('p', { className: "text-lg text-gray-400" }, "Powered by advanced Web3 analytics"),
                    
                    // Enhanced Timeframe Selector
                    React.createElement('div', { className: "flex justify-center gap-2 mt-8 flex-wrap" },
                        ['24h', '7d', '30d', '90d', 'all'].map((period) =>
                            React.createElement('button', {
                                key: period,
                                onClick: () => setTimeframe(period),
                                className: `px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                                    timeframe === period
                                        ? 'btn-primary pulse-glow'
                                        : 'glass hover:scale-105'
                                }`
                            }, period.toUpperCase())
                        )
                    )
                ),

                loading ? 
                    React.createElement('div', { className: "text-center py-20" },
                        React.createElement('div', { className: "relative inline-block" },
                            React.createElement('div', { className: "animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-yellow-400 border-r-yellow-400" }),
                            React.createElement('div', { className: "absolute inset-0 animate-spin rounded-full h-16 w-16 border-4 border-transparent border-b-orange-400 border-l-orange-400", style: { animationDirection: 'reverse', animationDuration: '1.5s' } })
                        ),
                        React.createElement('p', { className: "text-xl mt-6 text-gradient" }, "Loading analytics...")
                    ) :
                    React.createElement('div', null,
                        // Enhanced Key Metrics Row
                        React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-12 fade-in" },
                            [
                                { title: "Total Revenue", value: formatCurrency(analyticsData.totalRevenue), subtitle: "Across all channels", gradient: "gradient-card", icon: "💰" },
                                { title: "Unique Collectors", value: analyticsData.holderAnalytics.uniqueHolders, subtitle: "NFT holders", gradient: "gradient-green", icon: "👥" },
                                { title: "Conversion Rate", value: formatPercentage(analyticsData.platformMetrics.conversionRate), subtitle: "Visitors to buyers", gradient: "gradient-blue", icon: "📈" },
                                { title: "Secondary Volume", value: formatCurrency(analyticsData.secondaryMarket.volume), subtitle: "Resale market", gradient: "gradient-purple", icon: "🔄" }
                            ].map((metric, index) =>
                                React.createElement('div', { 
                                    key: index,
                                    className: `glass ${metric.gradient} rounded-2xl p-8 metric-card floating`,
                                    style: { animationDelay: `${index * 0.1}s` }
                                },
                                    React.createElement('div', { className: "flex items-center justify-between mb-4" },
                                        React.createElement('span', { className: "text-3xl" }, metric.icon),
                                        React.createElement('div', { className: "w-12 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full" })
                                    ),
                                    React.createElement('h3', { className: "text-lg font-semibold text-gray-300 mb-3" }, metric.title),
                                    React.createElement('p', { className: "text-4xl font-bold mb-2 text-gradient" }, metric.value),
                                    React.createElement('p', { className: "text-sm text-gray-400" }, metric.subtitle)
                                )
                            )
                        ),

                        // Enhanced Charts Grid
                        React.createElement('div', { className: "masonry-grid mb-12 fade-in" },
                            React.createElement('div', { className: "glass rounded-2xl p-8 floating" },
                                React.createElement('div', { className: "flex items-center justify-between mb-6" },
                                    React.createElement('h3', { className: "text-2xl font-bold text-gradient" }, "Minting Velocity"),
                                    React.createElement('div', { className: "w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center text-black font-bold" }, "📊")
                                ),
                                React.createElement('div', { className: "chart-container" },
                                    React.createElement('canvas', { id: "velocityChart" })
                                )
                            ),
                            React.createElement('div', { className: "glass rounded-2xl p-8 floating" },
                                React.createElement('div', { className: "flex items-center justify-between mb-6" },
                                    React.createElement('h3', { className: "text-2xl font-bold text-gradient" }, "Revenue Breakdown"),
                                    React.createElement('div', { className: "w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold" }, "💹")
                                ),
                                React.createElement('div', { className: "chart-container" },
                                    React.createElement('canvas', { id: "revenueChart" })
                                )
                            ),
                            React.createElement('div', { className: "glass rounded-2xl p-8 floating" },
                                React.createElement('div', { className: "flex items-center justify-between mb-6" },
                                    React.createElement('h3', { className: "text-2xl font-bold text-gradient" }, "Geographic Distribution"),
                                    React.createElement('div', { className: "w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold" }, "🌍")
                                ),
                                React.createElement('div', { className: "chart-container" },
                                    React.createElement('canvas', { id: "geoChart" })
                                )
                            ),
                            React.createElement('div', { className: "glass rounded-2xl p-8 floating" },
                                React.createElement('div', { className: "flex items-center justify-between mb-6" },
                                    React.createElement('h3', { className: "text-2xl font-bold text-gradient" }, "Top Holders"),
                                    React.createElement('div', { className: "w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center text-white font-bold" }, "👑")
                                ),
                                React.createElement('div', { className: "space-y-4" },
                                    analyticsData.holderAnalytics.topHolders.map((holder, index) =>
                                        React.createElement('div', { 
                                            key: index, 
                                            className: "holder-item glass rounded-xl p-4 flex justify-between items-center" 
                                        },
                                            React.createElement('div', { className: "flex items-center space-x-4" },
                                                React.createElement('div', { className: "w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-black font-bold text-sm" }, 
                                                    `#${index + 1}`
                                                ),
                                                React.createElement('div', null,
                                                    React.createElement('p', { className: "font-semibold text-white" }, 
                                                        holder.address.slice(0,8) + '...' + holder.address.slice(-6)
                                                    ),
                                                    React.createElement('p', { className: "text-sm text-gray-400" }, 
                                                        holder.count + ' NFTs owned'
                                                    )
                                                )
                                            ),
                                            React.createElement('p', { className: "text-gradient font-bold text-lg" }, 
                                                formatCurrency(holder.totalValue)
                                            )
                                        )
                                    )
                                )
                            )
                        ),

                        // Enhanced LAW Compliance Section
                        React.createElement('div', { className: "glass rounded-2xl p-8 mb-12 fade-in" },
                            React.createElement('div', { className: "text-center mb-8" },
                                React.createElement('h3', { className: "text-3xl font-bold text-gradient mb-4" }, "⚖️ LAW Compliance & Truth Validation"),
                                React.createElement('p', { className: "text-lg text-gray-300" }, "Real-time legal framework monitoring and philosophical impact metrics")
                            ),
                            React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8" },
                                [
                                    {
                                        title: "Foundation Status",
                                        items: [
                                            { label: "Doctrinal Mapping", value: "100% Complete", color: "text-green-400" },
                                            { label: "Trust Deed", value: "Executed ✓", color: "text-blue-400" },
                                            { label: "Treasury Resolution", value: "Active ✓", color: "text-purple-400" },
                                            { label: "Foundation Score", value: "A+ Rating", color: "text-yellow-400" }
                                        ]
                                    },
                                    {
                                        title: "Compliance Metrics",
                                        items: [
                                            { label: "KYC Verification", value: "94.7%", color: "text-green-400" },
                                            { label: "Tax ID Status", value: "FL: 23-8019835728-2", color: "text-blue-400" },
                                            { label: "OFAC Blocks", value: "12 prevented", color: "text-purple-400" },
                                            { label: "Over-Compliance", value: "147% standard", color: "text-yellow-400" }
                                        ]
                                    },
                                    {
                                        title: "Economic Validation",
                                        items: [
                                            { label: "NFT Premium vs Shop", value: "1,313% markup", color: "text-green-400" },
                                            { label: "Total Economic Value", value: formatCurrency(analyticsData.totalRevenue * 1.5), color: "text-yellow-400" },
                                            { label: "Secondary Multiplier", value: (analyticsData.secondaryMarket.averagePrice / 777).toFixed(2) + 'x', color: "text-blue-400" },
                                            { label: "Market Hypothesis", value: "Validated ✓", color: "text-purple-400" }
                                        ]
                                    },
                                    {
                                        title: "Truth Impact",
                                        items: [
                                            { label: "Institutional Translation", value: "Ongoing", color: "text-orange-400" },
                                            { label: "Web3 Adoption", value: analyticsData.holderAnalytics.uniqueHolders + ' holders', color: "text-green-400" },
                                            { label: "Global Reach", value: Object.keys(analyticsData.geographicDistribution).length + ' countries', color: "text-blue-400" },
                                            { label: "Philosophy Spread", value: analyticsData.platformMetrics.webVisitors + ' visitors', color: "text-yellow-400" }
                                        ]
                                    }
                                ].map((section, sectionIndex) =>
                                    React.createElement('div', { 
                                        key: sectionIndex,
                                        className: "glass rounded-xl p-6 floating",
                                        style: { animationDelay: `${sectionIndex * 0.1}s` }
                                    },
                                        React.createElement('h4', { className: "text-xl font-bold text-gradient mb-6" }, section.title),
                                        React.createElement('div', { className: "space-y-4" },
                                            section.items.map((item, itemIndex) =>
                                                React.createElement('div', { 
                                                    key: itemIndex,
                                                    className: "flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0" 
                                                },
                                                    React.createElement('span', { className: "text-sm text-gray-300 font-medium" }, item.label + ":"),
                                                    React.createElement('span', { className: `text-sm font-bold ${item.color}` }, item.value)
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    )
            )
        )
    );
}

// Enhanced initialization with error handling
function initializeApp() {
    console.log('Initializing Enhanced Analytics App...');
    const rootElement = document.getElementById('analytics-root');
    
    if (!rootElement) {
        console.error('Root element not found');
        return;
    }
    
    if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') {
        console.error('React libraries not loaded');
        setTimeout(initializeApp, 1000);
        return;
    }
    
    try {
        const root = ReactDOM.createRoot(rootElement);
        root.render(React.createElement(AnalyticsDashboard));
        console.log('Enhanced analytics dashboard rendered successfully');
    } catch (error) {
        console.error('Error rendering analytics dashboard:', error);
        rootElement.innerHTML = `
            <div class="min-h-screen text-white p-8 flex items-center justify-center">
                <div class="text-center glass rounded-2xl p-12">
                    <h1 class="text-4xl font-bold text-red-400 mb-6">Analytics Dashboard Error</h1>
                    <p class="text-lg text-gray-300 mb-6">Unable to load React components. Please refresh the page.</p>
                    <button onclick="window.location.reload()" class="btn-primary px-8 py-3 rounded-xl">
                        Refresh Page
                    </button>
                </div>
            </div>
        `;
    }
}

// Multiple initialization strategies
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

setTimeout(() => {
    if (document.getElementById('analytics-root').innerHTML.includes('Loading Analytics Dashboard')) {
        console.log('Attempting backup initialization...');
        initializeApp();
    }
}, 2000);

// Additional backup
window.addEventListener('load', () => {
    setTimeout(initializeApp, 500);
});
