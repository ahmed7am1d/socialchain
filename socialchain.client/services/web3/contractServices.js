import { ethers } from "ethers";
import {
  UnixDateToiSO860StringDate,
  calculateTimeDifferenceString,
} from "@/utils/Date/dateUtils";
import socialChainContractABI from "../../contract-artifacts/contracts/SocialChain.sol/SocialChain.json";
import SocialChainContractConstants from "@/constants/blockchain/SocialChainContractConstants";

export const getUserPosts = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(
    SocialChainContractConstants.SOCIAL_CHAIN_CONTRACT_ADDRESS,
    socialChainContractABI.abi,
    provider
  );
  const accountAddresses = await provider.send("eth_requestAccounts", []);
  const result = await contract.getUserPosts(accountAddresses[0]);
  //Result returns => array of post each post is an array of properties
  const userPostsTemp = result.map(async (onePost, index) => {
    //[1]- Transfer the post that is as array to object
    const tempObj = Object.assign({}, onePost);
    //[2]- Filter the data
    const unixDate = parseInt(tempObj.timeStamp._hex, 16);
    const date = await UnixDateToiSO860StringDate(unixDate);
    const timeDifferenceResult = await calculateTimeDifferenceString(date);
    const post = {
      author: tempObj.author,
      imgHash: tempObj.imgHash,
      likeCount: parseInt(tempObj.likeCount._hex, 16),
      postDescription: tempObj.postDescription,
      postId: parseInt(tempObj.postId._hex, 16),
      reportCount: parseInt(tempObj.reportCount._hex, 16),
      timeStamp: timeDifferenceResult,
    };
    //[3]- return the filtered post to the mapping
    return post;
  });
  return await Promise.all(userPostsTemp);
};
