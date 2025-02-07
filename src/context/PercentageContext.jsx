import React, { createContext, useContext, useState } from "react";

// Create the context
const PercentageContext = createContext();

// Provider component to wrap the app
export const PercentageProvider = ({ children }) => {
  const [pageToPercentage, setPageToPercentage] = useState({});

  return (
    <PercentageContext.Provider
      value={{ pageToPercentage, setPageToPercentage }}
    >
      {children}
    </PercentageContext.Provider>
  );
};

// Custom hook for easy access
export const usePercentageContext = () => useContext(PercentageContext);
