// Advanced Blockchain Analytics Service
class BlockchainAnalyticsService {
    constructor() {
        this.provider = null;
        this.contracts = new Map();
        this.eventFilters = new Map();
        this.cache = new Map();
        this.websocketProvider = null;
        this.isListening = false;
    }

    // Initialize service with Base network connection
    async initialize() {
        try {
            // Primary RPC endpoint
            this.provider = new ethers.providers.JsonRpcProvider('https://mainnet.base.org');
            
            // Setup WebSocket for real-time events (if available)
            try {
                this.websocketProvider = new ethers.providers.WebSocketProvider('wss://mainnet.base.org');
                console.log('✅ WebSocket connection established for real-time events');
            } catch (wsError) {
                console.log('📡 WebSocket unavailable, using polling for events');
            }

            // Test connection
            const network = await this.provider.getNetwork();
            console.log(`🌐 Connected to Base network (chainId: ${network.chainId})`);
            
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize blockchain service:', error);
            return false;
        }
    }

    // Register NFT contract for monitoring
    registerNFTContract(name, address, abi) {
        const contract = new ethers.Contract(address, abi, this.provider);
        this.contracts.set(name, {
            contract,
            address,
            type: 'nft',
            lastBlock: null
        });

        // Setup event filters for real-time monitoring
        this.setupEventFilters(name, contract);
        
        console.log(`📝 Registered NFT contract: ${name} at ${address}`);
    }

    // Register token contract for monitoring
    registerTokenContract(name, address, abi) {
        const contract = new ethers.Contract(address, abi, this.provider);
        this.contracts.set(name, {
            contract,
            address,
            type: 'token',
            lastBlock: null
        });

        console.log(`🪙 Registered Token contract: ${name} at ${address}`);
    }

    // Setup event filters for real-time monitoring
    setupEventFilters(contractName, contract) {
        if (!this.websocketProvider) return;

        try {
            // Common NFT events
            const eventNames = ['Transfer', 'TruthMinted', 'BonusGiftMinted', 'BlackpaperMinted'];
            
            eventNames.forEach(eventName => {
                try {
                    const filter = contract.filters[eventName]();
                    this.eventFilters.set(`${contractName}_${eventName}`, filter);
                    
                    // Listen for events
                    contract.on(filter, (...args) => {
                        this.handleContractEvent(contractName, eventName, args);
                    });
                } catch (e) {
                    // Event doesn't exist on this contract
                }
            });
        } catch (error) {
            console.log(`⚠️ Could not setup event filters for ${contractName}:`, error.message);
        }
    }

    // Handle contract events in real-time
    handleContractEvent(contractName, eventName, args) {
        const event = {
            contract: contractName,
            event: eventName,
            args: args.slice(0, -1), // Remove event object
            timestamp: new Date().toISOString(),
            blockNumber: args[args.length - 1]?.blockNumber
        };

        console.log(`🔔 New ${eventName} event from ${contractName}:`, event);
        
        // Invalidate cache for this contract
        this.cache.delete(`${contractName}_data`);
        
        // Emit custom event for UI updates
        window.dispatchEvent(new CustomEvent('blockchainEvent', { detail: event }));
    }

