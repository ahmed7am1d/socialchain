import React, { useState, useRef, useEffect } from "react";
import { Checkbox, message } from "antd";
import { ethers, providers } from "ethers";
import { isRegisteredUser, nonce, verify } from "@/services/api/authService";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/router";
import cookie from "cookie";
import { DatePicker, Form } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  useIPFS,
  perofrmanceImage,
  transparencyImage,
  metaMaskImage,
  connectWallet,
  coinbaseWallet,
  formaticWallet,
  ledgerWallet,
  trezarWallet,
  keyStore,
  kava,
  osmosis,
  uploadImage,
} from "./imports";

import Image from "next/image";
import classes from "./login.module.css";
import { motion } from "framer-motion";
import { isValidJWT } from "@/utils/Jwt/jwtUtilis";
import { yupSyncRegisterValidation } from "@/validations/Auth/UserRegisterValidationScheme";
import fileToBase64 from "@/utils/Files/fileUtils";
import SocialChainContractConstants from "@/constants/blockchain/SocialChainContractConstants";
import SocialChainContract from "../../contract-artifacts/contracts/SocialChain.sol/SocialChain.json";
import { euDateToISO8601, iSO8601ToUnixDate } from "@/utils/Date/dateUtils";
import extractContractErrorMessage from "@/utils/Errors/extractContractErrorMessageUtils";
import { LottieAnimation } from "@/components/Animations/LottieAnimation";

/**
 * Returns the initial props for a Next.js page, based on the context object.
 * If the user has a valid access token cookie, redirects them to the home page (A logged in user can not access login page).
 * Otherwise, returns an empty props object.
 *
 * @param {Object} context - The context object for the page.
 * @param {Object} context.req - The HTTP request object.
 * @returns {Object} An object containing either a redirect destination or an empty props object.
 * @throws {Error} If an error occurs while parsing the cookies or.
 */
export async function getServerSideProps(context) {
  try {
    const cookies = cookie.parse(context.req.headers.cookie);
    const accessToken = cookies?.accessToken;
    if (accessToken) {
      if (await isValidJWT(accessToken)) {
        return {
          redirect: {
            destination: "/home",
            permanent: false,
          },
          props: {},
        };
      } else {
        return {
          props: {},
        };
      }
    } else {
      return {
        props: {},
      };
    }
  } catch (e) {
    return {
      props: {},
    };
  }
}

