/* eslint-disable */
import React, { setState, useEffect,useContext } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { PageContext } from "../context/PageContext";
import axios from 'axios';
const UserInfo = () => {
  const { pageNum, setPageNum, formData, setFormData } = useContext(PageContext);
  // form의 각 요소 지정
  const schema = yup.object().shape({
    emailCode1: yup.number().positive("숫자만 입력이 가능합니다.").max(1,"한 자리 숫자만 입력이 가능합니다.").required("입력해주세요."),
    emailCode2: yup.number("숫자만 입력이 가능합니다.").positive().max(1).required("입력해주세요."),
    emailCode3: yup.number("숫자만 입력이 가능합니다.").positive().max(1).required("입력해주세요."),
    emailCode4: yup.number("숫자만 입력이 가능합니다.").positive().max(1).required("입력해주세요."),
    emailCode5: yup.number("숫자만 입력이 가능합니다.").positive().max(1).required("입력해주세요."),
    emailCode6: yup.number("숫자만 입력이 가능합니다.").positive().max(1).required("입력해주세요."),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = (data) => {
    console.log(formData);
    axios.post("http://localhost:3001/auth/signup",{
      id: formData.id,
      password: formData.password,
      email: formData.email,
      name: formData.name,
      dept: formData.dept,
      phone: formData.phone,
    }).then((res)=>{console.log(res.data)});
    
    // isVerify === true ? setPageNum(pageNum+1) : alert("다시 한 번 확인해주시기 바랍니다.");
    setPageNum(pageNum+1);
  };
  return (
    <div className="form_container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="email_verify_wrap" >
          <div>
            <input type="number" placeholder="" {...register("emailCode1")} />
            <p>{errors.emailCode1?.message}</p>
          </div>
          <div>
            <input type="number" placeholder="" {...register("emailCode2")} />
            <p>{errors.emailCode2?.message}</p>
          </div>
          <div>
            <input type="number" placeholder="" {...register("emailCode3")} />
            <p>{errors.emailCode3?.message}</p>
          </div>
          <div>
            <input type="number" placeholder="" {...register("emailCode4")} />
            <p>{errors.emailCode4?.message}</p>
          </div>
          <div>
            <input type="number" placeholder="" {...register("emailCode5")} />
            <p>{errors.emailCode5?.message}</p>
          </div>
          <div>
            <input type="number" placeholder="" {...register("emailCode6")} />
            <p>{errors.emailCode6?.message}</p>
          </div>
        </div>
        <div className="form_btn_wrap">
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