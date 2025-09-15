// Contract Configuration for The Truth NFT Ecosystem
const TRUTH_CONTRACTS = {
    NETWORK: {
        name: 'Base',
        chainId: 8453,
        rpcUrl: 'https://mainnet.base.org',
        explorerUrl: 'https://basescan.org'
    },
    ADDRESSES: {
        // Already deployed tokens
        TruthToken: '0x8f6cf6f7747e170f4768533b869c339dc3d30a3c',
        CreatorToken: '0x22b0434e89882f8e6841d340b28427646c015aa7',

        // NFT contracts to be deployed
        TheTruth: '0x...',
        TruthBonusGift: '0x...',
        TruthPartThree: '0x...',
        PaymentSplitter: '0x...'
    },
    ABI: {
        ERC20: [
            "function balanceOf(address) view returns (uint256)",
            "function totalSupply() view returns (uint256)",
            "function symbol() view returns (string)",
            "function name() view returns (string)",
            "function decimals() view returns (uint8)"
        ],
        TheTruth: [
            "function mintTruth() external payable",
            "function PRICE() view returns (uint256)",
            "function mintingEnabled() view returns (bool)",
            "function totalMinted() view returns (uint256)",
            "function MAX_SUPPLY() view returns (uint256)",
            "function PUBLIC_SUPPLY() view returns (uint256)",
            "function owner() view returns (address)",
            "function treasury() view returns (address)"
        ],
        TruthBonusGift: [
            "function mintBonusGift(uint256 quantity) external payable",
            "function PRICE() view returns (uint256)",
            "function mintingEnabled() view returns (bool)",
            "function totalMinted() view returns (uint256)",
            "function MAX_SUPPLY() view returns (uint256)"
        ],
        TruthPartThree: [
            "function mintBlackpaper() external payable",
            "function PRICE() view returns (uint256)",
            "function mintingEnabled() view returns (bool)",
            "function totalMinted() view returns (uint256)",
            "function MAX_SUPPLY() view returns (uint256)"
        ]
    }
};

// Make available globally
if (typeof window !== 'undefined') {
    window.TRUTH_CONTRACTS = TRUTH_CONTRACTS;
}

console.log('✅ Contract configuration loaded');