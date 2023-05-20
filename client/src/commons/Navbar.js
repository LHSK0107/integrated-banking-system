import "./Common.css";
import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/brand/logo.png";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import useAxiosInterceptor from "../hooks/useAxiosInterceptor";
import logout from "../utils/autoLogout";
import ExpCountDown from "./ExpCountDown";
import useRefreshToken from "../hooks/useRefreshToken";

/** click */
const handleClickCount = (menuNum) => {
  let menuList = JSON.parse(localStorage.getItem("menuClick"));
  if(menuNum===1){
    menuList =  {...menuList, allAccount:menuList.allAccount+1}
  } else if(menuNum===2){
    menuList =  {...menuList, inout:menuList.inout+1}
  } else if(menuNum===3){
    menuList =  {...menuList, inoutReport:menuList.inoutReport+1}
  } else if(menuNum===4){
    menuList =  {...menuList, dailyReport:menuList.dailyReport+1}
  } else if(menuNum===5){
    menuList =  {...menuList, dashboard:menuList.dashboard+1}
  }
  localStorage.removeItem("menuClick");
  localStorage.setItem("menuClick",JSON.stringify(menuList));
}
const Navbar = () => {
  const {
    token,
    setToken2,
    loggedUserInfo,
    setIsAuth,
    setLoggedUserInfo
  } = useAuth();
  useEffect(() => {
    loggedUserInfo && LogoutSection(loggedUserInfo);
  }, []);
  const refresh = useRefreshToken();
  // timer 설정, 토큰 변경 시에 작동
  const [sessionTime, SetSessionTime] = useState(0);
  useEffect(()=>{
    SetSessionTime(1800);
  },[token]);


  const navigate = useNavigate();

  /** logout시, context 비우는 함수 */
  const logout = () => {
    setToken2(null);
    setLoggedUserInfo(null);
    setIsAuth(false);
    navigate("/login");
  };

  // 로그아웃
  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      localStorage.removeItem("jwt");
      localStorage.removeItem("menuClick");
      alert("로그아웃 완료");
      logout();
    } else {
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
          안녕하세요&nbsp;&nbsp;&nbsp;<span><b>{props?.value?.name}</b></span>님
        </p>
        <ExpCountDown seconds={sessionTime}/>
        <button onClick={()=>{ExtendLoginSession()}}>로그인 연장</button>
        {/* <p className="login_exp">{props?.value?.exp}</p> */}
        <p>
          <Link to="/mypage">개인정보수정</Link>
        </p>
        {props?.value?.userCode === "ROLE_ADMIN" ||
          props?.value?.userCode === "ROLE_MANAGER" ? (
          <p>
            <Link to="/admin">관리자 페이지</Link>
          </p>

        ) : (null)
        }
        <button className="logout_btn" onClick={()=>handleLogout()}>
          로그아웃
        </button>
      </div>
    );
  };
  const ExtendLoginSession = async () =>{
    if (window.confirm("로그인 연장을 하시겠습니까?")) {
      alert("로그인 연장");
      await refresh();
    } else {
      return false;
    }
  }

  const [scrollData, setScrollData] = useState(0);
  const navInfoRef = useRef();
  const navMenuRef = useRef();
  const selectRef = useRef();
  const reportRef = useRef();

  const handleDropdown = (ref) =>{
    // e.target.context==="보고서" ? e.target.children[1].classList.add
    ref==="보고서" ?
     reportRef?.current?.children[1].classList.add("active")
     :
     selectRef?.current?.children[1].classList.add("active");
  }
  const handleLeaveDropdown = (ref) =>{
    ref==="보고서" ?
     reportRef?.current?.children[1].classList.remove("active")
     :
     selectRef?.current?.children[1].classList.remove("active");
  }
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
                  <Link to="https://www.webcash.co.kr/webcash/1000.html" target={"_blank"}>
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
                    to="https://www.serp.co.kr/home/home_1000.html" target={"_blank"}>
                    경리나라
                  </Link>
                </li>
              </ul>
            </div>
            {/* 로그인 체크 부분 */}
            <div className="user_info_wrap">
              {token ? (
                <LogoutSection value={loggedUserInfo} func={handleLogout} />
              ) : (
                <LoginSection />
              )}
            </div>
          </div>
        </div>

        <div ref={navMenuRef} className="nav_menu_section flex align_center">
          <div className="inner flex justify_between align_center">
            <Link to="/">
              <figure>
                <img className="main_logo" src={logo} alt="메인 로고 이미지" />
              </figure>
            </Link>
            <ul className="menu_list flex">
              <li>
                <Link to="/">소개</Link>
              </li>
              <li ref={selectRef}
                onMouseOver={
                  (e)=>{
                    e.stopPropagation();
                    handleDropdown("조회");
                  }} 
                onMouseLeave={
                  (e)=>{
                    e.stopPropagation();
                    handleLeaveDropdown("조회");
                  }} className="dropmenu_wrap">
                <Link to="/inquiry" onClick={()=>handleClickCount(1)}>조회</Link>
                <ul className="dropdown">
                  <li><Link to="/inquiry" onClick={()=>handleClickCount(1)}>전체계좌</Link></li>
                  <li><Link to="/inout" onClick={()=>handleClickCount(2)}>입출금내역</Link></li>
                </ul>
              </li>
              <li ref={reportRef} 
                onMouseOver={
                  (e)=>{
                    e.stopPropagation();
                    handleDropdown("보고서");
                  }} 
                onMouseLeave={
                  (e)=>{
                    e.stopPropagation();
                    handleLeaveDropdown("보고서");
                  }} className="dropmenu_wrap">
                <Link to="/dailyReport" onClick={()=>handleClickCount(3)}>보고서</Link>
                <ul className="dropdown">
                  <li><Link to="/dailyReport" onClick={()=>handleClickCount(3)}>일일시재</Link></li>
                  <li><Link to="/inoutReport" onClick={()=>handleClickCount(4)}>입출금</Link></li>
                </ul>
              </li>
              <li>
                <Link to="/dashboard" onClick={()=>handleClickCount(5)}>대시보드</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;