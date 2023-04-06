import { Feed } from "@/components/HomePage/Feed";
import { UserProfile } from "@/components/HomePage/UserProfile";
import HomePageLayout from "@/layouts/homePageLayout";
import React, { useEffect } from "react";
import Router, { useRouter } from "next/router";
import { ethers, providers } from "ethers";
const profile = (props) => {
  const router = useRouter();


  return (
    <>
      <UserProfile />
      <Feed isUserProfile={true}/>
    </>
  );
};

export default profile;
profile.Layout = HomePageLayout;
