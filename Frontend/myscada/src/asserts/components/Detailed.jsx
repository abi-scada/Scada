import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import '../styles/Detailed.css'
import Cookies from 'js-cookie';
import Header from './Header';
import summary from '../icons/summary.png'
import control from '../icons/admin-panel.png'
import report from '../icons/report.png'
import chart from '../icons/bar-chart.png'
import week from '../icons/7-days.png'
import BackButton from '../icons/back-button.png';
import dwld from '../icons/download.png'



import BasicChart from './Line';
import BURL from './URL';

const URL = BURL+"turbine-data/"
const WEEK_URL = BURL+"turbine/week/"
 
const Detailed = () => {
  const [tdata, setTdata] = useState([]);
  const [activeTab, setActiveTab] = useState('Summary');
  const [tab, setTab] = useState(3);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [typ, setTyp] = useState("pdf");
  const [status, setStatus] = useState("");
  const [offset, setOffset] = useState(0);
 const [weekData, setWeekData] = useState([]);
 const [isWeekLoading, setIsWeekLoading] = useState(false);
  const {state} = useLocation();
  const {mc_id, mc_name, mc_loc, mc_cap, mc_htsc} = state;
  const id = mc_id;
  const limit = 100;

  const loader = useRef(null);


  
  const usr = Cookies.get("user_id");
  
  const navigate = useNavigate();
  
  useEffect(()=>{
  const getTurbineData = async () => {
      
      try{
        const res = await axios.get(URL+id);
        setTdata(res.data);
        setStatus(res.data[0].status); 
      }
      catch(e){
        console.log(e);
      }
      finally{

        
      }
    }
    getTurbineData();
    const interval = setInterval(getTurbineData, 10000);
    
    return () => clearInterval(interval)
  },[]);
  useEffect(()=>{
    const get_week = async () => {
      setIsWeekLoading(true);
      const res = await axios.get(WEEK_URL, {
        params:{
          machine_id: id,
          offset: offset,
          limit: limit,
        }
      });
      console.log("Week API response:", res.data);
      setWeekData(prev => [...prev, ...res.data]);
      setIsWeekLoading(false);
    };
    get_week();
  },[offset]);
  useEffect(() => {
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !isWeekLoading) {
      setOffset(prev => prev + limit);
    }
  });

  if (loader.current) observer.observe(loader.current);

  return () => observer.disconnect();
}, [isWeekLoading]);
 
  //console.log(id);
  //console.log(typeof tdata);
  const headers = tdata.length > 0 ? Object.keys(tdata[0]) : [];

  const downloadReport = async (type, params) =>{
    try{
      
      console.log(startDate);
    const data = await axios.get(
      BURL+"turbine/"+type,{
        params,
        responseType: "blob"
      }
    )
    const url = window.URL.createObjectURL(new Blob([data.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      "download",
      type === "csv" ? "report.csv" : "report.pdf"
    );
    document.body.appendChild(link);
    link.click();
    }
    catch(e){
      console.log(e);
    }
    finally{
      
    }
  };

  const getTime = (turbine) => {
        if(turbine.created_at){
          const dt = turbine.created_at;
          //console.log(dt);
          const [, time] = dt.split("T");
          return time
        }
    }
    const getDate = (turbine) => {
        if(turbine.created_at){
          const dt = turbine.created_at;
          //console.log(turbine);

          const [date, ] = dt.split("T");
          return date
        }
    } 
    const changeTab = (id) => {
      setTab(id+1);
    }
    //Tab 
    const tabs = [
      {name:'Control', icon: control},
      {name:'Charts', icon: chart},
      {name:'Summary', icon: summary},
      {name:'Reports', icon: report},
      {name:'Week', icon: week},
    ]
    // const navItems = document.querySelectorAll('.tab');
    // if (navItems.length>0){
    //   navItems[0].classList.add('active-tab');
    // }
    // navItems.forEach(item => {
    //   item.addEventListener('click', function(){
    //     document.querySelector('.tab.active-tab')?.classList.remove('active-tab');
    //     this.classList.add('active-tab');
    //   });
    // });
  return (
    <div className='detailed-root'>
      <div className='nav-container'>
      <Header  user={usr}/>
      </div> 
      <div className='bb' onClick={()=>navigate(-1)}><img src={BackButton} alt="" /></div>
      <div className="machine-info">
        <h4>Machine Info</h4>
        <p>Id : {id}</p>
        <p>Name : {mc_name}</p>
        <p>HTSC : {mc_htsc}</p>
        <p>Location : {mc_loc}</p>
        <p>Capacity : {mc_cap}</p>
      </div>
      <div className="curr-sts"><h3>{status}</h3></div>
      <div className="detailed-tab-container">
        <ul className="tab-list">
          {tabs.map((tab,index)=>(
            <li
              key={tab.name}
              className={activeTab === tab.name ? 'tab active-tab' : 'tab'}
              onClick={()=>{
                setActiveTab(tab.name);
                changeTab(index);
                
              }}
            ><img src={tab.icon} className='tab-icons' alt="" />
              {tab.name}
            </li>))}
        </ul>
        <h2>. . .</h2>
      </div>
      
        <div className={tab === 1 ? "show-tab" : "ta"}>
          <div className='control-container'>
            <div className="tac">
              <div className="line">
              </div>
              <div className="display">
                <p>Date Time <br />
                R 00 RPM G 0000 RPM 000.0 kW   00.0 M/S</p>
                Gen. 
              </div>
              <div className="keyboard">
                <div>7</div>{/*first row*/}
                <div>8</div>
                <div>9</div>
                <div>RESET</div>
                <div><div>START</div></div>
                <div><div>STOP</div></div>
                <div>Lr</div>
                <div>Rr</div>
                <div>4</div>{/*second row*/}
                <div>5</div>
                <div>6</div>
                <div>UP</div>
                <div>1</div>{/*third row*/}
                <div>2</div>
                <div>3</div>
                <div>L</div>
                <div>R</div>
                <div>CLEAR</div>{/*FORTH row*/}
                <div>0</div>
                <div>.</div>
                <div>,</div>
                <div>PREV.</div>
                <div>Dn</div>
                <div>ENTER</div>
              </div>

            </div>
          </div>
        </div>
        <div className={tab === 2 ? "show-tab" : "ta"}>
          <div className="chart-container">
            <BasicChart id={id} />
          </div>
        </div>    
        <div className={tab === 3 ? "show-tab" : "ta"}>
          <div className="detailed-table-container">
            <table className='detailed-table'>
            <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>RRPM</th>
                  <th>GRPM</th>
                  <th>Status</th>
                  <th>Wind</th>
                  <th>Power</th>
                  <th>Hyd<br/>Press</th>
                  <th>Nac<br/>Pos</th>
                  <th>Fq</th>
                  <th>PF</th>
                  <th>L1</th>
                  <th>L2</th>
                  <th>L3</th>
                  <th>I1</th>
                  <th>I2</th>
                  <th>I3</th>
                  <th>Amb<br/>Temp</th>
                  <th>Nac<br/>Temp</th>
                  <th>G.Bear<br/>Temp</th>
                  <th>G.Oil<br/>Temp</th>
                  <th>G<br/>Temp</th>
                  <th>g<br/>Temp</th>
                  <th>Thy<br/>Temp</th>
                  <th>Main<br/>Temp</th>
                  <th>G<br/>kW</th>
                  <th>g<br/>kW</th>
                  <th>Total<br/>kW</th>
                  <th>G<br/>Hrs</th>
                  <th>g<br/>Hrs</th>
                  <th>Total<br/>Hrs</th>
                </tr>
            </thead>
            <tbody>
            {
                tdata.map((turbine)=>(
                    <tr key={turbine.tid}>
                      <td>{getDate(turbine)}</td>
                      <td>{getTime(turbine)}</td>
                      <td>{turbine.rrpm}</td>
                      <td>{turbine.grpm}</td>
                      <td>{turbine.status}</td>
                      <td>{turbine.wind}</td>
                      <td>{turbine.power}</td>
                      <td>{turbine.hyd_press}</td>
                      <td>{turbine.nac_pos}</td>
                      <td>{turbine.fq}</td>
                      <td>{turbine.fq}</td>
                      <td>{turbine.l1}</td>
                      <td>{turbine.l2}</td>
                      <td>{turbine.l3}</td>
                      <td>{turbine.i1}</td>
                      <td>{turbine.i2}</td>
                      <td>{turbine.i3}</td>
                      <td>{turbine.amb_temp}</td>
                      <td>{turbine.nac_temp}</td>
                      <td>{turbine.gb_temp}</td>
                      <td>{turbine.go_temp}</td>
                      <td>{turbine.g1_temp}</td>
                      <td>{turbine.g2_temp}</td>
                      <td>{turbine.thy_temp}</td>
                      <td>{turbine.main_temp}</td>
                      <td>{turbine.g1_kw}</td>
                      <td>{turbine.g2_kw}</td>
                      <td>{turbine.total_kw}</td>
                      <td>{turbine.g1_hrs}</td>
                      <td>{turbine.g2_hrs}</td>
                      <td>{turbine.total_hrs}</td>                    
                    </tr>
                ))
            }
            </tbody>
        </table>
          </div>
        </div>       
        <div className={tab === 4 ? "show-tab" : "ta"}>
            <form className="report-container" onSubmit={ 
            (e)=>{
              e.preventDefault();
              downloadReport(
              typ,
              {
                machine_id : id,
                start_date : startDate,
                end_date : endDate
              }
            );}}>
              <h2>Download Your Report</h2>
              <input type="datetime-local" placeholder='Start Date' value={startDate} onChange={e=>setStartDate(e.target.value+":00")} required />
          <input type="datetime-local" value={endDate}onChange={e=>setEndDate(e.target.value+":00")} required/>
          <select name="type" id=" " onChange={(val)=>{
            
            setTyp(val.target.value);
            //console.log(typ);
          }} required>
            <option value="pdf">PDF</option>
            <option value="csv">CSV</option>
          </select>
          
          <button type='submit' className='glass-card download-btn'><img className='d-img' src={dwld} alt="" /> <h4>Download</h4></button>
          
    
            </form>
        </div>
        <div className={tab === 5 ? "show-tab" : "ta"}>
          <div className="table-wrap">
          <table className='detailed-table week'>
            <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>RRPM</th>
                  <th>GRPM</th>
                  <th>Status</th>
                  <th>Wind</th>
                  <th>Power</th>
                  <th>Hyd<br/>Press</th>
                  <th>Nac<br/>Pos</th>
                  <th>Fq</th>
                  <th>PF</th>
                  <th>L1</th>
                  <th>L2</th>
                  <th>L3</th>
                  <th>I1</th>
                  <th>I2</th>
                  <th>I3</th>
                  <th>Amb<br/>Temp</th>
                  <th>Nac<br/>Temp</th>
                  <th>G.Bear<br/>Temp</th>
                  <th>G.Oil<br/>Temp</th>
                  <th>G<br/>Temp</th>
                  <th>g<br/>Temp</th>
                  <th>Thy<br/>Temp</th>
                  <th>Main<br/>Temp</th>
                  <th>G<br/>kW</th>
                  <th>g<br/>kW</th>
                  <th>Total<br/>kW</th>
                  <th>G<br/>Hrs</th>
                  <th>g<br/>Hrs</th>
                  <th>Total<br/>Hrs</th>
                </tr>
            </thead>
            <tbody>
            {
                weekData.map((turbine)=>(
                    <tr key={turbine.tid}>
                      <td>{getDate(turbine)}</td>
                      <td>{getTime(turbine)}</td>
                      <td>{turbine.rrpm}</td>
                      <td>{turbine.grpm}</td>
                      <td>{turbine.status}</td>
                      <td>{turbine.wind}</td>
                      <td>{turbine.power}</td>
                      <td>{turbine.hyd_press}</td>
                      <td>{turbine.nac_pos}</td>
                      <td>{turbine.fq}</td>
                      <td>{turbine.fq}</td>
                      <td>{turbine.l1}</td>
                      <td>{turbine.l2}</td>
                      <td>{turbine.l3}</td>
                      <td>{turbine.i1}</td>
                      <td>{turbine.i2}</td>
                      <td>{turbine.i3}</td>
                      <td>{turbine.amb_temp}</td>
                      <td>{turbine.nac_temp}</td>
                      <td>{turbine.gb_temp}</td>
                      <td>{turbine.go_temp}</td>
                      <td>{turbine.g1_temp}</td>
                      <td>{turbine.g2_temp}</td>
                      <td>{turbine.thy_temp}</td>
                      <td>{turbine.main_temp}</td>
                      <td>{turbine.g1_kw}</td>
                      <td>{turbine.g2_kw}</td>
                      <td>{turbine.total_kw}</td>
                      <td>{turbine.g1_hrs}</td>
                      <td>{turbine.g2_hrs}</td>
                      <td>{turbine.total_hrs}</td>                    
                    </tr>
                    
                ))
            }
            <tr>
              <td colSpan="31">
                <div ref={loader} style={{ height: "40px" }}>
                  {isWeekLoading && <p>Loading...</p>}
                </div>
              </td>
            </tr>

            </tbody>
          </table>
          </div>
        </div>
        
    
    
    </div>
  )
}

export default Detailed
