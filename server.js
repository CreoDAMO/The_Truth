
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files
app.use(express.static('.'));

// Main route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint to get contract configuration
app.get('/api/config', (req, res) => {
    // This would be populated from environment variables or deployment info
    const config = {
        contractAddress: process.env.CONTRACT_ADDRESS || "0x...",
        network: process.env.NETWORK || "baseSepolia",
        explorer: process.env.EXPLORER || "https://sepolia.basescan.org"
    };
    res.json(config);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 The Truth NFT Minting App running on port ${PORT}`);
    console.log(`📱 Access at: http://localhost:${PORT}`);
});
