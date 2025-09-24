// Dynamic NFT Evolution System - Behavior-Based Metadata Updates
class DynamicNFTSystem {
    constructor() {
        this.evolutionTracker = new Map();
        this.behaviorMetrics = new Map();
        this.storyElements = new Map();
        this.metadataVersions = new Map();
        this.evolutionMilestones = new Map();
    }

    // Initialize dynamic NFT system
    async initialize() {
        try {
            await this.loadEvolutionData();
            this.setupBehaviorTracking();
            this.initializeStorySystem();
            this.startEvolutionEngine();
            
            console.log('🧬 Dynamic NFT evolution system initialized');
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize dynamic NFT system:', error);
            return false;
        }
    }

    // Track holder behavior and interactions
    trackHolderBehavior(tokenId, userAddress, behaviorData) {
        const {
            action, // 'stake', 'governance_vote', 'community_post', 'philosophy_submission', 'witness_validation'
            value,  // magnitude of action
            context,
            timestamp
        } = behaviorData;

        try {
            const behaviorKey = `${tokenId}_${userAddress.toLowerCase()}`;
            
            if (!this.behaviorMetrics.has(behaviorKey)) {
                this.behaviorMetrics.set(behaviorKey, {
                    tokenId: tokenId.toString(),
                    holderAddress: userAddress.toLowerCase(),
                    totalInteractions: 0,
                    behaviors: [],
                    scores: {
                        engagement: 0,
                        philosophy: 0,
                        community: 0,
                        truth_seeking: 0,
                        abundance_mindset: 0
                    },
                    evolutionStage: 0,
                    lastUpdate: new Date().toISOString()
                });
            }

            const metrics = this.behaviorMetrics.get(behaviorKey);
            
            // Add new behavior
            metrics.behaviors.push({
                action,
                value: value || 1,
                context: context || '',
                timestamp: timestamp || new Date().toISOString()
            });

            metrics.totalInteractions++;
            metrics.lastUpdate = new Date().toISOString();

            // Update behavior scores
            this.updateBehaviorScores(metrics, action, value);

            // Check for evolution triggers
            this.checkEvolutionTriggers(tokenId, metrics);

            console.log(`📊 Behavior tracked for token ${tokenId}: ${action}`);
            return true;

        } catch (error) {
            console.error('Error tracking holder behavior:', error);
            return false;
        }
    }

    // Update behavior scores based on actions
    updateBehaviorScores(metrics, action, value = 1) {
        const scoreMultiplier = Math.min(value, 10); // Cap multiplier at 10

        switch (action) {
            case 'stake':
                metrics.scores.engagement += 5 * scoreMultiplier;
                metrics.scores.abundance_mindset += 3 * scoreMultiplier;
                break;
            case 'governance_vote':
                metrics.scores.engagement += 8 * scoreMultiplier;
                metrics.scores.community += 6 * scoreMultiplier;
                break;
            case 'philosophy_submission':
                metrics.scores.philosophy += 10 * scoreMultiplier;
                metrics.scores.truth_seeking += 8 * scoreMultiplier;
                break;
            case 'witness_validation':
                metrics.scores.philosophy += 6 * scoreMultiplier;
                metrics.scores.truth_seeking += 9 * scoreMultiplier;
                metrics.scores.community += 4 * scoreMultiplier;
                break;
            case 'community_post':
                metrics.scores.community += 7 * scoreMultiplier;
                metrics.scores.engagement += 3 * scoreMultiplier;
                break;
            case 'content_access':
                metrics.scores.engagement += 2 * scoreMultiplier;
                break;
            case 'referral':
                metrics.scores.community += 5 * scoreMultiplier;
                metrics.scores.abundance_mindset += 4 * scoreMultiplier;
                break;
            case 'mentor':
                metrics.scores.philosophy += 8 * scoreMultiplier;
                metrics.scores.community += 9 * scoreMultiplier;
                break;
        }

        // Apply decay to prevent infinite growth
        Object.keys(metrics.scores).forEach(key => {
            metrics.scores[key] = Math.min(metrics.scores[key], 1000); // Cap at 1000
            metrics.scores[key] *= 0.9995; // Very slow decay
        });
    }

