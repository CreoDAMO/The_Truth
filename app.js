
const { useState, useEffect } = React;

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
        "function withdraw() external"
    ]
};

const NETWORKS = {
    base: {
        chainId: 8453,
        name: "Base",
        rpcUrl: "https://mainnet.base.org",
        explorer: "https://basescan.org"
    },
    baseSepolia: {
        chainId: 84532,
        name: "Base Sepolia",
        rpcUrl: "https://sepolia.base.org",
        explorer: "https://sepolia.basescan.org"
    }
};

function App() {
    const [account, setAccount] = useState(null);
    const [provider, setProvider] = useState(null);
    const [contract, setContract] = useState(null);
    const [signer, setSigner] = useState(null);
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

    // Connect wallet
    const connectWallet = async () => {
        try {
            if (!window.ethereum) {
                throw new Error("MetaMask not installed");
            }

            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
            const web3Signer = web3Provider.getSigner();
            const networkInfo = await web3Provider.getNetwork();

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
        } catch (err) {
            setError(err.message);
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

    // Mint NFT
    const mintNFT = async () => {
        if (!contract) return;

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const price = await contract.PRICE();
            const tx = await contract.mintTruth({ 
                value: price,
                gasLimit: 150000
            });

            setSuccess("Transaction submitted! Waiting for confirmation...");
            await tx.wait();
            setSuccess("🎉 Successfully minted The Truth NFT!");
            
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

    // Check if user is owner
    const isOwner = account && contractData.owner === account.toLowerCase();

    // Check if master copy is claimed
    const isMasterCopyClaimed = contractData.masterCopyOwner !== null;

    useEffect(() => {
        // Auto-connect if already connected
        if (window.ethereum && window.ethereum.selectedAddress) {
            connectWallet();
        }
    }, []);

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
                                    {network && <p className="text-sm opacity-60">Network: {network.name}</p>}
                                </div>
                            ) : (
                                <p className="text-red-400">❌ Not Connected</p>
                            )}
                        </div>
                        {!account && (
                            <button
                                onClick={connectWallet}
                                className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition-colors"
                            >
                                Connect Wallet
                            </button>
                        )}
                    </div>
                </div>

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

ReactDOM.render(<App />, document.getElementById('root'));
