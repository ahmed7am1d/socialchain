import React, { useEffect, useRef, useState } from "react";
import { ethers } from "ethers";
import useAuth from "@/hooks/useAuth";
import useIPFS from "@/hooks/useIPFS";
import socialChainContractABI from "../../contract-artifacts/contracts/SocialChain.sol/SocialChain.json";
import SocialChainContractConstants from "@/constants/blockchain/SocialChainContractConstants";
import fileToBase64 from "@/utils/Files/fileUtils";
import peopleIcon from "../../assets/Icons/people.png";
import checkInIcon from "../../assets/Icons/check-in.png";
import moodIcon from "../../assets/Icons/moode.png";
import { Upload } from "phosphor-react";
import blockChainEvent from "../../assets/Images/blockChainEvent.png";
import {
  HeartOutlined,
  CommentOutlined,
  ShareAltOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import {
  UnixDateToiSO860StringDate,
  calculateTimeDifferenceString,
} from "@/utils/Date/dateUtils";
import dayjs from "dayjs";
import { Form } from "antd";
import { motion } from "framer-motion";
import { getUserPosts } from "@/services/web3/contractServices";

export const Feed = () => {
  //#region states and variables
  const [userPosts, setUserPosts] = useState([]);
  const { auth } = useAuth();
  const { uploadFileToIPFS } = useIPFS();
  const imageRef = useRef();
  const [selectedProfilePictureSrc, setSelectedProfilePictureSrc] =
    useState("");
  const [selectedProfilePictureFile, setSelectedProfilePictureFile] =
    useState("");
  const [selectedProfilePictureSrcBytes, setSelectedProfilePictureSrcBytes] =
    useState("");
  //#endregion

  //#region handling
  const handleProfileImageChange = async (e) => {
    if (e?.target?.files?.[0]) {
      const file = e.target.files[0];
      setSelectedProfilePictureFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedProfilePictureSrc(reader.result);
      };
      reader.readAsDataURL(file);

      //set the images bytes
      const base64ImageNotFormatted = await fileToBase64(file);
      const base64ImageFormatted = base64ImageNotFormatted.slice(
        base64ImageNotFormatted.indexOf(",") + 1,
        base64ImageNotFormatted.length
      );
      setSelectedProfilePictureSrcBytes(base64ImageFormatted);
    }
  };

  const deleteProfileImageHandler = () => {
    setSelectedProfilePictureSrc("");
    setSelectedProfilePictureSrcBytes("");
  };

  const showOpenFileDialog = () => {
    imageRef.current.click();
  };

  //#endregion

  //#region forms and validations
  const [createPostForm] = Form.useForm();
  const handleCreatePostForm = async (e) => {
    //[1]- Destructing the post description and post Image
    const { postDescription, postImage } = e;
    //[2]- Preparing the response object
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
      userId:0
    };
    //[3]- Creation of post object
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
    //[4]- Printing the newCreatePostObject Request
    console.log(newCreatePostObjectRequest);
    //[5]- Interact with the contract
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
    //[6]- Print the transaction result
    console.log(transactionResult.events[0].args);
    //[7]- Add the post to the user list
    newCreatedPostObjectResponse.author = transactionResult.events[0].args._author;
    newCreatedPostObjectResponse.postId = parseInt(transactionResult.events[0].args._postId._hex,16);
    newCreatedPostObjectResponse.userId = parseInt(transactionResult.events[0].args._userId._hex,16);
    console.log(newCreatedPostObjectResponse);
    setUserPosts([...userPosts, newCreatedPostObjectResponse]);
    //[8]- Reset the image and the input field
    deleteProfileImageHandler();
    createPostForm.resetFields();

  };

  //#endregion

  //#region loading of data
  useEffect(() => {
    async function loadUserPosts() {
      const userPostsTemp = await getUserPosts();
      setUserPosts(userPostsTemp);
    }
    loadUserPosts();
  }, []);
  //#endregion

  return (
    <main className="m-5 grid grid-cols-3 lg:grid-col-4 gap-x-3 ">
      <aside className="hidden lg:flex lg:flex-col lg:gap-y-8 text-sm">
        {/* About me */}
        <div className="p-3 relative font-poppins">
          <div className="absolute inset-0 rounded-md bg-darkBlue opacity-40"></div>
          <div className="relative flex justify-between items-center text-white">
            <h1 className="text-gray-500 uppercase font-mono">About me</h1>
            <div>...</div>
          </div>
          <div className="text-gray-300 relative p-2">
            <p className="text-sm">{auth.bio}</p>
          </div>
        </div>
        {/* Event */}
        <div className="p-3 relative ">
          <div className="absolute inset-0 rounded-md bg-darkBlue opacity-40"></div>
          <div className="relative flex justify-between items-center text-white">
            <div>
              <Image src={blockChainEvent} alt="Event image" />
            </div>
          </div>
          <div className="relative p-3">
            <p className="text-white font-mono">Winter blockchain event</p>
            <p className="text-gray-500">01st Jan, 2024 07:00AM</p>
          </div>
        </div>
      </aside>
      {/* feed */}
      <section className="col-span-3 lg:col-span-2 text-sm">
        {/* Share post container */}
        <Form
          form={createPostForm}
          onFinish={handleCreatePostForm}
          className="gap-y-5 flex  p-4  bg-darkBlueHalfTrans flex-col   rounded-md"
          initialValues={{
            postImage: "",
            postDescription: "",
          }}
        >
          {/* Type of post */}
          {/* <div className="gap-y-5 flex flex-col"> */}
          {/* <ul className="flex gap-x-5 text-gray-300"> */}
          {/* <li>Status</li> */}
          {/* <li className="cursor-pointer">Upload Photo</li> */}
          {/* <li>Videos</li> */}
          {/* </ul> */}
          {/* </div> */}
          {/* placeholder and input text */}
          <div className="flex items-start gap-x-5 mt-2">
            <div
              className={`
            h-8 w-8
            p-4
            md:h-10
            md:w-10
            flex relative overflow-hidden rounded-full `}
            >
              <Image
                className="rounded-full"
                src={`https://ipfs.io/ipfs/${auth?.imageHash}`}
                layout="fill"
                objectFit="cover"
                alt="Profile picture"
              />
            </div>
            <div className="w-full">
              <Form.Item name="postDescription">
                <input
                autoComplete="off"
                  name="postDescription"
                  className="w-full bg-darkBlueHalfTrans outline-none text-white"
                  placeholder="Write something..."
                />
              </Form.Item>
            </div>
          </div>
          {/* Upload photo */}
          {selectedProfilePictureSrc ? (
            <motion.div
              className="flex justify-center relative"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                duration: 2,
              }}
            >
              <Image
                src={selectedProfilePictureSrc}
                width={32}
                height={32}
                className="w-52 h-52  mt-0 mb-10 rounded-md"
                alt="User profile container"
              />
              <div
                className=" duration-200 cursor-pointer absolute rounded-md flex items-center justify-center w-52 h-52 mb-10 opacity-0 hover:opacity-100 hover:bg-gray-600 mt-0 m"
                onClick={deleteProfileImageHandler}
              >
                <DeleteOutlined style={{ fontSize: "30px", color: "white" }} />
              </div>
            </motion.div>
          ) : (
            <button
              onClick={showOpenFileDialog}
              type="button"
              class="group relative h-fit w-fit px-2 pl-4 py-1 overflow-hidden rounded-lg bg-darkBlue text-md shadow"
            >
              <div class="absolute inset-0 w-3 bg-amber-400 transition-all duration-[400ms] ease-out group-hover:w-full"></div>
              <span class="relative flex items-center gap-x-2 ">
                <Upload size={20} className="text-white"/>
                <span className="text-white">Upload Photo </span>
              </span>
            </button>
          )}
          <Form.Item name="postImage" className="hidden">
            <input
              ref={imageRef}
              type="file"
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleProfileImageChange}
              onClick={(e) => {
                e.target.value = null;
              }}
            />
          </Form.Item>
          {/* button - type and additional feelings */}
          <div className="flex items-center justify-between w-full text-gray-400">
            <div className="flex flex-row w-full gap-x-7">
              <div className="flex gap-x-2">
                <Image
                  src={peopleIcon}
                  height={20}
                  width={22}
                  alt="People icon"
                />
                <p>Tag Friend</p>
              </div>
              <div className="flex gap-x-2">
                <Image
                  src={checkInIcon}
                  height={20}
                  width={22}
                  alt="Location icon"
                />
                <p>Share Location</p>
              </div>
              <div className="flex gap-x-2">
                <Image src={moodIcon} height={20} width={22} alt="Mood icon" />
                <p>Mood</p>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className=" bg-secondaryGold text-white px-5 py-2 rounded-sm shadow-xl"
              >
                Share
              </button>
            </div>
          </div>
        </Form>
        {/* Posts */}
        {userPosts.map((post, index) => (
          <div
            key={post?.postId}
            className="p-4 bg-darkBlueHalfTrans mt-5 flex flex-col gap-y-5 rounded-md"
          >
            {/* user info - created by */}
            <div className="flex justify-between">
              <div className="flex items-center gap-x-5 text-white">
                <div>
                  <Image
                    src={`https://ipfs.io/ipfs/${auth?.imageHash}`}
                    width={40}
                    height={40}
                    className="rounded-full"
                    alt="Profile picture"
                  />
                </div>
                <div>
                  <p>
                    <strong>{auth?.userName}</strong> shared a post
                  </p>
                  <p className="text-gray-400">{post?.timeStamp}</p>
                </div>
              </div>
              <div className="text-gray-400">
                <p>...</p>
              </div>
            </div>
            {/* title of post*/}
            <div className="text-gray-200">
              <p>{post?.postDescription}</p>
            </div>
            {/* Image */}
            <div className="flex relative w-full h-[400px]">
              <Image
                layout="fill"
                src={`https://ipfs.io/ipfs/${post?.imgHash}`}
                alt="Post image"
              />
            </div>
            {/* Likes - comments - share */}
            <div className="flex gap-x-6 text-white">
              <div className="flex items-center justify-center gap-x-2">
                <HeartOutlined />
                <span>{post?.likeCount}</span>
              </div>
              <div className="flex items-center justify-center gap-x-2">
                <CommentOutlined />
                <span>0</span>
              </div>
              <div className="flex items-center justify-center gap-x-2">
                <ShareAltOutlined />
                <span>0</span>
              </div>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
};