    // Check if NFT should evolve based on behavior
    checkEvolutionTriggers(tokenId, metrics) {
        const currentStage = metrics.evolutionStage;
        let newStage = currentStage;

        // Evolution stages based on behavior scores
        const totalScore = Object.values(metrics.scores).reduce((sum, score) => sum + score, 0);
        const balanceScore = this.calculateBalanceScore(metrics.scores);
        
        if (totalScore >= 2000 && balanceScore >= 0.7 && currentStage < 4) {
            newStage = 4; // Enlightened
        } else if (totalScore >= 1500 && balanceScore >= 0.6 && currentStage < 3) {
            newStage = 3; // Philosopher
        } else if (totalScore >= 1000 && balanceScore >= 0.5 && currentStage < 2) {
            newStage = 2; // Seeker
        } else if (totalScore >= 500 && currentStage < 1) {
            newStage = 1; // Awakening
        }

        // Trigger evolution if stage increased
        if (newStage > currentStage) {
            this.triggerEvolution(tokenId, metrics, newStage);
        }
    }

    // Calculate balance score (how evenly distributed the behavior scores are)
    calculateBalanceScore(scores) {
        const values = Object.values(scores);
        const total = values.reduce((sum, val) => sum + val, 0);
        
        if (total === 0) return 0;
        
        const average = total / values.length;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / values.length;
        const standardDeviation = Math.sqrt(variance);
        
        // Convert to balance score (0-1, higher is more balanced)
        return Math.max(0, 1 - (standardDeviation / average));
    }

    // Trigger NFT evolution
    async triggerEvolution(tokenId, metrics, newStage) {
        try {
            metrics.evolutionStage = newStage;
            
            // Generate new metadata based on evolution
            const evolutionData = await this.generateEvolutionMetadata(tokenId, metrics, newStage);
            
            // Update metadata on-chain (in production, this would update contract metadata)
            await this.updateNFTMetadata(tokenId, evolutionData);
            
            // Add to evolution history
            this.recordEvolution(tokenId, metrics.holderAddress, newStage, evolutionData);
            
            // Notify holder of evolution
            this.notifyEvolution(tokenId, metrics.holderAddress, evolutionData);
            
            console.log(`🦋 NFT ${tokenId} evolved to stage ${newStage}`);
            
        } catch (error) {
            console.error(`Error evolving NFT ${tokenId}:`, error);
        }
    }

    // Generate new metadata based on evolution stage
    async generateEvolutionMetadata(tokenId, metrics, stage) {
        const stageNames = ['Dormant', 'Awakening', 'Seeker', 'Philosopher', 'Enlightened'];
        const stageName = stageNames[stage] || 'Unknown';
        
        const baseMetadata = await this.getBaseMetadata(tokenId);
        
        const evolutionData = {
            name: `${baseMetadata.name} - ${stageName}`,
            description: this.generateEvolutionDescription(baseMetadata, metrics, stage),
            image: this.generateEvolutionImageURL(tokenId, stage, metrics),
            attributes: [
                ...baseMetadata.attributes || [],
                {
                    trait_type: "Evolution Stage",
                    value: stageName
                },
                {
                    trait_type: "Total Interactions",
                    value: metrics.totalInteractions
                },
                {
                    trait_type: "Engagement Level",
                    value: this.scoreToLevel(metrics.scores.engagement)
                },
                {
                    trait_type: "Philosophy Depth",
                    value: this.scoreToLevel(metrics.scores.philosophy)
                },
                {
                    trait_type: "Community Impact",
                    value: this.scoreToLevel(metrics.scores.community)
                },
                {
                    trait_type: "Truth Seeking",
                    value: this.scoreToLevel(metrics.scores.truth_seeking)
                },
                {
                    trait_type: "Abundance Mindset",
                    value: this.scoreToLevel(metrics.scores.abundance_mindset)
                },
                {
                    trait_type: "Balance Score",
                    value: Math.round(this.calculateBalanceScore(metrics.scores) * 100)
                },
                {
                    trait_type: "Evolution Date",
                    value: new Date().toISOString().split('T')[0]
                }
            ],
            properties: {
                evolution_stage: stage,
                holder_journey: this.generateHolderJourney(metrics),
                philosophical_alignment: this.calculatePhilosophicalAlignment(metrics),
                rarity_boost: this.calculateRarityBoost(stage, metrics),
                story_chapter: await this.getStoryChapter(tokenId, stage, metrics)
            }
        };

        return evolutionData;
    }

