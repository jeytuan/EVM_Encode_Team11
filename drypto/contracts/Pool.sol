// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Pool {
    address public creator;
    uint256 public goal;
    uint256 public deadline;
    uint256 public minContribution;
    uint256 public createdAt;
    bool public withdrawn;

    string private _name;
    string private _description;
    string private _category;
    string private _visibility;

    mapping(address => uint256) public contributions;

    event Contributed(address indexed contributor, uint256 amount);
    event Withdrawn(address indexed to, uint256 amount);

    constructor(
        address _creator,
        uint256 _goal,
        uint256 _durationInDays,
        uint256 _minContribution,
        string memory category_,
        string memory name_,
        string memory description_,
        string memory visibility_
    ) {
        creator = _creator;
        goal = _goal;
        minContribution = _minContribution;
        deadline = block.timestamp + (_durationInDays * 1 days);
        _category = category_;
        _name = name_;
        _description = description_;
        _visibility = visibility_;
        createdAt = block.timestamp;
        withdrawn = false;
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function description() public view returns (string memory) {
        return _description;
    }

    function category() public view returns (string memory) {
        return _category;
    }

    function visibility() public view returns (string memory) {
        return _visibility;
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
