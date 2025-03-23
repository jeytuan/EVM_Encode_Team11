// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TokenizedBallot {
    struct Proposal {
        bytes32 name;
        uint256 voteCount;
    }

    Proposal[] public proposals;
    IERC20 public voteToken;
    mapping(address => uint256) public votePowerSpent;

    constructor(
        bytes32[] memory proposalNames,
        address tokenAddress
    ) {
        voteToken = IERC20(tokenAddress);
        for (uint i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({
                name: proposalNames[i],
                voteCount: 0
            }));
        }
    }

    function vote(uint proposalIndex, uint256 amount) public {
        uint256 votingPower = voteToken.balanceOf(msg.sender) - votePowerSpent[msg.sender];
        require(votingPower >= amount, "Not enough voting power");

        votePowerSpent[msg.sender] += amount;
        proposals[proposalIndex].voteCount += amount;
    }

    function getProposalName(uint index) public view returns (bytes32) {
        return proposals[index].name;
    }

    function getProposalVotes(uint index) public view returns (uint256) {
        return proposals[index].voteCount;
    }

    function getProposalsCount() public view returns (uint256) {
        return proposals.length;
    }
}
