import axios from 'axios';
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Admin.css'
import '../styles/User.css'
import BURL from './URL';
import SettingsIcon from '../icons/setting.png';
import DeleteButton from '../icons/delete.png';
import UndoIcon from '../icons/undo.png';

const ViewUser = () => {
    const {state} = useLocation();
    const {id} = state; 
    const user_id = id;
    //console.log("User id : ",user_id);
    const URL = BURL+'my-machines/'+user_id;
    const [machines, setMachines] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedMachineId, setSelectedMachineId] = useState(null);
    const [uname, setUname] = useState("");
    const navigate = useNavigate();
    useEffect(()=>{
        const getUser = async () => {
            try{
                const res = await axios.get(URL);
                setMachines(res.data);
                const nameRes = await axios.get(BURL+'get-usr/'+user_id);
                //console.log(nameRes);
                setUname(nameRes.data);
            }
            catch(e){
                console.log(e)
            }
            
        }
        getUser();
    },[]);

    //console.log("Uname and Machines : ",uname,machines);
    const handleAddMachine = () => {
        navigate('/admin/add-mc', {
            state:{
                user_id:user_id
            }
        })
    }
    
    const RemoveMachine = async (machine_id) => {
        try{
            const res = await axios.delete(BURL+"remove-machine/"+machine_id);
            if (res){
                console.log("deleted!!!")
            }
        
        }
        catch(e){
            console.log("Error : "+e);
        }
    }
    
  return (
    <>
        {showConfirm&&
            <div className="modal-container">
                <div className="modal">
                    <div className='close-btn' onClick={() => {
                    setShowConfirm(false);
                    setSelectedMachineId(null);
                    }}>&times;</div>
                <p>Are you sure you want to delete this user?</p>

                <div className="btn-contain">
                    <button
                    className="confirm-btn"
                    onClick={async () => {
                    await RemoveMachine(selectedMachineId);

                    // remove user from UI immediately
                    setMachines(machines.filter(u => u.id !== selectedMachineId));

                    setShowConfirm(false);
                    setSelectedMachineId(null);
                    }}
                >
                    Yes, Delete
                </button>

                <button
                    className="cancel-btn"
                    onClick={() => {
                    setShowConfirm(false);
                    setSelectedMachineId(null);
                    }}
                >
                    Cancel
                </button>
                </div>
                </div>
            </div>
        }

    <div className='user-container'>
        <button className='back-button' onClick={()=>navigate(-1)}><img className='undo-icon' src={UndoIcon} alt="" /> </button>

      <h4 className='user-title'>Manage User : <span>{uname}</span></h4>
      <div>
        <div className='manage-user'><h4>Machines List</h4>
        <button className='add-turbine-button' onClick={handleAddMachine}>Add Tutbine</button>
        </div>
        <div className="user-table-container">
            <table className='turbines-table'>
            <thead className='turbines-table-head'>
                <th >Machine ID</th>
                <th >User ID</th>
                <th >Name</th>
                <th >HTSC</th>
                <th >Location</th>
                <th >Capacity</th>
                <th colSpan={2}>Manage</th>
            </thead>
            <tbody className='turbines-table-body'>
            {
                machines.map((mc)=>(
                    <tr key={mc.mid}>
                        <td>{mc.mid}</td>
                        <td>{mc.user_id}</td>
                        <td>{mc.mname}</td>
                        <td>{mc.htsc}</td>
                        <td>{mc.location}</td>
                        <td>{mc.capacity} kW</td>
                        <td><button className='edit'> <img className='settings-icon' src={SettingsIcon} alt="" /> </button></td>
                        <td><button className='del'
                        onClick={()=>{
                                    setShowConfirm(true);
                                    setSelectedMachineId(mc.mid);
                                }}><img className='delete-icon' src={DeleteButton} alt="" /></button></td>
                        
                    </tr>
                ))
            }
            </tbody>
        </table>
        </div>
    </div>
    </div>
  
    </>    
)
}

export default ViewUser
