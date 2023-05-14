import "./Common.css";
import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/brand/logo.png";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import decodeJwt from "../hooks/decodeJwt";
import MenuContext from "../setup/context/MenuContextProvider";
import useAxiosInterceptor from "../hooks/useAxiosInterceptor";
const Navbar = () => {
  const AuthAxios = useAxiosInterceptor();
  const {clickCountList,setClickCountList} = useContext(MenuContext);
  const {
    setToken2,
    loggedUserInfo,
    setIsAuth,
    setLoggedUserInfo,
  } = useAuth();
  useEffect(() => {
    const AUTH_TOKEN = localStorage.getItem("jwt");
    const decodedPayload = AUTH_TOKEN && decodeJwt(AUTH_TOKEN);
    if (AUTH_TOKEN) {
      setLoggedUserInfo((prev) => {
        prev && LogoutSection(prev);
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

  /** click */
  const handleClickCount = (menuNum) => {
    if(menuNum===1){
      setClickCountList({

      })
    }
  }

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
      axios
        .post(
          "https://iam-api.site/api/logout",
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
          if (response?.status === 200 || response?.status === 401) {
            logout();
          }
        })
        .catch(error => error && logout());
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
        <button className="logout_btn" onClick={props?.func}>
          로그아웃
        </button>
      </div>
    );
  };
  useEffect(()=>{
    const getData = async () => {
      const data = await AuthAxios.get("/api/accounts/inout");
      return data;
    }

    
    console.log(getData());
  })
  const [scrollData, setScrollData] = useState(0);
  const navInfoRef = useRef();
  const navMenuRef = useRef();
  const selectRef = useRef();
  const reportRef = useRef();

  const handleDropdown = (ref) =>{
    // e.target.context==="보고서" ? e.target.children[1].classList.add
    console.log(ref);
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
              {loggedUserInfo ? (
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
                <a onClick={() => navigate("/")}>소개</a>
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
                <a onClick={() => navigate("/inquiry")}>조회</a>
                <ul className="dropdown">
                  <li><Link to="/inquiry">전체계좌</Link></li>
                  <li><Link to="/inout">입출금내역</Link></li>
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
                <a onClick={() => navigate("/dailyReport")}>보고서</a>
                <ul className="dropdown">
                  <li><Link to="/dailyReport">일일시재</Link></li>
                  <li>입출금내역</li>
                </ul>
              </li>
              <li>
                <a onClick={() => navigate("/dashboard")}>대시보드</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;