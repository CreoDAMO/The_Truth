#!/bin/bash

echo "🔨 Building static distribution for GitHub Pages..."

# Run vite build
echo "📦 Running vite build..."
npx vite build

# Install missing dependencies if needed
if [ ! -d "node_modules/@openzeppelin" ]; then
    echo "📦 Installing missing OpenZeppelin dependencies..."
    npm install @openzeppelin/contracts@4.9.0 || echo "Warning: Could not install OpenZeppelin"
fi

# Create dist directory
mkdir -p dist

# Copy main files
cp web/index.html dist/
cp web/manifest.json dist/
cp web/sw.js dist/

# Copy all dashboard HTML files (even though we're using SPA)
cp web/*.html dist/ 2>/dev/null || true

# Copy JavaScript files with better error handling
mkdir -p dist/js

# Copy all JS files from web directory
if ls web/*.js 1> /dev/null 2>&1; then
    cp web/*.js dist/js/
    echo "📄 Copied web/*.js files"
else
    echo "⚠️ No JS files found in web/"
fi

# Copy integration files
if ls integrations/*.js 1> /dev/null 2>&1; then
    cp integrations/*.js dist/js/
    echo "📄 Copied integration files"
else
    echo "⚠️ No integration files found"
fi

# Copy script files  
if ls scripts/*.js 1> /dev/null 2>&1; then
    cp scripts/*.js dist/js/
    echo "📄 Copied script files"
else
    echo "⚠️ No script files found"
fi

# Copy CSS files if they exist
mkdir -p dist/css
cp web/*.css dist/css/ 2>/dev/null || true

# Copy LAW directory
cp -r LAW dist/

# Copy metadata
cp -r metadata dist/

# Copy docs
cp -r docs dist/

# Copy any assets
if [ -d "web/assets" ]; then
    cp -r web/assets dist/
fi

# Create .nojekyll to prevent GitHub Pages from ignoring files starting with _
touch dist/.nojekyll

# Copy 404.html for SPA fallback
cp 404.html dist/ 2>/dev/null || echo '<script>window.location.href="/"</script>' > dist/404.html

echo "✅ Static build complete! Files ready in ./dist"