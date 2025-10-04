
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title The Truth Part Three - Applying The Law's & Creating The Blackpaper
 * @dev NFT contract implementing foundation-first legal architecture
 * @author Jacque Antoine DeGraff - Master of Nothing, Student of All Things
 */
contract TruthPartThree is ERC721, ERC721Enumerable, ERC2981, Ownable, ReentrancyGuard {
    // Collection constants
    uint256 public constant MAX_SUPPLY = 444;
    uint256 public constant PUBLIC_SUPPLY = 443;
    uint256 public constant MASTER_COPY_ID = 444;
    uint256 public constant PRICE = 478719895287958000; // ~0.4787 ETH ($1777)
    
    // Collection state
    uint256 private _tokenIdCounter = 1;
    string private _baseTokenURI;
    bool public mintingEnabled = false;
    
    // Minting limits
    mapping(address => bool) public hasMinted;
    
    // Provenance
    string public provenance;
    bool private provenanceLocked = false;
    
    // Treasury
    address public treasury;
    bool public treasuryIsMultisig = false;
    
    // Blackpaper specific
    string public blackpaperVersion = "1.0";
    string public legalFoundation = "Foundation Before Framework";
    
    // Events
    event MintingToggled(bool enabled);
    event BaseURIUpdated(string newBaseURI);
    event BlackpaperMinted(address indexed to, uint256 indexed tokenId);
    event ProvenanceSet(string provenance);
    event TreasuryUpdated(address treasury, bool multisig);
    event LegalFoundationWitnessed(address indexed witness, uint256 indexed tokenId);
    
    constructor(
        address initialOwner,
        string memory baseURI,
        address initialTreasury
    ) ERC721("The Truth Part Three - Applying The Laws", "LAWS") Ownable(initialOwner) {
        _baseTokenURI = baseURI;
        _setDefaultRoyalty(initialOwner, 1000); // 10%
        treasury = initialTreasury;
        
        // Mint master copy #444 to owner
        _safeMint(initialOwner, MASTER_COPY_ID);
        emit BlackpaperMinted(initialOwner, MASTER_COPY_ID);
        emit LegalFoundationWitnessed(initialOwner, MASTER_COPY_ID);
    }
    
    // Public minting function
    function mintBlackpaper() external payable nonReentrant {
        require(mintingEnabled, "Minting not enabled");
        require(_tokenIdCounter <= PUBLIC_SUPPLY, "Public supply exhausted");
        require(msg.value >= PRICE, "Insufficient payment");
        require(!hasMinted[msg.sender], "Already minted");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _safeMint(msg.sender, tokenId);
        hasMinted[msg.sender] = true;
        
        // Refund excess payment
        if (msg.value > PRICE) {
            payable(msg.sender).transfer(msg.value - PRICE);
        }
        
        emit BlackpaperMinted(msg.sender, tokenId);
        emit LegalFoundationWitnessed(msg.sender, tokenId);
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
    
    function getBlackpaperInfo() external view returns (string memory version, string memory foundation) {
        return (blackpaperVersion, legalFoundation);
    }
    
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "ERC721Metadata: URI query for nonexistent token");
        return string(abi.encodePacked(_baseTokenURI, Strings.toString(tokenId), ".json"));
    }
    
    // Required overrides for OpenZeppelin v5
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }
    
    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
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
