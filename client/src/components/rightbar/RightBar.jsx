import React from 'react';
import "./rightbar.css";

const RightBar = () => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <div className="rightBar">
      <div className="rightBar-wrapper">
        <h1 className="rightBar-title">Ads</h1>
        <div className="rightBar-ads">
          <img className="rightBar-ads-image" src={PF + "reactjs.png"} alt="" />
          <p className="rightBar-ads-description">React.js is a frontend framework of javascript</p> 
        </div>
        <div className="rightBar-ads">
          <img className="rightBar-ads-image" src={PF + "nodejs.png"} alt="" />
          <p className="rightBar-ads-description">Node.js is a backend framework of javascript</p> 
        </div>
        <div className="rightBar-ads">
          <img className="rightBar-ads-image" src={PF + "mongodb.png"} alt="" />
          <p className="rightBar-ads-description">Mongodb is a nosql database</p> 
        </div>
        <div className="rightBar-ads">
          <img className="rightBar-ads-image" src={PF + "expressjs.png"} alt="" />
          <p className="rightBar-ads-description">Express.js is a framework of node.js</p> 
        </div>
      </div>
    </div>
  )
}

export default RightBar