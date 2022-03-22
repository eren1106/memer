import React, { useEffect, useState } from 'react'
import "./comment.css";
import axios from 'axios';
import {format} from "timeago.js";

const Comment = ({comment}) => {
    const [user, setUser]= useState({});
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    useEffect(()=>{
        const fetchUser = async()=>{
            try{
                const res = await axios.get("http://localhost:3001/api/user/"+comment.userId);
                setUser(res.data);
            }
            catch(err){
                console.log(err);
            }
        }
        fetchUser();
    }, [comment]);

  return (
    <div className="comment">
        <img className="comment-image" src={user.profilePicture ? PF + user.profilePicture : PF + "noAvatar.png"} alt="" />
        <div className="comment-right">
            <div className="comment-right-top">
                <p className="comment-name">{user.username}</p>
                <p className="comment-time">{format(comment.createdAt)}</p>
            </div>
            <p className="comment-text">{comment.text}</p>
        </div>
    </div>
  )
}

export default Comment