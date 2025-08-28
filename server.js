const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

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

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 The Truth NFT Minting App running on port ${PORT}`);
    console.log(`📱 Access at: http://localhost:${PORT}`);
});