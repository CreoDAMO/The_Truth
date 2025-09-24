// scripts/deployTheTruth.js
const hre= require("hardhat");

async function main() { // Get deployer account const [deployer] = await hre.ethers.getSigners(); console.log("Deploying with account:", deployer.address);

// Check balance const balance = await deployer.getBalance(); console.log("Account balance:", hre.ethers.utils.formatEther(balance), "ETH");

// Contract parameters const initialOwner = "0x67BF9f428d92704C3Db3a08dC05Bc941A8647866"; // Jacque's address const baseURI = "ipfs://YOUR_METADATA_ROOT_CID/"; // Replace with actual CID after uploading metadata const treasury = initialOwner; // Can be changed to multisig later

console.log("\n📝 Deployment Parameters:"); console.log("  Owner:", initialOwner); console.log("  BaseURI:", baseURI); console.log("  Treasury:", treasury);

// Deploy contract console.log("\n🚀 Deploying TheTruth contract..."); const TheTruth = await hre.ethers.getContractFactory("TheTruth"); const contract = await TheTruth.deploy( initialOwner, baseURI, treasury );

// Wait for deployment await contract.deployed(); console.log("✅ TheTruth deployed to:", contract.address);

// Wait for block confirmations console.log("\n⏳ Waiting for block confirmations..."); await contract.deployTransaction.wait(5);

// Verify deployment console.log("\n📋 Verifying deployment state:"); console.log("  Name:", await contract.name()); console.log("  Symbol:", await contract.symbol()); console.log("  Owner:", await contract.owner()); console.log("  Treasury:", await contract.treasury()); console.log("  Total Supply:", (await contract.totalSupply()).toString()); console.log("  Master Copy Owner:", await contract.ownerOf(77)); console.log("  Minting Enabled:", await contract.mintingEnabled()); console.log("  Price:", hre.ethers.utils.formatEther(await contract.PRICE()), "ETH");

console.log("\n📄 Deployment Summary:"); console.log("  Contract Address:", contract.address); console.log("  Transaction Hash:", contract.deployTransaction.hash); console.log("  Block Number:", contract.deployTransaction.blockNumber); console.log("  Gas Used:", contract.deployTransaction.gasLimit.toString());

console.log("\n🎯 Next Steps:"); console.log("  1. Verify contract on Etherscan"); console.log("  2. Set provenance hash"); console.log("  3. Test mint from different wallet"); console.log("  4. Enable public minting with toggleMinting()");

// Save deployment info const deploymentInfo = { network: hre.network.name, contract: contract.address, owner: initialOwner, treasury: treasury, baseURI: baseURI, deploymentTx: contract.deployTransaction.hash, deployer: deployer.address, timestamp: new Date().toISOString() };

const fs = require('fs'); const path = require('path'); const deploymentPath = path.join(__dirname, '..', 'deployment.json'); fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2)); console.log("\n💾 Deployment info saved to deployment.json"); }

main() .then(() => process.exit(0)) .catch((error) => { console.error("❌ Deployment failed:", error); process.exit(1); });