const login = () => {
  //#region states & variables
  const { auth, setAuth } = useAuth();
  const [userBirthDateString, setUserBirthDateString] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [selectedProfilePictureSrc, setSelectedProfilePictureSrc] =
    useState("");
  const [selectedProfilePictureFile, setSelectedProfilePictureFile] =
    useState("");
  const [selectedProfilePictureSrcBytes, setSelectedProfilePictureSrcBytes] =
    useState("");
  const { uploadFileToIPFS } = useIPFS();
  const imageRef = useRef();
  const router = useRouter();
  const dateFormat = "DD/MM/YYYY";

  //#endregion

  //#region handling modals
  const handleRegisterModal = async () => {
    setIsRegisterModalOpen(!isRegisterModalOpen);
  };

  const handleConnectModal = async () => {
    setIsConnectModalOpen(!isConnectModalOpen);
  };
  //#endregion

  //#region Forms and validations
  const [{ form: connectWalletForm }] = Form.useForm();
  const handleConnectWalletForm = async (e) => {
    let userRegisterObject = {
      bio: e.bio,
      userName: e.userName,
      name: e.name,
      rememberMe: e.remember,
      birthDate: e.dateOfBirth,
      ipfsProfilePictureHash: "",
      ipfsCoverPictureHash: "",
    };

    //[1]- Let the user connect the wallet and get his address and contienu with auth workflow
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        //let the user connect to his account
        const signer = provider.getSigner();
        const accountAddresses = await provider.send("eth_requestAccounts", []);
        var connectedAccountAddress = accountAddresses[0];
        //[2]- Upload user image to IPFS if only Image exists
        if (selectedProfilePictureSrc) {
          try {
            const ipfsProfilePictureHash = await uploadFileToIPFS(
              selectedProfilePictureFile
            );
            userRegisterObject.ipfsProfilePictureHash = ipfsProfilePictureHash;
          } catch (error) {
            console.error(error);
            // handle error of ipfs uploading
          }
        }

        //[3]- Call the contract and the function greetings (for testing purposes)
        const contract = new ethers.Contract(
          SocialChainContractConstants.SOCIAL_CHAIN_CONTRACT_ADDRESS,
          SocialChainContract.abi,
          signer
        );
        try {
          //Converting normal date to unix so that contract accept it
          const userBirthDateStringValue = userBirthDateString;
          const iSO8601Date = await euDateToISO8601(userBirthDateStringValue);
          const formattedUnixBirthDate = await iSO8601ToUnixDate(iSO8601Date);
          userRegisterObject.birthDate = formattedUnixBirthDate;
          const transaction = await contract.registerUser(
            userRegisterObject.userName,
            userRegisterObject.name,
            userRegisterObject.ipfsProfilePictureHash,
            "",
            userRegisterObject.bio,
            userRegisterObject.birthDate,
            true
          );
          const transactionResult = await transaction.wait();
          //transactionResult.events => return list of all emitted events from the function
          //transactionResult.events[0].args => the args send back from the event at index 0
          //transactionResult.events[0].userAddress
          //transactionResult.events[0].userId
          //If the transaction is successful remember me should be stored:
          document.cookie = "rememberMe=true";
        } catch (error) {
          //Contract Error
          const errorMessage = extractContractErrorMessage(error.data.message);
          messageApi.open({
            type: "error",
            content: errorMessage,
          });
          return false;
        }
        //[4]-Generate JWT Token
        //[A]- nonce
        const messageTempToken = await nonce(connectedAccountAddress);
        //[B]- get user signature
        let signature = "";
        try {
          signature = await signer.signMessage(messageTempToken.message);
          //[C]- verify and get accessToken
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
          //[5]- Forward the user to the login page with sending parameters
          router.push(
            {
              pathname: "/home/profile",
            },
            "./home/profile"
          );
        } catch (e) {
          messageApi.open({
            type: "error",
            content: "You have to sign the message to register to get JWT !!",
          });
          return false;
        }
      } catch (e) {
        messageApi.open({
          type: "error",
          content:
            "You have to connect to your account to be able to continue !!",
        });
        return false;
      }
    } else {
      //User does not have metamask Installed
      messageApi.open({
        type: "error",
        content: "No Digital Wallet is connected !",
      });
      return false;
    }
  };

  //#endregion

  //#region Handling clicking events
  const handleProfileImageChange = async (e) => {
    if (e?.target?.files?.[0]) {
      const file = e.target.files[0];
      setSelectedProfilePictureFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedProfilePictureSrc(reader.result);
      };
      reader.readAsDataURL(file);

      //set the images bytes
      const base64ImageNotFormatted = await fileToBase64(file);
      const base64ImageFormatted = base64ImageNotFormatted.slice(
        base64ImageNotFormatted.indexOf(",") + 1,
        base64ImageNotFormatted.length
      );
      setSelectedProfilePictureSrcBytes(base64ImageFormatted);
    }
  };
  const showOpenFileDialog = () => {
    imageRef.current.click();
  };
  const deleteProfileImageHandler = () => {
    setSelectedProfilePictureSrc("");
    setSelectedProfilePictureSrcBytes("");
  };
  const handleBirthDateChange = (date, dateString) => {
    setUserBirthDateString(dateString);
  };
  const handleLogin = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      //let the user connect to his account
      //add try here:
      const accountAddresses = await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const isRegisteredUserResult = await isRegisteredUser(
        accountAddresses[0]
      );
      if (isRegisteredUserResult === true) {
        //[A]- nonce
        const messageTempToken = await nonce(accountAddresses[0]);
        //[B]- get user signature
        let signature = "";
        try {
          signature = await signer.signMessage(messageTempToken.message);
          //[C]- verify and get accessToken
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
          //[5]- Forward the user to the login page with sending parameters
          router.push(
            {
              pathname: "/home/profile",
            },
            "./home/profile"
          );
        } catch (e) {
          messageApi.open({
            type: "error",
            content: "You have to sign the message to register to get JWT !!",
          });
          return false;
        }
      } else {
        messageApi.open({
          type: "error",
          content: isRegisteredUserResult,
        });
        return false;
      }
    } else {
      //User does not have metamask Installed
      messageApi.open({
        type: "error",
        content: "No Digital Wallet is connected !",
      });
      return false;
    }
  };
  //#endregion

  return (
    <>
      {contextHolder}
      {/* Background curve */}
      <div className="absolute w-screen h-[300px]  bg-primaryGoldColorTrans top-60 -z-1 -skew-y-12 transform-gpu origin-top bottom-0"></div>
      {/* Register modal*/}
      <motion.div
        id="authentication-modal"
        className={`fixed flex justify-center backdrop  items-center z-50 ${
          !isRegisterModalOpen && "hidden"
        } w-full h-screen p-4 overflow-x-hidden overflow-y-auto md:inset-0 `}
        initial={{
          opacity: 0,
          scale: 0,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 2,
        }}
      >
        <div className="relative w-full h-full max-w-md md:h-auto">
          {/* <!-- Modal content --> */}
          <div className="relative rounded-lg shadow bg-darkBlueHalfTrans">
            {/* Close Button */}
            <button
              onClick={handleRegisterModal}
              type="button"
              className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
              data-modal-hide="authentication-modal"
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
            {/* Content */}
            <div className="px-6 py-6 lg:px-8">
              <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
                Sign up to{" "}
                <span className=" bg-primaryGoldColor rounded-md p-1">
                  Social chain
                </span>
              </h3>
              <Form
                form={connectWalletForm}
                onFinish={handleConnectWalletForm}
                className="space-y-1"
                initialValues={{
                  remember: false,
                  userName: "",
                  name: "",
                  bio: "",
                  dateOfBirth: "",
                  profilePicture: "",
                }}
              >
                {/* user name + name inputs */}
                <div className="flex items-center gap-x-5 ">
                  <div>
                    <label
                      htmlFor="userName"
                      className="block mb-2 text-sm font-medium  text-white"
                    >
                      User name
                    </label>
                    <Form.Item
                      rules={[yupSyncRegisterValidation]}
                      name="userName"
                    >
                      <input
                        type="text"
                        name="userName"
                        id="userName"
                        className=" text-sm rounded-lg block w-full p-2.5 bg-gray-600 text-white focus:outline-none focus:border-none"
                      />
                    </Form.Item>
                  </div>
                  <div>
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Name
                    </label>
                    <Form.Item name="name">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className=" text-sm rounded-lg block w-full p-2.5 bg-gray-600 text-white focus:outline-none focus:border-none"
                      />
                    </Form.Item>
                  </div>
                </div>
                {/* Bio text area */}
                <div>
                  <label
                    htmlFor="bio"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:border-none"
                  >
                    Bio
                  </label>
                  <Form.Item name="bio">
                    <textarea
                      name="bio"
                      id="bio"
                      className=" text-sm rounded-lg block w-full p-2.5 bg-gray-600 text-white focus:outline-none focus:border-none"
                    />
                  </Form.Item>
                </div>
                {/* Date of birth */}
                <div>
                  <label
                    htmlFor="bio"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Date of birth:
                  </label>
                  <Form.Item name="dateOfBirth">
                    <DatePicker
                      onChange={handleBirthDateChange}
                      format={dateFormat}
                      allowClear={false}
                      className={`${classes.birthDatePicker} bg-gray-600 text-white`}
                    />
                  </Form.Item>
                </div>
                {/* Remember me */}
                <div className="flex items-start">
                  <Form.Item name="remember" valuePropName="checked">
                    <Checkbox className="text-white text-sm font-medium">
                      Remember me
                    </Checkbox>
                  </Form.Item>
                </div>
                {/* Profile picture */}
                <div>
                  <h1 className="text-white text-sm font-medium">
                    Profile picture:
                  </h1>
                  <div className="flex justify-center">
                    <Form.Item name="profilePicture">
                      <input
                        ref={imageRef}
                        type="file"
                        style={{ display: "none" }}
                        accept="image/*"
                        onChange={handleProfileImageChange}
                      />
                    </Form.Item>
                    {selectedProfilePictureSrc ? (
                      <Image
                        src={selectedProfilePictureSrc}
                        width={32}
                        height={32}
                        className="w-32 h-32 rounded-full mt-0 mb-10"
                        alt="User profile container"
                      />
                    ) : (
                      <div className=" w-32 h-32 rounded-full duration-200  mb-10 bg-primaryGoldColorTrans mt-0"></div>
                    )}
                    {selectedProfilePictureSrc ? (
                      <div
                        className=" duration-200 cursor-pointer absolute flex items-center justify-center w-32 h-32 rounded-full  mb-10 opacity-0 hover:opacity-100 hover:bg-gray-600 mt-0 m"
                        onClick={deleteProfileImageHandler}
                      >
                        <DeleteOutlined
                          style={{ fontSize: "30px", color: "white" }}
                        />
                      </div>
                    ) : (
                      <div
                        className=" duration-200 cursor-pointer absolute flex items-center justify-center w-32 h-32 rounded-full  mb-10 opacity-0 hover:opacity-100 hover:bg-gray-600 mt-0 m"
                        onClick={showOpenFileDialog}
                      >
                        <UploadOutlined
                          style={{ fontSize: "30px", color: "white" }}
                        />
                      </div>
                    )}
                  </div>
                </div>
                {/* Continue button */}
                <button
                  type="submit"
                  className="w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-primaryGoldColor "
                >
                  Continue
                </button>
              </Form>
            </div>
          </div>
        </div>
      </motion.div>
      {/* Connect modal */}
      {/* Main content */}
      <div
        className={`h-screen px-12 py-4 relative overflow-y-auto overflow-x-hidden scrollbar-none duration-500 ${
          isRegisterModalOpen && "blur bg-darkBlack opacity-50"
        }`}
      >
        <div className="lg:grid lg:grid-cols-2 h-full lg:gap-x-6 flex flex-col gap-y-4 ">
          {/* Wallets */}
          <motion.div
            className={`bg-white bg-opacity-10 bg-clip-padding rounded-md p-5 space-y-10 ${classes.walletsContainer} `}
            style={{
              backdropFilter: "blur(5px)",
            }}
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
            <div className="flex flex-wrap justify-center gap-x-14 gap-y-2 font-poppins">
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
              data-modal-target="authentication-modal"
              data-modal-toggle="authentication-modal"
              className="w-full  rounded bg-primaryGoldColor shadow-xl shadow-primaryGoldColor/50 hover:bg-primaryGoldColor/50 duration-500 text-white p-3"
              onClick={handleRegisterModal}
            >
              REGISTER NOW TO SOCIAL CHAIN
            </button>
            <p className="text-white">
              Already a user{" "}
              <span
                onClick={handleLogin}
                className="text-primaryGoldColor font-semibold uppercase cursor-pointer"
              >
                login
              </span>{" "}
            </p>
          </motion.div>
          {/* Features */}
          <div className=" flex flex-col justify-between gap-y-6">
            {/* Upper box */}
            <motion.div
              className="h-1/2 bg-white  bg-opacity-10 bg-clip-padding rounded-md text-center flex flex-col   justify-center"
              style={{
                backdropFilter: "blur(5px)",
              }}
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
                <LottieAnimation
                  fileName="blockchainPerformanceAnimation.json"
                  width={200}
                  divId="blockchainPerformanceAnimation"
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
              className="h-1/2 bg-white  bg-opacity-10 bg-clip-padding rounded-md text-center flex flex-col   justify-center"
              style={{
                backdropFilter: "blur(5px)",
              }}
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
                <LottieAnimation
                  fileName="106808-blockchain.json"
                  width={200}
                  divId="106808-blockchain"
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
