import React from "react";
import {Link} from "react-router-dom";
export const SideNav= ()=> {
  return (
    <aside>
      <div className="aside_wrap">
        <h2>조회</h2>
        <ul className="aside_nav">
          <li>
            <Link href="../AllAccount/index.html">전체계좌조회</Link>
          </li>
          <li className="aside_active">
            <a href="./">입출내역조회</a>
          </li>
        </ul>
      </div>
    </aside>
  );
}
