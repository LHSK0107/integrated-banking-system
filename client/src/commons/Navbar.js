import React, {useState} from 'react';
import { Link } from "react-router-dom";
import brandLogo from "../assets/brand/webcash_logo.png";

const Navbar = () => {
    // context 처리
    const [isAuth, setIsAuth]=useState(false);

  return (
    <header id="header">
      <nav id="nav">
        <div class="nav_info_section">
          <div class="family_site_wrap">
            <ul class="family_site">
                <li><Link to="https://www.webcash.co.kr/webcash/1000.html" target={'_blank'}>Webcash</Link></li>
                <li><Link to="https://serp2.webcash.co.kr/" target={'_blank'}>SERP</Link></li>
                <li><Link to="https://www.serp.co.kr/home/home_1000.html" target={'_blank'}>경리나라</Link></li>
            </ul>
          </div>
          {/* 로그인 체크 부분 */}
          <div class="user_info_wrap">
            {isAuth ? <p><Link to="./logout">logout</Link></p> : <p><Link to="./login">Login</Link>></p>}
          </div>
        </div>
        <div class="nav_menu_section">
          <Link to="/">
            <figure>
              <img
                class="main_logo"
                src={brandLogo}
                alt="메인 로고 이미지"
              />
            </figure>
          </Link>
          <ul class="menu_list">
            <li>
              <Link to="#!">소개</Link>
            </li>
            <li>
              <Link to="#!">조회</Link>
            </li>
            <li>
              <Link to="#!">이체</Link>
            </li>
            <li>
              <Link to="#!">외환</Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
