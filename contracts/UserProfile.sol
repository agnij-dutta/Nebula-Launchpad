// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract UserProfile is Ownable {
    struct Profile {
        string name;
        string email;
        string avatar;
        bool isRegistered;
    }
    
    mapping(address => Profile) public profiles;
    
    event ProfileUpdated(address indexed user, string name, string email);
    
    constructor() {
    }
    
    function updateProfile(
        string memory name,
        string memory email,
        string memory avatar
    ) external {
        profiles[msg.sender] = Profile({
            name: name,
            email: email,
            avatar: avatar,
            isRegistered: true
        });
        
        emit ProfileUpdated(msg.sender, name, email);
    }
    
    function getProfile(address user) external view returns (
        string memory name,
        string memory email,
        string memory avatar,
        bool isRegistered
    ) {
        Profile memory profile = profiles[user];
        return (
            profile.name,
            profile.email,
            profile.avatar,
            profile.isRegistered
        );
    }
}
