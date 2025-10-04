# The Truth NFT Ecosystem

## Overview

The Truth NFT is a comprehensive Web3 creator economy built on the Base blockchain that demonstrates the philosophical gap between truth and institutional translation through blockchain technology. The ecosystem includes multiple NFT collections (The Truth Original, Bonus Gift, Part Three), utility tokens (TRUTH and Creator Coin), and a complete Web3 infrastructure with both traditional e-commerce and blockchain-native functionality. The platform serves as both a philosophical experiment and a practical demonstration of decentralized creator economics, featuring real-time analytics, community governance, and multi-channel payment processing.

## Recent Changes

**October 4, 2025 - Replit Environment Setup Complete**
- ✅ **Fresh GitHub import configured** - Successfully imported and set up from GitHub repository
- ✅ **Dependencies installed** - Fixed Hardhat version conflicts and installed all npm packages
- ✅ **React-Vite build system operational** - Clean HTML template created and build process working
- ✅ **Ethers.js v6 migration** - Updated from v5 to v6 API (BrowserProvider, formatEther)
- ✅ **Express.js server configured** - Properly serving React app on port 5000 with 0.0.0.0 binding
- ✅ **Workflow configured** - "Dev Server" running npm dev command on port 5000
- ✅ **Deployment configured** - Autoscale deployment with Vite build and Express server
- ✅ **Vite configuration optimized** - Added strictPort:false and HMR clientPort for Replit proxy
- ✅ **All dashboard pages working** - Home, Analytics & AI, Governance, Community, Liquidity, Payments, Shop, Social, Legal, Deploy
- ✅ **Wallet integration ready** - MetaMask connection with Base network token support
- ✅ **No console errors** - Clean browser console with successful app initialization

**Why React-Vite?**
After a week of troubleshooting rendering issues with the original hybrid approach, the React-Vite migration was the definitive solution. Benefits include:
- Instant hot module replacement (HMR) during development
- Component-based architecture for better maintainability
- Unified state management eliminating refresh requirements
- Modern build tooling with Vite for optimal performance
- Better debugging and development experience

## User Preferences

Preferred communication style: Simple, everyday language.

## Deploying on Replit

### Quick Start (Recommended Method)

1. **Import from GitHub**:
   ```
   1. Visit https://replit.com/new
   2. Click "Import from GitHub"  
   3. Paste: https://github.com/CreoDAMO/The_Truth
   4. Click "Import from GitHub"
   ```

2. **Automatic Setup**:
   - Replit auto-detects this as a Node.js project
   - Dependencies install automatically via npm
   - Vite and React configuration is detected
   - Port 5000 is configured for web access

3. **Run Development Server**:
   - Click the "Run" button (or use the "Dev Server" workflow)
   - Server starts on `http://0.0.0.0:5000`
   - Webview opens automatically showing the app
   - Hot module replacement (HMR) enables instant updates

4. **Deploy to Production**:
   ```
   1. Click "Deploy" in top-right corner
   2. Select deployment tier (Shared/Dedicated)
   3. Configure:
      - Build command: npm run build
      - Run command: npm run dev
   4. Click "Deploy your project"
   5. Live at: https://your-repl.replit.app
   ```

### Environment Configuration

The app works out-of-the-box, but you can customize via Replit Secrets:

1. Open "Tools" → "Secrets"
2. Add these optional secrets:
   ```
   VITE_INFURA_ID=your_infura_project_id
   VITE_BASE_RPC_URL=https://mainnet.base.org
   ```

### Workflows Available

- **Dev Server** (Run button): Starts development server with HMR
- **Truth NFT Server**: Legacy workflow (use Dev Server instead)
- **Prepare Contracts**: Compiles contracts and updates artifacts
- **Build Static Distribution**: Creates production build in /dist

### Port Configuration

- **Development**: Port 5000 (bound to 0.0.0.0)
- **Production**: Auto-scaled by Replit (ports 80/443)
- **Webview**: Automatically proxies to port 5000

### File Structure for Replit

```
/web/src/          # React components and pages
/web/server.js     # Express.js backend (serves API routes)
/contracts/        # Solidity smart contracts
/metadata/         # NFT metadata JSON files
vite.config.js     # Vite configuration
.replit            # Replit configuration (workflow settings)
```

### Troubleshooting

**Issue**: App not loading in webview
- **Solution**: Check port 5000 is open, restart the Repl

**Issue**: Dependencies not installing
- **Solution**: Run `npm install` manually in Shell

**Issue**: Hot reload not working
- **Solution**: Ensure Vite dev server is running (npm run dev)

**Issue**: Contract ABIs missing
- **Solution**: Run "Prepare Contracts" workflow

### Deploying Outside Replit

If you need to deploy elsewhere:

