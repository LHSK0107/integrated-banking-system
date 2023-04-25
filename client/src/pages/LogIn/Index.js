import "./index.css";
import React, { useCallback, useContext, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import SignUpBgImg from "../../assets/images/signup-back-image-1.jpg";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { LogInContext } from "../../commons/LogInContext";
import decodeJwt from "../../hooks/decodeJwt";
// import jwt_decode from 'jsonwebtoken';

const Index = () => {
  const { loggedUser, setLoggedUser, loggedIn, setLoggedIn } = useContext(LogInContext);
  console.log(loggedUser);
  console.log(loggedIn);

  const navigate = useNavigate();

  // login form 유효성 검사
  const schema = yup.object({
    username: yup
      .string()
      .matches(/^(?=.*[a-zA-Z0-9]).{6,20}$/, "형식에 맞지 않습니다.")
      .min(6, "최소 6자 이상 입력해주세요.")
      .max(20, "최대 20자리까지 입력해주세요.")
      .required("아이디를 입력해주세요."),
    password: yup
      .string()
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[?!@#$%^&*+=-])(?=.*[0-9]).{6,20}$/, "대/소/특수/숫자 포함하여 입력해주세요.")
      .min(6, "최소 6자 이상 입력해주세요.")
      .max(20, "최대 20자리까지 입력해주세요.")
      .required("패스워드를 입력해주세요.")
  }).required();
  const {
    register,
    handleSubmit,
    formState: { errors },
    //   } = useForm({ resolver: yupResolver(schema) });
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange", // 바뀔 때마다
  });

  // input value 관리를 위한 state
  // const [userInputValue, setUserInputValue] = useState({
  //   username:"",
  //   password:""
  // });
  // input name별 onChange 관리
  // const onChange = ((e) => {
  //   const {name, value} = e.target;
  //   // console.log(e.target.name, e.target.value);
  //   setUserInputValue({...userInputValue,[name]:value});
  // });

  const onSubmit = (data) => {
    // json 보내기
    console.log(data);
    axios
      .post("http://localhost:8080/login", {
        username: data.username,
        password: data.password,
      })
      .then((response) => {
        // 로그인 성공 시
        if(response.status === 200 && response.headers.get("Authorization")) {
          const token = response.headers.get("Authorization").split(" ")[1];
          // header에 default로 token 싣기
          axios.defaults.headers.common["Authorization"] = "Bearer " + token;

          // token을 decode
          const decodedPayload = decodeJwt(token);
          // 로컬스토리지에 jwt
          localStorage.setItem("jwt", token);
          // context api 설정
          setLoggedUser({
            id: decodedPayload.id,
            name: decodedPayload.name,
            exp: decodedPayload.exp,
            userCode: decodedPayload.userCode,
            userNo: decodedPayload.userNo
          });
          setLoggedIn(true);
        }
        // 대시보드로 리다이렉트
        navigate("/dashboard")
      })
      .catch((error) => {
        if(error) console.log(error);
      })
      .finally(() => {
      });
  };

  // console.log(watch("example")); // watch input value by passing the name of it

  return (
    <div className="login_section">
      <div className="inner flex justify_center">
          <div className="login flex justify_center align_center">
            <figure>
              <img src={SignUpBgImg} alt="로그인 페이지 이미지" />
            </figure>
          </div>

          <div className="login_form_section">
            <h2>로그인</h2>
            <div>
              <form onSubmit={handleSubmit(onSubmit)}  className="login_form flex flex_column">
                <div className="flex flex_column">
                  <span>id</span>
                  <input
                    type="text"
                    placeholder="아이디를 입력하세요."
                    {...register("username")}
                    // value={userInputValue.username}
                    // onChange={onChange}
                  />
                  {/* {errors.id && <p>This field is required</p>} */}
                  <p>{errors.username?.message}</p>
                </div>
                <div className="flex flex_column">
                  <span>pw</span>
                  <input
                    type="password"
                    placeholder="패스워드를 입력하세요."
                    {...register("password")}
                    // value={userInputValue.password}
                    // onChange={onChange}
                  />
                  <p>{errors.password?.message}</p>
                </div>
                <div className="login_btn_wrap flex justify_center align_center">
                  <button className="more_btn" type="button">뒤로</button>
                  <button className="more_btn" type="reset">취소</button>
                  <button className="more_btn" type="submit">로그인</button>
                </div>
              </form>
            </div>
            <div className="form_bottom flex justify_center align_center">
              {/* <Link to="">아이디 찾기</Link> */}
              <Link to="">비밀번호 찾기</Link>
              <Link to="">회원가입</Link>
            </div>
          </div>
      </div>
    </div>
  );
};

export default Index;