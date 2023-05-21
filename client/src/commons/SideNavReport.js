import React from "react";
import {Link} from "react-router-dom";
export const SideNavReport= ({now})=> {
  return (
    <aside>
      <div className="aside_wrap">
        <h2>보고서</h2>
        <ul className="aside_nav">
          <li className={now === "일일시재보고서"? "aside_active":""}>
            <Link to="/dailyReport">일일시재보고서</Link>
          </li>
          <li className={now === "입출내역보고서"? "aside_active":""}>
            <Link to="/inoutReport">입출내역보고서</Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}