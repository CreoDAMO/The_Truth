#!/bin/bash

echo "🏗️ Building static files for deployment..."

# Create build directory
mkdir -p dist

# Copy web files (excluding server.js to avoid conflicts)
cp web/*.html dist/
cp web/*.js dist/ 2>/dev/null || echo "No JS files to copy"
cp web/*.css dist/ 2>/dev/null || echo "No CSS files to copy"

# Copy contract artifacts if they exist
if [ -f "contract-artifacts.js" ]; then
    cp contract-artifacts.js dist/
    echo "✅ Contract artifacts copied"
else
    echo "⚠️ No contract artifacts found - run npm run compile-browser first"
fi

# Copy metadata
cp -r metadata dist/

# Copy documentation
cp README.md dist/
cp DEPLOYMENT.md dist/

echo "✅ Static build complete in ./dist"
echo "📂 Ready for GitHub Pages deployment"
#!/bin/bash

echo "🔨 Building static site for GitHub Pages..."

# Create dist directory
mkdir -p dist

# Copy web files
cp -r web/* dist/

# Check if pre-compiled artifacts exist
if [ -f "artifacts-compiled/contract-artifacts.js" ]; then
    echo "📦 Using pre-compiled artifacts..."
    mkdir -p artifacts
    cp -r artifacts-compiled/* artifacts/ 2>/dev/null || true
    cp artifacts-compiled/contract-artifacts.js . 2>/dev/null || true
else
    echo "🔨 Compiling contracts..."
    npm run compile
    npm run compile-browser
fi

# Copy metadata if it exists
if [ -d "metadata" ]; then
    cp -r metadata dist/
fi

# Update paths for static deployment
echo "📝 Updating paths for static deployment..."

# Replace server-side routing with client-side routing
sed -i 's|node web/server.js|Static site - no server needed|g' dist/index.html 2>/dev/null || true

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