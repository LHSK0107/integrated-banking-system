import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:8080";

// const useCommonAxios = (url) => {
//   const [apiData, setApiData] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   useEffect(() => {
//   const AUTH_TOKEN = `Bearer ${localStorage.getItem("jwt")}`;
//     // https://axios-http.com/kr/docs/config_defaults 참조
//     // axios config default 설정
//     const instance = axios.create({
//       baseURL: BASE_URL,
//     });
//     const fetchController = new AbortController();
//     const signal = fetchController.signal;
//     setIsLoading(true);
//     instance
//       .get(url, {
//         signal: signal,
//       })
//       .then((res) => {
//         setApiData(res.data);
//       })
//       .catch((err) => setError(`에러 발생 ${err}`))
//       .finally(() => {
//         setIsLoading(false);
//       });
//     return () => {
//       fetchController.abort();
//     };
//   }, [url]);
//   return { apiData, isLoading, error };
// };


// // interceptor를 위해서 각 method별로 나눴던 것을 하나로 통합
// export const AuthAxios = (url, data, method) => {
//   const [apiData, setApiData] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   useEffect(() => {
//     const AUTH_TOKEN = `Bearer ${localStorage.getItem("jwt")}`;
//     const instance = axios.create({
//       baseURL: BASE_URL,
//       withCredentials: true,
//     });
//     instance.defaults.headers.common["Authorization"] = AUTH_TOKEN;
//     instance.defaults.headers.get["Content-Type"] = "application/json";
//     const fetchController = new AbortController();
//     const signal = fetchController.signal;
//     if (method === "get") {
//       instance.get(url, {signal: signal,})
//         .then((res) => {
//           setApiData(res.data);
//         })
//         .catch((err) => setError(`에러 발생 ${err}`))
//         .finally(() => {
//           setIsLoading(false);
//         });
//       return () => {
//         fetchController.abort();
//       };
//     } else if (method === "post") {
//       console.log(data,url);
//       instance.post(url,{signal: signal},
//           data
//         )
//         .then((res) => {
//           setApiData(res.data);
//         })
//         .catch((err) => setError(`에러 발생 ${err}`))
//         .finally(() => {
//           setIsLoading(false);
//         });
//       return () => {
//         fetchController.abort();
//       };
//     } else if (method === "put") {
//       instance
//         .put(
//           url,
//           {
//             signal: signal,
//           },
//           data
//         )
//         .then((res) => {
//           setApiData(res.data);
//         })
//         .catch((err) => setError(`에러 발생 ${err}`))
//         .finally(() => {
//           setIsLoading(false);
//         });
//       return () => {
//         fetchController.abort();
//       };
//     }
//   }, [url]);
//   return { apiData, isLoading, error };
// };

// export const AuthGetAxios = (url) =>{
//   const [apiData, setApiData] = useState(null);
//   const [isLoading, setIsLoading]=useState(false);
//   const [error, setError]=useState(null);
//   useEffect(()=>{
//     const AUTH_TOKEN = `Bearer ${localStorage.getItem("jwt")}`;
//     const instance = axios.create({
//       baseURL: BASE_URL,
//       withCredentials: true
//     });
//     instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;
//     instance.defaults.headers.get['Content-Type'] = "application/json";
//     const fetchController = new AbortController();
//     const signal = fetchController.signal;
//     instance
//       .get(url, {
//          signal: signal
//       })
//       .then((res) => {
//         setApiData(res.data);
//       })
//       .catch((err) => setError(`에러 발생 ${err}`))
//       .finally(() => {
//         setIsLoading(false);
//       });
//       return () => {
//         fetchController.abort();
//       };
//   },[url]);
//     return { apiData, isLoading, error};
// };

export default axios.create({
  baseURL: BASE_URL
});
export const AuthAxios = axios.create({
  baseURL: BASE_URL,
  headers: {'Content-Type':'application/json'},
  withCredentials: true
});