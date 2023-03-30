import { Feed } from '@/components/HomePage/Feed'
import { UserProfile } from '@/components/HomePage/UserProfile'
import HomePageLayout from '@/layouts/homePageLayout'
import React from 'react'
import Router, { useRouter } from 'next/router'
 const profile = (props) => {
  const router = useRouter();
  return (
    <>
    <UserProfile/>
    <Feed/>
    </>
  )
}

export default profile;
profile.Layout = HomePageLayout;