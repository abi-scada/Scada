import React from 'react'
import '../styles/Footer.css'
import iBtn from "../icons/information.png"

import ro from '../ro_bl.png';

const Footer = () => {
  return (
    <div className='footer-container'>
      <div className="footer glass-card">
        <img src={iBtn} className='i-icon' alt="" />
        <div className="ro-contain">
            <img className="ros" src={ro} alt="Ro" />
            <p>Run<span> - Nominal Wind</span></p>
        </div>
        <div className="ro-contain">
            <img className="ros overWind" src={ro} alt="Ro" />
            <p><span>Run - </span>Over Wind</p>
        </div>
        <div className="ro-contain">
            <img className="ros orenge" src={ro} alt="Ro" />
            <p><span>Run - </span>Low Wind</p>
        </div>
        <div className="ro-contain">
            <img className="ros red" src={ro} alt="Ro" />
            <p>Error</p>
        </div>
        <div className="ro-contain">
            <img className="ros blue" src={ro} alt="Ro" />
            <p>Grid Drop</p>
        </div>

      </div>
    </div>
  )
}

export default Footer
