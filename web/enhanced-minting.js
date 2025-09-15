// Enhanced Minting Interface with Batch Operations and Whitelist Support
class EnhancedMintingInterface {
    constructor() {
        this.contract = null;
        this.provider = null;
        this.signer = null;
        this.userAddress = null;
        this.isWhitelisted = false;
        this.merkleProof = [];
        this.holderDiscount = 0;
    }

    // Initialize the enhanced minting interface
    async initialize(contractAddress, abi) {
        try {
            if (typeof window.ethereum === 'undefined') {
                throw new Error('MetaMask not detected');
            }

            this.provider = new ethers.providers.Web3Provider(window.ethereum);
            await this.provider.send("eth_requestAccounts", []);
            this.signer = this.provider.getSigner();
            this.userAddress = await this.signer.getAddress();
            
            this.contract = new ethers.Contract(contractAddress, abi, this.signer);
            
            // Check whitelist status and holder discounts
            await this.checkUserStatus();
            
            console.log('✅ Enhanced minting interface initialized');
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize enhanced minting:', error);
            return false;
        }
    }

    // Check user's whitelist status and holder discounts
    async checkUserStatus() {
        try {
            // Get merkle proof from backend (you'd implement this endpoint)
            const response = await fetch(`/api/whitelist/proof/${this.userAddress}`);
            if (response.ok) {
                const data = await response.json();
                this.isWhitelisted = data.isWhitelisted;
                this.merkleProof = data.proof || [];
            }

            // Check holder discount
            this.holderDiscount = await this.contract.getHolderDiscount(this.userAddress);
            
            console.log(`User status: Whitelisted: ${this.isWhitelisted}, Discount: ${ethers.utils.formatEther(this.holderDiscount)} ETH`);
        } catch (error) {
            console.log('Could not verify user status:', error.message);
        }
    }

    // Get current minting prices and status
    async getMintingStatus() {
        try {
            const [
                mintingEnabled,
                whitelistMintEnabled,
                publicMintEnabled,
                currentPrice,
                whitelistPrice,
                totalMinted,
                remainingSupply,
                userMintCount,
                hasWhitelistMinted
            ] = await Promise.all([
                this.contract.mintingEnabled(),
                this.contract.whitelistMintEnabled(),
                this.contract.publicMintEnabled(),
                this.contract.getCurrentPrice(),
                this.contract.getWhitelistPrice(),
                this.contract.totalMinted(),
                this.contract.remainingSupply(),
                this.contract.mintedCount(this.userAddress),
                this.contract.hasMintedWhitelist(this.userAddress)
            ]);

            return {
                mintingEnabled,
                whitelistMintEnabled,
                publicMintEnabled,
                currentPrice: ethers.utils.formatEther(currentPrice),
                whitelistPrice: ethers.utils.formatEther(whitelistPrice),
                totalMinted: totalMinted.toString(),
                remainingSupply: remainingSupply.toString(),
                userMintCount: userMintCount.toString(),
                hasWhitelistMinted,
                holderDiscount: ethers.utils.formatEther(this.holderDiscount)
            };
        } catch (error) {
            console.error('Error getting minting status:', error);
            throw error;
        }
    }

    // Calculate total price for batch minting
    async calculateBatchPrice(quantity) {
        try {
            const totalPrice = await this.contract.calculateTotalPrice(quantity);
            const discountedPrice = await this.contract.applyHolderDiscount(this.userAddress, totalPrice);
            
            return {
                originalPrice: ethers.utils.formatEther(totalPrice),
                finalPrice: ethers.utils.formatEther(discountedPrice),
                discount: ethers.utils.formatEther(totalPrice.sub(discountedPrice)),
                pricePerToken: ethers.utils.formatEther(discountedPrice.div(quantity))
            };
        } catch (error) {
            console.error('Error calculating batch price:', error);
            throw error;
        }
    }

