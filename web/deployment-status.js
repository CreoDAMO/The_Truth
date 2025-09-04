
// Deployment Status Checker
class DeploymentStatus {
    constructor() {
        this.statusElement = null;
        this.init();
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

        this.statusElement.innerHTML = html;
    }
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    new DeploymentStatus();
});
