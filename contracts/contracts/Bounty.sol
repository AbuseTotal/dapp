pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Bounty is ERC20, Ownable {
    mapping(string => uint256) private bounties;

    event BountySubmitted(string indexed userId, uint256 amount);
    event BountyClaimed(string indexed userId, uint256 amount);

    constructor() ERC20("BountyToken", "BT") {
        // Grant initial supply to the contract owner
        _mint(msg.sender, 1000000 * 10**decimals());
    }

    function submitBounty(uint256 amount, string calldata userId) external onlyOwner {
        require(amount > 0, "Bounty: amount must be greater than 0");
        bounties[userId] = amount;
        emit BountySubmitted(userId, amount);
    }

    function claimBounty(address to, string calldata userId) external onlyOwner {
        require(bounties[userId] > 0, "Bounty: no bounty available for the specified address");
        // require(msg.sender == to, "Bounty: caller is not eligible to claim the bounty");

        uint256 bountyAmount = bounties[userId];
        bounties[userId] = 0;

        _mint(to, bountyAmount);
        emit BountyClaimed(userId, bountyAmount);
    }
}