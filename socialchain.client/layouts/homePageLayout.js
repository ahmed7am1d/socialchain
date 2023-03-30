import React from "react";
import { LeftSideBar } from "@/components/HomePage/LeftSideBar";
import { RightSideBar } from "@/components/HomePage/RightSideBar";

const HomePageLayout = ({ children }) => {
  return (
    <div
      className="
      font-mono
    md:grid-cols-6
    h-screen grid grid-cols-8"
    >
      <LeftSideBar />
      <section
        className="
      md:col-span-4
      col-span-6
      overflow-x-hidden
      scrollbar-thin"
      >
        {/* Search bar - takes full width with padding from inside */}
        <header className="mx-5">
          <input
            type="search"
            className="w-full text-white mt-5 px-3 py-1 bg-darkBlack outline-none 
          focus:outline focus:outline-primaryPinkColor
          rounded-lg"
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
