pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

interface IERC2981Royalties {
    function royaltyInfo(uint256 _tokenId, uint256 _value) external view returns (address _receiver, uint256 _royaltyAmount);
}

contract SimpleERC721 is ERC721 {
    address public manager;
    string private URI;
    uint8 private mintCount;
    uint8 public royaltyRate = 20;
    address public creator = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;

    constructor(string memory name_, string memory symbol_, string memory URI_) ERC721(name_, symbol_) {
        URI = URI_;
        manager = msg.sender;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(IERC2981Royalties).interfaceId || super.supportsInterface(interfaceId);
    }

    function initialMint(address to, uint tokenId) public {
        require(msg.sender == manager, 'only the manager can mint');
        require(mintCount == 0, 'token already minted');
        _safeMint(to, tokenId, "");
        mintCount++;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token (only 0 exists)");
        return URI;
    }

    function royaltyInfo(uint256 _tokenId, uint256 _salePrice) external view returns (
        address receiver, uint256 royaltyAmount) {
        return (creator, (royaltyRate * _salePrice) / 100);
    }
}