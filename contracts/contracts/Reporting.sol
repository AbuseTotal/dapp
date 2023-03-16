pragma solidity ^0.8.0;

contract Reporting {

    mapping(address => uint) public bounties;
    mapping(address => uint) public reputations;

    struct Report {
        address reporter;
        string url;
    }

    Report[] public reports;
    uint reputationReward = 1 ether;

    function submitUrl(string calldata url) external {
        reports.push(Report({ reporter: msg.sender, url: url }));
        reputations[msg.sender] += reputationReward;
    }

    function createBounty(string calldata url, uint bountyValue) external {
    }

    function getReports() public view returns (Report[] memory) {
      return reports;
    }

    function getReputation(address account) public view returns (uint) {
        return reputations[account];
    }
}
