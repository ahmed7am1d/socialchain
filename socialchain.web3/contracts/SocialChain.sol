// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract SocialChain {
    //#region Varaibles/states
    address payable public owner; //Owner is also a maintainer
    uint public totalUsers = 0;

    //#endregion

    //#region  Contract constructor
    constructor() {
        owner = payable(msg.sender);
        registerUser("owner", "owner", "", "", "owner", 1, true);
    }
    //#endregion

    //#region Structs
    struct User {
        uint id;
        address ethAddress;
        string userName;
        string name;
        string userBio;
        uint256 birthDate;
        bool showUserName;
        string profileImgHash;
        string profileCoverImgHash;
        accountStatus status;
    }

    struct Post {
        uint postId;
        address payable author;
        string postDescription;
        //ipfs location for the image
        string imgHash;
        uint timeStamp;
        uint likeCount;
        uint reportCount;
    }

    struct Comment {
        uint commentId;
        address author;
        uint postId;
        string content;
        uint likeCount;
        uint reportCount;
        uint timeStamp;
    }
    //#endregion

    //#region Mapping/HashMaps

    //mapping to get user details from user address
    mapping(address => User) private users;
    //mapping to get user address from userName
    mapping(string => address) private userAddressFromUserName;
    //mapping to check which username is taken
    mapping(string => bool) private usernames;

    //#endregion

    //#region Event to be emitted
    event logRegisterUser(address userAddress, uint userId);

    //#endregion

    //#region enums
    enum accountStatus {
        NP,
        Active,
        Banned,
        Deactived
    }
    //#endregion

    //#region Modifiers/checkers
    modifier checkUserNotRegisteredByAddress(address userAddress) {
        require(
            users[userAddress].status == accountStatus.NP,
            "User already registered"
        );
        _;
    }
    modifier checkUserNameTaken(string memory userName) {
        require(!usernames[userName], "Username already taken");
        _;
    }

    //#endregion

    //#region Functions
    function greetings() public pure  returns (string memory) {
        return "Welcome to the Social chain platform :)";
    }

    function userNameAvailable(string memory _username) public view returns(bool status) {
        return !usernames[_username];
    }

    function registerUser(
        string memory _username,
        string memory _name,
        string memory _imgHash,
        string memory _coverHash,
        string memory _bio,
        uint birthDate,
        bool showUserName
    )
        public
        checkUserNotRegisteredByAddress(msg.sender)
        checkUserNameTaken(_username)
    {
        //Attack prevented
        //[1]- reserve the user name
        usernames[_username] = true;
        //[2]- increase counter of total users
        totalUsers = totalUsers + 1;
        //[3]- set id of new user to the counter
        uint id = totalUsers;
        //[4]- add User object to our mapping of (address => user) for the specific registerd user
        users[msg.sender] = User(
            id,
            msg.sender,
            _username,
            _name,
            _bio,
            birthDate,
            showUserName,
            _imgHash,
            _coverHash,
            accountStatus.Active
        );
        //[5]- set add user address [calling of the function] to our mapping of (username => address) to get user address by username
        userAddressFromUserName[_username] = msg.sender;
        //[6]- emit the event
        emit logRegisterUser(msg.sender, id);
    }
    //#endregion
}
