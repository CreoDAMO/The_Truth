
// Governance functionality for The Truth ecosystem
class TruthGovernance {
    constructor() {
        this.web3 = null;
        this.account = null;
        this.truthContract = null;
        this.creatorContract = null;
        this.proposals = [];
        this.init();
    }

    async init() {
        // Contract addresses for TRUTH token and Creator coin
        this.truthTokenAddress = '0x8f6cf6f7747e170f4768533b869c339dc3d30a3c';
        this.creatorTokenAddress = '0x22b0434e89882f8e6841d340b28427646c015aa7';
        
        // ERC20 ABI for token interactions
        this.erc20ABI = [
            "function balanceOf(address owner) view returns (uint256)",
            "function transfer(address to, uint256 amount) returns (bool)",
            "function approve(address spender, uint256 amount) returns (bool)"
        ];

        this.setupEventListeners();
        this.loadProposals();
    }

    setupEventListeners() {
        // Wallet connection is now handled by unified system
        // The unified-dashboard.js will automatically attach the connectWallet handler
    }

    async switchToBase() {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x2105' }], // Base mainnet
            });
        } catch (switchError) {
            // Network doesn't exist, add it
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: '0x2105',
                            chainName: 'Base',
                            nativeCurrency: {
                                name: 'Ethereum',
                                symbol: 'ETH',
                                decimals: 18
                            },
                            rpcUrls: ['https://mainnet.base.org'],
                            blockExplorerUrls: ['https://basescan.org']
                        }]
                    });
                } catch (addError) {
                    console.error('Failed to add Base network:', addError);
                }
            }
        }
    }

    async loadTokenBalances() {
        try {
            // Get TRUTH token balance
            const truthBalance = await this.truthContract.balanceOf(this.account);
            const truthFormatted = ethers.utils.formatUnits(truthBalance, 18);
            
            // Get Creator coin balance
            const creatorBalance = await this.creatorContract.balanceOf(this.account);
            const creatorFormatted = ethers.utils.formatUnits(creatorBalance, 18);
            
            // Update UI
            document.getElementById('truthBalance').textContent = 
                `${parseFloat(truthFormatted).toFixed(2)} TRUTH`;
            document.getElementById('creatorBalance').textContent = 
                `${parseFloat(creatorFormatted).toFixed(2)} @jacqueantoinedegraff`;
            
            // Calculate voting power (example calculation)
            const truthPower = Math.min((parseFloat(truthFormatted) / 1000) * 100, 100);
            const creatorPower = Math.min((parseFloat(creatorFormatted) / 10000) * 100, 100);
            
            document.getElementById('truthPower').style.width = `${truthPower}%`;
            document.getElementById('creatorPower').style.width = `${creatorPower}%`;
            
        } catch (error) {
            console.error('Failed to load token balances:', error);
        }
    }

    async loadProposals() {
        try {
            const data = await window.TruthAPI.getGovernanceProposals();
            this.proposals = data;
            this.renderProposals();
        } catch (error) {
            console.error('Failed to load proposals:', error);
            // Fallback to sample proposals
            this.proposals = [
            {
                id: 1,
                title: "Bonus Gift Collection Pricing",
                description: "Should we reduce the Bonus Gift NFT price from 0.039 ETH to 0.025 ETH to increase accessibility?",
                yesVotes: 67,
                noVotes: 33,
                totalVotes: 1247,
                endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
            },
            {
                id: 2,
                title: "Revenue Distribution",
                description: "Allocate 15% of audiobook sales revenue to TRUTH token staking rewards?",
                yesVotes: 82,
                noVotes: 18,
                totalVotes: 892,
                endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
            },
            {
                id: 3,
                title: "New Collection Theme",
                description: "Next philosophical NFT collection should focus on \"The Gap Between Knowledge and Wisdom\"",
                yesVotes: 74,
                noVotes: 26,
                totalVotes: 2156,
                endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
        ];
        this.renderProposals();
        }
    }
    
    renderProposals() {
        const proposalsList = document.getElementById('proposalsList');
        if (!proposalsList) return;
        
        // Clear existing content safely
        proposalsList.textContent = '';
        
        this.proposals.forEach(proposal => {
            // Create container
            const proposalDiv = document.createElement('div');
            proposalDiv.className = 'proposal-card glass rounded-2xl p-8 floating';
            
            // Create title (safe text content)
            const titleH3 = document.createElement('h3');
            titleH3.className = 'text-xl font-bold mb-4';
            titleH3.textContent = proposal.title;
            
            // Create description (safe text content)
            const descriptionP = document.createElement('p');
            descriptionP.className = 'text-gray-300 mb-6';
            descriptionP.textContent = proposal.description;
            
            // Create vote progress
            const voteProgressDiv = document.createElement('div');
            voteProgressDiv.className = 'vote-progress mb-4';
            
            const voteStatsDiv = document.createElement('div');
            voteStatsDiv.className = 'flex justify-between text-sm mb-2';
            
            const yesSpan = document.createElement('span');
            yesSpan.textContent = `Yes: ${proposal.yesVotes}%`;
            const noSpan = document.createElement('span');
            noSpan.textContent = `No: ${proposal.noVotes}%`;
            
            voteStatsDiv.appendChild(yesSpan);
            voteStatsDiv.appendChild(noSpan);
            
            const progressContainer = document.createElement('div');
            progressContainer.className = 'progress-container';
            
            const progressBar = document.createElement('div');
            progressBar.className = 'progress-bar progress-yes';
            progressBar.style.width = `${proposal.yesVotes}%`;
            
            progressContainer.appendChild(progressBar);
            voteProgressDiv.appendChild(voteStatsDiv);
            voteProgressDiv.appendChild(progressContainer);
            
            // Create vote buttons
            const voteButtonsDiv = document.createElement('div');
            voteButtonsDiv.className = 'vote-buttons';
            
            const yesButton = document.createElement('button');
            yesButton.className = 'vote-btn vote-yes';
            yesButton.textContent = 'Vote Yes';
            yesButton.onclick = () => vote(proposal.id, true);
            
            const noButton = document.createElement('button');
            noButton.className = 'vote-btn vote-no';
            noButton.textContent = 'Vote No';
            noButton.onclick = () => vote(proposal.id, false);
            
            voteButtonsDiv.appendChild(yesButton);
            voteButtonsDiv.appendChild(noButton);
            
            // Assemble the proposal card
            proposalDiv.appendChild(titleH3);
            proposalDiv.appendChild(descriptionP);
            proposalDiv.appendChild(voteProgressDiv);
            proposalDiv.appendChild(voteButtonsDiv);
            
            proposalsList.appendChild(proposalDiv);
        });
    }
}

