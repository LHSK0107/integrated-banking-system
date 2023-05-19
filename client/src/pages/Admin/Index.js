import "./admin.css";
import React, { useEffect, useState } from "react";
import Breadcrumb from "../../commons/Breadcrumb";
import { Link } from "react-router-dom";
import Aside from "./component/Aside";
import ReactPaginate from "react-paginate";
import useAxiosInterceptor from "../../hooks/useAxiosInterceptor";

const Index = () => {
  const AuthAxios = useAxiosInterceptor();
  // api에서 받아온 데이터
  const [members, setMembers] = useState(null);

  // pagination
  const [itemOffset, setItemOffset] = useState(0); // 페이지에서 시작할 인덱스
  const endOffset = itemOffset + 10; // 페이지에서 끝날 인덱스
  const currentItems = members?.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(members?.length / 10);
  const handlePageClick = (event) => {
    const newOffset = (event.selected * 10) % members.length;
    setItemOffset(newOffset);
  };

  // 회원 목록 불러오기
  useEffect(() => {
    const controller = new AbortController();
    const getUsers = async () => {
      try {
        const response = await AuthAxios.get("/api/manager/users", {
          signal: controller.signal,
        });
        response && setMembers(response.data);
      } catch (err) {
        // console.log(`error 발생: ${err}`);
      }
    };
    getUsers();
    return () => {
      controller.abort();
    };
  }, [AuthAxios]);

  // const memberInfoList = members?.map((ele) => {
  //     return (
  //       <li key={ele?.userNo}>
  //         <Link className="flex" to={`/admin/${ele?.userNo}`}>
  //           <p className="list_userCode">{ele?.userCode?.split("_")[1]}</p>
  //           <p className="list_userNo">{ele?.userNo}</p>
  //           <p className="list_name">{ele?.name}</p>
  //           <p className="list_dept">{ele?.dept}</p>
  //           <p className="list_email">{ele?.email}</p>
  //         </Link>
  //       </li>
  //     );
  //   });
  function Items({ currentItems }) {
    return (
      <>
        {currentItems &&
          currentItems.map((ele) => (
            <li key={ele?.userNo}>
              {<Link className="flex" to={`/admin/${ele?.userNo}`}>
                <p className="list_userCode">{ele?.userCode?.split("_")[1]}</p>
                <p className="list_userNo">{ele?.userNo}</p>
                <p className="list_name">{ele?.name}</p>
                <p className="list_dept">{ele?.dept}</p>
                <p className="list_email">{ele?.email}</p>
              </Link>}
            </li>
          ))}
      </>
    );
  }

  return (
    <div id="wrap">
      <div className="inner">
        <Breadcrumb title={"관리자 페이지"} subMenu={"회원 목록"} />
        <div className="flex">
          <Aside now={"회원 목록"} />
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
                {/* {members && memberInfoList} */}
                <Items currentItems={currentItems} />
              </ul>
            </div>
            <div className="pagingBtn flex justify_center">
              <ReactPaginate
                itemsPerPage={10}
                breakLabel="..." // Label for ellipsis.
                nextLabel="다음"
                onPageChange={handlePageClick} // The method to call when a page is changed. Exposes the current page object as an argument.
                pageRangeDisplayed={3}
                pageCount={pageCount}
                previousLabel="이전"
                renderOnZeroPageCount={null}
                className={"flex"}
                activeClassName={"pagingBtnActive"} // active page
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Index;
