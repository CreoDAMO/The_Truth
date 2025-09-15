// Enhanced Community Features - Token-Gated Access and Social Platform
class CommunityPlatform {
    constructor() {
        this.discordBot = null;
        this.holderVerification = new Map();
        this.contentPlatform = new Map();
        this.stakingContracts = new Map();
        this.socialGraph = new Map();
        this.reputation = new Map();
    }

    // Initialize community platform
    async initialize() {
        try {
            await this.setupHolderVerification();
            await this.initializeContentPlatform();
            await this.setupStakingSystem();
            await this.initializeSocialFeatures();
            
            console.log('🏛️ Community platform initialized successfully');
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize community platform:', error);
            return false;
        }
    }

    // Token-gated Discord integration
    async setupDiscordIntegration(userAddress, discordUserId) {
        try {
            // Verify NFT holdings
            const holdings = await this.verifyHolderStatus(userAddress);
            
            if (holdings.total === 0) {
                return {
                    success: false,
                    error: 'No Truth NFTs detected in wallet'
                };
            }

            // Determine access level based on holdings
            const accessLevel = this.calculateDiscordAccessLevel(holdings);
            
            // Generate temporary verification code
            const verificationCode = this.generateVerificationCode(userAddress, discordUserId);
            
            // Store verification data
            this.holderVerification.set(verificationCode, {
                address: userAddress.toLowerCase(),
                discordId: discordUserId,
                holdings: holdings,
                accessLevel: accessLevel,
                createdAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
                verified: false
            });

            // Send to Discord bot for role assignment
            const discordResult = await this.requestDiscordRoleAssignment({
                userId: discordUserId,
                accessLevel: accessLevel,
                holdings: holdings,
                verificationCode: verificationCode
            });

            return {
                success: true,
                verificationCode: verificationCode,
                accessLevel: accessLevel,
                holdings: holdings,
                discordInvite: discordResult.inviteUrl,
                channels: this.getChannelsByAccessLevel(accessLevel)
            };

        } catch (error) {
            console.error('❌ Discord integration error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Verify holder status across all Truth contracts
    async verifyHolderStatus(address) {
        const holdings = {
            truthOriginal: 0,
            truthBonusGift: 0,
            truthPartThree: 0,
            truthTokens: 0,
            creatorTokens: 0,
            total: 0,
            firstHoldDate: null,
            holderType: 'none'
        };

        try {
            if (!window.ethereum) {
                throw new Error('Web3 provider not available');
            }

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            
            // Check NFT contracts
            const nftContracts = [
                { name: 'truthOriginal', address: window.contractAddresses?.TheTruth },
                { name: 'truthBonusGift', address: window.contractAddresses?.TruthBonusGift },
                { name: 'truthPartThree', address: window.contractAddresses?.TruthPartThree }
            ];

            const nftABI = ['function balanceOf(address owner) view returns (uint256)'];

            for (const { name, address } of nftContracts) {
                if (address) {
                    const contract = new ethers.Contract(address, nftABI, provider);
                    const balance = await contract.balanceOf(address);
                    holdings[name] = balance.toNumber();
                    holdings.total += holdings[name];
                }
            }

            // Check token contracts
            const tokenContracts = [
                { name: 'truthTokens', address: '0x8f6cf6f7747e170f4768533b869c339dc3d30a3c' },
                { name: 'creatorTokens', address: '0x22b0434e89882f8e6841d340b28427646c015aa7' }
            ];

            const tokenABI = [
                'function balanceOf(address owner) view returns (uint256)',
                'function decimals() view returns (uint8)'
            ];

            for (const { name, address } of tokenContracts) {
                try {
                    const contract = new ethers.Contract(address, tokenABI, provider);
                    const [balance, decimals] = await Promise.all([
                        contract.balanceOf(address),
                        contract.decimals()
                    ]);
                    
                    holdings[name] = parseFloat(ethers.utils.formatUnits(balance, decimals));
                } catch (e) {
                    console.log(`Could not check ${name} balance:`, e.message);
                }
            }

            // Determine holder type
            holdings.holderType = this.determineHolderType(holdings);

            return holdings;

        } catch (error) {
            console.error('Error verifying holder status:', error);
            return holdings;
        }
    }

    // Calculate Discord access level based on holdings
    calculateDiscordAccessLevel(holdings) {
        let level = 'visitor';
        let score = 0;

        // NFT-based scoring
        score += holdings.truthOriginal * 100;      // Original NFTs are most valuable
        score += holdings.truthPartThree * 75;     // Part Three NFTs are high value
        score += holdings.truthBonusGift * 25;     // Bonus gifts are accessible

        // Token-based scoring
        score += Math.min(holdings.truthTokens / 1000, 50);    // Up to 50 points for TRUTH tokens
        score += Math.min(holdings.creatorTokens / 10000, 30); // Up to 30 points for Creator tokens

        // Determine access level
        if (score >= 200) {
            level = 'philosopher_king';
        } else if (score >= 150) {
            level = 'truth_seeker';
        } else if (score >= 100) {
            level = 'witness';
        } else if (score >= 50) {
            level = 'apprentice';
        } else if (holdings.total > 0) {
            level = 'initiate';
        }

        return {
            level: level,
            score: score,
            perks: this.getAccessLevelPerks(level)
        };
    }

    // Get channels available by access level
    getChannelsByAccessLevel(accessLevel) {
        const channelMap = {
            visitor: ['general'],
            initiate: ['general', 'newcomers'],
            apprentice: ['general', 'newcomers', 'philosophy-101'],
            witness: ['general', 'newcomers', 'philosophy-101', 'truth-validation'],
            truth_seeker: ['general', 'newcomers', 'philosophy-101', 'truth-validation', 'advanced-discussions', 'governance'],
            philosopher_king: ['general', 'newcomers', 'philosophy-101', 'truth-validation', 'advanced-discussions', 'governance', 'inner-circle', 'alpha-insights']
        };

        return channelMap[accessLevel.level] || channelMap.visitor;
    }

    // Get perks for access level
    getAccessLevelPerks(level) {
        const perkMap = {
            visitor: ['Read access to general channel'],
            initiate: ['Basic Discord access', 'Newcomer support'],
            apprentice: ['Philosophy 101 access', 'Educational resources'],
            witness: ['Truth validation participation', 'Community events'],
            truth_seeker: ['Advanced discussions', 'Governance voting', 'Early access to content'],
            philosopher_king: ['Inner circle access', 'Alpha insights', 'Direct creator communication', 'Special NFT airdrops']
        };

        return perkMap[level] || perkMap.visitor;
    }

    // Content platform for token holders
    async initializeContentPlatform() {
        this.contentTiers = {
            public: {
                minTokens: 0,
                content: ['Blog posts', 'Basic philosophy content', 'Community updates']
            },
            premium: {
                minTokens: 100,
                content: ['Extended philosophy papers', 'Audio commentaries', 'Live discussions']
            },
            exclusive: {
                minTokens: 1000,
                content: ['Unreleased content', 'Private discussions', 'Alpha insights']
            },
            inner_circle: {
                minTokens: 5000,
                content: ['Direct creator access', 'Strategic insights', 'Co-creation opportunities']
            }
        };

        console.log('📚 Content platform tiers initialized');
    }

    // Get content access for a holder
    async getContentAccess(userAddress) {
        try {
            const holdings = await this.verifyHolderStatus(userAddress);
            const totalTokens = holdings.truthTokens + (holdings.creatorTokens * 0.1); // Creator tokens at 10% weight
            
            let accessTier = 'public';
            if (totalTokens >= 5000) accessTier = 'inner_circle';
            else if (totalTokens >= 1000) accessTier = 'exclusive';
            else if (totalTokens >= 100) accessTier = 'premium';

            const accessibleContent = [];
            
            // Add all content up to user's tier level
            Object.entries(this.contentTiers).forEach(([tier, data]) => {
                if (totalTokens >= data.minTokens) {
                    accessibleContent.push(...data.content);
                }
            });

            return {
                accessTier,
                totalTokens,
                accessibleContent: [...new Set(accessibleContent)], // Remove duplicates
                restrictedContent: this.getRestrictedContent(accessTier)
            };

        } catch (error) {
            console.error('Error getting content access:', error);
            return {
                accessTier: 'public',
                totalTokens: 0,
                accessibleContent: this.contentTiers.public.content,
                restrictedContent: []
            };
        }
    }

    // Staking system for TRUTH tokens
    async setupStakingSystem() {
        this.stakingPools = {
            truth_pool: {
                token: 'TRUTH',
                minStake: 100,
                apy: 12, // 12% APY
                rewards: ['Governance voting power', 'Premium content access', 'Discord perks']
            },
            philosophy_pool: {
                token: 'TRUTH',
                minStake: 1000,
                apy: 18, // 18% APY for higher commitment
                rewards: ['Enhanced voting power', 'Exclusive content', 'Direct creator access']
            },
            creator_pool: {
                token: 'CREATOR',
                minStake: 5000,
                apy: 15, // 15% APY
                rewards: ['Revenue sharing', 'Co-creation opportunities', 'Priority support']
            }
        };

        console.log('💎 Staking system initialized');
    }

    // Stake tokens
    async stakeTokens(userAddress, poolId, amount) {
        try {
            const pool = this.stakingPools[poolId];
            if (!pool) {
                throw new Error('Invalid staking pool');
            }

            if (amount < pool.minStake) {
                throw new Error(`Minimum stake is ${pool.minStake} ${pool.token}`);
            }

            // Simulate staking transaction (in production, this would interact with smart contracts)
            const stakingData = {
                user: userAddress.toLowerCase(),
                pool: poolId,
                amount: amount,
                apy: pool.apy,
                stakedAt: new Date().toISOString(),
                rewards: pool.rewards,
                status: 'active'
            };

            // Store staking information
            const userStakes = this.stakingContracts.get(userAddress.toLowerCase()) || [];
            userStakes.push(stakingData);
            this.stakingContracts.set(userAddress.toLowerCase(), userStakes);

            return {
                success: true,
                stakingId: `stake_${Date.now()}`,
                stakingData,
                message: `Successfully staked ${amount} ${pool.token} tokens`
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Social features and holder networking
    async initializeSocialFeatures() {
        this.socialFeatures = {
            holderProfiles: new Map(),
            holderConnections: new Map(),
            philosophyCircles: new Map(),
            collaborations: new Map()
        };

        console.log('🤝 Social features initialized');
    }

    // Create or update holder profile
    async updateHolderProfile(userAddress, profileData) {
        const {
            displayName,
            bio,
            philosophicalInterests,
            expertise,
            lookingFor, // 'collaboration', 'discussion', 'mentorship'
            socialLinks
        } = profileData;

        try {
            const holdings = await this.verifyHolderStatus(userAddress);
            
            const profile = {
                address: userAddress.toLowerCase(),
                displayName: displayName || `Truth Holder ${userAddress.slice(-6)}`,
                bio: bio || '',
                philosophicalInterests: philosophicalInterests || [],
                expertise: expertise || [],
                lookingFor: lookingFor || [],
                socialLinks: socialLinks || {},
                holdings: holdings,
                reputation: this.reputation.get(userAddress.toLowerCase()) || 0,
                joinedAt: new Date().toISOString(),
                lastActive: new Date().toISOString(),
                connections: 0,
                visibility: 'holders_only' // public, holders_only, private
            };

            this.socialFeatures.holderProfiles.set(userAddress.toLowerCase(), profile);

            return {
                success: true,
                profile: profile,
                message: 'Profile updated successfully'
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Find compatible holders for networking
    async findCompatibleHolders(userAddress, preferences = {}) {
        try {
            const userProfile = this.socialFeatures.holderProfiles.get(userAddress.toLowerCase());
            if (!userProfile) {
                throw new Error('User profile not found');
            }

            const recommendations = [];

            for (const [address, profile] of this.socialFeatures.holderProfiles.entries()) {
                if (address === userAddress.toLowerCase()) continue;
                
                // Calculate compatibility score
                let compatibilityScore = 0;
                
                // Philosophical interests overlap
                const commonInterests = userProfile.philosophicalInterests.filter(
                    interest => profile.philosophicalInterests.includes(interest)
                );
                compatibilityScore += commonInterests.length * 20;

                // Expertise complementarity
                const complementarySkills = userProfile.lookingFor.filter(
                    skill => profile.expertise.includes(skill)
                );
                compatibilityScore += complementarySkills.length * 30;

                // Similar holder level
                if (userProfile.holdings.holderType === profile.holdings.holderType) {
                    compatibilityScore += 10;
                }

                // Reputation consideration
                compatibilityScore += Math.min(profile.reputation / 10, 20);

                if (compatibilityScore >= 30) { // Minimum threshold
                    recommendations.push({
                        profile: {
                            address: profile.address,
                            displayName: profile.displayName,
                            bio: profile.bio,
                            philosophicalInterests: profile.philosophicalInterests,
                            expertise: profile.expertise,
                            holderType: profile.holdings.holderType,
                            reputation: profile.reputation
                        },
                        compatibilityScore,
                        commonInterests,
                        complementarySkills
                    });
                }
            }

            // Sort by compatibility score
            recommendations.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

            return {
                success: true,
                recommendations: recommendations.slice(0, 10), // Top 10
                totalFound: recommendations.length
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Philosophy discussion circles
    async createPhilosophyCircle(creatorAddress, circleData) {
        const {
            name,
            description,
            topic,
            maxMembers,
            accessRequirement, // 'any_holder', 'min_tokens', 'specific_nft'
            accessValue,
            isPrivate
        } = circleData;

        try {
            const circleId = `circle_${Date.now()}`;
            
            const circle = {
                id: circleId,
                name,
                description,
                topic,
                creator: creatorAddress.toLowerCase(),
                maxMembers: maxMembers || 20,
                currentMembers: 1,
                accessRequirement,
                accessValue: accessValue || 0,
                isPrivate: isPrivate || false,
                createdAt: new Date().toISOString(),
                members: [creatorAddress.toLowerCase()],
                discussions: [],
                status: 'active'
            };

            this.socialFeatures.philosophyCircles.set(circleId, circle);

            return {
                success: true,
                circleId,
                circle,
                message: 'Philosophy circle created successfully'
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Helper methods
    determineHolderType(holdings) {
        if (holdings.truthOriginal > 0) return 'original_holder';
        if (holdings.truthPartThree > 0) return 'philosopher';
        if (holdings.truthBonusGift > 2) return 'collector';
        if (holdings.truthBonusGift > 0) return 'initiate';
        if (holdings.truthTokens > 1000) return 'token_holder';
        return 'community_member';
    }

    generateVerificationCode(address, discordId) {
        const data = address + discordId + Date.now();
        return 'verify_' + this.simpleHash(data);
    }

    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(36);
    }

    getRestrictedContent(accessTier) {
        const allTiers = Object.keys(this.contentTiers);
        const currentIndex = allTiers.indexOf(accessTier);
        const restrictedTiers = allTiers.slice(currentIndex + 1);
        
        let restricted = [];
        restrictedTiers.forEach(tier => {
            restricted.push(...this.contentTiers[tier].content);
        });
        
        return restricted;
    }

    // Discord bot integration (placeholder - would connect to actual Discord bot)
    async requestDiscordRoleAssignment(data) {
        try {
            // This would make an API call to your Discord bot
            console.log('Discord role assignment requested:', data);
            
            return {
                success: true,
                inviteUrl: 'https://discord.gg/thetruth', // Your actual Discord invite
                message: 'Discord roles will be assigned within 5 minutes'
            };
        } catch (error) {
            return {
                success: false,
                error: 'Discord integration temporarily unavailable'
            };
        }
    }
}

// Global community platform instance
window.communityPlatform = new CommunityPlatform();

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    window.communityPlatform.initialize().then(success => {
        if (success) {
            console.log('🌟 Enhanced community features ready');
        }
    });
});