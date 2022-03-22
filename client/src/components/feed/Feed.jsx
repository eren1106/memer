import React, { useContext, useEffect, useState } from 'react';
import "./feed.css";
import Share from '../share/Share';
import Post from '../post/Post';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const Feed = ({userId}) => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);

  useEffect(()=>{
    const getPosts = async() =>{
      try{
        const res = userId ?
        await axios.get("http://localhost:3001/api/post/profile/" + userId)
        : await axios.get("http://localhost:3001/api/post/timeline/" + user._id);
        setPosts(res.data.sort((p1, p2)=>{
          return new Date(p2.createdAt) - new Date(p1.createdAt); //the date of p1 must bigger than p2, hence it will return negative result, negative means it will sort p1 then p2, if positive it will sort p2 then p1
        }));
      }
      catch(err){
        console.log(err);
      }
    }
    getPosts();
  }, [userId, user._id]);

  return (
    <div className="feed">
      <div className="feed-wrapper">
        {(!userId || userId === user._id) && <Share />}
        {posts.length === 0 ? <p className="feed-noMeme">{userId ? "Try upload some meme!" : "No meme available, try follow someone"}</p> :
        posts.map(post=>{
          return(
            <Post key={post._id} post={post} />
          )
        })}
      </div>
    </div>
  )
}

export default Feed