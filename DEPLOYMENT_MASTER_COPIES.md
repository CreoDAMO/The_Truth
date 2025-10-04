# Master Copy Deployment Guide

## Understanding Master Copies

Each Truth NFT collection reserves one **master copy** that is automatically minted to the founder wallet during contract deployment. These are **priceless, never-for-sale copies** that represent the original work.

---

## Master Copy System

### The Truth NFT
- **Total Supply**: 77 editions
- **Public Supply**: 76 editions (IDs #1-#76, mintable by public)
- **Master Copy**: #77 (auto-minted to founder)
- **Price**: 0.169 ETH (~$777 USD)
- **Status**: Priceless - Not For Sale

### Bonus Gift NFT
- **Total Supply**: 145,000 editions
- **Public Supply**: 144,000 editions (IDs #1-#144000, mintable by public)
- **Master Copy**: #145000 (auto-minted to founder)
- **Price**: 0.039 ETH (~$145 USD)
- **Status**: Priceless - Not For Sale

### Part Three NFT
- **Total Supply**: 444 editions
- **Public Supply**: 443 editions (IDs #1-#443, mintable by public)
- **Master Copy**: #444 (auto-minted to founder)
- **Price**: 0.478 ETH (~$1,777 USD)
- **Status**: Priceless - Not For Sale

---

## Automatic Minting Process

**IMPORTANT**: Master copies are **automatically minted** in the contract constructor. You do NOT need to manually mint them.

### Smart Contract Code

```solidity
// TheTruth.sol constructor
constructor(
    address initialOwner,
    string memory baseURI,
    address initialTreasury
) ERC721("The Truth", "TRUTH") Ownable(initialOwner) {
    _baseTokenURI = baseURI;
    _setDefaultRoyalty(initialOwner, 1000); // 10% royalties
    treasury = initialTreasury;
    
    // Master copy #77 automatically minted here
    _safeMint(initialOwner, MASTER_COPY_ID);
    emit TruthMinted(initialOwner, MASTER_COPY_ID);
}
```

---

## Deployment Steps

### 1. Prepare Metadata
```bash
# Generate metadata for all editions (including master copies)
node scripts/generate_metadata.js

# Upload to IPFS via Pinata
# Save the root CID for deployment
```

### 2. Update Deployment Scripts

Edit `scripts/deployTheTruth.js`:
```javascript
const initialOwner = "0x67BF9f428d92704C3Db3a08dC05Bc941A8647866"; // Your address
const baseURI = "ipfs://YOUR_METADATA_ROOT_CID/"; // Your Pinata CID
const treasury = initialOwner; // Or multisig address
```

### 3. Deploy The Truth NFT
```bash
# Make sure you have ETH on Base mainnet for gas
npx hardhat run scripts/deployTheTruth.js --network base

# Expected output:
# ✅ TheTruth deployed to: 0x...
# Master Copy Owner: 0x67BF9f428d92704C3Db3a08dC05Bc941A8647866
# Total Supply: 1 (just the master copy initially)
```

**Note**: Deployment scripts for TruthBonusGift and TruthPartThree need to be created based on deployTheTruth.js template.

### 4. Verify Deployment
```bash
npx hardhat verify --network base CONTRACT_ADDRESS \
  "0x67BF9f428d92704C3Db3a08dC05Bc941A8647866" \
  "ipfs://YOUR_CID/" \
  "0x67BF9f428d92704C3Db3a08dC05Bc941A8647866"
```

### 5. Check Your Wallet
Visit Opensea or Basescan and verify you own:
- The Truth #77/77

### 6. Repeat for Other Collections
```bash
# Deploy Bonus Gift (you'll receive #145000)
npx hardhat run scripts/deployTruthBonusGift.js --network base

# Deploy Part Three (you'll receive #444)
npx hardhat run scripts/deployTruthPartThree.js --network base
```

---

## Master Copy Privileges

As the owner of the master copies, you have:

### 1. Exclusive Ownership
- Only wallet to hold #77, #145000, and #444
- Visible across all NFT platforms (OpenSea, Blur, etc.)
- Metadata clearly marks as "Master Copy - Priceless"

### 2. Contract Control (via Ownable)
```solidity
// Only you can call these functions:
function toggleMinting() external onlyOwner
function setBaseURI(string calldata newBaseURI) external onlyOwner
function setProvenance(string calldata prov) external onlyOwner
function setTreasury(address _treasury, bool _isMultisig) external onlyOwner
function withdraw() external onlyOwner
```

### 3. Royalty Rights
- 10% royalties on ALL secondary sales (ERC-2981)
- Applies to all 77 + 145,000 + 444 editions
- Perpetual income stream

### 4. Provenance Authority
- Master copies linked to Trust Deed
- Legal proof of authorship
- Foundation for IP licensing

---

## Post-Deployment Checklist

### Immediate Actions
- [ ] Verify master copy ownership on Basescan
- [ ] Check metadata display on OpenSea
- [ ] Set provenance hash (one-time, irreversible)
- [ ] Test minting from different wallet
- [ ] Enable public minting (toggleMinting)

### Configuration
- [ ] Update frontend with contract addresses
- [ ] Configure Stripe webhook for fiat payments
- [ ] Set up Coinbase Commerce (if using)
- [ ] Configure treasury (direct, multisig, or payment splitter)

### Marketing
- [ ] Announce deployment on Twitter
- [ ] Share contract addresses on Discord
- [ ] Update website with live minting links
- [ ] Enable OpenSea collection verification

---

## Troubleshooting

### Issue: Master copy not appearing in wallet
**Solution**: Check Basescan - it may take 5-10 minutes for OpenSea to index. Force refresh your metadata on OpenSea.

### Issue: Wrong owner received master copy
**Solution**: Double-check `initialOwner` parameter in deployment script. This is set at deployment and cannot be changed for the master copy.

### Issue: Public can mint master copy IDs
**Solution**: This is impossible - master copies are pre-minted in constructor. Public minting starts at ID #1 and stops before master copy ID.

### Issue: Want to transfer master copy
**Solution**: As owner, you can transfer like any NFT. However, this represents loss of provenance authority. Consider trust/legal implications first.

---

## Security Considerations

### Private Key Management
- **CRITICAL**: Master copy wallet private key = your entire IP
- Use hardware wallet (Ledger/Trezor) for founder address
- Consider multisig for ultimate security
- NEVER share private key or seed phrase

### Contract Ownership
- Owner address cannot be changed after deployment
- If using multisig, test thoroughly on testnet first
- Consider timelock for added security
- Document all admin actions in Treasury Resolution

### Provenance Protection
- Once provenance hash is set, it's PERMANENT
- Master copy ownership proves authorship
- Trust Deed legally binds provenance to NFTs
- Keep backup of all master files offline

---

## Legal Integration

### Trust Deed
Master copies are corpus of **The Truth Provenance Trust**:
- Asset held for benefit of all holders
- Trustee duties documented
- Succession plan in place
- See `LAW/TRUST_DEED_PROVENANCE.md`

### Blackpaper
Master copies establish foundation-first legal structure:
- Choses in action (Black's Law Dictionary)
- Provenance as trust corpus
- Admin keys as agency
- See `LAW/BLACKPAPER.md`

### Treasury Resolution
All admin actions (owner functions) require:
- Corporate resolution (off-chain)
- Multisig execution (on-chain)
- Notarized record
- QCHAIN event log

---

## Metadata Example: Master Copy

```json
{
  "name": "The Truth #77/77 - Master Copy",
  "description": "The Master Copy, edition 77 of 77, reserved by the author and not for sale.",
  "image": "ipfs://bafybeidgadado5nyfxkua3mkiqbxsqkvrbqctkrqap7oghnkb77qo4steq",
  "attributes": [
    { "trait_type": "Edition", "value": "77/77 - Master Copy" },
    { "trait_type": "Status", "value": "Priceless - Never For Sale" },
    { "trait_type": "Master Copy Address", "value": "0x67BF9f428d92704C3Db3a08dC05Bc941A8647866" }
  ]
}
```

---

## Summary

**You DO NOT need to manually mint master copies.**

When you deploy each contract with your address as `initialOwner`:
1. Contract deploys to Base mainnet
2. Constructor executes automatically
3. Master copy mints to your wallet instantly
4. You can immediately see it on Basescan
5. Public minting remains disabled until you enable it

**Next Steps:**
1. Deploy contracts to Base mainnet
2. Verify ownership of master copies
3. Set provenance hash
4. Enable public minting
5. Apply for Coinbase grants!

---

*The Truth doesn't need to be pushed, only witnessed.*  
*— Jacque Antoine DeGraff*
