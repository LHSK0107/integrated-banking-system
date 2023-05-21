import "./login.css";
import React, {useState, useEffect, useContext} from "react";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import decodeJwt from "../../utils/decodeJwt";
import useAuth from "../../hooks/useAuth";
import SignUpBgImg from "../../assets/images/signup-back-image-1.jpg";
const Index = () => {
  const { setIsAuth, setLoggedUserInfo, setToken2 } = useAuth();
  const navigate = useNavigate();

  // login form 유효성 검사
  const schema = yup
    .object({
      username: yup
        .string()
        .matches(/^(?=.*[a-zA-Z0-9]).{6,20}$/, "형식에 맞지 않습니다.")
        .min(6, "최소 6자 이상 입력해주세요.")
        .max(20, "최대 20자리까지 입력해주세요.")
        .required("아이디를 입력해주세요."),
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
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const onSubmit = (data) => {
    axios
      .post("https://iam-api.site/login", {
        username: data.username,
        password: data.password,
      },
      {withCredentials: true})
      .then((response) => {
        // 로그인 성공 시
        if (response.status === 200 && response.headers.get("Authorization")) {
          const token = response.headers.get("Authorization").split(" ")[1];
          // header에 default로 token 싣기
          axios.defaults.headers.common["Authorization"] = "Bearer " + token;
          // token 정보를 가져오기 위해 decode 호출
          const decodedPayload = decodeJwt(token);
          // 로컬스토리지에 jwt 저장
          localStorage.setItem("jwt", token);
          // context api 설정
          setToken2(token);
          setLoggedUserInfo({
            id: decodedPayload.sub,
            name: decodedPayload.name,
            exp: decodedPayload.exp,
            userCode: decodedPayload.userCode,
            userNo: decodedPayload.userNo,
          });
          localStorage.setItem(
            "menuClick",
            JSON.stringify({ "allAccount": 0, "inout": 0, "inoutReport": 0, "dailyReport": 0, "dashboard": 0})
          );
          setIsAuth(true);
        }
        // 대시보드로 리다이렉트
        navigate("/dashboard");
      })
      .catch((err) => {
        alert(err.response.data.message);
        return false;
      });
  };

  const [isLoading, setIsLoading]=useState(true);

  const LoadingImage = () =>{
    return (
      <div className="skeleton flex align_center">
        <div className="skeleton-img"></div>
      </div>
    )
  }
  useEffect(()=>{
    setInterval(()=>{
      setIsLoading(false);
    },500)
  },[]);

  return (
    <div className="login_section flex align_center">
      <div className="inner flex justify_center">
        <div className="login_wrap flex justify_between">
          <div className="pc">
            <div className="login_image_section flex justify_center align_center">
              {
                isLoading ? 
                <LoadingImage/> : 
                <figure className="flex align_center">
                  <img
                    src={SignUpBgImg}
                    alt="로그인 페이지 이미지"
                  />
                </figure>
              }
            </div>
          </div>
          <div className="login_form_section flex flex_column justify_center">
            <h2>로그인</h2>
            <div>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="login_form flex flex_column"
              >
                <div className="flex flex_column">
                  <span>id</span>
                  <input
                    type="text"
                    placeholder="아이디를 입력하세요."
                    {...register("username")}
                  />
                  <p>{errors.username?.message}</p>
                </div>
                <div className="flex flex_column">
                  <span>pw</span>
                  <input
                    type="password"
                    placeholder="패스워드를 입력하세요."
                    {...register("password")}
                  />
                  <p>{errors.password?.message}</p>
                </div>
                <div className="login_btn_wrap flex justify_center align_center">
                  {/* <button className="more_btn" type="button">
                    뒤로
                  </button>
                  <button className="more_btn" type="reset">
                    취소
                  </button> */}
                  <button className="more_btn" type="submit">
                    로그인
                  </button>
                </div>
              </form>
            </div>
            <div className="form_bottom flex justify_center align_center">
              <Link to="">비밀번호 찾기</Link>
              <Link to="">회원가입</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

    