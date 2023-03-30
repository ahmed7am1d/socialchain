import React from "react";
import { message } from "antd";
import { ethers } from "ethers";
import { nonce, verify } from "@/services/Auth/authService";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/router";
import cookie from "cookie";

import perofrmanceImage from "../../assets/Images/performanceImage.png";
import transparencyImage from "../../assets/Images/transparency.png";
import metaMaskImage from "../../assets/Images/MetaMask_Fox.svg.png";
import connectWallet from "../../assets/logos/connectWallet.png";
import coinbaseWallet from "../../assets/logos/coinbasewallet.png";
import formaticWallet from "../../assets/logos/FormaticWallet.jpg";
import ledgerWallet from "../../assets/logos/ledger_logo.png";
import trezarWallet from "../../assets/logos/trezarwallet.png";
import keyStore from "../../assets/logos/keyStore.png";
import kava from "../../assets/logos/kavaWallet.png";
import osmosis from "../../assets/logos/osmosis.png";

import Image from "next/image";
import classes from "./login.module.css";
import { motion } from "framer-motion";
import { isValidJWT } from "@/utils/Jwt/jwtUtilis";

export async function getServerSideProps(context) {
  //Catching the error if no cookies exists
  try {
    const cookies = cookie.parse(context.req.headers.cookie);
    const accessToken = cookies?.accessToken;

    if (await isValidJWT(accessToken)) {
      return {
        redirect: {
          destination: "/home",
          permanent: false,
        },
        props: {},
      };
    }

    return {
      props: {}, // will be passed to the page component as props
    };
  } catch (e) {
    return {
      props: {}, // will be passed to the page component as props
    };
  }
}

