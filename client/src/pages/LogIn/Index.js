import "./index.css";
import React, { useCallback, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import SignUpBgImg from "../../assets/images/signup-back-image-1.jpg";
import axios from "axios";
import { Link } from "react-router-dom";

const Index = () => {
  // alert( document.cookie );
  const schema = yup.object({
    username: yup
      .string()
      .min(6, "최소 6자 이상 입력해주세요.")
      .max(20, "최대 20자리까지 입력해주세요.")
      .required("아이디를 입력해주세요."),
    password: yup
      .string()
      .min(6, "최소 6자 이상 입력해주세요.")
      .max(20, "최대 20자리까지 입력해주세요.")
      .required("패스워드를 입력해주세요.")
  }).required();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    //   } = useForm({ resolver: yupResolver(schema) });
  } = useForm({
    resolver: yupResolver(schema)
  });

  // input value 관리를 위한 state
  const [userInputValue, setUserInputValue] = useState({
    username:"",
    password:""
  });
  // input name별 onChange 관리
  const onChange = ((e) => {
    const {name, value} = e.target;
    console.log(e.target.name, e.target.value);
    setUserInputValue({...userInputValue,[name]:value});
  });

  const onSubmit = (data) => {
    // json 보내기
    console.log(data);
    axios
      .post("http://localhost:8080/login", {
        username: data.username,
        password: data.password,
      },
      {
        headers: {
          // "Access-Control-Allow-Origin": "http://localhost:8080",
          // "Access-Control-Allow-Credentials": true,
          // "Access-Control-Allow-Methods": "POST, OPTIONS"
        }
      })
      .then((response) => {
        // console.log(response, response.status, response.data.token);
        if(response.status === 200) {
          // 로그인 성공 시
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // console.log(watch("example")); // watch input value by passing the name of it

  return (
    <div className="login_section">
      <div className="inner">
        <div className="content flex align_center">
          <div className="content_right_container flex justify_center align_center">
            <figure>
              <img src={SignUpBgImg} alt="로그인 페이지 이미지" />
            </figure>
          </div>

          <div className="content_right_container">
            <h2>로그인</h2>
            <div>
              <form onSubmit={handleSubmit(onSubmit)}  className="login_form flex flex_column">
                <div className="flex">
                  <input
                    type="text"
                    placeholder="아이디를 입력하세요."
                    {...register("username")}
                    value={userInputValue.username}
                    onChange={onChange}
                  />
                  {/* {errors.id && <p>This field is required</p>} */}
                  <p>{errors.username?.message}</p>
                </div>
                <div className="flex">
                  <input
                    type="password"
                    placeholder="패스워드를 입력하세요."
                    {...register("password")}
                    value={userInputValue.password}
                    onChange={onChange}
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
              <Link to="">아이디 찾기</Link>
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