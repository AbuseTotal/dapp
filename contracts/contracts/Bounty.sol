pragma solidity ^0.8.0;

contract Bounty {

    mapping(string => Report) public reports;

    function createBounty(string calldata url, uint bountyValue) public payable {
        reports[url].bounty += bountyValue;
    }

}


