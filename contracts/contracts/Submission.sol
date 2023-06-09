pragma solidity ^0.8.0;

import "./Bounty.sol";
import "./Reputation.sol";

contract Submission is Ownable {
    Bounty private bountyContract;
    Reputation private reputationContract;

    uint256 public submissionCount = 0;
    Report[] public submissions;

    event URLSubmitted(string indexed submissionUrl, address indexed reporter, string url);
    event SubmissionReviewed(uint256 indexed submissionId, address indexed reporter, address voter, uint256 upVotes, uint256 downVotes);
    event SubmissionFinished(uint256 indexed submissionId, string url);

    struct Report {
        address reporter;
        string url;
        uint256 upVotes;
        uint256 downVotes;
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
            reviewed: false,
            upVotes: 0,
            downVotes: 0
        }));
        emit URLSubmitted(submissionCount, msg.sender, _url);
        submissionCount++;
    }

    function reviewSubmission(uint256 _submissionId, bool _malicious) public {
        require(_submissionId <= submissionCount, "Submission: invalid submission ID");
        Report storage submission = submissions[_submissionId];
        require(!submission.reviewed, "Submission: submission already reviewed");
        require(msg.sender != submission.reporter, "Reporter can't vote in he's report");

        if (_malicious) {
            submission.downVotes++;
        } else {
            submission.upVotes++;
        }

        submissionCount++;

        emit SubmissionReviewed(submission.url, submission.reporter, msg.sender, submission.upVotes, submission.downVotes);
    }

    function setSubmissionReviewed(uint256 _submissionId) public {
        require(_submissionId < submissionCount, "Submission: invalid submission ID");
        Report storage submission = submissions[_submissionId];
        submission.reviewed = true;
        
        emit SubmissionFinished(_submissionId, submission.url);
    }
}
