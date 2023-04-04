// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract SocialChain {
    address payable public owner; //Owner is also a maintainer
    uint public totalUsers = 0;
    uint public totalPosts = 0;

    constructor() {
        owner = payable(msg.sender);
        registerUser("owner", "owner", "", "", "owner", 1, true);
    }

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
        postStatus status;
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

    //mapping to get user details from user address
    mapping(address => User) private users;
    //mapping to get user ad    dress from userName
    mapping(string => address) private userAddressFromUserName;
    //mapping to check which username is taken
    mapping(string => bool) private usernames;

    //mapping to get a post by post Id
    mapping(uint => Post) private posts;
    //mapping or list to store all postsId that is done by specific user (user address)
    mapping(address => uint[]) private userPosts;
    //mapping to track who like which post
    mapping(uint => mapping(address => bool)) private postLikers;

    event logRegisterUser(address userAddress, uint userId);
    event logPostCreated(address _author, uint _userId, uint _postId);

    enum accountStatus {
        //NP Stand for = Not present
        NP,
        Active,
        Banned,
        Deactived
    }

    enum postStatus {
        NP,
        Active,
        Banned,
        Deleted
    }

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

    modifier onlyAllowedUser(address userAddress){
        require(users[userAddress].status == accountStatus.Active,"Not a Registered User!");
        _;
    }

    modifier onlyActivePost(uint postId) {
        require(posts[postId].status == postStatus.Active, "Not an active post");
        _;
    }

/*
**************************************USER FUNCTIONS********************************************************************************
*/
    function userNameAvailable(
        string memory _username
    ) public view returns (bool status) {
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

    function getUser(
        address accountAddress
    )
        public
        view
        returns (
            uint id,
            string memory userName,
            string memory name,
            string memory bio,
            uint birthDate,
            bool showUsername,
            string memory imageHash,
            string memory coverHash
        )
    {
        User memory u = users[accountAddress];

        return (
            u.id,
            u.userName,
            u.name,
            u.userBio,
            u.birthDate,
            u.showUserName,
            u.profileImgHash,
            u.profileCoverImgHash
        );
    }
/*
**************************************POST FUNCTIONS***********************************************************
*/
//--------ATTENTIONS:
//-- THIS FUNCTION NEED TO BE MODIFIED SO THAT ONLY ALLOWED USERS CAN POST 
//-- The function should create the post by only the message sender address not by sending the address
    function createPost(
        address payable _accountAddress,
        string memory _postdescription,
        string memory _imghash
    ) public {
        totalPosts = totalPosts + 1;
        uint postId = totalPosts;
        posts[postId] = Post(
            postId,
            _accountAddress,
            _postdescription,
            _imghash,
            block.timestamp,
            0,
            0,
            postStatus.Active
        );
        //each user will have an array of postId that he posted
        userPosts[_accountAddress].push(postId);
        emit logPostCreated(_accountAddress, users[_accountAddress].id, postId);
    }

    function getPostById(uint _postId) public onlyAllowedUser(msg.sender) onlyActivePost(_postId) view returns (Post memory) {
        return posts[_postId];
    }

    function getUserPosts(address _userAddress) public onlyAllowedUser(_userAddress) view returns (Post[] memory postList) {
        uint[] memory postIds = userPosts[_userAddress];
        Post[] memory userPostsTemp = new Post[](postIds.length);
        for (uint i =0 ; i < postIds.length ; i++) {
            userPostsTemp[i] = posts[postIds[i]];
        }
    return userPostsTemp;
    }

}
