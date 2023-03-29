import React, { setState, useEffect,useContext } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { PageContext } from "../context/PageContext";
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
    setPageNum(pageNum+1);
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div class="email_verify_wrap" >
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
        <div class="form_btn_wrap">
          <button
            class="prev_btn"
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
