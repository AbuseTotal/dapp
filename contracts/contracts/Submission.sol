pragma solidity ^0.8.0;

import "./Bounty.sol";
import "./Reputation.sol";

contract Submission is Ownable {
    Bounty private bountyContract;
    Reputation private reputationContract;

    uint256 public submissionCount = 0;
    Report[] public submissions;

    event URLSubmitted(uint256 indexed submissionId, address indexed reporter, string url);
    event SubmissionReviewed(uint256 indexed submissionId, address indexed reporter, uint256 bountyAmount, uint256 reputationAmount);

    struct Report {
        address reporter;
        string url;
        bool reviewed;
    }

    constructor(address _bountyContract, address _reputationContract) {
        bountyContract = Bounty(_bountyContract);
        reputationContract = Reputation(_reputationContract);
    }

    function submitURL(string memory _url) public {
        submissions.push(Report({
            reporter: msg.sender,
            url: _url,
            reviewed: false
        }));
        emit URLSubmitted(submissionCount, msg.sender, _url);
        submissionCount++;
    }

    function reviewSubmission(uint256 _submissionId, uint256 _bountyAmount, uint256 _reputationAmount) public onlyOwner {
        require(_submissionId < submissionCount, "Submission: invalid submission ID");
        Report storage submission = submissions[_submissionId];
        require(!submission.reviewed, "Submission: submission already reviewed");

        // if (_bountyAmount > 0) {
        //     bountyContract.submitBounty(submission.reporter, _bountyAmount);
        // }

        if (_reputationAmount > 0) {
            reputationContract.updateReputation(submission.reporter, _reputationAmount);
        }

        submission.reviewed = true;
        emit SubmissionReviewed(_submissionId, submission.reporter, _bountyAmount, _reputationAmount);
    }
}
