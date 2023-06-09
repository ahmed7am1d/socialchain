import React, { useEffect, useRef, useState } from "react";
import useAuth from "@/hooks/useAuth";
import useIPFS from "@/hooks/useIPFS";
import fileToBase64 from "@/utils/Files/fileUtils";
import {
  Upload,
  Users,
  NavigationArrow,
  MaskHappy,
  DotsThree,
} from "phosphor-react";
import blockChainEvent from "../../assets/Images/blockChainEvent.png";
import {
  DeleteOutlined
} from "@ant-design/icons";
import Image from "next/image";
import { Form, message } from "antd";
import { motion } from "framer-motion";
import {
  createComment,
  createNewPost,
  getFeedPosts,
  getPostComments,
  getUserPosts,
  likePost,
  unLikePost,
} from "@/services/web3/contractServices";
import PostModal from "./Modals/PostModal";
import Post from "./Post";
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
  const [celebrateLikePostModal, setCelebrateLikePostModal] = useState({});
  const [commentInputFieldValue, setCommentInputFieldValue] = useState("");
  const [isloadingBlockChainData, setIsloadingBlockChainData] = useState(true);
  let [postModalPagination, setPostModalPagination] = useState();

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

  const handleLikePost = async (isPostModal, postId, postIsAlreadyLiked) => {
    if (postIsAlreadyLiked) {
      const postIsUnLiked = await unLikePost(postId);
      if (postIsUnLiked) {
        if (isPostModal) {
          setPostModalData((current) => {
            return {
              ...current,
              likeCount: current?.likeCount - 1,
              isLikedByOwner: false,
            };
          });
        }
        if (isUserProfile) {
          setUserPosts((current) =>
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
        } else {
          setFeedPosts((current) =>
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
        }
        if (isPostModal) {
          //Remove the like from post modal
          setCelebrateLikePostModal({
            isPostLiked: false,
            postId: postId,
          });
        } else {
          //Remove the like from original post
          setCelebrateLikePost({
            isPostLiked: false,
            postId: postId,
          });
        }

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
        if (isPostModal) {
          setPostModalData((current) => {
            return {
              ...current,
              likeCount: current?.likeCount + 1,
              isLikedByOwner: true,
            };
          });
        }
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
        if (isPostModal) {
          //Remove the like from post modal
          setCelebrateLikePostModal({
            isPostLiked: true,
            postId: postId,
          });
        } else {
          //Remove the like from original post
          setCelebrateLikePost({
            isPostLiked: true,
            postId: postId,
          });
        }
        return true;
      }
      messageApi.open({
        type: "error",
        content: "Failed to like the post !!",
      });
    }
  };

  const submitCommentHandler = async (isPostModal, postId) => {
    const result = await createComment(postId, commentInputFieldValue);
    if (result) {
      console.log(result);
      //[1]- Add the comment to the specified comment list of a post [userPost,feedPosts,modalPosts]
      if (isPostModal) {
        setPostModalData((prev) => {
          return {
            ...prev,
            comments: [result, ...prev?.comments],
          };
        });
      }
      if (isUserProfile) {
        setUserPosts((prevUserPosts) => {
          const updatedUserPosts = prevUserPosts.map((post) => {
            if (post?.postId === postId) {
              return {
                ...post,
                comments: [result, ...post?.comments],
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
              comments: [result, ...post?.comments],
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

  const handlePostModalOpen = async (post) => {
    setPostModalPagination(1);
    if (post) {
      setPostModalData(post);
    }
    setIsModalOpen(true);
  };
  const handlePostModalClose = async () => {
    setIsModalOpen(false);
    setPostModalPagination(1);
  };

  const handleShowMorePostModal = async () => {
    //[1]- Make sure the comments for the post is more than 2
    if (postModalData?.comments.length > 2) {
      if (postModalPagination !== 0) {
        try {
          setPostModalPagination(postModalPagination + 1);
          const comments = await getPostComments(
            postModalPagination,
            2,
            postModalData?.postId
          );
          console.log("Result from the contract => ", comments);

          //[4]- insert the comments to the modal
          setPostModalData((prev) => {
            // If the new comments have already been saved, don't update the state
            const existingCommentIds = prev.comments.map(
              (comment) => comment.commentId
            );
            const newComments = comments.filter(
              (comment) => !existingCommentIds.includes(comment.commentId)
            );
            if (newComments.length === 0) {
              setPostModalPagination(0);
              return prev;
            }
            // Otherwise, add the new comments to the state
            const allComments = [...prev.comments, ...newComments];
            return { ...prev, comments: allComments };
          });
        } catch (error) {
          console.log("Error from contract => ", error);
        }
      }
    }
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
    setPostModalPagination(1);
    async function loadPosts() {
      if (isUserProfile) {
        const userPostsTemp = await getUserPosts();
        userPostsTemp && setUserPosts(userPostsTemp);
      } else {
        const postIds = await getFeedPosts(1, 10);
        postIds && setFeedPosts(postIds);
      }
    }
    setIsloadingBlockChainData(true);
    loadPosts();
    setIsloadingBlockChainData(false);
  }, []);
  //#endregion

  return (
    <>
      {contextHolder}
      {isloadingBlockChainData ? (
        <div className="bg-red-400">Loading...</div>
      ) : (
        <div>
          {/* Modal - FirstDiv [to overlay all page content] middle of page */}
          {isPostModalOpen && (
            <PostModal
              postModalData={postModalData}
              celebrateLikePostModal={celebrateLikePostModal}
              postModalPagination={postModalPagination}
              commentInputFieldValue={commentInputFieldValue}
              setCommentInputFieldValue={setCommentInputFieldValue}
              handlePostModalClose={handlePostModalClose}
              handleLikePost={handleLikePost}
              submitCommentHandler={submitCommentHandler}
            />
          )}

          <main
            className={`m-5 relative grid grid-cols-3 lg:grid-col-4 gap-x-3 ${
              isPostModalOpen && "blur bg-darkBlack opacity-50"
            } `}
          >
            <aside className="hidden lg:flex lg:flex-col lg:gap-y-8 text-sm">
              {/* About me */}
              <div className="p-3 relative">
                <div className="absolute inset-0 rounded-md bg-darkBlue opacity-40"></div>
                <div className="relative flex justify-between items-center text-white">
                  <h1 className="text-gray-500 uppercase font-mono">
                    About me
                  </h1>
                  <div className="text-gray-400">
                    <DotsThree
                      size={24}
                      className="hover:bg-gray-400 hover:bg-opacity-10 rounded-md hover:cursor-pointer transition-all duration-300"
                    />
                  </div>
                </div>
                <div className="text-gray-300 relative p-2 font-sans">
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
                <div className="relative p-3 font-sans">
                  <p className="text-white">Winter blockchain event</p>
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
                <div className="flex items-start gap-x-5 mt-2">
                  {/* User image + post title */}
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
                    <div className="flex gap-x-2 transition-all duration-200 hover:bg-gray-400 hover:bg-opacity-10 p-2 hover:cursor-pointer rounded-md">
                      <Users size={23} />
                      <p className="hidden sm:block md:block lg:block">
                        Tag a friend
                      </p>
                    </div>
                    <div className="flex gap-x-2 transition-all duration-200 hover:bg-gray-400 hover:bg-opacity-10 p-2 hover:cursor-pointer rounded-md">
                      <NavigationArrow size={23} />
                      <p className="hidden sm:block md:block lg:block">
                        Share a location
                      </p>
                    </div>
                    <div className="flex gap-x-2 transition-all duration-200 hover:bg-gray-400 hover:bg-opacity-10 p-2 hover:cursor-pointer rounded-md">
                      <MaskHappy size={23} />
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
                    <Post
                      isUserProfile={isUserProfile}
                      post={post}
                      auth={auth}
                      celebrateLikePost={celebrateLikePost}
                      handleLikePost={handleLikePost}
                      commentInputFieldValue={commentInputFieldValue}
                      setCommentInputFieldValue={setCommentInputFieldValue}
                      submitCommentHandler={submitCommentHandler}
                      handlePostModalOpen={handlePostModalOpen}
                      key={post?.postId}
                    />
                  ))
                : feedPosts?.map((post, index) => (
                    <Post
                      isUserProfile={isUserProfile}
                      post={post}
                      auth={auth}
                      celebrateLikePost={celebrateLikePost}
                      handleLikePost={handleLikePost}
                      commentInputFieldValue={commentInputFieldValue}
                      setCommentInputFieldValue={setCommentInputFieldValue}
                      submitCommentHandler={submitCommentHandler}
                      handlePostModalOpen={handlePostModalOpen}
                      key={post?.postId}
                    />
                  ))}
            </section>
          </main>
        </div>
      )}
    </>
  );
};
