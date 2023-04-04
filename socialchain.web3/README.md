# Social chain contract:

## Everything about the User:

#### 1- User structs:
```
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
```

#### 2- User mapping/lists:

  ##### A- Mapping to get single User object from address:
```
    mapping(address => User) private users;
```
 ##### B- Mapping to get user address from user name:
```
    mapping(string => address) private userAddressFromUserName;
```
 ##### C- Mapping to get (username => bool) to check all the reserved user names:
```
    mapping(string => bool) private usernames;
```
#### 3- User functions:
  ##### A- Function to check if a user name available or not:
 ```
  function userNameAvailable(string memory _username) public view returns(bool status) {
        return !usernames[_username];
    }
 ```
  ##### B- Function to get user object by address:
 ```
  function getUser(address accountAddress)
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
 ```
  ##### C- Function to register the user to the blockchain:
 > Note: All mapping of user when registering should be filled.

 > Note: Function will not be executed if user is already registered (modifier).

 > Note: Function will not be executed if user name is taken (modifier).
 ```
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
 ```
 #### 4- User events
  ##### A- Event to emit when a user is registered successfully
 ```
event logRegisterUser(address userAddress, uint userId);
 ```
 <hr/>

 ## Everything about Posts:

 #### 1- Post struct:
 ```
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
 ```
 #### 2- Post mapping/lists

  ##### A- Mapping to get/store a post by postId
 ```
     mapping (uint => Post) private posts;
 ```
  ##### B- Mapping to retrieve all posts(postId) that is done by a user
 ```
  mapping (uint => Post) private posts;
 ```
  ##### C- Mapping to track who like which post 
 > providing Id of post => retrieve all addresses(list) of users who liked the post
#### 3- Post functions:
  ##### A- Function to create new post
 ><span style="color:red">Only active (registered user) is able to add new post</span>.
 ```
 function createPost(address payable _accountAddress,string memory _postdescription,string memory _imghash) public
    {
        totalPosts = totalPosts + 1;
        uint postId = totalPosts;
        posts[postId] = Post(postId,_accountAddress,_postdescription,_imghash,block.timestamp,0,0);
        //each user will have an array of postId that he posted
        userPosts[_accountAddress].push(postId);
        emit logPostCreated(_accountAddress,users[_accountAddress].id,postId);
    }
 ```
 ##### B- Function to get post by postId
 <span style="color:blue">Function modifiers and conditions: </span>
><span style="color:red">Only active (registered user) is able to retrieve a post from the contract</span>.

><span style="color:red">Only active post can be retrieved from the contract</span>.
  ```
 function getPostById(uint _postId) public onlyAllowedUser(msg.sender) onlyActivePost(_postId) view returns (Post memory) {
        return posts[_postId];
    }
  ```
  ##### C- Function to get a list o posts that is posted by a user
   ><span style="color:red">Only active (registered user) is able to retrieve a post from the contract</span>.
 ```
function getUserPosts(address _userAddress) public onlyAllowedUser(_userAddress) view returns (Post[] memory postList) {
        uint[] memory postIds = userPosts[_userAddress];
        Post[] memory userPosts = new Post[](postIds.length);
        for (uint i =0 ; i < postIds.length ; i++) {
            userPosts[i] = posts[postIds[i]];
        }
    return userPosts;
    }
 ```

#### 4- Post events
 A- event to be emitted when a post is created
```
event logPostCreated(address _author, uint _userId, uint _postId);
```
<hr/>
### Contract Modifiers and limitations:
#### 1- <span style="color:red">checkUserNotRegisteredByAddress</span>  modifier
- Checks that the user is registered or not in the contract by the <strong> user address and using AccountStatus enum
```
 modifier checkUserNotRegisteredByAddress(address userAddress) {
        require(
            users[userAddress].status == accountStatus.NP,
            "User already registered"
        );
        _;
    }
```
#### 2- <span style="color:red">checkUserNameTaken </span>  modifier:
- Checks that the username is not taken by any one
```
 modifier checkUserNameTaken(string memory userName) {
        require(!usernames[userName], "Username already taken");
        _;
    }
```

#### 3- <span style="color:red">onlyAllowedUser </span>  modifier:
- This is a general use modifier that will let us checks if user is authenticated or registered to the  contract
- It makes sure the following;
    - The user account is not (banned, deleted).
    - The user is registered in the contract storage.
```
modifier onlyAllowedUser(address userAddress){
        require(users[userAddress].status == accountStatus.Active,"Not a Registered User!");
        _;
    }
```

#### 4- <span style="color:red">onlyActivePost </span>  modifier:
- This modifier will make sure that the post is not (banned, deleted)
- Will also through *not an active post* </Italic> if post does not exists
```

modifier onlyActivePost(uint postId) {
        require(posts[postId].status == postStatus.Active, "Not an active post");
        _;
    }
```
<hr>
### Contract Enums: 
##### 1- <span style="color:green; font-weight:bold">accountStatus</span> enum: 
- NP, stand for not present
```
  enum accountStatus {
        NP,
        Active,
        Banned,
        Deactived
    }
```

##### 2- <span style="color:green; font-weight:bold">postStatus</span> enum: 
- NP, stand for not present
```
  enum postStatus {
        NP,
        Active,
        Banned,
        Deactived
    }
```
<hr>

### Contract constructor and variables:

##### 1- Contract <span style="color:green; font-weight:bold">variables</span>: 
- To store the owner of the contract, this varaible will be filled whem the contract is called.

```
    address payable public owner; //Owner is also a maintainer
```
- This state is used as number of total users, <span style="color:red; font-weight:bold">but also as Id auto incremental generator for the users</span>
```
    uint public totalUsers = 0;
```
- This state is used as number of total posts, <span style="color:red; font-weight:bold">but also as Id auto incremental generator for the posts</span>
```
    uint public totalPosts = 0;
```


##### 2- Contract constructor: 
- Whenever the contract is deployed an owner will be the one who deployed the contract
- We will register the owner to the contract storage as user
```
constructor() {
        owner = payable(msg.sender);
        registerUser("owner", "owner", "", "", "owner", 1, true);
    }
```


<hr>