```bash
# Clone locally
git clone https://github.com/CreoDAMO/The_Truth.git
cd the-truth-nft

# Install and run
npm install
npm run dev

# Build for production
npm run build

# Deploy to other platforms
npm run deploy:vercel   # Vercel
npm run deploy:render   # Render
npm run deploy:railway  # Railway
```

The React-Vite architecture makes the app portable across any Node.js hosting platform.

## System Architecture

### Frontend Architecture
- **Multi-Channel Interface**: Hybrid Web2/Web3 approach with traditional e-commerce checkout alongside MetaMask wallet integration
- **Static Site Generation**: Express.js server with static file serving for deployment flexibility across platforms (Vercel, Railway, Render, Replit)
- **Real-Time Analytics Dashboard**: JavaScript-based analytics engine tracking on-chain metrics, minting velocity, geographic distribution, and community engagement
- **Mobile App Support**: React Native implementation with WalletConnect integration for cross-platform access

### Backend Architecture
- **Smart Contract System**: Multiple ERC-721 contracts (TheTruth.sol, TruthBonusGift.sol) with ERC-2981 royalty support deployed on Base network
- **Token Economy**: ERC-20 tokens for platform utility (TRUTH - 10M supply) and community membership (Creator Coin - 1B supply)
- **Payment Infrastructure**: Dual payment system supporting both cryptocurrency (direct minting) and traditional payments (Stripe integration with automatic crypto conversion)
- **Governance Layer**: Token-weighted voting system with proposal management and community-driven decision making

### Data Storage Solutions
- **IPFS Integration**: All NFT metadata, assets, and provenance data permanently stored on IPFS via Pinata pinning service
- **On-Chain Provenance**: SHA256 hashes of metadata stored immutably on blockchain for authenticity verification
- **Local State Management**: Browser-based wallet connection state and transaction history caching
- **Analytics Storage**: Real-time metrics stored locally with periodic blockchain synchronization

### Authentication and Authorization
- **Wallet-Based Authentication**: MetaMask SDK integration for seamless wallet connection across desktop and mobile
- **Multi-Signature Treasury**: Gnosis Safe multisig implementation with 3-of-5 signature requirement for treasury operations
- **Role-Based Access**: Token-gated features with different access levels based on NFT holdings and token balances
- **Admin Key Management**: Corporate governance model with documented agency relationships and resolution-based authority

### Legal and Compliance Framework
- **Doctrinal Foundation**: Built on Black's Law Dictionary principles, mapping NFTs as "choses in action" and implementing trust structures for provenance
- **Tax Integration**: Automated sales tax calculation and collection via Stripe, with Florida tax compliance (ID: 23-8019835728-2)
- **KYC/AML Integration**: Sanctions screening and geographic compliance with real-time dashboard reporting
- **Treasury Resolution System**: Corporate governance with board resolutions and fiduciary duty documentation

## External Dependencies

### Blockchain Infrastructure
- **Base Network**: Primary deployment on Coinbase's Base L2 for low-cost transactions and institutional backing
- **Base Sepolia**: Testing environment for contract deployment and validation
- **Ethereum Libraries**: Ethers.js v5.8.0 for blockchain interactions and contract deployment
- **Hardhat Framework**: Development and deployment toolchain with custom deployment scripts

### Web3 Services
- **MetaMask SDK**: Wallet connection and transaction signing across platforms
- **IPFS/Pinata**: Distributed file storage with dedicated pinning group (477dfcab-ef52-4227-96f2-f9588c6294d4)
- **OpenZeppelin Contracts**: Security-audited smart contract libraries for ERC-721 and ERC-2981 standards
- **WalletConnect**: Mobile wallet integration for React Native application

### Payment Processing
- **Stripe Integration**: Traditional payment processing with automatic tax calculation and crypto conversion
- **SuperPay Integration**: Planned fiat-to-crypto payment processor for seamless user experience
- **USDC Support**: Planned stablecoin payment integration for reduced volatility

### Development and Deployment
- **Coinbase CDP Agent Kit**: Planned integration for automated contract deployment and management
- **GitHub Actions**: Automated deployment pipeline with artifact compilation and contract verification
- **Multi-Platform Deployment**: Configuration for Vercel, Railway, Render, Heroku, and Replit deployment
- **Express.js**: Server framework with CORS support and rate limiting for API endpoints

### Analytics and Monitoring
- **Base Network RPC**: Real-time blockchain data access with WebSocket support for event monitoring
- **Custom Analytics Engine**: JavaScript-based system tracking minting patterns, trading volume, and community metrics
- **Health Check System**: Automated server monitoring and status reporting

### Legal and Compliance Services
- **Florida Business Registration**: Corporate entity with documented treasury management and governance procedures
- **Trust Services**: Provenance trust structure with fiduciary relationships for asset preservation
- **Contract Verification**: Etherscan/Basescan integration for public contract verification and transparency