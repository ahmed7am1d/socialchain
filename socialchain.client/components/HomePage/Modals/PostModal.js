import React from "react";
import homePageStyle from "../../../pages/home/home.module.css";
import { DotsThree } from "phosphor-react";
import {
  HeartFilled,
  CommentOutlined,
  ShareAltOutlined,
  SendOutlined,
} from "@ant-design/icons";
import Image from "next/image";

const PostModal = ({
  postModalData,
  celebrateLikePostModal,
  postModalPagination,
  commentInputFieldValue,
  setCommentInputFieldValue,
  handlePostModalClose,
  handleLikePost,
  submitCommentHandler,
}) => {
  return (
    <div
      className={`fixed  flex justify-center items-start backdrop  z-50  
        w-full h-screen
        overflow-x-hidden md:inset-0   overflow-y-hidden`}
    >
      {/* Second DIV - Content of the modal */}
      <div className="relative w-[60%] h-full mt-14 ">
        <div className=" flex flex-col relative rounded-lg shadow bg-darkBlueHalfTrans p-2  border-gray-500 border-[0.2px]">
          {/* Close Button */}
          <div className="flex justify-end">
            <button
              onClick={() => handlePostModalClose()}
              type="button"
              className="text-white bg-darkBlue rounded-full p-1 hover:bg-primaryGoldColor duration-300"
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
          <div className="text-center text-white mb-4 text-lg font-sans font-semibold">
            <div>{postModalData?.userName}'s post</div>
          </div>
          <hr />
          {/* Content wrapper */}
          <div
            className="flex flex-col max-h-[600px] gap-y-4 mt-5 px-4 overflow-x-auto overflow-y-auto
                               scrollbar-thin scrollbar-thumb-primaryGoldColor scrollbar-track-darkBlue scrollbar-rounded-lg"
          >
            {/* Created by */}
            <div className="flex justify-between font-sans">
              <div className="flex items-center gap-x-5 text-white rounded-full">
                <div>
                  <div
                    className={`
                                h-6 w-6
                                p-4
                                md:h-9
                                md:w-9
                                flex relative overflow-hidden rounded-full `}
                  >
                    <Image
                      src={`https://ipfs.io/ipfs/${postModalData?.userProfileImgHash}`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-full"
                      alt="Profile picture"
                    />
                  </div>
                </div>
                <div>
                  <p>
                    <strong>{postModalData?.userName}</strong> shared a post
                  </p>
                  <p className="text-gray-400">{postModalData?.timeStamp}</p>
                </div>
              </div>
              <div className="text-gray-400">
                <DotsThree
                  size={24}
                  className="hover:bg-gray-400 hover:bg-opacity-10 rounded-md hover:cursor-pointer transition-all duration-300"
                />
              </div>
            </div>
            {/* title of post*/}
            <div className="text-gray-200 font-sans">
              <p>{postModalData?.postDescription}</p>
            </div>
            {/* Post Image */}
            {postModalData?.postImgHash && (
              <div className="flex justify-center w-full relative pt-[35%] ">
                <Image
                  objectFit="contain"
                  fill
                  className="w-full h-full top-0 left-0 object-contain "
                  src={`https://ipfs.io/ipfs/${postModalData?.postImgHash}`}
                  alt="Post image"
                />
              </div>
            )}
            {/* Like - comment - share */}
            <div className=" px-2 relative flex gap-x-6 text-white font-sans">
              {celebrateLikePostModal?.isPostLiked &&
                celebrateLikePostModal?.postId === postModalData?.postId && (
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
                    true,
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
                <span>
                  {postModalData?.comments?.length
                    ? postModalData?.comments?.length
                    : "0"}
                </span>
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
                  focus:outline-none font-sans
                  "
                value={commentInputFieldValue}
                onChange={(e) => setCommentInputFieldValue(e.target.value)}
              />
              <SendOutlined
                className="text-white absolute top-[15px] right-3"
                onClick={() =>
                  submitCommentHandler(true, postModalData?.postId)
                }
              />
            </div>
            {/*comments */}
            <div className=" relative">
              <div
                className="
                   flex flex-col gap-y-3 min-h-fit"
              >
                {postModalData?.comments?.map((comment) => (
                  <div
                    className="flex gap-x-2 items-center pr-6"
                    key={comment?.commentId}
                  >
                    <div
                      className={`
                            mb-3
                                h-8 w-8
                                md:h-10
                                md:w-10
                                flex relative overflow-hidden rounded-full `}
                    >
                      <Image
                        src={`https://ipfs.io/ipfs/${comment?.author?.imageHash}`}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-full"
                        alt="Profile picture"
                      />
                    </div>
                    <div className="text-gray-300   ">
                      <div className="bg-darkBlue p-2 rounded-lg">
                        {" "}
                        <p className="text-md">{comment?.author?.userName}</p>
                        <p className="text-sm font-sans">{comment?.content}</p>
                      </div>

                      <div className="flex text-gray-400 font-sans text-xs">
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
              {postModalPagination !== 0 &&
                postModalData?.comments?.length >= 3 && (
                  <p
                    className="text-white mt-5 hover:underline hover:cursor-pointer"
                    onClick={() => handleShowMorePostModal()}
                  >
                    Show more comments
                  </p>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
