// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {LotteryToken} from "./LotteryToken.sol";

contract Lottery is Ownable {
    LotteryToken public paymentToken;
    uint256 public purchaseRatio;
    uint256 public betPrice;
    uint256 public betFee;
    uint256 public prizePool;
    uint256 public ownerPool;
    bool public betsOpen;
    uint256 public betsClosingTime;
    mapping(address => uint256) public prize;

    address[] private _slots;

    constructor(
        string memory tokenName,
        string memory tokenSymbol,
        uint256 _purchaseRatio,
        uint256 _betPrice,
        uint256 _betFee
    ) Ownable(msg.sender) {
        paymentToken = new LotteryToken(tokenName, tokenSymbol);
        purchaseRatio = _purchaseRatio;
        betPrice = _betPrice;
        betFee = _betFee;
    }

    modifier whenBetsClosed() {
        require(!betsOpen, "Lottery is open");
        _;
    }

    modifier whenBetsOpen() {
        require(betsOpen && block.timestamp < betsClosingTime, "Lottery is closed");
        _;
    }

    function openBets(uint256 closingTime) external onlyOwner whenBetsClosed {
        require(closingTime > block.timestamp, "Closing time must be in the future");
        betsClosingTime = closingTime;
        betsOpen = true;
    }

    function purchaseTokens() external payable {
        paymentToken.mint(msg.sender, msg.value * purchaseRatio);
    }

    function bet() public whenBetsOpen {
        ownerPool += betFee;
        prizePool += betPrice;
        _slots.push(msg.sender);
        paymentToken.transferFrom(msg.sender, address(this), betPrice + betFee);
    }

    function betMany(uint256 times) external {
        require(times > 0, "Must bet at least once");
        for (uint256 i = 0; i < times; i++) {
            bet();
        }
    }

    function closeLottery() external {
        require(block.timestamp >= betsClosingTime, "Too soon to close");
        require(betsOpen, "Lottery already closed");

        if (_slots.length > 0) {
            uint256 winnerIndex = getRandomNumber() % _slots.length;
            address winner = _slots[winnerIndex];
            prize[winner] += prizePool;
            prizePool = 0;
            delete _slots;
        }

        betsOpen = false;
    }

    function getRandomNumber() public view returns (uint256 randomNumber) {
        return uint256(block.prevrandao);
    }

    function prizeWithdraw(uint256 amount) external {
        require(amount <= prize[msg.sender], "Not enough prize balance");
        prize[msg.sender] -= amount;
        paymentToken.transfer(msg.sender, amount);
    }

    function ownerWithdraw(uint256 amount) external onlyOwner {
        require(amount <= ownerPool, "Not enough fees collected");
        ownerPool -= amount;
        paymentToken.transfer(msg.sender, amount);
    }

    function returnTokens(uint256 amount) external {
        paymentToken.burnFrom(msg.sender, amount);
        payable(msg.sender).transfer(amount / purchaseRatio);
    }
}
