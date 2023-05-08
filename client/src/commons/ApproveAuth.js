import {useEffect} from "react";
import useAuth from "../hooks/useAuth";
import {Outlet, Navigate} from "react-router-dom";
const ApproveAuth = () => {
    const { isAuth, setIsAuth } = useAuth();
    useEffect(()=>{localStorage.getItem("jwt") && setIsAuth(true)});
  return (
    // 토큰 유무에 따른 처리
    isAuth && localStorage.getItem("jwt") ? <Outlet /> : <Navigate to="/login" replace />
  )
}

export default ApproveAuth;