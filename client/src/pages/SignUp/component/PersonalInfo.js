import React,{useEffect, useContext,useRef} from 'react';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { PageContext } from "../context/PageContext";
const PersonalInfo = () => {
  const {pageNum, setPageNum, formData, setFormData}=useContext(PageContext);
     // form의 각 요소 지정
     const schema = yup.object().shape({
      username: yup.string().required("정확한 이름을 입력해주세요."),
      department: yup.string().required("올바른 부서 정보를 입력해주세요."),
      phoneNum: yup.string().required("올바른 휴대폰 번호를 입력해주세요.")
    });
    const { register, handleSubmit, formState: {errors}}= useForm({
      resolver: yupResolver(schema)
    });
    const onSubmit=(data)=>{
      const values = {
          username: data.username,
          department: data.department,
          phoneNum: data.phoneNum
      }
      setFormData({...formData, ...values});
      setPageNum(pageNum+1);
    }
    const initialFocusRef=useRef();
    useEffect(()=>{
      formData.id==="" && initialFocusRef.current.focus();
    },[]);
  return (
    <div>
       <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label></label>
          <input ref={initialFocusRef} type="text" placeholder="이름을 입력하세요." {...register("username")} />
          <p>{errors.username?.message}</p>
        </div>
        <div>
          <label></label>
          <input type="text" placeholder="부서를 입력하세요." {...register("department")} />
          <p>{errors.department?.message}</p>
        </div>
        <div>
          <label></label>
          <input type="text" placeholder="휴대폰 번호를 '-'를 포함하여 입력하세요." {...register("phoneNum")} />
          <p>{errors.phoneNum?.message}</p>
        </div>
        <hr/>
        <div class="form_btn_wrap">
          <button class="prev_btn" onClick={()=>{setPageNum(pageNum-1)}}>이전</button>
          <input type="submit" value="다음"/>
        </div>
      </form>
      {/* <div className="form_btn_wrap">
            {
              pageNum!==0 && <button onClick={()=>{setPageNum((currentIdx)=>currentIdx-1)}}>이전</button> 
            }
            <button
              onClick={() => {
                if (pageNum === 2) {
                  console.log(formData);
                } else {
                  setPageNum((currentIdx) => currentIdx + 1);
                }
              }}
            >
              {pageNum === 2 ? "등록" : "다음"}
            </button>
          </div> */}
    </div>
  )
};

export default PersonalInfo;