// Initialize governance system
const governance = new TruthGovernance();

// Integration with unified ecosystem state
function integrateGovernanceWithUnifiedState() {
    // Listen for unified state updates
    window.addEventListener('truthEcosystemUpdate', (event) => {
        const { current, changed } = event.detail;
        
        // Update governance power based on token changes
        if (changed.truthBalance || changed.creatorBalance || changed.liquidityPositions) {
            updateGovernancePower(current);
        }
        
        // Update wallet connection state
        if (changed.walletConnected) {
            governance.account = current.walletAddress;
            if (current.walletConnected && governance.web3) {
                governance.loadTokenBalances();
            }
        }
    });
    
    // Share governance data with unified state
    function shareGovernanceData() {
        if (window.TruthEcosystem) {
            const governanceData = {
                proposals: governance.proposals,
                votingPower: calculateVotingPower(),
                activeProposals: governance.proposals.filter(p => p.status === 'active').length
            };
            
            window.TruthEcosystem.updateGlobalState({
                governanceData: governanceData,
                governancePower: calculateVotingPower()
            });
        }
    }
    
    function calculateVotingPower() {
        const truthPower = (window.TruthEcosystem?.truthBalance || 0) * 0.1;
        const creatorPower = (window.TruthEcosystem?.creatorBalance || 0) * 0.05;
        const lpPower = (window.TruthEcosystem?.totalLPValue || 0) * 0.03;
        return Math.min(truthPower + creatorPower + lpPower, 100);
    }
    
    function updateGovernancePower(state) {
        const power = calculateVotingPower();
        const powerElements = document.querySelectorAll('.governance-power, .voting-power');
        powerElements.forEach(element => {
            element.textContent = `${power.toFixed(1)}%`;
        });
        
        const powerBars = document.querySelectorAll('.power-bar, .governance-bar');
        powerBars.forEach(bar => {
            bar.style.width = `${power}%`;
        });
    }
    
    // Initialize sharing
    shareGovernanceData();
    setInterval(shareGovernanceData, 30000); // Update every 30 seconds
}

// Initialize integration when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', integrateGovernanceWithUnifiedState);
} else {
    integrateGovernanceWithUnifiedState();
}

// Voting function
async function vote(proposalId, voteYes) {
    // Check unified wallet connection state
    if (!window.TruthEcosystem.walletConnected || !window.TruthEcosystem.walletAddress) {
        alert('Please connect your wallet first');
        return;
    }
    
    try {
        // In production, this would interact with a governance contract
        const proposal = governance.proposals.find(p => p.id === proposalId);
        if (proposal) {
            // Simulate vote recording
            console.log(`Voting ${voteYes ? 'YES' : 'NO'} on proposal ${proposalId}`);
            alert(`Vote recorded! Thank you for participating in The Truth governance.`);
            
            // In production, would call smart contract function:
            // await governanceContract.vote(proposalId, voteYes);
        }
    } catch (error) {
        console.error('Voting failed:', error);
        alert('Failed to record vote');
    }
}

// Community feature functions
function joinDiscord() {
    if (!governance.account) {
        alert('Connect wallet first to verify token holdings');
        return;
    }
    // In production, would verify token holdings and provide Discord invite
    window.open('https://discord.gg/thetruth', '_blank');
}

function accessLibrary() {
    if (!governance.account) {
        alert('Connect wallet first to verify Creator coin holdings');
        return;
    }
    // In production, would verify Creator coin balance
    alert('Access granted to exclusive content library!');
}

function stakeTruth() {
    if (!governance.account) {
        alert('Connect wallet first');
        return;
    }
    // In production, would open staking interface
    alert('Staking interface coming soon! Minimum 1000 TRUTH tokens required.');
}

// Load ethers.js from CDN
if (typeof ethers === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.ethers.io/lib/ethers-5.7.2.umd.min.js';
    document.head.appendChild(script);
}
