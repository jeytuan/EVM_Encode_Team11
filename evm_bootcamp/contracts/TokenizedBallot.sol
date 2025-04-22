// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TokenizedBallot {
    struct Proposal {
        bytes32 name;
        uint256 voteCount;
    }

    struct Voter {
        uint256 weight;
        bool voted;
        address delegate;
        uint256 vote;
    }

    mapping(address => Voter) public voters;

    Proposal[] public proposals;
    IERC20 public voteToken;
    mapping(address => uint256) public votePowerSpent;

    constructor(bytes32[] memory proposalNames, address tokenAddress) {
        voteToken = IERC20(tokenAddress);
        for (uint i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({
                name: proposalNames[i],
                voteCount: 0
            }));
        }
    }

    function giveRightToVote(address voter) public {
        require(voters[voter].weight == 0, "Already has right to vote");
        uint256 balance = voteToken.balanceOf(voter);
        require(balance > 0, "No tokens to assign vote weight");
        voters[voter].weight = balance;
    }

    function vote(uint proposalIndex, uint256 amount) public {
        Voter storage sender = voters[msg.sender];
        require(!sender.voted, "Already voted");
        require(sender.weight >= amount, "Insufficient vote weight");

        sender.voted = true;
        sender.vote = proposalIndex;
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
