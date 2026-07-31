import { createContext, useContext, useEffect, useState } from "react";

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [dataDone, setDataDone] = useState(true);
  const [minTimeDone, setMinTimeDone] = useState(false);

  // minimum 500ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeDone(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // hide loader only when BOTH done
  useEffect(() => {
    if (minTimeDone && dataDone) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [minTimeDone, dataDone]);

  return (
    <LoadingContext.Provider value={{ loading, setDataDone }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
