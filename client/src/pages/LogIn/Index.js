import "./index.css";
import React, { memo, useState } from "react";
import SignUpBgImg from "../../assets/images/signup-back-image-1.jpg";
import { useForm } from "react-hook-form";
import axios from "axios";

const Index = memo(() => {
  const [id, setId] = useState();
  const [pw, setPw] = useState();

  // id 값 변화
  const idChange = (e) => {
    setId(e.target.value);
  };

  // pw 값 변화
  const pwChange = (e) => {
    setPw(e.target.value);
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    //   } = useForm({ resolver: yupResolver(schema) });
  } = useForm();

  const onSubmit = (data) => {
    console.log("data", data);

    // json 보내기
    axios
      .post("/user", {
        id: data.id,
        pw: data.pw,
      })
      .then(function (response) {
        console.log(response, response.status, response.data.token);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  console.log(watch("example")); // watch input value by passing the name of it

  return (
    <div className="login_section">
      <div className="login_image_section">
        <figure>
          <img src={SignUpBgImg} alt="로그인 페이지 이미지" />
        </figure>
      </div>

      <div className="login_form_section">
        <h1>로그인</h1>
        <div className="login_form">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <input
                id="id"
                type="text"
                name="id"
                onChange={idChange}
                placeholder="아이디를 입력하세요."
                {...register("id", { required: true })}
              />
              {errors.id && <p>This field is required</p>}
            </div>
            <div>
              <input
                id="pw"
                type="password"
                name="pw"
                onChange={pwChange}
                placeholder="패스워드를 입력하세요."
                {...register("pw", { required: true })}
              />
              {errors.pw && <p>This field is required</p>}
            </div>
            <div className="login_btn_wrap">
              <button type="button">뒤로</button>
              <button type="reset">취소</button>
              <button type="submit">로그인</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});

export default Index;
