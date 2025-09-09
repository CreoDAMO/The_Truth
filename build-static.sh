#!/bin/bash

echo "🏗️ Building static files for deployment..."

# Create build directory
mkdir -p dist

# Copy web files
cp -r web/* dist/

# Check if pre-compiled artifacts exist
if [ -f "artifacts-compiled/contract-artifacts.js" ]; then
    echo "📦 Using pre-compiled artifacts..."
    cp artifacts-compiled/contract-artifacts.js dist/
else
    echo "🔨 Compiling contracts..."
    npm run compile
    npm run compile-browser
    cp contract-artifacts.js dist/ 2>/dev/null || echo "⚠️ No contract artifacts found"
fi

# Copy metadata if it exists
if [ -d "metadata" ]; then
    cp -r metadata dist/
fi

# Copy documentation
cp README.md dist/ 2>/dev/null || true
cp DEPLOYMENT.md dist/ 2>/dev/null || true

# Update paths for static deployment
echo "📝 Updating paths for static deployment..."

# Add base path for GitHub Pages if needed
if [ ! -z "$GITHUB_REPOSITORY" ]; then
    REPO_NAME=$(echo $GITHUB_REPOSITORY | cut -d'/' -f2)
    echo "🔗 Setting base path for repository: $REPO_NAME"

    # Update asset paths in HTML files
    find dist -name "*.html" -exec sed -i "s|src=\"/|src=\"/$REPO_NAME/|g" {} \;
    find dist -name "*.html" -exec sed -i "s|href=\"/|href=\"/$REPO_NAME/|g" {} \;
fi

echo "✅ Static build complete in ./dist directory"
echo "📁 Files created:"
ls -la dist/