    // Generate evolution description based on holder behavior
    generateEvolutionDescription(baseMetadata, metrics, stage) {
        const stageDescriptions = {
            0: "A dormant Truth NFT, awaiting its holder's journey into philosophical enlightenment.",
            1: "The first stirrings of awareness have begun. This Truth NFT reflects its holder's initial steps toward philosophical understanding.",
            2: "A seeker's NFT, evolved through engagement with truth and community. The holder actively pursues deeper understanding.",
            3: "A philosopher's companion, shaped by thoughtful discourse and wisdom-seeking. This NFT embodies deep philosophical engagement.",
            4: "An enlightened Truth NFT, representing the culmination of philosophical growth, community leadership, and balanced understanding."
        };

        const behaviorInsights = this.generateBehaviorInsights(metrics);
        
        return `${stageDescriptions[stage]} ${behaviorInsights}`;
    }

    // Generate behavior-based insights
    generateBehaviorInsights(metrics) {
        const insights = [];
        
        if (metrics.scores.philosophy > 500) {
            insights.push("Marked by deep philosophical contemplation");
        }
        if (metrics.scores.community > 500) {
            insights.push("Strengthened by community leadership");
        }
        if (metrics.scores.truth_seeking > 500) {
            insights.push("Refined through truth-seeking dedication");
        }
        if (metrics.scores.abundance_mindset > 500) {
            insights.push("Enhanced by abundance mindset practices");
        }
        if (metrics.totalInteractions > 50) {
            insights.push("Enriched by extensive holder engagement");
        }

        if (insights.length === 0) {
            return "This NFT awaits further development through holder interaction.";
        }

        return insights.join(", ") + ".";
    }

    // Convert score to level description
    scoreToLevel(score) {
        if (score >= 800) return "Master";
        if (score >= 600) return "Expert";
        if (score >= 400) return "Proficient";
        if (score >= 200) return "Developing";
        if (score >= 50) return "Novice";
        return "Dormant";
    }

    // Generate holder journey narrative
    generateHolderJourney(metrics) {
        const journey = [];
        
        // Sort behaviors by timestamp to create chronological journey
        const sortedBehaviors = metrics.behaviors
            .slice()
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        // Group behaviors by type and summarize
        const behaviorSummary = {};
        sortedBehaviors.forEach(behavior => {
            behaviorSummary[behavior.action] = (behaviorSummary[behavior.action] || 0) + 1;
        });

        // Create journey narrative
        Object.entries(behaviorSummary).forEach(([action, count]) => {
            switch (action) {
                case 'stake':
                    journey.push(`Demonstrated commitment through ${count} staking actions`);
                    break;
                case 'governance_vote':
                    journey.push(`Participated in ${count} governance decisions`);
                    break;
                case 'philosophy_submission':
                    journey.push(`Contributed ${count} philosophical insights`);
                    break;
                case 'witness_validation':
                    journey.push(`Validated ${count} truth statements`);
                    break;
                case 'community_post':
                    journey.push(`Engaged in ${count} community discussions`);
                    break;
            }
        });

        return journey.length > 0 ? journey.join('; ') : 'Journey beginning...';
    }

