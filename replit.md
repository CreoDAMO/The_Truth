# The Truth NFT Ecosystem

## Overview

The Truth NFT is a comprehensive Web3 creator economy built on the Base blockchain, aiming to highlight the philosophical gap between truth and institutional interpretation through blockchain technology. This ecosystem features multiple NFT collections (The Truth Original, Bonus Gift, Part Three), native utility tokens (TRUTH and Creator Coin), and a full Web3 infrastructure supporting both traditional e-commerce and blockchain-native functionalities. The project seeks to provide a modern, interactive, and production-ready platform for creators and users alike.

## User Preferences

Preferred communication style: Simple, everyday language

## Recent Changes (October 4, 2025)

### Smart Contract Upgrades
- **OpenZeppelin v5 Migration**: All smart contracts (TheTruth.sol, TruthBonusGift.sol, TruthPartThree.sol, PaymentSplitter) have been updated to be compatible with OpenZeppelin v5.4.0.
  - Updated import paths (ReentrancyGuard moved from `security/` to `utils/`)
  - Updated constructor syntax for Ownable (now requires initialOwner parameter)
  - Replaced deprecated `_exists()` with `_ownerOf() != address(0)`
  - Updated hook system from `_beforeTokenTransfer` to `_update` and `_increaseBalance`
- **PaymentSplitter**: Imported from OpenZeppelin v4 as a standalone contract since it was removed in v5.
- **All Contracts Compiled**: Successfully compiled 32 Solidity files with Hardhat.

### Coinbase SDK Enhancements
- **Updated to v4.3.7**: The latest stable version with advanced Smart Wallet features.
- **New Features Integrated**:
  - **Wallet Capabilities Detection**: Query and display wallet capabilities (paymaster, atomic transactions, etc.)
  - **Spend Permissions**: Enable subscription-like recurring payments without repeated approval
  - **Batch Transactions**: Support for atomic multi-call transactions
  - **Gasless Transactions**: Paymaster-sponsored transactions for better UX
  - **Basename Registration**: Onchain identity management
  - **Smart Wallet Preference**: Configured to prefer Smart Wallet connections
- **Service Architecture**: Enhanced coinbaseService.js with all v4.3+ features

### Frontend Improvements
- **Blackpaper Fix**: Copied BLACKPAPER.md to LAW directory for proper display in Lawful dashboard
- **Vite Configuration**: Added `allowedHosts: true` to support Replit's proxy architecture
- **Build Optimization**: React app successfully built with code splitting and vendor chunks

## System Architecture

### Frontend Architecture
- **React-Vite SPA**: A Single Page Application utilizing React with Vite for client-side routing and development.
- **Express.js Backend**: Serves static files and provides API routes.
- **State Management**: React Context API is used for global state management, including wallet information, tokens, and user data.
- **Styling**: Tailwind CSS v4 is used for utility-first styling, augmented with custom CSS for animations and effects like Glassmorphism.
- **UI/UX Decisions**: Employs a modern design system with Glassmorphism effects, gradient typography, interactive cards with hover effects, animated buttons, and responsive navigation.
- **Technical Implementations**: Utilizes Ethers.js v6 for blockchain interactions and React 19 for UI rendering.
- **Feature Specifications**: Includes various dashboards for Home, Analytics, Governance, Community, Liquidity, Payments, Social, Legal, Shop, and Deploy, each with specific functionalities.

### Smart Contract System
- **ERC-721 NFT Contracts**: Implemented for NFT collections (TheTruth.sol, TruthBonusGift.sol), supporting ERC-2981 royalties.
- **Token Economy**: Features TRUTH (10M supply) and Creator Coin (1B supply) tokens on the Base blockchain.
- **Payment Infrastructure**: Designed to support both cryptocurrency and traditional payment methods.
- **Revenue Distribution**: Utilizes a PaymentSplitter contract for automated revenue sharing.

### Data Storage Solutions
- **IPFS Integration**: NFT metadata and assets are stored on IPFS via Pinata for decentralized storage.
- **On-Chain Provenance**: SHA256 hashes of metadata are stored on the blockchain for verifiable provenance.

### Deployment Architecture
- **Development**: Hosted on Replit with auto-restart workflows.
- **Staging**: Deployed to GitHub Pages via automated CI/CD.
- **Production**: Utilizes Replit Deployments with autoscale configuration.
- **CDN**: Static assets are served via Replit's edge network.

## External Dependencies

### Blockchain Infrastructure
- **Base Network**: The primary Layer 2 blockchain for deployment.
- **Base Sepolia**: Used as the testing environment for smart contract validation.
- **Ethers.js v6**: Library for interacting with the Ethereum blockchain.
- **Hardhat 2.22**: Development environment for compiling, deploying, and testing smart contracts.

### Frontend Libraries
- **React 19.2**: The core UI library.
- **React Router DOM 7.9**: For client-side routing.
- **Vite 7.1**: Build tool and development server.
- **Tailwind CSS 4.1**: Utility-first CSS framework.
- **@tailwindcss/postcss**: PostCSS plugin for Tailwind CSS v4.

### Backend Services
- **Express.js 4.21**: Web application framework for Node.js.
- **Node.js 20**: JavaScript runtime environment.

### Payment Processing
- **Stripe 14.25**: Integrated for traditional payment processing.
- **Coinbase Wallet SDK 4.3.7**: Primary wallet connection with Smart Wallet support, spend permissions, and gasless transactions.
- **MetaMask**: Fallback wallet connection method for cryptocurrency transactions.

### Development Tools
- **PostCSS 8.5**: Tool for transforming CSS with JavaScript plugins.
- **Autoprefixer 10.4**: Adds vendor prefixes to CSS rules.
- **Hardhat Toolbox 5.0**: A collection of Hardhat plugins.
- **OpenZeppelin 5.4.0**: Provides secure and audited smart contract libraries (upgraded from v4.9).