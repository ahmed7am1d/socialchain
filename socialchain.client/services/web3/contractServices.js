import { ethers } from "ethers";
import {
  UnixDateToiSO860StringDate,
  calculateTimeDifferenceString,
} from "@/utils/Date/dateUtils";
import socialChainContractABI from "../../contract-artifacts/contracts/SocialChain.sol/SocialChain.json";
import SocialChainContractConstants from "@/constants/blockchain/SocialChainContractConstants";
import useAuth from "@/hooks/useAuth";
import useIPFS from "@/hooks/useIPFS";

/**
 * This function retrieves a user's posts from a blockchain contract and formats the data for display.
 * @returns null if the result from the contract is empty
 * @returns The function `getUserPosts` returns an array of post objects, where each post object
 * contains various properties such as author, postImgHash, likeCount, postDescription, postId,
 * reportCount, timeStamp, isLikedByOwner, and comments. The function uses the ethers.js library to
 * interact with a smart contract on the Ethereum blockchain to retrieve the user's posts and
 * associated comments.
 */
export const getUserPosts = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(
    SocialChainContractConstants.SOCIAL_CHAIN_CONTRACT_ADDRESS,
    socialChainContractABI.abi,
    provider
  );
  const accountAddresses = await provider.send("eth_requestAccounts", []);
  const result = await contract.getUserPosts(accountAddresses[0]);

  if (result.length === 0) {
    return null;
  }
  //Result returns => array of post each post is an array of properties
  const userPostsTemp = result.map(async (onePost, index) => {
    //[1]- Transfer the post that is as array to object
    const tempObj = Object.assign({}, onePost);
    //[2]- Filter the date
    const unixDate = parseInt(tempObj.timeStamp._hex, 16);
    const date = await UnixDateToiSO860StringDate(unixDate);
    const timeDifferenceResult = await calculateTimeDifferenceString(date);
    let postComments = await contract.getPostComments(
      1,
      3,
      parseInt(tempObj.postId._hex, 16)
    );
    let filteredComments = postComments?.map(async (comment) => {
      let commentAuthorAddress = comment?.author;
      return {
        ...comment,
        author: Object.assign({}, await contract.getUser(commentAuthorAddress)),
      };
    });
    const post = {
      author: tempObj.author,
      postImgHash: tempObj.imgHash,
      likeCount: parseInt(tempObj.likeCount._hex, 16),
      postDescription: tempObj.postDescription,
      postId: parseInt(tempObj.postId._hex, 16),
      reportCount: parseInt(tempObj.reportCount._hex, 16),
      timeStamp: timeDifferenceResult,
      isLikedByOwner: await contract.isLikedByAddress(
        parseInt(tempObj.postId._hex, 16),
        accountAddresses[0]
      ),

      comments: await Promise.all(filteredComments),
    };
    //[3]- return the filtered post to the mapping
    return post;
  });
  return await Promise.all(userPostsTemp);
};

/**
 * This function retrieves a list of post objects from a smart contract on the Ethereum blockchain,
 * including details such as post content, author information, and comments.
 * @param page - The page parameter is the page number of the feed to retrieve. It is used to determine
 * which set of posts to retrieve based on the number of posts per page.
 * @param perPage - The number of posts to be returned per page.
 * @returns null if result from contract is empty otherwise an array of post objects, where each post object contains details about a post, such as the
 * author, post image hash, user profile image hash, like count, post description, post ID, report
 * count, status, timestamp, username, and comments.
 */
export const getFeedPosts = async (page, perPage) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(
    SocialChainContractConstants.SOCIAL_CHAIN_CONTRACT_ADDRESS,
    socialChainContractABI.abi,
    provider
  );
  const accountAddresses = await provider.send("eth_requestAccounts", []);
  const result = await contract.getPostIds(page, perPage);

  if (result.length === 0) {
    return null;
  }

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
    let postComments = await contract.getPostComments(
      1,
      5,
      parseInt(result.postId._hex, 16)
    );
    let filteredComments = postComments?.map(async (comment) => {
      let commentAuthorAddress = comment?.author;
      const unixDate = parseInt(comment.timeStamp._hex, 16);
      const date = await UnixDateToiSO860StringDate(unixDate);
      const timeDifferenceResult = await calculateTimeDifferenceString(date);
      return {
        author: Object.assign({}, await contract.getUser(commentAuthorAddress)),
        timeStamp: timeDifferenceResult,
        commentId: parseInt(comment?.commentId._hex, 16),
        likeCount: parseInt(comment?.likeCount._hex, 16),
        reportCount: parseInt(comment?.reportCount._hex, 16),
        content: comment?.content,
      };
    });
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
      isLikedByOwner: await contract.isLikedByAddress(
        parseInt(result.postId._hex, 16),
        accountAddresses[0]
      ),

      comments: await Promise.all(filteredComments),
    };
    return postObject;
  });
  return await Promise.all(allPostObjects);
};