    // Calculate philosophical alignment
    calculatePhilosophicalAlignment(metrics) {
        const scores = metrics.scores;
        const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
        
        if (total === 0) return 'Neutral';
        
        const maxScore = Math.max(...Object.values(scores));
        const dominantTrait = Object.keys(scores).find(key => scores[key] === maxScore);
        
        const alignments = {
            engagement: 'Active Participant',
            philosophy: 'Deep Thinker',
            community: 'Community Builder',
            truth_seeking: 'Truth Seeker',
            abundance_mindset: 'Abundance Advocate'
        };
        
        return alignments[dominantTrait] || 'Balanced Explorer';
    }

    // Calculate rarity boost based on evolution
    calculateRarityBoost(stage, metrics) {
        let boost = stage * 10; // Base boost per stage
        
        // Add bonuses for exceptional behavior
        const totalScore = Object.values(metrics.scores).reduce((sum, score) => sum + score, 0);
        boost += Math.min(Math.floor(totalScore / 100), 50); // Up to 50 bonus points
        
        // Balance bonus
        const balance = this.calculateBalanceScore(metrics.scores);
        boost += Math.floor(balance * 25); // Up to 25 balance bonus
        
        return Math.min(boost, 100); // Cap at 100%
    }

    // Interactive storytelling system
    async initializeStorySystem() {
        this.storyChapters = {
            0: {
                title: "The Dormant Truth",
                content: "In the digital realm, a Truth NFT lies dormant, waiting for the right soul to awaken its potential..."
            },
            1: {
                title: "First Light",
                content: "A spark ignites as the holder takes their first steps into philosophical exploration..."
            },
            2: {
                title: "The Seeker's Path",
                content: "Questions multiply as understanding deepens. The seeker walks the path of inquiry..."
            },
            3: {
                title: "Philosopher's Dawn",
                content: "Wisdom crystallizes through discourse and contemplation. A philosopher emerges..."
            },
            4: {
                title: "Enlightened Unity",
                content: "Balance achieved, truth integrated. The enlightened one becomes a beacon for others..."
            }
        };

        console.log('📖 Interactive story system initialized');
    }

    // Get story chapter for current evolution stage
    async getStoryChapter(tokenId, stage, metrics) {
        const baseChapter = this.storyChapters[stage];
        
        // Personalize story based on holder behavior
        const personalizedContent = await this.personalizeStoryContent(baseChapter, metrics);
        
        return {
            ...baseChapter,
            content: personalizedContent,
            unlockedAt: new Date().toISOString()
        };
    }

    // Personalize story content based on behavior
    async personalizeStoryContent(chapter, metrics) {
        let content = chapter.content;
        
        // Add personalized elements based on dominant traits
        const dominantTrait = this.getDominantTrait(metrics.scores);
        
        const personalizations = {
            philosophy: " Their mind, sharp with philosophical inquiry, cuts through illusion to reach deeper understanding.",
            community: " Through leadership and connection, they build bridges between minds and hearts.",
            truth_seeking: " With unwavering dedication to truth, they illuminate dark corners of misunderstanding.",
            abundance_mindset: " Recognizing infinite possibility, they transform scarcity into abundance for all.",
            engagement: " Through consistent action and participation, they shape the community's destiny."
        };
        
        if (personalizations[dominantTrait]) {
            content += personalizations[dominantTrait];
        }
        
        return content;
    }

    // Get dominant behavioral trait
    getDominantTrait(scores) {
        let maxScore = -1;
        let dominantTrait = 'engagement';
        
        Object.entries(scores).forEach(([trait, score]) => {
            if (score > maxScore) {
                maxScore = score;
                dominantTrait = trait;
            }
        });
        
        return dominantTrait;
    }

