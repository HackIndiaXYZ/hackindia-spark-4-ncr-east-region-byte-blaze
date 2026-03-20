const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

/**
 * Deployment script for Insurance Smart Contract
 * Deploys to Polygon Amoy testnet
 */

async function main() {
  console.log("🚀 Starting contract deployment...\n");

  try {
    // Get deployer account
    const [deployer] = await ethers.getSigners();
    console.log(`📝 Deploying with account: ${deployer.address}`);
    // FIX: Use ethers.provider.getBalance() instead of deployer.getBalance()
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log(`💰 Account balance: ${balance.toString()} wei\n`);

    // Compile contracts
    console.log("📦 Compiling contracts...");
    await hre.run("compile");
    console.log("✅ Compilation complete\n");

    // Deploy Insurance contract
    console.log("🔨 Deploying Insurance contract...");
    const Insurance = await ethers.getContractFactory("Insurance");
    const insurance = await Insurance.deploy();
    await insurance.waitForDeployment();
    const insuranceAddress = await insurance.getAddress();
    console.log(`✅ Insurance contract deployed at: ${insuranceAddress}\n`);

    // Get deployment details
    const deploymentBlock = await ethers.provider.getBlockNumber();
    const network = hre.network.name;
    const chainId = (await ethers.provider.getNetwork()).chainId;

    console.log("📊 Deployment Details:");
    console.log(`   Network: ${network}`);
    console.log(`   Chain ID: ${chainId}`);
    console.log(`   Deployer: ${deployer.address}`);
    console.log(`   Contract Address: ${insuranceAddress}`);
    console.log(`   Block Number: ${deploymentBlock}\n`);

    // Save deployment info
    const deploymentInfo = {
      network,
      chainId,
      contractAddress: insuranceAddress,
      deployerAddress: deployer.address,
      deploymentBlock,
      deploymentTimestamp: new Date().toISOString(),
      deploymentRPC: process.env.RPC_URL || "https://rpc-amoy.polygon.technology",
    };

    // Save to deployment-info.json
    const infoPath = path.join(__dirname, "../deployment-info.json");
    fs.writeFileSync(infoPath, JSON.stringify(deploymentInfo, null, 2));
    console.log(`💾 Deployment info saved to: deployment-info.json\n`);

    // Get contract ABI and save it
    const artifactsPath = path.join(__dirname, "../artifacts/contracts/Insurance.sol/Insurance.json");
    if (fs.existsSync(artifactsPath)) {
      const artifact = JSON.parse(fs.readFileSync(artifactsPath, "utf8"));
      const abiPath = path.join(__dirname, "../abi/Insurance.json");
      
      // Create abi directory if it doesn't exist
      const abiDir = path.dirname(abiPath);
      if (!fs.existsSync(abiDir)) {
        fs.mkdirSync(abiDir, { recursive: true });
      }
      
      fs.writeFileSync(abiPath, JSON.stringify(artifact.abi, null, 2));
      console.log(`📄 Contract ABI saved to: abi/Insurance.json\n`);
    }

    // Verify contract details
    console.log("🔍 Verifying contract...");
    const owner = await insurance.owner();
    console.log(`   Owner: ${owner}`);
    console.log(`   Initial Balance: ${(await insurance.getContractBalance()).toString()} wei\n`);

    console.log("✅ Deployment successful!");
    console.log(`\n📋 IMPORTANT: Save the contract address for backend configuration:`);
    console.log(`   CONTRACT_ADDRESS=${insuranceAddress}`);

  } catch (error) {
    console.error("❌ Deployment failed!");
    console.error(error);
    process.exitCode = 1;
  }
}

main(); 