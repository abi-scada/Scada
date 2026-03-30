import { useNavigate } from 'react-router-dom'
import '../styles/Admin.css'
import HomeIcon from '../icons/home.png'



const AdminDashboard = () => {
const navigate = useNavigate();
    return (
    <div className='admin-panel-container'>
        <button className='back-button' onClick={()=>navigate('/')}> <img className='undo-icon' src={HomeIcon} alt="" /> </button>
        
      
        <h3 className='admin-panel-title'>Admin Panel</h3>
        
        <button className='manage-user-button' onClick={()=>{navigate('/admin/users')}}>Manage Users</button>
        
    </div>
  )
}

export default AdminDashboard
