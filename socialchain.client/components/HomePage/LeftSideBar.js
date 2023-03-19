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
export const LeftSideBar = () => {
  return (
    <aside className="p-5">
      {/* title */}
      <div>
        <h1 className="text-center text-xl font-semibold text-primaryPinkColor uppercase">
          social chain
        </h1>
      </div>
      {/* Menu Wrapper */}
      <div className="flex flex-col justify-between h-[70%]">
        {/* First menu */}
        <div className="mt-10">
          <p className=" text-gray-400 text-sm uppercase font-semibold">Menu</p>
          <ul
            className={`flex flex-col gap-y-5 mt-5 text-white ${styles.homePageNavigationWrapper} `}
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
          <p className=" text-gray-400 text-sm uppercase font-semibold">
            Others
          </p>
          <ul className="flex flex-col gap-y-5 mt-5 text-white">
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
