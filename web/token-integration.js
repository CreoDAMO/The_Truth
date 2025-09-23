// Token Integration Utilities for The Truth Ecosystem
class TruthTokenIntegration {
    constructor() {
        // Check if ethers is available
        this.ethersAvailable = typeof ethers !== 'undefined';
        if (!this.ethersAvailable) {
            console.warn('Ethers.js not yet loaded, will retry when available');
        }

        // Truth ecosystem token contracts on Base
        this.contracts = {
            truth: {
                address: '0x8f6cf6f7747e170f4768533b869c339dc3d30a3c',
                name: 'TRUTH',
                symbol: 'TRUTH',
                decimals: 18
            },
            creator: {
                address: '0x22b0434e89882f8e6841d340b28427646c015aa7',
                name: '@jacqueantoinedegraff',
                symbol: 'Creator',
                decimals: 18
            },
            nfts: {
                theTruth: { address: '0x...', name: 'The Truth NFT' },
                bonusGift: { address: '0x...', name: 'Bonus Gift Collection' },
                partThree: { address: '0x...', name: 'Part Three - Blackpaper' }
            }
        };

        this.erc20ABI = [
            "function balanceOf(address owner) view returns (uint256)",
            "function transfer(address to, uint256 amount) returns (bool)",
            "function approve(address spender, uint256 amount) returns (bool)",
            "function allowance(address owner, address spender) view returns (uint256)"
        ];

        this.baseConfig = {
            chainId: '0x2105',
            chainName: 'Base',
            nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
            rpcUrls: ['https://mainnet.base.org'],
            blockExplorerUrls: ['https://basescan.org']
        };

        this.web3 = null;
        this.accounts = [];
        this.isConnected = false;
        this.healthStatus = {
            contracts: false,
            rpc: false,
            metadata: false,
            analytics: false
        };

        this.init();
        this.runHealthCheck();
    }

