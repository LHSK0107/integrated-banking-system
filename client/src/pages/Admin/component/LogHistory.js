import React, { useContext, useEffect, useState } from "react";
import Breadcrumb from "../../../commons/Breadcrumb";
import Aside from "./Aside";
import "../admin.css";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import ReactPaginate from "react-paginate";
import Paging from "./Paging";

const LogHistory = () => {
  // api에서 받아온 데이터
  const [log, setLog] = useState(null);
  // 로컬스토리지에서 jwt 가져오기
  const savedToken = localStorage.getItem("jwt");
  // pagination
  const [current, setCurrent] = useState([]); // 보여줄 데이터 
  const [page, setPage] = useState(1); // 현재 페이지
  const indexLast = page * 10;
  const indexFirst = indexLast - 10;

  const handlePageChange = (page) => {
    setPage(page);
  };

  useEffect(() => {
    logRecord();
    // console.log(log?.length);
    setCurrent(log?.slice(indexFirst, indexLast));
  }, [page, indexFirst, indexLast]);

  // 로그인 기록 가져오기
  const logRecord = () => {
    axios
      .get("http://localhost:8080/api/admin/logins", {
        headers: { Authorization: "Bearer " + savedToken },
      })
      .then((res) => {
        if (res.status === 200) {
          setLog(res.data);
          console.log(res);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {});
  };
  // 로그인 목록 뿌리기
  const logList =
  current &&
  current.map((ele, i) => {
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
              <Paging page={page} count={log?.length} handlePageChange={handlePageChange} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LogHistory;
