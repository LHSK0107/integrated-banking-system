/* eslint-disable */
import "./index.css";
import React, { memo, useState, createContext } from "react";
import UserInfo from "./component/UserInfo";
import PersonalInfo from "./component/PersonalInfo";
import Result from "./component/Result";
import SignUpBgImg from "../../assets/images/signup-back-image-1.jpg";
import UserIcon from "../../assets/images/icon/user.png";
const Index = memo(() => {
  const [pageNum, setPageNum] = useState(0);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    department: "",
  });

  const showCurrentPage = () => {
    if (pageNum === 0) {
      return <UserInfo formData={formData} setFormData={setFormData} />;
    } else if (pageNum === 1) {
      return <PersonalInfo formData={formData} setFormData={setFormData} />;
    } else {
      return <Result />;
    }
  };
  const FormTitles = ["Sign Up", "Personal Info", "Other"];
  return (
    <div className="signup_section">
      <div className="signup_image_section">
        <figure>
          <img src={SignUpBgImg} alt="회원가입 페이지 이미지" />
        </figure>
      </div>
      <div className="signup_form_section">
        <div className="p_container">
        <div className="progress">
        </div>
          <img className="circle active" src={UserIcon} alt="icon"/>
          <img className="circle" src={UserIcon} alt="icon"/>
          <img className="circle" src={UserIcon} alt="icon"/>
          <img className="circle" src={UserIcon} alt="icon"/>
        </div>
        <div className="signup_form_wrap">
          <h1>Hello! We are I'am! <br/>Create Account</h1>
          <div className="signup_form">
            {showCurrentPage()}
          </div>
          <hr/>
          <div className="form_btn_wrap">
            {
              pageNum!==0 && <button onClick={()=>{setPageNum((currentIdx)=>currentIdx-1)}}>이전</button> 
            }
            <button
              onClick={() => {
                if (pageNum === 2) {
                  console.log(formData);
                } else {
                  setPageNum((currentIdx) => currentIdx + 1);
                }
              }}
            >
              {pageNum === 2 ? "등록" : "다음"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Index;
