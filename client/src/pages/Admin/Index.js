import React, { useContext, useEffect, useState } from "react";
import Breadcrumb from "../../commons/Breadcrumb";
import { Link, useNavigate } from "react-router-dom";
import { LogInContext } from "../../commons/LogInContext";
import decodeJwt from "../../hooks/decodeJwt";
import axios from "axios";
import "./admin.css";
import Aside from "./component/Aside";

const Index = () => {
  const { token, setToken, loggedUser, setLoggedUser, loggedIn, setLoggedIn } =
    useContext(LogInContext);
  const navigate = useNavigate();
  // 로컬스토리지에서 jwt 가져오기
  const savedToken = localStorage.getItem("jwt");
  setToken(savedToken);
  
  useEffect(() => {
    if (savedToken === null) {
        setLoggedUser({
            id: "",
            name: "",
            exp: "",
            userCode: "",
            userNo: "",
        });
        setLoggedIn(false);
    } else {
        const decodedPayload = decodeJwt(savedToken);
        setLoggedUser({
            id: decodedPayload.sub,
            name: decodedPayload.name,
            exp: decodedPayload.exp,
            userCode: decodedPayload.userCode,
            userNo: decodedPayload.userNo,
        });
        setLoggedIn(true);
        // 회원 목록 불러오기
        memberList();
    }
}, [setLoggedUser]);

// 회원 목록
const [members, setMembers] = useState(null);
// 회원 목록 불러오기
const memberList = () => {
  axios
    .get("http://localhost:8080/api/manager/users", 
      {
      headers: {Authorization: "Bearer "+ savedToken},
      }
    )
    .then((res) => {
      console.log(res);
      if (res.status === 200) {
        setMembers(res.data);
        console.log(res);
      }
    })
    .catch((err) => console.log(err))
    .finally(() => {});
};

  const memberInfoList =
    members &&
    members.map((ele) => {
      return (
        <li key={ele.userNo}>
          <Link className="flex" to={`/admin/${ele.userNo}`}>
            <p className="list_userCode">{ele?.userCode.split("_")[1]}</p>
            <p className="list_userNo">{ele.userNo}</p>
            <p className="list_name">{ele.name}</p>
            <p className="list_dept">{ele.dept}</p>
            <p className="list_email">{ele.email}</p>
          </Link>
        </li>
      );
    });

  return (
    <div id="wrap">
      <div className="inner">
        <Breadcrumb title={"관리자 페이지"} subMenu={"회원 목록"} />
        <div className="flex">
          <Aside now={"회원 목록"}/>
          <section className="admin_list">
            <h3>회원 목록</h3>
            <div className="list_wrap">
              <ul>
                <li className="list_column flex">
                  <p className="list_userCode">권한</p>
                  <p className="list_userNo">회원번호</p>
                  <p className="list_name">이름</p>
                  <p className="list_dept">부서</p>
                  <p className="list_email">이메일</p>
                </li>
                {memberInfoList}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Index;
