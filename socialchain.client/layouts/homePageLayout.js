import React, { useEffect } from "react";
import { LeftSideBar } from "@/components/HomePage/LeftSideBar";
import { RightSideBar } from "@/components/HomePage/RightSideBar";
import { ethers } from "ethers";
import useAuth from "@/hooks/useAuth";
import socialChainContractABI from "../contract-artifacts/contracts/SocialChain.sol/SocialChain.json";
import SocialChainContractConstants from "@/constants/blockchain/SocialChainContractConstants";
import useLogoutLoading from "@/hooks/useLogoutLoading";
const HomePageLayout = ({ children }) => {
  const { setAuth } = useAuth();
  const { isLogoutLoading } = useLogoutLoading();
  useEffect(() => {
    async function setUserInformation() {
      //[1]- Get user object from the contract
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accountAddresses = await provider.send("eth_requestAccounts", []);
      const contract = new ethers.Contract(
        SocialChainContractConstants.SOCIAL_CHAIN_CONTRACT_ADDRESS,
        socialChainContractABI.abi,
        provider
      );
      const result = await contract.getUser(accountAddresses[0]);

      //[2]- Set it to the auth state
      setAuth({
        id: parseInt(result[0]._hex, 16),
        userName: result[1],
        name: result[2],
        bio: result[3],
        birthDate: parseInt(result[4]._hex, 16),
        showUsername: result[5],
        imageHash: result[6],
        coverHash: result[7],
        accountAddress: accountAddresses[0],
      });
    }
    setUserInformation();
  }, []);
  return (
    <>
      {isLogoutLoading ? (
        <div>Forward to login page ..........</div>
      ) : (
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
      )}
    </>
  );
};

export default HomePageLayout;
