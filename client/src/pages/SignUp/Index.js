/* eslint-disable */
import "./index.css";
import React, { useState, useRef, useEffect } from "react";

import SignUpBgImg from "../../assets/images/signup-back-image-1.jpg";
import { PageContext } from "./context/PageContext";
import Steps from "./Steps";

const Index = () => {
  const [pageNum, setPageNum] = useState(0);
  const [formData, setFormData] = useState({
    id: "",
    password: "",
    confirmPassword: "",
    email: "",
    username: "",
    department: "",
    phoneNum: "",
    isVerify: false,
  });

  // context를 통해 각 페이지에 대한 정보가 담긴 Steps에 state 전달
  const showCurrentPage = () => {
    return (
      <PageContext.Provider
        value={{ pageNum, setPageNum, formData, setFormData }}
      >
        <Steps />
      </PageContext.Provider>
    );
  };
  return (
    <div className="signup_section flex align_center justify_center">
      <div className="signup_image_section flex justify_center align_center">
        <figure>
          <img src={SignUpBgImg} alt="회원가입 페이지 이미지" />
        </figure>
      </div>
      <div className="signup_form_section flex justify_center align_center">
        <div className="signup_form_wrap">
          <div className="signup_form">{showCurrentPage()}</div>
        </div>
      </div>
    </div>
  );
};

export default Index;
