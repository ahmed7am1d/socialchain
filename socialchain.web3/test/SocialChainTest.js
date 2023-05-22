const {expect} = require('chai')
const {ethers} = require('hardhat')

describe('SocialChain', function () {
    let contract
    let owner
    let user1
    let user2

    //[1]- Deploying the contract and intilize the varaiables before each test case
    beforeEach(async function () {
        ;[owner, user1, user2] = await ethers.getSigners() // Get the owner and user addresses
        const SocialChainContract = await ethers.getContractFactory(
            'SocialChain'
        )

        // Deploy the contract using the owner's address
        contract = await SocialChainContract.deploy()
        await contract.deployed()
    })

    //[2]- Test suite for userNameAvailable function
    describe('userNameAvailable', function () {
        it('Should return true if username is available', async function () {
            const username = 'Ahmed07'
            const status = await contract.userNameAvailable(username)
            expect(status).to.be.true
        })

        it('Should return false if the username is taken', async function () {
            //[A]- Connect to the contract using the user's address (so it is different from deployer)
            const connectedContract = contract.connect(user1)

            //[B]- Register new user to the contract
            const username = 'Ahmed07'
            await connectedContract.registerUser(
                username,
                'Ahmed',
                'DASF3420942F',
                'DDF211XC',
                'Software engineering student',
                953108387,
                true
            )
            //[C]- Check the registered user name is not available anymore
            const status = await contract.userNameAvailable(username)
            expect(status).to.be.false
        })
    })

    //[3]- Test suite for registerUser
    describe('registerUser', function () {
        const username = 'Milad07'
        const name = 'Milad'
        const imgHash = 'imgHash'
        const coverHash = 'coverHash'
        const bio = 'Software engineering student'
        const birthDate = 953108387
        const showUserName = true
        it('Should register a new user successfully', async function () {
            //[A]- Connect to the contract using the user's address
            const connectedContract = contract.connect(user2)

            //[B]- Register the new user
            await connectedContract.registerUser(
                username,
                name,
                imgHash,
                coverHash,
                bio,
                birthDate,
                showUserName
            )

            //[C]- Verify the user registration
            const registeredUser = await contract.getUser(user2.address)
            const registeredUserObject = Object.assign({}, registeredUser)
            expect(parseInt(registeredUserObject.id._hex, 16)).to.equal(2)
            expect(registeredUserObject.userName).to.equal(username)
            expect(registeredUserObject.name).to.equal(name)
            expect(registeredUserObject.bio).to.equal(bio)
            expect(parseInt(registeredUserObject.birthDate._hex, 16)).to.equal(
                birthDate
            )
            expect(registeredUserObject.showUsername).to.equal(showUserName)
            expect(registeredUserObject.imageHash).to.equal(imgHash)
            expect(registeredUserObject.coverHash).to.equal(coverHash)
        })
        it('Should shows that user name is reserved after successful registeration', async function () {
            //[D]- Verify the username is reserved
            const isUsernameTaken = await contract.userNameAvailable(username)
            expect(isUsernameTaken).to.be.true
        })
    })

    //[4]- Test suite for getUser function
    describe('getUser', function () {
        it('Should return the correct user information', async function () {
            const connectedContract = contract.connect(user2)
            const username = 'Milad07'
            const name = 'Milad'
            const imgHash = 'imgHash'
            const coverHash = 'coverHash'
            const bio = 'Software engineering student'
            const birthDate = 953108387
            const showUserName = true

            //[A]- Register the user
            await connectedContract.registerUser(
                username,
                name,
                imgHash,
                coverHash,
                bio,
                birthDate,
                showUserName
            )

            //[B]- Get the user information
            const registeredUser = await contract.getUser(user2.address)
            const registeredUserObject = Object.assign({}, registeredUser)
            expect(parseInt(registeredUserObject.id._hex, 16)).to.equal(2)
            expect(registeredUserObject.userName).to.equal(username)
            expect(registeredUserObject.name).to.equal(name)
            expect(registeredUserObject.bio).to.equal(bio)
            expect(parseInt(registeredUserObject.birthDate._hex, 16)).to.equal(
                birthDate
            )
            expect(registeredUserObject.showUsername).to.equal(showUserName)
            expect(registeredUserObject.imageHash).to.equal(imgHash)
            expect(registeredUserObject.coverHash).to.equal(coverHash)
        })
    })

    //[5]- Test suite for createPost function
    describe('createPost', function () {
        it("Should create a new post and append it to the user's array of posts", async function () {
            //[A]- Creation of post info
            const postDescription = 'This is a new post'
            const imgHash = 'postImgHash'

            //[B]- Call create post function
            await contract.createPost(postDescription, imgHash)

            //[C]- Get the post information
            const postId = 1
            const post = await contract.posts(postId)
            const postObject = Object.assign({}, post)

            expect(parseInt(postObject.postId._hex, 16)).to.equal(postId)
            expect(post.author).to.equal(owner.address)
            expect(post.postDescription).to.equal(postDescription)
            expect(post.imgHash).to.equal(imgHash)
            expect(parseInt(post.timeStamp._hex, 16)).to.not.equal(0)
            expect(parseInt(post.likeCount._hex, 16)).to.equal(0)
            expect(parseInt(post.reportCount._hex, 16)).to.equal(0)
            expect(post.status, 16).to.equal(1)
        })
    })

    //[6]- Test suite for getPostById function
    describe('getPostById', function () {
        it('Should return the correct post by ID', async function () {
            const postDescription = 'My first post'
            const imgHash = 'imgHash'

            //[A]- Create a new post
            await contract.createPost(postDescription, imgHash)

            //[B]- Retrieve the post using getPostById
            const retrievedPost = await contract.getPostById(
                await contract.totalPosts()
            )

            //[C]- Verify the retrieved post data
            expect(parseInt(retrievedPost.postId._hex, 16)).to.equal(
                await contract.totalPosts()
            )
            expect(retrievedPost.postDescription).to.equal(postDescription)
            expect(retrievedPost.imgHash).to.equal(imgHash)
        })

        it('Should throw an error if the post is not active', async function () {
            const nonExistetPostId = 12345

            //[A]- Call getPostById with a non exists post ID
            await expect(
                contract.getPostById(nonExistetPostId)
            ).to.be.revertedWith('Not an active post')
        })
    })

    //[7]- Test suite for getUserPosts function
    describe('getUserPosts', function () {
        it('Should returns the posts created by the user', async function () {
            const post1Description = 'My first post - Hello World'
            const post1ImgHash = 'imgHash1'
            const post2Description = 'My new wallpaper'
            const post2ImgHash = 'imgHash2'
            //[A]- Create two posts by the user
            await contract.createPost(post1Description, post1ImgHash)
            await contract.createPost(post2Description, post2ImgHash)
            //[B]- Retrieve the user posts by calling getUserPosts
            const retrievedPosts = await contract.getUserPosts()

            //[C]- Verify the retrieved posts
            expect(retrievedPosts.length).to.equal(2)

            //[D]- Validate the properties of the first post
            expect(parseInt(retrievedPosts[0].postId._hex, 16)).to.equal(1)
            expect(retrievedPosts[0].postDescription).to.equal(post1Description)
            expect(retrievedPosts[0].imgHash).to.equal(post1ImgHash)

            //[E]- Validate the properties of the second post
            expect(parseInt(retrievedPosts[1].postId._hex, 16)).to.equal(2)
            expect(retrievedPosts[1].postDescription).to.equal(post2Description)
            expect(retrievedPosts[1].imgHash).to.equal(post2ImgHash)
        })

        it('Should return that the user created the post is the author of the posts', async function () {
            const post1Description = 'My first post - Hello World'
            const post1ImgHash = 'imgHash1'
            const post2Description = 'My new wallpaper'
            const post2ImgHash = 'imgHash2'
            //[A]- Create two posts by the user
            await contract.createPost(post1Description, post1ImgHash)
            await contract.createPost(post2Description, post2ImgHash)
            //[B]- Retrieve the user posts by calling getUserPosts
            const retrievedPosts = await contract.getUserPosts()
            //[C]- Verify the authorship of the posts
            expect(retrievedPosts[0].author).to.equal(owner.address)
            expect(retrievedPosts[1].author).to.equal(owner.address)
        })
    })
    //[8]- Test suite for getPostIds function (FeedPost - pagination)
    describe('getPostIds', function () {
        it('Should return the correct post IDs based on pagination', async function () {
            const postOneDescription = 'My first post'
            const postOneImgHash = 'imgHashOne'
            const postTwoDescription = 'My second post'
            const postTwoImgHash = 'imgHashTwo'
            const postThreeDescription = 'My third post'
            const postThreeImgHash = 'imgHashThree'

            //[A]- Create three posts
            await contract.createPost(postOneDescription, postOneImgHash)
            await contract.createPost(postTwoDescription, postTwoImgHash)
            await contract.createPost(postThreeDescription, postThreeImgHash)

            //[B]- Retrieve the post IDs using getPostIds with pagination
            const page = 1
            const perPage = 3
            const retrievedPostIds = await contract.getPostIds(page, perPage)

            //[C]- Verify the retrieved post IDs
            expect(retrievedPostIds.length).to.equal(perPage)
            expect(parseInt(retrievedPostIds[0]._hex, 16)).to.equal(1) // ID of the first post
            expect(parseInt(retrievedPostIds[1]._hex, 16)).to.equal(2) // ID of the second post
            expect(parseInt(retrievedPostIds[2]._hex, 16)).to.equal(3) // ID of the third post
        })
    })
    //[9]- Test suite for likePost function
    describe('likePost', function () {
        it('Should like a post successfully', async function () {
            //[A]- Creating of new post
            const postDescription = 'My new post'
            const imgHash = 'imgHash'
            await contract.createPost(postDescription, imgHash)
            //[B]- Liking of a post
            await contract.likePost(await contract.totalPosts())
            //[C]- Retrieve the post and check the like count
            const retrievedPost = await contract.getPostById(
                await contract.totalPosts()
            )
            expect(parseInt(retrievedPost.likeCount._hex, 16)).to.equal(1)

            //[D]- Making sure number the user actually is a liker of the post
            const isPostLikedByUser = await contract.postLikers(
                await contract.totalPosts(),
                owner.address
            )
            expect(isPostLikedByUser).to.be.true
        })

        it('Should revert if the post is not active', async function () {
            const nonExistetPostId = 12345

            //[A]- Call likePost with a non-existent post ID
            await expect(
                contract.likePost(nonExistetPostId)
            ).to.be.revertedWith('Not an active post')
        })

        it('Should revert if the post is already liked by the user', async function () {
            const postDescription = 'My first post'
            const imgHash = 'imgHash'

            //[A]- Create a new post
            await contract.createPost(postDescription, imgHash)

            //[B]- Like the post
            const postId = await contract.totalPosts()
            await contract.likePost(postId)

            //[C]- Attempt to like the post again
            await expect(contract.likePost(postId)).to.be.revertedWith(
                'Post already liked by the user'
            )
        })
    })

    //[10]- Test suite for unLikePost function
    describe('unLikePost', function () {
        it('Should unlike a post successfully', async function () {
            //[A]- Creating a new post
            const postDescription = 'My new post'
            const imgHash = 'imgHash'
            await contract.createPost(postDescription, imgHash)

            //[B]- Liking the post
            const postId = await contract.totalPosts()
            await contract.likePost(postId)

            //[C]- Unliking the post
            await contract.unLikePost(postId)

            //[D]- Retrieve the post and check the like count
            const retrievedPost = await contract.getPostById(postId)
            expect(parseInt(retrievedPost.likeCount._hex, 16)).to.equal(0)

            //[E]- Making sure the user is no longer a liker of the post
            const isPostLikedByUser = await contract.postLikers(
                postId,
                owner.address
            )
            expect(isPostLikedByUser).to.be.false
        })

        it('Should revert if the post is not active', async function () {
            const nonExistetPostId = 12345

            //[A]- Call unLikePost with a non-existent post ID
            await expect(
                contract.unLikePost(nonExistetPostId)
            ).to.be.revertedWith('Not an active post')
        })

        it('Should revert if the post is not liked by the user', async function () {
            const postDescription = 'My first post'
            const imgHash = 'imgHash'

            //[A]- Create a new post
            await contract.createPost(postDescription, imgHash)

            //[B]- Attempt to unlike the post without liking it first
            const postId = await contract.totalPosts()
            await expect(contract.unLikePost(postId)).to.be.revertedWith(
                'Post not liked by the user'
            )
        })
    })

    //[11]- Test suite for isLikedByAddress function
    describe('isLikedByAddress', function () {
        it('Should return true if the post is liked by the user', async function () {
            //[A]- Creating a new post
            const postDescription = 'My new post'
            const imgHash = 'imgHash'
            await contract.createPost(postDescription, imgHash)

            //[B]- Liking the post
            const postId = await contract.totalPosts()
            await contract.likePost(postId)

            //[C]- Checking if the post is liked by the user
            const isLiked = await contract.isLikedByAddress(
                postId,
                owner.address
            )
            expect(isLiked).to.be.true
        })

        it('Should return false if the post is not liked by the user', async function () {
            //[A]- Creating a new post
            const postDescription = 'My new post'
            const imgHash = 'imgHash'
            await contract.createPost(postDescription, imgHash)

            //[B]- Checking if the post is liked by the user (who has not liked it)
            const postId = await contract.totalPosts()
            const isLiked = await contract.isLikedByAddress(
                postId,
                owner.address
            )
            expect(isLiked).to.be.false
        })
    })

    //[12]- Test suite for createComment and getCommentById functions
    describe('createComment and getCommentById', function () {
        it('Should create a comment and retrieve it by ID', async function () {
            //[A]- Creating a new post
            const postDescription = 'My new post'
            const imgHash = 'imgHash'
            await contract.createPost(postDescription, imgHash)

            //[B]- Creating a comment for the post
            const postId = await contract.totalPosts()
            const comment = 'This is my comment'
            await contract.createComment(postId, comment)

            //[C]- Retrieving the comment by ID
            const commentId = await contract.totalComments()
            const retrievedComment = await contract.getCommentById(commentId)

            //[D]- Verifying the retrieved comment
            expect(retrievedComment.content).to.equal(comment)
            expect(retrievedComment.postId).to.equal(postId)
        })

        it('Should handle retrieving a non-existent comment', async function () {
            //[A]- Creating a new post
            const postDescription = 'My new post'
            const imgHash = 'imgHash'
            await contract.createPost(postDescription, imgHash)

            //[B]- Attempting to retrieve a non-existent comment
            const nonExistentCommentId = 12345
            await expect(
                contract.getCommentById(nonExistentCommentId)
            ).to.be.revertedWith('Not an active comment')
        })
    })

    //[13]- Test suite for getPostComments
    describe('getPostComments', function () {
        it('Should retrieve comments for a post based on pagination', async function () {
            //[A]- Creating a new post
            const postDescription = 'My new post'
            const imgHash = 'imgHash'
            await contract.createPost(postDescription, imgHash)

            //[B]- Creating comments for the post
            const postId = await contract.totalPosts()
            const comment1 = 'This is comment 1'
            const comment2 = 'This is comment 2'
            await contract.createComment(postId, comment1)
            await contract.createComment(postId, comment2)

            //[C]- Retrieving comments for the post
            const listNumber = 1
            const commentPerList = 2
            const retrievedComments = await contract.getPostComments(
                listNumber,
                commentPerList,
                postId
            )

            //[D]- Verifying the retrieved comments
            expect(retrievedComments.length).to.equal(2)
            expect(retrievedComments[0].content).to.equal(comment1)
            expect(retrievedComments[1].content).to.equal(comment2)
        })

        it('Should handle retrieving comments for a non-existent post', async function () {
            //[A]- Creating a new post
            const postDescription = 'My new post'
            const imgHash = 'imgHash'
            await contract.createPost(postDescription, imgHash)

            //[B]- Trying to retrieve comments for a non-existent post
            const nonExistentPostId = 12345
            const listNumber = 1
            const commentPerList = 2
            await expect(
                contract.getPostComments(
                    listNumber,
                    commentPerList,
                    nonExistentPostId
                )
            ).to.be.revertedWith('Not an active post')
        })
    })
})
