import React from "react";
import { Link } from "react-router-dom";
import HomeIcon from "../assets/images/icon/home.png";
const Breadcrumb = () =>{
  return (
    <div className="nav_depth flex justify_end align_center">
      <Link className="flex justify_end align_center">
        <img
          src={HomeIcon}
          alt="home img icon"
        />
        홈
      </Link>
      <img
        src={HomeIcon}
        alt="arrow img icon"
      />
      <p>조회</p>
      <img
        src={HomeIcon}
        alt="arrow img icon"
      />
      <p>
        <span>입출내역조회</span>
      </p>
    </div>
  );
}
export default Breadcrumb;
