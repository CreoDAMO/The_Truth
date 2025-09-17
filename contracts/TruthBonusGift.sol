// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract TruthBonusGift is ERC721, ERC721Enumerable, ERC2981, Ownable, ReentrancyGuard {
    // Collection constants
    uint256 public constant MAX_SUPPLY = 145000;
    uint256 public constant PUBLIC_SUPPLY = 144000;
    uint256 public constant MASTER_COPY_ID = 145000;
    uint256 public constant PRICE = 39047346203169000; // ~0.0390 ETH ($145)
    
    // Collection state
    uint256 private _tokenIdCounter = 1;
    string private _baseTokenURI;
    bool public mintingEnabled = false;
    
    // Minting limits (5 per wallet for larger supply)
    mapping(address => uint256) public mintedCount;
    uint256 public constant MAX_PER_WALLET = 5;
    
    // Provenance
    string public provenance;
    bool private provenanceLocked = false;
    
    // Treasury
    address public treasury;
    bool public treasuryIsMultisig = false;
    
    // Events
    event MintingToggled(bool enabled);
    event BaseURIUpdated(string newBaseURI);
    event BonusGiftMinted(address indexed to, uint256 indexed tokenId, uint256 quantity);
    event ProvenanceSet(string provenance);
    event TreasuryUpdated(address treasury, bool multisig);
    
    constructor(
        address initialOwner,
        string memory baseURI,
        address initialTreasury
    ) ERC721("The Truth - Bonus Gift", "BONUS") Ownable() {
        _transferOwnership(initialOwner);
        _baseTokenURI = baseURI;
        _setDefaultRoyalty(initialOwner, 1000); // 10%
        treasury = initialTreasury;
        
        // Mint master copy #145000 to owner
        _safeMint(initialOwner, MASTER_COPY_ID);
        emit BonusGiftMinted(initialOwner, MASTER_COPY_ID, 1);
    }
    
    // Public minting function (allows up to 5 per transaction)
    function mintBonusGift(uint256 quantity) external payable nonReentrant {
        require(mintingEnabled, "Minting not enabled");
        require(quantity > 0 && quantity <= 5, "Invalid quantity (1-5)");
        require(_tokenIdCounter + quantity - 1 <= PUBLIC_SUPPLY, "Public supply exhausted");
        require(msg.value >= PRICE * quantity, "Insufficient payment");
        require(mintedCount[msg.sender] + quantity <= MAX_PER_WALLET, "Exceeds wallet limit");
        
        uint256 startTokenId = _tokenIdCounter;
        _tokenIdCounter += quantity;
        mintedCount[msg.sender] += quantity;
        
        for (uint256 i = 0; i < quantity; i++) {
            _safeMint(msg.sender, startTokenId + i);
        }
        
        // Refund excess payment
        if (msg.value > PRICE * quantity) {
            payable(msg.sender).transfer(msg.value - (PRICE * quantity));
        }
        
        emit BonusGiftMinted(msg.sender, startTokenId, quantity);
    }
    
    // Owner functions
    function toggleMinting() external onlyOwner {
        mintingEnabled = !mintingEnabled;
        emit MintingToggled(mintingEnabled);
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
    function totalMinted() external view returns (uint256) {
        return _tokenIdCounter - 1;
    }
    
    function publicMinted() external view returns (uint256) {
        uint256 total = _tokenIdCounter - 1;
        return total > 0 ? total - 1 : 0;
    }
    
    function remainingSupply() external view returns (uint256) {
        if (_tokenIdCounter > PUBLIC_SUPPLY) return 0;
        return PUBLIC_SUPPLY - (_tokenIdCounter - 1);
    }
    
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return string(abi.encodePacked(_baseTokenURI, Strings.toString(tokenId), ".json"));
    }
    
    // Required overrides
    function _beforeTokenTransfer(address from, address to, uint256 firstTokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
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
