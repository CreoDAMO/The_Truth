#!/bin/bash

echo "🚀 Building static site for GitHub Pages..."

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

# Copy JavaScript files
mkdir -p dist/js
cp web/*.js dist/js/ 2>/dev/null || echo "No JS files to copy from web/"

# Copy integration files
cp integrations/*.js dist/js/ 2>/dev/null || echo "No integration files to copy"

# Copy script files  
cp scripts/*.js dist/js/ 2>/dev/null || echo "No script files to copy"

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