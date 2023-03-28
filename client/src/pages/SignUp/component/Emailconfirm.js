import React, { memo } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
const UserInfo = memo(() => {
    // form의 각 요소 지정
  const schema = yup.object().shape({
    id: yup.string().required("아이디를 다시 입력해주세요."),
    password: yup.string().min(8).max(14).required("패스워드를 다시 입력해주세요."),
    confirmPassword: yup.string().oneOf([yup.ref("password"),null],"패스워드를 다시 입력해주세요.").required(),
    email: yup.string().email().required("이메일을 다시 입력해주세요.")
  });
  const { register, handleSubmit, formState: {errors}}= useForm({
    resolver: yupResolver(schema)
  });
  const onSubmit=(data)=>{
    console.log(data);
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label></label>
          <input type="text" placeholder="아이디를 입력하세요." {...register("id")} />
          <p>{errors.id?.message}</p>
        </div>
        <div>
          <label></label>
          <input type="password" placeholder="패스워드를 입력하세요." {...register("password")} />
          <p>{errors.password?.message}</p>
        </div>
        <div>
          <label></label>
          <input type="password" placeholder="패스워드를 다시 입력하세요." {...register("confirmPassword")} />
          <p>{errors.confirmPassword?.message}</p>
        </div>
        <div>
          <label></label>
          <input type="text" placeholder="이메일을 입력하세요." {...register("email")} />
          <p>{errors.email?.message}</p>
        </div>
      </form>
    </div>
  );
});

export default UserInfo;
