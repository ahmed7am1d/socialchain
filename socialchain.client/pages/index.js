import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import { Detective, FolderSimpleLock, ShieldCheck } from "phosphor-react";
import Image from "next/image";
import socialchainLogo from "../assets/logos/socialchain.png";
export default function IndexPage() {
  return (
    <>
      <Head>
        <title>Social chain</title>
        <meta name="description" content="Social chain" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/blockchain.ico" />
      </Head>
      <div className="absolute w-screen h-[300px] bg-primaryPinkColorTrans top-60 -z-1 -skew-y-12 transform-gpu origin-top bottom-0"></div>

      <div
        className=" h-screen 
        max-w-7xl m-auto p-5  relative"
      >
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 6,
          }}
        >
          <Image
            src={socialchainLogo}
            width="250"
            height="250"
            alt="Website Logo"
            className=" absolute -top-20 bottom-0 left-0 right-0 mb-4"
          />
        </motion.div>
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
            <h1 className="text-3xl text-primaryPinkColor first-letter:bg-white first-letter:px-[2px] font-bold">
              Social chain
            </h1>
            <p className="p-1 text-md xl:mr-36">
              Social chain is a{" "}
              <span className=" text-primaryPinkColor font-semibold font-serif">
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
              <button className="bg-primaryPinkColor p-3 rounded-lg shadow-lg shadow-primaryPinkColor/50 hover:bg-primaryPinkColor/50 duration-500">
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
                <ShieldCheck className="text-darkBlue" size={37} weight="fill" />
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
                <Detective className="text-darkBlue" size={37} weight="fill" />
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
                <FolderSimpleLock className="text-darkBlue" size={37} weight="fill" />
                <p className="w-20 font-semibold">Immutable</p>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
