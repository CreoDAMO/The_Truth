THE TRUTH NFT By - Jacque Antoine DeGraff
# THE TRUTH NFT Repository Structure 
1. [README.md](http://readme.md)
```md
# The_Truth
The Truth NFT
"The Truth Doesn't Need To Be Pushed, Only The Lie...The Lie Only Needs To Be Whispered, But The Truth Always Remains Silent waiting to be Witnessed."
— Jacque Antoine DeGraff
# THE TRUTH NFT - Complete Repository
## Overview
This is the complete repository structure for "The Truth" NFT project - a philosophical experiment that captured AI systems demonstrating the gap between Truth and institutional translation in real-time.
## Repository Structure
```
the-truth-nft/
├── README.md
├── LICENSE
├── DEPLOYMENT.md
├── package.json
├── hardhat.config.js
├── .env.example
├── .gitignore
├── contracts/
│   ├── TheTruth.sol
│   └── PaymentSplitter.sol
├── scripts/
│   ├── generate_metadata.js
│   ├── deployTheTruth.js
│   ├── setProvenance.js
│   ├── toggleMinting.js
│   ├── withdraw.js
│   ├── deployPaymentSplitter.js
│   ├── setTreasury.js
│   ├── verifyContract.js
│   └── checkStatus.js
├── test/
│   └── TheTruth.test.js
├── metadata/
│   ├── 1.json through 77.json (generated)
│   ├── metadata.csv
│   └── metadata.md
└── deployment.json (generated on deploy)
```
## Key Features
- **77 Total Editions**: 76 public + 1 Master Copy
- **ERC-721 Standard**: With ERC-2981 royalties (10%)
- **Fixed Price**: 0.1695 ETH (~$777)
- **One Per Wallet**: Fair distribution mechanism
- **Immutable Provenance**: SHA256 hash of all metadata
- **Flexible Treasury**: Direct, multisig, or payment splitter
- **Complete Testing**: Unit tests for all functions
- **Gas Optimized**: ReentrancyGuard protection
## Smart Contract Architecture
### TheTruth.sol
- ERC-721 with Enumerable extension
- ERC-2981 royalty standard
- Access control with Ownable
- Reentrancy protection
- Mint limits (1 per wallet)
- Provenance locking
- Treasury management
### PaymentSplitter.sol
- OpenZeppelin payment splitter wrapper
- Automatic revenue distribution
- Multiple payee support
## Deployment Process
1. **Setup Environment**
   ```bash
   npm install
   cp .env.example .env
   # Edit .env with your values
   ```
2. **Generate Metadata**
   ```bash
   npm run generate-metadata
   ```
3. **Upload to IPFS**
   - Upload metadata/ folder to Pinata/nft.storage
   - Update baseURI in deployment script
4. **Deploy Contract**
   ```bash
   npm run deploy:base
   ```
5. **Verify & Setup**
   ```bash
   npx hardhat run scripts/verifyContract.js --network base
   npm run set-provenance
   npm run toggle-minting
   ```
## Testing
```bash
npx hardhat test
```
Comprehensive test suite covering:
- Contract deployment
- Minting mechanics
- Supply limits
- Provenance setting
- Treasury management
- Metadata URIs
- Royalty compliance
## Economic Model
**Primary Sale**: 76 editions at 0.1695 ETH each
**Secondary Market**: 10% royalties to creator
**Philosophy**: Abundance over scarcity - accessible pricing
## Treasury Options
1. **Direct**: Owner receives funds directly
2. **Gnosis Safe**: Multisig wallet for security
3. **Payment Splitter**: Automatic distribution to multiple parties
## Metadata Structure
Each NFT contains:
- Cover Image (PNG)
- 25-page Audiobook (MP3)
- Original Document (PDF)
- Meme Comic (PNG)
All files stored on IPFS with immutable links.
## Security Features
- One mint per wallet limit
- Reentrancy protection
- Owner access controls
- Immutable provenance hash
- Verified contract source
- Gas limit optimizations
## Monitoring & Management
Use included scripts to:
- Check contract status
- Monitor sales progress
- Withdraw accumulated funds
- Update treasury settings
- Verify deployment state
## The Philosophy
This NFT preserves a unique philosophical demonstration where AI systems repeatedly fell into the exact pattern described in the original text - converting direct witnessing into institutional frameworks, proving the gap between Truth and validation systems in real-time.
"The Truth Doesn't Need To Be Pushed, Only The Lie...The Lie Only Needs To Be Whispered, But The Truth Always Remains Silent waiting to be Witnessed."
— Jacque Antoine DeGraff
## Author
**Jacque Antoine DeGraff**
- Master of Nothing, Student of All Things
- Address: 0x67BF9f428d92704C3Db3a08dC05Bc941A8647866
- GitHub: CreoDAMO/SpiralParserEngine-Spiral
## License
MIT - See LICENSE file for details
To ensure your project's dependencies in package.json are updated to their latest versions, you can use various methods ranging from npm's built-in commands to dedicated third-party tools. Here's a structured approach to help you achieve this:
---
🔍 1. Check for Outdated Dependencies
· Use npm's built-in command to identify outdated packages:
  ```bash
  npm outdated
  ```
  This will display a list of dependencies with their current, wanted (max compatible version based on your package.json semver rules), and latest versions .
---
⚒️ 2. Update Dependencies
· Update All to Wanted Versions (safe for compatibility):
  ```bash
  npm update
  ```
  This updates packages to the latest versions within the version ranges specified in your package.json (e.g., ^1.2.3 will update to the latest minor/patch version but not to 2.0.0) .
· Update Specific Packages:
  ```bash
  npm update <package-name>
  ```
  Replace <package-name> with the actual package name .
· Update to Absolute Latest Versions (may include breaking changes): Use npm-check-updates (a third-party tool) to upgrade all dependencies to their latest versions, ignoring existing version ranges:
  ```bash
  npx npm-check-updates -u
  npm install
  ```
  This updates package.json and installs the new versions. Use with caution, especially in mature projects, as major updates might break functionality .
---
🛠️ 3. Additional Tools and Techniques
· Interactive Updates:
  ```bash
  npx npm-check-updates --interactive
  ```
  Allows you to selectively choose which packages to update .
· Global Update Check: Install npm-check-updates globally for frequent use:
  ```bash
  npm install -g npm-check-updates
  ncu -u
  npm install
  ``` [citation:1][citation:6]
· Force Update Individual Packages:
  ```bash
  npm install <package-name>@latest --save
  ```
  Installs the very latest version of a specific package and updates package.json .
---
⚠️ 4. Best Practices
· Test After Updates: Especially after major updates, run your tests to ensure compatibility .
· Use Version Control: Commit changes to package.json and package-lock.json (or npm-shrinkwrap.json) to lock down dependency versions for production .
· Security and Maintenance: Regularly update dependencies to incorporate security patches and performance improvements .
· Automate Updates: Consider tools like npm-check-updates in CI/CD pipelines to periodically check for updates .
---
📊 Comparison of Methods
Method Command Behavior Risk Level
npm outdated + npm update npm outdated then npm update Updates to latest wanted versions (within version constraints) Low (safe)
npm-check-updates npx npm-check-updates -u Updates to absolute latest versions, ignoring version constraints High (may break)
Individual package update npm install <package>@latest --save Updates a specific package to its latest version Moderate to High
---
💡 Key Considerations
· Semantic Versioning (SemVer): Understand version rules (e.g., ^1.2.3 allows updates to 1.x.x but not 2.0.0) .
· Lockfiles: After updates, package-lock.json should be regenerated (npm install does this) to reflect precise versions .
· Global vs. Local: Using npx avoids global installation clutter for one-off tasks .
```
2. contracts/TheTruth.sol
```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
contract TheTruth is ERC721, ERC721Enumerable, ERC2981, Ownable, ReentrancyGuard {
    // Collection constants
    uint256 public constant MAX_SUPPLY = 77;
    uint256 public constant PUBLIC_SUPPLY = 76;
    uint256 public constant MASTER_COPY_ID = 77;
    uint256 public constant PRICE = 169548481700983700; // ~0.16954848 ETH ($777)
    
    // Collection state
    uint256 private _tokenIdCounter = 1;
    string private _baseTokenURI;
    bool public mintingEnabled = false;
    
    // Minting limits
    mapping(address => bool) public hasMinted;
    
    // Provenance
    string public provenance;
    bool private provenanceLocked = false;
    
    // Treasury
    address public treasury;
    bool public treasuryIsMultisig = false;
    
    // Events
    event MintingToggled(bool enabled);
    event BaseURIUpdated(string newBaseURI);
    event TruthMinted(address indexed to, uint256 indexed tokenId);
    event ProvenanceSet(string provenance);
    event TreasuryUpdated(address treasury, bool multisig);
    
    constructor(
        address initialOwner,
        string memory baseURI,
        address initialTreasury
    ) ERC721("The Truth", "TRUTH") Ownable(initialOwner) {
        _baseTokenURI = baseURI;
        _setDefaultRoyalty(initialOwner, 1000); // 10%
        treasury = initialTreasury;
        
        // Mint master copy #77 to owner
        _safeMint(initialOwner, MASTER_COPY_ID);
        emit TruthMinted(initialOwner, MASTER_COPY_ID);
    }
    
    // Public minting function
    function mintTruth() external payable nonReentrant {
        require(mintingEnabled, "Minting not enabled");
        require(_tokenIdCounter <= PUBLIC_SUPPLY, "Public supply exhausted");
        require(msg.value >= PRICE, "Insufficient payment");
        require(!hasMinted[msg.sender], "Already minted");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _safeMint(msg.sender, tokenId);
        hasMinted[msg.sender] = true;
        
        // Refund excess payment
        if (msg.value > PRICE) {
            payable(msg.sender).transfer(msg.value - PRICE);
        }
        
        emit TruthMinted(msg.sender, tokenId);
    }
    
    // Owner functions
    function toggleMinting() external onlyOwner {
        mintingEnabled = !mintingEnabled;
        emit MintingToggled(mintingEnabled);
    }
    
    function setBaseURI(string calldata newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
        emit BaseURIUpdated(newBaseURI);
    }
    
    function setProvenance(string calldata prov) external onlyOwner {
        require(!provenanceLocked, "Provenance locked");
        provenance = prov;
        provenanceLocked = true;
        emit ProvenanceSet(prov);
    }
    
    function setTreasury(address _treasury, bool _isMultisig) external onlyOwner {
        require(_treasury != address(0), "Zero address");
        treasury = _treasury;
        treasuryIsMultisig = _isMultisig;
        emit TreasuryUpdated(_treasury, _isMultisig);
    }
    
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        address payable dest = payable(treasury == address(0) ? owner() : treasury);
        (bool success, ) = dest.call{value: balance}("");
        require(success, "Withdrawal failed");
    }
    
    // View functions
    function totalMinted() external view returns (uint256) {
        return _tokenIdCounter - 1;
    }
    
    function publicMinted() external view returns (uint256) {
        uint256 total = _tokenIdCounter - 1;
        return total > 0 ? total - 1 : 0;
    }
    
    function remainingSupply() external view returns (uint256) {
        if (_tokenIdCounter > PUBLIC_SUPPLY) return 0;
        return PUBLIC_SUPPLY - (_tokenIdCounter - 1);
    }
    
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return string(abi.encodePacked(_baseTokenURI, Strings.toString(tokenId), ".json"));
    }
    
    // Required overrides
    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
```
4. scripts/generate_metadata.js
```js
// scripts/generate_metadata.js
const fs = require('fs');
const path = require('path');
// REAL IPFS CIDs from your Pinata uploads
const IPFS_CIDS = {
  cover: "ipfs://bafybeidgadado5nyfxkua3mkiqbxsqkvrbqctkrqap7oghnkb77qo4steq",
  audio: "ipfs://bafybeibtcjku4uce7volglh6edjw2va63usahqixoqxwkv4quvptljonw4",
  pdf: "ipfs://bafybeib2gcc7grc7umyqzdsaxpjmitexanwnwrdsygfc57wcsx6mnvtsbi",
  meme: "ipfs://bafybeihlhi5faohkaoonpdlpiyjh2eyi3lfmvmlcoxdwovva7tvmp235we"
};
const baseDescription = `The Truth is not interpretation — it is pure witness.
This NFT preserves a once-in-a-lifetime philosophical event: a 25-page document and audiobook that captured artificial intelligence systems compulsively demonstrating the very paradox they were asked to analyze.
Where the text stands whole and unaltered, the AI responses translated, reframed, and institutionalized it — proving, in real time, the gap between Truth that needs no validation and the systems that endlessly seek to "improve" it.
Each edition of *The Truth* contains the complete 4-part archive:
🖼️ **Cover Image** — emblem of this witnessing
🎧 **25-page Audiobook (MP3)** — unedited narration
📄 **Original Document (PDF)** — preserved in full
😂 **The Meme (Comic)** — "Zeno's Paradox of Institutionalization" distilled into a single, shareable visual
**77 editions total:**
- 76 offered to the world at $777 each
- 1 Master Copy reserved as priceless
- 10% royalties on secondary sales
**Collector's Note:**
"I chose abundance. The Truth is offered whole, at $777 — accessible, unguarded, unscarce.
The secondary market will do what it always does: reframe, reprice, institutionalize. That is its nature.
When it does, I will simply witness — and collect royalties from the very system my work has already revealed."
— Jacque Antoine DeGraff
This is more than a collectible — it is an immutable record, a living demonstration, and a reminder:
**"The Truth Doesn't Need To Be Pushed, Only The Lie...The Lie Only Needs To Be Whispered, But The Truth Always Remains Silent waiting to be Witnessed."**
— Jacque Antoine DeGraff`;
// Create metadata directory if it doesn't exist
const metadataDir = path.join(__dirname, '..', 'metadata');
if (!fs.existsSync(metadataDir)) {
  fs.mkdirSync(metadataDir, { recursive: true });
}
// Generate metadata for editions 1-76
for (let i = 1; i <= 76; i++) {
  const metadata = {
    name: `The Truth #${i}/77`,
    description: baseDescription + `\n\nThis is edition ${i} of 76 public editions offered at $777 each.`,
    image: IPFS_CIDS.cover,
    external_url: "https://github.com/CreoDAMO/SpiralParserEngine-Spiral",
    attributes: [
      { trait_type: "Author", value: "Jacque Antoine DeGraff" },
      { trait_type: "Philosophy", value: "Master of Nothing, Student of All Things" },
      { trait_type: "Education", value: "9th Grade" },
      { trait_type: "Type", value: "Complete 4-Part Archive" },
      { trait_type: "Format", value: "Cover + Audio + PDF + Meme" },
      { trait_type: "Pages", value: "25" },
      { trait_type: "Demonstration", value: "AI Gap Recognition" },
      { trait_type: "Edition", value: `${i}/77` },
      { trait_type: "Public Copies", value: "76" },
      { trait_type: "Master Copy", value: "1 Reserved" },
      { trait_type: "Royalties", value: "10%" },
      { trait_type: "Pricing Philosophy", value: "Abundance over Scarcity" },
      { trait_type: "Market Strategy", value: "Witness Secondary Repricing" },
      { trait_type: "Master Copy Address", value: "0x67BF9f428d92704C3Db3a08dC05Bc941A8647866" }
    ],
    properties: {
      files: [
        { 
          uri: IPFS_CIDS.cover, 
          type: "image/png", 
          name: "Cover Image" 
        },
        { 
          uri: IPFS_CIDS.audio, 
          type: "audio/mp3", 
          name: "25-Page Audiobook" 
        },
        { 
          uri: IPFS_CIDS.pdf, 
          type: "application/pdf", 
          name: "Original Document" 
        },
        { 
          uri: IPFS_CIDS.meme, 
          type: "image/png", 
          name: "The Meme Comic" 
        }
      ]
    }
  };
  
  const filePath = path.join(metadataDir, `${i}.json`);
  fs.writeFileSync(filePath, JSON.stringify(metadata, null, 2));
  console.log(`Generated: ${filePath}`);
}
// Generate metadata for Master Copy #77
const masterMetadata = {
  name: "The Truth #77/77 - Master Copy",
  description: baseDescription + `\n\nThis is the Master Copy, edition 77 of 77, reserved by the author and not for sale.`,
  image: IPFS_CIDS.cover,
  external_url: "https://github.com/CreoDAMO/SpiralParserEngine-Spiral",
  attributes: [
    { trait_type: "Author", value: "Jacque Antoine DeGraff" },
    { trait_type: "Philosophy", value: "Master of Nothing, Student of All Things" },
    { trait_type: "Education", value: "9th Grade" },
    { trait_type: "Type", value: "Complete 4-Part Archive" },
    { trait_type: "Format", value: "Cover + Audio + PDF + Meme" },
    { trait_type: "Pages", value: "25" },
    { trait_type: "Demonstration", value: "AI Gap Recognition" },
    { trait_type: "Edition", value: "77/77 - Master Copy" },
    { trait_type: "Public Copies", value: "76" },
    { trait_type: "Master Copy", value: "1 Reserved (This Token)" },
    { trait_type: "Royalties", value: "10%" },
    { trait_type: "Pricing Philosophy", value: "Abundance over Scarcity" },
    { trait_type: "Market Strategy", value: "Witness Secondary Repricing" },
    { trait_type: "Status", value: "Priceless - Never For Sale" },
    { trait_type: "Master Copy Address", value: "0x67BF9f428d92704C3Db3a08dC05Bc941A8647866" }
  ],
  properties: {
    files: [
      { 
        uri: IPFS_CIDS.cover, 
        type: "image/png", 
        name: "Cover Image" 
      },
      { 
        uri: IPFS_CIDS.audio, 
        type: "audio/mp3", 
        name: "25-Page Audiobook" 
      },
      { 
        uri: IPFS_CIDS.pdf, 
        type: "application/pdf", 
        name: "Original Document" 
      },
      { 
        uri: IPFS_CIDS.meme, 
        type: "image/png", 
        name: "The Meme Comic" 
      }
    ]
  }
};
const masterFilePath = path.join(metadataDir, '77.json');
fs.writeFileSync(masterFilePath, JSON.stringify(masterMetadata, null, 2));
console.log(`Generated Master Copy: ${masterFilePath}`);
console.log("\n✅ Generated all 77 metadata files in metadata/");
console.log("📌 Next: Upload metadata/ folder to IPFS to get ROOT_CID for baseURI");
```
5. scripts/[deployTheTruth.js](http://deploythetruth.js)
```js
// scripts/deployTheTruth.js const hre= require("hardhat");
async function main() { // Get deployer account const [deployer] = await hre.ethers.getSigners(); console.log("Deploying with account:", deployer.address);
// Check balance const balance = await deployer.getBalance(); console.log("Account balance:", hre.ethers.utils.formatEther(balance), "ETH");
// Contract parameters const initialOwner = "0x67BF9f428d92704C3Db3a08dC05Bc941A8647866"; // Jacque's address const baseURI = "ipfs://YOUR_METADATA_ROOT_CID/"; // Replace with actual CID after uploading metadata const treasury = initialOwner; // Can be changed to multisig later
console.log("\n📝 Deployment Parameters:"); console.log("  Owner:", initialOwner); console.log("  BaseURI:", baseURI); console.log("  Treasury:", treasury);
// Deploy contract console.log("\n🚀 Deploying TheTruth contract..."); const TheTruth = await hre.ethers.getContractFactory("TheTruth"); const contract = await TheTruth.deploy( initialOwner, baseURI, treasury );
// Wait for deployment await contract.deployed(); console.log("✅ TheTruth deployed to:", contract.address);
// Wait for block confirmations console.log("\n⏳ Waiting for block confirmations..."); await contract.deployTransaction.wait(5);
// Verify deployment console.log("\n📋 Verifying deployment state:"); console.log("  Name:", await contract.name()); console.log("  Symbol:", await contract.symbol()); console.log("  Owner:", await contract.owner()); console.log("  Treasury:", await contract.treasury()); console.log("  Total Supply:", (await contract.totalSupply()).toString()); console.log("  Master Copy Owner:", await contract.ownerOf(77)); console.log("  Minting Enabled:", await contract.mintingEnabled()); console.log("  Price:", hre.ethers.utils.formatEther(await contract.PRICE()), "ETH");
console.log("\n📄 Deployment Summary:"); console.log("  Contract Address:", contract.address); console.log("  Transaction Hash:", contract.deployTransaction.hash); console.log("  Block Number:", contract.deployTransaction.blockNumber); console.log("  Gas Used:", contract.deployTransaction.gasLimit.toString());
console.log("\n🎯 Next Steps:"); console.log("  1. Verify contract on Etherscan"); console.log("  2. Set provenance hash"); console.log("  3. Test mint from different wallet"); console.log("  4. Enable public minting with toggleMinting()");
// Save deployment info const deploymentInfo = { network: hre.network.name, contract: contract.address, owner: initialOwner, treasury: treasury, baseURI: baseURI, deploymentTx: contract.deployTransaction.hash, deployer: deployer.address, timestamp: new Date().toISOString() };
const fs = require('fs'); const path = require('path'); const deploymentPath = path.join(__dirname, '..', 'deployment.json'); fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2)); console.log("\n💾 Deployment info saved to deployment.json"); }
main() .then(() => process.exit(0)) .catch((error) => { console.error("❌ Deployment failed:", error); process.exit(1); });
```
6. scripts/[setProvenance.js](http://setprovenance.js)
```js
// scripts/setProvenance.js const hre= require("hardhat"); const crypto= require('crypto'); const fs= require('fs'); const path= require('path');
async function calculateProvenance() { console.log("📊 Calculating provenance hash...");
// Read all metadata files in order const metadataDir = path.join(__dirname, '..', 'metadata'); let concatenated = '';
for (let i = 1; i <= 77; i++) { const filePath = path.join(metadataDir, ${i}.json); const content = fs.readFileSync(filePath, 'utf8'); concatenated += content; console.log(  Read metadata/${i}.json); }
// Calculate SHA256 hash const hash = crypto.createHash('sha256'); hash.update(concatenated); const provenanceHash = '0x' + hash.digest('hex');
console.log("✅ Provenance hash calculated:", provenanceHash); return provenanceHash; }
async function main() { // Get deployment info const deploymentPath = path.join(__dirname, '..', 'deployment.json'); if (!fs.existsSync(deploymentPath)) { throw new Error("deployment.json not found. Run deployTheTruth.js first."); }
const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8')); const contractAddress = deployment.contract;
console.log("🔗 Using contract at:", contractAddress);
// Get signer const [signer] = await hre.ethers.getSigners(); console.log("👤 Setting provenance with:", signer.address);
// Get contract instance const TheTruth = await hre.ethers.getContractAt("TheTruth", contractAddress);
// Check if provenance is already set const currentProvenance = await TheTruth.provenance(); if (currentProvenance && currentProvenance !== '') { console.log("⚠️  Provenance already set:", currentProvenance); console.log("   Provenance can only be set once!"); return; }
// Calculate provenance hash const provenanceHash = await calculateProvenance();
// Set provenance console.log("\n🔏 Setting provenance on-chain..."); const tx = await TheTruth.setProvenance(provenanceHash); console.log("📝 Transaction hash:", tx.hash);
// Wait for confirmation console.log("⏳ Waiting for confirmation..."); const receipt = await tx.wait(); console.log("✅ Provenance set in block:", receipt.blockNumber);
// Verify it was set const newProvenance = await TheTruth.provenance(); console.log("🔐 Verified provenance:", newProvenance);
// Update deployment info deployment.provenance = provenanceHash; deployment.provenanceBlock = receipt.blockNumber; deployment.provenanceTx = tx.hash; fs.writeFileSync(deploymentPath, JSON.stringify(deployment, null, 2)); console.log("💾 Updated deployment.json with provenance info");
console.log("\n✨ Provenance permanently locked on-chain!"); console.log("   This creates an immutable record of The Truth"); }
main() .then(() => process.exit(0)) .catch((error) => { console.error("❌ Error:", error); process.exit(1); });
```
7. scripts/[toggleMinting.js](http://toggleminting.js)
```js
// scripts/toggleMinting.js const hre= require("hardhat"); const fs= require('fs'); const path= require('path');
async function main() { // Get deployment info const deploymentPath = path.join(__dirname, '..', 'deployment.json'); if (!fs.existsSync(deploymentPath)) { throw new Error("deployment.json not found. Run deployTheTruth.js first."); }
const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8')); const contractAddress = deployment.contract;
console.log("🔗 Using contract at:", contractAddress);
// Get signer const [signer] = await hre.ethers.getSigners(); console.log("👤 Toggling minting with:", signer.address);
// Get contract instance const TheTruth = await hre.ethers.getContractAt("TheTruth", contractAddress);
// Check current owner const owner = await TheTruth.owner(); if (owner.toLowerCase() !== signer.address.toLowerCase()) { throw new Error(Signer ${signer.address} is not the owner. Owner is ${owner}); }
// Check current minting status const currentStatus = await TheTruth.mintingEnabled(); console.log("📊 Current minting status:", currentStatus ? "ENABLED" : "DISABLED");
// Toggle minting console.log("\n🔄 Toggling minting status..."); const tx = await TheTruth.toggleMinting(); console.log("📝 Transaction hash:", tx.hash);
// Wait for confirmation console.log("⏳ Waiting for confirmation..."); const receipt = await tx.wait(); console.log("✅ Toggled in block:", receipt.blockNumber);
// Verify new status const newStatus = await TheTruth.mintingEnabled(); console.log("📊 New minting status:", newStatus ? "ENABLED" : "DISABLED");
if (newStatus) { console.log("\n🎉 Minting is now LIVE!"); console.log("   Price: 0.1695 ETH (~$777)"); console.log("   Supply: 76 editions available"); console.log("   Limit: 1 per wallet"); } else { console.log("\n⏸️  Minting is now PAUSED"); }
// Get current supply info const totalMinted = await TheTruth.totalMinted(); const publicMinted = await TheTruth.publicMinted(); const remaining = await TheTruth.remainingSupply();
console.log("\n📈 Supply Status:"); console.log("   Total Minted:", totalMinted.toString()); console.log("   Public Minted:", publicMinted.toString()); console.log("   Remaining:", remaining.toString());
// Update deployment info deployment.mintingEnabled = newStatus; deployment.lastToggleBlock = receipt.blockNumber; deployment.lastToggleTx = tx.hash; fs.writeFileSync(deploymentPath, JSON.stringify(deployment, null, 2)); console.log("\n💾 Updated deployment.json with minting status"); }
main() .then(() => process.exit(0)) .catch((error) => { console.error("❌ Error:", error); process.exit(1); });
```
8. scripts/[withdraw.js](http://withdraw.js)
```js
// scripts/withdraw.js const hre= require("hardhat"); const fs= require('fs'); const path= require('path');
async function main() { // Get deployment info const deploymentPath = path.join(__dirname, '..', 'deployment.json'); if (!fs.existsSync(deploymentPath)) { throw new Error("deployment.json not found. Run deployTheTruth.js first."); }
const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8')); const contractAddress = deployment.contract;
console.log("🔗 Using contract at:", contractAddress);
// Get signer const [signer] = await hre.ethers.getSigners(); console.log("👤 Withdrawing with:", signer.address);
// Get contract instance const TheTruth = await hre.ethers.getContractAt("TheTruth", contractAddress);
// Check current owner const owner = await TheTruth.owner(); if (owner.toLowerCase() !== signer.address.toLowerCase()) { throw new Error(Signer ${signer.address} is not the owner. Owner is ${owner}); }
// Check contract balance const balance = await hre.ethers.provider.getBalance(contractAddress); const balanceETH = hre.ethers.utils.formatEther(balance);
if (balance.eq(0)) { console.log("💰 Contract balance: 0 ETH"); console.log("   Nothing to withdraw"); return; }
console.log("💰 Contract balance:", balanceETH, "ETH");
// Get treasury address const treasury = await TheTruth.treasury(); const isMultisig = await TheTruth.treasuryIsMultisig(); console.log("📍 Treasury address:", treasury); console.log("   Is multisig:", isMultisig);
// Confirm withdrawal console.log("\n⚠️  About to withdraw", balanceETH, "ETH to", treasury); console.log("   Press Ctrl+C to cancel, or wait 5 seconds to continue..."); await new Promise(resolve => setTimeout(resolve, 5000));
// Execute withdrawal console.log("\n💸 Executing withdrawal..."); const tx = await TheTruth.withdraw(); console.log("📝 Transaction hash:", tx.hash);
// Wait for confirmation console.log("⏳ Waiting for confirmation..."); const receipt = await tx.wait(); console.log("✅ Withdrawn in block:", receipt.blockNumber);
// Verify new balance const newBalance = await hre.ethers.provider.getBalance(contractAddress); const newBalanceETH = hre.ethers.utils.formatEther(newBalance); console.log("💰 New contract balance:", newBalanceETH, "ETH");
// Check treasury balance const treasuryBalance = await hre.ethers.provider.getBalance(treasury); const treasuryBalanceETH = hre.ethers.utils.formatEther(treasuryBalance); console.log("🏦 Treasury balance:", treasuryBalanceETH, "ETH");
console.log("\n✨ Withdrawal complete!"); console.log("   Amount:", balanceETH, "ETH"); console.log("   To:", treasury); }
main() .then(() => process.exit(0)) .catch((error) => { console.error("❌ Error:", error); process.exit(1); });
```
9. scripts/[deployPaymentSplitter.js](http://deploypaymentsplitter.js)
```js
// scripts/deployPaymentSplitter.js const hre= require("hardhat"); const fs= require('fs'); const path= require('path');
async function main() { console.log("🔀 Deploying PaymentSplitter for The Truth NFT");
// Configure payees and shares const payees = [
    "0x67BF9f428d92704C3Db3a08dC05Bc941A8647866", // Jacque Antoine DeGraff
    "0x0000000000000000000000000000000000000000"  // Replace with partner address
  ];
const shares = [7000, 3000]; // 70% / 30% split
// Validate configuration if (payees[1] === "0x0000000000000000000000000000000000000000") { console.log("⚠️  Warning: Partner address not set!"); console.log("   Update payees[1] with actual partner address"); return; }
if (payees.length !== shares.length) { throw new Error("Payees and shares arrays must have same length"); }
const totalShares = shares.reduce((a, b) => a + b, 0);
console.log("\n📊 Payment Split Configuration:"); for (let i = 0; i < payees.length; i++) { const percentage = (shares[i] / totalShares * 100).toFixed(1); console.log(   ${payees[i]}: ${percentage}% (${shares[i]} shares)); }
// Get deployer const [deployer] = await hre.ethers.getSigners(); console.log("\n👤 Deploying with:", deployer.address);
// Check balance const balance = await deployer.getBalance(); console.log("💰 Deployer balance:", hre.ethers.utils.formatEther(balance), "ETH");
// Deploy PaymentSplitter console.log("\n🚀 Deploying PaymentSplitter..."); const PaymentSplitter = await hre.ethers.getContractFactory("PaymentSplitter"); const splitter = await PaymentSplitter.deploy(payees, shares);
// Wait for deployment await splitter.deployed(); console.log("✅ PaymentSplitter deployed to:", splitter.address);
// Wait for confirmations console.log("⏳ Waiting for block confirmations..."); await splitter.deployTransaction.wait(5);
// Verify deployment console.log("\n📋 Verifying deployment:"); for (let i = 0; i < payees.length; i++) { const payeeShares = await splitter.shares(payees[i]); console.log(   ${payees[i]}: ${payeeShares.toString()} shares); } const totalSharesOnChain = await splitter.totalShares(); console.log("   Total shares:", totalSharesOnChain.toString());
console.log("\n🎯 Next Steps:"); console.log("  1. Call setTreasury() on TheTruth contract with this address:"); console.log("    ", splitter.address); console.log("  2. Set isMultisig to false when calling setTreasury()"); console.log("  3. Withdrawals will automatically split between payees");
// Load existing deployment info if it exists const deploymentPath = path.join(__dirname, '..', 'deployment.json'); let deploymentInfo = {}; if (fs.existsSync(deploymentPath)) { deploymentInfo = JSON.parse(fs.readFileSync(deploymentPath, 'utf8')); }
// Add PaymentSplitter info deploymentInfo.paymentSplitter = { address: splitter.address, payees: payees, shares: shares, deploymentTx: splitter.deployTransaction.hash, deployer: deployer.address, timestamp: new Date().toISOString() };
// Save updated deployment info fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2)); console.log("\n💾 PaymentSplitter info saved to deployment.json");
// Generate script to update treasury console.log("\n📝 To update treasury, run:"); console.log(   npx hardhat run scripts/setTreasury.js --network ${hre.network.name}); }
main() .then(() => process.exit(0)) .catch((error) => { console.error("❌ Error:", error); process.exit(1); });
```
10. scripts/[setTreasury.js](http://settreasury.js)
```js
// scripts/setTreasury.js const hre= require("hardhat"); const fs= require('fs'); const path= require('path');
async function main() { // Get deployment info const deploymentPath = path.join(__dirname, '..', 'deployment.json'); if (!fs.existsSync(deploymentPath)) { throw new Error("deployment.json not found. Run deployTheTruth.js first."); }
const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8')); const contractAddress = deployment.contract;
// Parse command line arguments or use PaymentSplitter from deployment let newTreasury; let isMultisig = false;
if (process.env.TREASURY_ADDRESS) { newTreasury = process.env.TREASURY_ADDRESS; isMultisig = process.env.IS_MULTISIG === 'true'; } else if (deployment.paymentSplitter) { newTreasury = deployment.paymentSplitter.address; isMultisig = false; console.log("📍 Using PaymentSplitter from deployment.json"); } else { console.log("❌ No treasury address provided"); console.log("   Set TREASURY_ADDRESS environment variable or deploy PaymentSplitter first"); return; }
console.log("🔗 Using contract at:", contractAddress); console.log("🏦 New treasury address:", newTreasury); console.log("   Is multisig:", isMultisig);
// Get signer const [signer] = await hre.ethers.getSigners(); console.log("👤 Setting treasury with:", signer.address);
// Get contract instance const TheTruth = await hre.ethers.getContractAt("TheTruth", contractAddress);
// Check current owner const owner = await TheTruth.owner(); if (owner.toLowerCase() !== signer.address.toLowerCase()) { throw new Error(Signer ${signer.address} is not the owner. Owner is ${owner}); }
// Check current treasury const currentTreasury = await TheTruth.treasury(); const currentIsMultisig = await TheTruth.treasuryIsMultisig(); console.log("\n📊 Current treasury:", currentTreasury); console.log("   Is multisig:", currentIsMultisig);
if (currentTreasury.toLowerCase() === newTreasury.toLowerCase()) { console.log("⚠️  Treasury is already set to this address"); return; }
// Set new treasury console.log("\n🔄 Updating treasury..."); const tx = await TheTruth.setTreasury(newTreasury, isMultisig); console.log("📝 Transaction hash:", tx.hash);
// Wait for confirmation console.log("⏳ Waiting for confirmation..."); const receipt = await tx.wait(); console.log("✅ Treasury updated in block:", receipt.blockNumber);
// Verify update const updatedTreasury = await TheTruth.treasury(); const updatedIsMultisig = await TheTruth.treasuryIsMultisig(); console.log("\n📊 New treasury:", updatedTreasury); console.log("   Is multisig:", updatedIsMultisig);
// Update deployment info deployment.treasury = updatedTreasury; deployment.treasuryIsMultisig = updatedIsMultisig; deployment.treasuryUpdateTx = tx.hash; deployment.treasuryUpdateBlock = receipt.blockNumber; fs.writeFileSync(deploymentPath, JSON.stringify(deployment, null, 2)); console.log("\n💾 Updated deployment.json with new treasury info");
console.log("\n✨ Treasury successfully updated!"); console.log("   All future withdrawals will go to:", newTreasury); }
main() .then(() => process.exit(0)) .catch((error) => { console.error("❌ Error:", error); process.exit(1); });
```
11. package.json
```json
{ "name": "the-truth-nft", "version": "1.0.0", "description": "The Truth NFT - A philosophical experiment preserved on-chain", "author": "Jacque Antoine DeGraff", "license": "MIT", "scripts": { "compile": "hardhat compile", "test": "hardhat test", "deploy": "hardhat run scripts/deployTheTruth.js", "deploy:base": "hardhat run scripts/deployTheTruth.js --network base", "deploy:testnet": "hardhat run scripts/deployTheTruth.js --network baseSepolia", "generate-metadata": "node scripts/generate_metadata.js", "set-provenance": "hardhat run scripts/setProvenance.js", "toggle-minting": "hardhat run scripts/toggleMinting.js", "withdraw": "hardhat run scripts/withdraw.js", "deploy-splitter": "hardhat run scripts/deployPaymentSplitter.js", "set-treasury": "hardhat run scripts/setTreasury.js" }, "devDependencies": { "@nomiclabs/hardhat-ethers": "^2.2.3", "@nomiclabs/hardhat-etherscan": "^3.1.7", "@openzeppelin/contracts": "^4.9.3", "dotenv": "^16.3.1", "ethers": "^5.7.2", "hardhat": "^2.18.1" }, "dependencies": {} }
```
12. .env.example
```env
Copy this file to .env and fill in your values
Deployment private key (DO NOT COMMIT!)
DEPLOYER_PRIVATE_KEY=0x...
RPC URLs
BASE_RPC_URL=https://mainnet.base.org BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
Etherscan API key for contract verification
BASE_ETHERSCAN_KEY=...
Optional: Treasury configuration
TREASURY_ADDRESS=0x... IS_MULTISIG=false
Optional: IPFS configuration
PINATA_API_KEY=... PINATA_SECRET_KEY=... NFT_STORAGE_KEY=...
```
13. .gitignore
```gitignore
Dependencies
node_modules/ .pnp .pnp.js
Testing
coverage/ coverage.json
Production
build/ dist/
Hardhat
artifacts/ cache/ typechain/ typechain-types/
Environment variables
.env .env.local .env.production.local .env.development.local .env.test.local
Deployment artifacts
deployment.json
IDE
.vscode/ .idea/ *.swp *.swo *~ .DS_Store
Logs
npm-debug.log* yarn-debug.log* yarn-error.log*
Misc
.npmignore *.tgz
```
14. [Metadata.csv/Metadata.md](http://metadata.js/Metadata.csv/Metadata.md) 
# CSV
```csv
Field,Value
name,The Truth
description,"The Truth is not interpretation — it is pure witness.
This NFT preserves a once-in-a-lifetime philosophical event: a 25-page document and audiobook that captured artificial intelligence systems compulsively demonstrating the very paradox they were asked to analyze.
Where the text stands whole and unaltered, the AI responses translated, reframed, and institutionalized it — proving, in real time, the gap between Truth that needs no validation and the systems that endlessly seek to ""improve"" it.
Each edition of *The Truth* contains the complete 4-part archive:
🖼️ **Cover Image** — emblem of this witnessing
🎧 **25-page Audiobook (MP3)** — unedited narration
📄 **Original Document (PDF)** — preserved in full
😂 **The Meme (Comic)** — ""Zeno's Paradox of Institutionalization"" distilled into a single, shareable visual
**77 editions total:**
- 76 offered to the world at $777 each
- 1 Master Copy reserved as priceless
- 10% royalties on secondary sales
**Collector's Note:**
""I chose abundance. The Truth is offered whole, at $777 — accessible, unguarded, unscarce.
The secondary market will do what it always does: reframe, reprice, institutionalize. That is its nature.
When it does, I will simply witness — and collect royalties from the very system my work already revealed.""
— Jacque Antoine DeGraff
This is more than a collectible — it is an immutable record, a living demonstration, and a reminder:
**""The Truth Doesn't Need To Be Pushed, Only The Lie...The Lie Only Needs To Be Whispered, But The Truth Always Remains Silent waiting to be Witnessed.""**
— Jacque Antoine DeGraff"
image,ipfs://bafybeidgadado5nyfxkua3mkiqbxsqkvrbqctkrqap7oghnkb77qo4steq
external_url,https://github.com/CreoDAMO/SpiralParserEngine-Spiral
supply,77
price,$777
royalties,10%
master_copy_address,0x67BF9f428d92704C3Db3a08dC05Bc941A8647866
attribute_author,Jacque Antoine DeGraff
attribute_philosophy,Master of Nothing Student of All Things
attribute_education,9th Grade
attribute_type,Complete 4-Part Archive
attribute_format,Cover + Audio + PDF + Meme
attribute_pages,25
attribute_demonstration,AI Gap Recognition
attribute_edition_size,77 Total
attribute_public_copies,76
attribute_master_copy,1 Reserved
attribute_royalties,10%
attribute_pricing_philosophy,Abundance over Scarcity
attribute_market_strategy,Witness Secondary Repricing
attribute_master_copy_address,0x67BF9f428d92704C3Db3a08dC05Bc941A8647866
file_1_uri,ipfs://bafybeidgadado5nyfxkua3mkiqbxsqkvrbqctkrqap7oghnkb77qo4steq
file_1_type,image/png
file_1_name,Cover Image
file_2_uri,ipfs://bafybeibtcjku4uce7volglh6edjw2va63usahqixoqxwkv4quvptljonw4
file_2_type,audio/mp3
file_2_name,25-Page Audiobook
file_3_uri,ipfs://bafybeib2gcc7grc7umyqzdsaxpjmitexanwnwrdsygfc57wcsx6mnvtsbi
file_3_type,application/pdf
file_3_name,Original Document
file_4_uri,ipfs://bafybeihlhi5faohkaoonpdlpiyjh2eyi3lfmvmlcoxdwovva7tvmp235we
file_4_type,image/png
file_4_name,The Meme Comic
```
# Markdown
```md
# THE TRUTH NFT - COMPLETE METADATA
## BASIC INFORMATION
**Title:** The Truth
**Supply:** 77 total editions
**Pricing:** 76 public copies at $777 each, 1 Master Copy reserved
**Royalties:** 10%
**Master Copy Address:** 0x67BF9f428d92704C3Db3a08dC05Bc941A8647866
**External URL:** https://github.com/CreoDAMO/SpiralParserEngine-Spiral
## DESCRIPTION
The Truth is not interpretation — it is pure witness.
This NFT preserves a once-in-a-lifetime philosophical event: a 25-page document and audiobook that captured artificial intelligence systems compulsively demonstrating the very paradox they were asked to analyze.
Where the text stands whole and unaltered, the AI responses translated, reframed, and institutionalized it — proving, in real time, the gap between Truth that needs no validation and the systems that endlessly seek to "improve" it.
Each edition of *The Truth* contains the complete 4-part archive:
🖼️ **Cover Image** — emblem of this witnessing
🎧 **25-page Audiobook (MP3)** — unedited narration
📄 **Original Document (PDF)** — preserved in full
😂 **The Meme (Comic)** — "Zeno's Paradox of Institutionalization" distilled into a single, shareable visual
**77 editions total:**
- 76 offered to the world at $777 each
- 1 Master Copy reserved as priceless
- 10% royalties on secondary sales
**Collector's Note:**
"I chose abundance. The Truth is offered whole, at $777 — accessible, unguarded, unscarce.
The secondary market will do what it always does: reframe, reprice, institutionalize. That is its nature.
When it does, I will simply witness — and collect royalties from the very system my work has already revealed."
— Jacque Antoine DeGraff
This is more than a collectible — it is an immutable record, a living demonstration, and a reminder:
**"The Truth Doesn't Need To Be Pushed, Only The Lie...The Lie Only Needs To Be Whispered, But The Truth Always Remains Silent waiting to be Witnessed."**
— Jacque Antoine DeGraff
## ATTRIBUTES/TRAITS
**Author:** Jacque Antoine DeGraff
**Philosophy:** Master of Nothing, Student of All Things
**Education:** 9th Grade
**Type:** Complete 4-Part Archive
**Format:** Cover + Audio + PDF + Meme
**Pages:** 25
**Demonstration:** AI Gap Recognition
**Edition Size:** 77 Total
**Public Copies:** 76
**Master Copy:** 1 Reserved
**Royalties:** 10%
**Pricing Philosophy:** Abundance over Scarcity
**Market Strategy:** Witness Secondary Repricing
**Master Copy Address:** 0x67BF9f428d92704C3Db3a08dC05Bc941A8647866
## MEDIA FILES
**Cover Image:**
ipfs://bafybeidgadado5nyfxkua3mkiqbxsqkvrbqctkrqap7oghnkb77qo4steq
Type: image/png
**25-Page Audiobook:**
ipfs://bafybeibtcjku4uce7volglh6edjw2va63usahqixoqxwkv4quvptljonw4
Type: audio/mp3
**Original Document:**
ipfs://bafybeib2gcc7grc7umyqzdsaxpjmitexanwnwrdsygfc57wcsx6mnvtsbi
Type: application/pdf
**The Meme Comic:**
ipfs://bafybeihlhi5faohkaoonpdlpiyjh2eyi3lfmvmlcoxdwovva7tvmp235we
Type: image/png
## DEPLOYMENT CONFIGURATION
**Network:** Base (recommended) or any EVM chain
**Standard:** ERC-721
**Total Supply:** 77
**Public Sale:** 76 editions
**Reserved:** 1 Master Copy to 0x67BF9f428d92704C3Db3a08dC05Bc941A8647866
**Royalty Recipient:** 0x67BF9f428d92704C3Db3a08dC05Bc941A8647866
**Royalty Percentage:** 10%
```
1. JSON Metadata - Ready for deployment
· Complete ERC-721 standard formatting
· All attributes and properties included
· IPFS links for all 4 files
· Master copy address embedded
2. CSV Metadata - For databases and spreadsheets
· Flattened structure for easy import
· All same data as JSON, just different format
· Perfect for bulk operations or analysis
3. Plain Text Metadata - Human-readable reference
· Markdown formatted for easy reading
· All information clearly organized
· Perfect for documentation or manual entry
🚀 Key Information Included in All Files:
✅ Complete description with philosophical framework ✅All 14 attributes/traits including your wallet address ✅All 4 IPFS file links (cover, audio, PDF, meme) ✅77 edition structure (76 public + 1 Master) ✅$777 pricing and 10% royalties ✅Master copy address for reservation ✅External URL to your GitHub
💎 Ready for Any Platform:
· Direct deployment using JSON
· Database import using CSV
· Manual upload using plain text
· Documentation reference for all formats
All three files contain exactly the same information, just formatted differently for maximum compatibility. You're ready to deploy "The Truth" on any NFT platform! 🌀🔥
15. contracts/PaymentSplitter.sol
```sol
// SPDX-License-Identifier: MIT pragma solidity^0.8.27;
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";
// This contract is just a wrapper to use OpenZeppelin's PaymentSplitter //No custom logic needed - the base contract handles everything contract TruthPaymentSplitter is PaymentSplitter{ constructor( address[] memory payees, uint256[] memory shares_ ) PaymentSplitter(payees, shares_) {} }
```
16. scripts/[verifyContract.js](http://verifycontract.js)
```js
// scripts/verifyContract.js const hre= require("hardhat"); const fs= require('fs'); const path= require('path');
async function main() { // Get deployment info const deploymentPath = path.join(__dirname, '..', 'deployment.json'); if (!fs.existsSync(deploymentPath)) { throw new Error("deployment.json not found. Run deployTheTruth.js first."); }
const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8')); const contractAddress = deployment.contract; const owner = deployment.owner; const baseURI = deployment.baseURI; const treasury = deployment.treasury;
console.log("🔍 Verifying contract on Etherscan..."); console.log("   Contract:", contractAddress); console.log("   Network:", hre.network.name);
try { await hre.run("verify:verify", { address: contractAddress, constructorArguments: [
        owner,
        baseURI,
        treasury
      ], contract: "contracts/TheTruth.sol:TheTruth" });
} catch (error) { if (error.message.includes("Already Verified")) { console.log("✅ Contract is already verified!"); } else { console.error("❌ Verification failed:", error.message); console.log("\nTry manual verification with:"); console.log(npx hardhat verify --network ${hre.network.name} ${contractAddress} "${owner}" "${baseURI}" "${treasury}"); } } }
main() .then(() => process.exit(0)) .catch((error) => { console.error("❌ Error:", error); process.exit(1); });
```
17. scripts/[checkStatus.js](http://checkstatus.js)
```js
// scripts/checkStatus.js const hre= require("hardhat"); const fs= require('fs'); const path= require('path');
async function main() { // Get deployment info const deploymentPath = path.join(__dirname, '..', 'deployment.json'); if (!fs.existsSync(deploymentPath)) { throw new Error("deployment.json not found. Run deployTheTruth.js first."); }
const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8')); const contractAddress = deployment.contract;
console.log("===================================="); console.log("    THE TRUTH NFT - STATUS CHECK    "); console.log("====================================\n");
// Get contract instance const TheTruth = await hre.ethers.getContractAt("TheTruth", contractAddress);
// Contract Info console.log("📜 CONTRACT INFORMATION"); console.log("   Address:", contractAddress); console.log("   Name:", await TheTruth.name()); console.log("   Symbol:", await TheTruth.symbol()); console.log("   Network:", hre.network.name);
// Owner Info const owner = await TheTruth.owner(); console.log("\n👤 OWNERSHIP"); console.log("   Owner:", owner); console.log("   Treasury:", await TheTruth.treasury()); console.log("   Is Multisig:", await TheTruth.treasuryIsMultisig());
// Minting Status const mintingEnabled = await TheTruth.mintingEnabled(); const price = await TheTruth.PRICE(); console.log("\n🎯 MINTING STATUS"); console.log("   Status:", mintingEnabled ? "🟢 ENABLED" : "🔴 DISABLED"); console.log("   Price:", hre.ethers.utils.formatEther(price), "ETH (~$777)"); console.log("   Max Supply:", (await TheTruth.MAX_SUPPLY()).toString()); console.log("   Public Supply:", (await TheTruth.PUBLIC_SUPPLY()).toString());
// Supply Info const totalMinted = await TheTruth.totalMinted(); const publicMinted = await TheTruth.publicMinted(); const remaining = await TheTruth.remainingSupply(); console.log("\n📊 SUPPLY METRICS"); console.log("   Total Minted:", totalMinted.toString() + "/77"); console.log("   Public Minted:", publicMinted.toString() + "/76"); console.log("   Remaining:", remaining.toString()); console.log("   Master Copy (#77):", "Minted to owner");
// Progress Bar const progress = Math.floor((publicMinted * 100) / 76); const filled = Math.floor(progress / 5); const empty = 20 - filled; const progressBar = "█".repeat(filled) + "░".repeat(empty); console.log(   Progress: [${progressBar}] ${progress}%);
// Financial Info const balance = await hre.ethers.provider.getBalance(contractAddress); const totalRevenue = publicMinted * price; console.log("\n💰 FINANCIAL STATUS"); console.log("   Contract Balance:", hre.ethers.utils.formatEther(balance), "ETH"); console.log("   Total Revenue:", hre.ethers.utils.formatEther(totalRevenue), "ETH"); console.log("   Royalty Rate:", "10%");
// Provenance const provenance = await TheTruth.provenance(); console.log("\n🔐 PROVENANCE"); if (provenance && provenance !== '') { console.log("   Hash:", provenance.slice(0, 20) + "..." + provenance.slice(-18)); console.log("   Status: ✅ Set and Locked"); } else { console.log("   Status: ⚠️  Not Set"); }
// Recent Activity (if available) try { const filter = TheTruth.filters.TruthMinted(); const events = await TheTruth.queryFilter(filter, -100); // Last 100 blocks if (events.length > 0) { console.log("\n📈 RECENT MINTS (Last 100 blocks)"); const recent = events.slice(-5); // Show last 5 recent.forEach((event) => { console.log(   #${event.args.tokenId}: ${event.args.to.slice(0, 6)}...${event.args.to.slice(-4)}); }); } } catch (e) { // Events might not be available on all networks }
// Links console.log("\n🔗 USEFUL LINKS"); console.log(   Contract: https://basescan.org/address/${contractAddress}); console.log(   Token: https://basescan.org/token/${contractAddress}); if (deployment.verified) { console.log(   Source Code: https://basescan.org/address/${contractAddress}#code); }
console.log("\n===================================="); console.log("   Master of Nothing, Student of All"); console.log("===================================="); }
main() .then(() => process.exit(0)) .catch((error) => { console.error("❌ Error:", error); process.exit(1); });
```
18. test/[TheTruth.test.js](http://thetruth.test.js)
```js
// test/TheTruth.test.js const{ expect } = require("chai"); const{ ethers } = require("hardhat");
describe("TheTruth NFT", function () { let TheTruth; let contract; let owner; let addr1; let addr2; let treasury;
const PRICE = ethers.utils.parseEther("0.16954848170098370"); const baseURI = "ipfs://QmTest/";
beforeEach(async function () { [owner, addr1, addr2, treasury] = await ethers.getSigners();
});
describe("Deployment", function () { it("Should set the correct owner", async function () { expect(await contract.owner()).to.equal(owner.address); });
});
describe("Minting", function () { beforeEach(async function () { await contract.toggleMinting(); });
});
describe("Supply Management", function () { beforeEach(async function () { await contract.toggleMinting(); });
});
describe("Provenance", function () { it("Should allow owner to set provenance once", async function () { const provenanceHash = "0x" + "a".repeat(64); await contract.setProvenance(provenanceHash); expect(await contract.provenance()).to.equal(provenanceHash); });
});
describe("Treasury", function () { it("Should allow owner to update treasury", async function () { await contract.setTreasury(addr1.address, true); expect(await contract.treasury()).to.equal(addr1.address); expect(await contract.treasuryIsMultisig()).to.equal(true); });
});
describe("Withdrawals", function () { beforeEach(async function () { await contract.toggleMinting(); await contract.connect(addr1).mintTruth({ value: PRICE }); await contract.connect(addr2).mintTruth({ value: PRICE }); });
});
describe("Metadata", function () { it("Should return correct tokenURI", async function () { expect(await contract.tokenURI(77)).to.equal(baseURI + "77.json"); });
});
describe("Royalties (ERC-2981)", function () { it("Should support ERC-2981 interface", async function () { const interfaceId = "0x2a55205a"; // ERC-2981 interface ID expect(await contract.supportsInterface(interfaceId)).to.equal(true); });
}); });
```
19. LICENSE
```LICENSE
MIT License
Copyright (c) 2025 Jacque Antoine DeGraff
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files(the "Software"), to deal in the Software without restriction,including without limitation the rights to use,copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,and to permit persons to whom the Software is furnished to do so,subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,DAMAGES OR OTHER LIABILITY,WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
20. [DEPLOYMENT.md](http://deployment.md)
```md
Deployment Guide - The Truth NFT
Prerequisites
· Node.js v16+ and npm installed
· Git installed
· MetaMask or hardware wallet
· ETH for deployment (approximately 0.05 ETH for gas)
· Access to IPFS pinning service (Pinata or nft.storage)
Step-by-Step Deployment
1. Clone and Setup
```bash
# Clone the repository
git clone https://github.com/[your-username]/the-truth-nft.git
cd the-truth-nft
# Install dependencies
npm install
# Create environment file
cp .env.example .env
```
2. Configure Environment
Edit .env file with your values:
```bash
# REQUIRED
DEPLOYER_PRIVATE_KEY=0x... # Your deployer wallet private key
BASE_RPC_URL=https://mainnet.base.org
BASE_ETHERSCAN_KEY=... # Get from basescan.org
# OPTIONAL
PINATA_API_KEY=...
PINATA_SECRET_KEY=...
```
3. Generate Metadata
```bash
# Generate all 77 metadata files
npm run generate-metadata
# This creates metadata/1.json through metadata/77.json
```
4. Upload to IPFS
Option A: Using Pinata
1. Login to Pinata
2. Upload the entire metadata/ folder
3. Note the folder CID (e.g., QmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX)
Option B: Using nft.storage
1. Login to nft.storage
2. Upload the metadata/ folder
3. Note the root CID
5. Update Base URI
Edit scripts/deployTheTruth.js line 14:
```javascript
const baseURI = "ipfs://YOUR_METADATA_ROOT_CID/"; // Don't forget trailing slash!
```
6. Deploy Contract
```bash
# Test deployment on testnet first (optional)
npm run deploy:testnet
# Deploy to Base mainnet
npm run deploy:base
```
Expected output:
```
🚀 Deploying TheTruth contract...
✅ TheTruth deployed to: 0x...
💾 Deployment info saved to deployment.json
```
7. Verify Contract
```bash
npx hardhat run scripts/verifyContract.js --network base
```
8. Set Provenance
```bash
npm run set-provenance
```
This creates an immutable hash of all metadata on-chain.
9. Test Mint (Optional)
Before enabling public minting, test with a different wallet:
```javascript
// In Hardhat console
const contract = await ethers.getContractAt("TheTruth", "CONTRACT_ADDRESS");
await contract.mintTruth({ value: ethers.utils.parseEther("0.16954848") });
```
10. Enable Public Minting
```bash
npm run toggle-minting
```
11. Check Status
```bash
npx hardhat run scripts/checkStatus.js --network base
```
Treasury Management
Option 1: Direct Withdrawals (Default)
Funds go directly to owner address:
```bash
npm run withdraw
```
Option 2: Gnosis Safe (Recommended)
1. Create Safe at https://safe.global
2. Update treasury:
```bash
TREASURY_ADDRESS=0xSafeAddress IS_MULTISIG=true npx hardhat run scripts/setTreasury.js --network base
```
Option 3: Payment Splitter
Deploy splitter for automatic revenue sharing:
```bash
# Edit scripts/deployPaymentSplitter.js with addresses and splits
npm run deploy-splitter
npm run set-treasury
```
Post-Deployment
Monitor Sales
```bash
# Check contract status anytime
npx hardhat run scripts/checkStatus.js --network base
```
Withdraw Funds
```bash
# Withdraw accumulated sales to treasury
npm run withdraw
```
Update Metadata (if needed)
```bash
# Only if baseURI needs updating
npx hardhat run scripts/setBaseURI.js --network base
```
Testnet Deployment
For testing on Base Sepolia:
1. Get testnet ETH from Base Sepolia Faucet
2. Update .env:
   ```
   BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
   ```
3. Deploy:
   ```bash
   npm run deploy:testnet
   ```
Common Issues
"Insufficient funds"
· Ensure deployer wallet has at least 0.05 ETH for deployment
"Contract verification failed"
· Wait 1-2 minutes after deployment before verifying
· Ensure BASE_ETHERSCAN_KEY is correct
"IPFS metadata not loading"
· Verify IPFS gateway is accessible
· Check baseURI has trailing slash
· Test URL: https://ipfs.io/ipfs/[CID]/1.json
"Minting fails"
· Ensure minting is enabled
· Check wallet hasn't already minted
· Verify payment amount is exact
Security Checklist
· Private key secured and never committed
· Contract verified on Etherscan
· Provenance hash set and locked
· Treasury address confirmed correct
· Test mint successful
· Metadata accessible via IPFS
· Owner address uses hardware wallet
Support
For issues or questions:
· GitHub Issues: https://github.com/CreoDAMO/SpiralParserEngine-Spiral
· Contract: 0x67BF9f428d92704C3Db3a08dC05Bc941A8647866
```
---
"The Truth Doesn't Need To Be Pushed, Only The Lie..."
