import React, {useContext, useState, useRef} from 'react'
import "./share.css";
import {PermMedia} from "@material-ui/icons";
import { AuthContext} from '../../context/AuthContext';
import {Cancel} from "@material-ui/icons";
import axios from "axios";
import {Link} from "react-router-dom";

const Share = () => {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const {user} = useContext(AuthContext);
    const [file, setFile] = useState("");
    const description = useRef();

    const submitPost = async(e) =>{
        e.preventDefault();
        const newPost = {
            userId: user._id,
            description: description.current.value
        }
        if(file){
            const fileName = Date.now() + file.name;
            newPost.image = fileName;
            const data = new FormData();
            data.append("name", fileName);
            data.append("uploadFile", file);
            console.log(data);
            try{
                await axios.post("http://localhost:3001/api/upload", data);
                await axios.post("http://localhost:3001/api/post", newPost);
                window.location.reload();
            }
            catch(err){
                console.log(err);
            }
        }
    }

  return (
    <div className="share">
        <div className="share-wrapper">
            <div className="share-top">
                <Link to={"/profile/"+user._id}>
                    <img className="share-profilePicture" src={
                        user.profilePicture ? PF + user.profilePicture : PF + "noAvatar.png"
                    } alt="" />
                </Link>
                <input className="share-input" placeholder="Share something funny" ref={description}/>
            </div>
            {file && 
                <div className="share-imageContainer">
                    <img className="share-image" src={URL.createObjectURL(file)} alt=""/>
                    <Cancel className="share-imageCancel" onClick={()=>{setFile("")}}/>
                </div>
            }
            <hr className="share-line"/>
            <form className="share-bottom" onSubmit={submitPost}>
                <label htmlFor="file" className="share-bottom-button">
                    <PermMedia className="share-icon"/>
                    <p>Image/Video</p>
                    <input type="file" id="file" style={{display: "none"}} accept=".png,.jpg,.jpeg" onChange={(e)=>setFile(e.target.files[0])}/>
                </label>
                <button className="share-shareButton" type="submit">Share</button>
            </form>
        </div>
    </div>
  )
}

export default Share