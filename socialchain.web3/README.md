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

 A- Mapping to get single User object from address:
```
    mapping(address => User) private users;
```
B- Mapping to get user address from user name:
```
    mapping(string => address) private userAddressFromUserName;
```
C- Mapping to get (username => bool) to check all the reserved user names:
```
    mapping(string => bool) private usernames;
```
#### 3- User functions:
 A- Function to check if a user name available or not:
 ```
  function userNameAvailable(string memory _username) public view returns(bool status) {
        return !usernames[_username];
    }
 ```
 B- Function to register the user to the blockchain 
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