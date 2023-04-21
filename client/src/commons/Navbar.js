import "./Common.css";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/brand/logo.png";

const Navbar = () => {
  // context 처리
  const [isAuth, setIsAuth] = useState(false);

  const navigate=useNavigate();
  const [scrollData, setScrollData] = useState(0);
  const navInfoRef = useRef();
  const navMenuRef = useRef();

  // const scrollFunc = useCallback((scrollYData) => {
  //   if(scrollYData>20){
  //     navMenuRef.current.style.transition="0.2s all ease";
  //     navMenuRef.current.style.padding="5px 0";
  //   } else {
  //     navMenuRef.current.style.transition="0.2s all ease";
  //     navMenuRef.current.style.padding="17px 0";
  //   }
  // },[]);
  // useEffect(()=>{
  //   window.addEventListener('scroll',()=>{
  //     setScrollData(window.scrollY);
  //     scrollFunc(scrollData);
  //   })
  // },[scrollData,scrollFunc]);
  return (
    <header id="header">
      <nav id="nav">
        <div ref={navInfoRef} className="nav_info_section flex justify_center">
          <div className="nav_inner flex justify_between align_center">
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

        <div ref={navMenuRef} className="nav_menu_section">
          <div className="inner flex justify_between align_center">
            <Link to="/">
              <figure>
                <img className="main_logo" src={logo} alt="메인 로고 이미지" />
              </figure>
            </Link>
            <ul className="menu_list flex">
              <li>
                <span onClick={()=>navigate("/")}>소개</span>
              </li>
              <li>
                <span onClick={()=>navigate("/inquiry")}>조회</span>
              </li>
              <li>
                <span onClick={()=>navigate("/inquiry")}>보고서</span>
              </li>
              <li>
                <span onClick={()=>navigate("/dashboard")}>대시보드</span>
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
      <p>
        <Link to="./signup">회원가입</Link>
      </p>
      <p>
        <Link to="./login">로그인</Link>
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
