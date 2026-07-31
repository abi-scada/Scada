import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");
  const [globalAlarm, setGlobalAlarm] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
    const [pro, setPro] = useState({});//for profile data


  return (
    <AppContext.Provider
      value={{
        userId,
        setUserId,
        userName,
        setUserName,
        globalAlarm,
        setGlobalAlarm,
        showProfile,
        setShowProfile,
        showLogout,
        setShowLogout,
        pro,
        setPro
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);