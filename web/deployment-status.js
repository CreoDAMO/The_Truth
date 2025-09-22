
// Deployment Status Checker
class DeploymentStatus {
    constructor() {
        this.statusElement = null;
        this.waitForDependencies().then(() => this.init());
    }

    async waitForDependencies() {
        let attempts = 0;
        const maxAttempts = 100; // 10 seconds max wait
        
        // Wait for ethers.js to load
        while (typeof ethers === 'undefined' && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (typeof ethers === 'undefined') {
            console.error('Ethers.js failed to load after 10 seconds - deployment status will be limited');
            this.showLimitedStatus();
            return;
        }
        
        // Wait for TRUTH_CONTRACTS to load
        attempts = 0;
        while (typeof TRUTH_CONTRACTS === 'undefined' && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (typeof TRUTH_CONTRACTS === 'undefined') {
            console.error('TRUTH_CONTRACTS config failed to load - using fallback config');
            this.initializeFallbackConfig();
        }
        
        console.log('✅ Deployment status checker dependencies loaded successfully');
    }

    showLimitedStatus() {
        this.createStatusDisplay();
        this.statusElement.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 10px; color: #ff6b6b;">
                ⚠️ Contract Status (Limited)
            </div>
            <div style="margin: 5px 0; font-size: 0.8rem; color: #ff6b6b;">
                Unable to check contract status - network issues detected
            </div>
            <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.2);">
                <button onclick="window.location.reload()" 
                        style="background: linear-gradient(135deg, #ff6b6b, #ff4444); 
                               color: white; border: none; padding: 8px 12px; 
                               border-radius: 5px; cursor: pointer; font-size: 0.8rem;">
                    Reload Page
                </button>
            </div>
        `;
    }

    initializeFallbackConfig() {
        // Fallback configuration if TRUTH_CONTRACTS fails to load
        window.TRUTH_CONTRACTS = {
            ADDRESSES: {
                TruthToken: '0x8f6cf6f7747e170f4768533b869c339dc3d30a3c',
                CreatorToken: '0x22b0434e89882f8e6841d340b28427646c015aa7',
                TheTruth: '0x...',
                TruthBonusGift: '0x...',
                TruthPartThree: '0x...'
            },
            NETWORK: {
                rpcUrl: 'https://mainnet.base.org'
            }
        };
    }

    init() {
        this.createStatusDisplay();
        this.checkDeploymentStatus();
        
        // Auto-refresh every 30 seconds
        setInterval(() => this.checkDeploymentStatus(), 30000);
    }

    createStatusDisplay() {
        // Create status indicator in top-right corner
        const statusDiv = document.createElement('div');
        statusDiv.id = 'deployment-status';
        statusDiv.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            border-radius: 10px;
            padding: 15px;
            z-index: 999;
            min-width: 250px;
            font-size: 0.9rem;
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.1);
        `;
        document.body.appendChild(statusDiv);
        this.statusElement = statusDiv;
    }

    async checkDeploymentStatus() {
        const contracts = TRUTH_CONTRACTS.ADDRESSES;
        const statuses = {};

        for (const [name, address] of Object.entries(contracts)) {
            if (address === '0x...') {
                statuses[name] = { deployed: false, status: 'Not Deployed' };
            } else {
                // Tokens are already deployed on Base/Zora - show as deployed
                if (name === 'TruthToken' || name === 'CreatorToken') {
                    statuses[name] = { deployed: true, status: 'Deployed on Base/Zora' };
                } else {
                    try {
                        // Check if contract exists at address for other contracts
                        const provider = new ethers.providers.JsonRpcProvider(TRUTH_CONTRACTS.NETWORK.rpcUrl);
                        const code = await provider.getCode(address);
                        
                        if (code === '0x') {
                            statuses[name] = { deployed: false, status: 'Invalid Address' };
                        } else {
                            statuses[name] = { deployed: true, status: 'Deployed' };
                        }
                    } catch (error) {
                        statuses[name] = { deployed: false, status: 'Error Checking' };
                    }
                }
            }
        }

        this.updateStatusDisplay(statuses);
    }

    updateStatusDisplay(statuses) {
        const totalContracts = Object.keys(statuses).length;
        const deployedCount = Object.values(statuses).filter(s => s.deployed).length;
        
        let html = `
            <div style="font-weight: bold; margin-bottom: 10px; color: #00d4ff;">
                🔗 Contract Status (${deployedCount}/${totalContracts})
            </div>
        `;

        for (const [name, status] of Object.entries(statuses)) {
            const icon = status.deployed ? '✅' : '❌';
            const color = status.deployed ? '#4CAF50' : '#ff6b6b';
            
            html += `
                <div style="margin: 5px 0; font-size: 0.8rem;">
                    ${icon} <span style="color: ${color};">${name}</span>
                    ${status.status === 'Deployed on Base/Zora' ? '<span style="font-size: 0.7rem; opacity: 0.7;"> (Base/Zora)</span>' : ''}
                </div>
            `;
        }

        // Add deployment button if not all contracts are deployed
        if (deployedCount < totalContracts) {
            html += `
                <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.2);">
                    <button onclick="window.open('/deploy.html', '_blank')" 
                            style="background: linear-gradient(135deg, #00d4ff, #090979); 
                                   color: white; border: none; padding: 8px 12px; 
                                   border-radius: 5px; cursor: pointer; font-size: 0.8rem;">
                        Deploy Contracts
                    </button>
                </div>
            `;
        }

        // Use DOMPurify to sanitize HTML content before setting innerHTML
        this.statusElement.innerHTML = DOMPurify.sanitize(html);
    }
}

// Initialize deployment status checker with better error handling
function initializeDeploymentStatus() {
    try {
        console.log('🔍 Initializing deployment status checker...');
        new DeploymentStatus();
    } catch (error) {
        console.error('❌ Failed to initialize deployment status checker:', error);
        // Retry once after a longer delay
        setTimeout(() => {
            try {
                new DeploymentStatus();
            } catch (retryError) {
                console.error('❌ Deployment status checker retry failed:', retryError);
            }
        }, 3000);
    }
}

// Initialize with proper delay to ensure all dependencies are loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initializeDeploymentStatus, 2000);
    });
} else {
    setTimeout(initializeDeploymentStatus, 2000);
}
