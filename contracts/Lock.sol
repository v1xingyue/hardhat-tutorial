// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Lock {
    uint public unlockTime;
    address payable public owner;
    uint public value;
    string public scriptContent;
    bytes32 public constant resolveMode = "manual";
    mapping(bytes => string) public uriContents;

    event Withdrawal(uint amount, uint when);

    constructor(uint _unlockTime) payable {
        require(
            block.timestamp < _unlockTime,
            "Unlock time should be in the future"
        );

        unlockTime = _unlockTime;
        owner = payable(msg.sender);
    }

    function withdraw() public {
        // Uncomment this line, and the import of "hardhat/console.sol", to print a log in your terminal
        // console.log("Unlock time is %o and block timestamp is %o", unlockTime, block.timestamp);

        require(block.timestamp >= unlockTime, "You can't withdraw yet");
        require(msg.sender == owner, "You aren't the owner");

        emit Withdrawal(address(this).balance, block.timestamp);

        owner.transfer(address(this).balance);
    }

    function hello() public pure returns (string memory) {
        return "Hello World";
    }

    function setScriptContent(string memory _scriptContent) public {
        scriptContent = _scriptContent;
    }

    function setValue(uint _value) public {
        value = _value;
    }

    // function resolveMode() public pure returns (bytes32) {
    //     return "manual";
    // }

    function combineMessage(
        bytes calldata pathinfo,
        string memory myString
    ) public pure returns (string memory) {
        return string(abi.encodePacked(pathinfo, myString));
    }

    function setMapping(bytes calldata pathinfo, string memory content) public {
        uriContents[pathinfo] = content;
    }

    fallback(bytes calldata pathinfo) external returns (bytes memory) {
        if (keccak256(pathinfo) == keccak256(abi.encodePacked("/hello.js"))) {
            return abi.encode(scriptContent);
        }

        if (bytes(uriContents[pathinfo]).length != 0) {
            return abi.encode(uriContents[pathinfo]);
        }

        return
            abi.encode(
                combineMessage(
                    pathinfo,
                    " added by 0x427fb105d12A7879F784079B2612F881318839a8 "
                )
            );
    }
}
