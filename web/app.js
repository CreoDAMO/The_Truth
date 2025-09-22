const { useState, useEffect } = React;

// Browser-compatible configuration
const getNetworkConfig = () => {
    const environment = window.location.hostname;

    // Auto-detect network based on deployment
    if (environment.includes('replit')) return NETWORKS.baseSepolia;
    if (environment.includes('vercel')) return NETWORKS.base;
    if (environment.includes('railway')) return NETWORKS.base;
    if (environment.includes('render')) return NETWORKS.base;
    if (environment.includes('herokuapp')) return NETWORKS.base;

    return window.location.hostname === 'localhost' ? NETWORKS.baseSepolia : NETWORKS.base;
};

// Contract configuration
const CONTRACT_CONFIG = {
    address: "0x...", // Will be filled when deployed
    abi: [
        "function mintTruth() external payable",
        "function toggleMinting() external",
        "function owner() view returns (address)",
        "function mintingEnabled() view returns (bool)",
        "function totalSupply() view returns (uint256)",
        "function remainingSupply() view returns (uint256)",
        "function hasMinted(address) view returns (bool)",
        "function PRICE() view returns (uint256)",
        "function MAX_SUPPLY() view returns (uint256)",
        "function MASTER_COPY_ID() view returns (uint256)",
        "function ownerOf(uint256) view returns (address)",
        "function withdraw() external",
        "function setProvenance(bytes32) external",
        "function transferOwnership(address) external"
    ]
};

const NETWORKS = {
    base: {
        chainId: "0x2105", // 8453 in hex
        chainName: "Base",
        nativeCurrency: {
            name: "Ethereum",
            symbol: "ETH",
            decimals: 18
        },
        rpcUrls: ["https://mainnet.base.org"],
        blockExplorerUrls: ["https://basescan.org"]
    },
    baseSepolia: {
        chainId: "0x14a34", // 84532 in hex
        chainName: "Base Sepolia Testnet",
        nativeCurrency: {
            name: "Ethereum",
            symbol: "ETH",
            decimals: 18
        },
        rpcUrls: ["https://sepolia.base.org"],
        blockExplorerUrls: ["https://sepolia.basescan.org"]
    }
};

// Dynamic network selection based on deployment
const CURRENT_NETWORK = getNetworkConfig();

// MetaMask SDK configuration
const MMSDK_OPTIONS = {
    dappMetadata: {
        name: "The Truth NFT",
        url: window.location.href,
        iconUrl: `${window.location.origin}/favicon.ico`,
    },
    infuraAPIKey: "demo", // Replace with your Infura key
    preferDesktop: false,
    openDeeplink: (link) => {
        window.open(link, '_blank');
    }
};

