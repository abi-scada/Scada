import { useApp } from "../../context/AppContext";
import ProfileBoy from '../icons/boy.png';
import insta from '../icons/instagram.png';
import whatsapp from '../icons/whatsapp.png';
import mail from '../icons/mail.png';
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "./ThemeContext";
import Cookies from "js-cookie";
import { toast } from 'react-toastify';


const ProfileModal = () => {
    return;

}

const ModalManager = () => {
  const { showProfile, showLogout, setShowLogout, pro, setPro, setShowProfile } = useApp();
    const navigate = useNavigate();
    const { setBg, gradients } = useTheme();

    const location = useLocation();
    const isDashboard = location.pathname === "/dashboard";

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


  return (
    <>
      {showProfile && //<ProfileModal />
      <div className="profile-container-overlay" onClick={()=>{setShowProfile(false)}}>
                  <div className="glass-card profile-container" onClick={(e) => e.stopPropagation()}>
                  <h3>Profile</h3>
                  <img src={ProfileBoy} alt="" className="profile-boy" />
                  <p className='profile-name'><span>{pro.id}</span>-{pro.name}</p>
                  <p>{pro.email}</p>

                  {isDashboard && <div className="bg-options">
                    {Object.keys(gradients).map((key) => (
                        <div
                        key={key}
                        className="bg-swatch"
                        style={{ background: gradients[key] }}
                        onClick={() => setBg(key)}
                        />
                    ))}
                    </div>}
                    <div className="admin-query">
                        <p>For Query<br />Contact</p>
                        <h1>Admin</h1>
                        <img src={insta} className='insta-icon' alt="" />
                    <img src={whatsapp} className='whatsapp-icon' alt="" />
                        <img src={mail} className='mail-icon' alt="" />


                    </div>


              </div>

              </div>
      }
      {showLogout && //<LogoutModal />
      <div className="logout-overlay" onClick={()=>{setShowLogout(false)}}>
                <div className="glass-card logout-contain" >
                    <p>Are You Sure ?</p>
                    <div className="btn-contains">
                        <button onClick={logout} className='logout-btn' >Logout</button>
                        <button onClick={()=>{setShowLogout(false)}} className='can-btn' >Cancel</button>
                    </div>
                    </div>
                    
            </div>
      }
    </>
  );
};

export default ModalManager;