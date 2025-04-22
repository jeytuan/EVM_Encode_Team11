// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Pool.sol";

contract PoolFactory {
    address[] public allPools;
    mapping(address => address[]) public poolsByCreator;

    event PoolCreated(address indexed creator, address poolAddress);

    function createPool(
        uint256 goal,
        uint256 durationInDays,
        uint256 minContribution,
        string memory category,
        string memory name,
        string memory description,
        string memory visibility
    ) external returns (address) {
        Pool newPool = new Pool(
            msg.sender,
            goal,
            durationInDays,
            minContribution,
            category,
            name,
            description,
            visibility
        );

        allPools.push(address(newPool));
        poolsByCreator[msg.sender].push(address(newPool));

        emit PoolCreated(msg.sender, address(newPool));
        return address(newPool);
    }

    function getAllPools() external view returns (address[] memory) {
        return allPools;
    }

    function getPoolsByCreator(address creator) external view returns (address[] memory) {
        return poolsByCreator[creator];
    }
}
