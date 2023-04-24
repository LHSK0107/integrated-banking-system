import React from "react";
import { Link } from "react-router-dom";
import HomeIcon from "../assets/images/icon/home.png";
import Arrow from "../assets/images/icon/arrow_b.png";
const Breadcrumb = ({title, subMenu}) =>{
  return (
    <div className="nav_depth flex justify_end align_center">
      <Link className="flex justify_end align_center">
        <img
          src={HomeIcon}
          alt="home img icon"
        />&nbsp;
        홈
        &nbsp;
      </Link>
      <img
        src={Arrow}
        alt="arrow img icon"
      />
      <p>&nbsp;{title}&nbsp;</p>
      <img
        src={Arrow}
        alt="arrow img icon"
      />
      <p>
        <span>&nbsp;{subMenu}&nbsp;</span>
      </p>
    </div>
  );
}
export default Breadcrumb;
