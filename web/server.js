const express = require('express');
const path = require('path');
const RateLimit = require('express-rate-limit');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for Replit hosting environment - configure safely for rate limiting
app.set('trust proxy', 1); // Trust first proxy only

// Set up rate limiter: maximum of 100 requests per 15 minutes per IP
const limiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  trustProxy: 1, // Match app trust proxy setting
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiter to all requests
app.use(limiter);

// Enable CORS and JSON parsing
app.use(cors({
    origin: ['http://localhost:5000', 'https://*.replit.dev', 'https://*.replit.app', 'https://*.repl.co'],
    credentials: true
}));
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

// Serve contract artifacts specifically
app.use('/contract-artifacts.js', express.static(path.join(__dirname, '..', 'contract-artifacts.js')));

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

app.get('/payments', (req, res) => {
    res.sendFile(path.join(__dirname, 'payments.html'));
});

app.get('/social', (req, res) => {
    res.sendFile(path.join(__dirname, 'social.html'));
});

app.get('/ai', (req, res) => {
    res.sendFile(path.join(__dirname, 'ai-insights.html'));
});

app.get('/lawful', (req, res) => {
    res.sendFile(path.join(__dirname, 'lawful-dashboard.html'));
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

// Enhanced Payment Infrastructure APIs
app.post('/api/payments/gasless-mint', async (req, res) => {
    try {
        const { recipient, quantity, tokenType } = req.body;

        // Mock gasless minting - in production, use meta-transactions
        const mintId = 'gasless_' + Date.now();

        res.json({
            success: true,
            mintId,
            message: 'Gasless mint initiated',
            estimatedCompletion: 30 // seconds
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/payments/fiat-to-nft', async (req, res) => {
    try {
        const { email, cardToken, nftType, quantity } = req.body;

        // Mock fiat-to-NFT conversion with wallet creation
        const walletAddress = '0x' + Math.random().toString(16).substr(2, 40);
        const transactionId = 'fiat_' + Date.now();

        res.json({
            success: true,
            transactionId,
            walletAddress,
            privateKeyBackup: 'mnemonic phrase would be securely provided',
            nftTokenIds: Array.from({length: quantity}, (_, i) => 1000 + i)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/payments/subscription', async (req, res) => {
    try {
        const { address, plan, paymentMethod } = req.body;

        const subscriptions = {
            monthly: { price: 29.99, benefits: ['Basic content', 'Community access'] },
            yearly: { price: 299.99, benefits: ['All content', 'Premium community', 'Airdrops', 'Governance voting'] }
        };

        res.json({
            success: true,
            subscriptionId: 'sub_' + Date.now(),
            plan: subscriptions[plan],
            nextBilling: new Date(Date.now() + (plan === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000).toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Social & Viral Features APIs
app.post('/api/social/referral', async (req, res) => {
    try {
        const { referrerAddress, refereeAddress, actionType } = req.body;

        const rewards = {
            mint: { referrer: 0.01, referee: 0.005 }, // ETH
            subscription: { referrer: 10, referee: 5 }, // USD value
            purchase: { referrer: 0.02, referee: 0.01 }
        };

        res.json({
            success: true,
            rewardId: 'ref_' + Date.now(),
            rewards: rewards[actionType],
            referralCode: btoa(referrerAddress).substr(0, 8).toUpperCase()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/social/profile/:address', async (req, res) => {
    try {
        const { address } = req.params;

        // Mock collector profile
        const profile = {
            address,
            ensName: null,
            joinDate: '2024-01-15',
            nftCount: 3,
            truthTokens: 2500,
            creatorTokens: 15000,
            philosophyAlignment: 94.5,
            collections: [
                { name: 'The Truth Original', count: 1, rarity: 'Rare' },
                { name: 'Bonus Gift', count: 2, rarity: 'Common' }
            ],
            achievements: ['Early Adopter', 'Truth Seeker', 'Community Builder'],
            referrals: 7,
            contentContributions: 12
        };

        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/social/share', async (req, res) => {
    try {
        const { nftId, platform, customMessage } = req.body;

        const shareUrl = `https://thetruth.nft/share/${nftId}`;
        const shareText = customMessage || "Check out this Truth NFT - where philosophy meets blockchain!";

        res.json({
            success: true,
            shareUrl,
            shareText,
            previewImage: `https://thetruth.nft/api/og-image/${nftId}`,
            trackingId: 'share_' + Date.now()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// AI-Powered Extensions APIs
app.post('/api/ai/analyze-content', async (req, res) => {
    try {
        const { content, analysisType } = req.body;

        // Mock AI analysis through Truth philosophical lens
        const analyses = {
            truth_validation: {
                score: 87.3,
                insights: [
                    "Content demonstrates institutional translation gap",
                    "Aligns with abundance over scarcity principles",
                    "Shows clear paradox resolution"
                ],
                truthMoments: [
                    "Identification of systemic contradiction",
                    "Recognition of translation mechanisms"
                ]
            },
            philosophy_alignment: {
                score: 92.1,
                themes: ["Abundance", "Truth", "Institutional Analysis"],
                recommendations: [
                    "Explore deeper institutional examples",
                    "Connect to current events",
                    "Add personal experience narratives"
                ]
            }
        };

        res.json({
            success: true,
            analysis: analyses[analysisType] || analyses.truth_validation,
            analysisId: 'ai_' + Date.now()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/ai/generate-insights/:address', async (req, res) => {
    try {
        const { address } = req.params;

        // Mock personalized insights based on holder activity
        const insights = {
            personalizedMessage: "Your collection shows deep alignment with truth-seeking principles. Consider exploring the intersection of AI and institutional translation.",
            recommendedContent: [
                "The Philosophy of Artificial Intelligence",
                "Institutional AI: Promise vs Reality",
                "Truth in the Age of Algorithms"
            ],
            truthScore: 94.7,
            nextRecommendations: [
                "Share your AI experience story",
                "Join the Philosophy Discussion group",
                "Consider the Truth Validator role"
            ]
        };

        res.json(insights);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/ai/generate-image', async (req, res) => {
    try {
        const { prompt, style, philosophicalTheme } = req.body;

        // Mock AI image generation for community creators
        const imageData = {
            imageUrl: `https://thetruth.nft/ai-generated/${Date.now()}.png`,
            promptUsed: `${prompt} in the style of ${style} with ${philosophicalTheme} philosophical themes`,
            metadata: {
                generator: 'Truth AI Engine v1.0',
                philosophicalAlignment: 89.2,
                truthElements: ['abundance', 'paradox', 'institutional_gap']
            },
            generationId: 'img_' + Date.now()
        };

        res.json({
            success: true,
            ...imageData
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/ai/update-metadata', async (req, res) => {
    try {
        const { tokenId, interactionData } = req.body;

        // Mock dynamic metadata updates based on holder interactions
        const updatedMetadata = {
            name: `The Truth #${tokenId}`,
            description: "Dynamic NFT that evolves with community interaction",
            attributes: [
                { trait_type: "Truth Score", value: 94.5 },
                { trait_type: "Interaction Level", value: "Active" },
                { trait_type: "Philosophy Alignment", value: "Deep" },
                { trait_type: "Community Engagement", value: interactionData.engagementLevel || "High" }
            ],
            lastUpdated: new Date().toISOString(),
            evolutionStage: interactionData.stage || "Enlightened"
        };

        res.json({
            success: true,
            metadata: updatedMetadata,
            updateId: 'meta_' + Date.now()
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

        // Mock analytics data with proper structure
        const analyticsData = {
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
      truthValidationScore: 94.7,
      institutionalTranslationRate: 67.3,
      abundanceImpact: 1313,
      witnessEngagement: 87.2,
      paradoxDemonstration: 98.1
    };

    res.json(metrics);
  } catch (error) {
    console.error('Philosophy metrics error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Analytics API endpoint
app.get('/api/analytics', (req, res) => {
    const timeframe = req.query.timeframe || '7d';

    // Generate mock analytics data based on timeframe
    const analyticsData = {
        totalRevenue: 847650,
        mintingVelocity: [
            { date: '2025-08-24', mints: 15 },
            { date: '2025-08-25', mints: 23 },
            { date: '2025-08-26', mints: 31 },
            { date: '2025-08-27', mints: 18 },
            { date: '2025-08-28', mints: 44 },
            { date: '2025-08-29', mints: 67 },
            { date: '2025-08-30', mints: 52 }
        ],
        geographicDistribution: {
            'United States': 342,
            'Canada': 89,
            'United Kingdom': 67,
            'Germany': 45,
            'France': 34,
            'Netherlands': 28,
            'Australia': 23,
            'Japan': 19,
            'Switzerland': 15,
            'Singapore': 12
        },
        holderAnalytics: {
            uniqueHolders: 674,
            topHolders: [
                { address: '0x742d35Cc6523c0532925a3b8D4b9d35C21B64C4A', count: 12, totalValue: 15847 },
                { address: '0x8f6cf6f7747e170f4768533b869c339dc3d30a3c', count: 8, totalValue: 12456 },
                { address: '0x22b0434e89882f8e6841d340b28427646c015aa7', count: 6, totalValue: 9873 },
                { address: '0x1a2b3c4d5e6f7890abcdef1234567890fedcba09', count: 5, totalValue: 8234 },
                { address: '0x9876543210fedcba0987654321abcdef12345678', count: 4, totalValue: 6789 }
            ]
        },
        secondaryMarket: {
            volume: 234567,
            averagePrice: 1847,
            priceHistory: []
        },
        platformMetrics: {
            webVisitors: 12847,
            conversionRate: 0.0847,
            shopSales: 156,
            nftSales: 342
        }
    };

    res.json(analyticsData);
});

// Compliance dashboard endpoint
app.get('/api/compliance-dashboard', (req, res) => {
    const complianceData = {
        treasury: {
            address: '0x742d35Cc6523c0532925a3b8D4b9d35C21B64C4A', // Mock multisig address
            ethBalance: '15.47',
            truthBalance: '125000',
            lastResolution: 'TRS-2025-08-30-001',
            status: 'operational'
        },
        kyc: {
            verificationRate: 94.7,
            sanctionsBlocked: 12,
            countries: 67,
            lastUpdate: new Date().toISOString()
        },
        tax: {
            collected: 4847.23,
            transactionCount: 1247,
            lastRemittance: 'August 15, 2025',
            floridaTaxId: '23-8019835728-2'
        },
        trust: {
            status: 'irrevocable',
            lastAttestation: 'August 30, 2025',
            masterHash: '0x7f2edbf4f44162b135d00cbc4cc463ba61747ec4c48e95426865748a4fc521a2',
            trusteeAudit: 'Q4 2025 Scheduled'
        },
        legal: {
            doctrinalMapping: 100,
            contractAudits: 'Scheduled Q4 2025',
            termsCompliance: 'active',
            disputeResolution: 'arbitration ready'
        }
    };

    res.json(complianceData);
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        contracts: process.env.NODE_ENV === 'production' ? 'deployed' : 'development'
    });
});

// Comprehensive system status endpoint
app.get('/api/system-status', (req, res) => {
    const systemStatus = {
        server: {
            status: 'operational',
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            version: process.version
        },
        contracts: {
            truthToken: {
                address: '0x8f6cf6f7747e170f4768533b869c339dc3d30a3c',
                network: 'Base',
                status: 'deployed'
            },
            creatorToken: {
                address: '0x22b0434e89882f8e6841d340b28427646c015aa7',
                network: 'Base',
                status: 'deployed'
            },
            nftContracts: {
                theTruth: { status: 'ready_for_deployment' },
                bonusGift: { status: 'ready_for_deployment' },
                partThree: { status: 'ready_for_deployment' }
            }
        },
        integrations: {
            analytics: { status: 'active' },
            payments: { status: 'configured' },
            ipfs: { 
                status: 'active',
                group: 'https://app.pinata.cloud/ipfs/groups/477dfcab-ef52-4227-96f2-f9588c6294d4'
            },
            deployment: { status: 'github_pages_active' }
        },
        legal: {
            tokenTerms: 'documented',
            compliance: 'florida_law',
            treasury: 'configured'
        },
        timestamp: new Date().toISOString()
    };

    res.json(systemStatus);
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
            analytics: true,
            payments: true,
            social: true,
            ai: true,
            lawfulCompliance: true
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Catch-all for serving the main HTML file for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server with error handling
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ The Truth NFT server running on port ${PORT}`);
  console.log(`🔗 Access: http://0.0.0.0:${PORT}`);
  console.log(`📊 Analytics: http://0.0.0.0:${PORT}/analytics`);
  console.log(`🗳️ Governance: http://0.0.0.0:${PORT}/governance`);
  console.log(`👥 Community: http://0.0.0.0:${PORT}/community`);
  console.log(`💳 Payments: http://0.0.0.0:${PORT}/payments`);
  console.log(`⚖️ Legal: http://0.0.0.0:${PORT}/lawful`);
  console.log(`🛍️ Shop: http://0.0.0.0:${PORT}/shop`);
  console.log(`🤖 AI Insights: http://0.0.0.0:${PORT}/ai`);
  console.log(`🚀 Deploy: http://0.0.0.0:${PORT}/deploy`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`❌ Port ${PORT} is busy, trying port ${PORT + 1}...`);
    const altServer = app.listen(PORT + 1, '0.0.0.0', () => {
      console.log(`✅ The Truth NFT server running on port ${PORT + 1}`);
      console.log(`🔗 Access: http://localhost:${PORT + 1}`);
    });
  } else {
    console.error('Server error:', err);
  }
});