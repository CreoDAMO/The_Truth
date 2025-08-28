const express = require('express');
const path = require('path');
const { getDeploymentConfig } = require('./deploy-universal');
const TaxIntegration = require('./tax-integration');
const app = express();

// Initialize tax integration
const taxSystem = new TaxIntegration();

// Universal deployment configuration
const deployConfig = getDeploymentConfig();
const PORT = deployConfig.port;
const HOST = deployConfig.host;

// Serve static files
app.use(express.static(__dirname));

// Main route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Shop route
app.get('/shop', (req, res) => {
    res.sendFile(path.join(__dirname, 'shop.html'));
});

// API route to get contract info
app.get('/api/contract-info', (req, res) => {
    const fs = require('fs');
    const path = require('path');

    try {
        // Try to read deployment info
        const deploymentPath = path.join(__dirname, 'deployment.json');
        if (fs.existsSync(deploymentPath)) {
            const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
            res.json(deployment);
        } else {
            res.json({ contract: null, message: "No deployment found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to read deployment info" });
    }
});

// API route to save deployment info
app.post('/api/save-deployment', express.json(), (req, res) => {
    const fs = require('fs');
    const path = require('path');

    try {
        const deploymentPath = path.join(__dirname, 'deployment.json');
        fs.writeFileSync(deploymentPath, JSON.stringify(req.body, null, 2));
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Failed to save deployment info" });
    }
});

// Tax calculation for NFT purchases
app.post('/api/calculate-nft-tax', express.json(), async (req, res) => {
    try {
        const { amount, customerAddress } = req.body;
        const taxResult = await taxSystem.calculateNFTTax(amount, customerAddress);
        res.json(taxResult);
    } catch (error) {
        res.status(500).json({ error: "Tax calculation failed", message: error.message });
    }
});

// Tax calculation for shop purchases
app.post('/api/calculate-shop-tax', express.json(), async (req, res) => {
    try {
        const { items, customerInfo } = req.body;
        const taxResult = await taxSystem.calculateShopTax(items, customerInfo);
        res.json(taxResult);
    } catch (error) {
        res.status(500).json({ error: "Tax calculation failed", message: error.message });
    }
});

// Create tax transaction
app.post('/api/create-tax-transaction', express.json(), async (req, res) => {
    try {
        const { calculationId, transactionId, saleType } = req.body;
        const result = await taxSystem.createTaxTransaction(calculationId, transactionId, saleType);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: "Tax transaction creation failed", message: error.message });
    }
});

// Tax report endpoint (admin only)
app.get('/api/tax-report', async (req, res) => {
    try {
        const { startDate, endDate, adminKey } = req.query;
        
        // Simple admin authentication - replace with proper auth
        if (adminKey !== process.env.ADMIN_KEY) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const report = await taxSystem.generateTaxReport(startDate, endDate);
        res.json(report);
    } catch (error) {
        res.status(500).json({ error: "Tax report generation failed", message: error.message });
    }
});

// Stripe tax webhook
app.post('/api/stripe-tax-webhook', express.raw({type: 'application/json'}), async (req, res) => {
    try {
        const sig = req.headers['stripe-signature'];
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        
        let event;
        try {
            event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_TAX_WEBHOOK_SECRET);
        } catch (err) {
            console.error('Webhook signature verification failed:', err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        await taxSystem.handleTaxWebhook(event);
        res.json({received: true});
    } catch (error) {
        console.error('Tax webhook error:', error);
        res.status(500).json({ error: "Webhook processing failed" });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, HOST, () => {
    console.log(`🚀 The Truth NFT Minting App running on ${deployConfig.environment}`);
    console.log(`📱 Port: ${PORT} | Host: ${HOST}`);
    console.log(`🌐 Base URL: ${deployConfig.baseUrl}`);
    console.log(`🔧 Environment: ${deployConfig.isProduction ? 'Production' : 'Development'}`);
});