/* eslint-disable */
import React, { useCallback, useContext, useEffect, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { PageContext } from "../context/PageContext";
const UserInfo = () => {
  const { pageNum, setPageNum, formData, setFormData } = useContext(PageContext);
  // form의 각 요소 지정
  const schema = yup.object().shape({
    id: yup
      .string()
      .matches(/^(?=.*[a-zA-Z0-9]).{6,20}$/, "형식에 맞지 않습니다.")
      .min(6, "최소 6자 이상 입력해주세요.")
      .max(20, "최대 20자리까지 입력해주세요.")
      .required("아이디를 다시 입력해주세요."),
    password: yup
      .string()
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[?!@#$%^&*+=-])(?=.*[0-9]).{6,20}$/, "대/소/특수/숫자 포함하여 입력해주세요.")
      .min(6, "최소 6자 이상 입력해주세요.")
      .max(20, "최대 20자리까지 입력해주세요.")
      .required("패스워드를 다시 입력해주세요."),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "패스워드가 틀립니다.")
      .required("패스워드를 다시 입력해주세요."),
    email: yup
      .string()
      .matches(/^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, "이메일 형식으로 입력해주세요.")
      .email()
      .required("이메일을 입력해주세요."),
  }).required();
  const { register ,handleSubmit, formState: { errors }, unregister} = useForm({
    resolver: yupResolver(schema), mode: "onChange",
  });
  // 다음 버튼 클릭 시, formData에 각 입력값 전달
  const onSubmit = (data) => {
    const values = {
      id: data.id,
      password: data.password,
      confirmPassword: data.confirmPassword,
      email: data.email,
    };
    setFormData({ ...formData, ...values });
    setPageNum(pageNum + 1);
  };
  // input value 관리를 위한 state
  const [userInputValue, setUserInputValue] = useState({
    id:"",
    password:"",
    confirmPassword:"",
    email:""
  });
  // input name별 onChange 관리
  const onChange = useCallback((e) => {
    const {name, value}=e.target;
    setUserInputValue({...userInputValue,[name]:value});
  });
  useEffect(() => {
    // 이전 페이지로 갔다가 다시 다음을 누르는 경우, 이미 input의 각 항목이 register 되어 있어서
    // 오류가 발생하여 unregister 적용
    unregister(["id","password","confirmPassword","email"]);
    // context로부터 저장된 input value 호출
    setUserInputValue({...userInputValue,
    id:formData.id,
    password: formData.password,
    confirmPassword: formData.confirmPassword,
    email: formData.email
    });
  }, []);
  return (
    <div className="form_container">
      <form className="userInfo_form" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input
            type="text"
            placeholder="아이디를 입력하세요."
            {...register("id")}
          />
          <p>{errors.id?.message}</p>
        </div>
        <div>
          <input
            type="password"
            placeholder="패스워드를 입력하세요."
            {...register("password")}
          />
          <p>{errors.password?.message}</p>
        </div>
        <div>
          <input
            type="password"
            placeholder="패스워드를 다시 입력하세요."
            {...register("confirmPassword")}
          />
          <p>{errors.confirmPassword?.message}</p>
        </div>
        <div>
          <input
            type="text"
            placeholder="이메일을 입력하세요."
            {...register("email")}
            // value={userInputValue.email}
            // onChange={onChange}
          />
          <p>{errors.email?.message}</p>
        </div>
        <input type="submit" value="다음" />
      </form>
    </div>
  );
};

export default UserInfo;