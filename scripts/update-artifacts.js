
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔄 Updating pre-compiled artifacts...');

try {
    // Clean and compile
    console.log('📦 Cleaning previous compilation...');
    execSync('npx hardhat clean', { stdio: 'inherit' });
    
    console.log('🔨 Compiling contracts...');
    execSync('npm run compile', { stdio: 'inherit' });
    
    console.log('🌐 Compiling for browser...');
    execSync('npm run compile-browser', { stdio: 'inherit' });
    
    // Copy artifacts
    console.log('📋 Copying artifacts...');
    
    // Ensure artifacts-compiled directory exists
    const artifactsCompiledDir = path.join(__dirname, '..', 'artifacts-compiled');
    if (!fs.existsSync(artifactsCompiledDir)) {
        fs.mkdirSync(artifactsCompiledDir, { recursive: true });
    }
    
    // Copy all artifacts
    execSync('cp -r artifacts/* artifacts-compiled/', { stdio: 'inherit' });
    
    // Copy browser artifacts
    const browserArtifacts = path.join(__dirname, '..', 'contract-artifacts.js');
    if (fs.existsSync(browserArtifacts)) {
        execSync('cp contract-artifacts.js artifacts-compiled/', { stdio: 'inherit' });
    }
    
    console.log('✅ Pre-compiled artifacts updated successfully!');
    console.log('💡 Commit these changes to use them in GitHub Actions');
    
} catch (error) {
    console.error('❌ Failed to update artifacts:', error.message);
    process.exit(1);
}
