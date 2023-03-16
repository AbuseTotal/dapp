pragma solidity ^0.8.0;

contract Reporting {

    mapping(address => uint) public bounties;
    mapping(address => uint) public reputations;
    mapping(string => Report) public reports;

    struct Report {
        address reporter;
        string url;
        uint bounty;
    }

    event CounterIncreased(
        uint _counter
    );

    event URLSubmitted(
        Report report
    );

    uint reputationReward = 1 ether;
    uint reportsCounter;

    address payable public owner;

    constructor() payable {
        owner = payable(msg.sender);
        reportsCounter = 0;
    }

    function submitUrl(string calldata url) external {
        //TODO: check errors
        reports[url] = Report({ reporter: msg.sender, url: url, bounty: 0 });
        reputations[msg.sender] += reputationReward;
        _increaseCounter();
        emit URLSubmitted(reports[url]);
    }

    function _increaseCounter() private {
        reportsCounter++;
        emit CounterIncreased(reportsCounter);
    }
              

    function createBounty(string calldata url, uint bountyValue) public payable {
        reports[url].bounty += bountyValue;
    }

    function getReport(string calldata url) public view returns (Report memory) {
        return reports[url];
    }

    function getReputation(address account) public view returns (uint) {
        return reputations[account];
    }
}
