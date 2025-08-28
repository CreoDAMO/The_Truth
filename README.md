
# The Truth NFT - Complete Web3 Ecosystem

"The Truth Doesn't Need To Be Pushed, Only The Lie...The Lie Only Needs To Be Whispered, But The Truth Always Remains Silent waiting to be Witnessed."
— Jacque Antoine DeGraff

## Overview

The Truth NFT is a comprehensive Web3 ecosystem that captures a philosophical experiment demonstrating AI systems' institutional translation gaps. The project now includes a complete web-based minting platform, MetaMask integration, traditional sales channels, and browser-based deployment tools.

## 🏗️ Complete Repository Structure

```
the-truth-nft/
├── README.md
├── LICENSE
├── DEPLOYMENT.md
├── .env.example
├── gitignore
├── package.json
├── package-lock.json
├── hardhat.config.js
├── .replit
│
├── 🌐 Web Application/
│   ├── index.html              # Main minting interface
│   ├── deploy.html             # Browser-based deployment
│   ├── shop.html               # Traditional sales platform
│   ├── app.js                  # Frontend logic with MetaMask
│   ├── server.js               # Express server
│   └── deploy-with-metamask.js # MetaMask deployment script
│
├── ⚡ Smart Contracts/
│   ├── TheTruth.sol           # Main NFT contract (77 editions)
│   ├── TruthBonusGift.sol     # Bonus collection (145,000 editions)
│   └── PaymentSpliter.sol     # Revenue distribution
│
├── 🔧 Deployment Scripts/
│   ├── deployTheTruth.js          # Traditional deployment
│   ├── deployWithMetaMaskHardhat.js # MetaMask Hardhat integration
│   ├── compileForBrowser.js       # Browser compilation
│   ├── generate_metadata.js       # Metadata generation
│   ├── setProvenance.js           # Immutable provenance
│   ├── toggleMinting.js           # Enable/disable minting
│   ├── withdraw.js               # Treasury management
│   ├── deployPaymentSplitter.js  # Multi-party payments
│   ├── setTreasury.js            # Treasury updates
│   ├── verifyContract.js         # Etherscan verification
│   └── checkStatus.js            # Contract monitoring
│
├── 🧪 Testing & Utilities/
│   ├── test/
│   │   └── TheTruth.test.js      # Comprehensive test suite
│   └── update-contract.js        # Frontend address updates
│
├── 📊 Metadata & Documentation/
│   ├── metadata/
│   │   ├── Metadata.csv          # Main collection metadata
│   │   ├── Metadata.md           # Documentation
│   │   ├── Bonus-Gift.csv        # Bonus collection metadata
│   │   ├── Bonus-Gift.md         # Bonus documentation
│   │   └── bonus-gift.json       # Bonus metadata template
│   ├── docs/
│   │   ├── The Truth Repo.md     # Technical documentation
│   │   └── THE TRUTH - Bonus Gift NFT Collection.md
│   └── economy.md                # Complete economic strategy
└── scripts/ (see Deployment Scripts above)
```

## 🚀 Key Features

### Two-Tier NFT Collections
- **The Truth (Main)**: 77 editions at 0.1695 ETH (~$777)
- **The Truth - Bonus Gift**: 145,000 editions at 0.039 ETH (~$145)

### Web3 Integration
- **MetaMask Wallet Connection**: Seamless Web3 experience
- **Base Network Support**: Optimized for Base mainnet/testnet
- **Browser-Based Deployment**: Deploy contracts directly from browser
- **Real-Time Minting**: Live minting interface with progress tracking

### Traditional Sales Channels
- **Audiobook Sales**: $35 (Main), $15 (Bonus)
- **PDF Sales**: $20 (Main), $10 (Bonus)
- **Cross-Platform Strategy**: Blockchain + traditional markets

### Smart Contract Architecture
- **ERC-721** with Enumerable extension
- **ERC-2981** royalty standard (10%)
- **ReentrancyGuard** protection
- **Immutable provenance** system
- **Flexible treasury** management

## 🌊 Deployment Options

### 1. Browser-Based Deployment (Recommended)
```bash
npm run start
# Navigate to /deploy.html
# Connect MetaMask and deploy directly
```

