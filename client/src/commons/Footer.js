import "./Common.css";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LogoImg from "../assets/brand/logo_w.png";
import GithubImg from "../assets/images/icon/github-logo.png";
import EmailIcon from "../assets/images/icon/email_icon.png";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer>
      <div className="inner flex align_center justify_between">
        <h1>
          <figure className="flex align_center">
            <img
              onClick={() => navigate("/")}
              src={LogoImg}
              alt="로고 하얀색 이미지"
            ></img>
          </figure>
        </h1>
        <div className="pc">
          <div className="footer_link_wrap flex justify_between">
            <Link to="">이용약관</Link>
            <p>
              I'AM &copy; <span>LHSK</span> All Rights Reserved.
            </p>
            <Link to="">개인정보처리방침</Link>
          </div>
        </div>
        <div className="mobile footer_link_wrap">
          <div className="flex justify_between">
            <Link to="">이용약관</Link>
            <Link to="">개인정보처리방침</Link>
          </div>
          <p>
            I'AM &copy; <span>LHSK</span> All Rights Reserved.
          </p>
        </div>
        <div className="footer_contact_wrap flex justify_center">
          <Link
            to="https://github.com/LHSK0107/integrated-banking-system"
            target={"_blank"}
          >
            <figure className="flex align_center">
              <img src={GithubImg} alt="깃허브 로고"></img>
            </figure>
          </Link>
          <Link to="" className="flex align_center">
            <figure className="flex align_center">
              <img src={EmailIcon} alt="이메일 아이콘"></img>
            </figure>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
