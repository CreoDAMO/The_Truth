# The Truth NFT Ecosystem

## Overview

The Truth NFT is a comprehensive Web3 creator economy built on the Base blockchain that demonstrates the philosophical gap between truth and institutional translation through blockchain technology. The ecosystem includes multiple NFT collections (The Truth Original, Bonus Gift, Part Three), utility tokens (TRUTH and Creator Coin), and a complete Web3 infrastructure with both traditional e-commerce and blockchain-native functionality. The platform serves as both a philosophical experiment and a practical demonstration of decentralized creator economics, featuring real-time analytics, community governance, and multi-channel payment processing.

## Recent Changes

**September 17, 2025 - Replit Environment Setup**
- Successfully configured Express.js server to bind to 0.0.0.0:5000 with proper CORS configuration for Replit domains
- Fixed OpenZeppelin contract compatibility issues by updating import paths (ReentrancyGuard moved from utils to security)
- Updated smart contracts for OpenZeppelin v4.9.6 compatibility:
  - Fixed constructor patterns to use Ownable() with _transferOwnership()
  - Updated _beforeTokenTransfer hooks to use 4-parameter signature (from, to, firstTokenId, batchSize)
  - Added missing IERC721 import to EnhancedTheTruth.sol
- Renamed hardhat.config.js to hardhat.config.cjs for ESM compatibility
- Updated Solidity compiler version to 0.8.27 to match contract pragma
- Set up automated workflow for frontend server on port 5000
- Configured deployment settings for Replit autoscale environment
- All smart contracts now compile successfully with Hardhat

## User Preferences

Preferred communication style: Simple, everyday language.

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