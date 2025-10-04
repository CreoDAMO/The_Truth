# MASTER COPY DEPLOYMENT GUIDE

## Overview

Each NFT collection in The Truth ecosystem includes a Master Copy that is automatically minted to the founder wallet during contract deployment. This is a **priceless, never-for-sale** token that serves as the canonical reference.

## Founder Wallet

**Address:** `0x67BF9f428d92704C3Db3a08dC05Bc941A8647866`

All master copies are automatically sent to this address during deployment.

## Master Copy Token IDs

| Collection | Master Copy ID | Auto-Mint on Deploy |
|------------|---------------|---------------------|
| The Truth | #77 | ✅ Yes |
| Bonus Gift | #145,000 | ✅ Yes |
| Part Three (Blackpaper) | #444 | ✅ Yes |

## How Auto-Minting Works

### The Truth Contract (TheTruth.sol)

```solidity
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
```

**Key Points:**
- Master copy #77 is minted in the constructor
- No separate minting transaction required
- Appears in founder wallet immediately after deployment
- Cannot be changed or removed

### Bonus Gift Contract (TruthBonusGift.sol)

```solidity
constructor(
    address initialOwner,
    string memory baseURI,
    address initialTreasury
) ERC721("The Truth - Bonus Gift", "BONUS") Ownable(initialOwner) {
    _baseTokenURI = baseURI;
    _setDefaultRoyalty(initialOwner, 1000); // 10%
    treasury = initialTreasury;

    // Mint master copy #145000 to owner
    _safeMint(initialOwner, MASTER_COPY_ID);
    emit BonusGiftMinted(initialOwner, MASTER_COPY_ID, 1);
}
```

### Part Three Contract (TruthPartThree.sol)

```solidity
constructor(
    address initialOwner,
    string memory baseURI,
    address initialTreasury
) ERC721("The Truth Part Three - Applying The Laws", "LAWS") Ownable(initialOwner) {
    _baseTokenURI = baseURI;
    _setDefaultRoyalty(initialOwner, 1000); // 10%
    treasury = initialTreasury;

    // Mint master copy #444 to owner
    _safeMint(initialOwner, MASTER_COPY_ID);
    emit BlackpaperMinted(initialOwner, MASTER_COPY_ID);
    emit LegalFoundationWitnessed(initialOwner, MASTER_COPY_ID);
}
```

## Deployment Checklist

### Pre-Deployment Verification

Run the verification script:
```bash
npm run verify-deployment
```

This checks:
- ✅ Contracts compiled
- ✅ Metadata generated (77+ JSON files)
- ✅ Artifacts compiled for browser
- ✅ IPFS assets configured
- ✅ Configuration files present

### Deployment Steps

1. **Ensure Base Mainnet ETH**
   - Founder wallet needs ~0.02 ETH for deployment gas

2. **Set Environment Variables**
   ```
   PRIVATE_KEY=your_private_key_here
   BASESCAN_API_KEY=your_basescan_key_here
   ```

3. **Deploy The Truth**
   ```bash
   npx hardhat run scripts/deployTheTruth.js --network base
   ```
   - Master copy #77 auto-mints to 0x67BF9f428d92704C3Db3a08dC05Bc941A8647866
   - Contract address saved to deployment.json

4. **Deploy Bonus Gift**
   ```bash
   npx hardhat run scripts/deployBonusGift.js --network base
   ```
   - Master copy #145,000 auto-mints to founder wallet

5. **Deploy Part Three**
   ```bash
   npx hardhat run scripts/deployPartThree.js --network base
   ```
   - Master copy #444 auto-mints to founder wallet

### Post-Deployment Verification

1. **Check BaseScan**
   - Verify master copies appear in founder wallet
   - Confirm token IDs: #77, #145000, #444

2. **Set Provenance Hash**
   ```bash
   npx hardhat run scripts/setProvenance.js --network base
   ```

3. **Verify Contracts on BaseScan**
   ```bash
   npx hardhat verify --network base <contract_address> "0x67BF9f428d92704C3Db3a08dC05Bc941A8647866" "ipfs://YOUR_METADATA_CID/" "0x67BF9f428d92704C3Db3a08dC05Bc941A8647866"
   ```

## Legal Framework

### Trust Structure

Master copies are held in irrevocable trust as documented in `/LAW/TRUST_DEED_PROVENANCE.md`:

- **Settlor:** Jacque Antoine DeGraff
- **Beneficiaries:** The Truth ecosystem holders (as a class)
- **Purpose:** Preservation and controlled licensing in perpetuity

### Status

- **Priceless:** Never offered for sale
- **Canonical:** Serves as reference for all public editions
- **Immutable:** Cannot be burned or transferred from trust
- **Royalty Source:** 10% royalties flow to founder wallet

## Monitoring

After deployment, you can verify master copies at:

- **The Truth #77:** https://basescan.org/token/[CONTRACT_ADDRESS]?a=77
- **Bonus Gift #145000:** https://basescan.org/token/[CONTRACT_ADDRESS]?a=145000
- **Part Three #444:** https://basescan.org/token/[CONTRACT_ADDRESS]?a=444

All should show owner as: `0x67BF9f428d92704C3Db3a08dC05Bc941A8647866`

## Troubleshooting

**Q: Master copy didn't mint?**
A: Check the deployment transaction on BaseScan. The Transfer event should show minting to founder wallet in the constructor.

**Q: Can I mint the master copy separately?**
A: No. It's hardcoded in the constructor and automatically mints on deployment.

**Q: What if I want to change the master copy ID?**
A: The ID is a constant in the contract and cannot be changed after deployment. Deploy a new contract if needed.

## Summary

✅ Master copies auto-mint during deployment
✅ No separate minting transaction required  
✅ All master copies go to 0x67BF9f428d92704C3Db3a08dC05Bc941A8647866
✅ Priceless tokens held in irrevocable trust
✅ Serve as canonical reference for public editions

**Next Step:** When ready, deploy to Base mainnet using the commands above.