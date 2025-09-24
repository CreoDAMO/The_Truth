
// scripts/update-contract-addresses.js
const fs = require('fs');
const path = require('path');

// Update these with your actual deployed contract addresses
const DEPLOYED_CONTRACTS = {
    TheTruth: '0x...', // Replace with actual address after deployment
    TruthBonusGift: '0x...', // Replace with actual address after deployment  
    TruthPartThree: '0x...', // Replace with actual address after deployment
    PaymentSplitter: '0x...', // Replace with actual address after deployment
    TruthToken: '0x8f6cf6f7747e170f4768533b869c339dc3d30a3c', // Already deployed
    CreatorToken: '0x22b0434e89882f8e6841d340b28427646c015aa7' // Already deployed
};

function updateContractConfig() {
    const configPath = path.join(__dirname, '..', 'web', 'contract-config.js');
    let configContent = fs.readFileSync(configPath, 'utf8');

    // Update each contract address
    for (const [contractName, address] of Object.entries(DEPLOYED_CONTRACTS)) {
        const regex = new RegExp(`${contractName}: '[^']*'`, 'g');
        configContent = configContent.replace(regex, `${contractName}: '${address}'`);
    }

    fs.writeFileSync(configPath, configContent);
    console.log('✅ Updated contract addresses in web/contract-config.js');
}

function updateDeploymentScript() {
    const deployPath = path.join(__dirname, 'deployTheTruth.js');
    let deployContent = fs.readFileSync(deployPath, 'utf8');

    // Update the baseURI with metadata root CID when available
    if (DEPLOYED_CONTRACTS.metadata_root) {
        deployContent = deployContent.replace(
            'const baseURI = "ipfs://YOUR_METADATA_ROOT_CID/";',
            `const baseURI = "${DEPLOYED_CONTRACTS.metadata_root}";`
        );
    }

    fs.writeFileSync(deployPath, deployContent);
    console.log('✅ Updated deployment script baseURI');
}

// Usage instructions
console.log(`
🔧 Contract Address Update Tool

1. Deploy your contracts using: npm run deploy:truth
2. Update the DEPLOYED_CONTRACTS object in this file with actual addresses
3. Run this script again: node scripts/update-contract-addresses.js

Current addresses:
${Object.entries(DEPLOYED_CONTRACTS)
    .map(([name, addr]) => `  ${name}: ${addr}`)
    .join('\n')}
`);

if (process.argv.includes('--update')) {
    updateContractConfig();
    updateDeploymentScript();
}

module.exports = { DEPLOYED_CONTRACTS, updateContractConfig };
