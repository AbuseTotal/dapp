pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Reputation is ERC20, Ownable {
    constructor() ERC20("ReputationToken", "RT") {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) public onlyOwner {
        _burn(from, amount);
    }

    function transfer(address, uint256) public pure override returns (bool) {
        revert("Reputation: transfers are disabled");
    }

    function transferFrom(address, address, uint256) public pure override returns (bool) {
        revert("Reputation: transfers are disabled");
    }

    function approve(address, uint256) public pure override returns (bool) {
        revert("Reputation: approvals are disabled");
    }

    function updateReputation(address user, uint256 newReputation) external onlyOwner {
        _mint(user, newReputation);
        emit ReputationUpdated(user, balanceOf(user));
    }

    event ReputationUpdated(address indexed user, uint256 newReputation);
}
