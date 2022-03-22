import React, {useContext, useEffect, useState, useRef} from 'react'
import "./post.css";
import { MoreVert } from "@material-ui/icons";
import { AuthContext} from '../../context/AuthContext';
import axios from 'axios';
import {format} from "timeago.js";
import {Link} from "react-router-dom";
import Comment from '../comment/Comment';

const Post = ({post}) => {
  const [user, setUser] = useState({});
  const {user: currentUser} = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [likes, setLikes] = useState(post.likes.length);
  const [liked, setLiked] = useState(post.likes.includes(currentUser._id));
  const [deleteDropped, setDeleteDropped] = useState(false);
  const [deleteWarned, setDeleteWarned] = useState(false);  
  const [comments, setComments] = useState([]);
  const commentText = useRef();
  const [commentShowed, setCommentShowed] = useState(true);

  const toggleLike = async ()=>{
    try{
      await axios.put("http://localhost:3001/api/post/" + post._id + "/like", {userId: currentUser._id});
      setLikes(liked ? likes - 1 : likes + 1);
      setLiked(!liked);
    }
    catch(err){
      console.log(err);
    }
  }

  useEffect(()=>{
    const getUser = async() =>{
      try{
        const res = await axios.get("http://localhost:3001/api/user/" + post.userId);
        setUser(res.data);
      }
      catch(err){
        console.log(err);
      }
    }
    const getComment = async() =>{
      try{
        const res = await axios.get("http://localhost:3001/api/comment/"+post._id);
        setComments(res.data);
      }
      catch(err){
        console.log(err);
      }
    }
    getUser();
    getComment();
  }, [post]);
  
  const submitComment = async() =>{
    const newComment = {
      userId: currentUser._id,
      postId: post._id,
      text: commentText.current.value
    }
    try{
      const res = await axios.post("http://localhost:3001/api/comment", newComment);
      setComments([...comments, res.data]);
    }
    catch(err){
      console.log(err);
    }
    commentText.current.value = "";
  }
  const deletePost = async() =>{
    if(currentUser._id === post.userId){
      try{
        await axios.delete("http://localhost:3001/api/post/"+post._id);
        window.location.reload();
      }
      catch(err){
        console.log(err);
      }
    }
    else{
      setDeleteWarned(true);
    }
  }

  return (
    <div className="post">
        <div className="post-wrapper">
          <div className="post-top">
            <div className="post-top-left">
              <Link to={"/profile/" + user._id}>
                <img className="post-profilePicture" src={
                  user.profilePicture ? PF + user.profilePicture : PF + "noAvatar.png"
                } alt=""/>
              </Link>
              <p className="post-top-username">{user.username}</p>
              <p className="post-top-time">{format(post.createdAt)}</p>
            </div>
            <div className="post-top-right">
              <button className="post-threeDotIcon" onClick={()=>{
                setDeleteDropped(!deleteDropped);
              }}><MoreVert/></button>
              {deleteDropped &&
                <div className="post-deleteContainer">
                  {!deleteWarned ?
                    <button className="post-deleteButton" onClick={deletePost}>Delete</button>
                    : <div className="post-deleteWarningContainer">
                        <p className="post-deleteWarning">You only can delete your own post!</p>
                      </div>}
                </div>
              }
            </div>
          </div>
          <p className="post-description">{post.description}</p>
          <img className="post-image" src={PF + post.image} alt="" />
          <div className="post-middle">
            <div className="post-middle-left">
              <img className="post-laugh-image" src={PF + "laugh.png"} alt="" onClick={toggleLike}/>
              <p className="post-laugh-text" style={{
                color: liked ? "blue" : "#000"
              }}>{likes} people laugh at it</p>
            </div>
            <div className="post-middle-right">
              <p className="post-commentOption" onClick={()=>{setCommentShowed(!commentShowed)}}>{comments.length} comments</p>
            </div>
          </div>
          <hr className="post-hr" />
          {commentShowed && <div className="post-commentContainer">
            {comments?.map((comment)=>{
              return <Comment key={comment._id} comment={comment}/>
            })}
          </div>}
          <div className="post-bottom">
            <Link to={"/profile/" + currentUser._id}>
              <img className="post-bottom-image" src={
                currentUser.profilePicture ? PF + currentUser.profilePicture : PF + "noAvatar.png"} alt="" />
            </Link>
            <div className="post-bottom-inputContainer">
              <input className="post-bottom-input" placeholder="Write a comment..." ref={commentText}/>
              <button className="post-bottom-sendButton" onClick={submitComment}>Send</button>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Post