/**
 * This function creates a new post object, uploads an image to IPFS if provided, interacts with a
 * smart contract to create a new post, and returns the created post object.
 * @param postDescription - The description or caption of the post that the user wants to create.
 * @param selectedProfilePictureFile - This parameter is the file object of the selected profile
 * picture that the user wants to upload.
 * @param selectedProfilePictureSrc - It is a string representing the source URL of the selected
 * profile picture.
 * @param uploadFileToIPFS - A function that takes a file object as input and uploads it to IPFS
 * (InterPlanetary File System), a decentralized file storage system.
 * @param auth - An object containing the user's authentication information, such as their account
 * address, username, and image hash.
 * @returns a Promise that resolves to a newCreatedPostObjectResponse object, which contains
 * information about the newly created post, such as the author, user name, user profile image hash,
 * post image hash, like count, post description, post ID, report count, time stamp, and user ID.
 * @returns false if creating of post is failed
 */
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
    userName: auth?.userName,
    userProfileImgHash: auth?.imageHash,
    postImgHash: "",
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
      newCreatedPostObjectResponse.postImgHash = ipfsProfilePictureHash;
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
  if (transactionResult?.status === 1) {
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
  }
  return false;
};

/**
 * This function likes a post on the SocialChainContract using Ethereum blockchain technology.
 * @param postId - The ID of the post that the user wants to like.
 * @returns a boolean value. If the transaction is successful [post is liked] and the status is 1, it returns true.
 * Otherwise, it returns false. If there is an error, it also returns false and logs the error to the
 * console.
 */
export const likePost = async (postId) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    SocialChainContractConstants.SOCIAL_CHAIN_CONTRACT_ADDRESS,
    socialChainContractABI.abi,
    signer
  );
  try {
    const transaction = await contract.likePost(postId);
    const transactionResult = await transaction.wait();
    if (transactionResult?.status === 1) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

/**
 * This function allows a user to unlike a post on the SocialChain platform using the Ethereum
 * blockchain.
 * @param postId - The ID of the post that the user wants to unlike.
 * @returns a boolean value. If the transaction is successful (post is unliked) and the status is 1, it returns true.
 * Otherwise, it returns false.
 */
export const unLikePost = async (postId) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    SocialChainContractConstants.SOCIAL_CHAIN_CONTRACT_ADDRESS,
    socialChainContractABI.abi,
    signer
  );
  try {
    const transaction = await contract.unLikePost(postId);
    const transactionResult = await transaction.wait();
    if (transactionResult?.status === 1) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

/**
 * This function creates a comment on a post using the Ethereum blockchain and returns the filtered
 * comment response.
 * @param postId - The ID of the post to which the comment is being added.
 * @param comment - The `comment` parameter is the content of the comment that the user wants to create
 * for a specific post.
 * @returns a filtered comment response object if the transaction is successful, otherwise it returns
 * false.
 */
export const createComment = async (postId, comment) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    SocialChainContractConstants.SOCIAL_CHAIN_CONTRACT_ADDRESS,
    socialChainContractABI.abi,
    signer
  );
  try {
    const transaction = await contract.createComment(postId, comment);
    const transactionResult = await transaction.wait();
    if (transactionResult?.status === 1) {
      //events - args
      //[1]- extract the emitted event arguemnt with filtered data
      const comment = Object.assign({}, transactionResult?.events[0].args);
      let commentAuthorAddress = comment?._author;
      const unixDate = parseInt(comment._timeStamp._hex, 16);
      const date = await UnixDateToiSO860StringDate(unixDate);
      const timeDifferenceResult = await calculateTimeDifferenceString(date);
      const filteredCommentResponse = {
        author: Object.assign({}, await contract.getUser(commentAuthorAddress)),
        timeStamp: timeDifferenceResult,
        commentId: parseInt(comment?._commentId._hex, 16),
        likeCount: parseInt(comment?._likeCount._hex, 16),
        reportCount: parseInt(comment?._reportCount._hex, 16),
        content: comment?._content,
      };
      return filteredCommentResponse;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};
