
// scripts/deployWithMetaMaskHardhat.js
// Bridge script to use MetaMask deployment within hardhat environment

const hre = require("hardhat");

async function main() {
    console.log("🌐 This script guides you through MetaMask deployment");
    console.log("👆 Please use the web interface for actual MetaMask deployment");
    console.log("");
    
    console.log("📋 Steps to deploy with MetaMask:");
    console.log("1. Run: npm run compile-browser");
    console.log("2. Start server: npm start");
    console.log("3. Navigate to: http://localhost:5000/deploy.html");
    console.log("4. Connect your MetaMask wallet");
    console.log("5. Configure deployment parameters");
    console.log("6. Click 'Deploy Contract'");
    console.log("");
    
    console.log("🔗 Alternative - Use the minting app:");
    console.log("1. Start the server: npm start");
    console.log("2. Navigate to deployment section");
    console.log("3. Follow the deployment wizard");
    console.log("");
    
    // Show current network configuration
    const networkName = hre.network.name;
    console.log(`📡 Current Hardhat network: ${networkName}`);
    
    if (networkName === 'hardhat') {
        console.log("⚠️  You're on the local hardhat network");
        console.log("   For MetaMask deployment, use Base Sepolia or Base mainnet");
    }
    
    console.log("");
    console.log("💡 Note: MetaMask deployment bypasses private keys");
    console.log("   and uses your wallet's built-in signing capabilities");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error:", error);
        process.exit(1);
    });
