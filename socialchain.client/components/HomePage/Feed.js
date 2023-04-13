import React, { useEffect, useRef, useState } from "react";
import useAuth from "@/hooks/useAuth";
import useIPFS from "@/hooks/useIPFS";
import fileToBase64 from "@/utils/Files/fileUtils";
import peopleIcon from "../../assets/Icons/people.png";
import checkInIcon from "../../assets/Icons/check-in.png";
import moodIcon from "../../assets/Icons/moode.png";
import { Upload } from "phosphor-react";
import blockChainEvent from "../../assets/Images/blockChainEvent.png";
import {
  HeartFilled,
  CommentOutlined,
  ShareAltOutlined,
  DeleteOutlined,
  SendOutlined,
} from "@ant-design/icons";
import ConfettiExplosion from "react-confetti-explosion";
import Image from "next/image";
import { Form, message } from "antd";
import { motion } from "framer-motion";
import {
  createComment,
  createNewPost,
  getFeedPosts,
  getUserPosts,
  likePost,
  unLikePost,
} from "@/services/web3/contractServices";
import homePageStyle from "../../pages/home/home.module.css";

export const Feed = ({ isUserProfile }) => {
  //#region states and variables
  const [userPosts, setUserPosts] = useState([]);
  const [feedPosts, setFeedPosts] = useState([]);
  const [isPostModalOpen, setIsModalOpen] = useState(false);
  const [postModalData, setPostModalData] = useState({});
  const { auth } = useAuth();
  const [messageApi, contextHolder] = message.useMessage();

  const { uploadFileToIPFS } = useIPFS();
  const imageRef = useRef();
  const [selectedProfilePictureSrc, setSelectedProfilePictureSrc] =
    useState("");
  const [selectedProfilePictureFile, setSelectedProfilePictureFile] =
    useState("");
  const [selectedProfilePictureSrcBytes, setSelectedProfilePictureSrcBytes] =
    useState("");
  const [celebrateLikePost, setCelebrateLikePost] = useState({});
  const [commentInputFieldValue, setCommentInputFieldValue] = useState("");
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

  const handleLikePost = async (postId, postIsAlreadyLiked) => {
    if (postIsAlreadyLiked) {
      const postIsUnLiked = await unLikePost(postId);
      if (postIsUnLiked) {
        isUserProfile
          ? setUserPosts((current) =>
              current.map((obj) => {
                if (obj.postId === postId) {
                  return {
                    ...obj,
                    likeCount: obj?.likeCount - 1,
                    isLikedByOwner: false,
                  };
                }
                return obj;
              })
            )
          : setFeedPosts((current) =>
              current.map((obj) => {
                if (obj.postId === postId) {
                  return {
                    ...obj,
                    likeCount: obj?.likeCount - 1,
                    isLikedByOwner: false,
                  };
                }
                return obj;
              })
            );
        //Remove the like
        setCelebrateLikePost({
          isPostLiked: false,
          postId: postId,
        });
        return true;
      }
      messageApi.open({
        type: "error",
        content: "Failed to UnLike the post !!",
      });
    } else {
      //[1]- Call the contract service to like post
      const postIsLikedResult = await likePost(postId);
      //[2]- If function return true then increase in the current list post the like counter
      if (postIsLikedResult) {
        isUserProfile
          ? setUserPosts((current) =>
              current.map((obj) => {
                if (obj.postId === postId) {
                  return {
                    ...obj,
                    likeCount: obj?.likeCount + 1,
                    isLikedByOwner: true,
                  };
                }
                return obj;
              })
            )
          : setFeedPosts((current) =>
              current.map((obj) => {
                if (obj.postId === postId) {
                  return {
                    ...obj,
                    likeCount: obj?.likeCount + 1,
                    isLikedByOwner: true,
                  };
                }
                return obj;
              })
            );
        //show animation
        setCelebrateLikePost({
          isPostLiked: true,
          postId: postId,
        });
        return true;
      }
      messageApi.open({
        type: "error",
        content: "Failed to like the post !!",
      });
    }
  };

  const submitCommentHandler = async (postId) => {
    const result = await createComment(postId, commentInputFieldValue);
    if (result) {
      console.log(result);
      //[1]- Add the comment to the specified comment list of a post (comment object should be full)
      if (isUserProfile) {
        setUserPosts((prevUserPosts) => {
          const updatedUserPosts = prevUserPosts.map((post) => {
            if (post?.postId === postId) {
              return {
                ...post,
                comments: [result, ...post.comments],
              };
            } else {
              return post;
            }
          });
          return updatedUserPosts;
        });
        setCommentInputFieldValue("");
        return true;
      }
      setFeedPosts((prevFeedPosts) => {
        const updatedFeedPosts = prevFeedPosts.map((post) => {
          if (post?.postId === postId) {
            return {
              ...post,
              comments: [result, ...post.comments],
            };
          } else {
            return post;
          }
        });

        return updatedFeedPosts;
      });
      setCommentInputFieldValue("");
      return true;
    } else {
      console.log("Error creating comment");
    }
  };

  const handlePostModal = async (post) => {
    if (post) {
      setPostModalData(post);
      console.log(post);
    }
    setIsModalOpen(!isPostModalOpen);
  };
  //#endregion

  //#region forms and validations
  const [createPostForm] = Form.useForm();
  const handleCreatePostForm = async (e) => {
    const { postDescription, postImage } = e;
    const newCreatedPostObjectResponse = await createNewPost(
      postDescription,
      selectedProfilePictureFile,
      selectedProfilePictureSrc,
      uploadFileToIPFS,
      auth
    );
    if (newCreatedPostObjectResponse) {
      console.log("userPosts before update:", userPosts);
      isUserProfile
        ? setUserPosts([...userPosts, newCreatedPostObjectResponse])
        : setFeedPosts([...feedPosts, newCreatedPostObjectResponse]);

      // Reset the image and the input field
      deleteProfileImageHandler();
      createPostForm.resetFields();
    } else {
      messageApi.open({
        type: "error",
        content: "Failed to create new Post !!",
      });
    }
  };

  //#endregion

  //#region loading of data
  useEffect(() => {
    async function loadPosts() {
      if (isUserProfile) {
        const userPostsTemp = await getUserPosts();
        userPostsTemp && setUserPosts(userPostsTemp);
      } else {
        const postIds = await getFeedPosts(1, 10);
        postIds && setFeedPosts(postIds);
      }
    }
    loadPosts();
  }, []);
  //#endregion

  return (
    <>
      {contextHolder}
      {/* Modal - FirstDiv [to overlay all page content] middle of page */}
      {isPostModalOpen && (
        <div
          className={`fixed  flex justify-center backdrop items-start z-50  
        w-full h-screen
        overflow-x-hidden overflow-y-auto md:inset-0   `}
        >
          {/* Second DIV - Content of the modal */}
          <div className="relative w-[60%] h-full">
            <div className=" flex flex-col relative rounded-lg shadow bg-darkBlueHalfTrans p-2">
              {/* Close Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => handlePostModal()}
                  type="button"
                  className="text-white bg-darkBlue rounded-full p-1"
                  data-modal-hide="authentication-modal"
                >
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
              </div>

              {/* Author name */}
              <div className="text-center text-white mb-4 text-lg">
                <div>{postModalData?.userName}'s post</div>
              </div>
              <hr />
              {/* Content wrapper */}
              <div
                className="flex flex-col max-h-[600px] gap-y-4 mt-5 px-4 overflow-x-auto overflow-y-auto
            scrollbar-thin scrollbar-thumb-primaryGoldColor scrollbar-track-darkBlue scrollbar-rounded-lg
            "
              >
                {/* Created by */}
                <div className="flex justify-between">
                  <div className="flex items-center gap-x-5 text-white">
                    <div>
                      <Image
                        src={`https://ipfs.io/ipfs/${postModalData?.userProfileImgHash}`}
                        width={40}
                        height={40}
                        className="rounded-full"
                        alt="Profile picture"
                      />
                    </div>
                    <div>
                      <p>
                        <strong>{postModalData?.userName}</strong> shared a post
                      </p>
                      <p className="text-gray-400">
                        {postModalData?.timeStamp}
                      </p>
                    </div>
                  </div>
                  <div className="text-gray-400">
                    <p>...</p>
                  </div>
                </div>
                {/* title of post*/}
                <div className="text-gray-200">
                  <p>{postModalData?.postDescription}</p>
                </div>
                {/* Post Image */}
                {postModalData?.postImgHash && (
                  <div className="flex justify-center w-full relative pt-[50%]">
                    <Image
                      objectFit="contain"
                      fill
                      className="w-full h-full top-0 left-0 object-contain rounded-2xl"
                      src={`https://ipfs.io/ipfs/${postModalData?.postImgHash}`}
                      alt="Post image"
                    />
                  </div>
                )}
                {/* Like - comment - share */}
                <div className=" px-2 relative flex gap-x-6 text-white">
                  {celebrateLikePost?.isPostLiked &&
                    celebrateLikePost?.postId === postModalData?.postId && (
                      <ConfettiExplosion
                        duration={4000}
                        particleCount={50}
                        className=" absolute"
                        force={0.8}
                      />
                    )}

                  <div
                    className={`flex items-center justify-center gap-x-2 ${
                      postModalData?.isLikedByOwner
                        ? homePageStyle.postIsLiked
                        : homePageStyle.likeButtonContainer
                    } `}
                    onClick={() =>
                      handleLikePost(
                        postModalData?.postId,
                        postModalData?.isLikedByOwner
                      )
                    }
                  >
                    <HeartFilled />
                    <span>{postModalData?.likeCount}</span>
                  </div>
                  <div className="flex items-center justify-center gap-x-2">
                    <CommentOutlined />
                    <span>{postModalData?.comments?.length}</span>
                  </div>
                  <div className="flex items-center justify-center gap-x-2">
                    <ShareAltOutlined />
                    <span>0</span>
                  </div>
                </div>
                {/* Comment input field */}
                <div className="relative">
                  <input
                    placeholder="Write a comment..."
                    className="
                  w-full px-2 py-3 rounded-md 
                  bg-darkBlue text-white
                  focus:outline-none
                  "
                    value={commentInputFieldValue}
                    onChange={(e) => setCommentInputFieldValue(e.target.value)}
                  />
                  <SendOutlined
                    className="text-white absolute top-[15px] right-3"
                    onClick={() => submitCommentHandler(postModalData?.postId)}
                  />
                </div>
                {/*comments */}
                <div className=" relative">
                  <div
                    className="
                   flex flex-col gap-y-3 min-h-fit"
                  >
                    {/* First comment */}
                    {postModalData?.comments?.map((comment) => (
                      <div className="flex gap-x-2 items-center pr-6">
                        <div>
                          <Image
                            src={`https://ipfs.io/ipfs/${comment?.author?.imageHash}`}
                            className="rounded-full"
                            width={32}
                            height={32}
                          />
                        </div>
                        <div className="text-gray-300   ">
                          <div className="bg-darkBlue p-2 rounded-lg">
                            {" "}
                            <p className="text-md">
                              {comment?.author?.userName}
                            </p>
                            <p className="text-sm">{comment?.content}</p>
                          </div>

                          <div className="flex text-gray-400">
                            <div className="flex gap-x-4">
                              <p>Like</p>
                              <p>Report</p>
                              <p>{comment?.timeStamp}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p
                    className="text-white mt-5 hover:underline hover:cursor-pointer"
                    onClick={() => handlePostModal(post)}
                  >
                    Show more comments
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <main
        className={`m-5 relative grid grid-cols-3 lg:grid-col-4 gap-x-3 ${
          isPostModalOpen && "blur bg-darkBlack opacity-50"
        } `}
      >
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
                  <DeleteOutlined
                    style={{ fontSize: "30px", color: "white" }}
                  />
                </div>
              </motion.div>
            ) : (
              <button
                onClick={showOpenFileDialog}
                type="button"
                className="group relative h-fit w-fit px-2 pl-4 py-1 overflow-hidden rounded-lg bg-darkBlue text-md shadow"
              >
                <div className="absolute inset-0 w-3 bg-amber-400 transition-all duration-[400ms] ease-out group-hover:w-full"></div>
                <span className="relative flex items-center gap-x-2 ">
                  <Upload size={20} className="text-white" />
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
                  <p className="hidden sm:block md:block lg:block">
                    Tag Friend
                  </p>
                </div>
                <div className="flex gap-x-2">
                  <Image
                    src={checkInIcon}
                    height={20}
                    width={22}
                    alt="Location icon"
                  />
                  <p className="hidden sm:block md:block lg:block">
                    Share Location
                  </p>
                </div>
                <div className="flex gap-x-2">
                  <Image
                    src={moodIcon}
                    height={20}
                    width={22}
                    alt="Mood icon"
                  />
                  <p className="hidden sm:block md:block lg:block">Mood</p>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  href="#_"
                  className="shadow-sm shadow-white  hover:shadow-md  duration-300 ease-out hover:shadow-primaryGoldColor relative inline-flex items-center justify-start px-7 py-1 overflow-hidden font-medium transition-all bg-darkBlue rounded hover:bg-white group"
                >
                  <span className="w-48 h-48 rounded rotate-[-40deg] bg-white absolute bottom-0 left-0 -translate-x-full ease-out duration-700 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
                  <span className="relative w-full text-left text-white transition-colors duration-700 ease-in-out group-hover:text-black ">
                    Share
                  </span>
                </button>
              </div>
            </div>
          </Form>
          {/* Posts */}
          {isUserProfile
            ? userPosts?.map((post, index) => (
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
                  {post?.postImgHash && (
                    <div className="flex relative w-full h-[300px]">
                      <Image
                        layout="fill"
                        objectFit="contain"
                        src={`https://ipfs.io/ipfs/${post?.postImgHash}`}
                        alt="Post image"
                      />
                    </div>
                  )}

                  {/* Likes - comments - share */}
                  <div className=" px-2 relative flex gap-x-6 text-white">
                    {celebrateLikePost?.isPostLiked &&
                      celebrateLikePost?.postId === post?.postId && (
                        <ConfettiExplosion
                          duration={4000}
                          particleCount={50}
                          className=" absolute"
                          force={0.8}
                        />
                      )}

                    <div
                      className={`flex items-center justify-center gap-x-2 ${
                        post?.isLikedByOwner
                          ? homePageStyle.postIsLiked
                          : homePageStyle.likeButtonContainer
                      } `}
                      onClick={() =>
                        handleLikePost(post?.postId, post?.isLikedByOwner)
                      }
                    >
                      <HeartFilled />
                      <span>{post?.likeCount}</span>
                    </div>
                    <div className="flex items-center justify-center gap-x-2">
                      <CommentOutlined />
                      <span>{post?.comments?.length}</span>
                    </div>
                    <div className="flex items-center justify-center gap-x-2">
                      <ShareAltOutlined />
                      <span>0</span>
                    </div>
                  </div>
                  {/* Comment input field */}
                  <div className="relative">
                    <input
                      placeholder="Write a comment..."
                      className="
                  w-full px-2 py-3 rounded-md 
                  bg-darkBlue text-white
                  focus:outline-none
                  "
                      value={commentInputFieldValue}
                      onChange={(e) =>
                        setCommentInputFieldValue(e.target.value)
                      }
                    />
                    <SendOutlined
                      className="text-white absolute top-[15px] right-3"
                      onClick={() => submitCommentHandler(post?.postId)}
                    />
                  </div>
                  {/*comments */}
                  <div className=" relative">
                    <div
                      className="scrollbar-thin scrollbar-thumb-primaryGoldColor scrollbar-track-darkBlue scrollbar-rounded-lg
                  max-h-[200px] flex flex-col gap-y-3 min-h-fit overflow-y-scroll"
                    >
                      {/* First comment */}
                      {post?.comments?.map((comment) => (
                        <div className="flex gap-x-2 items-center">
                          <div>
                            <Image
                              src={`https://ipfs.io/ipfs/${comment?.author?.imageHash}`}
                              className="rounded-full"
                              width={32}
                              height={32}
                            />
                          </div>
                          <div className="text-gray-300 bg-darkBlue p-2 rounded-lg">
                            <p className="text-md">
                              {comment?.author?.userName}
                            </p>
                            <p className="text-sm">{comment?.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-white mt-5 hover:underline hover:cursor-pointer">
                      Show more comments
                    </p>
                  </div>
                </div>
              ))
            : feedPosts?.map((post, index) => (
                <div
                  key={post?.postId}
                  className="p-4 bg-darkBlueHalfTrans mt-5 flex flex-col gap-y-5 rounded-md"
                >
                  {/* user info - created by */}
                  <div className="flex justify-between">
                    <div className="flex items-center gap-x-5 text-white">
                      <div>
                        <Image
                          src={`https://ipfs.io/ipfs/${post?.userProfileImgHash}`}
                          width={40}
                          height={40}
                          className="rounded-full"
                          alt="Profile picture"
                        />
                      </div>
                      <div>
                        <p>
                          <strong>{post?.userName}</strong> shared a post
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
                  {post?.postImgHash && (
                    <div className="flex relative w-full h-[300px]">
                      <Image
                        layout="fill"
                        objectFit="contain"
                        src={`https://ipfs.io/ipfs/${post?.postImgHash}`}
                        alt="Post image"
                      />
                    </div>
                  )}

                  {/* Likes - comments - share */}
                  <div className=" px-2 relative flex gap-x-6 text-white">
                    {celebrateLikePost?.isPostLiked &&
                      celebrateLikePost?.postId === post?.postId && (
                        <ConfettiExplosion
                          duration={4000}
                          particleCount={50}
                          className=" absolute"
                          force={0.8}
                        />
                      )}

                    <div
                      className={`flex items-center justify-center gap-x-2 ${
                        post?.isLikedByOwner
                          ? homePageStyle.postIsLiked
                          : homePageStyle.likeButtonContainer
                      } `}
                      onClick={() =>
                        handleLikePost(post?.postId, post?.isLikedByOwner)
                      }
                    >
                      <HeartFilled />
                      <span>{post?.likeCount}</span>
                    </div>
                    <div className="flex items-center justify-center gap-x-2">
                      <CommentOutlined />
                      <span>{post?.comments?.length}</span>
                    </div>
                    <div className="flex items-center justify-center gap-x-2">
                      <ShareAltOutlined />
                      <span>0</span>
                    </div>
                  </div>
                  {/* Comment input field */}
                  <div className="relative">
                    <input
                      placeholder="Write a comment..."
                      className="
                  w-full px-2 py-3 rounded-md 
                  bg-darkBlue text-white
                  focus:outline-none
                  "
                      value={commentInputFieldValue}
                      onChange={(e) =>
                        setCommentInputFieldValue(e.target.value)
                      }
                    />
                    <SendOutlined
                      className="text-white absolute top-[15px] right-3"
                      onClick={() => submitCommentHandler(post?.postId)}
                    />
                  </div>
                  {/*comments */}
                  <div className=" relative">
                    <div
                      className="scrollbar-thin scrollbar-thumb-primaryGoldColor scrollbar-track-darkBlue scrollbar-rounded-lg
                  max-h-[200px] flex flex-col gap-y-3 min-h-fit overflow-y-scroll"
                    >
                      {/* First comment */}
                      {post?.comments?.map((comment) => (
                        <div className="flex gap-x-2 items-center pr-6">
                          <div>
                            <Image
                              src={`https://ipfs.io/ipfs/${comment?.author?.imageHash}`}
                              className="rounded-full"
                              width={32}
                              height={32}
                            />
                          </div>
                          <div className="text-gray-300   ">
                            <div className="bg-darkBlue p-2 rounded-lg">
                              {" "}
                              <p className="text-md">
                                {comment?.author?.userName}
                              </p>
                              <p className="text-sm">{comment?.content}</p>
                            </div>

                            <div className="flex text-gray-400">
                              <div className="flex gap-x-4">
                                <p>Like</p>
                                <p>Report</p>
                                <p>{comment?.timeStamp}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p
                      className="text-white mt-5 hover:underline hover:cursor-pointer"
                      onClick={() => handlePostModal(post)}
                    >
                      Show more comments
                    </p>
                  </div>
                </div>
              ))}
        </section>
      </main>
    </>
  );
};
