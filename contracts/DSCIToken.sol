// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DSCIToken is ERC20, Ownable {
    // Wallet addresses for token distribution
    address public platformRewardsWallet;
    address public developmentWallet;
    address public ecosystemGrowthWallet;
    address public communityWallet;
    address public emergencyReserveWallet;

    // Total supply: 100 million tokens
    uint256 private constant TOTAL_SUPPLY = 100_000_000 * 10**18;

    // Distribution percentages (in basis points, 1% = 100)
    uint16 private constant PLATFORM_REWARDS_SHARE = 2000;    // 20%
    uint16 private constant DEVELOPMENT_SHARE = 1500;         // 15%
    uint16 private constant ECOSYSTEM_GROWTH_SHARE = 1500;    // 15%
    uint16 private constant COMMUNITY_SHARE = 4000;          // 40%
    uint16 private constant EMERGENCY_RESERVE_SHARE = 1000;   // 10%

    constructor(
        address _platformRewardsWallet,
        address _developmentWallet,
        address _ecosystemGrowthWallet,
        address _communityWallet,
        address _emergencyReserveWallet
    ) ERC20("NBL Token", "NBL") {
        require(
            _platformRewardsWallet != address(0) &&
            _developmentWallet != address(0) &&
            _ecosystemGrowthWallet != address(0) &&
            _communityWallet != address(0) &&
            _emergencyReserveWallet != address(0),
            "Zero address not allowed"
        );

        platformRewardsWallet = _platformRewardsWallet;
        developmentWallet = _developmentWallet;
        ecosystemGrowthWallet = _ecosystemGrowthWallet;
        communityWallet = _communityWallet;
        emergencyReserveWallet = _emergencyReserveWallet;

        // Mint and distribute tokens
        _mint(platformRewardsWallet, (TOTAL_SUPPLY * PLATFORM_REWARDS_SHARE) / 10000);
        _mint(developmentWallet, (TOTAL_SUPPLY * DEVELOPMENT_SHARE) / 10000);
        _mint(ecosystemGrowthWallet, (TOTAL_SUPPLY * ECOSYSTEM_GROWTH_SHARE) / 10000);
        _mint(communityWallet, (TOTAL_SUPPLY * COMMUNITY_SHARE) / 10000);
        _mint(emergencyReserveWallet, (TOTAL_SUPPLY * EMERGENCY_RESERVE_SHARE) / 10000);
    }

    function updatePlatformRewardsWallet(address _newWallet) external onlyOwner {
        require(_newWallet != address(0), "Zero address not allowed");
        platformRewardsWallet = _newWallet;
    }

    function updateDevelopmentWallet(address _newWallet) external onlyOwner {
        require(_newWallet != address(0), "Zero address not allowed");
        developmentWallet = _newWallet;
    }

    function updateEcosystemGrowthWallet(address _newWallet) external onlyOwner {
        require(_newWallet != address(0), "Zero address not allowed");
        ecosystemGrowthWallet = _newWallet;
    }

    function updateCommunityWallet(address _newWallet) external onlyOwner {
        require(_newWallet != address(0), "Zero address not allowed");
        communityWallet = _newWallet;
    }

    function updateEmergencyReserveWallet(address _newWallet) external onlyOwner {
        require(_newWallet != address(0), "Zero address not allowed");
        emergencyReserveWallet = _newWallet;
    }
}