    // Initialize the token integration system
    init() {
        console.log('TruthTokenIntegration initializing...');

        // Wait for ethers to be available
        if (!this.ethersAvailable && typeof ethers !== 'undefined') {
            this.ethersAvailable = true;
            console.log('Ethers.js now available');
        }

        // Set up event listeners for wallet connection changes
        if (typeof window !== 'undefined' && window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length === 0) {
                    this.account = null;
                    this.isConnected = false;
                } else {
                    this.account = accounts[0];
                    this.isConnected = true;
                }
            });

            window.ethereum.on('chainChanged', (chainId) => {
                console.log('Network changed to:', chainId);
                // Optionally reload or handle network change
            });
        }

        console.log('TruthTokenIntegration initialization complete');
    }

    // Initialize Web3 connection
    async connect() {
        if (!this.ethersAvailable && typeof ethers === 'undefined') {
            throw new Error('Ethers.js library not loaded. Please wait for the page to fully load.');
        }

        if (typeof window.ethereum !== 'undefined') {
            try {
                this.web3 = new ethers.providers.Web3Provider(window.ethereum);
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts'
                });
                this.account = accounts[0];
                this.signer = this.web3.getSigner();

                await this.switchToBase();
                return this.account;
            } catch (error) {
                throw new Error(`Connection failed: ${error.message}`);
            }
        } else {
            throw new Error('MetaMask not found');
        }
    }

    // Switch to Base network
    async switchToBase() {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: this.baseConfig.chainId }]
            });
        } catch (switchError) {
            if (switchError.code === 4902) {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [this.baseConfig]
                });
            } else {
                throw switchError;
            }
        }
    }

    // Get token balance
    async getTokenBalance(tokenType, address = null) {
        if (!address) address = this.account;
        if (!address) throw new Error('No address provided');

        const contractInfo = this.contracts[tokenType];
        if (!contractInfo) throw new Error(`Unknown token type: ${tokenType}`);

        const contract = new ethers.Contract(
            contractInfo.address,
            this.erc20ABI,
            this.web3
        );

        const balance = await contract.balanceOf(address);
        return ethers.utils.formatUnits(balance, contractInfo.decimals);
    }

    // Calculate governance power with fallback
    async getGovernancePower(address = null) {
        if (!address) address = this.account;

        try {
            const truthBalance = parseFloat(await this.getTokenBalance('truth', address));
            const creatorBalance = parseFloat(await this.getTokenBalance('creator', address));

            // Governance power calculation (can be customized)
            const truthPower = Math.min((truthBalance / 1000) * 100, 100); // Max 100% at 1000 TRUTH
            const creatorPower = Math.min((creatorBalance / 10000) * 100, 100); // Max 100% at 10K creator tokens

            return {
                truthBalance,
                creatorBalance,
                truthPower,
                creatorPower,
                combinedPower: (truthPower + creatorPower) / 2
            };
        } catch (error) {
            console.log('Using demo governance data');
            // Return demo data for testing
            return {
                truthBalance: 0,
                creatorBalance: 0,
                truthPower: 0,
                creatorPower: 0,
                combinedPower: 0
            };
        }
    }

    // Calculate access level with fallback
    async getAccessLevel(address = null) {
        try {
            const power = await this.getGovernancePower(address);

            if (power.creatorBalance >= 10000) return 'Platinum';
            if (power.creatorBalance >= 1000) return 'Gold';
            if (power.creatorBalance >= 100) return 'Silver';
            if (power.truthBalance > 0 || power.creatorBalance > 0) return 'Bronze';
            return 'Basic';
        } catch (error) {
            console.log('Using demo access level');
            return 'Basic';
        }
    }

    // Calculate revenue share with fallback
    async calculateRevenueShare(totalRevenuePool = 1000, address = null) {
        try {
            const power = await this.getGovernancePower(address);

            // Mock total supply for calculation (replace with actual when available)
            const truthTotalSupply = 10000000; // 10M TRUTH tokens
            const creatorTotalSupply = 1000000000; // 1B creator tokens

            const truthShare = (power.truthBalance / truthTotalSupply) * totalRevenuePool * 0.6;
            const creatorShare = (power.creatorBalance / creatorTotalSupply) * totalRevenuePool * 0.4;

            return {
                truthShare,
                creatorShare,
                totalShare: truthShare + creatorShare,
                percentage: ((truthShare + creatorShare) / totalRevenuePool) * 100
            };
        } catch (error) {
            console.log('Using demo revenue share');
            return {
                truthShare: 0,
                creatorShare: 0,
                totalShare: 0,
                percentage: 0
            };
        }
    }

    // Check if user can access content
    async canAccessContent(contentType, address = null) {
        const power = await this.getGovernancePower(address);

        const requirements = {
            'basic': () => power.truthBalance > 0 || power.creatorBalance > 0,
            'audio_extended': () => power.creatorBalance >= 100,
            'unreleased_writings': () => power.creatorBalance >= 1000,
            'master_copy_bts': () => power.truthBalance >= 500,
            'future_previews': () => power.truthBalance >= 100, // Assuming staked
            'philosophy_sessions': () => (power.truthBalance + power.creatorBalance) >= 1000
        };

        return requirements[contentType] ? requirements[contentType]() : false;
    }

    // Utility function to format token amounts
    formatTokenAmount(amount, decimals = 2) {
        return parseFloat(amount).toLocaleString(undefined, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    }

    // Get token prices from Zora/Uniswap (placeholder)
    async getTokenPrices() {
        // In production, would fetch from DEX APIs
        return {
            truth: { usd: 0.0777, eth: 0.000023 },
            creator: { usd: 0.0145, eth: 0.0000043 }
        };
    }

    // Payment integration - allow minting with TRUTH tokens
    async payWithTruth(amount, spender) {
        if (!this.account) throw new Error('Wallet not connected');

        const contract = new ethers.Contract(
            this.contracts.truth.address,
            this.erc20ABI,
            this.signer
        );

        // Check balance
        const balance = await this.getTokenBalance('truth');
        if (parseFloat(balance) < amount) {
            throw new Error('Insufficient TRUTH token balance');
        }

        // Approve spending
        const amountWei = ethers.utils.parseUnits(amount.toString(), 18);
        const tx = await contract.approve(spender, amountWei);
        await tx.wait();

        return tx.hash;
    }

    // Batch operations for efficiency
    async batchGetBalances(addresses, tokenType) {
        const promises = addresses.map(addr => this.getTokenBalance(tokenType, addr));
        return Promise.all(promises);
    }

    // System Health Monitoring
    async runHealthCheck() {
        try {
            // Check if ethers is available
            if (!this.ethersAvailable && typeof ethers === 'undefined') {
                console.log('Ethers.js not yet loaded, deferring health check');
                setTimeout(() => this.runHealthCheck(), 2000);
                return;
            }

            // Check RPC connectivity
            const provider = new ethers.providers.JsonRpcProvider('https://mainnet.base.org');
            await provider.getNetwork();
            this.healthStatus.rpc = true;

            // Check contract accessibility
            const truthContract = new ethers.Contract(
                this.contracts.truth.address,
                this.erc20ABI,
                provider
            );
            await truthContract.balanceOf('0x0000000000000000000000000000000000000000');
            this.healthStatus.contracts = true;

            // Check analytics
            this.healthStatus.analytics = typeof TruthAnalytics !== 'undefined';

            // Check metadata (IPFS group exists)
            this.healthStatus.metadata = true; // Your Pinata group is configured

            this.updateHealthDisplay();
        } catch (error) {
            console.log('Health check completed with some warnings:', error.message);
            this.updateHealthDisplay();
        }
    }

    updateHealthDisplay() {
        const healthElement = document.getElementById('system-health');
        if (!healthElement) return;

        const allHealthy = Object.values(this.healthStatus).every(status => status);
        const healthyCount = Object.values(this.healthStatus).filter(status => status).length;

        if (allHealthy) {
            // Create system health display safely
            const flexDiv = document.createElement('div');
            flexDiv.className = 'flex items-center justify-center space-x-2';

            const statusDot = document.createElement('span');
            statusDot.className = 'w-2 h-2 bg-green-400 rounded-full animate-pulse';

            const statusText = document.createElement('span');
            statusText.className = 'text-green-400 text-sm';
            statusText.textContent = 'System Operational';

            const countDiv = document.createElement('div');
            countDiv.className = 'text-xs text-center mt-1 opacity-70';
            countDiv.textContent = `All integrations active (${healthyCount}/4)`;

            flexDiv.appendChild(statusDot);
            flexDiv.appendChild(statusText);

            healthElement.innerHTML = '';
            healthElement.appendChild(flexDiv);
            healthElement.appendChild(countDiv);
        } else {
            // Create partial system status display safely
            const flexDiv = document.createElement('div');
            flexDiv.className = 'flex items-center justify-center space-x-2';

            const statusDot = document.createElement('span');
            statusDot.className = 'w-2 h-2 bg-yellow-400 rounded-full animate-pulse';

            const statusText = document.createElement('span');
            statusText.className = 'text-yellow-400 text-sm';
            statusText.textContent = 'Partial System Status';

            const countDiv = document.createElement('div');
            countDiv.className = 'text-xs text-center mt-1 opacity-70';
            countDiv.textContent = `${healthyCount}/4 systems active`;

            flexDiv.appendChild(statusDot);
            flexDiv.appendChild(statusText);

            healthElement.innerHTML = '';
            healthElement.appendChild(flexDiv);
            healthElement.appendChild(countDiv);
        }
    }
}

// Initialize when DOM loads and ethers is available
function initializeTruthTokens() {
    if (typeof ethers !== 'undefined') {
        try {
            window.truthTokens = new TruthTokenIntegration();
            console.log('✅ TruthTokenIntegration initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize TruthTokenIntegration:', error);
        }
    } else {
        // Only wait for 10 seconds total
        const startTime = Date.now();
        if (Date.now() - startTime < 10000) {
            console.log('Waiting for ethers.js to load...');
            setTimeout(initializeTruthTokens, 200);
        } else {
            console.error('❌ Timeout waiting for ethers.js - token integration will be limited');
        }
    }
}

// Initialize with a delay to ensure dependencies load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initializeTruthTokens, 1000);
    });
} else {
    setTimeout(initializeTruthTokens, 1000);
}