import React from "react";
import {Link} from "react-router-dom";
export const SideNav= ({now})=> {
  return (
    <aside>
      <div className="aside_wrap">
        <h2>조회</h2>
        <ul className="aside_nav">
          <li className={now === "전체계좌조회"? "aside_active":""}>
            <Link to="/inquiry">전체계좌조회</Link>
          </li>
          <li className={now === "입출내역조회"? "aside_active":""}>
            <Link to="/inout">입출내역조회</Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}