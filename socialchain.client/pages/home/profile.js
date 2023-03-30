import { Feed } from '@/components/HomePage/Feed'
import { UserProfile } from '@/components/HomePage/UserProfile'
import HomePageLayout from '@/layouts/homePageLayout'
import React from 'react'

 const profile = () => {
  return (
    <>
    <UserProfile/>
    <Feed/>
    </>
  )
}

export default profile;
profile.Layout = HomePageLayout;