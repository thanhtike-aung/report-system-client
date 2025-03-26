import { useEffect, useState } from "react";

const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? (item as T) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const removeItem = () => {
    try {
      localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem(key, storedValue as string);
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue, removeItem] as const;
};

export default useLocalStorage;
