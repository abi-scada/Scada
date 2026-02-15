import sth from '../icons/power-off.png'
import '../styles/LogoutButton.css'

const LogoutButton = ({setShowLogout}) => {
  
  return (
    <div title = 'Logout' onClick={()=>setShowLogout(prev=>!prev)} className='logoutContainer'>
      <img src={sth} className='logoutImg' alt="" />
    </div>
  )
}

export default LogoutButton
