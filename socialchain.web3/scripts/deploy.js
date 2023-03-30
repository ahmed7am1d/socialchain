const hre = require("hardhat");

async function main() {

  //[1]- Deployment of the contract
  const SocialChain = await hre.ethers.getContractFactory("SocialChain");
  const socialChain = await SocialChain.deploy();
  await socialChain.deployed();

  console.log("SocialChain contract deployed to:",socialChain.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
