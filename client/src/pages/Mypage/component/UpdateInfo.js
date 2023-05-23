import React, { useCallback, useContext, useEffect, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router";
import { StepContext } from "../context/StepContext";
import useAuth from "../../../hooks/useAuth";
import useAxiosInterceptor from "../../../hooks/useAxiosInterceptor";
import autoLogout from "../../../utils/autoLogout";
import axios from "axios";

import "../mypage.css";

const UpdateInfo = () => {
  const AuthAxios = useAxiosInterceptor();
  const { setToken2, loggedUserInfo, setIsAuth, setLoggedUserInfo } =
    useAuth();
  const navigate = useNavigate();
  let menuList = JSON.parse(localStorage.getItem("menuClick"));

  // 페이지 확인 및 설정
  const { stepNum, setStepNum, userInfo, setUserInfo } =
    useContext(StepContext);

  useEffect(() => {
    const controller = new AbortController();
    const getInfo = async () => {
      try {
        const response = await AuthAxios.get(
          `/api/users/${loggedUserInfo.userNo}`
        );
        if (response.status === 200) {
          setUserInfo({
            userNo: response.data.userNo,
            userCode: response.data.userCode,
            name: response.data.name,
            id: response.data.id,
            email: response.data.email,
            tel: response.data.phone,
            dept: response.data.dept,
          });
        }
      } catch (err) {
        // console.log(err);
      }
    };
    getInfo();
    return () => {
      controller.abort();
    };
  }, [AuthAxios]);

  // value 관리
  const [prePwValue, setPrePwValue] = useState(null);
  const [pwValue, setPwValue] = useState(null);
  const [confirmPwValue, setConfirmPwValue] = useState(null);
  const [telValue, setTelValue] = useState(null);
  // console.log(prePwValue, pwValue, confirmPwValue, telValue);

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
  } = useForm({
    resolver: yupResolver(schema),
    // mode: "onChange",
  });

  // 수정사항 보내기
  const onSubmit = (data) => {
    // 모두 null 이라면 땡!
    if (
      data.presentPassword === null &&
      data.password === null &&
      data.confirmPassword === null &&
      data.tel === null
    ) {
      // console.log("모두 null");
      alert("변경사항이 없습니다.");
    }
    // 패스워드만 null이고 전화번호는 변경했을 때
    else if (
      data.presentPassword === null &&
      data.password === null &&
      data.confirmPassword === null &&
      data.tel !== null
    ) {
      // 전화번호만 업데이트
      const updateTel = async () => {
        try {
          const response = await AuthAxios.put("/api/users", {
            userNo: loggedUserInfo.userNo,
            password: null,
            phone: data.tel,
          });
          if (response.status === 200) {
            alert("수정되었습니다.");
            navigate("/");
          }
        } catch (err) {
          // console.log(err);
        }
      };
      updateTel();
    }
    // 패스워드가 null은 아닐 때
    else if (
      data.presentPassword !== null ||
      data.password !== null ||
      data.confirmPassword !== null
    ) {
      // 패스워드 입력은 했는데, 이전과 같을 때
      if (data.presentPassword === data.password) {
        alert("비밀번호가 이전과 같습니다.");
      }
      // 모두 null은 아니지만 pw 중에 하나라도 null이 아니면 현재 pw 확인하는 api 후 업데이트
      else if (data.presentPassword !== data.password) {
        // 패스워드 확인
        const checkPassword = async () => {
          try {
            const response = await AuthAxios.post("/api/users/checkPass", {
              userNo: loggedUserInfo.userNo,
              password: data.presentPassword,
            });
            // 맞으면 업데이트 api 호출
            if (response.data === true) {
              const updatePwTel = async () => {
                try {
                  const response = await AuthAxios.put("/api/users", {
                    userNo: loggedUserInfo.userNo,
                    password: data.password,
                    phone: data.tel,
                  });
                  if (response.status === 200) {
                    alert("수정되었습니다.");
                    navigate("/");
                  }
                } catch (err) {
                  alert(err.response.data.message);
                  // console.log(err);
                }
              };
              updatePwTel();
            } else if (response.data === false) {
              alert("비밀번호가 잘못되었습니다.");
            }
          } catch (err) {
            alert(err.response.data.message);
            // console.log(err);
          }
        };
        checkPassword();
        // 틀리면 땡!
      } else {
        // console.log(data);
      }
    }
  };
  // console.log(menuList);

  const handleWithdraw = () => {
    /** logout시, context 비우는 함수 */
    const logout = () => {
      setToken2(null);
      setLoggedUserInfo(null);
      setIsAuth(false);
      navigate("/login");
    };

    if (window.confirm("탈퇴하시겠습니까?")) {
      axios
        .delete(
          `https://iam-api.site/api/users/${loggedUserInfo.userNo}`,
          { data: menuList },
          { withCredentials: true }
        )
        .then((res) => {
          // console.log(res);
          if (res.status === 200) {
            alert("탈퇴되었습니다.");
            localStorage.removeItem("jwt");
            localStorage.removeItem("menuClick");
            logout();
          }
        })
        // .catch((err) => console.log(err));
    }
  };

  // 탈퇴하기
  const deleteMe = () => {
    if (loggedUserInfo.userCode !== "ROLE_ADMIN") {
      return (
        <div className="flex justify_end">
          <button type="button" className="withdraw" onClick={handleWithdraw}>
            탈퇴하기
          </button>
        </div>
      );
    }
  };

  return (
    <div className="updateInfo">
      <div className="userInfo">
        <ul>
          {loggedUserInfo.userCode === "ROLE_USER" ? (
            <></>
          ) : (
            <li className="flex">
              <p>회원번호</p>
              <p>{userInfo.userNo}</p>
            </li>
          )}

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
                onChange={(e) => {
                  if (e.target.value === "") {
                    setPrePwValue(null);
                  } else setPrePwValue(e.target.value);
                }}
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
                onChange={(e) => {
                  if (e.target.value === "") {
                    setPwValue(null);
                  } else setPwValue(e.target.value);
                }}
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
                onChange={(e) => {
                  if (e.target.value === "") {
                    setConfirmPwValue(null);
                  } else setConfirmPwValue(e.target.value);
                }}
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
                onChange={(e) => {
                  if (e.target.value === "") {
                    setTelValue(null);
                  } else setTelValue(e.target.value);
                }}
              />
            </div>
            <span>{errors.tel?.message}</span>
          </li>
        </ul>
        <div className="flex justify_center">
          <button type="submit">수정하기</button>
        </div>
      </form>
      {deleteMe()}
    </div>
  );
};

export default UpdateInfo;
