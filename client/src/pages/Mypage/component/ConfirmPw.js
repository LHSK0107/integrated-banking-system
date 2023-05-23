import React, { useContext, useEffect, useState } from "react";
import { StepContext } from "../context/StepContext";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import "../mypage.css";
import useAuth from "../../../hooks/useAuth";
import useAxiosInterceptor from "../../../hooks/useAxiosInterceptor";

export default function ConfirmPw() {
  const AuthAxios = useAxiosInterceptor();
  const { loggedUserInfo } = useAuth();
  // 페이지 확인 및 설정
  const { stepNum, setStepNum, userInfo, setUserInfo } =
    useContext(StepContext);

  // form 유효성 검사
  const schema = yup
    .object({
      password: yup
        .string()
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[?!@#$%^&*+=-])(?=.*[0-9]).{6,20}$/,
          "형식에 맞게 6~20자리로 대/소/특수/숫자 포함하여 입력해주세요."
        )
        .min(6, "최소 6자 이상 입력해주세요.")
        .max(20, "최대 20자리까지 입력해주세요.")
        .required("패스워드를 입력해주세요."),
    })
    .required();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema), mode: "onChange" });

  // axios
  const onSubmit = (data) => {
    const checkPassword = async () => {
      try {
        const response = await AuthAxios.post("/api/users/checkPass", {
          userNo: loggedUserInfo.userNo,
          password: data.password,
        });
        if (response.data === true) {
          setStepNum(stepNum + 1);
          // console.log(response.data);
        } else if (response.data === false) {
          alert("비밀번호가 틀립니다");
        }
      } catch (err) {
        // console.log(err);
      }
    };
    checkPassword();

    // if(apiData){
    //   setStepNum(stepNum+1);
    // } else {
    //   alert("비밀번호가 맞지 않습니다.");
    //   return false;
    // }
  };

  return (
    <div className="confirmPw flex flex_column align_center">
      <p>
        개인정보를 변경하고 싶으신 경우, 본인확인을 위해 비밀번호를 한 번 더
        입력해주세요.
      </p>
      <form className="flex flex_column align_center" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <input type="password" {...register("password")}></input>
        <p>{errors.password?.message}</p>
        <button type="submit">확인</button>
      </form>
    </div>
  );
}
