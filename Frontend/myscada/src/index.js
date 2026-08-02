import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {UserProvider} from './asserts/components/UserContext';
import {ThemeProvider} from './asserts/components/ThemeContext';
import { LoadingProvider } from './asserts/components/LoadingContext';
import { BrowserRouter } from 'react-router-dom';

import "leaflet/dist/leaflet.css";

import "./utils/leafletIconFix";
import { AppProvider } from './context/AppContext';
import { GoogleOAuthProvider } from '@react-oauth/google';




const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  
  <React.StrictMode>
  <GoogleOAuthProvider clientId={"1012175163051-6es6m84g4e6ghi433to01kh644bq9qb7.apps.googleusercontent.com"}>
    <UserProvider>
      <ThemeProvider>
        <BrowserRouter>
          <LoadingProvider>
            <AppProvider>
              <App />
            </AppProvider>
          </LoadingProvider>
        </BrowserRouter>
      </ThemeProvider>
    </UserProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
