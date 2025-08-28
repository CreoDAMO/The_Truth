// scripts/deployPaymentSplitter.js
const hre= require("hardhat"); const fs= require('fs'); const path= require('path');

async function main() { console.log("🔀 Deploying PaymentSplitter for The Truth NFT");

// Configure payees and shares const payees = [
    "0x67BF9f428d92704C3Db3a08dC05Bc941A8647866", // Jacque Antoine DeGraff
    "0x0000000000000000000000000000000000000000"  // Replace with partner address
  ];

const shares = [7000, 3000]; // 70% / 30% split

// Validate configuration if (payees[1] === "0x0000000000000000000000000000000000000000") { console.log("⚠️  Warning: Partner address not set!"); console.log("   Update payees[1] with actual partner address"); return; }

if (payees.length !== shares.length) { throw new Error("Payees and shares arrays must have same length"); }

const totalShares = shares.reduce((a, b) => a + b, 0);

console.log("\n📊 Payment Split Configuration:"); for (let i = 0; i < payees.length; i++) { const percentage = (shares[i] / totalShares * 100).toFixed(1); console.log(   ${payees[i]}: ${percentage}% (${shares[i]} shares)); }

// Get deployer const [deployer] = await hre.ethers.getSigners(); console.log("\n👤 Deploying with:", deployer.address);

// Check balance const balance = await deployer.getBalance(); console.log("💰 Deployer balance:", hre.ethers.utils.formatEther(balance), "ETH");

// Deploy PaymentSplitter console.log("\n🚀 Deploying PaymentSplitter..."); const PaymentSplitter = await hre.ethers.getContractFactory("PaymentSplitter"); const splitter = await PaymentSplitter.deploy(payees, shares);

// Wait for deployment await splitter.deployed(); console.log("✅ PaymentSplitter deployed to:", splitter.address);

// Wait for confirmations console.log("⏳ Waiting for block confirmations..."); await splitter.deployTransaction.wait(5);

// Verify deployment console.log("\n📋 Verifying deployment:"); for (let i = 0; i < payees.length; i++) { const payeeShares = await splitter.shares(payees[i]); console.log(   ${payees[i]}: ${payeeShares.toString()} shares); } const totalSharesOnChain = await splitter.totalShares(); console.log("   Total shares:", totalSharesOnChain.toString());

console.log("\n🎯 Next Steps:"); console.log("  1. Call setTreasury() on TheTruth contract with this address:"); console.log("    ", splitter.address); console.log("  2. Set isMultisig to false when calling setTreasury()"); console.log("  3. Withdrawals will automatically split between payees");

// Load existing deployment info if it exists const deploymentPath = path.join(__dirname, '..', 'deployment.json'); let deploymentInfo = {}; if (fs.existsSync(deploymentPath)) { deploymentInfo = JSON.parse(fs.readFileSync(deploymentPath, 'utf8')); }

// Add PaymentSplitter info deploymentInfo.paymentSplitter = { address: splitter.address, payees: payees, shares: shares, deploymentTx: splitter.deployTransaction.hash, deployer: deployer.address, timestamp: new Date().toISOString() };

// Save updated deployment info fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2)); console.log("\n💾 PaymentSplitter info saved to deployment.json");

// Generate script to update treasury console.log("\n📝 To update treasury, run:"); console.log(   npx hardhat run scripts/setTreasury.js --network ${hre.network.name}); }

main() .then(() => process.exit(0)) .catch((error) => { console.error("❌ Error:", error); process.exit(1); });