const login = () => {
  const { auth, setAuth } = useAuth();
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();

  //- User registering
  const handleConnect = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const accountsAddress = await provider.send("eth_requestAccounts", []);
      const accountAddress = accountsAddress[0];

      //[1]- nonce
      const messageTempToken = await nonce(accountAddress);
      //[2]- get user signature
      let signature = "";
      try {
        signature = await signer.signMessage(messageTempToken.message);
      } catch (e) {
        messageApi.open({
          type: "error",
          content: "You have to sign the message to register to get JWT !!",
        });
        return false;
      }
      //[3]- verify and get accessToken
      const accessTokenAndDataResult = await verify(
        messageTempToken.tempToken,
        signature
      );
      if (accessTokenAndDataResult?.status > 206) {
        messageApi.open({
          type: "error",
          content: accessTokenAndDataResult?.data?.title,
        });
        return false;
      }
      //[4]- set the auth context
      setAuth({
        isAuthenticated: true,
        accountAddress: accountAddress,
        accessToken: accessTokenAndDataResult?.accessToken,
      });
      //[5]- Redirect user
      router.push("/home");
    } else {
      //User does not have metamask Installed
      messageApi.open({
        type: "error",
        content: "No Digital Wallet is connected !",
      });
      return false;
    }
  };
  return (
    <>
      {contextHolder}
      <div className="absolute w-screen h-[300px] bg-primaryPinkColorTrans top-60 -z-1 -skew-y-12 transform-gpu origin-top bottom-0"></div>
      <div className="h-screen px-12 py-4 relative overflow-y-auto overflow-x-hidden scrollbar-none">
        <div className="grid grid-cols-2 h-full gap-x-6">
          {/* Wallets */}
          <motion.div
            className={`bg-darkBlue rounded-md p-5 space-y-10 ${classes.walletsContainer} `}
            initial={{
              opacity: 0,
              x: -500,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 1.5,
            }}
          >
            {/* header and description */}
            <div>
              <h1 className="text-2xl font-semibold text-white">
                Connect Wallet
              </h1>
              <p className="text-grayTextColor">
                Select what network and wallet you want to connect to
              </p>
            </div>
            {/* Wallets and networks */}
            <div className="flex flex-wrap justify-center gap-x-14 gap-y-2">
              <div className="p-5 w-1/4 bg-[#F5F7F9] rounded-md flex flex-col  items-center">
                <Image src={metaMaskImage} alt="logo" width={32} height={32} />
                <p>MetaMask</p>
              </div>
              <div className="p-5  w-1/4 bg-[#F5F7F9] rounded-md flex flex-col  items-center">
                <Image src={connectWallet} alt="logo" width={32} height={32} />
                <p>Wallet Connect</p>
              </div>
              <div className="p-5  w-1/4 bg-[#F5F7F9] rounded-md flex flex-col  items-center">
                <Image src={coinbaseWallet} alt="logo" width={32} height={32} />
                <p>Coinbase</p>
              </div>
              <div className="p-5  w-1/4 bg-[#F5F7F9] rounded-md flex flex-col  items-center">
                <Image src={formaticWallet} alt="logo" width={32} height={32} />
                <p>Formatic</p>
              </div>
              <div className="p-5  w-1/4 bg-[#F5F7F9] rounded-md flex flex-col  items-center">
                <Image src={ledgerWallet} alt="logo" width={32} height={32} />
                <p>Ledger</p>
              </div>
              <div className="p-5  w-1/4 bg-[#F5F7F9] rounded-md flex flex-col  items-center">
                <Image src={trezarWallet} alt="logo" width={32} height={32} />
                <p>Trezar</p>
              </div>
              <div className="p-5  w-1/4 bg-[#F5F7F9] rounded-md flex flex-col  items-center">
                <Image src={keyStore} alt="logo" width={32} height={32} />
                <p>Key Store</p>
              </div>
              <div className="p-5  w-1/4 bg-[#F5F7F9] rounded-md flex flex-col  items-center">
                <Image src={kava} alt="logo" width={32} height={32} />
                <p>Kava</p>
              </div>
              <div className="p-5  w-1/4 bg-[#F5F7F9] rounded-md flex flex-col  items-center">
                <Image src={osmosis} alt="logo" width={32} height={32} />
                <p>Osmosis</p>
              </div>
            </div>
            {/* Information */}
            <div className="flex justify-between text-sm font-medium">
              <div>
                <a
                  className="text-blue-500 cursor-pointer"
                  target="_blank"
                  href="https://www.investopedia.com/terms/d/digital-wallet.asp"
                >
                  What is digital wallet ?
                </a>
              </div>
              <div>
                <p className="text-white">
                  Can't find your wallet?
                  <a
                    className="text-blue-500 cursor-pointer"
                    target="_blank"
                    href="https://www.investopedia.com/terms/d/digital-wallet.asp"
                  >
                    {" "}
                    Suggested Defi Wallet
                  </a>
                </p>
              </div>
            </div>
            {/* Connect button */}
            <button
              className="w-full  rounded bg-primaryPinkColor shadow-xl shadow-primaryPinkColor/50 hover:bg-primaryPinkColor/50 duration-500 text-white p-3"
              onClick={handleConnect}
            >
              CONNECT WALLET
            </button>
          </motion.div>
          {/* Features */}
          <div className=" flex flex-col justify-between gap-y-6">
            {/* Upper box */}
            <motion.div
              className="h-1/2 bg-darkBlue rounded-md text-center flex flex-col   justify-center"
              initial={{
                opacity: 0,
                y: -500,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 1.5,
              }}
            >
              <div className="flex  justify-center">
                <Image
                  src={perofrmanceImage}
                  alt="Performance growth"
                  height={200}
                  width={200}
                />
              </div>
              <h1 className="text-2xl font-semibold text-white">Performance</h1>
              <p className="text-sm text-grayTextColor px-16">
                Blockchain technology is a high-performing system that provides
                numerous benefits, such as increased speed, enhanced security,
                improved transparency, cost-effectiveness, and reliability. Its
                decentralized architecture ensures that data is secure and
                tamper-proof, making it an excellent choice for a wide range of
                industries and applications.
              </p>
            </motion.div>
            {/* Lower box */}
            <motion.div
              className="h-1/2 bg-darkBlue rounded-md text-center flex flex-col   justify-center"
              initial={{
                opacity: 0,
                y: 500,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 1.5,
              }}
            >
              <div className="flex justify-center">
                <Image
                  src={transparencyImage}
                  alt="Transparency"
                  height={200}
                  width={200}
                />
              </div>
              <h1 className="text-2xl font-semibold text-white">
                Transparency
              </h1>
              <p className="text-sm text-grayTextColor px-16">
                Blockchain technology's inherent transparency provides a secure
                and reliable system by recording every transaction on the
                network, promoting trust between parties and allowing for easy
                verification of data and transactions.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default login;
