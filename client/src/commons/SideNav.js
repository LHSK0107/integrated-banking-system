import React from "react";
import {Link} from "react-router-dom";
export const SideNav= ()=> {
  return (
    <aside>
      <div className="aside_wrap">
        <h2>조회</h2>
        <ul className="aside_nav">
          <li>
            <Link to="/inquiry">전체계좌조회</Link>
          </li>
          <li className="aside_active">
            <Link to="/inout">입출내역조회</Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}