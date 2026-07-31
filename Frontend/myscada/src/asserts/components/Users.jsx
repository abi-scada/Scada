import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
//import '../styles/Admin.css'
import '../styles/Users.css'
import BURL from './URL';
import SettingsIcon from '../icons/setting.png';
import DeleteButton from '../icons/delete.png';
import UndoIcon from '../icons/undo.png';



const Users =  () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    useEffect(() => {
        const fetch_user = async () => {
            try{
        const response = await axios.get(BURL+'users');
        //console.log('Data from FastAPI : ', response.data);
        setUsers(response.data);

        }catch(error){
            console.log('Error : ', error);
        }
        }
        fetch_user();
    }, []);
    const ViewUser = (user_id) =>{
        navigate('/view-machine', {state:user_id});
        //console.log("User id form Users: ",user_id);
    }

    const RemoveUser = async (user_id) => {
        try{
            const res = await axios.delete(BURL+"remove-user/"+user_id);
            if (res){
                console.log("deleted!!!")
            }
        
        }
        catch(e){
            console.log("Error : "+e);
        }
    }
    
    
  return (
    <div className='users-container'>
        {showConfirm&&
            <div className="modal-container">
                <div className="modal">
                    <div className='close-btn' onClick={() => {
                    setShowConfirm(false);
                    setSelectedUserId(null);
                    }}>&times;</div>
                <p>Are you sure you want to delete this user?</p>

                <div className="btn-contain">
                    <button
                    className="confirm-btn"
                    onClick={async () => {
                    await RemoveUser(selectedUserId);

                    // remove user from UI immediately
                    setUsers(users.filter(u => u.id !== selectedUserId));

                    setShowConfirm(false);
                    setSelectedUserId(null);
                    }}
                >
                    Yes, Delete
                </button>

                <button
                    className="cancel-btn"
                    onClick={() => {
                    setShowConfirm(false);
                    setSelectedUserId(null);
                    }}
                >
                    Cancel
                </button>
                </div>
                </div>
            </div>
        }
        <div className="manage-users">
            <h3 className='users-title'>Manage Users</h3>
            <button className='add-user-button' onClick={()=>{navigate('/signup')}}>Add User</button>
        </div>
        <button className='back-button' onClick={()=>navigate(-1)}> <img className='undo-icon' src={UndoIcon} alt="" /> </button>
        <div className="users-table-conntainer">
            <table className='users-table'>
                <thead className='users-table-head'>
                <th>User Id</th>
                <th>User Name</th>
                <th>User Mail</th>
                <th colSpan={2}>Manage</th>
                </thead>
                <tbody>
                    { 
                        users.map((user)=>(
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td><button className='edit' onClick={()=>ViewUser(user)}> <img className='settings-icon' src={SettingsIcon} alt="" /> </button></td>
                                <td><button className='del'onClick={()=>{
                                    setShowConfirm(true);
                                    setSelectedUserId(user.id);
                                }}><img className='delete-icon' src={DeleteButton} alt="" /></button></td>

                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default Users
