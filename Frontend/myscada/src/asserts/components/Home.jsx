import {useNavigate} from 'react-router-dom';
import '../styles/Home.css';
/**

export default function Home(){
    const navigate = useNavigate();
    return (
        <div className="b">
            <div className="contain">
                <h1 className="title">Abi's Scada System</h1>
                <button className="sbtn" onClick={()=>navigate('/login')}>Get Started</button>
            </div>
        </div>
    );
}
import React from 'react';
import './App.css';
**/
function Home() {
    const navigate = useNavigate();
  return (
    <div className="landing-page">
      <header className="navbar">
        <div className="logo">ABI <span>SCADA</span></div>
        <nav>
          <a href="#features" style={{color: 'white', marginRight: '20px', textDecoration: 'none'}}>Features</a>
          <a href="#contact" style={{color: 'white', textDecoration: 'none'}}>Contact</a>
        </nav>
      </header>

      <section className="hero">
        <h1>Windmill Intelligence System</h1>
        <p>Next-generation SCADA monitoring for sustainable energy fleets. Real-time data, predictive maintenance, and total control.</p>
        <button className="btn-primary" onClick={()=>navigate('login')}>Launch Dashboard</button>
      </section>

      <section id="features" className="features-grid">
        <div className="feature-card">
          <h3>⚡ Peak Performance</h3>
          <p>Optimize energy output by adjusting turbine pitch in real-time based on AI wind predictions.</p>
        </div>
        <div className="feature-card">
          <h3>🛡️ Cyber-Secure</h3>
          <p>Encryption-first architecture ensures your infrastructure stays safe from digital threats.</p>
        </div>
        <div className="feature-card">
          <h3>📊 Live Analytics</h3>
          <p>Monitor vibrations, RPM, and temperature from a single, unified glass-morphism interface.</p>
        </div>
      </section>
      <section id="contact" className="features-grid contact-section">
        <div className="feature-card">
          <h3>Address</h3>
          <p>Optimize energy output by adjusting turbine pitch in real-time based on AI wind predictions.</p>
        </div>
        <div className="feature-card">
          <h3>Phone & Mail</h3>
          <p>Encryption-first architecture ensures your infrastructure stays safe from digital threats.</p>
        </div>
        <div className="feature-card">
          <h3>Social Media</h3>
          <p>Monitor vibrations, RPM, and temperature from a single, unified glass-morphism interface.</p>
        </div>
      </section>
    </div>
  );
}

export default Home;