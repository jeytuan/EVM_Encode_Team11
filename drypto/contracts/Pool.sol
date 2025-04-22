// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Pool {
    address public creator;
    uint256 public goal;
    uint256 public deadline;
    uint256 public minContribution;
    uint256 public createdAt;
    bool public withdrawn;

    string public name;
    string public description;
    string public category;
    string public visibility; // 👈 NEW FIELD

    mapping(address => uint256) public contributions;

    event Contributed(address indexed contributor, uint256 amount);
    event Withdrawn(address indexed to, uint256 amount);

    constructor(
        address _creator,
        uint256 _goal,
        uint256 _durationInDays,
        uint256 _minContribution,
        string memory _category,
        string memory _name,
        string memory _description,
        string memory _visibility // 👈 NEW PARAMETER
    ) {
        creator = _creator;
        goal = _goal;
        minContribution = _minContribution;
        deadline = block.timestamp + (_durationInDays * 1 days);
        category = _category;
        name = _name;
        description = _description;
        visibility = _visibility; // 👈 NEW ASSIGNMENT
        createdAt = block.timestamp;
        withdrawn = false;
    }

    function contribute() external payable {
        require(msg.value > 0, "Must send some ETH");
        require(msg.value >= minContribution, "Below minimum contribution");
        require(block.timestamp < deadline, "Pool has expired");

        contributions[msg.sender] += msg.value;
        emit Contributed(msg.sender, msg.value);
    }

    function withdraw() external {
        require(msg.sender == creator, "Only creator can withdraw");
        require(!withdrawn, "Already withdrawn");
        require(address(this).balance >= goal || block.timestamp >= deadline, "Cannot withdraw yet");

        withdrawn = true;
        uint256 amount = address(this).balance;
        payable(creator).transfer(amount);
        emit Withdrawn(creator, amount);
    }

    function getTotalBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getMyContribution() public view returns (uint256) {
        return contributions[msg.sender];
    }
}
