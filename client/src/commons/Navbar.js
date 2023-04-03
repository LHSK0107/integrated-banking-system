import "./Common.css";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import brandLogo from "../assets/brand/webcash_logo.png";
import userImg from "../assets/images/icon/user.png";
import logo from "../assets/brand/logo.png";

const Navbar = () => {
  // context 처리
  const [isAuth, setIsAuth] = useState(false);

  return (
    <header id="header">
      <nav id="nav">
        <div className="nav_info_section">
          <div className="inner flex justify_between align_center">
            <div className="family_site_wrap">
              <ul className="family_site flex">
                <li>
                  <Link
                    to="https://www.webcash.co.kr/webcash/1000.html"
                    target={"_blank"}
                  >
                    Webcash
                  </Link>
                </li>
                <li>
                  <Link to="https://serp2.webcash.co.kr/" target={"_blank"}>
                    SERP
                  </Link>
                </li>
                <li>
                  <Link
                    to="https://www.serp.co.kr/home/home_1000.html"
                    target={"_blank"}
                  >
                    경리나라
                  </Link>
                </li>
              </ul>
            </div>
            {/* 로그인 체크 부분 */}
            <div className="user_info_wrap">
              {isAuth ? <LogoutSection /> : <LoginSection />}
            </div>
          </div>
        </div>

        <div className="nav_menu_section">
          <div className="inner flex justify_between align_center">
            <Link to="/">
              <figure>
                <img className="main_logo" src={logo} alt="메인 로고 이미지" />
              </figure>
            </Link>
            <ul className="menu_list flex">
              <li>
                <Link to="#!">메인</Link>
              </li>
              <li>
                <Link to="#!">소개</Link>
              </li>
              <li>
                <Link to="#!">조회</Link>
              </li>
              <li>
                <Link to="#!">금융상품</Link>
              </li>
              <li>
                <Link to="#!">금융정보</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

const LoginSection = () => {
  return (
    <div className="login flex align_center">
      {/* <figure>
                <img src={userImg} alt="user 이미지"/>
            </figure> */}
      <p>
        <Link to="./signup">회원가입</Link>
      </p>
      <p>
        <Link to="./login">로그인</Link>
      </p>
      <p>
        <Link to="./help">공지사항</Link>
      </p>
    </div>
  );
};

const LogoutSection = () => {
  return (
    <>
      <p>
        <Link to="/">로그아웃</Link>
      </p>
      <p>
        <Link to="/">보고서 만들기</Link>
      </p>
      <p>
        <Link to="./help">고객센터</Link>
      </p>
    </>
  );
};

export default Navbar;
