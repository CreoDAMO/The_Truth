// Truth Witness System - Advanced Community Validation Platform
class TruthWitnessSystem {
    constructor() {
        this.statements = new Map();
        this.witnesses = new Map();
        this.validations = new Map();
        this.reputationScores = new Map();
        this.categories = [
            'Philosophical Truth',
            'Institutional Translation',
            'Abundance Recognition', 
            'Paradox Resolution',
            'Truth Witnessing',
            'Systemic Insight'
        ];
    }

    // Initialize the Truth Witness System
    async initialize() {
        try {
            await this.loadExistingData();
            this.setupEventListeners();
            this.startPeriodicUpdates();
            console.log('🎯 Truth Witness System initialized');
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize Truth Witness System:', error);
            return false;
        }
    }

    // Submit a truth statement for community validation
    async submitTruthStatement(data) {
        const {
            statement,
            category,
            context,
            supporting_evidence,
            submitter_address,
            philosophical_framework
        } = data;

        try {
            // Validate input
            if (!statement || statement.length < 50) {
                throw new Error('Statement must be at least 50 characters');
            }

            if (!this.categories.includes(category)) {
                throw new Error('Invalid category');
            }

            // Create unique statement ID
            const statementId = this.generateStatementId(statement, submitter_address);
            
            // Structure the statement
            const truthStatement = {
                id: statementId,
                statement: statement.trim(),
                category,
                context: context || '',
                supporting_evidence: supporting_evidence || [],
                submitter_address: submitter_address.toLowerCase(),
                philosophical_framework: philosophical_framework || 'General',
                submitted_at: new Date().toISOString(),
                validation_status: 'pending',
                witness_count: 0,
                truth_score: 0,
                institutional_gap_score: 0,
                abundance_impact: 0,
                witnesses: [],
                challenges: [],
                metadata: {
                    word_count: statement.split(' ').length,
                    complexity_score: this.calculateComplexityScore(statement),
                    novelty_score: await this.calculateNoveltyScore(statement)
                }
            };

            // Store statement
            this.statements.set(statementId, truthStatement);
            
            // Save to persistent storage
            await this.saveToIPFS(truthStatement);
            
            // Notify community
            this.broadcastNewStatement(truthStatement);
            
            console.log(`📝 Truth statement submitted: ${statementId}`);
            return {
                success: true,
                statementId,
                message: 'Truth statement submitted for community validation'
            };

        } catch (error) {
            console.error('❌ Error submitting truth statement:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Witness (validate) a truth statement
    async witnessStatement(statementId, witnessData) {
        const {
            witness_address,
            validation_type, // 'witness', 'challenge', 'amplify'
            reasoning,
            truth_alignment_score, // 0-100
            institutional_gap_assessment, // 0-100
            abundance_impact_score, // 0-100
            supporting_examples,
            philosophical_critique
        } = witnessData;

        try {
            const statement = this.statements.get(statementId);
            if (!statement) {
                throw new Error('Statement not found');
            }

            // Check if already witnessed by this address
            const existingWitness = statement.witnesses.find(w => w.address === witness_address.toLowerCase());
            if (existingWitness) {
                throw new Error('Address has already witnessed this statement');
            }

            // Verify witness eligibility (NFT holder check)
            const isEligible = await this.verifyWitnessEligibility(witness_address);
            if (!isEligible) {
                throw new Error('Address not eligible to witness (must hold Truth NFT)');
            }

            // Create witness record
            const witness = {
                id: this.generateWitnessId(statementId, witness_address),
                statement_id: statementId,
                witness_address: witness_address.toLowerCase(),
                validation_type,
                reasoning: reasoning.trim(),
                scores: {
                    truth_alignment: Math.max(0, Math.min(100, truth_alignment_score)),
                    institutional_gap: Math.max(0, Math.min(100, institutional_gap_assessment)),
                    abundance_impact: Math.max(0, Math.min(100, abundance_impact_score))
                },
                supporting_examples: supporting_examples || [],
                philosophical_critique: philosophical_critique || '',
                witnessed_at: new Date().toISOString(),
                weight: await this.calculateWitnessWeight(witness_address),
                reputation_bonus: this.getReputationBonus(witness_address)
            };

            // Add witness to statement
            statement.witnesses.push(witness);
            statement.witness_count = statement.witnesses.length;

            // Recalculate statement scores
            this.updateStatementScores(statement);

            // Update witness reputation
            this.updateWitnessReputation(witness_address, witness);

            // Check for validation milestones
            this.checkValidationMilestones(statement);

            // Save updates
            await this.saveStatementUpdate(statement);

            console.log(`👁️ Statement witnessed: ${statementId} by ${witness_address}`);
            return {
                success: true,
                witnessId: witness.id,
                message: 'Statement successfully witnessed',
                new_scores: {
                    truth_score: statement.truth_score,
                    institutional_gap: statement.institutional_gap_score,
                    abundance_impact: statement.abundance_impact
                }
            };

        } catch (error) {
            console.error('❌ Error witnessing statement:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Challenge a truth statement with counter-evidence
    async challengeStatement(statementId, challengeData) {
        const {
            challenger_address,
            challenge_reasoning,
            counter_evidence,
            philosophical_objection,
            proposed_correction
        } = challengeData;

        try {
            const statement = this.statements.get(statementId);
            if (!statement) {
                throw new Error('Statement not found');
            }

            const challenge = {
                id: this.generateChallengeId(statementId, challenger_address),
                statement_id: statementId,
                challenger_address: challenger_address.toLowerCase(),
                reasoning: challenge_reasoning,
                counter_evidence: counter_evidence || [],
                philosophical_objection: philosophical_objection || '',
                proposed_correction: proposed_correction || '',
                challenged_at: new Date().toISOString(),
                support_count: 0,
                rejection_count: 0,
                status: 'active'
            };

            if (!statement.challenges) {
                statement.challenges = [];
            }
            statement.challenges.push(challenge);

            // Reduce statement confidence based on challenge quality
            const challengeQuality = this.assessChallengeQuality(challenge);
            statement.truth_score *= (1 - challengeQuality * 0.1);

            await this.saveStatementUpdate(statement);

            console.log(`⚡ Statement challenged: ${statementId}`);
            return {
                success: true,
                challengeId: challenge.id,
                message: 'Challenge submitted successfully'
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Get community validation dashboard
    async getValidationDashboard(address = null) {
        try {
            const dashboard = {
                total_statements: this.statements.size,
                pending_validation: 0,
                validated_statements: 0,
                top_categories: {},
                recent_activity: [],
                philosophy_metrics: {
                    collective_truth_score: 0,
                    institutional_gap_average: 0,
                    abundance_recognition: 0,
                    witness_engagement: 0
                },
                leaderboard: {
                    top_witnesses: [],
                    top_contributors: [],
                    rising_philosophers: []
                }
            };

            // Process all statements
            let totalTruthScore = 0;
            let totalGapScore = 0;
            let totalAbundanceScore = 0;
            
            for (const [id, statement] of this.statements.entries()) {
                // Count by validation status
                if (statement.validation_status === 'pending') {
                    dashboard.pending_validation++;
                } else if (statement.validation_status === 'validated') {
                    dashboard.validated_statements++;
                }

                // Category counts
                dashboard.top_categories[statement.category] = 
                    (dashboard.top_categories[statement.category] || 0) + 1;

                // Aggregate scores
                totalTruthScore += statement.truth_score;
                totalGapScore += statement.institutional_gap_score;
                totalAbundanceScore += statement.abundance_impact;

                // Recent activity
                if (statement.witnesses.length > 0) {
                    dashboard.recent_activity.push({
                        type: 'witness',
                        statement_id: id,
                        statement_preview: statement.statement.substring(0, 100) + '...',
                        timestamp: statement.witnesses[statement.witnesses.length - 1].witnessed_at,
                        witness_count: statement.witnesses.length
                    });
                }
            }

            // Calculate averages
            const statementCount = Math.max(1, this.statements.size);
            dashboard.philosophy_metrics.collective_truth_score = totalTruthScore / statementCount;
            dashboard.philosophy_metrics.institutional_gap_average = totalGapScore / statementCount;
            dashboard.philosophy_metrics.abundance_recognition = totalAbundanceScore / statementCount;
            dashboard.philosophy_metrics.witness_engagement = this.calculateWitnessEngagement();

            // Generate leaderboards
            dashboard.leaderboard = this.generateLeaderboards();

            // Sort recent activity by timestamp
            dashboard.recent_activity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            dashboard.recent_activity = dashboard.recent_activity.slice(0, 20);

            return dashboard;

        } catch (error) {
            console.error('❌ Error generating validation dashboard:', error);
            return null;
        }
    }

    // Get personalized witness insights for an address
    async getWitnessInsights(address) {
        const lowerAddress = address.toLowerCase();
        
        try {
            const insights = {
                reputation_score: this.getReputationScore(lowerAddress),
                witness_count: 0,
                statements_submitted: 0,
                categories_active: new Set(),
                validation_accuracy: 0,
                philosophy_alignment: {
                    truth_seeking: 0,
                    institutional_awareness: 0,
                    abundance_mindset: 0,
                    paradox_resolution: 0
                },
                achievements: [],
                recommended_statements: []
            };

            // Process user's witnessing activity
            for (const [statementId, statement] of this.statements.entries()) {
                // Count submitted statements
                if (statement.submitter_address === lowerAddress) {
                    insights.statements_submitted++;
                    insights.categories_active.add(statement.category);
                }

                // Count witnessed statements
                const userWitness = statement.witnesses.find(w => w.witness_address === lowerAddress);
                if (userWitness) {
                    insights.witness_count++;
                    insights.categories_active.add(statement.category);
                    
                    // Aggregate philosophy alignment scores
                    insights.philosophy_alignment.truth_seeking += userWitness.scores.truth_alignment;
                    insights.philosophy_alignment.institutional_awareness += userWitness.scores.institutional_gap;
                    insights.philosophy_alignment.abundance_mindset += userWitness.scores.abundance_impact;
                }
            }

            // Calculate averages
            if (insights.witness_count > 0) {
                insights.philosophy_alignment.truth_seeking /= insights.witness_count;
                insights.philosophy_alignment.institutional_awareness /= insights.witness_count;
                insights.philosophy_alignment.abundance_mindset /= insights.witness_count;
            }

            insights.categories_active = Array.from(insights.categories_active);

            // Generate achievements
            insights.achievements = this.calculateAchievements(lowerAddress, insights);

            // Get recommended statements for witnessing
            insights.recommended_statements = this.getRecommendedStatements(lowerAddress, insights);

            return insights;

        } catch (error) {
            console.error('❌ Error generating witness insights:', error);
            return null;
        }
    }

    // Helper methods
    generateStatementId(statement, address) {
        const hash = this.simpleHash(statement + address + Date.now());
        return `truth_${hash}`;
    }

    generateWitnessId(statementId, address) {
        return `witness_${statementId}_${address.slice(-8)}`;
    }

    generateChallengeId(statementId, address) {
        return `challenge_${statementId}_${address.slice(-8)}`;
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

    calculateComplexityScore(statement) {
        const words = statement.split(' ');
        const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
        const sentenceCount = statement.split(/[.!?]+/).length;
        return Math.min(100, (avgWordLength * 5) + (sentenceCount * 2));
    }

    async calculateNoveltyScore(statement) {
        // Simple novelty calculation - in production, use semantic similarity
        let noveltyScore = 80; // Base score
        
        for (const [id, existingStatement] of this.statements.entries()) {
            const similarity = this.calculateStringSimilarity(statement, existingStatement.statement);
            if (similarity > 0.7) {
                noveltyScore -= 20;
            }
        }
        
        return Math.max(0, noveltyScore);
    }

    calculateStringSimilarity(str1, str2) {
        const words1 = str1.toLowerCase().split(' ');
        const words2 = str2.toLowerCase().split(' ');
        const commonWords = words1.filter(word => words2.includes(word));
        return (commonWords.length * 2) / (words1.length + words2.length);
    }

    async verifyWitnessEligibility(address) {
        try {
            // Check if address holds any Truth NFTs
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                
                // Check against all Truth contracts
                const contracts = ['TheTruth', 'TruthBonusGift', 'TruthPartThree'];
                
                for (const contractName of contracts) {
                    if (window.contractAddresses && window.contractAddresses[contractName]) {
                        const contract = new ethers.Contract(
                            window.contractAddresses[contractName],
                            ['function balanceOf(address owner) view returns (uint256)'],
                            provider
                        );
                        
                        const balance = await contract.balanceOf(address);
                        if (balance.gt(0)) {
                            return true;
                        }
                    }
                }
            }
            
            return false;
        } catch (error) {
            console.log('Could not verify witness eligibility:', error.message);
            return false; // Fail closed
        }
    }

    async calculateWitnessWeight(address) {
        // Base weight is 1, increased by reputation and NFT holdings
        let weight = 1.0;
        
        // Add reputation bonus
        const reputation = this.getReputationScore(address);
        weight += reputation / 1000; // Up to +0.1 for max reputation
        
        // Add NFT holding bonus
        try {
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const contracts = ['TheTruth', 'TruthBonusGift', 'TruthPartThree'];
                
                for (const contractName of contracts) {
                    if (window.contractAddresses && window.contractAddresses[contractName]) {
                        const contract = new ethers.Contract(
                            window.contractAddresses[contractName],
                            ['function balanceOf(address owner) view returns (uint256)'],
                            provider
                        );
                        
                        const balance = await contract.balanceOf(address);
                        weight += balance.toNumber() * 0.1; // Each NFT adds 0.1 weight
                    }
                }
            }
        } catch (error) {
            // Continue with base weight
        }
        
        return Math.min(weight, 3.0); // Cap at 3x weight
    }

    updateStatementScores(statement) {
        if (statement.witnesses.length === 0) return;

        let totalTruthScore = 0;
        let totalGapScore = 0;
        let totalAbundanceScore = 0;
        let totalWeight = 0;

        // Weight-adjusted score calculation
        statement.witnesses.forEach(witness => {
            const weight = witness.weight || 1.0;
            totalTruthScore += witness.scores.truth_alignment * weight;
            totalGapScore += witness.scores.institutional_gap * weight;
            totalAbundanceScore += witness.scores.abundance_impact * weight;
            totalWeight += weight;
        });

        statement.truth_score = totalTruthScore / totalWeight;
        statement.institutional_gap_score = totalGapScore / totalWeight;
        statement.abundance_impact = totalAbundanceScore / totalWeight;

        // Update validation status based on scores and witness count
        if (statement.witness_count >= 3) {
            if (statement.truth_score >= 80) {
                statement.validation_status = 'validated';
            } else if (statement.truth_score >= 60) {
                statement.validation_status = 'under_review';
            } else {
                statement.validation_status = 'disputed';
            }
        }
    }

    // Additional methods would be implemented here...
    // This is a comprehensive foundation for the Truth Witness System

    async loadExistingData() {
        // Load from localStorage or IPFS
        try {
            const stored = localStorage.getItem('truth_witness_data');
            if (stored) {
                const data = JSON.parse(stored);
                if (data.statements) {
                    data.statements.forEach(stmt => {
                        this.statements.set(stmt.id, stmt);
                    });
                }
            }
        } catch (error) {
            console.log('No existing truth witness data found');
        }
    }

    setupEventListeners() {
        // Setup blockchain event listeners for NFT transfers, etc.
        if (window.ethereum) {
            // Listen for account changes
            window.ethereum.on('accountsChanged', () => {
                this.refreshUserData();
            });
        }
    }

    startPeriodicUpdates() {
        // Update reputation scores and validation status every 5 minutes
        setInterval(() => {
            this.updateAllReputationScores();
        }, 5 * 60 * 1000);
    }
}

// Global instance
window.truthWitnessSystem = new TruthWitnessSystem();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.truthWitnessSystem.initialize();
});