    // Generate evolution image URL (would integrate with image generation service)
    generateEvolutionImageURL(tokenId, stage, metrics) {
        // In production, this would generate dynamic images based on evolution
        const baseURL = `/api/dynamic-images`;
        const params = new URLSearchParams({
            tokenId: tokenId.toString(),
            stage: stage.toString(),
            dominantTrait: this.getDominantTrait(metrics.scores),
            totalScore: Object.values(metrics.scores).reduce((sum, score) => sum + score, 0).toString(),
            balance: this.calculateBalanceScore(metrics.scores).toString()
        });
        
        return `${baseURL}?${params.toString()}`;
    }

    // Record evolution in history
    recordEvolution(tokenId, holderAddress, newStage, evolutionData) {
        const evolutionKey = `${tokenId}_evolutions`;
        
        if (!this.evolutionMilestones.has(evolutionKey)) {
            this.evolutionMilestones.set(evolutionKey, []);
        }
        
        const evolutions = this.evolutionMilestones.get(evolutionKey);
        evolutions.push({
            stage: newStage,
            holder: holderAddress,
            timestamp: new Date().toISOString(),
            metadata: evolutionData,
            triggerEvent: 'behavior_threshold'
        });
    }

    // Notify holder of evolution
    notifyEvolution(tokenId, holderAddress, evolutionData) {
        // Create notification event
        const evolutionEvent = new CustomEvent('nftEvolved', {
            detail: {
                tokenId: tokenId.toString(),
                holder: holderAddress,
                evolutionData,
                message: `Your Truth NFT #${tokenId} has evolved to ${evolutionData.attributes.find(attr => attr.trait_type === 'Evolution Stage').value}!`
            }
        });
        
        window.dispatchEvent(evolutionEvent);
        
        console.log(`🎉 Evolution notification sent for token ${tokenId}`);
    }

    // Get NFT evolution status
    async getNFTEvolutionStatus(tokenId, holderAddress) {
        try {
            const behaviorKey = `${tokenId}_${holderAddress.toLowerCase()}`;
            const metrics = this.behaviorMetrics.get(behaviorKey);
            
            if (!metrics) {
                return {
                    tokenId: tokenId.toString(),
                    currentStage: 0,
                    nextStage: 1,
                    progress: 0,
                    requirements: this.getStageRequirements(1)
                };
            }
            
            const nextStage = metrics.evolutionStage + 1;
            const progress = this.calculateStageProgress(metrics, nextStage);
            
            return {
                tokenId: tokenId.toString(),
                currentStage: metrics.evolutionStage,
                nextStage: nextStage <= 4 ? nextStage : null,
                progress: progress,
                requirements: nextStage <= 4 ? this.getStageRequirements(nextStage) : null,
                metrics: metrics.scores,
                totalInteractions: metrics.totalInteractions,
                lastUpdate: metrics.lastUpdate,
                evolutionHistory: this.evolutionMilestones.get(`${tokenId}_evolutions`) || []
            };
            
        } catch (error) {
            console.error('Error getting NFT evolution status:', error);
            return null;
        }
    }

    // Get requirements for next stage
    getStageRequirements(stage) {
        const requirements = {
            1: { totalScore: 500, description: "Begin engaging with the Truth community" },
            2: { totalScore: 1000, balanceScore: 0.5, description: "Develop balanced philosophical engagement" },
            3: { totalScore: 1500, balanceScore: 0.6, description: "Demonstrate deep philosophical commitment" },
            4: { totalScore: 2000, balanceScore: 0.7, description: "Achieve mastery across all aspects of Truth" }
        };
        
        return requirements[stage] || null;
    }

    // Calculate progress toward next stage
    calculateStageProgress(metrics, nextStage) {
        const requirements = this.getStageRequirements(nextStage);
        if (!requirements) return 100;
        
        const totalScore = Object.values(metrics.scores).reduce((sum, score) => sum + score, 0);
        const balanceScore = this.calculateBalanceScore(metrics.scores);
        
        let progress = (totalScore / requirements.totalScore) * 70; // 70% weight on total score
        
        if (requirements.balanceScore) {
            progress += (balanceScore / requirements.balanceScore) * 30; // 30% weight on balance
        } else {
            progress += 30; // Full balance points if not required
        }
        
        return Math.min(Math.round(progress), 100);
    }

