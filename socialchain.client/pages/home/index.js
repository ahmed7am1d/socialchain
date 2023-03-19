import React from "react";
import { Feed } from "@/components/HomePage/Feed";
import HomePageLayout from "@/layouts/homePageLayout";
const Index = ({ children }) => {
  return (
    <Feed/>
  );
};
export default Index;
Index.Layout = HomePageLayout;
