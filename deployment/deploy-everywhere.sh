
#!/bin/bash

echo "🚀 The Truth NFT - Universal Deployment Script"
echo "=============================================="

# Check for deployment target
if [ -z "$1" ]; then
    echo "Usage: ./deploy-everywhere.sh [platform]"
    echo "Platforms: replit, vercel, railway, render, heroku, docker, aws"
    exit 1
fi

PLATFORM=$1

case $PLATFORM in
    "replit")
        echo "📱 Deploying to Replit..."
        npm run compile
        echo "✅ Ready for Replit deployment"
        ;;
        
    "vercel")
        echo "🔺 Deploying to Vercel..."
        npm install -g vercel
        vercel --prod
        ;;
        
    "railway")
        echo "🚂 Deploying to Railway..."
        npm install -g @railway/cli
        railway login
        railway deploy
        ;;
        
    "render")
        echo "🎨 Deploying to Render..."
        echo "Push to GitHub and connect to Render dashboard"
        git add .
        git commit -m "Deploy to Render"
        git push
        ;;
        
    "heroku")
        echo "🚀 Deploying to Heroku..."
        npm install -g heroku
        heroku login
        heroku create the-truth-nft-$(date +%s)
        git push heroku main
        ;;
        
    "docker")
        echo "🐳 Building Docker image..."
        docker build -t the-truth-nft .
        docker-compose up -d
        ;;
        
    "aws")
        echo "☁️ Deploying to AWS..."
        npm install -g aws-cdk
        echo "Configure AWS CDK and deploy"
        ;;
        
    *)
        echo "❌ Unknown platform: $PLATFORM"
        exit 1
        ;;
esac

echo "✅ Deployment configuration complete for $PLATFORM"
