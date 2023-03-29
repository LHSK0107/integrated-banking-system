/* eslint-disable */
import React, { useContext, useEffect, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { PageContext } from "../context/PageContext";
const UserInfo = () => {
  const { pageNum, setPageNum, formData, setFormData } =
    useContext(PageContext);
  // form의 각 요소 지정
  const schema = yup.object().shape({
    id: yup.string().required("아이디를 다시 입력해주세요."),
    password: yup
      .string()
      .min(8, "최소 8자 이상 입력해주세요.")
      .max(14)
      .required("패스워드를 다시 입력해주세요."),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "패스워드가 틀립니다.")
      .required("패스워드를 다시 입력해주세요."),
    email: yup.string().email().required("이메일을 다시 입력해주세요."),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [inputChangeList, setInputChangeList] = useState(["", "", "", ""]);
  const [value, setValue] = useState("");
  const onChange = (e) => {
    setValue(e.target.value);
  };
  const onSubmit = (data) => {
    const values = {
      id: data.id,
      password: data.password,
      confirmPassword: data.confirmPassword,
      email: data.email,
    };
    for(ele of values){
      setInputChangeList({...inputChangeList, ele})
    }
    setFormData({ ...formData, ...values });
    setValue(data.id);
    setPageNum(pageNum + 1);
  };

  return (
    <div>
      <form class="userInfo_form" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label></label>
          <input
            type="text"
            placeholder="아이디를 입력하세요."
            value={value}
            onChange={(e) => onChange(e)}
            {...register("id")}
          />
          <p>{errors.id?.message}</p>
        </div>
        <div>
          <label></label>
          <input
            type="password"
            placeholder="패스워드를 입력하세요."
            {...register("password")}
          />
          <p>{errors.password?.message}</p>
        </div>
        <div>
          <label></label>
          <input
            type="password"
            placeholder="패스워드를 다시 입력하세요."
            {...register("confirmPassword")}
          />
          <p>{errors.confirmPassword?.message}</p>
        </div>
        <div>
          <label></label>
          <input
            type="text"
            placeholder="이메일을 입력하세요."
            {...register("email")}
          />
          <p>{errors.email?.message}</p>
        </div>
        <hr />
        <input type="submit" value="다음" />
      </form>
    </div>
  );
};

export default UserInfo;
