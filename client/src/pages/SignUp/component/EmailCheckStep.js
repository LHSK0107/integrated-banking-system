/* eslint-disable */
import React, { useCallback, useContext, useEffect, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { PageContext } from "../context/PageContext";
import {Link} from "react-router-dom";
const EmailCheckStep = () => {
  const { pageNum, setPageNum, formData, setFormData } = useContext(PageContext);
  // form의 각 요소 지정
  const schema = yup.object().shape({
    email: yup.string().email().required("이메일을 다시 입력해주세요."),
    checkTerm1: yup.bool().oneOf([true], 'IAM 서비스 이용약관에 동의가 필요합니다'),
    checkTerm2: yup.bool().oneOf([true], '개인정보 수집 및 이용에 동의가 필요합니다'),
  }).required();
  const { register ,handleSubmit, formState: { errors }, unregister} = useForm({
    resolver: yupResolver(schema),
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
          <p>E-mail</p>
          <input
            type="text"
            placeholder="이메일을 입력하세요."
            {...register("email")}
            value={userInputValue.email}
            onChange={onChange}
          />
          {errors.email && <p className="signup-error-msg">{errors.email?.message}</p>}
        </div>
        <div className="signup-checkbox-wrap flex justify_between">
          <p>[필수] <Link className="signup-term-link" to="">IAM 서비스 이용약관</Link>에 동의합니다.</p>
          <input
            type="checkbox"
            {...register("checkTerm1")}
          />
        </div>
        {errors.checkTerm1 && <p className="signup-error-msg">{errors.checkTerm1?.message}</p>}
        <hr />
        <input type="submit" value="다음" />
      </form>
    </div>
  );
};

export default EmailCheckStep;