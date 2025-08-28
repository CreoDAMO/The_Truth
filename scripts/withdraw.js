// scripts/withdraw.js
const hre= require("hardhat"); const fs= require('fs'); const path= require('path');

async function main() { // Get deployment info const deploymentPath = path.join(__dirname, '..', 'deployment.json'); if (!fs.existsSync(deploymentPath)) { throw new Error("deployment.json not found. Run deployTheTruth.js first."); }

const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8')); const contractAddress = deployment.contract;

console.log("🔗 Using contract at:", contractAddress);

// Get signer const [signer] = await hre.ethers.getSigners(); console.log("👤 Withdrawing with:", signer.address);

// Get contract instance const TheTruth = await hre.ethers.getContractAt("TheTruth", contractAddress);

// Check current owner const owner = await TheTruth.owner(); if (owner.toLowerCase() !== signer.address.toLowerCase()) { throw new Error(Signer ${signer.address} is not the owner. Owner is ${owner}); }

// Check contract balance const balance = await hre.ethers.provider.getBalance(contractAddress); const balanceETH = hre.ethers.utils.formatEther(balance);

if (balance.eq(0)) { console.log("💰 Contract balance: 0 ETH"); console.log("   Nothing to withdraw"); return; }

console.log("💰 Contract balance:", balanceETH, "ETH");

// Get treasury address const treasury = await TheTruth.treasury(); const isMultisig = await TheTruth.treasuryIsMultisig(); console.log("📍 Treasury address:", treasury); console.log("   Is multisig:", isMultisig);

// Confirm withdrawal console.log("\n⚠️  About to withdraw", balanceETH, "ETH to", treasury); console.log("   Press Ctrl+C to cancel, or wait 5 seconds to continue..."); await new Promise(resolve => setTimeout(resolve, 5000));

// Execute withdrawal console.log("\n💸 Executing withdrawal..."); const tx = await TheTruth.withdraw(); console.log("📝 Transaction hash:", tx.hash);

// Wait for confirmation console.log("⏳ Waiting for confirmation..."); const receipt = await tx.wait(); console.log("✅ Withdrawn in block:", receipt.blockNumber);

// Verify new balance const newBalance = await hre.ethers.provider.getBalance(contractAddress); const newBalanceETH = hre.ethers.utils.formatEther(newBalance); console.log("💰 New contract balance:", newBalanceETH, "ETH");

// Check treasury balance const treasuryBalance = await hre.ethers.provider.getBalance(treasury); const treasuryBalanceETH = hre.ethers.utils.formatEther(treasuryBalance); console.log("🏦 Treasury balance:", treasuryBalanceETH, "ETH");

console.log("\n✨ Withdrawal complete!"); console.log("   Amount:", balanceETH, "ETH"); console.log("   To:", treasury); }

main() .then(() => process.exit(0)) .catch((error) => { console.error("❌ Error:", error); process.exit(1); });
