import React from "react";
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
import socialChainLogo from '../../assets/logos/socialchain.png';
import Image from "next/image";
export const LeftSideBar = () => {
  return (
    <aside className={`p-5 bg-darkBlueHalfTrans ${styles.asideWrapper}`}>
      {/* title */}
      <div className={`flex items-center gap-x-1 ${styles.socialChainLogoWrapper}`}>
      <Image
                className="rounded-full"
                src={socialChainLogo}
                width={40}
                height={40}
                alt="Profile picture"
              />
        <h1 className={`text-center text-xl font-semibold text-white first-letter:bg-primaryPinkColor`}>
          Social Chain
        </h1>
      </div>
      {/* Menu Wrapper */}
      <div className="flex flex-col justify-between h-[70%] gap-y-6 ">
        {/* First menu */}
        <div className="mt-10">
          <p className=" text-gray-500 text-sm uppercase font-mono">Menu</p>
          <ul
            className={`flex flex-col gap-y-5 mt-5 text-gray-300 text-sm ${styles.homePageLeftNavigationWrapper} `}
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
              <FileTextOutlined />
              <span>Files</span>
            </li>
            <li className="flex items-center gap-x-5">
              <CalendarOutlined />
              <span>Events</span>
            </li>
          </ul>
        </div>
        {/* Second menu */}
        <div>
          <p className=" text-gray-500 text-sm uppercase font-mono">
            Others
          </p>
          <ul className={`flex flex-col gap-y-5 mt-5 text-gray-300 text-sm  ${styles.homePageLeftNavigationWrapper}`}>
            <li className="flex items-center gap-x-5">
              <SettingOutlined />
              <span>Settings</span>
            </li>
            <li className="flex items-center gap-x-5">
              <LogoutOutlined />
              <span>Log out</span>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
};
