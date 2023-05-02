import React, { useCallback, useContext, useEffect, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LogInContext } from "../../../commons/LogInContext";
import { useNavigate } from "react-router";
import decodeJwt from "../../../hooks/decodeJwt";
import axios from "axios";
import { StepContext } from "../context/StepContext";

const UpdateInfo = () => {
  // 토큰 확인
  const { token, setToken, loggedUser, setLoggedUser, loggedIn, setLoggedIn } =
    useContext(LogInContext);
  const navigate = useNavigate();
  // 로컬스토리지에서 jwt 가져오기
  const savedToken = localStorage.getItem("jwt");
  setToken(savedToken);
  
  // 토큰으로 로그인 context api 세팅
  useEffect(() => {
    // 서버에서 회원정보 가져오기
    getUserInfo();
    if (savedToken === null) {
      // 토큰이 없다면
      setLoggedIn(false);
    } else {
      const decodedPayload = decodeJwt(savedToken);
      setLoggedUser({
        id: decodedPayload.sub,
        name: decodedPayload.name,
        exp: decodedPayload.exp,
        userCode: decodedPayload.userCode,
        userNo: decodedPayload.userNo,
      });
      setLoggedIn(true);
    }
  }, [token, setLoggedUser, setLoggedIn]);

  // 페이지 확인 및 설정
  const { stepNum, setStepNum, userInfo, setUserInfo } =
    useContext(StepContext);

  // 회원정보 가져오기
  const getUserInfo = () => {
    axios
      .get(`http://localhost:8080/api/users/${loggedUser.userNo}`, {})
      .then((res) => {
        setUserInfo({
          userNo: res.data.userNo,
          userCode: res.data.userCode,
          name: res.data.name,
          id: res.data.id,
          email: res.data.email,
          tel: res.data.phone,
          dept: res.data.dept,
        });
      });
  };

  // value 관리
  const [prePwValue, setPrePwValue] = useState("");
  const [pwValue, setPwValue] = useState("");
  const [confirmPwValue, setConfirmPwValue] = useState("");
  const [telValue, setTelValue] = useState("");
  console.log(prePwValue, pwValue, confirmPwValue, telValue);

  // form 유효성 검사
  const schema = yup.object().shape({
    presentPassword: yup
      .string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[?!@#$%^&*+=-])(?=.*[0-9]).{6,20}$/,
        "대/소/특수/숫자 포함하여 입력해주세요."
      )
      .min(6, "최소 6자 이상 입력해주세요.")
      .max(20, "최대 20자리까지 입력해주세요.")
      .transform((value) => (value === "" ? null : value))
      .nullable(),
    password: yup
      .string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[?!@#$%^&*+=-])(?=.*[0-9]).{6,20}$/,
        "대/소/특수/숫자 포함하여 입력해주세요."
      )
      .min(6, "최소 6자 이상 입력해주세요.")
      .max(20, "최대 20자리까지 입력해주세요.")
      .transform((value) => (value === "" ? null : value))
      .nullable(),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "패스워드가 다릅니다.")
      .transform((value) => (value === "" ? null : value))
      .nullable(),
    tel: yup
      .string()
      .matches(
        /^[0-9]{3}-[0-9]{4}-[0-9]{4}$/,
        "010-0000-0000 형식으로 입력해주세요."
      )
      .transform((value) => (value === "" ? null : value))
      .nullable(),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    unregister,
  } = useForm({
    resolver: yupResolver(schema),
    // mode: "onChange",
  });

  // 수정사항 보내기
  const onSubmit = (data) => {
    // const values = Object.values(data);
    // const result = values.filter(val => {return val != null})

    // console.log(values);

    // if(result.length) {
    //     console.log("result: ", result);
    // }else {
    //     console.log("모두 null");
    // }

    // 빈 값일 때 unregister
    if (
      data.presentPassword === null &&
      data.password === null &&
      data.confirmPassword === null &&
      data.tel === null
    ) {
      console.log("모두 null");
      alert("변경사항이 없습니다.");
      // return false;
    } else if (
      data.presentPassword !== null ||
      data.password !== null ||
      data.confirmPassword !== null
    ) {
      // 비밀번호 쪽을 하나라도 건들였다면 현재 비밀번호 확인
      axios
        .post("http://localhost:8080/api/users/checkPass", {
          userNo: loggedUser.userNo,
          password: data.presentPassword,
        })
        .then((res) => {
          console.log(res);
          console.log(res.data);
          if (res.status === 200 && res.data === true) {
            // 비밀번호 수정
            axios
              .put("http://localhost:8080/api/users/", {
                userNo: loggedUser.userNo,
                password: data.password,
                phone: data.tel,
              })
              .then((res) => {
                console.log(res);
                console.log(res.data);
                console.log(data);
                if (res.status === 200 && res.data === true) {
                  alert("수정완료");
                } else if (res.data === false) {
                  alert("비밀번호 수정 실패");
                  return false;
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (data.tel !== null) {
      console.log(data);
      //1 axios
      //   .put("http://localhost:8080/api/users/", {
      //     userNo: loggedUser.userNo,
      //     password: data.password,
      //   })
      //   .then((res) => {
      //     console.log(res);
      //     console.log(res.data);
      //     if (res.status === 200 && res.data === true) {
      //     } else if (res.data === false) {
      //       alert("변경한 정보가 없습니다.");
      //       return false;
      //     }
      //   });
    } else {
      console.log("else");
    }
  };

  return (
    <div className="updateInfo">
      <div className="userInfo">
        <ul>
          <li className="flex">
            <p>회원번호</p>
            <p>{userInfo.userNo}</p>
          </li>
          <li className="flex">
            <p>이름</p>
            <p>{userInfo.name}</p>
          </li>
          <li className="flex">
            <p>이메일</p>
            <p>{userInfo.email}</p>
          </li>
          <li className="flex">
            <p>핸드폰번호</p>
            <p>{userInfo.tel}</p>
          </li>
          <li className="flex">
            <p>부서</p>
            <p>{userInfo.dept}</p>
          </li>
        </ul>
      </div>
      <h4>변경할 사항만 입력해주세요.</h4>
      <form
        className="mypage_form flex flex_column justify_center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <ul>
          <li className="flex align_center">
            <p>현재 비밀번호</p>
            <div>
              <input
                type="password"
                value={prePwValue}
                {...register("presentPassword")}
                onChange={(e) => setPrePwValue(e.target.value)}
              />
            </div>
            {errors.presentPassword && (
              <span>{errors.presentPassword?.message}</span>
            )}
          </li>
          <li className="flex align_center">
            <p>변경할 비밀번호</p>
            <div>
              <input
                type="password"
                value={pwValue}
                {...register("password")}
                onChange={(e) => setPwValue(e.target.value)}
              />
            </div>
            <span>{errors.password?.message}</span>
          </li>
          <li className="flex align_center">
            <p>비밀번호 확인</p>
            <div>
              <input
                type="password"
                value={confirmPwValue}
                {...register("confirmPassword")}
                onChange={(e) => setConfirmPwValue(e.target.value)}
              />
            </div>
            <span>{errors.confirmPassword?.message}</span>
          </li>
        </ul>
        <ul>
          <li className="flex align_center">
            <p>변경할 핸드폰번호</p>
            <div>
              <input
                type="tel"
                value={telValue}
                {...register("tel")}
                onChange={(e) => setTelValue(e.target.value)}
              />
            </div>
            <span>{errors.tel?.message}</span>
          </li>
        </ul>
        <button type="submit">수정하기</button>
      </form>
      <div className="flex justify_end">
        <button type="button">탈퇴하기</button>
      </div>
    </div>
  );
};

export default UpdateInfo;
