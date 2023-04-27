import "./Common.css";
import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/brand/logo.png";
import { LogInContext } from "./LogInContext";
import decodeJwt from "../hooks/decodeJwt";
import axios from "axios";

const Navbar = () => {
  const { token, setToken, loggedUser, setLoggedUser, loggedIn, setLoggedIn } =
    useContext(LogInContext);
  const navigate = useNavigate();
  const savedToken = localStorage.getItem("jwt");
  setToken(savedToken);

  useEffect(() => {
    // 로컬스토리지에서 jwt 가져오기
    if (savedToken === null) {
      setLoggedUser({
        id: "",
        name: "",
        exp: "",
        userCode: "",
        userNo: "",
      });
      setLoggedIn(false);
    } else {
      const decodedPayload = decodeJwt(token);
      setLoggedUser({
        id: decodedPayload.id,
        name: decodedPayload.name,
        exp: decodedPayload.exp,
        userCode: decodedPayload.userCode,
        userNo: decodedPayload.userNo,
      });
      setLoggedIn(true);
    }
  }, [token, setLoggedUser, setLoggedIn]);
  console.log(loggedUser);
  console.log(loggedIn);

  // 로그아웃
  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      // axios.post("http://localhost:8080/logout", {}).then((res) => console.log(res)).catch((err) => console.log(err));
      localStorage.removeItem("jwt");
      axios
        .post("http://localhost:8080/api/logout", {})
        .then((response) => {
          if (response.status === 200) {
            setLoggedUser({
              id: "",
              name: "",
              exp: "",
              userCode: "",
              userNo: "",
            });
            setLoggedIn(false);
            console.log("로그아웃 완료");
            navigate("/login");
          }
        })
        .catch((error) => {
          if (error) console.log(error);
        })
        .finally(() => {});
    } else {
      console.log("로그아웃 취소");
      return false;
    }
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
              {loggedIn ? (
                <LogoutSection value={loggedUser} func={handleLogout} />
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
                <span onClick={() => navigate("/inquiry")}>보고서</span>
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
        안녕하세요 <span>{props.value.name}</span>님
      </p>
      <p className="login_exp">{props.value.exp}</p>
      {/* <p>
        <Link to="/logout">로그아웃</Link>
      </p> */}
      <button className="logout_btn" onClick={props.func}>
        로그아웃
      </button>
      <p>
        <Link to="/mypage">개인정보수정</Link>
      </p>
      {props.value.userCode[0] === "ROLE_ADMIN" ||
      props.value.userCode[0] === "ROLE_MANAGER" ? (
        <p>
          <Link to="/">관리자 페이지</Link>
        </p>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Navbar;
