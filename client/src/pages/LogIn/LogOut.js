import React, { useContext, useEffect } from "react";
import { LogInContext } from "../../commons/LogInContext";
import { useNavigate } from "react-router";
import axios from "axios";
import useAuth from "../../hooks/useAuth";

export default function LogOut() {
  const { setIsAuth, setLoggedUserInfo } = useAuth();
  const { token, setToken, loggedUser, setLoggedUser, loggedIn, setLoggedIn } =
    useContext(LogInContext);
  const navigate = useNavigate();

  if (token === null) {
    navigate("/login");
  } else {
    localStorage.removeItem("jwt");
    if (window.confirm("로그아웃 하시겠습니까?")) {
      // 확인 버튼 클릭시
      axios
        .post("http://localhost:8080/api/logout", {})
        .then((res) => {
          setLoggedUserInfo({
            id: "",
            name: "",
            exp: "",
            userCode: "",
            userNo: "",
          });
          setIsAuth(false);
          setToken(null);
          console.log("로그아웃 완료");
          navigate("/login");
        })
        .catch((err) => console.log(err));
    } else {
      // 취소 버튼 클릭시
      console.log("로그아웃 취소");
      return false;
    }
  }
}
