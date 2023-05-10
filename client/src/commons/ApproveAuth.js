import {useEffect} from "react";
import useAuth from "../hooks/useAuth";
import {Outlet, Navigate} from "react-router-dom";
import decodeJwt from "../hooks/decodeJwt";
const ApproveAuth = () => {
  const { token,setToken2, isAuth, setIsAuth,setLoggedUserInfo } = useAuth();
  useEffect(()=>{
    const AUTH_TOKEN = localStorage.getItem("jwt");
    const decodedPayload = AUTH_TOKEN && decodeJwt(AUTH_TOKEN);
    if(localStorage.getItem("jwt")){
      setToken2(token);
      setLoggedUserInfo({
        id: decodedPayload.sub,
        name: decodedPayload.name,
        exp: decodedPayload.exp,
        userCode: decodedPayload.userCode,
        userNo: decodedPayload.userNo
      });
    }
  },[]);
  return (
    // 토큰 유무에 따른 처리
    localStorage.getItem("jwt") ? <Outlet /> : <Navigate to="/login" replace />
  )
}

export default ApproveAuth;