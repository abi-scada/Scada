import React, { useState } from "react";
//import {UserContext} from "./asserts/components/UserContext";
import { useNavigate} from "react-router-dom";
import '../styles/loginsignup.css';
import { toast } from 'react-toastify';
import Cookies from "js-cookie";
import BURL from "./URL";
import AdminImg from "../icons/system-administration.png"
import HomeIcon from '../icons/home.png'



export default function Login(){
    //const {login} = useContext(UserContext);
    const [uname, setUname] = useState("");
    const [pass, setPass] = useState("");
    const [error, setError] = useState("");
    //login(uname);

    const notify = (typ,msg) => {
      const options = {
        className: "toast-glass",
      };
        if (typ==="success"){
        toast.success(msg,options);}
        else if(typ==="error"){
            toast.error(msg,options);
        }
    }

    const handle_login = async (uname, pass) =>{
        const formData = JSON.stringify({
            name : uname,
            password : pass
        })
        

        try{
            const response = await fetch(BURL+"login",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:formData,
            });
            const data = await response.json();
            if(!response.ok){
                setError(data.detail||"Login Failed");
                notify("error","Invalid Credentials!!!");
                return;
            }
            //const token = data.access_token;
            const uid = data.id;
            Cookies.set("user_id", uid,{expires:7, path:'/'});
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("isLoggedIn", JSON.stringify(true));
            notify("success","Login Successful!!!");
            //window.location.href = "/dashboard";

            setTimeout(()=>{
                navigate('/dashboard');
            },500);
            
            //return <Dashboard/>
        }
        catch (error){

        }
    }

    const navigate = useNavigate();

    const handlename = (e) => {
        setUname(e.target.value);
        setError("");
    }

    const handlepass = (e) => {
                setPass(e.target.value);
                setError("");

    }
   // const foundUser = uData.find((u)=>u.uname === uname && u.pass === pass);
    function handleSubmit(event){
        event.preventDefault();
        handle_login(uname, pass);
        // if (foundUser){
        //     console.log("User Found!!!!", foundUser);
        //     login(foundUser);   
        //     navigate('/dashboard', );
        // } else{
        //     alert("no user found!!!");
        //     return(
        //         <h1>NO user found!!!</h1>
        //     );
        // }
        
        
    }
    function launchAdmin(){
      navigate('/admin');
    }

    return(
    <div className="login-container">
      <button className='back-button' onClick={()=>navigate("/")}> <img className='undo-icon' src={HomeIcon} alt="Home" /> </button>
      
      <div className="admin-container">
        <h2>System Access</h2>
        <p>Abi's SCADA Hub: Access Control</p>
        <img src={AdminImg} className="admin-btn" alt="Admin" onClick={()=>launchAdmin()}></img>
      </div>


      <div className="login-form-area">
        <div className="glass-login-card">
          <h1>Sign In</h1>
          <p>Enter your credentials</p>
          
          <form onSubmit={handleSubmit}>
            <input type="text" onChange={handlename} value={uname} className="login-input" placeholder="Username"  name="uname" autoComplete="off" required/>
            <input type="password" onChange={handlepass} value={pass} className="login-input" placeholder="Password" name="pass" autoComplete="off" required /><br/>
            <button type="submit"  className="login-btn">Initialize Connection</button>
          </form>
        </div>
      </div>
    </div>
    ); 
}

/** 
const LoginPage = () => {
  return (
    <div className="login-container">
      <div className="login-visual">
        <div>
          <h2 style={{color: '#00e5ff', fontSize: '2rem'}}>System Access</h2>
          <p style={{color: '#a0aec0'}}>Abi's SCADA Hub: Node-04 Grid Control</p>
        </div>
      </div>

      <div className="login-form-area">
        <div className="glass-login-card">
          <h1 style={{fontSize: '1.8rem', marginBottom: '0.5rem'}}>Sign In</h1>
          <p style={{color: '#718096', fontSize: '0.9rem'}}>Enter your operator credentials</p>
          
          <form onSubmit={handleSubmit}>
            <input type="text" onChange={handlename} value={uname} className="login-input" placeholder="Username"  name="uname" required/>
            <input type="password" onChange={handlepass} value={pass} className="login-input" placeholder="Password" name="pass" required /><br/>
                
            <input type="email" placeholder="Operator Email" className="login-input" />
            <input type="password" placeholder="Access Code" className="login-input" />
            
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontSize: '0.8rem'}}>
              <label><input type="checkbox" /> Remember Node</label>
              <a href="#" style={{color: '#00e5ff', textDecoration: 'none'}}>Forgot Key?</a>
            </div>

            <button type="submit"  className="login-btn">Initialize Connection</button>
          </form>
        </div>
      </div>
    </div>
  );
};
*/
