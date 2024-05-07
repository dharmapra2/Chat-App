// Custom hook for managing counter state and actions
import { useState, useEffect } from "react";

const useCounterHook = () => {
  // State variables for count and running state
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Functions to handle start, pause, and reset actions
  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setCount(0);
    setIsRunning(false);
  };

  // Effect for updating count based on running state
  useEffect(() => {
    let intervalId: string | number | NodeJS.Timeout | undefined;

    if (isRunning) {
      intervalId = setInterval(() => {
        setCount((prevCount) => prevCount + 1);
      }, 1000);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [isRunning]);

  // Return state variables and action functions
  return { count, handleStart, handlePause, handleReset };
};

export default useCounterHook;
