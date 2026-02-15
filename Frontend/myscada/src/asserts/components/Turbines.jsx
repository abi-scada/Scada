import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';

const Turbines = () => {
    const [turbine, setTurbine] = useState([]);
    const URL = 'http://127.0.0.1:8000/turbine-datum';

    useEffect(()=>{
        const fetch_turbine = async () => {
            try{
                const response = await axios.get(URL);
                console.log('Response : ', response.data);
                setTurbine(response.data);
            }
            catch(error){
                console.log('Error : ', error);
            }
            

        }
        fetch_turbine();
    },[]);
    const headers = turbine.length > 0 ? Object.keys(turbine[0]) : [];
  return (
    <div style={{fontSize:"10px"}}>
      <h2>Machines List</h2>
        <table >
            <thead>
                <tr>
                    {
                        headers.map((key) => (
                            <th key={key-1} style={{padding:'10px'}}>{key.toUpperCase()}</th>
                        ))
                    }
                </tr>
            </thead>
            <tbody>
            {
                turbine.map((row, index)=>(
                    <tr key={index}>
                        {headers.map((key)=>(
                            <td style={{padding:'10px'}} key={index-key}>{typeof row[key] === 'object' ? JSON.stringify(row[key]) : row[key]}</td>
                        ))}
                        
                    </tr>
                ))
            }
            </tbody>
        </table>
    </div>
  );
}

export default Turbines
