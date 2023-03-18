pragma solidity ^0.8.0;

import "./Bounty.sol";
import "./Reputation.sol";

contract Submission is Ownable {
    Bounty private bountyContract;
    Reputation private reputationContract;

    uint256 public submissionCount = 0;
    Report[] public submissions;

    event URLSubmitted(uint256 indexed submissionId, address indexed reporter, string url);
    event SubmissionReviewed(uint256 indexed submissionId, address indexed reporter, address voter, uint256 upVotes, uint256 downVotes);

    struct Report {
        address reporter;
        string url;
        uint256 upVotes;
        uint256 downVotes;
        address[] voters;
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

    function reviewSubmission(uint256 _submissionId, bool _malicious) public onlyOwner {
        require(_submissionId < submissionCount, "Submission: invalid submission ID");
        Report storage submission = submissions[_submissionId];
        require(!submission.reviewed, "Submission: submission already reviewed");

        require(msg.sender != reporter, "Reporter can't vote in he's report");
        //TODO: voters can only vote one time (msg.sender != voters[i])
        if (_malicious) {
            submission[downVotes]++;
        } else {
            submission[upVotes]++;
        }

        emit SubmissionReviewed(_submissionId, submission.reporter, msg.sender, upVotes, downVotes);
    }
}
