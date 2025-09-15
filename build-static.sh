#!/bin/bash

echo "🏗️ Building static site for GitHub Pages..."

# Create dist directory
mkdir -p dist

# Copy main files
echo "📁 Copying main files..."
cp -r web/* dist/

# Copy the entire LAW directory
echo "⚖️ Copying LAW directory..."
cp -r LAW/ dist/

# Copy root files that should be accessible
echo "📄 Copying root HTML files..."
for file in *.html; do
    if [ -f "$file" ]; then
        cp "$file" dist/
    fi
done

# Copy important markdown files
echo "📚 Copying documentation files..."
if [ -f "README.md" ]; then
    cp README.md dist/
fi
if [ -f "BLACKPAPER.md" ]; then
    cp BLACKPAPER.md dist/
fi

# Copy contract artifacts if they exist
if [ -f "contract-artifacts.js" ]; then
    echo "📋 Copying contract artifacts..."
    cp contract-artifacts.js dist/
fi

# Copy package.json for deployment info
cp package.json dist/

echo "✅ Static build complete! Files are in ./dist"
echo "🔗 Ready for GitHub Pages deployment"
echo "📋 Included: web files, LAW directory, HTML files, and documentation"