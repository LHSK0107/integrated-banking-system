/* eslint-disable */
import React, { useState, useEffect,useContext } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { PageContext } from "../context/PageContext";
import axios from 'axios';
import {Link} from "react-router-dom";
const UserInfo = () => {
  const { pageNum, setPageNum, formData, setFormData } = useContext(PageContext);
  // form의 각 요소 지정
  const schema = yup.object().shape({
    emailCode1: yup.string("문자만 입력이 가능합니다.").required("입력해주세요."),
    emailCode2: yup.string("문자만 입력이 가능합니다.").required("입력해주세요."),
    emailCode3: yup.string("문자만 입력이 가능합니다.").required("입력해주세요."),
    emailCode4: yup.string("문자만 입력이 가능합니다.").required("입력해주세요."),
    emailCode5: yup.string("문자만 입력이 가능합니다.").required("입력해주세요."),
    emailCode6: yup.string("문자만 입력이 가능합니다.").required("입력해주세요."),
  });
  const {
    register,
    unregister,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [sendVerifyCode, SetsendVerifyCode] = useState(false);
  const onSubmit = (data) => {
    const verifyCode = `${getValues("emailCode1")}${getValues("emailCode2")}${getValues("emailCode3")}${getValues("emailCode4")}${getValues("emailCode5")}${getValues("emailCode6")}`;
    sendVerifyCode
      ? axios
          .post("https://localhost:8080/api/email/verification", {
            email: formData.email,
            code: verifyCode
          })
          .then((res) => {
            if(res.data==="Verification successful"){
              unregister(["emailCode1","emailCode2","emailCode3","emailCode4","emailCode5","emailCode6"]);
              alert("인증에 성공하였습니다.");
              setPageNum(pageNum + 1);
            } else {
              alert("인증에 실패하였습니다. 다시 시도해주시기 바랍니다.");
              return false;
            }
          })
          .catch((err)=>{
            alert("인증번호를 다시 입력해주시길 바랍니다.");
            return false;
          })
      : alert("오류가 발생했습니다. 다시 시도해주시기 바랍니다.");
  };
  useEffect(() => {
    axios
      .post("https://localhost:8080/api/email/", { email: formData.email })
      .then((res) => {
        console.log("이메일 전송 ok");
        SetsendVerifyCode(true);
      })
      .catch((err) =>{
          alert("에러가 발생하였으니 다시 해주시기 바랍니다.");
          SetsendVerifyCode(false);
        }
      );
  }, [formData.email]);
  return (
    <div className="form_container">
      <form className="userInfo_form flex flex_column justify_between align_center" onSubmit={handleSubmit(onSubmit)}>
        <div className="email_verify_wrap flex justify_between align_center" >
            <input type="text" placeholder="" {...register("emailCode1")} maxLength={1} />
            <input type="text" placeholder="" {...register("emailCode2")} maxLength={1} />
            <input type="text" placeholder="" {...register("emailCode3")} maxLength={1} />
            <input type="text" placeholder="" {...register("emailCode4")} maxLength={1} />
            <input type="text" placeholder="" {...register("emailCode5")} maxLength={1} />
            <input type="text" placeholder="" {...register("emailCode6")} maxLength={1} />
        </div>
        {errors.emailCode6 && <p>{errors.emailCode6?.message}</p>}
        <p>이메일을 확인할 수 없나요?</p>
        <Link to="">인증 메일 다시 보내기</Link>
        <div className="form_btn_wrap flex justify_between align_center">
          <button
            className="prev_btn"
            onClick={() => {
              setPageNum(pageNum - 1);
            }}
          >
            이전
          </button>
          <input type="submit" value="다음" />
        </div>
      </form>
    </div>
  );
};

export default UserInfo;