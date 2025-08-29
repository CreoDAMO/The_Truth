
// Token Integration Utilities for The Truth Ecosystem
class TruthTokenIntegration {
    constructor() {
        this.contracts = {
            truth: {
                address: '0x8f6cf6f7747e170f4768533b869c339dc3d30a3c',
                symbol: 'TRUTH',
                decimals: 18,
                totalSupply: 10000000
            },
            creator: {
                address: '0x22b0434e89882f8e6841d340b28427646c015aa7',
                symbol: '@jacqueantoinedegraff',
                decimals: 18,
                totalSupply: 1000000000
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
        this.signer = null;
        this.account = null;
    }

    // Initialize Web3 connection
    async connect() {
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

        const contract = new ethers.Contract(
            this.contracts[tokenType].address,
            this.erc20ABI,
            this.web3
        );

        const balance = await contract.balanceOf(address);
        return ethers.utils.formatUnits(balance, this.contracts[tokenType].decimals);
    }

    // Calculate governance power
    async getGovernancePower(address = null) {
        if (!address) address = this.account;
        
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
    }

    // Calculate access level
    async getAccessLevel(address = null) {
        const power = await this.getGovernancePower(address);
        
        if (power.creatorBalance >= 10000) return 'Platinum';
        if (power.creatorBalance >= 1000) return 'Gold';
        if (power.creatorBalance >= 100) return 'Silver';
        if (power.truthBalance > 0 || power.creatorBalance > 0) return 'Bronze';
        return 'Basic';
    }

    // Calculate revenue share (example calculation)
    async calculateRevenueShare(totalRevenuePool = 1000, address = null) {
        const power = await this.getGovernancePower(address);
        
        const truthShare = (power.truthBalance / this.contracts.truth.totalSupply) * totalRevenuePool * 0.6;
        const creatorShare = (power.creatorBalance / this.contracts.creator.totalSupply) * totalRevenuePool * 0.4;
        
        return {
            truthShare,
            creatorShare,
            totalShare: truthShare + creatorShare,
            percentage: ((truthShare + creatorShare) / totalRevenuePool) * 100
        };
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
}

// Global instance
window.truthTokens = new TruthTokenIntegration();

// Helper functions for UI integration
window.connectTruthWallet = async function() {
    try {
        const account = await window.truthTokens.connect();
        console.log('Connected:', account);
        return account;
    } catch (error) {
        console.error('Connection failed:', error);
        alert(error.message);
        return null;
    }
};

window.updateTokenDisplays = async function() {
    if (!window.truthTokens.account) return;

    try {
        const power = await window.truthTokens.getGovernancePower();
        const accessLevel = await window.truthTokens.getAccessLevel();
        const revenueShare = await window.truthTokens.calculateRevenueShare();

        // Update displays if elements exist
        const truthBalanceEl = document.getElementById('truthBalance');
        const creatorBalanceEl = document.getElementById('creatorBalance');
        const accessLevelEl = document.getElementById('accessLevel');
        const revenueAmountEl = document.getElementById('revenueAmount');

        if (truthBalanceEl) {
            truthBalanceEl.textContent = `${window.truthTokens.formatTokenAmount(power.truthBalance)} TRUTH`;
        }
        
        if (creatorBalanceEl) {
            creatorBalanceEl.textContent = `${window.truthTokens.formatTokenAmount(power.creatorBalance)} @jacqueantoinedegraff`;
        }
        
        if (accessLevelEl) {
            accessLevelEl.textContent = `Access Level: ${accessLevel}`;
        }
        
        if (revenueAmountEl) {
            revenueAmountEl.textContent = `$${revenueShare.totalShare.toFixed(2)}`;
        }

        // Update power meters
        const truthPowerEl = document.getElementById('truthPower');
        const creatorPowerEl = document.getElementById('creatorPower');
        
        if (truthPowerEl) truthPowerEl.style.width = `${power.truthPower}%`;
        if (creatorPowerEl) creatorPowerEl.style.width = `${power.creatorPower}%`;

    } catch (error) {
        console.error('Failed to update token displays:', error);
    }
};

// Auto-update displays when wallet connects
window.addEventListener('load', function() {
    // Check if already connected
    if (window.ethereum && window.ethereum.selectedAddress) {
        window.connectTruthWallet().then(() => {
            window.updateTokenDisplays();
        });
    }
});
