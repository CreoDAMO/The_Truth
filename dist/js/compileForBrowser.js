
// scripts/compileForBrowser.js
const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
    console.log("🔨 Compiling contracts for browser deployment...");
    
    // Compile contracts
    await hre.run("compile");
    
    const artifactsPath = path.join(__dirname, '..', 'artifacts', 'contracts');
    const outputPath = path.join(__dirname, '..', 'contract-artifacts.js');
    
    const contracts = ['TheTruth.sol', 'TruthBonusGift.sol'];
    const artifacts = {};
    
    for (const contractFile of contracts) {
        const contractName = contractFile.replace('.sol', '');
        const artifactPath = path.join(artifactsPath, contractFile, `${contractName}.json`);
        
        if (fs.existsSync(artifactPath)) {
            const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
            artifacts[contractName] = {
                abi: artifact.abi,
                bytecode: artifact.bytecode
            };
            console.log(`✅ Processed ${contractName}`);
        } else {
            console.warn(`⚠️ Artifact not found: ${artifactPath}`);
        }
    }
    
    // Generate JavaScript file with artifacts
    const jsContent = `// Auto-generated contract artifacts for browser deployment
// Generated at: ${new Date().toISOString()}

const CONTRACT_ARTIFACTS = ${JSON.stringify(artifacts, null, 2)};

// Export for both browser and module environments
if (typeof window !== 'undefined') {
    window.CONTRACT_ARTIFACTS = CONTRACT_ARTIFACTS;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONTRACT_ARTIFACTS;
}
`;
    
    fs.writeFileSync(outputPath, jsContent);
    console.log(`📄 Contract artifacts saved to: ${outputPath}`);
    
    // Update deploy-with-metamask.js to use compiled artifacts
    console.log("🔄 Updating deployment script with compiled artifacts...");
    updateDeploymentScript(artifacts);
}

function updateDeploymentScript(artifacts) {
    const deployScriptPath = path.join(__dirname, '..', 'deploy-with-metamask.js');
    let content = fs.readFileSync(deployScriptPath, 'utf8');
    
    // Replace the CONTRACT_ARTIFACTS section
    const artifactsString = JSON.stringify(artifacts, null, 4);
    const pattern = /const CONTRACT_ARTIFACTS = \{[\s\S]*?\};/;
    const replacement = `const CONTRACT_ARTIFACTS = ${artifactsString};`;
    
    content = content.replace(pattern, replacement);
    
    fs.writeFileSync(deployScriptPath, content);
    console.log("✅ Deployment script updated with compiled artifacts");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Compilation failed:", error);
        process.exit(1);
    });
