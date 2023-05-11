import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../commons/Breadcrumb";
import Aside from "./Aside";
import "../admin.css";
import { useNavigate } from "react-router";
import useAxiosInterceptor from "../../../hooks/useAxiosInterceptor";

const LogHistory = () => {
  const [log, setLog] = useState(null);
  const navigate = useNavigate();
  const AuthAxios = useAxiosInterceptor();

  useEffect(()=>{
    const controller = new AbortController();
    const logRecord = async () => {
      try{
        const response = await AuthAxios.get("/api/admin/logins",{
          signal: controller.signal
        });
        if (response.status === 200) {
          setLog(response.data);
        }
      } catch (err) {
        console.log(`error 발생: ${err}`);
      }
    }
    logRecord();
    return () => {
      controller.abort();
    }
  },[AuthAxios]);
  // 로그인 목록 뿌리기
  const logList =
    log && log.map((ele, i) => {
      return (
        <li key={i} className="flex">
          <p className="list_name">{ele.name}</p>
          <p className="list_dept">{ele.dept}</p>
          <p className="list_email">{ele.email}</p>
          <p className="list_email">{ele.loginDt.replace("T", "\t")}</p>
        </li>
      );
    });

  return (
    <div id="wrap">
      <div className="inner">
        <Breadcrumb title={"관리자 페이지"} subMenu={"로그인 기록 조회"} />
        <div className="flex">
          <Aside now={"로그인 기록 조회"} />
          <section className="log_list">
            <h3>로그인 기록 조회</h3>
            <div className="list_wrap">
              <ul>
                <li className="list_column flex">
                  <p className="list_name">이름</p>
                  <p className="list_dept">부서</p>
                  <p className="list_email">이메일</p>
                  <p className="list_time">로그인 시간</p>
                </li>
                {logList}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LogHistory;
