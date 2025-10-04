
const fs = require('fs');
const path = require('path');

async function verifyDeploymentReadiness() {
  console.log('🔍 Verifying deployment readiness...\n');
  
  const checks = {
    contracts: false,
    metadata: false,
    artifacts: false,
    ipfs: false,
    configuration: false
  };
  
  // Check 1: Contracts compiled
  const artifactsPath = path.join(__dirname, '..', 'artifacts', 'contracts');
  if (fs.existsSync(artifactsPath)) {
    const files = fs.readdirSync(artifactsPath, { recursive: true });
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    checks.contracts = jsonFiles.length >= 3;
    console.log(`✓ Contracts compiled: ${jsonFiles.length} contract artifacts found`);
  } else {
    console.log('✗ Contracts not compiled');
  }
  
  // Check 2: Metadata generated
  const metadataPath = path.join(__dirname, '..', 'metadata');
  if (fs.existsSync(metadataPath)) {
    const files = fs.readdirSync(metadataPath);
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    checks.metadata = jsonFiles.length >= 77;
    console.log(`✓ Metadata generated: ${jsonFiles.length} metadata files found`);
  } else {
    console.log('✗ Metadata not generated');
  }
  
  // Check 3: Artifacts copied
  const artifactsCompiledPath = path.join(__dirname, '..', 'artifacts-compiled');
  if (fs.existsSync(artifactsCompiledPath)) {
    checks.artifacts = true;
    console.log('✓ Artifacts compiled for browser');
  } else {
    console.log('✗ Artifacts not compiled for browser');
  }
  
  // Check 4: IPFS assets verified
  const metadataFile = path.join(metadataPath, '1.json');
  if (fs.existsSync(metadataFile)) {
    const metadata = JSON.parse(fs.readFileSync(metadataFile, 'utf8'));
    checks.ipfs = metadata.image && metadata.image.startsWith('ipfs://');
    console.log(`✓ IPFS assets configured: ${metadata.image}`);
  } else {
    console.log('✗ IPFS assets not configured');
  }
  
  // Check 5: Configuration files
  const configPath = path.join(__dirname, '..', 'hardhat.config.cjs');
  checks.configuration = fs.existsSync(configPath);
  console.log(checks.configuration ? '✓ Configuration files present' : '✗ Configuration files missing');
  
  // Summary
  console.log('\n📊 Deployment Readiness Summary:');
  const readyCount = Object.values(checks).filter(v => v).length;
  const totalChecks = Object.keys(checks).length;
  console.log(`   ${readyCount}/${totalChecks} checks passed`);
  
  if (readyCount === totalChecks) {
    console.log('\n✅ All checks passed! Ready for deployment to Base mainnet.');
    console.log('\n📝 Next steps:');
    console.log('   1. Ensure you have ETH on Base mainnet for gas fees');
    console.log('   2. Set PRIVATE_KEY in .env file');
    console.log('   3. Run: npx hardhat run scripts/deployTheTruth.js --network base');
    console.log('   4. Master copy #77 will auto-mint to 0x67BF9f428d92704C3Db3a08dC05Bc941A8647866');
  } else {
    console.log('\n⚠️  Some checks failed. Review the issues above before deployment.');
  }
  
  return checks;
}

verifyDeploymentReadiness()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  });
