import { useState } from "react";

function useToken(key: string, initialValue: string = ""){
  const [ value, setValue ] = useState(()=>{
    const storedValue = localStorage.getItem(key);
    return storedValue || initialValue;
  });
  const ctx = {
    value,
    set: (value: string)=>{
      setValue(value);
      localStorage.setItem(key, value);
    }
  }
  return ctx;
}

export default useToken;