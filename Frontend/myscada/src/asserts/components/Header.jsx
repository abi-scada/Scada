
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import userImg from "../icons/profile.png";
import Bell from "../icons/alarm.png";
import CrossBell from "../icons/stop.png";
import homeIcon from "../icons/home.png";
import LogoutButton from "./LogoutButton";
import '../styles/Header.css'
import axios from "axios";
import BURL from "./URL";


function Profile({setShowProfile}){
    
    
    
    return (
        <>
           
          <div title="User Profile" className="profile">
           
            <img className="usimg" 
                  onClick={()=>setShowProfile(prev => !prev)}
                src={userImg} alt=""/>
                
                
        </div>
        </>
    )
}



export function Navbar({ mc,uid, globalAlarm, setGlobalAlarm, setShowProfile, setShowLogout }){
    console.log(uid);
    const location = useLocation();
    const isPath = location.pathname;
    const uname = (mc || "").toUpperCase();

  const navigate = useNavigate(); 
  return (
    <div className="headerContainer-card">
      <div className="fild1">
      <h1 className="wMsg">Hello,  <span> {uname} !!!</span></h1>
      </div>
      <div className="fild2">
        <h1 className="tit">Abi's Scada System</h1>
      </div>
      <div className="fild3">
        {isPath === "/dashboard" &&
        <img
  className="bell-icon"
  alt="bell"
  src={globalAlarm ? Bell : CrossBell}
  title={globalAlarm ? "Alarm ON" : "Alarm OFF"}
  onClick={() => {setGlobalAlarm(prev => !prev);
    console.log("globalAlarm:", globalAlarm);
console.log("setGlobalAlarm:", setGlobalAlarm);
  }}
/>
        }
        {isPath === "/detailed" &&
        <img  className="home-icon" onClick={()=>{navigate(-1)}} src={homeIcon} alt="img"/>
        }
        <Profile setShowProfile={setShowProfile}/>  
        <LogoutButton setShowLogout={setShowLogout}/>
      </div>
    </div>
  )
}

const Header = ({ user, globalAlarm, setGlobalAlarm, setShowProfile, setShowLogout}) => {
    const uid = user;
    const [uname, setUname] = useState("");
    useEffect( ()=>{
      const getUn = async () => {
        try{
      const res = await axios.get(BURL+'get-usr/'+uid);
        setUname(res.data)
      }
      catch(er){
        console.log(er);
      }
      finally{
      //console.log(uname);
      }
      }
      getUn();
    },[uid]);
    

    return(
      <Navbar 
      mc={uname} 
      uid={uid} 
      globalAlarm={globalAlarm}
      setGlobalAlarm={setGlobalAlarm} 
      setShowProfile={setShowProfile}
      setShowLogout={setShowLogout}/>
    )
}

export default Header
