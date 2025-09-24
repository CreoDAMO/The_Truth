// scripts/setProvenance.js
const hre= require("hardhat"); const crypto= require('crypto'); const fs= require('fs'); const path= require('path');

async function calculateProvenance() { console.log("📊 Calculating provenance hash...");

// Read all metadata files in order const metadataDir = path.join(__dirname, '..', 'metadata'); let concatenated = '';

for (let i = 1; i <= 77; i++) { const filePath = path.join(metadataDir, ${i}.json); const content = fs.readFileSync(filePath, 'utf8'); concatenated += content; console.log(  Read metadata/${i}.json); }

// Calculate SHA256 hash const hash = crypto.createHash('sha256'); hash.update(concatenated); const provenanceHash = '0x' + hash.digest('hex');

console.log("✅ Provenance hash calculated:", provenanceHash); return provenanceHash; }

async function main() { // Get deployment info const deploymentPath = path.join(__dirname, '..', 'deployment.json'); if (!fs.existsSync(deploymentPath)) { throw new Error("deployment.json not found. Run deployTheTruth.js first."); }

const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8')); const contractAddress = deployment.contract;

console.log("🔗 Using contract at:", contractAddress);

// Get signer const [signer] = await hre.ethers.getSigners(); console.log("👤 Setting provenance with:", signer.address);

// Get contract instance const TheTruth = await hre.ethers.getContractAt("TheTruth", contractAddress);

// Check if provenance is already set const currentProvenance = await TheTruth.provenance(); if (currentProvenance && currentProvenance !== '') { console.log("⚠️  Provenance already set:", currentProvenance); console.log("   Provenance can only be set once!"); return; }

// Calculate provenance hash const provenanceHash = await calculateProvenance();

// Set provenance console.log("\n🔏 Setting provenance on-chain..."); const tx = await TheTruth.setProvenance(provenanceHash); console.log("📝 Transaction hash:", tx.hash);

// Wait for confirmation console.log("⏳ Waiting for confirmation..."); const receipt = await tx.wait(); console.log("✅ Provenance set in block:", receipt.blockNumber);

// Verify it was set const newProvenance = await TheTruth.provenance(); console.log("🔐 Verified provenance:", newProvenance);

// Update deployment info deployment.provenance = provenanceHash; deployment.provenanceBlock = receipt.blockNumber; deployment.provenanceTx = tx.hash; fs.writeFileSync(deploymentPath, JSON.stringify(deployment, null, 2)); console.log("💾 Updated deployment.json with provenance info");

console.log("\n✨ Provenance permanently locked on-chain!"); console.log("   This creates an immutable record of The Truth"); }

main() .then(() => process.exit(0)) .catch((error) => { console.error("❌ Error:", error); process.exit(1); });
