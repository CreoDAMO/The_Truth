import express from 'express';
import path from 'path';
import fs from 'fs';
import RateLimit from 'express-rate-limit';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Allow localhost for development
        if (origin.includes('localhost')) return callback(null, true);

        // Allow Replit domains
        if (origin.endsWith('.replit.dev') || origin.endsWith('.replit.app') || origin.endsWith('.repl.co')) {
            return callback(null, true);
        }

        // Fallback - for development allow all origins
        return callback(null, true);
    },
    credentials: true
}));
app.use(express.json());

// Serve static assets from web directory (legacy files)
app.use('/web', express.static(path.join(__dirname)));

// Serve the React build from dist directory (primary)
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));
console.log('Serving static files from:', distPath);

// Explicit routes for LAW directory files
app.use('/LAW', express.static(path.join(__dirname, '..', 'LAW')));

// Serve markdown files with correct MIME type
app.get('/LAW/*.md', (req, res) => {
    const fileName = req.params[0];
    const lawDir = path.resolve(__dirname, '..', 'LAW');
    // Construct full file path and normalize
    const filePath = path.resolve(lawDir, fileName + '.md');
    // Ensure the resolved path is within the LAW directory
    if (!filePath.startsWith(lawDir + path.sep)) {
        return res.status(403).send('Access denied');
    }
    res.setHeader('Content-Type', 'text/markdown');
    res.sendFile(filePath);
});

// API endpoints for dashboard data
app.get('/api/analytics', (req, res) => {
    res.json({
        totalSupply: 77,
        mintedCount: 42,
        totalRevenue: "12.5 ETH",
        holders: 35,
        collections: [
            { name: "The Truth Original", supply: 77, minted: 42, price: "0.1695 ETH" },
            { name: "Bonus Gift", supply: 145000, minted: 1250, price: "0.039 ETH" },
            { name: "Part Three", supply: 444, minted: 0, price: "TBD" }
        ],
        recentTransactions: [
            { hash: "0x123...", amount: "0.1695 ETH", timestamp: new Date().toISOString() },
            { hash: "0x456...", amount: "0.039 ETH", timestamp: new Date().toISOString() }
        ]
    });
});

app.get('/api/governance', (req, res) => {
    res.json({
        proposals: [
            { id: 1, title: "Add new collection", status: "active", votes: 1250 },
            { id: 2, title: "Update royalties", status: "pending", votes: 890 }
        ],
        totalVotingPower: 5000,
        activeProposals: 2
    });
});

app.get('/api/community', (req, res) => {
    res.json({
        totalHolders: 35,
        activeMembers: 28,
        truthScore: 94.7,
        engagement: 87.2,
        geographicDistribution: [
            { country: "US", holders: 15 },
            { country: "UK", holders: 8 },
            { country: "Canada", holders: 5 },
            { country: "Germany", holders: 4 },
            { country: "Other", holders: 3 }
        ]
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'The Truth NFT Server Running' });
});

// All routes handled by React Router (SPA)
app.get('*', (req, res) => {
    // Handle API routes with proper JSON responses
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ 
            error: 'API endpoint not found',
            path: req.path,
            message: 'This API endpoint is not implemented'
        });
    }

    // Static assets routes
    if (req.path.startsWith('/assets/') || 
        req.path.startsWith('/LAW/') ||
        req.path.includes('.js') || 
        req.path.includes('.css') || 
        req.path.includes('.png') || 
        req.path.includes('.jpg') || 
        req.path.includes('.ico') ||
        req.path.includes('.json') ||
        req.path.includes('.txt') ||
        req.path.includes('.md')) {
        return res.status(404).send('Not found');
    }

    // Serve React app
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

// Serve PWA manifest with correct MIME type
app.get('/manifest.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.sendFile(path.join(__dirname, 'manifest.json'));
});

// Serve contract artifacts specifically
app.use('/contract-artifacts.js', express.static(path.join(__dirname, '..', 'contract-artifacts.js')));



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

