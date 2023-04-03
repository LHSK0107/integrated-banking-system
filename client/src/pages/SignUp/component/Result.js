import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import VerifyIcon from "../../../assets/images/icon/verify-icon.png";

const Result = () => {
  // const navigate=useNavigate();
  return (
    <div className="signup_result_wrap">
      <img className="signup_success_icon" src={VerifyIcon} alt="회원가입 성공 이미지"/>
      <p>성공적으로 회원가입이 되셨습니다.</p>
      <Link className="signup_success_btn" to="/login">로그인</Link>
    </div>
  )
};

export default Result;