    // Mint from whitelist
    async mintWhitelist() {
        try {
            if (!this.isWhitelisted) {
                throw new Error('Address not whitelisted');
            }

            const whitelistPrice = await this.contract.getWhitelistPrice();
            
            const tx = await this.contract.mintWhitelist(this.merkleProof, {
                value: whitelistPrice,
                gasLimit: 250000
            });

            console.log('🎉 Whitelist mint transaction sent:', tx.hash);
            
            // Show transaction progress
            this.showTransactionProgress(tx.hash);
            
            const receipt = await tx.wait();
            console.log('✅ Whitelist mint confirmed:', receipt.transactionHash);
            
            return {
                success: true,
                transactionHash: receipt.transactionHash,
                tokenIds: this.extractTokenIdsFromReceipt(receipt)
            };
        } catch (error) {
            console.error('❌ Whitelist mint failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Public mint with batch support
    async mintPublic(quantity = 1) {
        try {
            if (quantity < 1 || quantity > 5) {
                throw new Error('Invalid quantity. Must be between 1-5');
            }

            const priceData = await this.calculateBatchPrice(quantity);
            const finalPriceWei = ethers.utils.parseEther(priceData.finalPrice);
            
            const tx = await this.contract.mintPublic(quantity, {
                value: finalPriceWei,
                gasLimit: 100000 + (quantity * 75000) // Dynamic gas based on quantity
            });

            console.log(`🎉 Public mint transaction sent (${quantity} tokens):`, tx.hash);
            
            // Show transaction progress
            this.showTransactionProgress(tx.hash);
            
            const receipt = await tx.wait();
            console.log('✅ Public mint confirmed:', receipt.transactionHash);
            
            return {
                success: true,
                transactionHash: receipt.transactionHash,
                tokenIds: this.extractTokenIdsFromReceipt(receipt),
                quantity,
                totalPrice: priceData.finalPrice,
                discount: priceData.discount
            };
        } catch (error) {
            console.error('❌ Public mint failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Extract token IDs from transaction receipt
    extractTokenIdsFromReceipt(receipt) {
        const tokenIds = [];
        
        receipt.logs.forEach(log => {
            try {
                const decoded = this.contract.interface.parseLog(log);
                if (decoded.name === 'TruthMinted') {
                    tokenIds.push(decoded.args.tokenId.toString());
                } else if (decoded.name === 'BatchMinted') {
                    tokenIds.push(...decoded.args.tokenIds.map(id => id.toString()));
                }
            } catch (error) {
                // Skip logs that can't be decoded
            }
        });
        
        return tokenIds;
    }

    // Show transaction progress with link to block explorer
    showTransactionProgress(txHash) {
        const explorerUrl = `https://basescan.org/tx/${txHash}`;
        
        // Create progress notification (you'd integrate with your UI framework)
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div class="transaction-progress">
                <div class="progress-indicator">⏳ Transaction pending...</div>
                <div class="transaction-link">
                    <a href="${explorerUrl}" target="_blank" rel="noopener noreferrer">
                        View on BaseScan
                    </a>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 30 seconds or when confirmed
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 30000);
    }

    // Get user's NFT collection from all Truth contracts
    async getUserCollection() {
        try {
            const balance = await this.contract.balanceOf(this.userAddress);
            const tokenIds = [];
            
            for (let i = 0; i < balance; i++) {
                const tokenId = await this.contract.tokenOfOwnerByIndex(this.userAddress, i);
                const tokenURI = await this.contract.tokenURI(tokenId);
                tokenIds.push({
                    id: tokenId.toString(),
                    uri: tokenURI
                });
            }
            
            return tokenIds;
        } catch (error) {
            console.error('Error getting user collection:', error);
            return [];
        }
    }

    // Check if user qualifies for any partner collection discounts
    async checkPartnerDiscounts() {
        try {
            // This would check against registered partner collections
            const partnerships = await fetch(`/api/partnerships/${this.userAddress}`);
            if (partnerships.ok) {
                const data = await partnerships.json();
                return data.discounts || [];
            }
            return [];
        } catch (error) {
            console.log('Could not check partner discounts:', error);
            return [];
        }
    }

    // Estimate gas for minting operation
    async estimateGas(operation, quantity = 1) {
        try {
            let gasEstimate;
            
            switch (operation) {
                case 'whitelist':
                    gasEstimate = await this.contract.estimateGas.mintWhitelist(this.merkleProof);
                    break;
                case 'public':
                    const price = await this.contract.calculateTotalPrice(quantity);
                    gasEstimate = await this.contract.estimateGas.mintPublic(quantity, { value: price });
                    break;
                default:
                    throw new Error('Invalid operation');
            }
            
            return {
                gasLimit: gasEstimate.toString(),
                gasLimitFormatted: gasEstimate.toNumber().toLocaleString()
            };
        } catch (error) {
            console.error('Error estimating gas:', error);
            return {
                gasLimit: '250000',
                gasLimitFormatted: '250,000'
            };
        }
    }

    // Get minting analytics for user
    async getMintingAnalytics() {
        try {
            const status = await this.getMintingStatus();
            const collection = await this.getUserCollection();
            const discounts = await this.checkPartnerDiscounts();
            
            return {
                userStats: {
                    totalMinted: collection.length,
                    canMintWhitelist: this.isWhitelisted && !status.hasWhitelistMinted,
                    canMintPublic: parseInt(status.userMintCount) < 2, // MAX_PER_WALLET
                    availableDiscounts: discounts.length
                },
                collectionStats: {
                    totalMinted: status.totalMinted,
                    remaining: status.remainingSupply,
                    currentPrice: status.currentPrice,
                    whitelistPrice: status.whitelistPrice
                },
                userCollection: collection
            };
        } catch (error) {
            console.error('Error getting minting analytics:', error);
            return null;
        }
    }
}

// Initialize enhanced minting interface when page loads
window.enhancedMinting = new EnhancedMintingInterface();

// Auto-initialize when contract addresses are available
document.addEventListener('DOMContentLoaded', () => {
    // Wait for contract addresses to be loaded
    const checkForContracts = setInterval(() => {
        if (window.contractAddresses && window.contractAddresses.EnhancedTheTruth) {
            const abi = [
                "function mintWhitelist(bytes32[] calldata proof) external payable",
                "function mintPublic(uint256 quantity) external payable",
                "function calculateTotalPrice(uint256 quantity) external view returns (uint256)",
                "function applyHolderDiscount(address holder, uint256 price) external view returns (uint256)",
                "function getCurrentPrice() external view returns (uint256)",
                "function getWhitelistPrice() external view returns (uint256)",
                "function mintingEnabled() external view returns (bool)",
                "function whitelistMintEnabled() external view returns (bool)",
                "function publicMintEnabled() external view returns (bool)",
                "function totalMinted() external view returns (uint256)",
                "function remainingSupply() external view returns (uint256)",
                "function mintedCount(address) external view returns (uint256)",
                "function hasMintedWhitelist(address) external view returns (bool)",
                "function balanceOf(address owner) external view returns (uint256)",
                "function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256)",
                "function tokenURI(uint256 tokenId) external view returns (string)",
                "function getHolderDiscount(address holder) external view returns (uint256)",
                "function isWhitelisted(address account, bytes32[] calldata proof) external view returns (bool)"
            ];
            
            window.enhancedMinting.initialize(window.contractAddresses.EnhancedTheTruth, abi);
            clearInterval(checkForContracts);
        }
    }, 1000);
    
    // Clear interval after 30 seconds to avoid infinite checking
    setTimeout(() => clearInterval(checkForContracts), 30000);
});