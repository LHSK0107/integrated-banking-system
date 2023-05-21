import "./Common.css";
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/brand/logo.png";
import useAuth from "../hooks/useAuth";
import autoLogout from "../utils/autoLogout";
import ExpCountDown from "./ExpCountDown";
import useRefreshToken from "../hooks/useRefreshToken";
import MenuIcon from "../assets/images/icon/menu.png";
import MenuCloseIcon from "../assets/images/icon/close.png";
import MenuArrowIcon from "../assets/images/icon/arrow_down.png";
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

  const mobileMenuRef = useRef();
  const mobileCloseRef = useRef();
  const navigate = useNavigate();

  const handleMenuIconClick = () => {
    mobileInqiryRef && mobileInqiryRef.current.classList.remove("active");
    mobileReportRef && mobileReportRef.current.classList.remove("active");
    mobileMenuRef.current.classList.add("active");
  };
  const handleMenuCloseClick = () => {
    mobileMenuRef.current.classList.remove("active");
  }
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
      alert("로그아웃 완료");
      autoLogout();
      localStorage.removeItem("jwt");
      localStorage.removeItem("menuClick");
      logout();
    } else {
      return false;
    }
  };

  const LoginSection = () => {
    return (
      <div className="signup_wrap">
        <div className="login flex align_center">
          <p className="signup_text">
            <Link to="./signup" onClick={()=>{handleMenuCloseClick()}}>회원가입</Link>
          </p>
          <p className="signup_text">
            <Link to="./login" onClick={()=>{handleMenuCloseClick()}}>로그인</Link>
          </p>
        </div>
      </div>
    );
  };

  const LogoutSection = (props) => {
    return (
      <div className="login flex align_center">
        <div>
          <p className="login_username">
            안녕하세요&nbsp;&nbsp;&nbsp;
            <span>
              <b>{props?.value?.name}</b>
            </span>
            님
          </p>
          <ExpCountDown seconds={sessionTime} />
          <button
            className="login_extension_btn"
            onClick={() => {
              ExtendLoginSession();
            }}
          >
            로그인 연장
          </button>
        </div>
        <div>
          <p>
            <Link to="/mypage" onClick={()=>{handleMenuCloseClick()}}>개인정보수정</Link>
          </p>
          {props?.value?.userCode === "ROLE_ADMIN" ||
          props?.value?.userCode === "ROLE_MANAGER" ? (
            <p>
              <Link to="/admin" onClick={()=>{handleMenuCloseClick()}}>관리자 페이지</Link>
            </p>
          ) : null}
          <button className="logout_btn" onClick={() => handleLogout()}>
            로그아웃
          </button>
        </div>
      </div>
    );
  };
  const MobileLoginSection = () => {
    return (
      <div className="signup_wrap">
        <div className="login flex align_center">
          <p className="signup_text">
            <Link to="./signup">회원가입</Link>
          </p>
          <p className="signup_text">
            <Link to="./login">로그인</Link>
          </p>
        </div>
      </div>
    );
  };

  const MobileLogoutSection = (props) => {
    return (
      <div className="login flex align_center">
        <div className="flex align_center justify_between">
          <div>
            <p className="login_username">
              안녕하세요&nbsp;&nbsp;&nbsp;
              <span>
                <b>{props?.value?.name}</b>
              </span>
              님
            </p>
          </div>
          <div className="mobile_logout_btn_wrap">
            <ExpCountDown seconds={sessionTime} />
            <button
              className="login_extension_btn"
              onClick={() => {
                ExtendLoginSession();
              }}
            >
              로그인 연장
            </button>
          </div>
        </div>
        <div className="user_manage_wrap flex justify_between">
          <div>
            <p>
              <Link to="/mypage">개인정보수정</Link>
            </p>
            {props?.value?.userCode === "ROLE_ADMIN" ||
            props?.value?.userCode === "ROLE_MANAGER" ? (
              <p>
                <Link to="/admin">관리자 페이지</Link>
              </p>
            ) : null}
          </div>
          <button className="logout_btn" onClick={() => handleLogout()}>
            로그아웃
          </button>
        </div>
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
  
  const mobileInqiryRef = useRef();
  const mobileReportRef = useRef();
  const downIcon1Ref = useRef();
  const downIcon2Ref = useRef();
  const openMobileSubMenu = (menu) => {
    if(menu==="inquiry"){
      mobileInqiryRef.current.classList.toggle("active");
      downIcon1Ref.current.classList.toggle("img_rotate");
    }else {
      mobileReportRef.current.classList.toggle("active");
      downIcon2Ref.current.classList.toggle("img_rotate");
    }
  };
  return (
    <header id="header">
      <div ref={mobileMenuRef} className="mobile_menu_wrap">
        <div className="mobile_content">
          <img
            className="mobile_close_icon"
            ref={mobileCloseRef}
            src={MenuCloseIcon}
            alt="mobile 닫기 아이콘"
            onClick={() => {
              handleMenuCloseClick();
            }}
          />
          <div className="top_gnb">
            <div className="user_info_wrap">
              {token ? (
                <MobileLogoutSection value={loggedUserInfo} func={handleLogout} />
              ) : (
                <LoginSection />
              )}
            </div>
          </div>
          <div className="mobile_menu_list">
            <ul className="mobile_menu">
              <li>
                <Link className="flex" onClick={()=>{handleMenuCloseClick()}} to="/">소개</Link>
              </li>
              <li className="mobile_sub_menu">
                <Link className="flex" onClick={()=>{openMobileSubMenu("inquiry")}} to="">
                  <div className="flex align_center justify_between">
                  조회
                  <figure>
                    <img ref={downIcon1Ref} className="mobile_arrow_icon" src={MenuArrowIcon} alt="menu down 아이콘"/> 
                  </figure>
                  </div>
                </Link>
                <ul ref={mobileInqiryRef} className="mobile_sub">
                  <li><Link to="/inquiry" onClick={() => {handleMenuCloseClick();}}>
                    &middot;계좌조회</Link>
                  </li>
                  <li><Link to="/inout" onClick={() => {handleMenuCloseClick();}}>&middot;입출금내역조회</Link></li>
                </ul>
              </li>
              <li className="mobile_sub_menu">
                <Link className="flex" onClick={()=>{openMobileSubMenu("report")}} to="">
                  <div className="flex align_center justify_between">
                    보고서
                    <figure>
                      <img ref={downIcon2Ref} className="mobile_arrow_icon" src={MenuArrowIcon} alt="menu down 아이콘"/> 
                    </figure>
                    </div>
                </Link>
                <ul ref={mobileReportRef} className="mobile_sub">
                  <li><Link to="/dailyReport" onClick={() => {handleMenuCloseClick();}}>&middot;일일시재보고서</Link></li>
                  <li><Link to="/inoutReport" onClick={() => {handleMenuCloseClick();}}>&middot;입출금내역보고서</Link></li>
                </ul>
              </li>
              <li>
                <Link className="flex align_center" onClick={()=>{handleMenuCloseClick()}} to="/dashboard">대시보드</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
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
              <li
                ref={selectRef}
                onMouseOver={(e) => {
                  e.stopPropagation();
                  handleDropdown("조회");
                }}
                onMouseLeave={(e) => {
                  e.stopPropagation();
                  handleLeaveDropdown("조회");
                }}
                className="dropmenu_wrap"
              >
                <Link to="/inquiry" onClick={() => handleClickCount(1)}>
                  조회
                </Link>
                <ul className="dropdown">
                  <li>
                    <Link to="/inquiry" onClick={() => handleClickCount(1)}>
                      전체계좌
                    </Link>
                  </li>
                  <li>
                    <Link to="/inout" onClick={() => handleClickCount(2)}>
                      입출금내역
                    </Link>
                  </li>
                </ul>
              </li>
              <li
                ref={reportRef}
                onMouseOver={(e) => {
                  e.stopPropagation();
                  handleDropdown("보고서");
                }}
                onMouseLeave={(e) => {
                  e.stopPropagation();
                  handleLeaveDropdown("보고서");
                }}
                className="dropmenu_wrap"
              >
                <Link to="/dailyReport" onClick={() => handleClickCount(3)}>
                  보고서
                </Link>
                <ul className="dropdown">
                  <li>
                    <Link to="/dailyReport" onClick={() => handleClickCount(3)}>
                      일일시재
                    </Link>
                  </li>
                  <li>
                    <Link to="/inoutReport" onClick={() => handleClickCount(4)}>
                      입출내역
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link to="/dashboard" onClick={() => handleClickCount(5)}>
                  대시보드
                </Link>
              </li>
            </ul>
            <img
              src={MenuIcon}
              className="mobile_menu_icon"
              alt="mobile 메뉴 아이콘"
              onClick={() => {
                handleMenuIconClick();
              }}
            />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;