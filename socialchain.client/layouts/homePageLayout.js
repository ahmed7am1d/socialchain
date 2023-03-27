import React from "react";
import { LeftSideBar } from "@/components/HomePage/LeftSideBar";
import { RightSideBar } from "@/components/HomePage/RightSideBar";

const HomePageLayout = ({ children }) => {
  return (
    <div
      className="
      font-mono
      lg:grid-cols-7
      grid grid-cols-7
      h-screen
      divide-x
      divide-gray-700"
    >
      <LeftSideBar />
      <section
        className="
      lg:col-span-5
      col-span-6
      overflow-x-hidden
      scrollbar-thin"
      >
        {/* Search bar - takes full width with padding from inside */}
        <header className="text-sm h-[70px] font-sans">
          <input
            type="search"
            className="w-full h-full text-white p-5 bg-darkBlueHalfTrans outline-none
        "
            placeholder="Search for people, content, blogs..."
          />
        </header>
        {children}
      </section>
      <RightSideBar />
    </div>
  );
};

export default HomePageLayout;
