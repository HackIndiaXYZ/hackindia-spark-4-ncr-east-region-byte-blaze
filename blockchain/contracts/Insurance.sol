// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title InsuranceContract
 * @dev Parametric Weather Insurance Smart Contract for InsuChain
 * @notice This contract manages crop insurance policies with automatic payouts based on rainfall data
 */

contract Insurance {
    
    // ==================== STRUCTS ====================
    /**
     * @dev Policy structure containing all farmer insurance information
     */
    struct Policy {
        address farmer;                 // Farmer's wallet address
        uint256 premium;                // Premium amount paid (in wei)
        uint256 payout;                 // Maximum payout amount (premium * 2)
        uint256 rainfallThreshold;      // Rainfall threshold in mm (triggers payout if exceeded)
        bool active;                    // Whether the policy is currently active
        bool payoutClaimed;             // Whether payout has been claimed (prevent double payout)
        uint256 purchaseTimestamp;      // When the policy was purchased
    }

    // ==================== STATE VARIABLES ====================
    mapping(address => Policy) public policies;
    address public owner;
    uint256 public totalPoliciesSold;
    uint256 public totalPayoutsTriggered;
    uint256 public contractBalance;
    
    // Track all farmers for batch operations
    address[] public activeFarmers;
    mapping(address => bool) private farmerExists;

    // ==================== EVENTS ====================
    /**
     * @dev Emitted when a farmer buys a new insurance policy
     */
    event PolicyBought(
        address indexed farmer,
        uint256 premium,
        uint256 payout,
        uint256 rainfallThreshold,
        uint256 timestamp
    );

    /**
     * @dev Emitted when a payout is triggered
     */
    event PayoutTriggered(
        address indexed farmer,
        uint256 payoutAmount,
        uint256 rainfall,
        uint256 threshold,
        uint256 timestamp
    );

    /**
     * @dev Emitted when a policy becomes inactive
     */
    event PolicyDeactivated(
        address indexed farmer,
        uint256 timestamp
    );

    /**
     * @dev Emitted when contract receives funds
     */
    event FundsReceived(
        address indexed sender,
        uint256 amount,
        uint256 timestamp
    );

    // ==================== MODIFIERS ====================
    /**
     * @dev Ensures the caller is the contract owner
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    /**
     * @dev Ensures the farmer has an active policy
     */
    modifier policyExists(address farmer) {
        require(policies[farmer].farmer != address(0), "No policy found for this address");
        _;
    }

    /**
     * @dev Ensures the policy is currently active
     */
    modifier policyActive(address farmer) {
        require(policies[farmer].active, "Policy is not active");
        _;
    }

    // ==================== CONSTRUCTOR ====================
    /**
     * @dev Initialize the contract and set the owner
     */
    constructor() {
        owner = msg.sender;
        contractBalance = 0;
    }

    // ==================== POLICY MANAGEMENT ====================
    
    /**
     * @dev Buy a new insurance policy
     * @param rainfallThreshold The rainfall threshold in mm that triggers payout
     * @notice Premium must be sent as msg.value in wei (e.g., 0.1 MATIC = 100000000000000000 wei)
     * @notice Payout will be automatically set to 2x the premium
     */
    function buyPolicy(uint256 rainfallThreshold) external payable {
        require(msg.value > 0, "Premium must be greater than 0");
        require(rainfallThreshold > 0, "Rainfall threshold must be greater than 0");
        require(!policies[msg.sender].active, "You already have an active policy");
        
        uint256 premium = msg.value;
        uint256 payout = premium * 2;

        // Create new policy
        policies[msg.sender] = Policy({
            farmer: msg.sender,
            premium: premium,
            payout: payout,
            rainfallThreshold: rainfallThreshold,
            active: true,
            payoutClaimed: false,
            purchaseTimestamp: block.timestamp
        });

        // Add to active farmers list if not already there
        if (!farmerExists[msg.sender]) {
            activeFarmers.push(msg.sender);
            farmerExists[msg.sender] = true;
        }

        contractBalance += premium;
        totalPoliciesSold++;

        emit PolicyBought(msg.sender, premium, payout, rainfallThreshold, block.timestamp);
    }

    /**
     * @dev Trigger a payout for a farmer based on rainfall data
     * @param farmer The farmer's wallet address
     * @param rainfall The actual rainfall in mm
     * @notice Only owner (backend) can call this function
     * @notice Payout can only be triggered once per policy
     * @notice Rainfall must exceed the threshold to trigger payout
     */
    function triggerPayout(address farmer, uint256 rainfall) 
        external 
        onlyOwner 
        policyExists(farmer) 
        policyActive(farmer)
    {
        Policy storage policy = policies[farmer];

        require(rainfall > policy.rainfallThreshold, "Rainfall does not exceed threshold");
        require(!policy.payoutClaimed, "Payout already claimed for this policy");
        require(contractBalance >= policy.payout, "Contract has insufficient funds");

        // Mark payout as claimed to prevent double payout
        policy.payoutClaimed = true;
        policy.active = false;

        // Update contract balance
        contractBalance -= policy.payout;

        // Transfer payout to farmer
        (bool success, ) = payable(farmer).call{value: policy.payout}("");
        require(success, "Payout transfer failed");

        totalPayoutsTriggered++;

        emit PayoutTriggered(farmer, policy.payout, rainfall, policy.rainfallThreshold, block.timestamp);
        emit PolicyDeactivated(farmer, block.timestamp);
    }

    /**
     * @dev Deactivate a policy manually (e.g., when insurance period ends)
     * @param farmer The farmer's wallet address
     */
    function deactivatePolicy(address farmer) 
        external 
        onlyOwner 
        policyExists(farmer) 
        policyActive(farmer)
    {
        policies[farmer].active = false;
        emit PolicyDeactivated(farmer, block.timestamp);
    }

    // ==================== VIEW FUNCTIONS ====================

    /**
     * @dev Get policy details for a specific farmer
     * @param farmer The farmer's wallet address
     * @return The complete Policy struct
     */
    function getPolicy(address farmer) 
        external 
        view 
        policyExists(farmer)
        returns (Policy memory) 
    {
        return policies[farmer];
    }

    /**
     * @dev Check if a farmer has an active policy
     * @param farmer The farmer's wallet address
     * @return true if policy exists and is active, false otherwise
     */
    function hasPolicyActive(address farmer) external view returns (bool) {
        return policies[farmer].active;
    }

    /**
     * @dev Get the current balance of the contract
     * @return The contract's MATIC balance in wei
     */
    function getContractBalance() external view returns (uint256) {
        return contractBalance;
    }

    /**
     * @dev Get the number of active farmers
     * @return The count of active farmer policies
     */
    function getActiveFarmersCount() external view returns (uint256) {
        return activeFarmers.length;
    }

    /**
     * @dev Get all active farmer addresses
     * @return Array of farmer addresses with active policies
     */
    function getActiveFarmers() external view returns (address[] memory) {
        return activeFarmers;
    }

    /**
     * @dev Get contract statistics
     * @return Total policies sold
     * @return Total payouts triggered
     * @return Current contract balance
     */
    function getStats() external view returns (uint256, uint256, uint256) {
        return (totalPoliciesSold, totalPayoutsTriggered, contractBalance);
    }

    // ==================== ADMIN FUNCTIONS ====================

    /**
     * @dev Allow the contract to receive funds
     */
    receive() external payable {
        contractBalance += msg.value;
        emit FundsReceived(msg.sender, msg.value, block.timestamp);
    }

    /**
     * @dev Withdraw funds from contract (emergency only)
     * @param amount The amount to withdraw in wei
     */
    function withdrawFunds(uint256 amount) external onlyOwner {
        require(amount <= contractBalance, "Insufficient contract balance");
        contractBalance -= amount;
        (bool success, ) = payable(owner).call{value: amount}("");
        require(success, "Withdrawal failed");
    }

    /**
     * @dev Transfer ownership to a new address
     * @param newOwner The new owner's wallet address
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid new owner address");
        owner = newOwner;
    }
}
