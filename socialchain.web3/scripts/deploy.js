const hre = require("hardhat");

async function main() {

  const SocialChain = await hre.ethers.getContractFactory("SocialChain");
  const socialChain = await Lock.deploy(unlockTime, { value: lockedAmount });

  await lock.deployed();

  console.log("SocialChain deployed to:",lock.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
