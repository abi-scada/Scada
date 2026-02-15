import React, { useState, useContext, useEffect } from "react";
import {UserContext} from "./UserContext";
import { useLocation, useNavigate } from "react-router-dom";
import '../styles/AddMachines.css';
import axios from "axios";

export default function Login(){
    const {login} = useContext(UserContext);
    const [mid, setMid] = useState("1");
    const [uid, setUid] = useState("");
    const [mname, setMname] = useState("test-");
    const [htsc, setHtsc] = useState("10");
    const [loc, setLoc] = useState("Train Yard");
    const [cap, setCap] = useState("1000");
    const [lat, setLat] = useState("8.337224572871643");
    const [long, setLong] = useState("77.56843705372854");
    //8.337224572871643, 77.56843705372854

    const [error, setError] = useState("");

    const {state} = useLocation();




useEffect(()=>{
 setUid(state.user_id);
},[]);
    const handle_add_mc = async (uname, email, pass) =>{
        const formData = JSON.stringify({
            mid : mid,
            user_id : uid,
            htsc : htsc,
            mname : mname,
            location : loc,
            capacity : cap, 
            latitude : lat,
            longitude : long

        })
        

        try{
            const response = await fetch("http://localhost:8000/add-machine",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },

                body:formData,
            });
            const data = await response.json();
            setUid("");
            setMid("");
            setMname("");
            setHtsc("");
            setLoc("");
            setCap("");
            setLat("");
            setLong("");

            const user_id = uid;
            navigate(-1);

            if(!response.ok){
                setError(data.detail||"Machine Add Failed");
                return;
            }
            
            //localStorage.setItem("token", data.access_token);
            //window.location.href = "/dashboard";
        }
        catch (error){

        }
    }
    
    const navigate = useNavigate();

    const handle_mid = (e) => {
        setMid(e.target.value);
    }

    const handle_uid = (e) => {
                setUid(e.target.value);

    }
    const handle_mname = (e) => {
                setMname(e.target.value);

    }
    const handle_loc = (e) => {
        setLoc(e.target.value);
    }

    const handle_cap = (e) => {
                setCap(e.target.value);

    }
    const handle_htsc = (e) => {
                setHtsc(e.target.value);

    }
    const handle_lat = (e) => {
                setLat(e.target.value);

    }
    const handle_long = (e) => {
                setLong(e.target.value);

    }
    
    function handleSubmit(event){
        event.preventDefault();
        handle_add_mc(mid, uid, mname, htsc, loc, cap );
    }

    return(
        <div className="inner">

            <div className="glass-container">
                <form className="add-mc-form" onSubmit={handleSubmit}>
                <p className="bhead" value="uname">Add Machine</p>
                <input type="text"  onChange={handle_uid} value={uid} className="in" placeholder="User id"  name="uid" required disabled/>
                <input type="text" onChange={handle_mid} value={mid} className="in" placeholder="Machine id"  name="mid" autoComplete="off" required/>
                <input type="text" onChange={handle_mname} value={mname} className="in" placeholder="Machine Name"  name="mname" autoComplete="off" required/>
                <input type="text" onChange={handle_htsc} value={htsc} className="in" placeholder="HTSC No."  name="htsc"autoComplete="off" required/>
                <input type="text" onChange={handle_loc} value={loc} className="in" placeholder="Location"  name="loc" autoComplete="off" required/>
                <input type="text" onChange={handle_cap} value={cap} className="in" placeholder="Capacity" name="cap" autoComplete="off" required />
                <input type="float" onChange={handle_lat} value={lat} className="in" placeholder="Latitude" name="lat" autoComplete="off" required />
                <input type="float" onChange={handle_long} value={long} className="in" placeholder="Longitude" name="long" autoComplete="off" required /><br/>
                <button className="btn" type="submit">Add</button>
                </form>
            </div>
            
        </div>
    ); 
}