/**
 * Contract Manager
 * Handles interactions with the smart contract
 */

const contractManager = {
  contract: null,
  signer: null,
  
  /**
   * Initialize the contract manager with ethers contract instance
   */
  async init(contract, signer) {
    this.contract = contract;
    this.signer = signer;
    console.log('✅ Contract manager initialized');
  },

  /**
   * Get all available policies
   */
  async getAllPolicies() {
    try {
      if (!this.contract) throw new Error('Contract not initialized');
      const policies = await this.contract.getAllPolicies();
      return policies || [];
    } catch (error) {
      console.error('Error fetching policies:', error);
      throw error;
    }
  },

  /**
   * Get a specific policy by ID
   */
  async getPolicy(policyId) {
    try {
      if (!this.contract) throw new Error('Contract not initialized');
      const policy = await this.contract.getPolicy(policyId);
      return policy;
    } catch (error) {
      console.error('Error fetching policy:', error);
      throw error;
    }
  },

  /**
   * Get user's policies from contract
   */
  async getUserPolicies(walletAddress) {
    try {
      if (!this.contract) throw new Error('Contract not initialized');
      const policies = await this.contract.getUserPolicies(walletAddress);
      return policies || [];
    } catch (error) {
      console.error('Error fetching user policies:', error);
      throw error;
    }
  },

  /**
   * Get payout balance for a user
   */
  async getPayoutBalance(walletAddress) {
    try {
      if (!this.contract) throw new Error('Contract not initialized');
      const balance = await this.contract.getPayoutBalance(walletAddress);
      return balance.toString();
    } catch (error) {
      console.error('Error fetching payout balance:', error);
      throw error;
    }
  },

  /**
   * Create a new policy (admin only)
   */
  async createPolicy(name, premium, payout, rainfallThreshold, temperatureMin, temperatureMax) {
    try {
      if (!this.contract) throw new Error('Contract not initialized');
      const tx = await this.contract.createPolicy(
        name,
        premium,
        payout,
        rainfallThreshold,
        temperatureMin || -50,
        temperatureMax || 50
      );
      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error('Error creating policy:', error);
      throw error;
    }
  },

  /**
   * Purchase a policy (farmer)
   */
  async purchasePolicy(policyId, paymentAmount) {
    try {
      if (!this.contract) throw new Error('Contract not initialized');
      const tx = await this.contract.purchasePolicy(policyId, {
        value: paymentAmount,
      });
      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error('Error purchasing policy:', error);
      throw error;
    }
  },

  /**
   * Get total policies count
   */
  async getTotalPolicies() {
    try {
      if (!this.contract) throw new Error('Contract not initialized');
      const count = await this.contract.getPoliciesCount();
      return count;
    } catch (error) {
      console.error('Error fetching total policies:', error);
      return 0;
    }
  },

  /**
   * Trigger payout based on weather conditions
   */
  async triggerPayout(farmerAddress, policyId, rainfall, temperature) {
    try {
      if (!this.contract) throw new Error('Contract not initialized');
      const tx = await this.contract.triggerWeatherPayout(
        farmerAddress,
        policyId,
        rainfall,
        temperature
      );
      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error('Error triggering payout:', error);
      throw error;
    }
  },
};

export { contractManager };