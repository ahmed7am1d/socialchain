import { ethers } from "ethers";
import {
  UnixDateToiSO860StringDate,
  calculateTimeDifferenceString,
} from "@/utils/Date/dateUtils";
import socialChainContractABI from "../../contract-artifacts/contracts/SocialChain.sol/SocialChain.json";
import SocialChainContractConstants from "@/constants/blockchain/SocialChainContractConstants";
import useAuth from "@/hooks/useAuth";
import useIPFS from "@/hooks/useIPFS";

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
    //[2]- Filter the date
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

export const getFeedPosts = async (page, perPage) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(
    SocialChainContractConstants.SOCIAL_CHAIN_CONTRACT_ADDRESS,
    socialChainContractABI.abi,
    provider
  );
  const result = await contract.getPostIds(page, perPage);
  //[1]- Get all postIds
  const postIdsTemp = result.map((postId) => {
    return parseInt(postId?._hex, 16);
  });
  //[2]- Get post object for each post Id
  const allPostObjects = postIdsTemp.map(async (postId) => {
    const result = await contract.getPostById(postId);
    //Filter the date of the post
    const unixDate = parseInt(result.timeStamp._hex, 16);
    const date = await UnixDateToiSO860StringDate(unixDate);
    const timeDifferenceResult = await calculateTimeDifferenceString(date);
    //For each post get user object to get his image hash
    const userObject = await contract.getUser(result.author);
    const userProfileImageHash = userObject?.imageHash;
    //Return a post object with all necessary  details
    const postObject = {
      author: result?.author,
      postImgHash: result?.imgHash,
      userProfileImgHash: userProfileImageHash,
      likeCount: parseInt(result?.likeCount?._hex, 16),
      postDescription: result?.postDescription,
      postId: parseInt(result?.postId?._hex, 16),
      reportCount: parseInt(result?.reportCount?._hex, 16),
      status: result?.status,
      timeStamp: timeDifferenceResult,
      userName: userObject?.userName,
    };
    return postObject;
  });
  return await Promise.all(allPostObjects);
};

export const createNewPost = async (
  postDescription,
  selectedProfilePictureFile,
  selectedProfilePictureSrc,
  uploadFileToIPFS,
  auth
) => {
  //[1]- Preparing the response object
  const currentDate = new Date();
  const dateString = currentDate.toISOString();
  let newCreatedPostObjectResponse = {
    author: auth?.accountAddress,
    imgHash: "",
    likeCount: 0,
    postDescription: postDescription,
    postId: 0,
    reportCount: 0,
    timeStamp: await calculateTimeDifferenceString(dateString),
    userId: 0,
  };
  //[2]- Creation of post object
  let newCreatePostObjectRequest = {
    accountAddress: auth?.accountAddress,
    postDescription: postDescription,
    imageHash: "",
  };

  //[3]- If image is not empty upload to ipfs
  if (selectedProfilePictureSrc) {
    try {
      const ipfsProfilePictureHash = await uploadFileToIPFS(
        selectedProfilePictureFile
      );
      newCreatedPostObjectResponse.imgHash = ipfsProfilePictureHash;
      newCreatePostObjectRequest.imageHash = ipfsProfilePictureHash;
    } catch (error) {
      console.error(error);
      // handle error of ipfs uploading
    }
  }

  //[4]- Interact with the contract
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  //let the user connect to his account
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    SocialChainContractConstants.SOCIAL_CHAIN_CONTRACT_ADDRESS,
    socialChainContractABI.abi,
    signer
  );
  const transaction = await contract.createPost(
    newCreatePostObjectRequest.accountAddress,
    newCreatePostObjectRequest.postDescription,
    newCreatePostObjectRequest.imageHash
  );
  const transactionResult = await transaction.wait();

  //[5]- Add the post to the user list
  newCreatedPostObjectResponse.author =
    transactionResult.events[0].args._author;
  newCreatedPostObjectResponse.postId = parseInt(
    transactionResult.events[0].args._postId._hex,
    16
  );
  newCreatedPostObjectResponse.userId = parseInt(
    transactionResult.events[0].args._userId._hex,
    16
  );
  return newCreatedPostObjectResponse;
};
