import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BURL from './URL';

function AdminLogin() {
    const navigate = useNavigate();

    return (
        <div className='admin-login-container'>
            <h1>Admin Login</h1>

            <GoogleLogin
                onSuccess={async (res) => {
                    try {
                        const result = await axios.post(
                            BURL + "admin/google-login",
                            {
                                credential: res.credential
                            }
                        );

                        

                        localStorage.setItem(
                            "adminToken",
                            result.data.token
                        );

                        navigate("/admin");

                    } catch (err) {
                        console.error(err);

                        if (err.response) {
                            alert(err.response.data.detail);
                        } else {
                            alert("Unable to connect to the server.");
                        }
                    }
                }}

                onError={() => {
                    alert("Google login failed");
                }}
            />
        </div>
    );
}

export default AdminLogin;