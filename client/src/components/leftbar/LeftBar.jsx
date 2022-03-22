import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react'
import "./leftbar.css";
import { AuthContext } from '../../context/AuthContext';
import { Link } from "react-router-dom";

const LeftBar = () => {
  const [followedUsers, setFollowedUsers] = useState([]);
  const [unfollowedUsers, setUnfollowedUsers] = useState([]);
  const {user, dispatch} = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(()=>{
    const fetchFollowed = async()=>{
      const res = await axios.get("http://localhost:3001/api/user/followed/"+user._id);
      setFollowedUsers(res.data);
    }
    const fetchUnfollowed = async()=>{
      const res = await axios.get("http://localhost:3001/api/user/unfollowed/"+user._id);
      setUnfollowedUsers(res.data);
    }
    fetchFollowed();
    fetchUnfollowed();
  }, [user]);

  const toggleFollow =async(userId)=>{
    try{
        await axios.put("http://localhost:3001/api/user/"+userId+"/follow", {userId: user._id});
        const res = await axios.get("http://localhost:3001/api/user/"+user._id);
        dispatch({type: "RELOAD_SUCCESS", payload: res.data});
    }
    catch(err){
        console.log(err);
    }
}

  return (
    <div className="leftBar">
      <div className="leftBar-wrapper">
        <div className="leftBar-top">
          <h1>Suggestion</h1>
          <div className="leftBar-recommendContainer">
            {
              unfollowedUsers.map((unfollowedUser)=>{
                return (
                  <div key={unfollowedUser._id} className="leftBar-recommend">
                    <Link to={"/profile/" + unfollowedUser._id} className="recommend-left">
                      <img className="recommendImg" src={unfollowedUser.profilePicture ? PF + unfollowedUser.profilePicture : PF + "noAvatar.png"} alt=""/>
                      <p className="recommendName">{unfollowedUser.username}</p>
                    </Link>
                    <button className="followBtn" onClick={()=>{
                      toggleFollow(unfollowedUser._id);
                    }}>Follow</button>
                  </div> 
                )
              })
            }
          </div>
        </div>
        <hr className="leftBar-line"/>
        <div className="leftBar-bottom">
          <h1>Following</h1>
          <div className="leftBar-followingContainer">
            {
              followedUsers.map((followedUser)=>{
                return(
                  <Link key={followedUser._id} to={"/profile/" + followedUser._id} className="leftBar-following">
                    <img className="followingImg" src={followedUser.profilePicture ? PF + followedUser.profilePicture : PF + "noAvatar.png"} alt=""/>
                    <p className="followingName">{followedUser.username}</p>
                  </Link>
                )
              })
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeftBar;