import React, { useState, useEffect } from "react";

const useDebounceHook = ({ searchQuery, delay }) => {
  const [debouncedValue, setDebouncedValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(searchQuery);
    }, delay);

    // Cleanup function to clear the timer
    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery, delay]);

  return debouncedValue;
};

export default useDebounceHook;
