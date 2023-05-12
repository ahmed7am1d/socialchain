// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

contract SocialChain {
    address payable public owner;
    uint256 public totalUsers = 0;
    uint256 public totalPosts = 0;
    uint256 public totalComments = 0;
    uint256[] private postIds;

    constructor() {
        owner = payable(msg.sender);
        registerUser("owner", "owner", "", "", "owner", 1, true);
    }

    struct User {
        uint256 id;
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
        uint256 postId;
        address author;
        string postDescription;
        string imgHash;
        uint256 timeStamp;
        uint256 likeCount;
        uint256 reportCount;
        postStatus status;
    }

    struct Comment {
        uint256 commentId;
        address author;
        uint256 postId;
        string content;
        uint256 likeCount;
        uint256 reportCount;
        uint256 timeStamp;
        commentStatus status;
    }

    mapping(address => User) private users;
    mapping(string => address) private userAddressFromUserName;
    mapping(string => bool) private usernames;

    mapping(uint256 => Post) private posts;
    mapping(address => uint256[]) private userPosts;
    mapping(uint256 => mapping(address => bool)) private postLikers;

    mapping(uint256 => Comment) private comments;
    mapping(address => uint256[]) userComments;
    mapping(uint256 => uint256[]) private postComments;

    event logRegisterUser(address userAddress, uint256 userId);
    event logPostCreated(address _author, uint256 _userId, uint256 _postId);
    event logCommentCreated(
        address _author,
        uint256 _commentId,
        uint256 _postId,
        uint256 _likeCount,
        uint256 _reportCount,
        uint256 _timeStamp,
        string _content
    );

    enum accountStatus {
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
    enum commentStatus {
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

    modifier onlyActivePost(uint256 postId) {
        require(
            posts[postId].status == postStatus.Active,
            "Not an active post"
        );
        _;
    }

    modifier onlyActiveComment(uint256 commentId) {
        require(
            comments[commentId].status == commentStatus.Active,
            "Not an active comment"
        );
        _;
    }

    //#region Users function

    function userNameAvailable(string memory _username)
        public
        view
        returns (bool status)
    {
        return !usernames[_username];
    }

    function registerUser(
        string memory _username,
        string memory _name,
        string memory _imgHash,
        string memory _coverHash,
        string memory _bio,
        uint256 birthDate,
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
        uint256 id = totalUsers;
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

    function getUser(address accountAddress)
        public
        view
        returns (
            uint256 id,
            string memory userName,
            string memory name,
            string memory bio,
            uint256 birthDate,
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

    //#endregion

    //#region Post function

    function createPost(string memory _postdescription, string memory _imghash)
        public
        onlyAllowedUser(msg.sender)
    {
        totalPosts = totalPosts + 1;
        uint256 postId = totalPosts;
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

    function getPostById(uint256 _postId)
        public
        view
        onlyAllowedUser(msg.sender)
        onlyActivePost(_postId)
        returns (Post memory)
    {
        return posts[_postId];
    }

    function getUserPosts()
        public
        view
        onlyAllowedUser(msg.sender)
        returns (Post[] memory)
    {
        uint256[] memory userPostIds = userPosts[msg.sender];
        Post[] memory userPostsTemp = new Post[](userPostIds.length);
        for (uint256 i = 0; i < userPostIds.length; i++) {
            userPostsTemp[i] = posts[userPostIds[i]];
        }
        return userPostsTemp;
    }

    //Get posts - using of pagination to prevent huge data query and expensive process
    function getPostIds(uint256 _page, uint256 _perPage)
        public
        view
        onlyAllowedUser(msg.sender)
        returns (uint256[] memory)
    {
        uint256 start = (_page - 1) * _perPage;
        uint256 end = start + _perPage;
        if (end > postIds.length) {
            end = postIds.length;
        }
        uint256[] memory result = new uint256[](end - start);
        for (uint256 i = start; i < end; i++) {
            result[i - start] = postIds[i];
        }
        return result;
    }

    function likePost(uint256 _postId)
        public
        onlyAllowedUser(msg.sender)
        onlyActivePost(_postId)
    {
        //[1]- The post should not be liked already by the specfic user (should return false)
        require(!postLikers[_postId][msg.sender]);
        //[2]- increase number of likes for the specfied post:
        posts[_postId].likeCount = posts[_postId].likeCount + 1;
        //[3]- set that the specified user liked the post
        postLikers[_postId][msg.sender] = true;
    }

    function unLikePost(uint256 _postId)
        public
        onlyAllowedUser(msg.sender)
        onlyActivePost(_postId)
    {
        //[1]- Post should be like already by the speicifc user
        require(postLikers[_postId][msg.sender]);
        //[2]- decrase number of likes for the specfied post:
        posts[_postId].likeCount = posts[_postId].likeCount - 1;
        //[3]- set that the specified user liked the post
        postLikers[_postId][msg.sender] = false;
    }

    function isLikedByAddress(uint256 _postId, address _userAddress)
        public
        view
        onlyActivePost(_postId)
        onlyAllowedUser(_userAddress)
        returns (bool)
    {
        return postLikers[_postId][_userAddress];
    }

    //#endregion

    //#region Comment functions

    function createComment(uint256 _postId, string memory _comment)
        public
        onlyAllowedUser(msg.sender)
        onlyActivePost(_postId)
    {
        //[1]- make sure comment is not empty
        bytes memory tempStringValidation = bytes(_comment);
        require(tempStringValidation.length != 0, "Comment can not be empty !");
        //[2]- Id incremental
        totalComments = totalComments + 1;
        uint256 commentId = totalComments;
        //[3]- Adding the post to the mapping
        comments[commentId] = Comment(
            commentId,
            msg.sender,
            _postId,
            _comment,
            0,
            0,
            block.timestamp,
            commentStatus.Active
        );
        //[4]- Adding the comment to the post mapping (Each post can have many comments)
        postComments[_postId].push(commentId);
        //[5]- Log the created comment
        //    event logCommentCreated(address _author,uint _commentId,uint _postId, uint _likeCount, uint _reportCount, uint _timeStamp, string _content);
        emit logCommentCreated(
            msg.sender,
            commentId,
            _postId,
            0,
            0,
            block.timestamp,
            _comment
        );
    }

    function getCommentById(uint256 _commentId)
        public
        view
        onlyAllowedUser(msg.sender)
        onlyActiveComment(_commentId)
        returns (Comment memory)
    {
        return comments[_commentId];
    }

    function getPostComments(
        uint256 _listNumber,
        uint256 _commentPerList,
        uint256 _postId
    )
        public
        view
        onlyAllowedUser(msg.sender)
        onlyActivePost(_postId)
        returns (Comment[] memory)
    {
        uint256 startIndex = (_listNumber - 1) * _commentPerList;
        uint256 endIndex = startIndex + _commentPerList;
        //to avoid IndexOutOfRangeException
        if (endIndex > postComments[_postId].length) {
            endIndex = postComments[_postId].length;
        }
        Comment[] memory commentsResponse = new Comment[](
            endIndex - startIndex
        );
        uint256 tempCommentId = 0;
        for (uint256 i = startIndex; i < endIndex; i++) {
            tempCommentId = postComments[_postId][i];
            commentsResponse[i - startIndex] = comments[tempCommentId];
        }
        return commentsResponse;
    }
    //#endregion
}
