#!/bin/bash

echo "🚀 Building static site for GitHub Pages..."

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
cp web/*.js dist/js/

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