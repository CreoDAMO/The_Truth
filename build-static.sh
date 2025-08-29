
#!/bin/bash

echo "🏗️ Building static files for deployment..."

# Create build directory
mkdir -p dist

# Copy web files
cp -r web/* dist/

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
