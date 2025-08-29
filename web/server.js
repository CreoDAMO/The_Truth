const express = require('express');
const path = require('path');
const RateLimit = require('express-rate-limit');
const app = express();
const port = process.env.PORT || 5000;

// Trust proxy for Replit hosting environment
app.set('trust proxy', true);

// Set up rate limiter: maximum of 100 requests per 15 minutes per IP
const limiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// Apply rate limiter to all requests
app.use(limiter);

// Enable CORS and JSON parsing
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.use(express.json());

// Serve static files from the web directory first (highest priority)
app.use(express.static(__dirname));
// Then serve from parent directory
app.use(express.static(path.join(__dirname, '..')));

// Serve PWA manifest with correct MIME type
app.get('/manifest.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.sendFile(path.join(__dirname, 'manifest.json'));
});

// Event tracking endpoint
app.post('/api/track-event', (req, res) => {
    const { event, page, timestamp, userAgent } = req.body;
    
    // Log analytics event (replace with real analytics service)
    console.log('Analytics Event:', {
        event,
        page,
        timestamp: new Date(timestamp),
        userAgent,
        ip: req.ip
    });
    
    res.json({ success: true });
});

// Serve contract artifacts specifically
app.use('/contract-artifacts.js', express.static(path.join(__dirname, '..', 'contract-artifacts.js')));


// API Routes
app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from the API!' });
});

