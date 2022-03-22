import React, {useContext, useEffect, useRef, useState} from 'react'
import "./topbar.css";
import { Search } from '@material-ui/icons';
import { Link } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const Topbar = () => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const {user, dispatch} = useContext(AuthContext);
  const navigate = useNavigate();
  const [dropDown, setDropDown] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchUsers, setSearchUsers] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  
  const logout =()=>{
    dispatch({type: "LOGOUT"});
    navigate("/");
  }

  const searchInputChange =(e)=>{
    setSearchText(e.target.value);
  }

  useEffect(()=>{
    searchText === "" ? setDropDown(false) : setDropDown(true);
  }, [searchText])
  
  useEffect(()=>{
    const fetchUsers = async() =>{
      setSearchLoading(true);
      try{
        const users = await axios.get("http://localhost:3001/api/users");
        const search = users.data.filter((user)=>{
          return user.username.toLowerCase().includes(searchText.toLowerCase());
        });
        setSearchUsers(search);
        setSearchLoading(false);
      }
      catch(err){
        console.log(err);
      }
    }
    fetchUsers();
  }, [searchText])

  const clickSearch = (userId) =>{
    setSearchText("");
    navigate("/profile/" + userId)
  }
  return (
    <div className="topbar">
      <div className="topbar-left">
        <Link to="/">
          <h1 className="topbar-logo">Memer</h1>
        </Link> 
      </div>
      <div className="topbar-middle">
        <div className="topbar-searchbar">
          <Search className="topbar-searchIcon"/>
          <input className="topbar-input" onChange={searchInputChange} value={searchText} placeholder="Search someone..."/>
          {dropDown &&
            <div className="topbar-dropDown">
              {searchLoading ? <p className="topbar-loading">Loading...</p> :
                (searchUsers.length === 0 ? <p className="topbar-noUserFound">No user found</p> :
                  searchUsers.map((user)=>{
                    return (
                      <div className="topbar-dropDown-user" key={user._id} onClick={()=>{
                        clickSearch(user._id);
                      }}>
                        <img className="topbar-dropDown-user-profilePicture" src={user.profilePicture ? PF + user.profilePicture : PF + "noAvatar.png"} alt=""/>
                        <p className="topbar-dropDown-user-name">{user.username}</p>
                      </div>
                    )
                  })
                )
              }
            </div>
          }
        </div>
      </div>
      <div className="topbar-right">
          <Link to={"/profile/"+user._id} className="topbar-profilePicContainer">
            <img src={
              user.profilePicture? PF + user.profilePicture : PF + "noAvatar.png"
            } className="topbar-profilePic" alt=""/>
          </Link>
          <button className="topbar-logout" onClick={logout}>Logout</button>
      </div>
    </div>
  )
}

export default Topbar