import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../commons/Breadcrumb";
import Aside from "./Aside";
import "../admin.css";
import ReactPaginate from "react-paginate";
import Paging from "./Paging";
import useAxiosInterceptor from "../../../hooks/useAxiosInterceptor";

const LogHistory = () => {
  const AuthAxios = useAxiosInterceptor();
  // api에서 받아온 데이터
  const [log, setLog] = useState(null);

  // pagination
  // const [current, setCurrent] = useState([]); // 보여줄 데이터
  // const [page, setPage] = useState(1); // 현재 페이지
  // const indexLast = page * 10;
  // const indexFirst = indexLast - 10;

  // const handlePageChange = (page) => {
  //   setPage(page);
  // };

  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + 10;
  console.log(`Loading items from ${itemOffset} to ${endOffset}`);
  const currentItems = log?.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(log?.length / 10);
  const handlePageClick = (event) => {
    const newOffset = (event.selected * 10) % log.length;
    console.log(`User requested page number ${event.selected}, which is offset ${newOffset}`);
    setItemOffset(newOffset);
  };

  useEffect(() => {
    const controller = new AbortController();
    const logRecord = async () => {
      try {
        const response = await AuthAxios.get("/api/admin/logins", {
          signal: controller.signal,
        });
        if (response.status === 200) {
          setLog(response.data);
        }
      } catch (err) {
        console.log(`error 발생: ${err}`);
      }
    };

    logRecord();
    // setCurrent(log?.slice(indexFirst, indexLast));

    return () => {
      controller.abort();
    };
  }, [AuthAxios]);

  // 로그인 목록 뿌리기
  // const logList =
  //   log &&
  //   log.map((ele, i) => {
  //     return (
  //       <li key={i} className="flex">
  //         <p className="list_name">{ele.name}</p>
  //         <p className="list_dept">{ele.dept}</p>
  //         <p className="list_email">{ele.email}</p>
  //         <p className="list_email">{ele.loginDt.replace("T", "\t")}</p>
  //       </li>
  //     );
  //   });
  function Items({ currentItems }) {
    return (
      <>
        {currentItems &&
          currentItems.map((ele) => (
            <li className="flex">
              <p className="list_name">{ele.name}</p>
              <p className="list_dept">{ele.dept}</p>
              <p className="list_email">{ele.email}</p>
              <p className="list_email">{ele.loginDt.replace("T", "\t")}</p>
            </li>
          ))}
      </>
    );
  }

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
                {/* {logList} */}
                <Items currentItems={currentItems} />
              </ul>
              {/* <Paging
                currentItems={page}
                count={log?.length}
                handlePageChange={handlePageChange}
              /> */}
              <ReactPaginate
                itemsPerPage={10}
                breakLabel="..."
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="< previous"
                renderOnZeroPageCount={null}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LogHistory;
