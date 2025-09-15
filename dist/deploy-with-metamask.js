
// MetaMask deployment script for browser environment
// Run this from the browser console or embed in web interface

const NETWORK_CONFIG = {
    baseSepolia: {
        chainId: "0x14a34", // 84532 in hex
        chainName: "Base Sepolia Testnet",
        nativeCurrency: {
            name: "Ethereum",
            symbol: "ETH",
            decimals: 18
        },
        rpcUrls: ["https://sepolia.base.org"],
        blockExplorerUrls: ["https://sepolia.basescan.org"]
    },
    base: {
        chainId: "0x2105", // 8453 in hex
        chainName: "Base",
        nativeCurrency: {
            name: "Ethereum",
            symbol: "ETH",
            decimals: 18
        },
        rpcUrls: ["https://mainnet.base.org"],
        blockExplorerUrls: ["https://basescan.org"]
    }
};

// Contract bytecode and ABI (these need to be generated from compilation)
const CONTRACT_ARTIFACTS = {
    TheTruth: {
        abi: [
            "constructor(address initialOwner, string memory baseURI, address treasury)",
            "function name() view returns (string)",
            "function symbol() view returns (string)",
            "function owner() view returns (address)",
            "function treasury() view returns (address)",
            "function totalSupply() view returns (uint256)",
            "function mintingEnabled() view returns (bool)",
            "function PRICE() view returns (uint256)",
            "function ownerOf(uint256 tokenId) view returns (address)",
            "function setProvenance(string memory _provenance)",
            "function toggleMinting()",
            "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
        ],
        // Bytecode would be inserted here from compilation
        bytecode: "0x608060405234801561001057600080fd5b50..." // This needs to be the actual compiled bytecode
    },
    TruthBonusGift: {
        abi: [
            "constructor(address initialOwner, string memory baseURI, address treasury)",
            "function name() view returns (string)",
            "function symbol() view returns (string)",
            "function batchMint(uint256 quantity)"
        ],
        bytecode: "0x608060405234801561001057600080fd5b50..." // This needs to be the actual compiled bytecode
    }
};

class MetaMaskDeployer {
    constructor() {
        this.provider = null;
        this.signer = null;
        this.network = 'baseSepolia'; // default to testnet
    }

    async initialize() {
        if (!window.ethereum) {
            throw new Error("MetaMask not installed. Please install MetaMask to continue.");
        }

        this.provider = new ethers.providers.Web3Provider(window.ethereum);
        await this.connectWallet();
        await this.switchNetwork();
    }

    async connectWallet() {
        try {
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            this.signer = this.provider.getSigner();
            const address = await this.signer.getAddress();
            
            console.log("🔗 Wallet connected:", address);
            return address;
        } catch (error) {
            throw new Error(`Failed to connect wallet: ${error.message}`);
        }
    }