    // Get comprehensive NFT contract data
    async getNFTContractData(contractName) {
        const cacheKey = `${contractName}_data`;
        
        // Check cache first (5 minute expiry)
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < 300000) {
                return cached.data;
            }
        }

        const contractInfo = this.contracts.get(contractName);
        if (!contractInfo || contractInfo.type !== 'nft') {
            throw new Error(`NFT contract ${contractName} not found`);
        }

        try {
            const contract = contractInfo.contract;
            
            // Fetch all relevant data in parallel
            const [
                totalSupply,
                totalMinted,
                remainingSupply,
                maxSupply,
                price,
                mintingEnabled,
                contractBalance,
                owner,
                treasury
            ] = await Promise.allSettled([
                contract.totalSupply?.() || Promise.resolve(0),
                contract.totalMinted?.() || Promise.resolve(0),
                contract.remainingSupply?.() || Promise.resolve(0),
                contract.MAX_SUPPLY?.() || Promise.resolve(0),
                contract.PRICE?.() || Promise.resolve(0),
                contract.mintingEnabled?.() || Promise.resolve(false),
                this.provider.getBalance(contractInfo.address),
                contract.owner?.() || Promise.resolve('0x0'),
                contract.treasury?.() || Promise.resolve('0x0')
            ]);

            const data = {
                contractName,
                address: contractInfo.address,
                totalSupply: totalSupply.status === 'fulfilled' ? totalSupply.value.toString() : '0',
                totalMinted: totalMinted.status === 'fulfilled' ? totalMinted.value.toString() : '0',
                remainingSupply: remainingSupply.status === 'fulfilled' ? remainingSupply.value.toString() : '0',
                maxSupply: maxSupply.status === 'fulfilled' ? maxSupply.value.toString() : '0',
                price: price.status === 'fulfilled' ? ethers.utils.formatEther(price.value) : '0',
                mintingEnabled: mintingEnabled.status === 'fulfilled' ? mintingEnabled.value : false,
                contractBalance: ethers.utils.formatEther(contractBalance.status === 'fulfilled' ? contractBalance.value : 0),
                owner: owner.status === 'fulfilled' ? owner.value : '0x0',
                treasury: treasury.status === 'fulfilled' ? treasury.value : '0x0',
                lastUpdated: new Date().toISOString()
            };

            // Cache the result
            this.cache.set(cacheKey, {
                data,
                timestamp: Date.now()
            });

            return data;
        } catch (error) {
            console.error(`❌ Error fetching NFT data for ${contractName}:`, error);
            throw error;
        }
    }

    // Get token contract data
    async getTokenContractData(contractName) {
        const contractInfo = this.contracts.get(contractName);
        if (!contractInfo || contractInfo.type !== 'token') {
            throw new Error(`Token contract ${contractName} not found`);
        }

        try {
            const contract = contractInfo.contract;
            
            const [totalSupply, name, symbol, decimals] = await Promise.all([
                contract.totalSupply(),
                contract.name(),
                contract.symbol(),
                contract.decimals()
            ]);

            return {
                contractName,
                address: contractInfo.address,
                name,
                symbol,
                decimals,
                totalSupply: ethers.utils.formatUnits(totalSupply, decimals),
                totalSupplyRaw: totalSupply.toString(),
                lastUpdated: new Date().toISOString()
            };
        } catch (error) {
            console.error(`❌ Error fetching token data for ${contractName}:`, error);
            throw error;
        }
    }

    // Get recent transactions for a contract
    async getRecentTransactions(contractAddress, eventName = 'Transfer', fromBlock = -1000) {
        try {
            const contract = this.contracts.get(contractAddress)?.contract;
            if (!contract) {
                throw new Error('Contract not found');
            }

            const currentBlock = await this.provider.getBlockNumber();
            const startBlock = Math.max(0, currentBlock + fromBlock);

            const filter = contract.filters[eventName]?.();
            if (!filter) {
                return [];
            }

            const events = await contract.queryFilter(filter, startBlock, currentBlock);
            
            return events.map(event => ({
                blockNumber: event.blockNumber,
                transactionHash: event.transactionHash,
                args: event.args,
                event: eventName,
                timestamp: null, // Would need to fetch block data for timestamp
                gasUsed: null
            }));
        } catch (error) {
            console.error('❌ Error fetching recent transactions:', error);
            return [];
        }
    }

    // Get holder count for NFT contract
    async getHolderCount(contractName) {
        try {
            const contractData = await this.getNFTContractData(contractName);
            const totalMinted = parseInt(contractData.totalMinted);
            
            // This is an estimation - for accurate count, you'd need to track Transfer events
            // or use a graph protocol subgraph
            return Math.floor(totalMinted * 0.85); // Assuming 85% are unique holders
        } catch (error) {
            console.error(`❌ Error estimating holder count for ${contractName}:`, error);
            return 0;
        }
    }

    // Get comprehensive analytics for all contracts
    async getAllContractsAnalytics() {
        const analytics = {
            nfts: {},
            tokens: {},
            aggregated: {
                totalRevenue: 0,
                totalMinted: 0,
                estimatedHolders: 0,
                activeContracts: 0
            },
            lastUpdated: new Date().toISOString()
        };

        // Process NFT contracts
        for (const [name, info] of this.contracts.entries()) {
            if (info.type === 'nft') {
                try {
                    const data = await this.getNFTContractData(name);
                    analytics.nfts[name] = data;
                    
                    // Aggregate data
                    analytics.aggregated.totalRevenue += parseFloat(data.contractBalance);
                    analytics.aggregated.totalMinted += parseInt(data.totalMinted);
                    analytics.aggregated.activeContracts++;
                } catch (error) {
                    console.error(`⚠️ Failed to get data for NFT contract ${name}:`, error.message);
                }
            } else if (info.type === 'token') {
                try {
                    const data = await getTokenContractData(name);
                    analytics.tokens[name] = data;
                } catch (error) {
                    console.error(`⚠️ Failed to get data for token contract ${name}:`, error.message);
                }
            }
        }

        // Estimate total unique holders
        analytics.aggregated.estimatedHolders = Math.floor(analytics.aggregated.totalMinted * 0.8);

        return analytics;
    }

    // Start real-time monitoring
    startRealTimeMonitoring() {
        if (this.isListening) return;

        if (this.websocketProvider) {
            console.log('🎧 Starting real-time blockchain monitoring...');
            this.isListening = true;
        } else {
            console.log('📊 Starting polling-based monitoring...');
            // Fallback to polling every 30 seconds
            setInterval(() => {
                this.cache.clear(); // Force refresh
                window.dispatchEvent(new CustomEvent('blockchainDataRefresh'));
            }, 30000);
        }
    }

    // Stop monitoring
    stopRealTimeMonitoring() {
        if (this.websocketProvider) {
            this.websocketProvider.removeAllListeners();
        }
        this.isListening = false;
        console.log('🛑 Stopped blockchain monitoring');
    }

    // Clear cache
    clearCache() {
        this.cache.clear();
        console.log('🗑️ Blockchain cache cleared');
    }
}

// Global instance
window.blockchainService = new BlockchainAnalyticsService();

// Auto-initialize if ethers is available
if (typeof ethers !== 'undefined') {
    window.blockchainService.initialize().then(success => {
        if (success) {
            console.log('🚀 Advanced Blockchain Analytics Service ready');
        }
    });
} else {
    console.log('⏳ Waiting for ethers.js to initialize blockchain service...');
}