import React, { useEffect, useState } from "react";
import Image from "next/image";
import userTempCover from "../../assets/Images/userTempCoverPhoto.jpg";
import styles from "../../pages/home/home.module.css";
import useAuth from "@/hooks/useAuth";
import { getUserByAccountAddress } from "@/services/web3/contractServices";
export const UserProfile = ({ userId }) => {
  const { auth } = useAuth();
  const [userObject, setUserObject] = useState({});

  useEffect(() => {
    async function setUserData() {
      if (userId !== auth?.accountAddress) {
        //[1]- Fetch the new user data
        const userObjectResult = await getUserByAccountAddress(userId);
        setUserObject(userObjectResult);
      } else {
        setUserObject(auth);
      }
    }
    setUserData();
  }, [userId]);

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
            src={`https://ipfs.io/ipfs/${userObject?.imageHash}`}
            alt="Profile Photo"
            layout="fill"
            objectFit="cover"
          />
        </div>
        {/* userName + name*/}
        <div>
          <div className="text-2xl text-white ">{userObject?.userName}</div>
          <div className="text-xl text-gray-400 ">{userObject?.name}</div>
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
            <p>Friends</p>
          </li>
        </ul>
      </div>
    </section>
  );
};
