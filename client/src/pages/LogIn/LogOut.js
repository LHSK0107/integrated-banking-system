import React, { useContext, useEffect } from "react";
import { LogInContext } from "../../commons/LogInContext";
import { useNavigate } from "react-router";
import axios from "axios";
import useAuth from "../../hooks/useAuth";

export default function LogOut() {
  const { setIsAuth, setLoggedUserInfo, setToken2, token } = useAuth();
  const navigate = useNavigate();

  if (token === null) {
    navigate("/login");
  } else {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      // 확인 버튼 클릭시
      axios
        .post("https://iam-api.site/api/logout", {})
        .then((res) => {
          localStorage.removeItem("jwt");
          setLoggedUserInfo(null);
          setIsAuth(false);
          setToken2(null);
          console.log("로그아웃 완료");
          navigate("/login");
        })
        .catch(
          (err) => {
            console.log(`logout axios error ${err}`);
            localStorage.removeItem("jwt");
            setLoggedUserInfo(null);
            setIsAuth(false);
            setToken2(null);
            console.log("로그아웃 완료");
            navigate("/login");
          }
        );
    } else {
      // 취소 버튼 클릭시
      console.log("로그아웃 취소");
      return false;
    }
  }
}
