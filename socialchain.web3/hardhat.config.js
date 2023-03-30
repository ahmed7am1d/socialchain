require("@nomicfoundation/hardhat-toolbox");

//#region tasks
//[1]- Check if the username is available or not
task(
  "username-available",
  "Checks if user name is available in the social chain."
)
  .addParam("username", "The username to be checked")
  .setAction(async (taskArgs) => {
    const MyContract = await ethers.getContractFactory("SocialChain");
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
//#endregion

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    localNetwork: {
      url: "http://127.0.0.1:8545/",
    },
  },
};
