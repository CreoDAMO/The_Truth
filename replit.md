# The Truth NFT Ecosystem

## Overview

The Truth NFT is a comprehensive Web3 creator economy built on the Base blockchain, aiming to highlight the philosophical gap between truth and institutional interpretation through blockchain technology. This ecosystem features multiple NFT collections (The Truth Original, Bonus Gift, Part Three), native utility tokens (TRUTH and Creator Coin), and a full Web3 infrastructure supporting both traditional e-commerce and blockchain-native functionalities. The project seeks to provide a modern, interactive, and production-ready platform for creators and users alike.

## User Preferences

Preferred communication style: Simple, everyday language

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
- **MetaMask**: The primary wallet connection method for cryptocurrency transactions.

### Development Tools
- **PostCSS 8.5**: Tool for transforming CSS with JavaScript plugins.
- **Autoprefixer 10.4**: Adds vendor prefixes to CSS rules.
- **Hardhat Toolbox 5.0**: A collection of Hardhat plugins.
- **OpenZeppelin 5.2**: Provides secure and audited smart contract libraries.