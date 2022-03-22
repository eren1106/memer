import React, {useContext, useEffect, useRef, useState} from 'react'
import "./editProfile.css";
import {Close} from "@material-ui/icons";
import axios from "axios";
import { AuthContext } from '../../context/AuthContext';

const EditProfile = (props) => {
  //const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const {dispatch} = useContext(AuthContext);

  const toggleHandler = () =>{
    props.closeEdit();
  };

  const [username, setUsername] = useState(props.username);
  const [description, setDescription] = useState(props.description);

  const [profilePicture, setProfilePicture] = useState(props.profilePic);
  const [profilePictureFile, setProfilePictureFile] = useState("");
  
  const [coverPicture, setCoverPicture] = useState(props.coverPic);
  const [coverPictureFile, setCoverPictureFile] = useState("");

  const usernameChange=(event)=>{
    setUsername(event.target.value);
  }
  const descriptionChange=(event)=>{
    setDescription(event.target.value);
  }

  const update = async()=>{
    const profilePictureName = Date.now() + profilePictureFile.name;
    const coverPictureName = Date.now() + coverPictureFile.name;
    const updatedData = {
      username: username,
      description: description,
    }
    try{
      if(profilePictureFile){
        updatedData.profilePicture = profilePictureName;
        const profilePicData = new FormData();
        profilePicData.append("name", profilePictureName);
        profilePicData.append("uploadFile", profilePictureFile);
        await axios.post("http://localhost:3001/api/upload", profilePicData);
      }

      if(coverPictureFile){
        updatedData.coverPicture = coverPictureName;
        const coverPicData = new FormData();
        coverPicData.append("name", coverPictureName);
        coverPicData.append("uploadFile", coverPictureFile);
        await axios.post("http://localhost:3001/api/upload", coverPicData);
      }

      await axios.put("http://localhost:3001/api/user/" + props.user._id, updatedData);
      
      dispatch({type: "RELOADING"});
      try{
        const res = await axios.get("http://localhost:3001/api/user/" + props.user._id);
        dispatch({type: "RELOAD_SUCCESS", payload: res.data});
      }
      catch(err){
          console.log(err);
      }
      window.location.reload();
    }
    catch(err){
      console.log(err);
    }
  }

  return (
    <div className="editProfile">
      <button className="closeButton" onClick={toggleHandler}>
        <Close className="closeIcon"/>
      </button>
      <div className="editProfile-top">
        <div className="editProfile-left">
          <div className="editProfile-left-top">
            <img className="editProfile-coverPicture" src={coverPicture} alt=""/>
            <img className="editProfile-profilePicture" src={profilePicture} alt=""/>
          </div>
          <div className="editProfile-left-bottom">
            <label className="btn uploadProfileButton" >
              <input type="file" style={{display: "none"}} onChange={(e)=>{
                setProfilePicture(URL.createObjectURL(e.target.files[0]));
                setProfilePictureFile(e.target.files[0]);
              }} accept=".png,.jpg,.jpeg"/>
              Upload Profile Picture
            </label>
            <label className="btn uploadCoverButton">
            <input type="file" style={{display: "none"}} onChange={(e)=>{
              setCoverPicture(URL.createObjectURL(e.target.files[0]));
              setCoverPictureFile(e.target.files[0]);
            }} accept=".png,.jpg,.jpeg"/>
              Upload Cover Picture
            </label>
          </div>
        </div>
        <div className="editProfile-right">
          <div className="inputContainer">
            <p className="inputContainer-text">Username</p>
            <input className="inputContainer-input" value={username} onChange={usernameChange} />
          </div>
          <div className="inputContainer">
            <p className="inputContainer-text">Description</p>
            <textarea className="inputContainer-input" value={description} onChange={descriptionChange} placeholder="Write some description"/>
          </div>
        </div>
      </div>
      <div className="editProfile-bottom">
        <button className="btn updateButton" onClick={update}>Update</button>
      </div>
    </div>
  )
}

export default EditProfile