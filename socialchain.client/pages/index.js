import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import { Detective, FolderSimpleLock, ShieldCheck } from "phosphor-react";
import Image from "next/image";
import socialchainLogo from "../assets/logos/socialchain.png";
import indexImage1 from "../assets/Images/indexImage1.jpg";
import indexImage2 from "../assets/Images/indexImage2.png";
import indexImage3 from "../assets/Images/indexImage3.png";

export default function IndexPage() {
  return (
    <>
      <Head>
        <title>Social chain</title>
        <meta name="description" content="Social chain" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <link rel="icon" href="/blockchain.ico" />
      </Head>
      <div className="absolute w-screen h-[300px] bg-primaryGoldColorTrans top-60 -z-1 -skew-y-12 transform-gpu origin-top bottom-0"></div>

      <div
        className=" h-screen 
        max-w-7xl m-auto p-5  relative"
      >
        {/* Left and right section */}
        <section
          className="
        h-full
        max-w-7xl
        grid 
        grid-cols-1
        lg:grid-cols-2
        items-center
        text-white
       "
        >
          {/* Left Side */}
          <motion.div
            initial={{
              x: -500,
              opacity: 0,
              scale: 0.5,
            }}
            animate={{
              x: 0,
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 1.6,
            }}
            className=" text-center lg:text-left"
          >
            <h1 className="text-3xl text-primaryGoldColor first-letter:bg-white first-letter:px-[2px] font-bold">
              Social chain
            </h1>
            <p className="p-1 text-md xl:mr-36 font-poppins">
              Social chain is a{" "}
              <span className=" text-primaryGoldColor font-semibold font-serif">
                decentralized media platform
              </span>{" "}
              built on the top of Ethereum - polygon. With this platform you can
              own your data, where{" "}
              <span className="line-through">no third party</span> is
              interacting between you and your data. in this platform JWT is
              used to make sure that your data is even more secure
            </p>
          </motion.div>
          {/* Right side */}
          <div>
            <motion.div
              className="flex justify-center"
              initial={{
                x: 500,
                opacity: 0,
                scale: 0.5,
              }}
              animate={{
                x: 0,
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 1.6,
              }}
            >
              <button className="bg-primaryGoldColor p-3 rounded-lg shadow-lg shadow-primaryGoldColor/50 hover:bg-primaryGoldColor/50 duration-500">
                <Link href="/login">
                  START NOW{" "}
                  <span className="text-white/60 font-serif font-semibold">
                    for free
                  </span>
                </Link>
              </button>
            </motion.div>
            {/* Features */}
            <div className="flex flex-col items-center gap-y-3 mt-5">
              <motion.div
                className="flex items-center justify-center w-full md:w-1/3 gap-x-10 "
                initial={{
                  x: 500,
                  opacity: 0,
                  scale: 0.5,
                }}
                animate={{
                  x: 0,
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration: 2,
                }}
              >
                <ShieldCheck
                  className="text-primaryGoldColor"
                  size={37}
                  weight="fill"
                />
                <p className="w-20 font-semibold">Security</p>
              </motion.div>
              <motion.div
                className="flex items-center justify-center  w-full md:w-1/3 gap-x-10"
                initial={{
                  x: 500,
                  opacity: 0,
                  scale: 0.5,
                }}
                animate={{
                  x: 0,
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration: 2.3,
                }}
              >
                <Detective
                  className="text-primaryGoldColor"
                  size={37}
                  weight="fill"
                />
                <p className="w-20 font-semibold">Transparency</p>
              </motion.div>
              <motion.div
                className="flex items-center justify-center  w-full md:w-1/3 gap-x-10"
                initial={{
                  x: 500,
                  opacity: 0,
                  scale: 0.5,
                }}
                animate={{
                  x: 0,
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration: 2.7,
                }}
              >
                <FolderSimpleLock
                  className="text-primaryGoldColor"
                  size={37}
                  weight="fill"
                />
                <p className="w-20 font-semibold">Immutable</p>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
      {/* Random Images */}
      <div className="absolute 
      top-4
       lg:top-24 lg:left-96 lg:right-0 w-fit">
        <div className="absolute -inset-0.5 bg-gradient-to-t from-primaryGoldColorTrans to-secondaryGold rounded-full blur-xl"></div>
        <motion.div
          className="
            h-20 w-20
            sm:h-24 sm:w-24
            md:h-30 md:w-30
            flex relative overflow-hidden rounded-full
            "
          initial={{
            opacity: 0,
            rotate: 180,
          }}
          animate={{
            opacity: 1,
            rotate: 0,
          }}
          transition={{
            duration: 2,
          }}
        >
          <Image
            src={indexImage1}
            alt="Profile Photo"
            className="h-full w-full object-cover"
          />
        </motion.div>
      </div>
      <div className="absolute bottom-20 right-4 lg:bottom-20  lg:right-32 w-fit">
        <div className="absolute -inset-0.5 bg-gradient-to-t from-primaryGoldColorTrans to-secondaryGold rounded-full blur-xl"></div>

        <motion.div
          className="
            h-16 w-16
            sm:h-20 sm:w-20
            md:h-30 md:w-30
            flex relative overflow-hidden rounded-full
          
            "
          initial={{
            opacity: 0,
            scale: 0,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 2.5,
          }}
        >
          <Image
            src={indexImage2}
            alt="Profile Photo"
            className="h-full w-full object-cover"
          />
        </motion.div>
      </div>
      <div className="absolute bottom-80 left-4 right-0 lg:bottom-20 lg:left-40 lg:right-0 w-fit">
        <div className="absolute -inset-0.5 bg-gradient-to-t from-darkBlack to-white rounded-full blur-xl"></div>

        <motion.div
          className="
            h-16 w-16
            sm:h-20 sm:w-20
            md:h-30 md:w-30
            flex relative overflow-hidden rounded-full
            "
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 3,
          }}
        >
          <Image
            src={indexImage3}
            alt="Profile Photo"
            className="h-full w-full object-cover"
          />
        </motion.div>
      </div>
    </>
  );
}
