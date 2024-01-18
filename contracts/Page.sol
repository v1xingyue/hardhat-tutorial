// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Page {
    bytes32 public constant resolveMode = "manual";
    mapping(bytes => string) public uriContents;
    address payable public owner;

    constructor() payable {
        owner = payable(msg.sender);
    }

    function setMapping(bytes calldata pathinfo, string memory content) public {
        uriContents[pathinfo] = content;
    }

    fallback(bytes calldata pathinfo) external returns (bytes memory) {
        if (bytes(uriContents[pathinfo]).length != 0) {
            return abi.encode(uriContents[pathinfo]);
        }

        return abi.encode("<script>location.href='/index.html';</script>");
    }
}
