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