### 2. Traditional Hardhat Deployment
```bash
npm run deploy:base
```

### 3. MetaMask + Hardhat Hybrid
```bash
npm run compile-browser
npm run deploy-metamask-hardhat
```

## 💻 Web Application

### Minting Interface (`index.html`)
- MetaMask wallet connection
- Real-time supply tracking
- Master Copy claiming system
- Responsive design with progress indicators

### Deployment Interface (`deploy.html`)
- Browser-based contract deployment
- MetaMask integration
- Network configuration
- Deployment status tracking

### Shop Interface (`shop.html`)
- Traditional payment processing
- Audiobook and PDF sales
- Cross-platform integration
- Order management system

## 🔗 Network Configuration

### Base Mainnet
- Chain ID: 8453
- RPC: https://mainnet.base.org
- Explorer: https://basescan.org

### Base Sepolia Testnet
- Chain ID: 84532
- RPC: https://sepolia.base.org
- Explorer: https://sepolia.basescan.org

## 📦 Quick Start

1. **Clone and Setup**
   ```bash
   git clone https://github.com/CreoDAMO/the-truth-nft
   cd the-truth-nft
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   # Access at http://localhost:5000
   ```

3. **Deploy Contracts**
   - Browser: Navigate to `/deploy.html`
   - CLI: `npm run deploy:base`

4. **Generate Metadata**
   ```bash
   npm run generate-metadata
   ```

## 🧪 Testing

```bash
npx hardhat test
```

Comprehensive test suite covering:
- Contract deployment and initialization
- Minting mechanics and limits
- MetaMask integration
- Treasury management
- Provenance verification

## 💰 Economic Strategy

### Primary Markets
- **NFT Sales**: Direct blockchain transactions
- **Traditional Sales**: Audiobooks, PDFs, merchandise

### Revenue Streams
- **Initial Sales**: 76 + 144,000 editions
- **Royalties**: 10% on secondary sales
- **Cross-Platform**: Traditional content sales

### Treasury Management
- Direct withdrawal to owner
- Gnosis Safe multisig support
- PaymentSplitter for multi-party distribution

## 🛠️ Technical Stack

- **Smart Contracts**: Solidity, Hardhat
- **Frontend**: Vanilla JavaScript, Web3.js, ethers.js
- **Backend**: Express.js, Node.js
- **Storage**: IPFS via Pinata
- **Networks**: Base (Mainnet/Testnet)
- **Wallets**: MetaMask integration

## 🔐 Security Features

- One mint per wallet enforcement
- Reentrancy attack protection
- Owner access controls
- Immutable provenance hashing
- Contract verification on Etherscan
- Gas optimization patterns

## 🎯 The Philosophy

This project preserves a unique philosophical demonstration where AI systems repeatedly fell into the exact pattern described in the original text - converting direct witnessing into institutional frameworks. The technology stack itself embodies this philosophy by providing both centralized (traditional sales) and decentralized (NFT) validation systems.

## 🔄 Workflow Commands

- `npm start` - Start development server
- `npm run deploy:base` - Deploy to Base network
- `npm run generate-metadata` - Generate NFT metadata
- `npm run compile-browser` - Compile for browser deployment
- `npm test` - Run test suite
- `npm run verify` - Verify contracts on Etherscan

## 🌐 Live Deployment

The application runs on port 5000 and is configured for production deployment with:
- Express.js server with CORS support
- Static file serving for all web interfaces
- MetaMask wallet integration
- Real-time contract interaction

## 📞 Support & Documentation

- **Technical Docs**: See `/docs` folder
- **Deployment Guide**: `DEPLOYMENT.md`
- **Economic Model**: `economy.md`
- **API Reference**: Contract ABIs in `/artifacts`

## 👨‍💻 Author

**Jacque Antoine DeGraff**
- Master of Nothing, Student of All Things
- Address: 0x67BF9f428d92704C3Db3a08dC05Bc941A8647866
- GitHub: CreoDAMO/SpiralParserEngine-Spiral

## 📄 License

MIT - See LICENSE file for details

---

*"The Truth Doesn't Need To Be Pushed, Only The Lie...The Lie Only Needs To Be Whispered, But The Truth Always Remains Silent waiting to be Witnessed."*
