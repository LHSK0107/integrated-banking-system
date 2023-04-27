import React, { useContext, useEffect } from "react";
import { StepContext } from "../context/StepContext";
import * as yup from "yup";
import axios from "axios";
import { useForm } from "react-hook-form";
import decodeJwt from "../../../hooks/decodeJwt";
import { LogInContext } from "../../../commons/LogInContext";
import { useNavigate } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import "../mypage.css";

export default function ConfirmPw() {
  // 토큰 확인
  const { token, setToken, loggedUser, setLoggedUser, loggedIn, setLoggedIn } =
    useContext(LogInContext);
  const navigate = useNavigate();
  // 로컬스토리지에서 jwt 가져오기
  const savedToken = localStorage.getItem("jwt");
  setToken(savedToken);

  // 토큰으로 로그인 context api 세팅
  useEffect(() => {
    if (savedToken === null) {
      // 토큰이 없다면
      setLoggedIn(false);
    } else {
      const decodedPayload = decodeJwt(savedToken);
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
  console.log(loggedUser, loggedIn);
  console.log(loggedUser.userNo);

  // 페이지 확인 및 설정
  const { stepNum, setStepNum, userInfo, setUserInfo } =
    useContext(StepContext);
  console.log(stepNum, userInfo);

  // form 유효성 검사
  const schema = yup
    .object({
      password: yup
        .string()
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[?!@#$%^&*+=-])(?=.*[0-9]).{6,20}$/,
          "대/소/특수/숫자 포함하여 입력해주세요."
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
    console.log(data);
    axios
      .post("http://localhost:8080/api/users/checkPass", {
        userNo: loggedUser.userNo,
        password: data.password,
      })
      .then((res) => {
        console.log(res);
        console.log(res.data);
        if (res.status === 200 && res.data === true) {
          setStepNum(stepNum + 1);
        } else if (res.data === false) {
          alert("비밀번호가 맞지 않습니다.");
          return false;
        }
      });
  };

  return (
    <div className="confirmPw flex flex_column">
      <p>
        개인정보를 변경하고 싶으신 경우, 본인확인을 위해 비밀번호를 한 번 더
        입력해주세요.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <input type="password" {...register("password")}></input>
        <button type="submit">확인</button>
      </form>
    </div>
  );
}
