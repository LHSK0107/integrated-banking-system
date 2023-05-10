import "./admin.css";
import React, { useEffect, useState } from "react";
import Breadcrumb from "../../commons/Breadcrumb";
import { Link } from "react-router-dom";
import {AuthAxios} from "../../api/useCommonAxios";

const Index = () => {
  // 회원 목록
  const [members, setMembers] = useState(null);
  // 회원 목록 불러오기
  const response = AuthAxios("/api/manager/users",{},"get");

  useEffect(()=>{

    response && console.log(response);
  },[response]);
  const memberInfoList =
    members &&
    members?.map((ele) => {
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
          <aside>
            <div className="aside_wrap">
              <h2>관리자 페이지</h2>
              <ul className="aside_nav">
                <li className="aside_active">
                  <Link to="/">회원 목록</Link>
                </li>
                <li>
                  <Link to="/">계좌 열람 권한 관리</Link>
                </li>
                <li>
                  <Link to="/">로그인 기록 조회</Link>
                </li>
                <li>
                  <Link to="/">메뉴 클릭 기록 조회</Link>
                </li>
                <li>
                  <Link to="/">부서 관리</Link>
                </li>
              </ul>
            </div>
          </aside>
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
