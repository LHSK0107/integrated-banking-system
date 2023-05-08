import React from "react";
import { Link } from "react-router-dom";

const Aside = ({now}) => {
  return (
    <aside>
      <div className="aside_wrap">
        <h2>관리자 페이지</h2>
        <ul className="aside_nav">
          <li className={now === "회원 목록"? "aside_active":""}>
            <Link to="/admin">회원 목록</Link>
          </li>
          <li className={now === "계좌 열람 권한 관리"? "aside_active":""}>
            <Link to="/">계좌 열람 권한 관리</Link>
          </li>
          <li className={now === "로그인 기록 조회"? "aside_active":""}>
            <Link to="/logHistory">로그인 기록 조회</Link>
          </li>
          <li className={now === "메뉴 클릭 기록 조회"? "aside_active":""}>
            <Link to="/clickHistory">메뉴 클릭 기록 조회</Link>
          </li>
          <li className={now === "부서 관리"? "aside_active":""}>
            <Link to="/dept">부서 관리</Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Aside;
