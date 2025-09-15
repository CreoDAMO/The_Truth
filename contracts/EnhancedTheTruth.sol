// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

/**
 * @title Enhanced The Truth NFT Contract
 * @notice Advanced NFT contract with batch minting, whitelist, dynamic pricing, and cross-collection benefits
 */
contract EnhancedTheTruth is ERC721, ERC721Enumerable, ERC2981, Ownable, ReentrancyGuard {
    using Strings for uint256;

    // Collection constants
    uint256 public constant MAX_SUPPLY = 77;
    uint256 public constant PUBLIC_SUPPLY = 76;
    uint256 public constant MASTER_COPY_ID = 77;
    uint256 public constant BASE_PRICE = 169548481700983700; // ~0.169548 ETH ($777)
    uint256 public constant MAX_BATCH_SIZE = 5;
    
    // Dynamic pricing parameters
    uint256 public currentPrice = BASE_PRICE;
    uint256 public priceIncrementBasis = 5; // 5% increase every 10 mints
    uint256 public priceIncrementThreshold = 10;
    
    // Collection state
    uint256 private _tokenIdCounter = 1;
    string private _baseTokenURI;
    bool public mintingEnabled = false;
    bool public whitelistMintEnabled = false;
    bool public publicMintEnabled = false;
    
    // Minting limits and tracking
    mapping(address => uint256) public mintedCount;
    mapping(address => bool) public hasMintedWhitelist;
    uint256 public constant MAX_PER_WALLET = 2;
    uint256 public constant MAX_PER_WHITELIST = 1;
    
    // Whitelist functionality
    bytes32 public merkleRoot;
    mapping(address => bool) public whitelist;
    uint256 public whitelistPrice = BASE_PRICE * 80 / 100; // 20% discount
    
    // Cross-collection benefits
    mapping(address => bool) public partnerCollections;
    mapping(address => uint256) public holderDiscounts; // Basis points (e.g., 1000 = 10%)
    
    // Provenance and treasury
    string public provenance;
    bool private provenanceLocked = false;
    address public treasury;
    bool public treasuryIsMultisig = false;
    
    // Enhanced events
    event MintingToggled(bool enabled);
    event WhitelistMintToggled(bool enabled);
    event PublicMintToggled(bool enabled);
    event BaseURIUpdated(string newBaseURI);
    event TruthMinted(address indexed to, uint256 indexed tokenId, uint256 price, string mintType);
    event BatchMinted(address indexed to, uint256[] tokenIds, uint256 totalPrice, uint256 quantity);
    event ProvenanceSet(string provenance);
    event TreasuryUpdated(address treasury, bool multisig);
    event PriceUpdated(uint256 oldPrice, uint256 newPrice, uint256 totalMinted);
    event WhitelistUpdated(bytes32 merkleRoot);
    event PartnerCollectionAdded(address collection, uint256 discount);
    event HolderDiscountClaimed(address holder, address partnerCollection, uint256 discount);

    constructor(
        address initialOwner,
        string memory baseURI,
        address initialTreasury
    ) ERC721("The Truth Enhanced", "TRUTHX") Ownable(initialOwner) {
        _baseTokenURI = baseURI;
        _setDefaultRoyalty(initialOwner, 1000); // 10%
        treasury = initialTreasury;
        
        // Mint master copy #77 to owner
        _safeMint(initialOwner, MASTER_COPY_ID);
        emit TruthMinted(initialOwner, MASTER_COPY_ID, 0, "master");
    }
    
    /**
     * @notice Whitelist minting with merkle proof verification
     * @param proof Merkle proof for whitelist verification
     */
    function mintWhitelist(bytes32[] calldata proof) external payable nonReentrant {
        require(whitelistMintEnabled, "Whitelist minting not enabled");
        require(_tokenIdCounter <= PUBLIC_SUPPLY, "Public supply exhausted");
        require(!hasMintedWhitelist[msg.sender], "Already minted whitelist allocation");
        require(msg.value >= whitelistPrice, "Insufficient payment for whitelist");
        
        // Verify merkle proof
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
        require(MerkleProof.verify(proof, merkleRoot, leaf), "Invalid whitelist proof");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _safeMint(msg.sender, tokenId);
        hasMintedWhitelist[msg.sender] = true;
        mintedCount[msg.sender] += 1;
        
        // Refund excess payment
        if (msg.value > whitelistPrice) {
            payable(msg.sender).transfer(msg.value - whitelistPrice);
        }
        
        emit TruthMinted(msg.sender, tokenId, whitelistPrice, "whitelist");
    }
    
    /**
     * @notice Public minting with dynamic pricing
     * @param quantity Number of tokens to mint (1-5)
     */
    function mintPublic(uint256 quantity) external payable nonReentrant {
        require(publicMintEnabled, "Public minting not enabled");
        require(quantity > 0 && quantity <= MAX_BATCH_SIZE, "Invalid quantity");
        require(_tokenIdCounter + quantity - 1 <= PUBLIC_SUPPLY, "Would exceed max supply");
        require(mintedCount[msg.sender] + quantity <= MAX_PER_WALLET, "Exceeds wallet limit");
        
        uint256 totalPrice = calculateTotalPrice(quantity);
        uint256 discountedPrice = applyHolderDiscount(msg.sender, totalPrice);
        
        require(msg.value >= discountedPrice, "Insufficient payment");
        
        uint256[] memory tokenIds = new uint256[](quantity);
        
        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = _tokenIdCounter;
            _tokenIdCounter++;
            tokenIds[i] = tokenId;
            _safeMint(msg.sender, tokenId);
        }
        
        mintedCount[msg.sender] += quantity;
        updateDynamicPricing();
        
        // Refund excess payment
        if (msg.value > discountedPrice) {
            payable(msg.sender).transfer(msg.value - discountedPrice);
        }
        
        if (quantity == 1) {
            emit TruthMinted(msg.sender, tokenIds[0], discountedPrice, "public");
        } else {
            emit BatchMinted(msg.sender, tokenIds, discountedPrice, quantity);
        }
    }
    
    /**
     * @notice Calculate total price for quantity with dynamic pricing
     * @param quantity Number of tokens to mint
     * @return Total price in wei
     */
    function calculateTotalPrice(uint256 quantity) public view returns (uint256) {
        uint256 totalPrice = 0;
        uint256 tempPrice = currentPrice;
        uint256 tempMinted = totalMinted();
        
        for (uint256 i = 0; i < quantity; i++) {
            totalPrice += tempPrice;
            tempMinted++;
            
            // Update price for next token if threshold reached
            if (tempMinted % priceIncrementThreshold == 0) {
                tempPrice = tempPrice * (10000 + priceIncrementBasis * 100) / 10000;
            }
        }
        
        return totalPrice;
    }
    
    /**
     * @notice Apply holder discount based on partner collection ownership
     * @param holder Address to check for discounts
     * @param price Original price
     * @return Discounted price
     */
    function applyHolderDiscount(address holder, uint256 price) public view returns (uint256) {
        uint256 maxDiscount = 0;
        
        for (uint256 i = 0; i < 10; i++) { // Check registered partner collections
            address partnerAddr = address(uint160(i + 1)); // Simplified for demo
            if (partnerCollections[partnerAddr] && holderDiscounts[partnerAddr] > maxDiscount) {
                try IERC721(partnerAddr).balanceOf(holder) returns (uint256 balance) {
                    if (balance > 0) {
                        maxDiscount = holderDiscounts[partnerAddr];
                    }
                } catch {
                    // Skip if contract call fails
                }
            }
        }
        
        if (maxDiscount > 0) {
            uint256 discount = price * maxDiscount / 10000;
            return price - discount;
        }
        
        return price;
    }
    
    /**
     * @notice Update dynamic pricing based on current minting progress
     */
    function updateDynamicPricing() internal {
        uint256 minted = totalMinted();
        if (minted % priceIncrementThreshold == 0 && minted > 0) {
            uint256 oldPrice = currentPrice;
            currentPrice = currentPrice * (10000 + priceIncrementBasis * 100) / 10000;
            emit PriceUpdated(oldPrice, currentPrice, minted);
        }
    }
    
    // Owner functions
    function toggleMinting() external onlyOwner {
        mintingEnabled = !mintingEnabled;
        emit MintingToggled(mintingEnabled);
    }
    
    function toggleWhitelistMint() external onlyOwner {
        whitelistMintEnabled = !whitelistMintEnabled;
        emit WhitelistMintToggled(whitelistMintEnabled);
    }
    
    function togglePublicMint() external onlyOwner {
        publicMintEnabled = !publicMintEnabled;
        emit PublicMintToggled(publicMintEnabled);
    }
    
    function setMerkleRoot(bytes32 _merkleRoot) external onlyOwner {
        merkleRoot = _merkleRoot;
        emit WhitelistUpdated(_merkleRoot);
    }
    
    function addPartnerCollection(address collection, uint256 discountBasisPoints) external onlyOwner {
        require(discountBasisPoints <= 3000, "Discount too high"); // Max 30%
        partnerCollections[collection] = true;
        holderDiscounts[collection] = discountBasisPoints;
        emit PartnerCollectionAdded(collection, discountBasisPoints);
    }
    
    function removePartnerCollection(address collection) external onlyOwner {
        partnerCollections[collection] = false;
        holderDiscounts[collection] = 0;
    }
    
    function setDynamicPricing(uint256 incrementBasis, uint256 threshold) external onlyOwner {
        require(incrementBasis <= 20, "Increment too high"); // Max 20%
        require(threshold >= 5 && threshold <= 20, "Invalid threshold");
        priceIncrementBasis = incrementBasis;
        priceIncrementThreshold = threshold;
    }
    
    function setCurrentPrice(uint256 newPrice) external onlyOwner {
        require(newPrice >= BASE_PRICE / 2 && newPrice <= BASE_PRICE * 3, "Price out of range");
        uint256 oldPrice = currentPrice;
        currentPrice = newPrice;
        emit PriceUpdated(oldPrice, newPrice, totalMinted());
    }
    
    function setWhitelistPrice(uint256 newPrice) external onlyOwner {
        require(newPrice <= BASE_PRICE, "Whitelist price too high");
        whitelistPrice = newPrice;
    }
    
    function setBaseURI(string calldata newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
        emit BaseURIUpdated(newBaseURI);
    }
    
    function setProvenance(string calldata prov) external onlyOwner {
        require(!provenanceLocked, "Provenance locked");
        provenance = prov;
        provenanceLocked = true;
        emit ProvenanceSet(prov);
    }
    
    function setTreasury(address _treasury, bool _isMultisig) external onlyOwner {
        require(_treasury != address(0), "Zero address");
        treasury = _treasury;
        treasuryIsMultisig = _isMultisig;
        emit TreasuryUpdated(_treasury, _isMultisig);
    }
    
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        address payable dest = payable(treasury == address(0) ? owner() : treasury);
        (bool success, ) = dest.call{value: balance}("");
        require(success, "Withdrawal failed");
    }
    
    // View functions
    function totalMinted() public view returns (uint256) {
        return _tokenIdCounter - 1;
    }
    
    function publicMinted() external view returns (uint256) {
        uint256 total = _tokenIdCounter - 1;
        return total > 0 ? total - 1 : 0; // Exclude master copy
    }
    
    function remainingSupply() external view returns (uint256) {
        if (_tokenIdCounter > PUBLIC_SUPPLY) return 0;
        return PUBLIC_SUPPLY - (_tokenIdCounter - 1);
    }
    
    function getCurrentPrice() external view returns (uint256) {
        return currentPrice;
    }
    
    function getWhitelistPrice() external view returns (uint256) {
        return whitelistPrice;
    }
    
    function isWhitelisted(address account, bytes32[] calldata proof) external view returns (bool) {
        bytes32 leaf = keccak256(abi.encodePacked(account));
        return MerkleProof.verify(proof, merkleRoot, leaf);
    }
    
    function getHolderDiscount(address holder) external view returns (uint256) {
        uint256 totalPrice = currentPrice;
        uint256 discountedPrice = applyHolderDiscount(holder, totalPrice);
        return totalPrice - discountedPrice;
    }
    
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return string(abi.encodePacked(_baseTokenURI, tokenId.toString(), ".json"));
    }
    
    // Emergency functions
    function emergencyPause() external onlyOwner {
        mintingEnabled = false;
        whitelistMintEnabled = false;
        publicMintEnabled = false;
    }
    
    function emergencyUnpause() external onlyOwner {
        mintingEnabled = true;
    }
    
    // Required overrides
    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}