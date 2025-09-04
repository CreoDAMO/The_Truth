
# The Truth NFT - Deployment Checklist

## Pre-Deployment Setup ✅

### 1. IPFS Assets (Pinata Group: 477dfcab-ef52-4227-96f2-f9588c6294d4)
- [ ] Upload cover image to Pinata
- [ ] Upload 25-page audiobook (MP3) to Pinata  
- [ ] Upload original document (PDF) to Pinata
- [ ] Upload meme comic to Pinata
- [ ] Update `scripts/generate_metadata.js` with actual IPFS CIDs
- [ ] Generate metadata: `npm run generate-metadata`
- [ ] Upload metadata/ folder to Pinata
- [ ] Get metadata root CID for contract baseURI

### 2. Network Configuration
- [ ] Confirm deployment network (Base recommended)
- [ ] Ensure wallet has sufficient ETH for deployment (~0.05 ETH)
- [ ] Update `hardhat.config.js` with correct network settings

## Contract Deployment 🚀

### 3. Deploy Main Contracts
```bash
# Deploy The Truth NFT (77 editions)
npm run deploy:truth

# Deploy Bonus Gift NFT (145,000 editions) 
npm run deploy:bonus

# Deploy Part Three NFT (444 editions)
npm run deploy:part-three

# Deploy Payment Splitter (if using multi-recipient payments)
npm run deploy:splitter
```

### 4. Post-Deployment Configuration
- [ ] Update contract addresses in `scripts/update-contract-addresses.js`
- [ ] Run: `node scripts/update-contract-addresses.js --update`
- [ ] Set provenance hash: `npm run set-provenance`
- [ ] Enable minting: `npm run toggle-minting`
- [ ] Test mint from different wallet
- [ ] Verify contracts on block explorer

## Web App Deployment 🌐

### 5. Update Web Interface
- [ ] Verify contract addresses in `web/contract-config.js`
- [ ] Test wallet connection
- [ ] Test minting functionality
- [ ] Deploy to GitHub Pages: Use existing workflow

### 6. Final Verification
- [ ] All contracts deployed and verified ✅
- [ ] Metadata uploaded to IPFS ✅  
- [ ] Web app shows correct contract status ✅
- [ ] Minting works end-to-end ✅
- [ ] Royalties configured (10%) ✅
- [ ] Master Copy reserved to correct address ✅

## Contract Addresses (Update After Deployment)

```
TheTruth: 0x...
TruthBonusGift: 0x... 
TruthPartThree: 0x...
PaymentSplitter: 0x...
TruthToken: 0x8f6cf6f7747e170f4768533b869c339dc3d30a3c ✅
CreatorToken: 0x22b0434e89882f8e6841d340b28427646c015aa7 ✅
```

## Pinata IPFS Group
Group ID: 477dfcab-ef52-4227-96f2-f9588c6294d4
URL: https://app.pinata.cloud/ipfs/groups/477dfcab-ef52-4227-96f2-f9588c6294d4

## Quick Deploy Commands
```bash
# Generate and deploy everything
npm run generate-metadata
npm run deploy:all
npm run update-addresses
npm run deploy:web
```

---
**Next Step:** Upload your assets to the Pinata group and update the IPFS CIDs in `scripts/generate_metadata.js`
