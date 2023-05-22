require("@nomicfoundation/hardhat-toolbox");
// const socialChainCompiled = require("../socialchain.client/contract-artifacts/contracts/SocialChain.sol/SocialChain.json");
// const { abi, bytecode } = socialChainCompiled;
// //----When running tasks the network should be specified----
// //#region tasks
// //[0]- Greetings task from the SocialChain contract
// task("greetings", "Greetings from social chain :)").setAction(async () => {
//   const MyContract = await ethers.getContractFactory(abi, bytecode);
//   const contract = await MyContract.attach(
//     "0x5FbDB2315678afecb367f032d93F642f64180aa3"
//   );
//   console.log(await contract.greetings());
// });
// //[1]- Check if the username is available or not
// task(
//   "username-available",
//   "Checks if user name is available in the social chain."
// )
//   .addParam("username", "The username to be checked")
//   .setAction(async (taskArgs) => {
//     const MyContract = await ethers.getContractFactory(abi, bytecode);
//     const contract = await MyContract.attach(
//       "0x5fbdb2315678afecb367f032d93f642f64180aa3"
//     );
//     (await contract.userNameAvailable(taskArgs.username))
//       ? console.log("The user name is available.")
//       : console.log("The user name is not available.");
//   });

// //[2]- Get the account balance from account address
// task("balance", "Prints an account's balance")
//   .addParam("account", "The account's address")
//   .setAction(async (taskArgs) => {
//     const balance = await ethers.provider.getBalance(taskArgs.account);
//     console.log(ethers.utils.formatEther(balance), "ETH");
//   });
// //[3]- Get user details
// task("social-chain-user", "Get the user details that calls the function")
//   .addParam("accountaddress", "The account address")
//   .setAction(async (taskArgs) => {
//     const MyContract = await ethers.getContractFactory("SocialChain");
//     const contract = await MyContract.attach(
//       "0x775624b6E34A9570245dc8Fe374F3Bf9c9dEb039"
//     );
//     const result = await contract.getUser(taskArgs.accountaddress);
//     console.log(result);
//   });
// //[4]- Create new post
// task("create-post", "Create new post")
//   .addParam("accountaddress", "The account address")
//   .addParam("postdes", "Post description")
//   .addParam("imghash", "hash of the image in IPFS")
//   .setAction(async (taskArgs) => {
//     const MyContract = await ethers.getContractFactory("SocialChain");
//     const contract = await MyContract.attach(
//       "0x5FbDB2315678afecb367f032d93F642f64180aa3"
//     );
//     const result = await contract.createPost(
//       taskArgs.accountaddress,
//       taskArgs.postdes,
//       taskArgs.imghash
//     );
//     console.log(result);
//   });
//   //[5]- Get a post by id
//   task("get-post-byid","Get a post by id")
//   .addParam("postid", "The post id")
//   .setAction(async (taskArgs) => {
//     const MyContract = await ethers.getContractFactory("SocialChain");
//     const contract = await MyContract.attach(
//       "0x5FbDB2315678afecb367f032d93F642f64180aa3"
//     );
//     const result = await contract.getPost(
//       taskArgs.postid
//     );
//     console.log(result);
//   })

//   //[6]- Get all user post 
//   task("get-user-posts","Get all user's post")
//   .setAction( async () => {
//     const MyContract = await ethers.getContractFactory("SocialChain");
//     const contract = await MyContract.attach(
//       "0x5FbDB2315678afecb367f032d93F642f64180aa3"
//     );
//     const result = await contract.getUserPosts(
//     );
//     console.log(result);
//   })
//   //[7]- Task to get the chain's accounts and their balances
//   task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
//     const accounts = await hre.ethers.getSigners();
//     const provider = hre.ethers.provider;

//     for (const account of accounts) {
//         console.log(
//             "%s (%i ETH)",
//             account.address,
//             hre.ethers.utils.formatEther(
//                 // getBalance returns wei amount, format to ETH amount
//                 await provider.getBalance(account.address)
//             )
//         );
//     }
// });
// //#endregion

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  paths: {
    artifacts: "../socialchain.client/contract-artifacts",
  },
  networks: {
    // Hardhat local blockchain
    localNetwork: {
      url: "http://127.0.0.1:8545/",
    },
    // Ganache local blockchain
    localGanache: {
      url:'HTTP://127.0.0.1:7545',
      accounts:['0x4b47c7182ec4b541f8ae53f220e5925e99c4e50c3754f9a8ecbe3260946c86b4']
    }
  },
};