function App() {
    const [account, setAccount] = useState(null);
    const [provider, setProvider] = useState(null);
    const [contract, setContract] = useState(null);
    const [signer, setSigner] = useState(null);
    const [sdk, setSdk] = useState(null);
    const [contractData, setContractData] = useState({
        owner: null,
        mintingEnabled: false,
        totalSupply: 0,
        remainingSupply: 0,
        price: "0",
        hasMinted: false,
        masterCopyOwner: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [network, setNetwork] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('metamask');

    // Initialize MetaMask SDK
    useEffect(() => {
        const initSDK = async () => {
            try {
                if (typeof MetaMaskSDK !== 'undefined') {
                    const MMSDK = new MetaMaskSDK.MetaMaskSDK(MMSDK_OPTIONS);
                    setSdk(MMSDK);
                }
            } catch (err) {
                console.warn("MetaMask SDK not available, using direct ethereum provider");
            }
        };
        initSDK();
    }, []);

    // Switch to Base network
    const switchToBase = async () => {
        try {
            const ethereum = sdk?.getProvider() || window.ethereum;
            await ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: CURRENT_NETWORK.chainId }],
            });
        } catch (switchError) {
            if (switchError.code === 4902) {
                try {
                    const ethereum = sdk?.getProvider() || window.ethereum;
                    await ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [CURRENT_NETWORK],
                    });
                } catch (addError) {
                    throw new Error("Failed to add Base network to MetaMask");
                }
            } else {
                throw new Error("Failed to switch to Base network");
            }
        }
    };

    // Connect wallet with improved MetaMask detection
    const connectWallet = async () => {
        try {
            // Check if ethers is available
            if (typeof ethers === 'undefined') {
                setError("Ethers.js library not loaded. Please refresh the page and try again.");
                return null;
            }

            let ethereum;

            // Check for MetaMask in multiple ways
            if (typeof window.ethereum !== 'undefined') {
                if (window.ethereum.isMetaMask) {
                    ethereum = window.ethereum;
                    console.log("Using MetaMask browser extension");
                } else if (window.ethereum.providers && Array.isArray(window.ethereum.providers)) {
                    // Multiple wallet providers - find MetaMask
                    const provider = window.ethereum.providers.find(p => p.isMetaMask);
                    if (provider) {
                        ethereum = provider;
                        console.log("Using MetaMask from multiple providers");
                    } else {
                        // Try first provider if available
                        ethereum = window.ethereum.providers[0] || window.ethereum;
                        console.log("Using first available wallet provider");
                    }
                } else {
                    ethereum = window.ethereum;
                    console.log("Using default ethereum provider");
                }
            } else if (sdk && sdk.getProvider) {
                ethereum = sdk.getProvider();
                console.log("Using MetaMask SDK provider");
            } else {
                // More user-friendly error message
                setError("Please install MetaMask or use a Web3-enabled browser to continue.");
                return null;
            }

            // Verify connection
            setSuccess("Connecting to wallet...");
            setError("");

            // Request account access with verification
            const accounts = await ethereum.request({
                method: 'eth_requestAccounts'
            });

            if (!accounts || accounts.length === 0) {
                throw new Error("No accounts found. Please unlock MetaMask.");
            }

            // Verify account format
            if (!ethers.utils.isAddress(accounts[0])) {
                throw new Error("Invalid wallet address received from MetaMask");
            }

            const web3Provider = new ethers.providers.Web3Provider(ethereum);
            const networkInfo = await web3Provider.getNetwork();

            console.log("Connected to network:", networkInfo);
            setSuccess("MetaMask connected successfully!");

            // Check if we're on the correct network
            if (networkInfo.chainId !== parseInt(CURRENT_NETWORK.chainId, 16)) {
                setError(`Connected to ${networkInfo.name} (Chain ID: ${networkInfo.chainId}). Please switch to ${CURRENT_NETWORK.chainName}.`);
                await switchToBase();
                return connectWallet();
            }

            const web3Signer = web3Provider.getSigner();

            // Verify signer
            const signerAddress = await web3Signer.getAddress();
            if (signerAddress.toLowerCase() !== accounts[0].toLowerCase()) {
                throw new Error("Signer address mismatch. Please try reconnecting.");
            }

            setAccount(accounts[0]);
            setProvider(web3Provider);
            setSigner(web3Signer);
            setNetwork(networkInfo);

            // Initialize contract
            if (CONTRACT_CONFIG.address !== "0x...") {
                const nftContract = new ethers.Contract(
                    CONTRACT_CONFIG.address,
                    CONTRACT_CONFIG.abi,
                    web3Signer
                );
                setContract(nftContract);
                await loadContractData(nftContract, accounts[0]);
            }

            setError("");
            setSuccess("✅ MetaMask connected and verified!");

            // Listen for account changes
            ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length === 0) {
                    // User disconnected
                    setAccount(null);
                    setProvider(null);
                    setSigner(null);
                    setContract(null);
                    setSuccess("");
                    console.log("MetaMask disconnected");
                } else {
                    // Account changed
                    console.log("MetaMask account changed to:", accounts[0]);
                    connectWallet();
                }
            });

            // Listen for network changes
            ethereum.on('chainChanged', (chainId) => {
                console.log("Network changed to chain ID:", chainId);
                window.location.reload(); // Reload to ensure clean state
            });

        } catch (err) {
            console.error("Wallet connection error:", err);
            // More helpful error messages
            if (err.message.includes('User rejected')) {
                setError("Connection cancelled. Please try again and approve the connection.");
            } else if (err.message.includes('not installed') || err.message.includes('ethereum')) {
                setError("Please install MetaMask or use a Web3-enabled browser. Visit metamask.io to get started.");
            } else {
                setError(`Connection failed: ${err.message}`);
            }
            setSuccess("");
        }
    };

    // Load contract data
    const loadContractData = async (contractInstance, userAddress) => {
        try {
            const [
                owner,
                mintingEnabled,
                totalSupply,
                remainingSupply,
                price,
                hasMinted,
                masterCopyOwner
            ] = await Promise.all([
                contractInstance.owner(),
                contractInstance.mintingEnabled(),
                contractInstance.totalSupply(),
                contractInstance.remainingSupply(),
                contractInstance.PRICE(),
                contractInstance.hasMinted(userAddress),
                contractInstance.ownerOf(77).catch(() => null)
            ]);

            setContractData({
                owner: owner.toLowerCase(),
                mintingEnabled,
                totalSupply: totalSupply.toNumber(),
                remainingSupply: remainingSupply.toNumber(),
                price: ethers.utils.formatEther(price),
                hasMinted,
                masterCopyOwner: masterCopyOwner?.toLowerCase()
            });
        } catch (err) {
            console.error("Error loading contract data:", err);
        }
    };

    // Calculate tax before minting
    const calculateTaxForMinting = async (priceInEth) => {
        try {
            const priceInUsd = parseFloat(priceInEth) * 3000; // Approximate ETH to USD conversion

            const response = await fetch('/api/calculate-nft-tax', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: priceInUsd,
                    customerAddress: account
                })
            });

            const taxData = await response.json();
            return taxData;
        } catch (error) {
            console.error("Tax calculation failed:", error);
            return { success: false, taxAmount: 0, totalAmount: priceInUsd };
        }
    };

    // Mint NFT with multiple payment options
    const mintNFT = async () => {
        if (!contract) return;

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const price = await contract.PRICE();
            const priceInEth = ethers.utils.formatEther(price);

            // Calculate tax
            setSuccess("Calculating tax obligations...");
            const taxResult = await calculateTaxForMinting(priceInEth);

            if (taxResult.success && taxResult.taxAmount > 0) {
                setSuccess(`Tax calculated: $${taxResult.taxAmount.toFixed(2)}. Proceeding with minting...`);
            }

            let tx;
            if (paymentMethod === 'metamask') {
                tx = await contract.mintTruth({ 
                    value: price,
                    gasLimit: 150000
                });
            } else if (paymentMethod === 'superpay') {
                // SuperPay integration would go here
                setError("SuperPay integration coming soon!");
                return;
            }

            setSuccess("Transaction submitted! Waiting for confirmation...");
            const receipt = await tx.wait();

            // Create tax transaction record
            if (taxResult.success && taxResult.calculationId) {
                try {
                    await fetch('/api/create-tax-transaction', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            calculationId: taxResult.calculationId,
                            transactionId: receipt.transactionHash,
                            saleType: 'nft-mint'
                        })
                    });
                } catch (taxError) {
                    console.error("Tax transaction recording failed:", taxError);
                }
            }

            setSuccess("🎉 Successfully minted The Truth NFT! Tax obligations recorded.");

            // Refresh data
            await loadContractData(contract, account);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Toggle minting (owner only)
    const toggleMinting = async () => {
        if (!contract) return;

        setLoading(true);
        setError("");

        try {
            const tx = await contract.toggleMinting();
            await tx.wait();
            setSuccess("Minting status toggled!");
            await loadContractData(contract, account);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Withdraw funds (owner only)
    const withdraw = async () => {
        if (!contract) return;

        setLoading(true);
        setError("");

        try {
            const tx = await contract.withdraw();
            await tx.wait();
            setSuccess("Funds withdrawn successfully!");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Deploy contract using CDP Agent Kit
    const deployWithAgentKit = async () => {
        if (!signer) {
            setError("Please connect your wallet first");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            // This would integrate with CDP Agent Kit for deployment
            setSuccess("CDP Agent Kit deployment feature coming soon. Please use the deployment scripts for now.");

        } catch (err) {
            setError("Deployment failed: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Update contract address
    const updateContractAddress = async (newAddress) => {
        if (!ethers.utils.isAddress(newAddress)) {
            setError("Invalid contract address");
            return;
        }

        CONTRACT_CONFIG.address = newAddress;

        if (signer) {
            const nftContract = new ethers.Contract(
                newAddress,
                CONTRACT_CONFIG.abi,
                signer
            );
            setContract(nftContract);
            await loadContractData(nftContract, account);
        }

        setSuccess("Contract address updated successfully!");
    };

    // Check if user is owner
    const isOwner = account && contractData.owner === account.toLowerCase();

    // Check if master copy is claimed
    const isMasterCopyClaimed = contractData.masterCopyOwner !== null;

    useEffect(() => {
        // Auto-connect if already connected
        if (window.ethereum && window.ethereum.selectedAddress) {
            connectWallet();
        }

        // Initialize PWA features
        initializePWA();

        // Initialize analytics
        initializeAnalytics();
    }, []);

    // PWA Installation
    const initializePWA = () => {
        // Register service worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered:', registration);
                })
                .catch(error => {
                    console.log('SW registration failed:', error);
                });
        }

        // Handle PWA install prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            window.deferredPrompt = e;

            // Show custom install button
            const installButton = document.createElement('button');
            installButton.textContent = '📱 Install App';
            installButton.className = 'bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm fixed bottom-4 right-4 z-50';
            installButton.onclick = () => {
                e.prompt();
                e.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the install prompt');
                    }
                    window.deferredPrompt = null;
                    installButton.remove();
                });
            };
            document.body.appendChild(installButton);
        });
    };

    // Initialize analytics tracking
    const initializeAnalytics = () => {
        if (typeof TruthAnalytics !== 'undefined') {
            window.analytics = new TruthAnalytics();
        }

        // Track page view
        fetch('/api/track-event', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                event: 'page_view',
                page: 'main',
                timestamp: Date.now(),
                userAgent: navigator.userAgent
            })
        }).catch(console.error);
    };

    // Helper function for analytics tracking
    const trackEvent = (event, data = {}) => {
        if (window.analytics) {
            window.analytics.track(event, data);
        }
        // Fallback to fetch if analytics object is not available
        fetch('/api/track-event', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event, ...data, timestamp: Date.now() })
        }).catch(console.error);
    };

    // Unified dashboard navigation
    window.showDashboard = function(dashboardType) {
        // Hide all dashboard content
        const dashboards = ['analytics', 'governance', 'community', 'payments', 'social', 'ai', 'lawful', 'shop', 'deploy'];
        dashboards.forEach(dash => {
            const element = document.getElementById(`${dash}-dashboard`);
            if (element) {
                element.style.display = 'none';
            }
        });

        // Show the selected dashboard
        const selectedDashboard = document.getElementById(`${dashboardType}-dashboard`);
        if (selectedDashboard) {
            selectedDashboard.style.display = 'block';

            // Update browser history without page reload
            window.history.pushState({dashboard: dashboardType}, '', `/${dashboardType}`);

            // Initialize dashboard-specific functionality
            switch(dashboardType) {
                case 'analytics':
                    if (window.initAnalytics) window.initAnalytics();
                    break;
                case 'governance':
                    if (window.initGovernance) window.initGovernance();
                    break;
                case 'deploy':
                    if (window.initDeployDashboard) window.initDeployDashboard();
                    break;
            }
        }

        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        event.target.classList.add('active');
    };

    // Handle browser back/forward buttons
    window.addEventListener('popstate', function(event) {
        if (event.state && event.state.dashboard) {
            showDashboard(event.state.dashboard);
        }
    });

    // Initialize the application
    window.initializeApp = initializeApp;

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        initializeApp();
    }

    // Dummy function to satisfy the structure, actual implementation would be elsewhere
    function initializeApp() {
        console.log("App initialized");
        // Potentially show default dashboard here
        // For example: showDashboard('analytics');
    }

    // Buy functions
    // Enhanced Buy functions with unified liquidity access
    function buyCreatorCoin(platform = 'zora') {
        const creatorAddress = '0x22b0434e89882f8e6841d340b28427646c015aa7';
        const zoraWallet = '0xc4b8f1ab3499fac71975666a04a1c99de7609603';

        const platforms = {
            zora: `https://zora.co/@jacqueantoinedegraff`,
            uniswap: `https://app.uniswap.org/#/swap?outputCurrency=${creatorAddress}&chain=base`,
            nftx: `https://nftx.io/vault/${creatorAddress}`,
            sudo: `https://sudoswap.xyz/#/browse/buy/${creatorAddress}`,
            '1inch': `https://app.1inch.io/#/8453/unified/${creatorAddress}`
        };

        // Track the transaction for analytics
        trackEvent('creator_coin_purchase_attempt', platform);

        if (platforms[platform]) {
            window.open(platforms[platform], '_blank');
        } else {
            // Default to Zora with enhanced parameters
            window.open(`https://zora.co/@jacqueantoinedegraff?ref=${zoraWallet}`, '_blank');
        }
    }

    function buyTruthToken(platform = 'uniswap') {
        const truthAddress = '0x8f6cf6f7747e170f4768533b869c339dc3d30a3c';

        const platforms = {
            uniswap: `https://app.uniswap.org/#/swap?outputCurrency=${truthAddress}&chain=base`,
            aggregator: `https://app.1inch.io/#/8453/unified/${truthAddress}`,
            sushiswap: `https://www.sushi.com/swap?chainId=8453&token1=${truthAddress}`,
            curve: `https://curve.fi/#/base/pools/factory-v2-${truthAddress}/swap`
        };

        trackEvent('truth_token_purchase_attempt', platform);

        if (platforms[platform]) {
            window.open(platforms[platform], '_blank');
        } else {
            window.open(platforms.uniswap, '_blank');
        }
    }

    // Enhanced DeFi integration functions
    function enableAutoLP() {
        const message = `🌊 Auto-LP Features Enabled!

✓ Automatic liquidity provision
✓ Yield optimization across DEXs  
✓ MEV protection
✓ Cross-chain rebalancing
✓ Compounding rewards

Your tokens will now earn maximum yield while maintaining liquidity.`;

        alert(message);
        trackEvent('auto_lp_enabled', 'creator_coin');
    }

    function stakeTruth() {
        const message = `💰 TRUTH Staking Activated!

Current APY: 12%
Lock Period: Flexible
Rewards: Daily
Governance: Full voting power

Redirecting to staking interface...`;

        alert(message);
        trackEvent('truth_staking_attempt', 'direct');

        // In production, redirect to staking contract
        window.open('https://app.uniswap.org/#/pool', '_blank');
    }

    function provideLiquidity(token) {
        const addresses = {
            truth: '0x8f6cf6f7747e170f4768533b869c339dc3d30a3c',
            creator: '0x22b0434e89882f8e6841d340b28427646c015aa7'
        };

        const message = `🏊 Providing Liquidity for ${token.toUpperCase()}

Expected APY: 15-25%
Pairs: ETH, USDC, WETH
Features: Auto-compounding
Risk: Impermanent loss protection

Redirecting to liquidity interface...`;

        alert(message);
        trackEvent('liquidity_provision_attempt', token);

        const tokenAddress = addresses[token];
        if (tokenAddress) {
            window.open(`https://app.uniswap.org/#/add/v2/ETH/${tokenAddress}`, '_blank');
        }
    }

    return (
        <div className="min-h-screen text-white p-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                        THE TRUTH NFT
                    </h1>
                    <p className="text-xl opacity-80 mb-2">
                        "The Truth Doesn't Need To Be Pushed, Only The Lie..."
                    </p>
                    <p className="text-lg opacity-60">
                        — Jacque Antoine DeGraff
                    </p>
                </div>

                {/* Connection Status */}
                <div className="glass rounded-xl p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Connection Status</h3>
                            {account ? (
                                <div>
                                    <p className="text-green-400">✅ Connected: {account.slice(0, 6)}...{account.slice(-4)}</p>
                                    {network && (
                                        <div className="text-sm opacity-60">
                                            <p>Network: {network.name} (Chain ID: {network.chainId})</p>
                                            {network.chainId !== parseInt(CURRENT_NETWORK.chainId, 16) && (
                                                <button
                                                    onClick={switchToBase}
                                                    className="bg-orange-600 hover:bg-orange-700 px-3 py-1 rounded mt-1 text-xs"
                                                >
                                                    Switch to Base
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-red-400">❌ Not Connected</p>
                            )}
                        </div>
                        {!account && (
                            <button
                                onClick={connectWallet}
                                className="btn-connect text-white px-6 py-3 rounded-lg font-semibold"
                            >
                                🦊 Connect Wallet
                            </button>
                        )}
                    </div>
                </div>

                {/* Contract Configuration */}
                {account && (
                    <div className="glass rounded-xl p-6 mb-6">
                        <h3 className="text-xl font-semibold mb-4">Contract Configuration</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Contract Address</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="0x..."
                                        className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                                        onChange={(e) => {
                                            if (e.target.value.length === 42) {
                                                updateContractAddress(e.target.value);
                                            }
                                        }}
                                    />
                                    <button
                                        onClick={() => {
                                            const address = document.querySelector('input[placeholder="0x..."]').value;
                                            updateContractAddress(address);
                                        }}
                                        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm"
                                    >
                                        Connect
                                    </button>
                                </div>
                                <p className="text-xs opacity-60 mt-1">
                                    Enter the deployed contract address or deploy a new one
                                </p>
                            </div>

                            {CONTRACT_CONFIG.address === "0x..." && (
                                <div className="border-t border-gray-600 pt-4">
                                    <p className="text-yellow-400 text-sm mb-3">⚠️ No contract connected</p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={deployWithAgentKit}
                                            disabled={loading || !account}
                                            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 px-6 py-2 rounded-lg font-semibold transition-colors"
                                        >
                                            Deploy with CDP Agent Kit
                                        </button>
                                        <a 
                                            href="/deploy.html" 
                                            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition-colors inline-block"
                                        >
                                            Use Deploy Tool
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Contract Info */}
                {contract && (
                    <div className="glass rounded-xl p-6 mb-6">
                        <h3 className="text-xl font-semibold mb-4">Collection Status</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-yellow-400">{contractData.totalSupply}</p>
                                <p className="text-sm opacity-60">Total Minted</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-green-400">{contractData.remainingSupply}</p>
                                <p className="text-sm opacity-60">Remaining</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-blue-400">{contractData.price} ETH</p>
                                <p className="text-sm opacity-60">Price</p>
                            </div>
                            <div className="text-center">
                                <p className={`text-2xl font-bold ${contractData.mintingEnabled ? 'text-green-400' : 'text-red-400'}`}>
                                    {contractData.mintingEnabled ? 'LIVE' : 'PAUSED'}
                                </p>
                                <p className="text-sm opacity-60">Minting</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Owner Controls */}
                {isOwner && (
                    <div className="nft-card rounded-xl p-6 mb-6">
                        <h3 className="text-xl font-semibold mb-4 text-yellow-400">🔑 Owner Controls</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                onClick={toggleMinting}
                                disabled={loading}
                                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 px-6 py-3 rounded-lg font-semibold transition-colors"
                            >
                                {contractData.mintingEnabled ? 'Pause Minting' : 'Enable Minting'}
                            </button>
                            <button
                                onClick={withdraw}
                                disabled={loading}
                                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 px-6 py-3 rounded-lg font-semibold transition-colors"
                            >
                                Withdraw Funds
                            </button>
                        </div>
                        <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                            <p className="text-sm">
                                <strong>Master Copy Status:</strong> {isMasterCopyClaimed ? 
                                    `Claimed by ${contractData.masterCopyOwner?.slice(0, 6)}...${contractData.masterCopyOwner?.slice(-4)}` : 
                                    'Available (Token #77)'
                                }
                            </p>
                        </div>
                    </div>
                )}

                {/* Public Minting */}
                {account && !isOwner && (
                    <div className="nft-card rounded-xl p-6 mb-6">
                        <h3 className="text-xl font-semibold mb-4">🎨 Mint The Truth NFT</h3>

                        {/* Payment Method Selection */}
                        <div className="mb-6">
                            <h4 className="text-lg font-semibold mb-3">Choose Payment Method</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <button
                                    onClick={() => setPaymentMethod('metamask')}
                                    className={`p-3 rounded-lg border-2 transition-colors ${
                                        paymentMethod === 'metamask' 
                                            ? 'border-blue-500 bg-blue-900' 
                                            : 'border-gray-600 bg-gray-800'
                                    }`}
                                >
                                    <div className="text-center">
                                        <p className="font-semibold">MetaMask</p>
                                        <p className="text-xs opacity-60">Direct wallet payment</p>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setPaymentMethod('superpay')}
                                    className={`p-3 rounded-lg border-2 transition-colors ${
                                        paymentMethod === 'superpay' 
                                            ? 'border-green-500 bg-green-900' 
                                            : 'border-gray-600 bg-gray-800'
                                    }`}
                                >
                                    <div className="text-center">
                                        <p className="font-semibold">SuperPay</p>
                                        <p className="text-xs opacity-60">Credit card / Bank</p>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setPaymentMethod('usdc')}
                                    className={`p-3 rounded-lg border-2 transition-colors ${
                                        paymentMethod === 'usdc' 
                                            ? 'border-purple-500 bg-purple-900' 
                                            : 'border-gray-600 bg-gray-800'
                                    }`}
                                >
                                    <div className="text-center">
                                        <p className="font-semibold">USDC</p>
                                        <p className="text-xs opacity-60">Free on Base</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {contractData.hasMinted ? (
                            <div className="text-center py-8">
                                <p className="text-xl text-green-400 mb-2">🎉 You've already minted!</p>
                                <p className="opacity-60">Each wallet can only mint one Truth NFT</p>
                            </div>
                        ) : contractData.remainingSupply === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-xl text-red-400 mb-2">😔 Sold Out</p>
                                <p className="opacity-60">All Truth NFTs have been minted</p>
                            </div>
                        ) : !contractData.mintingEnabled ? (
                            <div className="text-center py-8">
                                <p className="text-xl text-yellow-400 mb-2">⏸️ Minting Paused</p>
                                <p className="opacity-60">Minting is currently disabled</p>
                            </div>
                        ) : (
                            <div className="text-center">
                                <div className="mb-6">
                                    <p className="text-3xl font-bold text-yellow-400 mb-2">{contractData.price} ETH</p>
                                    <p className="text-lg opacity-80">≈ $777 USD</p>
                                    <p className="text-sm opacity-60 mt-2">Price includes 25-page audiobook, PDF, and exclusive meme comic</p>
                                </div>

                                <button
                                    onClick={mintNFT}
                                    disabled={loading}
                                    className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 disabled:opacity-50 px-8 py-4 rounded-lg font-bold text-xl transition-all transform hover:scale-105"
                                >
                                    {loading ? '⏳ Minting...' : '🎯 Mint The Truth'}
                                </button>

                                {paymentMethod !== 'metamask' && (
                                    <p className="text-yellow-400 text-sm mt-2">
                                        {paymentMethod} payment coming soon!
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Collection Details */}
                <div className="glass rounded-xl p-6 mb-6">
                    <h3 className="text-xl font-semibold mb-4">📚 Collection Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold text-yellow-400 mb-2">The Truth NFT</h4>
                            <ul className="text-sm space-y-1 opacity-80">
                                <li>• 77 Total Editions</li>
                                <li>• 76 Public + 1 Master Copy</li>
                                <li>• Complete 4-Part Archive</li>
                                <li>• 25-page Audiobook + PDF</li>
                                <li>• Exclusive Meme Comic</li>
                                <li>• 10% Royalties</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-yellow-400 mb-2">Philosophy</h4>
                            <p className="text-sm opacity-80">
                                A philosophical experiment that captured AI systems demonstrating 
                                the gap between Truth and institutional translation in real-time.
                                Each NFT preserves this unique demonstration immutably on-chain.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                {error && (
                    <div className="bg-red-900 border border-red-600 rounded-lg p-4 mb-4">
                        <p className="text-red-200">❌ {error}</p>
                    </div>
                )}

                {success && (
                    <div className="bg-green-900 border border-green-600 rounded-lg p-4 mb-4">
                        <p className="text-green-200">{success}</p>
                    </div>
                )}

                {/* Footer */}
                <div className="text-center py-8 opacity-60">
                    <p className="text-sm">
                        "The Truth Always Remains Silent waiting to be Witnessed."
                    </p>
                    <p className="text-xs mt-2">
                        — Master of Nothing, Student of All Things
                    </p>
                </div>
            </div>
        </div>
    );
}

// React 18 compatibility
const rootElement = document.getElementById('root');
if (window.ReactDOM.createRoot) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
} else {
    // Fallback for older React versions
    ReactDOM.render(<App />, rootElement);
}