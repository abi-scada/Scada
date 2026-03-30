import '../styles/Dashboard.css';
import Header from "./Header";
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import ro from '../ro_bl.png';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import BURL from './URL';
import alarmAudio from "../audios/alarm.mp3"
import Bell from "../icons/alarm.png";
import CrossBell from "../icons/stop.png";
import Footer from './Footer';
import useWakeLock from "./WakeLock";
import { useLoading } from './LoadingContext';
import card from '../icons/dashboard.png';
import map from '../icons/map.png';

import { useTheme } from './ThemeContext';
import { toast } from 'react-toastify';
import { useApp } from '../../context/AppContext';
import MapView from './MapView';



export default  function  Dashboard() {

    useWakeLock(true);
    const [machine, setMachine] = useState([]); 
    const [summary, setSummary] = useState(null);
    const [now, setNow] = useState(new Date());
    const [tab, setTab] = useState(2);
    const [activeTab, setActiveTab] = useState("Map View");
    //const [showProfile, setShowProfile] = useState(false);
    //const [showLogout, setShowLogout] = useState(false);
    //const [globalAlarm, setGlobalAlarm] = useState(false);

    const tabs = [
          {name:'Card View', icon: card},
          {name:'Map View', icon: map},
        ]
    const changeTab = (id) => {
      setTab(id+1);
    }

    const {
        userId,
        setUserId,
        userName,
        showProfile,
        showLogout,
        globalAlarm,
        setGlobalAlarm,
        setShowProfile,
        setShowLogout,
        pro, 
        setPro
        } = useApp();

    const { setDataDone } = useLoading();

    const { setBg, gradients } = useTheme();

    const usr = Cookies.get('user_id');
    //console.log("User Id is ",usr);

    const navigate = useNavigate();
    //const playSound = alarm_active && !alarm_ack && globalAlarmEnabled;
    //console.log("GLOBAL:", globalAlarm);

    const alarmRef = useRef(null);


useEffect(() => {
  alarmRef.current = new Audio(alarmAudio);
  alarmRef.current.loop = true;
}, []);


useEffect(() => {
  const t = setInterval(() => setNow(new Date()), 1000);
  return () => clearInterval(t);
}, []);

useEffect(() => {
  if (!alarmRef.current) return;

  const shouldPlay = globalAlarm && machine.some(
    mc => mc.alarm_active && !mc.alarm_ack//! 
  );
  
console.log("global : ", globalAlarm, "")
  if (shouldPlay) {
    console.log("🔔 Alarm ON");
    alarmRef.current.play().catch(()=>{});
  } else {
    console.log("🔕 Alarm OFF");
    alarmRef.current.pause();
    alarmRef.current.currentTime = 0;
  }
}, [machine, globalAlarm]);



    const URL1 = BURL+'card/'+usr;
    //console.log(usr);
    //console.log(URL1);
    
    useEffect(() => {
        if (!usr) return;
        setDataDone(false);
        const fetchAll = async () => {
        try{
            const machinesRes = await axios.get(URL1);
            //console.log(machinesRes.data);
            setMachine(machinesRes.data);
            
        }
         catch(error) {
            console.log("error in fetch  : ",error)
        }
        finally{
            setDataDone(true);
        }
        }
        fetchAll();
        const interval = setInterval(fetchAll, 15000);
        return () => clearInterval(interval);
    
    }, [usr]);

    useEffect(() => {
        if (!usr) return;
        const fetchSummary = async () => {
            try{ 
                const res = await axios.get(BURL+"production/summary/"+usr);
                setSummary(res.data);
            }
            catch(error){
                console.log("error in summary fetch : ", error);
            }
        };
        fetchSummary();
        const interval = setInterval(fetchSummary, 60000);
        return () => clearInterval(interval);
    }, [usr]);
    const getTime = (dt) => {
        if (!dt) return "--:--:--";
        const [, time] = dt.split("T");
        return time
    }
    const getDate = (dt) => {
        if (!dt) return "--:--:--";
        const [date, ] = dt.split("T");
        return date
    } 
    const getStyle = (mc) => {
        //console.log("Machine : ",mc);
        //console.log(typeof mc.wind);
        let style = "ro";
        if (mc.status.toUpperCase() === "GRID DROP"){
            style += " blue";
        }else if (mc.status.toUpperCase() !== "RUN") {
          style += " red";
        }else{
            if (mc.wind < 3){
                style += " orenge";
            };
            if (mc.wind > 25){
                style += " overWind"
            }
        }
        return style.trim();
        
    }
    const getSts = (mc) => {
        //console.log("Machine : ",mc);
        let sst = "sts";
        if(mc.status.length > 10 ){
            sst += " marquee";
        }
        if(mc.status.toUpperCase() === "GRID DROP"){
            sst += " gd"; 
        }
        else if(mc.status.toUpperCase() === "RUN"){
            //do nothing 
        }
        else{
            sst += " err";
        }
        return sst;
        
    }
    const goDeep = (mc) =>{
        //console.log("pass id : ", mc);
        navigate('/detailed', {state:mc});
    }
    useEffect(()=>{
        const fetch_user = async () =>{
            try{
                const res = await axios.get(BURL+"get-user/"+usr);
                if(res){
                    setPro(res.data);
                }
            }
            catch(e){
                console.log("Error", e)
            }
        }
        fetch_user();
    },[usr])
    const notify = (typ, msg) => {
  const options = {
    className: "toast-glass",
  };

  if (typ === "success") {
    toast.success(msg, options);
  } 
  else if (typ === "error") {
    toast.error(msg, options);
  }
};

  const logout = () => {
    localStorage.clear();
    Cookies.remove("user_id");
    notify("success","LoggedOut Successfuly!!!");
    navigate('/login');
    

  }
    
    return(<div className='Rroot'>
        
        
        <div className="nav-container">
            <Header user={usr}/>
        </div>
        

        <div className="summary-card">
            <div className="summary-left">
                <div className="summary-title">Current Time</div>
                <div className="summary-time">{now.toLocaleTimeString()}</div>
                <div className="summary-date">{now.toLocaleDateString()}</div>
            </div>
            <div className="summary-center">
                <div className="summary-title">Hero of the Day</div>
                <div className="summary-hero-name">
                    {summary?.hero ? `${summary.hero.mc_name}` : "--"}
                </div>
                <div className="summary-hero-gen">
                    {summary?.hero ? `${summary.hero.total_kw} kW` : "--"}
                </div>
            </div>
            <div className="summary-right">
                <div className="summary-title">Total Daily <span className='br'><br/></span> Production</div>
                <div className="summary-value">{summary?.total_kw ?? 0} kW</div>
            </div>
        </div>

            <div className="tabs_container">
                <ul className="tab-list">
                {tabs.map((tab,index)=>(
                    <li
                    key={tab.name}
                    className={activeTab === tab.name ? 'tab active-tab' : 'tab'}
                    onClick={()=>{
                        setActiveTab(tab.name);
                        changeTab(index);
                        
                    }}
                    ><img src={tab.icon} className='tab-icons' alt="" />
                    {tab.name}
                    </li>))}
                </ul>
            </div>
        <div className={tab === 1 ? "show-tab" : "ta"}>
        <div className="card-root">
        {machine.length > 0 ? (
            machine.map((mc)=>(
        
            <div key={mc.mc_id} className="glass-card" onClick={()=>goDeep(mc)}>
                <div className="loc_container">
                    <a 
                    href={"https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination="+mc.mc_lat+","+mc.mc_long+"&travelmode=driving"} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    >
                    <img src={map} className='loc_icon' alt="Location icon" />
                    </a>
                    
                </div>
                <div className="bell-container">
                    <img
                    alt='bell'
                    className="bell-icon card-bell"
                    src={
                        mc.alarm_active
                        ? (mc.alarm_ack ? CrossBell : Bell)
                        : CrossBell
                    }
                    onClick={(e) => {
                        e.stopPropagation();
                        axios.post(`${BURL}alarm/ack/${mc.mc_id}`);
                        setMachine(prev =>
                        prev.map(m =>
                            m.mc_id === mc.mc_id
                            ? { ...m, alarm_ack: true }
                            : m
                        )
                        );
                    }}
                    />

                </div> 
                <div className="nm">
                    <h5 className="mc-name">{mc.mc_id} - {mc.mc_name.toUpperCase()} - {mc.mc_htsc}</h5>
                    <h5 className="loc">{mc.mc_loc}</h5>
                </div>
                    <div className="ro-container">
                        <img className={getStyle(mc)} src={ro} alt="Ro" />
                    </div>
                    <div className="discMc">
                        <table className='details-table'>
                            <tr><td colSpan={2}><div className='sts-container'><h5 className={getSts(mc)}>{mc.status}</h5></div></td></tr>
                            <tr>
                                <td>Wind</td>
                                <td>{mc.wind} M/S</td>
                            </tr>
                            <tr>
                                <td>Power</td>
                                <td>{mc.power}kW</td>
                            </tr>
                            <tr>
                                <td>Time</td>
                                <td>{getTime(mc.dt)}</td>
                            </tr>
                            <tr>
                                <td>Date</td>
                                <td>{getDate(mc.dt)}</td>
                            </tr>
                            
                        </table>
                        
                    </div>
                </div>
        
       
    ))):(
        <p>No Machines Added Yet!!!</p>
    )}
     </div>
     </div>
     <div className={tab === 2 ? "show-tab" : "ta"}>
        <div className="map_roo">
            <MapView machine={machine}/>
        </div>
     </div>

     <div className='footer-container'>
        <Footer />
     </div>
     
    </div>
    );
}
