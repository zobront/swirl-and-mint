pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract SimpleERC721 is ERC721 {
    address public manager;
    string private URI;
    uint8 private mintCount;

    constructor(string memory name_, string memory symbol_, string memory URI_) ERC721(name_, symbol_) {
        URI = URI_;
        manager = msg.sender;
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
}