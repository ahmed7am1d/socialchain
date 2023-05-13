# SocialChain - A Decentralized Social Network
**SocialChain** is a decentralized social media platform,
that uses the power of blockchain to eliminate the idea of central authority,
 and the fact that a central authority owns the users' data.
# Table of content
- [SocialChain - A Decentralized Social Network](#socialchain---a-decentralized-social-network)
- [Table of content](#table-of-content)
- [1. Project's description](#1-projects-description)
  - [1.1 Architecture of the application](#11-architecture-of-the-application)
    - [The application contains mainly 3 sides that results in a full stack application:](#the-application-contains-mainly-3-sides-that-results-in-a-full-stack-application)
    - [The application contains the following layers:](#the-application-contains-the-following-layers)
  - [1.2 Application's technologies](#12-applications-technologies)
  - [1.3 Application authentication and authorization](#13-application-authentication-and-authorization)
    - [1.3.1 Generation of the JWT token](#131-generation-of-the-jwt-token)
    - [1.3.2 Application route protection](#132-application-route-protection)
- [2 How to run the application](#2-how-to-run-the-application)
  - [2.1 Required SDKs and libraries](#21-required-sdks-and-libraries)
  - [2.2 Steps to run the application](#22-steps-to-run-the-application)
- [3 Application's screen shots](#3-applications-screen-shots)




# 1. Project's description
The project utilize the blockchain technology to build the platform in a decentralized manner.
Specifically the core of the application uses the power of **smart contracts**.
The main aim of this project is to show how blockchain technology ensure that users owns their data,
and that no one can control their data.
Below I will explain for you the architecture of the application, used technologies, what makes this project unique.


## 1.1 Architecture of the application

The application uses the **clean architecture** where the client-side, business logic, infrastructure, is separated from each
other providing scalable application in a clean form.
The whole idea of using clean architecture is that client side and infrastructure can be used in any different technology.

<image src="/docs/Images/SocialChainArchitecture.png" width="600px"></br>

### The application contains mainly 3 sides that results in a full stack application:

- **Back-end:** ASP.NET core API and MS SQL Database.
  - **Purpose:** Used for generating JWT (refresh access token) for users to authenticate them to the front-end and API end points.
- **Front-end:** Is the user interface using NextJS.
- **Web3:** Is where the smart contract and communicating with blockchain is done.

### The application contains the following layers:

- **socialchain.api** => ASP.NET core API that communicates with the MS SQL Server database
- **socialchain.application** => Business logic of the C# (back-end)
- **socialchain.client** => The front-end of the application (NextJS)
- **socialchain.contracts** => The data transfer object between the API and the front-end
- **socialchain.domain** => The main entities of the back-end (e.g User)
- **socialchain.infrastructure** => The database configurations, communication with database
- **socialchain.web3** => The blockchain layer, where the smart contract sit and hardhat configuration


## 1.2 Application's technologies
- **Front-end techs**: (NextJS, TailwindCSS, AntDesign, Ethers.js)
- **Back-end techs**: (C#, ASP.NET Core API, EntityFrameWork Core, Nethereum library)
- **Web3 techs**: (HardHat, Solidity, IPFS distrusted file storage)
- **Database**: (MS SQL Server)

## 1.3 Application authentication and authorization

### 1.3.1 Generation of the JWT token

The application uses JWT (refresh,access) tokens as a way to authenticate users to the application.
The token are stored as HTTP only cookies, to prevent client-side attackers from getting the cookies.
The cookies are generated for the user after he signs a message through the digital wallet and prove in
the back-end that the message actually signed by the same user, then he is allowed to obtain a token.

### 1.3.2 Application route protection

The routes of the front-end application are protected using the NextJS middleware, where each request 
made in the client side the JWT validation runs, if JWT token is not valid users will be forwarded to login page.

# 2 How to run the application
To run the application I will describe the process step by step:

## 2.1 Required SDKs and libraries

The following are required to run the application without problems:
- **For the back-end:**
  - .net sdk and run time (.NET6 or .NET7) (https://dotnet.microsoft.com/en-us/download)
  - .net tools for using terminal and ef (https://dotnet.microsoft.com/en-us/download)
  - Your own local MS SQL Server database for that you need to install two things:
    - SQL Server management studio: (https://learn.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-ver16)
    - SQL Server: (https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
- **For the front-end:**
  - npm package manager and npm run time sdk (https://nodejs.org/en/download) (https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- **For the blockchain and web3 layer:**
  - Ganache GUI can be downloaded here (https://trufflesuite.com/ganache/)
- **For the browser:**
  - MetaMask should be installed as extension in your browser.
- **For the IDEs:**
  - It is better to have both (VS code and Visual studio installed)
- **IPFS registration (to upload users files (Photos, Images) in decentralized way)**
  - Register to (https://app.infura.io/register)
  - After registration click on "Create new API Key"
  - Choose Network as IPFS and name your project as you like.
  - You will see "API key (as your Project ID) and API KEY Secret (as your IPFS API key)" these will be used later.

## 2.2 Steps to run the application
1. Clone the repository from the main branch.
2. Assuming you have Visual studio installed.
3. Open "socialchain.solution.sln"
4. Right click on "socialchain.api" and click "Manage user secrets".
   1. Put your own local ms sql server db connection string.
   2. put random secret for JWT.
   3. Put 60 minutes as expire time of JWT token.
5. In visual studio click on "View" in the top task bar => "Terminal"
   1. Run the following command in the terminal to create migration (code first approach):
    ``dotnet ef migrations add "1stSocialChainMigration" -p .\socialchain.infrastructure\ -s .\socialchain.api\``
   2. From the terminal navigate to "socialchain.api" ``cd .\socialchain.api\ ``
   3. Run the following command to update your database (make sure you are in the api project as step before): 
    ``dotnet ef database update``
6. Run the visual studio application (To make the api running).
> Note: Make sure to grab the address of the API that is running and put it in ``socialchain.client/constants/api/SocialChainApiConstants.js``
7. Open Visual studio code and navigate to folder "socialchain.api" and run the following (to install all npm packages): 
  ``npm i``
8. In the root of "socialchain.api" create a file with the name ".env.local" and insert the following with your own values:
``NEXT_PUBLIC_JWT_SECRET_KEY= {secret key you used in the C# part, it should be the same}``
``NEXT_PUBLIC_IPFS_PROJECT_ID={API key from IPFS}``
``NEXT_PUBLIC_IPFS_API_KEY={API KEY Secret from IPFS}``
9. Run Ganache GUI application and then in vs code Navigate to "socialchain.web3" ``cd .\socialchain.web3\ ``
   1.  run ``npm i``
   2.  run in terminal the following to deploy the contract to your Ganache local blockchain: 
    ``npx hardhat run --network localGanache scripts/deploy.js``
   3. Grab the deployed contract address and put it inside the file ``socialchain.client/constants/blockchain/SocialChainContractConstants.js``
10. Finally forward to "socialchain.client" and run the following:
    ``npm run dev``
ENJOY THE APP :)

# 3 Application's screen shots
- Index page: </br>
<image src="/docs/Images/IndexPage.png" width="600px"></br>

- Login/Register page: </br>
<image src="/docs/Images/LoginRegisterPage.png" width="600px"></br>

- User profile page: </br>
<image src="/docs/Images/UserProfilePage.png" width="600px"></br>

- Feed page: </br>
<image src="/docs/Images/FeedPage.png" width="600px"></br>