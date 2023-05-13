import "./Common.css";
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/brand/logo.png";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import decodeJwt from "../hooks/decodeJwt";
const Navbar = () => {
  const {
    token,
    setToken2,
    loggedUserInfo,
    isAuth,
    setIsAuth,
    setLoggedUserInfo,
  } = useAuth();
  useEffect(() => {
    const AUTH_TOKEN = localStorage.getItem("jwt");
    const decodedPayload = AUTH_TOKEN && decodeJwt(AUTH_TOKEN);
    if (AUTH_TOKEN) {
      console.log("있음");
      setLoggedUserInfo((prev) => {
        prev && LogoutSection(prev);
        console.log(prev);
        return {
          id: decodedPayload.sub,
          name: decodedPayload.name,
          exp: decodedPayload.exp,
          userCode: decodedPayload.userCode,
          userNo: decodedPayload.userNo,
        };
      });
    } else {
      setToken2(null);
      setLoggedUserInfo(null);
    }
  }, []);
  // useEffect(()=>{console.log(loggedUserInfo)},[setLoggedUserInfo]);
  const navigate = useNavigate();

  // 로그아웃
  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      localStorage.removeItem("jwt");
      axios
        .post(
          "http://localhost:8080/api/logout",
          {
            allAccount: 1,
            inout: 2,
            inoutReport: 3,
            dailyReport: 4,
            dashboard: 5,
          },
          { withCredentials: true }
        )
        .then((response) => {
          if (response.status === 200 || response.status === 401) {
            setToken2(null);
            setLoggedUserInfo(null);
            setIsAuth(false);
            console.log("로그아웃 완료");
            navigate("/login");
          }
        })
        .catch((error) => {
          if (error) {
            setToken2(null);
            setLoggedUserInfo(null);
            setIsAuth(false);
            console.log("로그아웃 완료");
            navigate("/login");
          }
        })
        .finally(() => {});
    } else {
      console.log("로그아웃 취소");
      return false;
    }
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

  const LogoutSection = (props) => {
    return (
      <div className="login flex align_center">
        <p className="login_username">
          안녕하세요 <span>{props?.value?.name}</span>님
        </p>
        <p className="login_exp">{props?.value?.exp}</p>
        {/* <p>
        <Link to="/logout">로그아웃</Link>
      </p> */}
        <button className="logout_btn" onClick={props?.func}>
          로그아웃
        </button>
        <p>
          <Link to="/mypage">개인정보수정</Link>
        </p>
        {props?.value?.userCode === "ROLE_ADMIN" ||
        props?.value?.userCode === "ROLE_MANAGER" ? (
          <p>
            <Link to="/admin">관리자 페이지</Link>
          </p>
        ) : (
          <></>
        )}
      </div>
    );
  };

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
              {loggedUserInfo ? (
                <LogoutSection value={loggedUserInfo} func={handleLogout} />
              ) : (
                <LoginSection />
              )}
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
                <span onClick={() => navigate("/")}>소개</span>
              </li>
              <li>
                <span onClick={() => navigate("/inquiry")}>조회</span>
              </li>
              <li>
                <span onClick={() => navigate("/dailyReport")}>보고서</span>
              </li>
              <li>
                <span onClick={() => navigate("/dashboard")}>대시보드</span>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
