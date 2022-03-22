const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Post");
const Comment = require("./models/Comment");
const bcrypt = require("bcrypt");
const cors = require("cors");
const path = require("path");
const multer = require("multer");

dotenv.config();

//MIDDLEWARE
app.use(express.json()); //if you want to read json file from req
app.use(morgan("common"));
app.use(
    cors({
        origin: "http://localhost:3000"  //allow the request come from port 3000
    })
)

//GET IMAGE FROM PUBLIC
app.use("/images", express.static(path.join(__dirname, "public/images")));

mongoose.connect(
    process.env.MONGO_URL,
    {useNewUrlParser: true, useUnifiedTopology: true},
    ()=>{
        console.log("Connected to MongoDB");
    }
);

//UPLOAD IMAGE
const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, "public/images");
    },
    filename: (req, file, cb)=>{
        console.log(req.body);
        console.log(file)
        cb(null, req.body.name);
    }
})
const upload = multer({storage});
app.post("/api/upload", upload.single("uploadFile"), (req, res)=>{
    try{
        return res.status(200).json("File uploaded successfully");
    }
    catch(err){
        console.log(err);   
    }
})

//GET USER
app.get("/api/user/:id", async (req, res)=>{
    try{
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
})

//GET FOLLOWED USER
app.get("/api/user/followed/:id", async(req, res)=>{
    try{
        const currentUser = await User.findById(req.params.id);
        const users = await User.find();
        const followedUser = users.filter((user)=>{
            return currentUser.following.includes(user._id);
        });
        res.status(200).json(followedUser);
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
})

//GET UNFOLLOWED USER
app.get("/api/user/unfollowed/:id", async(req, res)=>{
    try{
        const currentUser = await User.findById(req.params.id);
        const users = await User.find();
        const unfollowedUsers = users.filter((user)=>{
            return !currentUser.following.includes(user._id) && req.params.id != user._id;
        });
        res.status(200).json(unfollowedUsers);
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
})

//GET ALL USER
app.get("/api/users", async(req, res)=>{
    try{
        const users = await User.find();
        res.status(200).json(users);
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
})
//UPDATE USER
app.put("/api/user/:id", async (req, res)=>{
    if(req.body.password){
        try{
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }
        catch(err){
            console.log(err);
            res.status(500).json(err);
        }
    }     
    try{
        const user = await User.findByIdAndUpdate(req.params.id, {$set: req.body});
        res.status(200).json(user);
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
});

//FOLLOW AND UNFOLLOW USER
app.put("/api/user/:id/follow", async(req, res)=>{
    try{
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);

        //follow
        if(!currentUser.following.includes(user._id)){
            await currentUser.updateOne({$push: {following: user._id}});
            await user.updateOne({$push: {followers: currentUser._id}});
            res.status(200).json("Follow Successfully");
        } //unfollow
        else{
            await currentUser.updateOne({$pull: {following: user._id}});
            await user.updateOne({$pull: {followers: currentUser._id}});
            res.status(200).json("Unfollow Successfully");
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
});

//SIGNUP
app.post("/api/signup", async (req, res)=>{
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

        const user = await newUser.save();
        res.status(200).json(user);
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
})

//LOGIN
app.post("/api/login", async (req, res)=>{
    try{
        const user = await User.findOne({email: req.body.email});
        !user && res.status(404).json("user not found");
        const passwordValid = await bcrypt.compare(req.body.password, user.password);
        passwordValid ? res.status(200).json(user) : res.status(400).json("Invalid password");
        passwordValid ? console.log("Successfully login") :console.log("Invalid password");
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
});

//GET POST
app.get("/api/post/:id", async(req, res)=>{
    try{
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    }
    catch(err){
        res.status.json(err);
    }
})
//CREATE POST
app.post("/api/post", async (req, res)=>{
    try{
        const newPost = new Post(req.body);
        const post = await newPost.save();
        res.status(200).json(post);
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
});
//ADD COMMENT TO POST
app.put("/api/post/:id/comment", async(req, res)=>{
    try{
        const post = await Post.findById(req.params.id);
        await post.updateOne({$push: {comments: req.body.commentId}});
        res.status(200).json("add comment successfully");
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
});
//GET PROFILE POST
app.get("/api/post/profile/:userId", async (req, res)=>{
    try{
        const posts = await Post.find({userId: req.params.userId});
        res.status(200).json(posts);
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
})

//GET TIMELINE POST
app.get("/api/post/timeline/:userId", async(req, res)=>{
    try{
        const user = await User.findById(req.params.userId);
        const userPosts = await Post.find({userId: user._id});
        const followingPosts = await Promise.all(
            user.following.map(followingId=>{
                return Post.find({userId: followingId});
            })
        );
        res.status(200).json(userPosts.concat(...followingPosts));
    }
    catch(err){
        res.status(500).json(err);
    }
})

//DELETE POST
app.delete("/api/post/:id", async(req, res)=>{
    try{
        const post = await Post.findById(req.params.id);
        await post.deleteOne();
        res.status(200).json("Successfully delete post");
    }
    catch(err){
        console.log(err);
        res.statusMessage(500).json(err);
    }
});

//LIKE AND DISLIKE POST
app.put("/api/post/:id/like", async(req, res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push: {likes: req.body.userId}});
            res.status(200).json("like successfully");
        }
        else{
            await post.updateOne({$pull: {likes: req.body.userId}});
            res.status(200).json("dislike successfully");
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
});

//CREATE COMMENT
app.post("/api/comment", async(req, res)=>{
    try{
        const newComment = new Comment(req.body);
        const comment = await newComment.save();
        res.status(200).json(comment);
    }
    catch(err){
        res.status(500).json(err);
    }
});
//GET COMMENT
/*app.get("/api/comment/:id", async(req, res)=>{
    try{
        const comment = await Comment.findById(req.params.id);
        res.status(200).json(comment);
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
});*/

//GET ALL COMMENT
app.get("/api/comment/:postId", async(req, res)=>{
    try{
        const comments = await Comment.find({postId: req.params.postId});
        res.status(200).json(comments);
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
})

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})