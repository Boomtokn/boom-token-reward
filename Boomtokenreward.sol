// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BoomReward {
    address public owner;
    mapping(address => uint256) public rewards;

    event RewardDistributed(address indexed user, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    function distributeReward(address user, uint256 amount) external {
        require(msg.sender == owner, "Only owner can distribute rewards");
        rewards[user] += amount;
        emit RewardDistributed(user, amount);
    }

    function checkReward(address user) external view returns (uint256) {
        return rewards[user];
    }
}
