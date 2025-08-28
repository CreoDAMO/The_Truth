// scripts/toggleMinting.js
const hre= require("hardhat"); const fs= require('fs'); const path= require('path');

async function main() { // Get deployment info const deploymentPath = path.join(__dirname, '..', 'deployment.json'); if (!fs.existsSync(deploymentPath)) { throw new Error("deployment.json not found. Run deployTheTruth.js first."); }

const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8')); const contractAddress = deployment.contract;

console.log("🔗 Using contract at:", contractAddress);

// Get signer const [signer] = await hre.ethers.getSigners(); console.log("👤 Toggling minting with:", signer.address);

// Get contract instance const TheTruth = await hre.ethers.getContractAt("TheTruth", contractAddress);

// Check current owner const owner = await TheTruth.owner(); if (owner.toLowerCase() !== signer.address.toLowerCase()) { throw new Error(Signer ${signer.address} is not the owner. Owner is ${owner}); }

// Check current minting status const currentStatus = await TheTruth.mintingEnabled(); console.log("📊 Current minting status:", currentStatus ? "ENABLED" : "DISABLED");

// Toggle minting console.log("\n🔄 Toggling minting status..."); const tx = await TheTruth.toggleMinting(); console.log("📝 Transaction hash:", tx.hash);

// Wait for confirmation console.log("⏳ Waiting for confirmation..."); const receipt = await tx.wait(); console.log("✅ Toggled in block:", receipt.blockNumber);

// Verify new status const newStatus = await TheTruth.mintingEnabled(); console.log("📊 New minting status:", newStatus ? "ENABLED" : "DISABLED");

if (newStatus) { console.log("\n🎉 Minting is now LIVE!"); console.log("   Price: 0.1695 ETH (~$777)"); console.log("   Supply: 76 editions available"); console.log("   Limit: 1 per wallet"); } else { console.log("\n⏸️  Minting is now PAUSED"); }

// Get current supply info const totalMinted = await TheTruth.totalMinted(); const publicMinted = await TheTruth.publicMinted(); const remaining = await TheTruth.remainingSupply();

console.log("\n📈 Supply Status:"); console.log("   Total Minted:", totalMinted.toString()); console.log("   Public Minted:", publicMinted.toString()); console.log("   Remaining:", remaining.toString());

// Update deployment info deployment.mintingEnabled = newStatus; deployment.lastToggleBlock = receipt.blockNumber; deployment.lastToggleTx = tx.hash; fs.writeFileSync(deploymentPath, JSON.stringify(deployment, null, 2)); console.log("\n💾 Updated deployment.json with minting status"); }

main() .then(() => process.exit(0)) .catch((error) => { console.error("❌ Error:", error); process.exit(1); });
