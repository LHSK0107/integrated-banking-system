import { useState, useEffect } from "react";
import axios from "axios";

function useAxiosAcctInquiry ( url ) {
  const [apiData, setApiData]=useState(null);
  const [isLoading, setIsLoading]=useState(false);
  const [error, setError]=useState(null);

  const imsiValue = localStorage.getItem("jwt");

  useEffect(()=>{
    const fetchController = new AbortController();
    const signal = fetchController.signal;
    setIsLoading(true);
    axios
      .get(url, {
        signal: signal
      })
      .then((res) => {
        setApiData(res.data.RESP_DATA.REC);
      })
      .catch((err) => setError(`에러 발생 ${err}`))
      .finally(() => {
        setIsLoading(false);
      });
    return () => {
      fetchController.abort();
    }
  },[url]);
  return { apiData, isLoading, error };
}; 
export default useAxiosAcctInquiry;