// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DSCIExchange is ReentrancyGuard, Ownable {
    IERC20 public nblToken;
    
    // Exchange rate: 1 AVAX = 100 NBL (adjusted rate for testnet)
    uint256 public constant EXCHANGE_RATE = 100;
    
    event TokensPurchased(address indexed buyer, uint256 avaxAmount, uint256 tokenAmount);
    
    constructor(address _nblToken) {
        nblToken = IERC20(_nblToken);
    }
    
    function _buyTokens(uint256 avaxAmount) internal {
        require(avaxAmount > 0, "Must send AVAX");
        
        // Calculate tokens to send (avaxAmount is already in wei)
        uint256 tokenAmount = (avaxAmount * EXCHANGE_RATE);
        
        require(nblToken.balanceOf(address(this)) >= tokenAmount, "Insufficient exchange liquidity");
        require(nblToken.transfer(msg.sender, tokenAmount), "Transfer failed");
        
        emit TokensPurchased(msg.sender, avaxAmount, tokenAmount);
    }
    
    function buyTokens() external payable nonReentrant {
        _buyTokens(msg.value);
    }
    
    function withdrawAVAX() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No AVAX to withdraw");
        
        (bool sent, ) = payable(msg.sender).call{value: balance}("");
        require(sent, "Failed to send AVAX");
    }
    
    function withdrawNBL(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        require(nblToken.balanceOf(address(this)) >= amount, "Insufficient balance");
        require(nblToken.transfer(msg.sender, amount), "Transfer failed");
    }
    
    receive() external payable {
        _buyTokens(msg.value);
    }
}
