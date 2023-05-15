import React from "react";
import homePageStyle from "../../pages/home/home.module.css";
import Image from "next/image";
import { DotsThree } from "phosphor-react";
import {
  HeartFilled,
  CommentOutlined,
  ShareAltOutlined,
  SendOutlined,
} from "@ant-design/icons";
import ConfettiExplosion from "react-confetti-explosion";
import Link from "next/link";

const Post = ({
  isUserProfile,
  post,
  auth,
  celebrateLikePost,
  handleLikePost,
  commentInputFieldValue,
  setCommentInputFieldValue,
  submitCommentHandler,
  handlePostModalOpen,
}) => {
  return (
    <div
      key={post?.postId}
      className="p-4 bg-darkBlueHalfTrans mt-5 flex flex-col gap-y-5 rounded-md"
    >
      {/* user info - created by */}
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
                src={`https://ipfs.io/ipfs/${post?.userProfileImgHash}`}
                layout="fill"
                objectFit="cover"
                className="rounded-full"
                alt="Profile picture"
              />
            </div>
          </div>
          <div>
            <p>
              <Link href={`/home/profile/${post?.author}`}>
                {isUserProfile ? (
                  <strong>{auth?.userName}</strong>
                ) : (
                  <strong>{post?.userName}</strong>
                )}{" "}
                shared a post
              </Link>
            </p>

            <p className="text-gray-400">{post?.timeStamp}</p>
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
        <p>{post?.postDescription}</p>
      </div>

      {/* Image */}
      {post?.postImgHash && (
        <div
          className="flex relative w-full h-[300px] hover:cursor-pointer"
          onClick={() => handlePostModalOpen(post)}
        >
          <Image
            layout="fill"
            objectFit="contain"
            src={`https://ipfs.io/ipfs/${post?.postImgHash}`}
            alt="Post image"
          />
        </div>
      )}

      {/* Likes - comments - share */}
      <div className=" px-2 relative flex gap-x-6 text-white font-sans">
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
            handleLikePost(false, post?.postId, post?.isLikedByOwner)
          }
        >
          <HeartFilled />
          <span>{post?.likeCount}</span>
        </div>
        <div className="flex items-center justify-center gap-x-2">
          <CommentOutlined />
          <span>{post?.comments?.length ? post?.comments?.length : "0"}</span>
        </div>
        <div className="flex items-center justify-center gap-x-2">
          <ShareAltOutlined />
          <span>0</span>
        </div>
      </div>
      {/* Comment input field */}
      <div className="relative font-sans">
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
          onClick={() => submitCommentHandler(false, post?.postId)}
        />
      </div>
      {/*comments */}
      <div className=" relative">
        <div
          className="scrollbar-thin scrollbar-thumb-primaryGoldColor scrollbar-track-darkBlue scrollbar-rounded-lg
max-h-[200px] flex flex-col gap-y-3 min-h-fit overflow-y-scroll"
        >
          {post?.comments?.map((comment) => (
            <div
              className="flex gap-x-2 items-center pr-6 font-sans"
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
                  <p className="text-sm">{comment?.content}</p>
                </div>

                <div className="flex text-gray-400">
                  <div className="flex gap-x-4 text-xs">
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
          onClick={() => handlePostModalOpen(post)}
        >
          Show more comments
        </p>
      </div>
    </div>
  );
};

export default Post;
