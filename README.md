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
│   ├── TheTruth.sol
│   └── PaymentSplitter.sol
├── scripts/
│   ├── generate_metadata.js
│   ├── deployTheTruth.js
│   ├── setProvenance.js
│   ├── toggleMinting.js
│   ├── withdraw.js
│   ├── deployPaymentSplitter.js
│   ├── setTreasury.js
│   ├── verifyContract.js
│   └── checkStatus.js
├── test/
│   └── TheTruth.test.js
├── metadata/
│   ├── 1.json through 77.json (generated)
│   ├── metadata.csv
│   └── metadata.md
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

---
