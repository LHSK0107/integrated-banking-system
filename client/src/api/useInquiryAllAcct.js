import useState, { useEffect } from "react";
import axios from "axios";

const useInquiryAllAcct = ( url ) => {
  const [apiData, setApiData]=useState([]);
  const [isLoading, setIsLoading]=useState(false);
  const [error, setError]=useState(null);

  useEffect(()=>{
    setIsLoading(true);
    axios.get(url)
    .then((res)=>{
      setApiData(res.data.RESP_DATA.REC);
    })
    .catch((err)=>setError(`에러 발생 ${err}`))
    .finally(()=>{
      setIsLoading(false);
    })
  },[url]);
  return {apiData, isLoading, error};
};
export default useInquiryAllAcct;