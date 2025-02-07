import React, { createContext, useContext, useState, useEffect } from "react";

// Create the context
const PercentageContext = createContext();

// Provider component
export const PercentageProvider = ({ children }) => {
  // Load from sessionStorage (or default to an empty object)
  const storedData = sessionStorage.getItem("pageToPercentage");
  const initialState = storedData ? JSON.parse(storedData) : {};

  const [pageToPercentage, setPageToPercentage] = useState(initialState);

  // Save to sessionStorage whenever `pageToPercentage` updates
  useEffect(() => {
    sessionStorage.setItem(
      "pageToPercentage",
      JSON.stringify(pageToPercentage)
    );
  }, [pageToPercentage]);

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
