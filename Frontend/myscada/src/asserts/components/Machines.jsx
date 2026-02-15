import React, { useEffect, useState } from 'react'
import axios from 'axios'
import BURL from './URL';

const Machines = () => {
    const [machine, setMachine] = useState([]);
    const URL = BURL+'machines';

    useEffect(()=>{
        const fetch_machine = async () => {
            try{
                const response = await axios.get(URL);
                console.log('Response : ', response.data);
                setMachine(response.data);
            }
            catch(error){
                console.log('Error : ', error);
            }
            

        }
        fetch_machine();
    },[]);
    
  return (
    <div>
        <h2>Machines List</h2>
        <table>
            <thead>
                <th style={{padding:'10px'}}>Machine ID</th>
                <th style={{padding:'10px'}}>User ID</th>
                <th style={{padding:'10px'}}>Name</th>
                <th style={{padding:'10px'}}>HTSC</th>
                <th style={{padding:'10px'}}>Location</th>
                <th style={{padding:'10px'}}>Capacity</th>
            </thead>
            <tbody>
            {
                machine.map((mc)=>(
                    <tr key={mc.mid}>
                        <td style={{padding:'10px'}}>{mc.mid}</td>
                        <td style={{padding:'10px'}}>{mc.user_id}</td>
                        <td style={{padding:'10px'}}>{mc.mname}</td>
                        <td style={{padding:'10px'}}>{mc.htsc}</td>
                        <td style={{padding:'10px'}}>{mc.location}</td>
                        <td style={{padding:'10px'}}>{mc.capacity} kW</td>
                    </tr>
                ))
            }
            </tbody>
        </table>
        <ul>
            
        </ul>
    </div>
  )
}

export default Machines
