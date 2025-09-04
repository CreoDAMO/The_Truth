
// Contract Configuration for The Truth Ecosystem
// Update these addresses when contracts are deployed

const TRUTH_CONTRACTS = {
    // Network configuration
    NETWORK: {
        name: 'Base',
        chainId: '0x2105',
        rpcUrl: 'https://mainnet.base.org',
        explorer: 'https://basescan.org'
    },

    // Deployed contract addresses (update after deployment)
    ADDRESSES: {
        TheTruth: '0x...', // Main Truth NFT contract
        TruthBonusGift: '0x...', // Bonus Gift collection contract  
        TruthPartThree: '0x...', // Part Three Blackpaper contract
        PaymentSplitter: '0x...', // Payment splitter contract
        TruthToken: '0x8f6cf6f7747e170f4768533b869c339dc3d30a3c', // TRUTH governance token
        CreatorToken: '0x22b0434e89882f8e6841d340b28427646c015aa7' // Creator coin
    },

    // Contract ABIs (minimal interface for UI)
    ABI: {
        TheTruth: [
            "function mintTruth() external payable",
            "function PRICE() view returns (uint256)",
            "function mintingEnabled() view returns (bool)",
            "function totalMinted() view returns (uint256)",
            "function MAX_SUPPLY() view returns (uint256)",
            "function PUBLIC_SUPPLY() view returns (uint256)",
            "function remainingSupply() view returns (uint256)",
            "function hasMinted(address) view returns (bool)",
            "function owner() view returns (address)",
            "event TruthMinted(address indexed to, uint256 indexed tokenId)"
        ],

        TruthBonusGift: [
            "function mintBonusGift(uint256 quantity) external payable",
            "function PRICE() view returns (uint256)",
            "function mintingEnabled() view returns (bool)",
            "function totalMinted() view returns (uint256)",
            "function MAX_SUPPLY() view returns (uint256)",
            "function PUBLIC_SUPPLY() view returns (uint256)",
            "function remainingSupply() view returns (uint256)",
            "function mintedCount(address) view returns (uint256)",
            "function MAX_PER_WALLET() view returns (uint256)",
            "event BonusGiftMinted(address indexed to, uint256 indexed tokenId, uint256 quantity)"
        ],

        TruthPartThree: [
            "function mintBlackpaper() external payable",
            "function PRICE() view returns (uint256)",
            "function mintingEnabled() view returns (bool)",
            "function totalMinted() view returns (uint256)",
            "function MAX_SUPPLY() view returns (uint256)",
            "function PUBLIC_SUPPLY() view returns (uint256)",
            "function remainingSupply() view returns (uint256)",
            "function hasMinted(address) view returns (bool)",
            "function getBlackpaperInfo() view returns (string, string)",
            "event BlackpaperMinted(address indexed to, uint256 indexed tokenId)"
        ],

        ERC20: [
            "function balanceOf(address owner) view returns (uint256)",
            "function totalSupply() view returns (uint256)",
            "function name() view returns (string)",
            "function symbol() view returns (string)",
            "function decimals() view returns (uint8)"
        ]
    },

    // Contract metadata
    METADATA: {
        TheTruth: {
            name: "The Truth NFT",
            symbol: "TRUTH",
            maxSupply: 77,
            publicSupply: 76,
            priceUSD: 777
        },
        TruthBonusGift: {
            name: "The Truth - Bonus Gift",
            symbol: "BONUS", 
            maxSupply: 145000,
            publicSupply: 144000,
            priceUSD: 145
        },
        TruthPartThree: {
            name: "The Truth Part Three - Applying The Laws",
            symbol: "LAWS",
            maxSupply: 444,
            publicSupply: 443,
            priceUSD: 1777
        }
    }
};

// Helper functions
const ContractHelpers = {
    // Check if contracts are deployed
    areContractsDeployed() {
        return Object.values(TRUTH_CONTRACTS.ADDRESSES)
            .filter(addr => addr !== '0x...')
            .length > 0;
    },

    // Get contract instance
    getContract(contractName, signer = null) {
        const address = TRUTH_CONTRACTS.ADDRESSES[contractName];
        const abi = TRUTH_CONTRACTS.ABI[contractName];
        
        if (!address || address === '0x...') {
            throw new Error(`${contractName} not deployed yet`);
        }

        const provider = signer || window.truthTokens?.web3;
        if (!provider) {
            throw new Error('No Web3 provider available');
        }

        return new ethers.Contract(address, abi, signer || provider);
    },

    // Format price from Wei to ETH
    formatPrice(priceWei) {
        return ethers.utils.formatEther(priceWei);
    },

    // Get contract URL on block explorer
    getExplorerUrl(contractName) {
        const address = TRUTH_CONTRACTS.ADDRESSES[contractName];
        return `${TRUTH_CONTRACTS.NETWORK.explorer}/address/${address}`;
    }
};

// Export for use in other files
if (typeof window !== 'undefined') {
    window.TRUTH_CONTRACTS = TRUTH_CONTRACTS;
    window.ContractHelpers = ContractHelpers;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TRUTH_CONTRACTS, ContractHelpers };
}
