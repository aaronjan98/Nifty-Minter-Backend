// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/utils/Strings.sol';
import '@openzeppelin/contracts/utils/Base64.sol';
import 'hardhat/console.sol';

contract NFT is ERC721URIStorage, ERC721Enumerable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    using Strings for uint256;

    address payable public immutable feeAccount;
    uint256 public immutable fee;

    constructor(
        string memory tokenName,
        string memory symbol,
        uint256 _fee
    ) ERC721(tokenName, symbol) {
        feeAccount = payable(msg.sender);
        fee = _fee;
    }

    function genMetadataURI(
        string memory imageURI,
        string memory description,
        uint256 id
    ) public returns (string memory) {
        string memory newMetadata = '';

        bytes memory dataURI = abi.encodePacked(
            '{',
            '"id": "',
            id.toString(),
            '"',
            '"name": "Nifty Mint #',
            id.toString(),
            '",',
            '"description": "',
            description,
            '"',
            '"image": "',
            imageURI,
            '"',
            '"date": "',
            block.timestamp,
            '"',
            '}'
        );

        return
            string(
                abi.encodePacked(
                    'data:application/json;base64,',
                    Base64.encode(dataURI)
                )
            );
    }

    function mint(
        string memory _tokenURI,
        string memory description
    ) public payable returns (uint256) {
        require(msg.value >= fee, 'Not enough ether to cover the minting fee.');

        feeAccount.transfer(fee);

        _tokenIds.increment();
        uint256 id = _tokenIds.current();

        _safeMint(msg.sender, id);
        _setTokenURI(id, genMetadataURI(_tokenURI, description, id));

        return id;
    }

    function walletOfOwner(
        address _owner
    ) public view returns (uint256[] memory) {
        uint256 ownerTokenCount = balanceOf(_owner);
        uint256[] memory tokenIds = new uint256[](ownerTokenCount);
        for (uint256 i; i < ownerTokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokenIds;
    }

    // Overrides required by Solidity
    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal virtual override(ERC721, ERC721Enumerable) {
        return super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
    }
}
