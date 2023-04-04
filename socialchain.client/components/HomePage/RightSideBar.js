import React from "react";
import indexImage1 from "@/assets/Images/indexImage1.jpg";
import indexImage2 from "@/assets/Images/indexImage2.png";
import indexImage3 from "@/assets/Images/indexImage3.png";
import { motion } from "framer-motion";
import Image from "next/image";
import { BellOutlined, MailFilled } from "@ant-design/icons";
import useAuth from "@/hooks/useAuth";
export const RightSideBar = () => {
  const {auth} = useAuth();
  return (
    <aside className="hidden lg:flex lg:flex-col lg:gap-y-5 h-screen bg-darkBlueHalfTrans text-gray-300 p-4 text-sm">
      {/* Links section */}
      <header className="flex flex-row gap-x-1 items-center">
        <MailFilled />
        <BellOutlined />
        <div></div>
        <div className="flex  items-center gap-x-3">
          <p>{auth?.userName}</p>
          <div
            className="
            h-20 w-20
            sm:h-10 sm:w-10
            md:h-10 md:w-10
            flex relative overflow-hidden rounded-full
            "
          >
            <Image
              src={`https://ipfs.io/ipfs/${auth?.imageHash}`}
              layout="fill"
              objectFit="cover"
              alt="Profile picture"
            />
          </div>
        </div>
      </header>
      {/* Friends section */}
      <section>
        <p className="text-gray-500 uppercase font-mono">Friends</p>
        <div className="flex flex-col gap-y-4 mt-5 font-sans">
          <div className="flex  items-center gap-x-6 text-xs">
            <div>
              <div
                className="
            h-20 w-20
            sm:h-10 sm:w-10
            md:h-10 md:w-10
            flex relative overflow-hidden rounded-full
            "
              >
                <Image
                  src={indexImage2}
                  alt="Profile Photo"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div>
              <p>Mawj Hamid</p>
              <p className="text-gray-500">29 minuets ago</p>
            </div>
          </div>
          <div className="flex  items-center gap-x-6 text-xs">
            <div>
              <div
                className="
            h-20 w-20
            sm:h-10 sm:w-10
            md:h-10 md:w-10
            flex relative overflow-hidden rounded-full
            "
              >
                <Image
                  src={indexImage3}
                  alt="Profile Photo"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div>
              <p>Maryam Hamid</p>
              <p className="text-gray-500">15 minuets ago</p>
            </div>
          </div>
          <div className="flex  items-center gap-x-6 text-xs">
            <div>
              <div
                className="
            h-20 w-20
            sm:h-10 sm:w-10
            md:h-10 md:w-10
            flex relative overflow-hidden rounded-full
            "
              >
                <Image
                  src={indexImage1}
                  alt="Profile Photo"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div>
              <p>Shahla sweed</p>
              <p className="text-gray-500">30 minuets ago</p>
            </div>
          </div>
        </div>
      </section>
    </aside>
  );
};
