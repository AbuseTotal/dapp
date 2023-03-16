pragma solidity ^0.8.0;

contract Submission {

    address payable public owner;

    uint reputationReward = 1 ether;
    uint reportsCounter;

    mapping(address => uint) public reputations;
    mapping(string => Report) public reports;

    struct Report {
        address reporter;
        string url;
        uint bounty;
    }

    event URLSubmitted(Report report);  

    constructor() payable {
        owner = payable(msg.sender);
    }

    function submitUrl(string calldata url) external {
        //TODO: check errors
        reports[url] = Report({ reporter: msg.sender, url: url, bounty: 0 });
        reputations[msg.sender] += reputationReward;
        emit URLSubmitted(reports[url]);
    }

    function getReport(string calldata url) public view returns (Report memory) {
        return reports[url];
    }

    function getReputation(address account) public view returns (uint) {
        return reputations[account];
    }
}

contract Bounty {

    Submission submissionContract;

    function createBounty(string calldata url, uint bountyValue) public payable {
        submissionContract.reports[url]
        .bounty += bountyValue;
    }

}
