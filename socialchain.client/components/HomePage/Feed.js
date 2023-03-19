import React from "react";
import peopleIcon from "../../assets/Icons/people.png";
import checkInIcon from "../../assets/Icons/check-in.png";
import moodIcon from "../../assets/Icons/moode.png";
import tempPostImage from "../../assets/Images/blockchainTempPost.png";
import userTempProfilePicture from "../../assets/Images/userProfilePicture.jpg";
import {
  HeartOutlined,
  CommentOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import Image from "next/image";

export const Feed = () => {
  return (
    <main className="m-5 grid grid-cols-4 gap-x-3">
      <aside className="">s</aside>
      {/* feed */}
      <section className="col-span-3">
        {/* Share post container */}
        <div className="gap-y-5 flex  p-4  bg-darkBlue flex-col   rounded-md">
          {/* Type of post */}
          <div className="gap-y-5 flex flex-col">
            <ul className="flex gap-x-5 text-gray-200">
              <li>Status</li>
              <li>Photos</li>
              <li>Videos</li>
            </ul>
          </div>
          {/* placeholder and input text */}
          <div className="flex items-center gap-x-5">
            <div>
              <Image
                className="rounded-full"
                src={userTempProfilePicture}
                width={40}
                height={40}
                alt="Profile picture"
              />
            </div>
            <div className="w-full">
              <input
                className="w-full bg-darkBlue outline-none text-white"
                placeholder="Write something..."
              />
            </div>
          </div>
          {/* button - type and additional feelings */}
          <div className="flex items-center justify-between w-full text-white">
            <div className="flex flex-row w-full gap-x-7">
              <div className="flex gap-x-2">
                <Image src={peopleIcon} height={20} width={22} alt="People icon"/>
                <p>People</p>
              </div>
              <div className="flex gap-x-2">
                <Image src={checkInIcon} height={20} width={22} alt="Location icon" />
                <p>People</p>
              </div>
              <div className="flex gap-x-2">
                <Image src={moodIcon} height={20} width={22} alt="Mood icon" />
                <p>People</p>
              </div>
            </div>
            <div>
              <button
                className=" bg-primaryPinkColor px-5 py-2 rounded-sm shadow-xl shadow-primaryPinkColorTrans
                  "
              >
                Share
              </button>
            </div>
          </div>
        </div>
        {/* Posts */}
        {/* First post */}
        <div className="p-4 bg-darkBlue mt-5 flex flex-col gap-y-5 rounded-md">
          {/* user info - created by */}
          <div className="flex justify-between">
            <div className="flex items-center gap-x-5 text-white">
              <div>
                <Image
                  src={userTempProfilePicture}
                  width={40}
                  height={40}
                  className="rounded-full"
                  alt="Profile picture"
                />
              </div>
              <div>
                <p>
                  <strong>Ahmed Hamid</strong> created new post
                </p>
                <p className="text-gray-400">6 hours ago</p>
              </div>
            </div>
            <div className="text-gray-400">
              <p>...</p>
            </div>
          </div>
          {/* title of post*/}
          <div className="text-gray-200">
            <p>Hello world from ahmed hamid</p>
          </div>
          {/* Image */}
          <div>
            <Image src={tempPostImage} alt="Post image"/>
          </div>
          {/* Likes - comments - share */}
          <div className="flex gap-x-6 text-white">
            <div className="flex items-center justify-center gap-x-2">
              <HeartOutlined />
              <span>20</span>
            </div>
            <div className="flex items-center justify-center gap-x-2">
              <CommentOutlined />
              <span>10</span>
            </div>
            <div className="flex items-center justify-center gap-x-2">
              <ShareAltOutlined />
              <span>5</span>
            </div>
          </div>
        </div>
        {/* Second post */}
        <div className="p-4 bg-darkBlue mt-5 flex flex-col gap-y-5 rounded-md">
          {/* user info - created by */}
          <div className="flex justify-between">
            <div className="flex items-center gap-x-5 text-white">
              <div>
                <Image
                  src={userTempProfilePicture}
                  width={40}
                  height={40}
                  className="rounded-full"
                  alt="Post image"
                />
              </div>
              <div>
                <p>
                  <strong>Ahmed Hamid</strong> created new post
                </p>
                <p className="text-gray-400">6 hours ago</p>
              </div>
            </div>
            <div className="text-gray-400">
              <p>...</p>
            </div>
          </div>
          {/* title of post*/}
          <div className="text-gray-200">
            <p>Hello world from ahmed hamid</p>
          </div>
          {/* Image */}
          <div>
            <Image src={tempPostImage} alt="Post image"/>
          </div>
          {/* Likes - comments - share */}
          <div className="flex gap-x-6 text-white">
            <div className="flex items-center justify-center gap-x-2">
              <HeartOutlined />
              <span>20</span>
            </div>
            <div className="flex items-center justify-center gap-x-2">
              <CommentOutlined />
              <span>10</span>
            </div>
            <div className="flex items-center justify-center gap-x-2">
              <ShareAltOutlined />
              <span>5</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

