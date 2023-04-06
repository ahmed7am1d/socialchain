import React, { useState } from "react";
import styles from "../../pages/home/home.module.css";
import {
  HomeOutlined,
  NotificationOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  CalendarOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import socialChainLogo from "../../assets/logos/socialchain.png";
import Image from "next/image";
import useAuth from "@/hooks/useAuth";
import { logOut } from "@/services/api/authService";
import { useRouter } from "next/router";
export const LeftSideBar = () => {
  const { auth, setAuth } = useAuth();
  const router = useRouter();
  const handleLogOut = async () => {
    //[1]- Remove the cookies
    await logOut();
    //[2]- Clear the state
    setAuth({});
    //[3]- Forward to login
    router.push("/login");
  };
  return (
    <aside className={`p-5 bg-darkBlueHalfTrans  ${styles.asideWrapper}`}>
      {/* title */}
      <div
        className={`flex items-center gap-x-1 ${styles.socialChainLogoWrapper}`}
      >
        <div
          className={`
            h-8 w-8
            p-4
            md:h-12
            md:w-12
            flex relative overflow-hidden rounded-full ${styles.profilePictureWrapper}`}
        >
          <Image
            className="rounded-full"
            src={`https://ipfs.io/ipfs/${auth?.imageHash}`}
            layout="fill"
            objectFit="cover"
            alt="Profile picture"
          />
        </div>

        <h1
          className={`text-center text-xl font-semibold text-white first-letter:bg-primaryGoldColor`}
        >
          Social Chain
        </h1>
      </div>
      {/* Menu Wrapper */}
      <div className="flex flex-col justify-between h-[70%] gap-y-6 ">
        {/* First menu */}
        <div className="mt-10">
          <p className=" text-gray-500 text-sm uppercase font-mono">Menu</p>
          <ul
            className={`flex flex-col gap-y-5 mt-5 text-gray-300 text-md font-Arimo-navbar-font ${styles.homePageLeftNavigationWrapper}`}
          >
            <Link href="/home">
              <li className="flex items-center gap-x-5">
                <HomeOutlined />
                <span>Home</span>
              </li>
            </Link>
            <Link href="/home/profile">
              <li className="flex items-center gap-x-5">
                <UserOutlined />
                <span>My profile</span>
              </li>
            </Link>
            <li className="flex items-center gap-x-5">
              <NotificationOutlined />
              <span>Latest crypto news</span>
            </li>
            <li className="flex items-center gap-x-5">
              <EnvironmentOutlined />
              <span>Explore</span>
            </li>

            <li className="flex items-center gap-x-5">
              <CalendarOutlined />
              <span>Events</span>
            </li>
          </ul>
        </div>
        {/* Second menu */}
        <div>
          <p className=" text-gray-500 text-sm uppercase font-mono">Others</p>
          <ul
            className={`flex flex-col gap-y-5 mt-5 text-gray-300 text-md font-Arimo-navbar-font   ${styles.homePageLeftNavigationWrapper}`}
          >
            <li className="flex items-center gap-x-5">
              <SettingOutlined />
              <span>Settings</span>
            </li>
            <li className="flex items-center gap-x-5" onClick={handleLogOut}>
              <LogoutOutlined />
              <span>Log out</span>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
};
