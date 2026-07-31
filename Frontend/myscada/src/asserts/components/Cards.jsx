import ro from '../../asserts/ro_bl.png';
//import './Cards.css';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from './UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Cards(props){
    const {mid, mname, htsc, location} = props.machine1;
    const {user} = useContext(UserContext);
    const [details, setDetails] = useState([]); 
    const [tdata, setTdata] = useState([]);
    
    const [loading, setLoading] = useState(true);
    console.log("Machine ID: ",mid);

    const URL = 'http://127.0.0.1:8000/turbine-data/';
    const MURL = 'http://127.0.0.1:8000/my-machines/'+user;
    console.log("User : ", user);

    const navigate = useNavigate();
    
    

    useEffect(()=>{
        fetch_machine();
        const interval = setInterval(()=>{
            fetch_machine();
        }, 15000);
        return () => clearInterval(interval);
    },[]);

    const fetch_machine = async () => {
            try{
                const response = await axios.get(MURL);
                console.log('M Response : ', response.data);
                setDetails(response.data);
                const data = response.data
                const mids = data.map(m=> m.mid);
                console.log("M id : ", mids)
                const turbRes = await Promise.all(
                    mids.map((id)=>{
                        console.log("Id : ",typeof id);
                        const intid = Number(id);
                        return axios.get('http://127.0.0.1:8000/turbine-data/${intid}');
                    })
                )
                console.log("T Res: ",turbRes);
                const tlist = turbRes.map((res)=>res.data);
                setTdata(tlist);
                console.log("T Data: ",tdata);
                setLoading(false);
            }
            catch(error){
                console.log('Error : ', error);
            }
            
        }
    
    
    const Machine = {
        mId : mid,
        mName : mname,
        htsc : htsc,

    }
    console.log("Status :",)
    function handle_click(){
        return navigate('/detailed',{state:{id:mid}})
    }
    if (loading || !details){
        return <div>Loading Data ........</div>
    }
    return(
        <div onClick={handle_click} className="card-container">
            <div className="ro-container">
                <h5 className="nm">{Machine.mId}-{Machine.mName} - {Machine.htsc}</h5>
                <h5 className="nm">{location}</h5>
                <img className='ro' src={ro} alt="Ro" />
            </div>
            <div className="discMc">
                <h5 className="sts">{}</h5>
                <p>Wind : {}</p>
                <p>Gen. : {}</p>
            </div>
        </div>
    )
}