    // Load existing evolution data from storage
    async loadEvolutionData() {
        try {
            const stored = localStorage.getItem('dynamic_nft_data');
            if (stored) {
                const data = JSON.parse(stored);
                
                if (data.behaviorMetrics) {
                    Object.entries(data.behaviorMetrics).forEach(([key, value]) => {
                        this.behaviorMetrics.set(key, value);
                    });
                }
                
                if (data.evolutionMilestones) {
                    Object.entries(data.evolutionMilestones).forEach(([key, value]) => {
                        this.evolutionMilestones.set(key, value);
                    });
                }
            }
        } catch (error) {
            console.log('No existing evolution data found');
        }
    }

    // Setup behavior tracking events
    setupBehaviorTracking() {
        // Listen for various platform events
        window.addEventListener('tokenStaked', (event) => {
            this.trackHolderBehavior(
                event.detail.tokenId,
                event.detail.holder,
                { action: 'stake', value: event.detail.amount }
            );
        });
        
        window.addEventListener('governanceVote', (event) => {
            this.trackHolderBehavior(
                event.detail.tokenId,
                event.detail.voter,
                { action: 'governance_vote', context: event.detail.proposalId }
            );
        });
        
        // Add more event listeners as needed
        console.log('🎯 Behavior tracking events setup complete');
    }

    // Start evolution engine (periodic checks)
    startEvolutionEngine() {
        // Check for potential evolutions every 5 minutes
        setInterval(() => {
            this.processEvolutionQueue();
        }, 5 * 60 * 1000);
        
        console.log('🔄 Evolution engine started');
    }

    // Process evolution queue
    processEvolutionQueue() {
        // Check all behavior metrics for evolution triggers
        for (const [key, metrics] of this.behaviorMetrics.entries()) {
            const tokenId = metrics.tokenId;
            this.checkEvolutionTriggers(tokenId, metrics);
        }
        
        // Save data to localStorage
        this.saveEvolutionData();
    }

    // Save evolution data to localStorage
    saveEvolutionData() {
        try {
            const data = {
                behaviorMetrics: Object.fromEntries(this.behaviorMetrics),
                evolutionMilestones: Object.fromEntries(this.evolutionMilestones)
            };
            
            localStorage.setItem('dynamic_nft_data', JSON.stringify(data));
        } catch (error) {
            console.error('Error saving evolution data:', error);
        }
    }

    // Helper methods
    async getBaseMetadata(tokenId) {
        // In production, fetch from contract or IPFS
        return {
            name: `The Truth #${tokenId}`,
            description: "A philosophical NFT that evolves with its holder's journey",
            attributes: [
                { trait_type: "Collection", value: "The Truth" },
                { trait_type: "Token ID", value: tokenId.toString() }
            ]
        };
    }

    async updateNFTMetadata(tokenId, newMetadata) {
        // In production, this would update contract metadata or IPFS
        const metadataKey = `metadata_${tokenId}`;
        
        if (!this.metadataVersions.has(metadataKey)) {
            this.metadataVersions.set(metadataKey, []);
        }
        
        const versions = this.metadataVersions.get(metadataKey);
        versions.push({
            version: versions.length + 1,
            metadata: newMetadata,
            timestamp: new Date().toISOString()
        });
        
        console.log(`📝 Metadata updated for token ${tokenId}`);
    }
}

// Global dynamic NFT system instance
window.dynamicNFTSystem = new DynamicNFTSystem();

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    window.dynamicNFTSystem.initialize().then(success => {
        if (success) {
            console.log('🌟 Dynamic NFT evolution system ready');
        }
    });
});