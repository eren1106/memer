import React, {useContext} from 'react';
import "./home.css";
import Topbar from '../../components/topbar/Topbar';
import LeftBar from '../../components/leftbar/LeftBar';
import Feed from '../../components/feed/Feed';
import RightBar from '../../components/rightbar/RightBar';

const Home = () => {
  return (
    <div className="home">
        <Topbar /> 
        <div className="home-container">
            <div className="home-leftbar">
              <LeftBar />
            </div>
            <div className="home-feed">
              <Feed/>
            </div>
            <div className="home-rightbar">
              <RightBar />
            </div>
            
            
        </div>
    </div>
  )
}

export default Home