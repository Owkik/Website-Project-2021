const mongoose = require('mongoose')
const jwt = require("jsonwebtoken")
const User = mongoose.model("User")
const Post = mongoose.model("Post")

exports.findAcc = (req, res) => {           //FOR LOGIN
    const email = req.body.email.trim();
    const password = req.body.password;

    User.findOne({ email }, (err, user) => {
        // check if email exists
        if (err || !user) {
        //  Scenario 1: FAIL - User doesn't exist
        console.log("user doesn't exist");
        return res.send({ success: false });
        }

        // check if password is correct
        user.comparePassword(password, (err, isMatch) => {
        if (err || !isMatch) {
            // Scenario 2: FAIL - Wrong password
            console.log("wrong password");
            return res.send({ success: false });
        }

        console.log("Successfully logged in");

        // Scenario 3: SUCCESS - time to create a token
        const tokenPayload = {
            _id: user._id
        }

        const token = jwt.sign(tokenPayload, "THIS_IS_A_SECRET_STRING");

        // return the token to the client
        return res.send({ success: true, token, userfname: user.fname , userlname: user.lname, id: user._id});


        })
    })

};

exports.saveAcc = (req, res) => {           //FOR SIGNUP
    const newuser = new User({
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      password: req.body.password,
      friends: [],
      friendrequests: []
    });

    newuser.save((err) => {                 //save the signed up user to the database
      if (err) {return res.send({ success: false }); }
      else { 
        return res.send({ success: true }); }
    });
}

exports.searchAcc = (req, res) => {                         //FOR SEARCH
    const searchKeyword = req.body.search.trim();
    User.find({ $or: [{ fname: searchKeyword }, {lname: searchKeyword }] }, (err, user) => {
        if (err || user.length===0) return res.send({ found: false , success: false, user: null}); 
        else return res.send({user, found: true, success: true});
    })
}

exports.addFriend = async (req,res) => {                          //ADDING FRIENDS

    let goingToAdd = await User.findById({_id: req.body.request})
    let temp = goingToAdd.friends
    let temp1 = goingToAdd.friendrequests
    var check = 0
    temp.map((friends,i) => {                           //checks if the one you're adding is already a friend
        console.log(friends)
        console.log(req.body.curUserId)
        if(friends == req.body.curUserId){
            console.log("already friends")
            check = 1
        }
    })

    temp1.map((friend,i) => {                           //checks if the one you're adding already has a friend request from  you
        console.log(friend)
        console.log(req.body.curUserId)
        if(friend == req.body.curUserId){
            console.log("already sent friendrequest")
            check = 1
        }
    })
    if(check===0){                                      //if none, send friend request
        User.updateOne({ _id: req.body.request}, { $push: { friendrequests: req.body.curUserId }}, function (err, user) {
            console.log("friends request sent")
            return res.send({success: true})
        });
    }
    else res.send({success:false})
}

exports.seeFriendReqs = (req,res) => {                  //DISPLAY FRIEND REQUESTS
    User.findOne({ _id: req.body.userid}).populate(["friendrequests"])
    .then (user => {
        return res.send({foundrequests: user.friendrequests, success: true})
    })
}

exports.acceptFriend = async (req,res) => {            //ACCEPTING FRIEND REQUESTS
    let userid = req.body.userid
    let friendid = req.body.friendid
    let friend = await User.findById(friendid)
    let user = await User.findById(userid)
    let userrequests = user.friendrequests
    let index = userrequests.findIndex((request) => {
        return request.toString() == friend._id.toString();})

    if(index != -1){                        //splice, remove the request from friend request and insert to friends
        user.friendrequests.splice(index, 1)
        user.friends.push(friend._id)
        await user.save()
    }
    friend.friends.push(user._id)               //push your id to the friends of the accepted
    await friend.save()
    return res.send({success: true})
}

exports.rejectFriend = async (req,res) => {             //REJECTING FRIEND REQUESTS
    let userid = req.body.userid
    let friendid = req.body.friendid
    let friend = await User.findById(friendid)
    let user = await User.findById(userid)
    let userrequests = user.friendrequests
    let index = userrequests.findIndex((request) => {
        return request.toString() == friend._id.toString();})
    
    if(index != -1){                        //splice, remove the request from friend request
        user.friendrequests.splice(index, 1)
        await user.save()
        return res.send({success: true})
    }
}

exports.getPost = (req,res) => {                //GETTING POSTS
    const newpost = new Post({
        userid: req.body.userid,
        name: req.body.name,
        timestamp: req.body.timestamp,
        content: req.body.content
      });
    console.log(newpost)
      newpost.save((err) => {                 //save the signed up user to the database
        if (err) {return res.send({ success: false }); }
        else { 
          return res.send({ success: true }); }
      });
}

exports.displayPost = async (req,res) => {              //DISPLAY ALL POSTS (UNCLUDING POSTS OF FRIENDS)
    try{
        const currentUser = await User.findById(req.body.userid);
        const userPosts = await Post.find({ userid: currentUser._id});
        const friendsPosts = await Promise.all(
            currentUser.friends.map((friendId) => {
                return Post.find({ userid: friendId });
            })
        );
        return res.send({ success: true, allPosts: (userPosts.concat(...friendsPosts))});       //concatenate your posts with your friends posts and return
    } catch (err) {
        return res.send({success: false});
    }
}

exports.deletePost = async (req,res) => {               //DELETE POSTS
    let user = req.body.user                            //id of current user
    let poster = req.body.postUserId                    //id of poster
    if(user === poster){                            //checks if the post is of the user's
        console.log("user's post")
        await Post.findByIdAndDelete({_id: req.body.idpost})
        return res.send({success:true})
    }
    else{
        console.log("not user's post")
        return res.send({success: false})
    }
}

exports.editPost = async (req,res) => {             //EDIT POSTS
    let user = req.body.user                        //id of current user
    let poster = req.body.postUserId                //id of poster
    let newContent = req.body.newContent            //new content for update
    if(user === poster){                            //checks if the post is of the user's
        await Post.findByIdAndUpdate({_id: req.body.idpost},{content: newContent})
        return res.send({success: true})
    }
    else {
        return res.send({success: false})
    }
}

exports.displayFriends = async (req,res) => {               //DISPLAY FRIENDS
    let temp = []                                           //will temporarily hold the list of names
    const user = await User.findById({_id: req.body.userid})
    for(let i=0;i<user.friends.length;i++){
        temp[i] = await User.findById({_id: user.friends[i]})
    }
    for(let j=0;j<user.friends.length;j++){
        temp[j] = temp[j].fname+" "+temp[j].lname           //set the names to temp
    }
    return res.send({allFriends: temp, success:true})          //return names as array for mapping
}