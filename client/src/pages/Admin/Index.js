import "./admin.css";
import React, { useEffect, useState } from "react";
import Breadcrumb from "../../commons/Breadcrumb";
import { Link } from "react-router-dom";
import useAxiosInterceptor from "../../hooks/useAxiosInterceptor";
import Aside from "./component/Aside";
const Index = () => {
  // 회원 목록
  const [members, setMembers] = useState(null);
  // 회원 목록 불러오기
  const AuthAxios = useAxiosInterceptor();
  useEffect(()=>{
    const controller = new AbortController();
    const getUsers = async () => {
      try{
        const response = await AuthAxios.get("/api/manager/users",{
          signal: controller.signal
        });
          response && setMembers(response.data);
      } catch (err) {
        console.log(`error 발생: ${err}`);
      }
    }
    getUsers();
    return () => {
      controller.abort();
    }
  },[AuthAxios]);
  const memberInfoList = members?.map((ele) => {
      return (
        <li key={ele?.userNo}>
          <Link className="flex" to={`/admin/${ele?.userNo}`}>
            <p className="list_userCode">{ele?.userCode?.split("_")[1]}</p>
            <p className="list_userNo">{ele?.userNo}</p>
            <p className="list_name">{ele?.name}</p>
            <p className="list_dept">{ele?.dept}</p>
            <p className="list_email">{ele?.email}</p>
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
                {members && memberInfoList}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Index;
