
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
        document.getElementById('connectWallet').addEventListener('click', () => this.connectWallet());
    }

    async connectWallet() {
        try {
            if (typeof window.ethereum !== 'undefined') {
                this.web3 = new ethers.providers.Web3Provider(window.ethereum);
                
                // Request account access
                const accounts = await window.ethereum.request({ 
                    method: 'eth_requestAccounts' 
                });
                
                this.account = accounts[0];
                
                // Switch to Base network if needed
                await this.switchToBase();
                
                // Initialize contracts
                this.truthContract = new ethers.Contract(
                    this.truthTokenAddress,
                    this.erc20ABI,
                    this.web3.getSigner()
                );
                
                this.creatorContract = new ethers.Contract(
                    this.creatorTokenAddress,
                    this.erc20ABI,
                    this.web3.getSigner()
                );
                
                // Update UI
                document.getElementById('connectWallet').textContent = 
                    `${this.account.substring(0, 6)}...${this.account.substring(38)}`;
                
                // Load token balances
                await this.loadTokenBalances();
                
                console.log('Wallet connected:', this.account);
            } else {
                alert('MetaMask not found! Please install MetaMask.');
            }
        } catch (error) {
            console.error('Connection failed:', error);
            alert('Failed to connect wallet');
        }
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
        
        proposalsList.innerHTML = this.proposals.map(proposal => `
            <div class="proposal-card glass rounded-2xl p-8 floating">
                <h3 class="text-xl font-bold mb-4">${proposal.title}</h3>
                <p class="text-gray-300 mb-6">${proposal.description}</p>
                <div class="vote-progress mb-4">
                    <div class="flex justify-between text-sm mb-2">
                        <span>Yes: ${proposal.yesVotes}%</span>
                        <span>No: ${proposal.noVotes}%</span>
                    </div>
                    <div class="progress-container">
                        <div class="progress-bar progress-yes" style="width: ${proposal.yesVotes}%"></div>
                    </div>
                </div>
                <div class="vote-buttons">
                    <button class="vote-btn vote-yes" onclick="vote(${proposal.id}, true)">Vote Yes</button>
                    <button class="vote-btn vote-no" onclick="vote(${proposal.id}, false)">Vote No</button>
                </div>
            </div>
        `).join('');
    }
}

// Initialize governance system
const governance = new TruthGovernance();

// Voting function
async function vote(proposalId, voteYes) {
    if (!governance.account) {
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
