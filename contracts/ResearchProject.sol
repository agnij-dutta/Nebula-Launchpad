// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ResearchProject is ERC721 {
    using Counters for Counters.Counter;
    
    IERC20 public nblToken;
    Counters.Counter private _projectIds;
    Counters.Counter private _badgeIds;
    
    struct Project {
        uint256 id;
        address researcher;
        string title;
        string description;
        string documentation;
        string externalUrl;
        uint256 minDonation;
        uint256 maxDonation;
        uint256 totalFunds;
        bool isActive;
        mapping(address => uint256) donations;
        mapping(uint256 => Poll) polls;
        uint256 pollCount;
    }
    
    struct Poll {
        string question;
        string[] options;
        uint256 endTime;
        bool isActive;
        mapping(address => bool) hasVoted;
        mapping(uint256 => uint256) votes;
    }
    
    struct Badge {
        uint256 projectId;
        uint256 donationAmount;
        uint256 tier;
    }
    
    mapping(uint256 => Project) public projects;
    mapping(uint256 => Badge) public badges;
    mapping(address => uint256[]) public userProjects;
    mapping(address => mapping(uint256 => uint256)) public userBadges; // user -> projectId -> badgeId
    
    event ProjectCreated(uint256 indexed projectId, address indexed researcher);
    event DonationReceived(uint256 indexed projectId, address indexed donor, uint256 amount);
    event BadgeMinted(uint256 indexed projectId, address indexed donor, uint256 badgeId, uint256 tier);
    event PollCreated(uint256 indexed projectId, uint256 indexed pollId);
    event VoteCast(uint256 indexed projectId, uint256 indexed pollId, address indexed voter);
    
    constructor(address _nblToken) ERC721("Research Project Badge", "RPB") {
        nblToken = IERC20(_nblToken);
    }
    
    function createProject(
        string memory title,
        string memory description,
        string memory documentation,
        string memory externalUrl,
        uint256 minDonation,
        uint256 maxDonation
    ) external {
        require(minDonation > 0, "Minimum donation must be greater than 0");
        require(maxDonation >= minDonation, "Maximum donation must be greater than or equal to minimum");
        
        uint256 projectId = _projectIds.current();
        _projectIds.increment();
        
        Project storage project = projects[projectId];
        project.id = projectId;
        project.researcher = msg.sender;
        project.title = title;
        project.description = description;
        project.documentation = documentation;
        project.externalUrl = externalUrl;
        project.minDonation = minDonation;
        project.maxDonation = maxDonation;
        project.isActive = true;
        
        userProjects[msg.sender].push(projectId);
        
        emit ProjectCreated(projectId, msg.sender);
    }
    
    function donate(uint256 projectId, uint256 amount) external {
        Project storage project = projects[projectId];
        require(project.isActive, "Project is not active");
        require(amount >= project.minDonation, "Amount below minimum donation");
        require(amount <= project.maxDonation, "Amount above maximum donation");
        
        require(nblToken.transferFrom(msg.sender, address(this), amount), "Token transfer failed");
        
        project.donations[msg.sender] += amount;
        project.totalFunds += amount;
        
        uint256 tier = calculateBadgeTier(project.donations[msg.sender]);
        
        // Only mint a new badge if the donor doesn't have one for this project
        // or if they're eligible for a higher tier
        if (userBadges[msg.sender][projectId] == 0 || 
            badges[userBadges[msg.sender][projectId]].tier < tier) {
            _mintBadge(projectId, msg.sender, project.donations[msg.sender], tier);
        }
        
        emit DonationReceived(projectId, msg.sender, amount);
    }
    
    function _mintBadge(uint256 projectId, address donor, uint256 donationAmount, uint256 tier) internal {
        uint256 badgeId = _badgeIds.current();
        _badgeIds.increment();
        
        _safeMint(donor, badgeId);
        
        badges[badgeId] = Badge({
            projectId: projectId,
            donationAmount: donationAmount,
            tier: tier
        });
        
        // Update or set the badge ID for this donor and project
        userBadges[donor][projectId] = badgeId;
        
        emit BadgeMinted(projectId, donor, badgeId, tier);
    }
    
    function calculateBadgeTier(uint256 amount) internal pure returns (uint256) {
        if (amount >= 1000 * 10**18) return 3; // Platinum
        if (amount >= 500 * 10**18) return 2;  // Gold
        return 1;                              // Silver
    }
    
    function createPoll(uint256 projectId, string memory question, string[] memory options, uint256 duration) external {
        Project storage project = projects[projectId];
        require(msg.sender == project.researcher, "Only researcher can create polls");
        require(options.length > 1, "Must have at least 2 options");
        
        uint256 pollId = project.pollCount++;
        Poll storage poll = project.polls[pollId];
        poll.question = question;
        poll.options = options;
        poll.endTime = block.timestamp + duration;
        poll.isActive = true;
        
        emit PollCreated(projectId, pollId);
    }
    
    function vote(uint256 projectId, uint256 pollId, uint256 optionId) external {
        Project storage project = projects[projectId];
        Poll storage poll = project.polls[pollId];
        
        require(poll.isActive, "Poll is not active");
        require(block.timestamp < poll.endTime, "Poll has ended");
        require(optionId < poll.options.length, "Invalid option");
        require(!poll.hasVoted[msg.sender], "Already voted");
        require(project.donations[msg.sender] > 0, "Must be a donor to vote");
        
        poll.hasVoted[msg.sender] = true;
        poll.votes[optionId]++;
        
        emit VoteCast(projectId, pollId, msg.sender);
    }
    
    function getUserProjects(address user) external view returns (uint256[] memory) {
        return userProjects[user];
    }
    
    function getProjectDetails(uint256 projectId) external view returns (
        address researcher,
        string memory title,
        string memory description,
        string memory documentation,
        string memory externalUrl,
        uint256 minDonation,
        uint256 maxDonation,
        uint256 totalFunds,
        bool isActive
    ) {
        Project storage project = projects[projectId];
        return (
            project.researcher,
            project.title,
            project.description,
            project.documentation,
            project.externalUrl,
            project.minDonation,
            project.maxDonation,
            project.totalFunds,
            project.isActive
        );
    }
    
    function getPollDetails(uint256 projectId, uint256 pollId) external view returns (
        string memory question,
        string[] memory options,
        uint256 endTime,
        bool isActive
    ) {
        Project storage project = projects[projectId];
        Poll storage poll = project.polls[pollId];
        return (
            poll.question,
            poll.options,
            poll.endTime,
            poll.isActive
        );
    }
    
    function getVotes(uint256 projectId, uint256 pollId, uint256 optionId) external view returns (uint256) {
        return projects[projectId].polls[pollId].votes[optionId];
    }
    
    function getDonationAmount(uint256 projectId, address donor) external view returns (uint256) {
        return projects[projectId].donations[donor];
    }
    
    function getBadgeDetails(uint256 badgeId) external view returns (
        uint256 projectId,
        uint256 donationAmount,
        uint256 tier
    ) {
        Badge memory badge = badges[badgeId];
        return (badge.projectId, badge.donationAmount, badge.tier);
    }
    
    function getProjectCount() external view returns (uint256) {
        return _projectIds.current();
    }
}
