require("@nomicfoundation/hardhat-toolbox");
const socialChainCompiled = require("../socialchain.client/contract-artifacts/contracts/SocialChain.sol/SocialChain.json");
const { abi, bytecode } = socialChainCompiled;
//----When running tasks the network should be specified----
//#region tasks
//[0]- Greetings task from the SocialChain contract
task("greetings", "Greetings from social chain :)").setAction(async () => {
  const MyContract = await ethers.getContractFactory(abi, bytecode);
  const contract = await MyContract.attach(
    "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  );
  console.log(await contract.greetings());
});
//[1]- Check if the username is available or not
task(
  "username-available",
  "Checks if user name is available in the social chain."
)
  .addParam("username", "The username to be checked")
  .setAction(async (taskArgs) => {
    const MyContract = await ethers.getContractFactory(abi, bytecode);
    const contract = await MyContract.attach(
      "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    );
    (await contract.userNameAvailable(taskArgs.username))
      ? console.log("The user name is available.")
      : console.log("The user name is not available.");
  });

//[2]- Get the account balance from account address
task("balance", "Prints an account's balance")
  .addParam("account", "The account's address")
  .setAction(async (taskArgs) => {
    const balance = await ethers.provider.getBalance(taskArgs.account);
    console.log(ethers.utils.formatEther(balance), "ETH");
  });

//[3]- Get user object by account address


//#endregion

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  paths: {
    artifacts: "../socialchain.client/contract-artifacts",
  },
  networks: {
    localNetwork: {
      url: "http://127.0.0.1:8545/",
    },
  },
};