// Tax calculation endpoint
app.post('/api/calculate-nft-tax', async (req, res) => {
  try {
    const { amount, customerAddress } = req.body;
    // Mock tax calculation for now - integrate with Stripe Tax later
    const taxAmount = amount * 0.065; // 6.5% Florida sales tax
    res.json({
      success: true,
      taxAmount: taxAmount,
      totalAmount: amount + taxAmount,
      calculationId: 'calc_' + Date.now()
    });
  } catch (error) {
    console.error('Tax calculation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Tax transaction recording endpoint
app.post('/api/create-tax-transaction', async (req, res) => {
  try {
    const { calculationId, transactionId, saleType } = req.body;
    console.log('Tax transaction recorded:', { calculationId, transactionId, saleType });
    res.json({ success: true, message: 'Tax transaction recorded' });
  } catch (error) {
    console.error('Tax transaction recording error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Analytics endpoint
app.get('/api/analytics', async (req, res) => {
  try {
    const { timeframe = '7d' } = req.query;
    
    // Mock analytics data - replace with real data sources
    const analyticsData = {
      totalRevenue: 75000, // $75k total
      mintingVelocity: [
        { date: '2024-01-01', mints: 5 },
        { date: '2024-01-02', mints: 8 },
        { date: '2024-01-03', mints: 12 },
        { date: '2024-01-04', mints: 7 },
        { date: '2024-01-05', mints: 15 },
        { date: '2024-01-06', mints: 10 },
        { date: '2024-01-07', mints: 9 }
      ],
      geographicDistribution: {
        'United States': 45,
        'United Kingdom': 12,
        'Germany': 8,
        'Japan': 6,
        'Canada': 5,
        'Australia': 4
      },
      holderAnalytics: {
        uniqueHolders: 80,
        topHolders: [
          { address: '0x742d35Cc6523c0532925a3b8D4b9d35C21B64C4A', count: 3, totalValue: 2331 },
          { address: '0x8ba1f109551bD432803012645Hac136c82d', count: 2, totalValue: 1554 },
          { address: '0x2f318C334780961FB129D2a6c30D0763d9a5C970', count: 2, totalValue: 1554 }
        ],
        holdingDuration: [30, 45, 60, 15, 90] // days
      },
      secondaryMarket: {
        volume: 25000,
        averagePrice: 950,
        priceHistory: [
          { date: '2024-01-01', price: 777 },
          { date: '2024-01-02', price: 825 },
          { date: '2024-01-03', price: 890 },
          { date: '2024-01-04', price: 920 },
          { date: '2024-01-05', price: 950 }
        ]
      },
      platformMetrics: {
        webVisitors: 5200,
        conversionRate: 0.042,
        shopSales: 85,
        nftSales: 57
      }
    };

    res.json(analyticsData);
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Philosophy metrics endpoint
app.get('/api/philosophy-metrics', async (req, res) => {
  try {
    const metrics = {
      truthValidationScore: 94.7, // How well market behavior matches predictions
      institutionalTranslationRate: 67.3, // % of responses that "translated" the truth
      abundanceImpact: 1313, // % premium NFT commands over direct purchase
      witnessEngagement: 87.2, // Active engagement vs passive consumption
      paradoxDemonstration: 98.1 // How clearly the system demonstrates its own thesis
    };
    
    res.json(metrics);
  } catch (error) {
    console.error('Philosophy metrics error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Catch-all for serving the main HTML file for client-side routing
// This should be the last route defined
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: ['http://localhost:5000', 'https://*.replit.dev', 'https://*.replit.app', 'https://*.repl.co'],
    credentials: true
}));

app.use(express.json());
app.use(express.static('web'));

// Serve main pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/governance', (req, res) => {
    res.sendFile(path.join(__dirname, 'governance.html'));
});

app.get('/community', (req, res) => {
    res.sendFile(path.join(__dirname, 'community-dashboard.html'));
});

app.get('/analytics', (req, res) => {
    res.sendFile(path.join(__dirname, 'analytics.html'));
});

app.get('/deploy', (req, res) => {
    res.sendFile(path.join(__dirname, 'deploy.html'));
});

app.get('/shop', (req, res) => {
    res.sendFile(path.join(__dirname, 'shop.html'));
});

// API Routes for Community Features
app.post('/api/governance/vote', async (req, res) => {
    try {
        const { proposalId, vote, address, signature } = req.body;
        
        // In production, verify signature and token holdings
        console.log(`Vote received: ${address} voted ${vote} on proposal ${proposalId}`);
        
        res.json({ 
            success: true, 
            message: 'Vote recorded successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

app.get('/api/governance/proposals', (req, res) => {
    // Mock proposals - in production, fetch from database/IPFS
    const proposals = [
        {
            id: 1,
            title: "Bonus Gift Collection Pricing",
            description: "Should we reduce the Bonus Gift NFT price from 0.039 ETH to 0.025 ETH to increase accessibility?",
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
        },
        {
            id: 3,
            title: "New Collection Theme",
            description: "Next philosophical NFT collection should focus on \"The Gap Between Knowledge and Wisdom\"",
            yesVotes: 74,
            noVotes: 26,
            totalVotes: 2156,
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'active'
        }
    ];
    
    res.json(proposals);
});

app.get('/api/community/content/:address', async (req, res) => {
    try {
        const { address } = req.params;
        
        // In production, verify token holdings from blockchain
        const mockContent = [
            {
                id: 1,
                title: "The Complete 25-Page Analysis",
                description: "Full unedited philosophical framework",
                type: "pdf",
                requirement: "Any NFT holder",
                accessible: true,
                url: "/content/complete-analysis.pdf"
            },
            {
                id: 2,
                title: "Extended Audio Commentary",
                description: "45-minute deep dive with creator insights",
                type: "audio",
                requirement: "100+ Creator tokens",
                accessible: false, // Would check token balance
                url: "/content/extended-commentary.mp3"
            }
        ];
        
        res.json(mockContent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/community/revenue/:address', async (req, res) => {
    try {
        const { address } = req.params;
        
        // Mock revenue calculation - in production, calculate from blockchain data
        const revenueData = {
            totalEarned: 245.67,
            thisMonth: 23.45,
            nextDistribution: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
            breakdown: {
                nftRoyalties: 15.20,
                audiobookSales: 5.15,
                tokenRewards: 3.10
            }
        };
        
        res.json(revenueData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/community/access-discord', async (req, res) => {
    try {
        const { address, tokenHoldings } = req.body;
        
        // In production, verify token holdings and generate Discord invite
        const accessLevel = tokenHoldings.creator >= 1000 ? 'premium' : 'basic';
        
        res.json({
            success: true,
            inviteUrl: 'https://discord.gg/thetruth',
            accessLevel: accessLevel,
            channels: accessLevel === 'premium' ? 
                ['general', 'philosophy', 'exclusive', 'governance'] :
                ['general', 'philosophy']
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Token information endpoints
app.get('/api/tokens/info', (req, res) => {
    const tokenInfo = {
        truth: {
            address: '0x8f6cf6f7747e170f4768533b869c339dc3d30a3c',
            symbol: 'TRUTH',
            decimals: 18,
            totalSupply: '10000000',
            network: 'base',
            description: 'Platform governance and utility token'
        },
        creator: {
            address: '0x22b0434e89882f8e6841d340b28427646c015aa7',
            symbol: '@jacqueantoinedegraff',
            decimals: 18,
            totalSupply: '1000000000',
            network: 'base',
            description: 'Creator economy and community access token'
        }
    };
    
    res.json(tokenInfo);
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        features: {
            governance: true,
            community: true,
            tokenIntegration: true,
            analytics: true
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 The Truth Community Server running on http://0.0.0.0:${PORT}`);
    console.log(`📊 Analytics: http://0.0.0.0:${PORT}/analytics`);
    console.log(`🗳️  Governance: http://0.0.0.0:${PORT}/governance`);
    console.log(`👥 Community: http://0.0.0.0:${PORT}/community`);
    console.log(`🏪 Shop: http://0.0.0.0:${PORT}/shop`);
    console.log(`🚀 Deploy: http://0.0.0.0:${PORT}/deploy`);
});
