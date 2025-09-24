
#!/bin/bash

echo "🔨 Preparing contracts and artifacts for deployment..."

# Clean previous compilation
echo "📦 Cleaning previous compilation..."
npx hardhat clean

# Install dependencies
echo "📥 Installing dependencies..."
npm install
npm run install-deps

# Compile contracts
echo "🔨 Compiling contracts..."
npm run compile

# Generate browser artifacts
echo "🌐 Generating browser artifacts..."
npm run compile-browser

# Update artifacts
echo "📋 Updating pre-compiled artifacts..."
npm run update-artifacts

# Generate metadata
echo "📝 Generating metadata..."
npm run generate-metadata

# Build static distribution
echo "🏗️ Building static distribution..."
chmod +x build-static.sh
./build-static.sh

echo "✅ All artifacts prepared! Ready to push to GitHub."
echo "💡 You can now manually commit and push the updated artifacts."
echo "📁 Modified directories:"
echo "   - artifacts-compiled/"
echo "   - dist/"
echo "   - metadata/"
