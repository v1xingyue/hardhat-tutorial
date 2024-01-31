// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract GzipPage {
    struct KeyValue {
        string key;
        string value;
    }

    bytes32 public constant resolveMode = "5219";
    bytes public gzipJavascript = "";

    function setGzipScript(bytes memory content) public {
        gzipJavascript = content;
    }

    function combineParamsToString(
        string[] memory resources,
        KeyValue[] memory params
    ) public pure returns (string memory) {
        string memory combinedString = "request content : ";

        // 遍历 resources 数组并将每个元素添加到 combinedString
        for (uint i = 0; i < resources.length; i++) {
            combinedString = string(
                abi.encodePacked(combinedString, resources[i], ";")
            );
        }

        // 遍历 params 数组并将每个键值对添加到 combinedString
        for (uint i = 0; i < params.length; i++) {
            combinedString = string(
                abi.encodePacked(
                    combinedString,
                    params[i].key,
                    " => ",
                    params[i].value,
                    ";"
                )
            );
        }

        return combinedString;
    }

    function request(
        string[] memory resource,
        KeyValue[] memory params
    )
        external
        view
        returns (
            uint16 statusCode,
            bytes memory body,
            KeyValue[] memory headers
        )
    {
        statusCode = 200;
        headers = new KeyValue[](2);
        headers[0] = KeyValue("Content-Type", "application/javascript");
        headers[1] = KeyValue("Server", "Web3Server");
        string memory xbody = combineParamsToString(resource, params);
        string memory path = resource[0];
        // headers[2] = KeyValue("Path", path);
        if (
            keccak256(abi.encodePacked("gzip.js")) ==
            keccak256(abi.encodePacked(path))
        ) {
            headers[1] = KeyValue("Content-Encoding", "gzip");
            return (statusCode, gzipJavascript, headers);
        }

        return (statusCode, abi.encode(xbody), headers);
    }
}