    async switchNetwork(network = this.network) {
        try {
            const targetNetwork = NETWORK_CONFIG[network];
            
            // Try to switch to the network
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: targetNetwork.chainId }],
            });
            
            this.network = network;
            console.log(`🌐 Switched to ${targetNetwork.chainName}`);
            
        } catch (switchError) {
            // Network not added to MetaMask, try to add it
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [NETWORK_CONFIG[network]],
                    });
                    this.network = network;
                    console.log(`✅ Added and switched to ${NETWORK_CONFIG[network].chainName}`);
                } catch (addError) {
                    throw new Error(`Failed to add network: ${addError.message}`);
                }
            } else {
                throw new Error(`Failed to switch network: ${switchError.message}`);
            }
        }
    }

    async deployContract(contractName, constructorArgs = []) {
        try {
            const artifact = CONTRACT_ARTIFACTS[contractName];
            if (!artifact) {
                throw new Error(`Contract ${contractName} not found in artifacts`);
            }

            console.log(`🚀 Deploying ${contractName}...`);
            console.log("📋 Constructor args:", constructorArgs);

            // Check balance
            const balance = await this.signer.getBalance();
            console.log("💰 Deployer balance:", ethers.utils.formatEther(balance), "ETH");

            // Create contract factory
            const contractFactory = new ethers.ContractFactory(
                artifact.abi,
                artifact.bytecode,
                this.signer
            );

            // Estimate gas
            const estimatedGas = await contractFactory.signer.estimateGas(
                contractFactory.getDeployTransaction(...constructorArgs)
            );
            console.log("⛽ Estimated gas:", estimatedGas.toString());

            // Deploy contract
            const contract = await contractFactory.deploy(...constructorArgs, {
                gasLimit: estimatedGas.mul(120).div(100) // 20% buffer
            });

            console.log("📝 Transaction hash:", contract.deployTransaction.hash);
            console.log("⏳ Waiting for deployment confirmation...");

            // Wait for deployment
            await contract.deployed();
            
            console.log(`✅ ${contractName} deployed to:`, contract.address);
            
            // Verify deployment
            await this.verifyDeployment(contract, contractName);
            
            return {
                address: contract.address,
                transactionHash: contract.deployTransaction.hash,
                contract: contract
            };

        } catch (error) {
            console.error(`❌ Deployment failed:`, error);
            throw error;
        }
    }

    async verifyDeployment(contract, contractName) {
        try {
            console.log(`🔍 Verifying ${contractName} deployment...`);
            
            // Basic verification based on contract type
            if (contractName === 'TheTruth') {
                const name = await contract.name();
                const symbol = await contract.symbol();
                const owner = await contract.owner();
                const treasury = await contract.treasury();
                const totalSupply = await contract.totalSupply();
                const price = await contract.PRICE();
                
                console.log("📊 Contract verified:");
                console.log("  Name:", name);
                console.log("  Symbol:", symbol);
                console.log("  Owner:", owner);
                console.log("  Treasury:", treasury);
                console.log("  Total Supply:", totalSupply.toString());
                console.log("  Price:", ethers.utils.formatEther(price), "ETH");
                
                // Check if master copy exists
                try {
                    const masterOwner = await contract.ownerOf(77);
                    console.log("  Master Copy Owner:", masterOwner);
                } catch (e) {
                    console.log("  Master Copy: Not yet minted");
                }
                
            } else if (contractName === 'TruthBonusGift') {
                const name = await contract.name();
                const symbol = await contract.symbol();
                
                console.log("📊 Bonus Contract verified:");
                console.log("  Name:", name);
                console.log("  Symbol:", symbol);
            }
            
        } catch (error) {
            console.warn("⚠️ Verification failed:", error.message);
        }
    }

    async deployTheTruth(config = {}) {
        const defaultConfig = {
            initialOwner: "0x67BF9f428d92704C3Db3a08dC05Bc941A8647866",
            baseURI: "ipfs://YOUR_METADATA_ROOT_CID/",
            treasury: "0x67BF9f428d92704C3Db3a08dC05Bc941A8647866"
        };

        const deployConfig = { ...defaultConfig, ...config };
        
        return await this.deployContract('TheTruth', [
            deployConfig.initialOwner,
            deployConfig.baseURI,
            deployConfig.treasury
        ]);
    }

    async deployTruthBonusGift(config = {}) {
        const defaultConfig = {
            initialOwner: "0x67BF9f428d92704C3Db3a08dC05Bc941A8647866",
            baseURI: "ipfs://YOUR_BONUS_METADATA_ROOT_CID/",
            treasury: "0x67BF9f428d92704C3Db3a08dC05Bc941A8647866"
        };

        const deployConfig = { ...defaultConfig, ...config };
        
        return await this.deployContract('TruthBonusGift', [
            deployConfig.initialOwner,
            deployConfig.baseURI,
            deployConfig.treasury
        ]);
    }

    async saveDeploymentInfo(contractName, deploymentResult, config) {
        const deploymentInfo = {
            network: this.network,
            chainId: NETWORK_CONFIG[this.network].chainId,
            contractName: contractName,
            address: deploymentResult.address,
            transactionHash: deploymentResult.transactionHash,
            deployer: await this.signer.getAddress(),
            config: config,
            timestamp: new Date().toISOString(),
            blockExplorer: `${NETWORK_CONFIG[this.network].blockExplorerUrls[0]}/address/${deploymentResult.address}`
        };

        // Save to localStorage for browser persistence
        const storageKey = `deployment_${contractName}_${this.network}`;
        localStorage.setItem(storageKey, JSON.stringify(deploymentInfo));
        
        console.log("💾 Deployment info saved to localStorage");
        console.log("🔍 View on explorer:", deploymentInfo.blockExplorer);
        
        return deploymentInfo;
    }
}

// Export for global use
window.MetaMaskDeployer = MetaMaskDeployer;

// Usage example:
async function deployWithMetaMask(contractType = 'TheTruth', config = {}) {
    try {
        const deployer = new MetaMaskDeployer();
        await deployer.initialize();
        
        let result;
        if (contractType === 'TheTruth') {
            result = await deployer.deployTheTruth(config);
        } else if (contractType === 'TruthBonusGift') {
            result = await deployer.deployTruthBonusGift(config);
        } else {
            throw new Error(`Unknown contract type: ${contractType}`);
        }
        
        await deployer.saveDeploymentInfo(contractType, result, config);
        
        console.log("🎉 Deployment completed successfully!");
        return result;
        
    } catch (error) {
        console.error("💥 Deployment failed:", error);
        throw error;
    }
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MetaMaskDeployer, deployWithMetaMask };
}
