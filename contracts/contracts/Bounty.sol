pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Bounty is ERC20, Ownable {
    mapping(address => uint256) private bounties;

    event BountySubmitted(address indexed user, uint256 amount);
    event BountyClaimed(address indexed user, uint256 amount);

    constructor() ERC20("BountyToken", "BT") {
        // Grant initial supply to the contract owner
        _mint(msg.sender, 1000000 * 10**decimals());
    }

    function submitBounty(address user, uint256 amount) external onlyOwner {
        require(amount > 0, "Bounty: amount must be greater than 0");
        bounties[user] = amount;
        emit BountySubmitted(user, amount);
    }

    function claimBounty(address user) external {
        require(bounties[user] > 0, "Bounty: no bounty available for the specified address");
        require(msg.sender == user, "Bounty: caller is not eligible to claim the bounty");

        uint256 bountyAmount = bounties[user];
        bounties[user] = 0;

        _mint(user, bountyAmount);
        emit BountyClaimed(user, bountyAmount);
    }
}