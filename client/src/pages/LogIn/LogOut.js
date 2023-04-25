import React, { useContext, useEffect } from "react";
import { LogInContext } from "../../commons/LogInContext";
import { useNavigate } from "react-router";
import axios from "axios";

export default function LogOut() {
  const { token, setToken, loggedUser, setLoggedUser, loggedIn, setLoggedIn } =
    useContext(LogInContext);
  const navigate = useNavigate();

  if (token === null) {
    navigate("/login");
  } else {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      // 확인 버튼 클릭시
      axios.post("http://localhost:8080/api/logout", {}).then((res) => console.log(res)).catch((err) => console.log(err));
      localStorage.removeItem("jwt");
      setLoggedUser({
        id: "",
        name: "",
        exp: "",
        userCode: "",
        userNo: "",
    });
    setLoggedIn(false);
    navigate("/login");
    setToken(null);
    console.log("로그아웃 완료");
    } else {
      // 취소 버튼 클릭시
      console.log("로그아웃 취소");
      return false;
    }
  }
}
