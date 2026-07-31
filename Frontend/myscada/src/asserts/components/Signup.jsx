import { useState } from "react";
import { useNavigate} from "react-router-dom";
import '../styles/Signup.css';
import UndoIcon from '../icons/undo.png';
import BURL from "./URL";


export default function Signup(){
    const [uname, setUname] = useState("");
    const [pass, setPass] = useState("");
    const [email, setEmail] = useState("");

    const handle_signup = async (uname, email, pass) =>{
        const formData = JSON.stringify({
            name : uname,
            email : email,
            password : pass
        })
        

        try{
            const response = await fetch(BURL+"add-user",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },

                body:formData,
            });
            const data = await response.json();
            if(!response.ok){
                return;
            }
            navigate('/admin/users');
        }
        catch (error){

        }
    }
    
    const navigate = useNavigate();

    const handlename = (e) => {
        setUname(e.target.value);
    }

    const handlepass = (e) => {
                setPass(e.target.value);

    }
    const handleemail = (e) => {
                setEmail(e.target.value);

    }
    function handleSubmit(event){
        event.preventDefault();
        handle_signup(uname, email, pass);
        
    }

    return(
        <div className="signup-root-container">
            <button className='back-button' onClick={()=>navigate(-1)}> <img className='undo-icon' src={UndoIcon} alt="" /> </button>

            <div className="signup-container">
                <form className="signup-form" onSubmit={handleSubmit}>
                <p className="signup-head">Add New User</p>
                <input className="signup-input" type="text" onChange={handlename} value={uname}  placeholder="Username"  name="uname" required/>
                <input className="signup-input" type="email" onChange={handleemail} value={email}  placeholder="E-mail"  name="email" required/>
                <input className="signup-input" type="password" onChange={handlepass} value={pass} placeholder="Password" name="pass" required /><br/>
                <button className="signup-button" type="submit">Add Now</button>
                </form>
            </div>
            
        </div>
    ); 
}