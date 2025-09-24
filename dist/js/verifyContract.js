// scripts/verifyContract.js
const hre= require("hardhat"); const fs= require('fs'); const path= require('path');

async function main() { // Get deployment info const deploymentPath = path.join(__dirname, '..', 'deployment.json'); if (!fs.existsSync(deploymentPath)) { throw new Error("deployment.json not found. Run deployTheTruth.js first."); }

const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8')); const contractAddress = deployment.contract; const owner = deployment.owner; const baseURI = deployment.baseURI; const treasury = deployment.treasury;

console.log("🔍 Verifying contract on Etherscan..."); console.log("   Contract:", contractAddress); console.log("   Network:", hre.network.name);

try { await hre.run("verify:verify", { address: contractAddress, constructorArguments: [
        owner,
        baseURI,
        treasury
      ], contract: "contracts/TheTruth.sol:TheTruth" });

} catch (error) { if (error.message.includes("Already Verified")) { console.log("✅ Contract is already verified!"); } else { console.error("❌ Verification failed:", error.message); console.log("\nTry manual verification with:"); console.log(npx hardhat verify --network ${hre.network.name} ${contractAddress} "${owner}" "${baseURI}" "${treasury}"); } } }

main() .then(() => process.exit(0)) .catch((error) => { console.error("❌ Error:", error); process.exit(1); });
