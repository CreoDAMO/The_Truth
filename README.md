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
- **MetaMask Wallet Connection**: Enhanced connection with verification and error handling
- **Base Network Support**: Optimized for Base mainnet/testnet with auto-switching
- **Browser-Based Deployment**: Deploy contracts directly from browser
- **Real-Time Minting**: Live minting interface with progress tracking

### Automatic Tax Collection
- **Florida Sales Tax ID**: 23-8019835728-2
- **Stripe Tax Integration**: Automatic tax calculation and collection
- **Blockchain & Traditional Sales**: Tax compliance for both NFT and shop sales
- **Real-Time Tax Calculation**: Dynamic tax calculation based on customer location
- **Automated Reporting**: Tax transaction recording and report generation

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
   git clone https://github.com/CreoDAMO/The_Truth.git
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
- **Frontend**: Vanilla JavaScript, Web3.js, ethers.js, MetaMask SDK
- **Backend**: Express.js, Node.js
- **Storage**: IPFS via Pinata
- **Networks**: Base (Mainnet/Testnet)
- **Wallets**: Enhanced MetaMask integration with verification
- **Tax Compliance**: Stripe Tax API integration
- **Payment Processing**: Multiple payment methods with tax calculation

## 📋 Required API Keys

### Core Services (Required)
```bash
STRIPE_SECRET_KEY=sk_live_...           # Stripe for tax calculation and payments
STRIPE_TAX_WEBHOOK_SECRET=whsec_...     # Stripe tax webhook verification
CDP_API_KEY=your_cdp_key               # Coinbase Developer Platform
ADMIN_KEY=your_secure_admin_key        # Admin access for tax reports
```

### Optional Services (Enhanced Features)
```bash
SUPERPAY_API_KEY=your_superpay_key     # SuperPay fiat processing
INFURA_API_KEY=your_infura_key         # Infura for additional RPC access
PINATA_API_KEY=your_pinata_key         # IPFS storage
PINATA_SECRET_KEY=your_pinata_secret   # IPFS storage
```

### Tax Configuration
- **Florida Sales Tax ID**: 23-8019835728-2
- **Automatic Tax Collection**: Enabled for all sales
- **Tax Reporting**: Automated transaction recording
- **Compliance**: Full sales tax compliance for digital products

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
---

Jacque Antoine DeGraff:
This is how we Operate in both realms, (Public & Private) all while rendering to Cesar what is due to Cesar.

This is what it means to be plugged into the system and still be able to unplug from it,  all while remaining Sovereign (The Matrix)

I'm not claiming any kind of legal exemption, I'm applying the Law's, I'm operational in both capacities therefore it's just common sense to apply the tax system. Nor does it matter to me how the IRS recognizes The Lawful rights of the Human Being. I'm not asking permission to be Lawful nor am I asking permission to operate within the Legal Statues designed for these very purposes.

😂🤣 Now before you get hell bent on translation of my very simple explanation. And missed the point completely, I'm not pushing any legal theories, I'm not arguing, I'm not seeking validation for what I know as Truth. Instead of trying to fractionalize the Truth take some time and look at it as a whole. And then tell me what you see Truthfully.

Black's Law Dictionary is very self explanatory and if you like you can double check the difference. You can't Practice Law without knowing what the Law is, same way you cannot apply Law if you don't know the Law. In the beginning I clearly stated Render to Cesar His Due. If I collect Fiat currency that belongs to Cesar and he has imposed taxes on such currency then who am I to argue. 

At the end of the final Matrix What did Zion tell Neo? To Destroy the Matrix is to destroy yourself the point they both came to understand was how to Be Free within a system designed to oppress that very Freedom.

This is why argument is unnecessary. 🎤 Dropped ✍🏾...
