// scripts/checkStatus.js
const hre= require("hardhat"); const fs= require('fs'); const path= require('path');

async function main() { // Get deployment info const deploymentPath = path.join(__dirname, '..', 'deployment.json'); if (!fs.existsSync(deploymentPath)) { throw new Error("deployment.json not found. Run deployTheTruth.js first."); }

const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8')); const contractAddress = deployment.contract;

console.log("===================================="); console.log("    THE TRUTH NFT - STATUS CHECK    "); console.log("====================================\n");

// Get contract instance const TheTruth = await hre.ethers.getContractAt("TheTruth", contractAddress);

// Contract Info console.log("📜 CONTRACT INFORMATION"); console.log("   Address:", contractAddress); console.log("   Name:", await TheTruth.name()); console.log("   Symbol:", await TheTruth.symbol()); console.log("   Network:", hre.network.name);

// Owner Info const owner = await TheTruth.owner(); console.log("\n👤 OWNERSHIP"); console.log("   Owner:", owner); console.log("   Treasury:", await TheTruth.treasury()); console.log("   Is Multisig:", await TheTruth.treasuryIsMultisig());

// Minting Status const mintingEnabled = await TheTruth.mintingEnabled(); const price = await TheTruth.PRICE(); console.log("\n🎯 MINTING STATUS"); console.log("   Status:", mintingEnabled ? "🟢 ENABLED" : "🔴 DISABLED"); console.log("   Price:", hre.ethers.utils.formatEther(price), "ETH (~$777)"); console.log("   Max Supply:", (await TheTruth.MAX_SUPPLY()).toString()); console.log("   Public Supply:", (await TheTruth.PUBLIC_SUPPLY()).toString());

// Supply Info const totalMinted = await TheTruth.totalMinted(); const publicMinted = await TheTruth.publicMinted(); const remaining = await TheTruth.remainingSupply(); console.log("\n📊 SUPPLY METRICS"); console.log("   Total Minted:", totalMinted.toString() + "/77"); console.log("   Public Minted:", publicMinted.toString() + "/76"); console.log("   Remaining:", remaining.toString()); console.log("   Master Copy (#77):", "Minted to owner");

// Progress Bar const progress = Math.floor((publicMinted * 100) / 76); const filled = Math.floor(progress / 5); const empty = 20 - filled; const progressBar = "█".repeat(filled) + "░".repeat(empty); console.log(   Progress: [${progressBar}] ${progress}%);

// Financial Info const balance = await hre.ethers.provider.getBalance(contractAddress); const totalRevenue = publicMinted * price; console.log("\n💰 FINANCIAL STATUS"); console.log("   Contract Balance:", hre.ethers.utils.formatEther(balance), "ETH"); console.log("   Total Revenue:", hre.ethers.utils.formatEther(totalRevenue), "ETH"); console.log("   Royalty Rate:", "10%");

// Provenance const provenance = await TheTruth.provenance(); console.log("\n🔐 PROVENANCE"); if (provenance && provenance !== '') { console.log("   Hash:", provenance.slice(0, 20) + "..." + provenance.slice(-18)); console.log("   Status: ✅ Set and Locked"); } else { console.log("   Status: ⚠️  Not Set"); }

// Recent Activity (if available) try { const filter = TheTruth.filters.TruthMinted(); const events = await TheTruth.queryFilter(filter, -100); // Last 100 blocks if (events.length > 0) { console.log("\n📈 RECENT MINTS (Last 100 blocks)"); const recent = events.slice(-5); // Show last 5 recent.forEach((event) => { console.log(   #${event.args.tokenId}: ${event.args.to.slice(0, 6)}...${event.args.to.slice(-4)}); }); } } catch (e) { // Events might not be available on all networks }

// Links console.log("\n🔗 USEFUL LINKS"); console.log(   Contract: https://basescan.org/address/${contractAddress}); console.log(   Token: https://basescan.org/token/${contractAddress}); if (deployment.verified) { console.log(   Source Code: https://basescan.org/address/${contractAddress}#code); }

console.log("\n===================================="); console.log("   Master of Nothing, Student of All"); console.log("===================================="); }

main() .then(() => process.exit(0)) .catch((error) => { console.error("❌ Error:", error); process.exit(1); });
