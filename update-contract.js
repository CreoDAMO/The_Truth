
const fs = require('fs');
const path = require('path');

// This script updates the contract address in the frontend after deployment
function updateContractAddress(contractAddress, network = 'baseSepolia') {
    const appJsPath = path.join(__dirname, 'app.js');
    let content = fs.readFileSync(appJsPath, 'utf8');
    
    // Replace the placeholder contract address
    content = content.replace(
        'address: "0x...", // Will be filled when deployed',
        `address: "${contractAddress}", // Deployed contract`
    );
    
    fs.writeFileSync(appJsPath, content);
    
    console.log(`✅ Updated contract address to: ${contractAddress}`);
    console.log(`🌐 Network: ${network}`);
}

// Usage: node update-contract.js <CONTRACT_ADDRESS> [NETWORK]
if (require.main === module) {
    const contractAddress = process.argv[2];
    const network = process.argv[3] || 'baseSepolia';
    
    if (!contractAddress) {
        console.error('Usage: node update-contract.js <CONTRACT_ADDRESS> [NETWORK]');
        process.exit(1);
    }
    
    updateContractAddress(contractAddress, network);
}

module.exports = { updateContractAddress };
