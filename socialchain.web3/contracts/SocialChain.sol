// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract SocialChain {
    address payable public owner; //Owner is also a maintainer
    uint public totalUsers = 0;
    uint public totalPosts = 0;
    uint[] private postIds;

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
        address author;
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

    modifier onlyAllowedUser(address userAddress) {
        require(
            users[userAddress].status == accountStatus.Active,
            "Not a Registered User!"
        );
        _;
    }

    modifier onlyActivePost(uint postId) {
        require(
            posts[postId].status == postStatus.Active,
            "Not an active post"
        );
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
    ) public onlyAllowedUser(msg.sender) {
        totalPosts = totalPosts + 1;
        uint postId = totalPosts;
        posts[postId] = Post(
            postId,
            msg.sender,
            _postdescription,
            _imghash,
            block.timestamp,
            0,
            0,
            postStatus.Active
        );
        //each user will have an array of postId that he posted
        userPosts[msg.sender].push(postId);
        postIds.push(postId);
        emit logPostCreated(msg.sender, users[msg.sender].id, postId);
    }

    function getPostById(
        uint _postId
    )
        public
        view
        onlyAllowedUser(msg.sender)
        onlyActivePost(_postId)
        returns (Post memory)
    {
        return posts[_postId];
    }

    function getUserPosts(
        address _userAddress
    ) public view onlyAllowedUser(_userAddress) returns (Post[] memory) {
        uint[] memory userPostIds = userPosts[_userAddress];
        Post[] memory userPostsTemp = new Post[](userPostIds.length);
        for (uint i = 0; i < userPostIds.length; i++) {
            userPostsTemp[i] = posts[userPostIds[i]];
        }
        return userPostsTemp;
    }

    //Get posts - using of pagination to prevent huge data query and expensive process
    function getPostIds(
        uint _page,
        uint _perPage
    ) public view onlyAllowedUser(msg.sender) returns (uint[] memory) {
        uint start = (_page - 1) * _perPage;
        uint end = start + _perPage;
        if (end > postIds.length) {
            end = postIds.length;
        }
        uint[] memory result = new uint[](end - start);
        for(uint i = start ; i < end; i++) {
            result[i-start] = postIds[i];
        }
        return result;
    }

    function likePost(uint _postId) public onlyAllowedUser(msg.sender) onlyActivePost(_postId) {
        //[1]- The post should not be liked already by the specfic user (should return false)
        require(!postLikers[_postId][msg.sender]);
        //[2]- increase number of likes for the specfied post:
        posts[_postId].likeCount = posts[_postId].likeCount + 1;
        //[3]- set that the specified user liked the post
        postLikers[_postId][msg.sender] = true;
    }

    function isLikedByAddress(uint _postId, address _userAddress) public view returns (bool) {
        return postLikers[_postId][_userAddress];
    }
}
