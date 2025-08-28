// scripts/setTreasury.js
const hre= require("hardhat"); const fs= require('fs'); const path= require('path');

async function main() { // Get deployment info const deploymentPath = path.join(__dirname, '..', 'deployment.json'); if (!fs.existsSync(deploymentPath)) { throw new Error("deployment.json not found. Run deployTheTruth.js first."); }

const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8')); const contractAddress = deployment.contract;

// Parse command line arguments or use PaymentSplitter from deployment let newTreasury; let isMultisig = false;

if (process.env.TREASURY_ADDRESS) { newTreasury = process.env.TREASURY_ADDRESS; isMultisig = process.env.IS_MULTISIG === 'true'; } else if (deployment.paymentSplitter) { newTreasury = deployment.paymentSplitter.address; isMultisig = false; console.log("📍 Using PaymentSplitter from deployment.json"); } else { console.log("❌ No treasury address provided"); console.log("   Set TREASURY_ADDRESS environment variable or deploy PaymentSplitter first"); return; }

console.log("🔗 Using contract at:", contractAddress); console.log("🏦 New treasury address:", newTreasury); console.log("   Is multisig:", isMultisig);

// Get signer const [signer] = await hre.ethers.getSigners(); console.log("👤 Setting treasury with:", signer.address);

// Get contract instance const TheTruth = await hre.ethers.getContractAt("TheTruth", contractAddress);

// Check current owner const owner = await TheTruth.owner(); if (owner.toLowerCase() !== signer.address.toLowerCase()) { throw new Error(Signer ${signer.address} is not the owner. Owner is ${owner}); }

// Check current treasury const currentTreasury = await TheTruth.treasury(); const currentIsMultisig = await TheTruth.treasuryIsMultisig(); console.log("\n📊 Current treasury:", currentTreasury); console.log("   Is multisig:", currentIsMultisig);

if (currentTreasury.toLowerCase() === newTreasury.toLowerCase()) { console.log("⚠️  Treasury is already set to this address"); return; }

// Set new treasury console.log("\n🔄 Updating treasury..."); const tx = await TheTruth.setTreasury(newTreasury, isMultisig); console.log("📝 Transaction hash:", tx.hash);

// Wait for confirmation console.log("⏳ Waiting for confirmation..."); const receipt = await tx.wait(); console.log("✅ Treasury updated in block:", receipt.blockNumber);

// Verify update const updatedTreasury = await TheTruth.treasury(); const updatedIsMultisig = await TheTruth.treasuryIsMultisig(); console.log("\n📊 New treasury:", updatedTreasury); console.log("   Is multisig:", updatedIsMultisig);

// Update deployment info deployment.treasury = updatedTreasury; deployment.treasuryIsMultisig = updatedIsMultisig; deployment.treasuryUpdateTx = tx.hash; deployment.treasuryUpdateBlock = receipt.blockNumber; fs.writeFileSync(deploymentPath, JSON.stringify(deployment, null, 2)); console.log("\n💾 Updated deployment.json with new treasury info");

console.log("\n✨ Treasury successfully updated!"); console.log("   All future withdrawals will go to:", newTreasury); }

main() .then(() => process.exit(0)) .catch((error) => { console.error("❌ Error:", error); process.exit(1); });
