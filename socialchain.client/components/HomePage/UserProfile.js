import React, { useEffect } from "react";
import { Feed } from "./Feed";
import Image from "next/image";
import userTempCover from "../../assets/Images/userTempCoverPhoto.jpg";
import userTempProfilePicture from "../../assets/Images/userProfilePicture.jpg";
import styles from "../../pages/home/home.module.css";
import HomePageLayout from "@/layouts/homePageLayout";
import useAuth from "@/hooks/useAuth";
export const UserProfile = () => {
  const { auth, setAuth } = useAuth();
  useEffect(() => {
    console.log("From UserProfile component => ", auth);
  }, []);
  return (
    <section className="m-5 flex flex-col relative">
      {/* cover photo */}
      <div className="hidden md:block">
        <Image src={userTempCover} alt="Cover Photo" />
      </div>
      {/* user name and profile picture */}
      <div
        className="
          flex justify-center items-center gap-x-6 relative
          md:flex md:justify-start md:items-center md:absolute md:w-full md:left-5 md:bottom-3 md:gap-x-8
         "
      >
        {/* Profile picture */}
        <div
          className="
            h-20 w-20
            sm:h-24 sm:w-24
            md:h-40 md:w-40
            flex relative overflow-hidden rounded-full"
        >
          <Image
            src={`https://ipfs.io/ipfs/${auth?.imageHash}`}
            alt="Profile Photo"
            layout="fill"
            objectFit="cover"
          />
        </div>
        {/* userName + name*/}
        <div>
          <div className="text-2xl text-white ">{auth?.userName}</div>
          <div className="text-xl text-gray-400 ">{auth?.name}</div>
        </div>
      </div>
      {/* navigation's */}
      <div
        className="
          flex justify-center
          md:flex md:justify-end
          lg:flex lg:justify-center
       "
      >
        <ul
          className={`
            text-sm gap-x-3
            md:gap-x-6
            flex  p-5
            text-gray-400
            bg-darkBlueHalfTrans
            w-full
            justify-center
            h-full
            font-mono
            ${styles.feedNavigationWrapper}
            `}
        >
          <li>
            <p>Timeline</p>
          </li>
          <li>
            <p>About</p>
          </li>
          <li>
            <p>Friends</p>
          </li>
          <li>
            <p>Friends</p>
          </li>
          <li>
            <p>More</p>
          </li>
        </ul>
      </div>
    </section>
  );
};
