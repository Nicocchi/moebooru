import { useState, useEffect } from "react";

const getLocalValue = (key, initValue) => {
  // SSR
  if (typeof window === "undefined") return initValue;

  // Value already stored?
  const localValue = JSON.parse(localStorage.getItem(key));

  if (localValue) return localValue;

  // Function?
  if (initValue instanceof Function) return initValue();

  return initValue;
};

export const useLocalStorage = (key, initValue) => {
  const [value, setValue] = useState(() => {
    return getLocalValue(key, initValue);
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};
