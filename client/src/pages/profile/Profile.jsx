import React, { useEffect, useState, useContext } from 'react'
import Feed from '../../components/feed/Feed'
import LeftBar from '../../components/leftbar/LeftBar'
import Topbar from '../../components/topbar/Topbar'
import "./profile.css";
import {Add, Edit, Close} from '@material-ui/icons';
import { useParams } from 'react-router';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import EditProfile from '../../components/editProfile/EditProfile';

const Profile = () => {
    const params = useParams();
    const userId = params.userId;
    const [user, setUser] = useState({});
    const [followers, setFollowers] = useState(0);
    const [following, setFollowing] = useState(0);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const { user: currentUser, dispatch } = useContext(AuthContext);
    const [followed, setFollowed] = useState(false);
    const [editOpened, setEditOpened] = useState(false);

    const coverPic = user.coverPicture ? PF + user.coverPicture : PF + "noCover.jpg";
    const profilePic = user.profilePicture? PF + user.profilePicture : PF + "/noAvatar.png";

    useEffect(()=>{
        const findUser = async()=>{
            try{
                const res = await axios.get("http://localhost:3001/api/user/" + userId);
                setUser(res.data);
                setFollowers(res.data.followers.length);
                setFollowing(res.data.following.length);
                setFollowed(res.data.followers.includes(currentUser._id))
            }
            catch(err){
                console.log(err);
            }
        }
        findUser();
    }, [userId, currentUser]);

    const toggleEdit = () =>{
        setEditOpened(!editOpened);
    }

    const toggleFollow =async()=>{
        try{
            await axios.put("http://localhost:3001/api/user/"+userId+"/follow", {userId: currentUser._id});
            const res = await axios.get("http://localhost:3001/api/user/"+currentUser._id);
            dispatch({type: "RELOAD_SUCCESS", payload: res.data});
        }
        catch(err){
            console.log(err);
        }
    }

  return (
    <div className="profile">
        <Topbar />
        <div className="profile-wrapper">
            {editOpened &&
                <div className="edit-container">
                    <EditProfile closeEdit={toggleEdit} user={user} coverPic={coverPic} profilePic={profilePic} username={user.username} description={user.description}/>
                </div>
            }
            <div className="profile-left">
                <LeftBar />
            </div>
            <div className="profile-right">
                <div className="profile-right-top">
                    <div className="profile-imageContainer">
                        <img className="profile-coverPicture" src={
                            coverPic
                        } alt="" />
                        <img className="profile-profilePicture" src={
                            profilePic
                        } alt="" />
                    </div>
                    <h1 className="profile-name">{user.username}</h1>
                    <p className="profile-description">{user.description}</p>
                </div>
                <div className="profile-right-bottom">
                    <div className="profile-feed">
                        <Feed userId={userId}/>
                    </div>
                    <div className="profile-detail">
                        {(userId === currentUser._id)
                            ? <button className="profile-btn editButton" onClick={toggleEdit}>Edit Profile<Edit /></button>
                            : ( !followed
                                ? <button onClick={toggleFollow} className="profile-btn followButton">Follow<Add /></button>
                                : <button onClick={toggleFollow} className="profile-btn unfollowButton">Unfollow<Close /></button>
                                )

                        }
                        <p className="profile-followers">Followers: {followers}</p>
                        <p className="profile-following">Following: {following}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Profile