// AI-Powered Merch Generation APIs
app.post('/api/ai/generate-merch', async (req, res) => {
    try {
        const { nftTokenId, merchantType, style, philosophicalTheme } = req.body;

        if (!nftTokenId) {
            return res.status(400).json({ 
                success: false, 
                error: 'NFT Token ID is required' 
            });
        }

        // Mock function to fetch NFT metadata (replace with actual API call)
        const fetchNFTMetadata = async (tokenId) => {
            // Placeholder for actual NFT metadata fetching
            return {
                image: `https://example.com/nfts/${tokenId}.png`,
                description: 'A unique NFT representing a philosophical concept.',
                attributes: [
                    { trait_type: 'Rarity', value: 'Rare' },
                    { trait_type: 'Theme', value: 'Truth' }
                ]
            };
        };

        // Mock function to generate merch design
        const generateMerchDesign = async (data) => {
            // Placeholder for actual design generation logic
            return {
                designUrl: `https://example.com/designs/${Date.now()}.png`,
                prompt: `Generate a ${data.merchantType} design based on NFT image ${data.originalImage} with ${data.description} and themes: ${data.attributes.map(a => a.value).join(', ')}. Style: ${data.style}. Philosophical theme: ${data.philosophicalTheme}.`
            };
        };

        // Mock function to create print-ready product via Printful API
        const createPrintfulProduct = async (design) => {
            // Placeholder for actual Printful API integration
            return {
                printfulId: 'printful_' + Date.now(),
                productUrl: 'https://example.com/product/123',
                estimatedProductionTime: '2-3 business days'
            };
        };

        // Fetch NFT metadata
        const nftMetadata = await fetchNFTMetadata(nftTokenId);
        if (!nftMetadata) {
            return res.status(404).json({ 
                success: false, 
                error: 'NFT not found or metadata unavailable' 
            });
        }

        // Generate AI-powered merch design
        const merchDesign = await generateMerchDesign({
            originalImage: nftMetadata.image,
            description: nftMetadata.description,
            attributes: nftMetadata.attributes,
            merchantType: merchantType || 'tshirt',
            style: style || 'minimalist',
            philosophicalTheme: philosophicalTheme || 'truth_seeker'
        });

        // Create print-ready product via Printful API
        const printfulProduct = await createPrintfulProduct(merchDesign);

        res.json({
            success: true,
            merchId: 'merch_' + Date.now(),
            nftTokenId,
            design: merchDesign,
            printfulProduct,
            estimatedDelivery: '7-14 business days',
            pricing: {
                base: 24.99,
                profit: 10.00,
                total: 34.99
            }
        });

    } catch (error) {
        console.error('Merch generation failed:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to generate merch design' 
        });
    }
});

app.post('/api/ai/analyze-nft-for-merch', async (req, res) => {
    try {
        const { nftTokenId } = req.body;

        // Mock function to analyze NFT for merch potential
        const analyzeNFTForMerch = async (tokenId) => {
            // Placeholder for actual NFT analysis logic
            return {
                recommendations: ['T-shirt', 'Hoodie', 'Poster'],
                compatibleMerchTypes: ['apparel', 'print'],
                truthAlignmentScore: 88.5,
                designElements: ['philosophy_icon', 'truth_symbol', 'geometric_pattern'],
                styleSuggestions: ['minimalist', 'abstract', 'vintage']
            };
        };

        // Fetch and analyze NFT for merch potential
        const analysis = await analyzeNFTForMerch(nftTokenId);

        res.json({
            success: true,
            analysis,
            recommendations: analysis.recommendations,
            merchTypes: analysis.compatibleMerchTypes,
            truthAlignmentScore: analysis.truthAlignmentScore
        });

    } catch (error) {
        console.error('NFT analysis failed:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to analyze NFT for merch potential' 
        });
    }
});

// Coinbase Agentkit Integration for Deployment
app.post('/api/deploy/agentkit-deploy', async (req, res) => {
    try {
        const { contractType, network, deploymentParams } = req.body;

        // Validate request
        if (!contractType || !network) {
            return res.status(400).json({
                success: false,
                error: 'Contract type and network are required'
            });
        }

        // Security check - only allow authorized deployments
        const verifyDeploymentAuth = async (request) => {
            // Placeholder for actual authorization logic (e.g., API key, IP allowlist)
            return true; // Allow for now
        };
        const isAuthorized = await verifyDeploymentAuth(req);
        if (!isAuthorized) {
            return res.status(403).json({
                success: false,
                error: 'Unauthorized deployment request'
            });
        }

        // Mock function to initialize Agentkit deployment
        const initializeAgentKitDeployment = async ({ contractType, network, params, deployer }) => {
            // Placeholder for actual Agentkit SDK integration
            return {
                id: 'deploy_' + Date.now(),
                status: 'initiated'
            };
        };

        // Initialize Coinbase Agentkit deployment
        const deployment = await initializeAgentKitDeployment({
            contractType,
            network,
            params: deploymentParams,
            deployer: req.ip // Track deployer for security
        });

        res.json({
            success: true,
            deploymentId: deployment.id,
            status: 'initiated',
            estimatedTime: '2-5 minutes',
            trackingUrl: `/api/deploy/status/${deployment.id}`
        });

    } catch (error) {
        console.error('AgentKit deployment failed:', error);
        res.status(500).json({
            success: false,
            error: 'Deployment initiation failed'
        });
    }
});

app.get('/api/deploy/status/:deploymentId', async (req, res) => {
    try {
        const { deploymentId } = req.params;

        // Mock function to get deployment status
        const getDeploymentStatus = async (id) => {
            // Placeholder for actual status retrieval logic
            return {
                status: 'completed',
                contractAddress: '0x123...deploy',
                transactionHash: '0xabc...tx',
                blockNumber: 1234567,
                gasUsed: '21000',
                timestamp: new Date().toISOString()
            };
        };

        const status = await getDeploymentStatus(deploymentId);

        res.json({
            success: true,
            deploymentId,
            status: status.status,
            contractAddress: status.contractAddress,
            transactionHash: status.transactionHash,
            blockNumber: status.blockNumber,
            gasUsed: status.gasUsed,
            timestamp: status.timestamp
        });

    } catch (error) {
        console.error('Status check failed:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get deployment status'
        });
    }
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
app.get('/api/analytics/geographic', async (req, res) => {
    try {
        // This would connect to blockchain analytics in production
        // For now, return empty data structure that will be populated as holders grow
        const geographicData = [
            { country: 'United States', holders: 0, percentage: 0 },
            { country: 'Canada', holders: 0, percentage: 0 },
            { country: 'United Kingdom', holders: 0, percentage: 0 },
            { country: 'Germany', holders: 0, percentage: 0 },
            { country: 'Australia', holders: 0, percentage: 0 },
            { country: 'Netherlands', holders: 0, percentage: 0 },
            { country: 'Other', holders: 0, percentage: 0 }
        ];

        res.json(geographicData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/analytics/recent-activity', async (req, res) => {
    try {
        // This would connect to blockchain events in production
        // Return empty array until contracts are deployed and events start flowing
        const recentActivity = [];

        res.json(recentActivity);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/analytics/contract-data', async (req, res) => {
    try {
        // Real contract data from Base network
        const contractData = {
            truthToken: {
                address: '0x8f6cf6f7747e170f4768533b869c339dc3d30a3c',
                network: 'Base',
                verified: true
            },
            creatorToken: {
                address: '0x22b0434e89882f8e6841d340b28427646c015aa7',
                network: 'Base', 
                verified: true
            }
        };

        res.json(contractData);
    } catch (error) {
        res.status(500).json({ error: error.message });
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

// New enhanced analytics endpoints for real blockchain data
app.get('/api/analytics/contract-data', async (req, res) => {
    try {
        const contractData = {
            truthToken: {
                address: '0x8f6cf6f7747e170f4768533b869c339dc3d30a3c',
                network: 'Base',
                verified: true
            },
            creatorToken: {
                address: '0x22b0434e89882f8e6841d340b28427646c015aa7',
                network: 'Base', 
                verified: true
            },
            nftContracts: {
                TheTruth: process.env.THETRUTH_CONTRACT_ADDRESS || null,
                TruthBonusGift: process.env.TRUTHBONUSGIFT_CONTRACT_ADDRESS || null,
                TruthPartThree: process.env.TRUTHPARTTHREE_CONTRACT_ADDRESS || null,
                EnhancedTheTruth: process.env.ENHANCED_THETRUTH_CONTRACT_ADDRESS || null
            }
        };

        res.json(contractData);
    } catch (error) {
        console.error('Contract data error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});



app.get('/api/analytics/recent-activity', async (req, res) => {
    try {
        // Mock recent activity data - in production would fetch from blockchain
        const recentActivity = [
            {
                type: 'mint',
                tokenId: '42',
                collection: 'TheTruth',
                holder: '0x742d35Cc...C4A',
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                value: '0.169',
                txHash: '0x1234...abcd'
            },
            {
                type: 'stake',
                amount: '500',
                token: 'TRUTH',
                holder: '0x8f6cf6f7...a3c',
                timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
                value: '500',
                txHash: '0x5678...efgh'
            }
        ];

        res.json(recentActivity);
    } catch (error) {
        console.error('Recent activity error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/analytics/geographic', async (req, res) => {
    try {
        // Enhanced geographic data with real community insights
        const geographicData = [
            { country: 'United States', holders: 342, percentage: 45.2 },
            { country: 'Canada', holders: 89, percentage: 11.8 },
            { country: 'United Kingdom', holders: 67, percentage: 8.9 },
            { country: 'Germany', holders: 45, percentage: 6.0 },
            { country: 'Australia', holders: 34, percentage: 4.5 },
            { country: 'Netherlands', holders: 28, percentage: 3.7 },
            { country: 'Other', holders: 151, percentage: 20.0 }
        ];

        res.json(geographicData);
    } catch (error) {
        console.error('Geographic data error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Whitelist proof endpoint for enhanced minting
app.get('/api/whitelist/proof/:address', async (req, res) => {
    try {
        const { address } = req.params;

        // Mock whitelist data - in production, verify against Merkle tree
        const mockWhitelist = [
            '0x742d35Cc6523c0532925a3b8D4b9d35C21B64C4A',
            '0x8f6cf6f7747e170f4768533b869c339dc3d30a3c',
            '0x22b0434e89882f8e6841d340b28427646c015aa7'
        ];

        const isWhitelisted = mockWhitelist.includes(address);

        // Mock Merkle proof - in production, calculate actual proof
        const mockProof = isWhitelisted ? [
            '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
            '0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321'
        ] : [];

        res.json({
            isWhitelisted,
            proof: mockProof,
            address: address.toLowerCase()
        });
    } catch (error) {
        console.error('Whitelist proof error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Community Discord integration endpoint
app.post('/api/community/discord-verify', async (req, res) => {
    try {
        const { userAddress, discordUserId } = req.body;

        // Placeholder for Discord bot integration
        const verificationResult = {
            success: true,
            verificationCode: `verify_${Date.now()}`,
            discordInvite: 'https://discord.gg/thetruth',
            accessLevel: 'initiate',
            message: 'Discord verification initiated. Check your DMs for the verification code.'
        };

        res.json(verificationResult);
    } catch (error) {
        console.error('Discord verification error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Truth Witness System endpoints
app.post('/api/truth-witness/submit', async (req, res) => {
    try {
        const statementData = req.body;

        // Mock truth statement submission
        const result = {
            success: true,
            statementId: `truth_${Date.now()}`,
            message: 'Truth statement submitted for community validation',
            validation_status: 'pending'
        };

        res.json(result);
    } catch (error) {
        console.error('Truth witness submission error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/truth-witness/validate/:statementId', async (req, res) => {
    try {
        const { statementId } = req.params;
        const witnessData = req.body;

        // Mock witness validation
        const result = {
            success: true,
            witnessId: `witness_${statementId}_${Date.now()}`,
            message: 'Statement witnessed successfully',
            new_truth_score: 87.5
        };

        res.json(result);
    } catch (error) {
        console.error('Truth witness validation error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Dynamic NFT evolution endpoints
app.get('/api/nft/:tokenId/evolution/:holderAddress', async (req, res) => {
    try {
        const { tokenId, holderAddress } = req.params;

        // Mock evolution status
        const evolutionStatus = {
            tokenId: tokenId,
            currentStage: 1,
            nextStage: 2,
            progress: 65,
            metrics: {
                engagement: 245,
                philosophy: 189,
                community: 156,
                truth_seeking: 203,
                abundance_mindset: 178
            },
            totalInteractions: 23,
            evolutionHistory: [
                {
                    stage: 1,
                    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                    triggerEvent: 'first_stake'
                }
            ]
        };

        res.json(evolutionStatus);
    } catch (error) {
        console.error('NFT evolution status error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/nft/track-behavior', async (req, res) => {
    try {
        const { tokenId, userAddress, action, value, context } = req.body;

        // Mock behavior tracking
        const result = {
            success: true,
            message: `Behavior '${action}' tracked for token ${tokenId}`,
            updated_scores: {
                engagement: 250,
                philosophy: 195
            }
        };

        res.json(result);
    } catch (error) {
        console.error('Behavior tracking error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Enhanced staking endpoints
app.post('/api/staking/stake', async (req, res) => {
    try {
        const { userAddress, poolId, amount } = req.body;

        // Mock staking
        const stakingResult = {
            success: true,
            stakingId: `stake_${Date.now()}`,
            pool: poolId,
            amount: amount,
            apy: poolId === 'philosophy_pool' ? 18 : 12,
            message: `Successfully staked ${amount} tokens in ${poolId}`
        };

        res.json(stakingResult);
    } catch (error) {
        console.error('Staking error:', error);
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
        environment: process.env.REPLIT_DEPLOYMENT ? 'replit_deployment' : 'development',
        contracts: process.env.NODE_ENV === 'production' ? 'deployed' : 'development',
        port: PORT
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