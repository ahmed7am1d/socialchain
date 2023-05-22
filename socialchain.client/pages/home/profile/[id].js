import { Feed } from "@/components/HomePage/Feed";
import { UserProfile } from "@/components/HomePage/UserProfile";
import HomePageLayout from "@/layouts/homePageLayout";
import React from "react";
import { useRouter } from "next/router";
const profile = (props) => {
  const router = useRouter();
  const {id} = router.query;

  return (
    <>
      <UserProfile userId={id} />
      <Feed isUserProfile={true} userId={id} />
    </>
  );
};

export default profile;
profile.Layout = HomePageLayout;
