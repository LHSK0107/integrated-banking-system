import { useState, useEffect } from "react";
import axios from "axios";

const AUTH_TOKEN = `Bearer ${localStorage.getItem("jwt")}`;
const BASE_URL = "http://localhost:8080";

const useCommonAxios = ( url ) => {
  const [apiData, setApiData]=useState(null);
  const [isLoading, setIsLoading]=useState(false);
  const [error, setError]=useState(null);
  useEffect(()=>{
    // https://axios-http.com/kr/docs/config_defaults 참조
    // axios config default 설정
    const instance = axios.create({
      baseURL: BASE_URL
    });
    const fetchController = new AbortController();
    const signal = fetchController.signal;
    setIsLoading(true);
    instance
      .get(url, {
        signal: signal,
      })
      .then((res) => {
        setApiData(res.data);
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

export default useCommonAxios;

export const AuthGetAxios = (url) =>{
  const [apiData, setApiData] = useState(null);
  const [isLoading, setIsLoading]=useState(false);
  const [error, setError]=useState(null);
  useEffect(()=>{
    const instance = axios.create({
      baseURL: BASE_URL,
      withCredentials: true
    });
    instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;
    instance.defaults.headers.get['Content-Type'] = "application/json";
    const fetchController = new AbortController();
    const signal = fetchController.signal;
    instance
      .get(url, {
         signal: signal
      })
      .then((res) => {
        setApiData(res.data);
      })
      .catch((err) => setError(`에러 발생 ${err}`))
      .finally(() => {
        setIsLoading(false);
      });
      return () => {
        fetchController.abort();
      };
  },[url]);
    return { apiData, isLoading, error};
};

export const AuthPostAxios = (url) =>{
  const [apiData, setApiData] = useState(null);
  const [isLoading, setIsLoading]=useState(false);
  const [error, setError]=useState(null);

  useEffect(()=>{
    const instance = axios.create({
      baseURL: BASE_URL,
      withCredentials: true
    });
    instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;
    instance.defaults.headers.get['Content-Type'] = "application/json";
    const fetchController = new AbortController();
    const signal = fetchController.signal;
    instance
      .post(url, {
         signal: signal
      })
      .then((res) => {
        setApiData(res.data);
      })
      .catch((err) => setError(`에러 발생 ${err}`))
      .finally(() => {
        setIsLoading(false);
      });
      return () => {
        fetchController.abort();
      };
  },[url]);
    return { apiData, isLoading, error};
};