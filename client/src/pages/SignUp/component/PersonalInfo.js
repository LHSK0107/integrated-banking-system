import React,{useEffect, useContext,useRef, useState, useCallback} from 'react';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { PageContext } from "../context/PageContext";
const PersonalInfo = () => {
  const {pageNum, setPageNum, formData, setFormData}=useContext(PageContext);
     // form의 각 요소 지정
     const schema = yup.object().shape({
      name: yup.string().required("정확한 이름을 입력해주세요."),
      dept: yup.string().required("올바른 부서 정보를 입력해주세요."),
      phone: yup.string().required("올바른 휴대폰 번호를 입력해주세요.")
    });
    const { register, handleSubmit, unregister, formState: {errors}}= useForm({
      resolver: yupResolver(schema)
    });
    const onSubmit=(data)=>{
      const values = {
        name: data.name,
        dept: data.dept,
        phone: data.phone
      }
      setFormData({...formData, ...values});
      setPageNum(pageNum+1);
    }
    // input value 관리를 위한 state
    const [personalInputValue, setPersonalInputValue] = useState({
      name: "",
      dept: "",
      phone: ""
    });
    // input name별 onChange 관리
    const onChange = useCallback((e) => {
      const {name, value}=e.target;
      setPersonalInputValue({...personalInputValue,[name]:value});
    });
    // 최상단 input focus를 위해 Ref 부여
    const initialFocusRef=useRef();
    useEffect(()=>{
      formData.id==="" && initialFocusRef.current.focus();
      unregister(["name","dept","phone"]);
      setPersonalInputValue({...personalInputValue,
        name:formData.name,
        dept: formData.dept,
        phone: formData.phone
        });
    },[]);
  return (
    <div>
       <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input ref={initialFocusRef} type="text" value={personalInputValue.name} onChange={onChange} placeholder="이름을 입력하세요." autoComplete="none" {...register("name")} />
          <p>{errors.name?.message}</p>
        </div>
        <div>
          <input type="text" value={personalInputValue.dept} onChange={onChange} placeholder="부서를 입력하세요." autoComplete="none" {...register("dept")} />
          <p>{errors.dept?.message}</p>
        </div>
        <div>
          <input type="text" value={personalInputValue.phone} onChange={onChange} placeholder="휴대폰 번호를 '-'를 포함하여 입력하세요." autoComplete="none" {...register("phone")} />
          <p>{errors.phone?.message}</p>
        </div>
        <hr/>
        <div className="form_btn_wrap">
          <button type="button" className="prev_btn" onClick={()=>{setPageNum(pageNum-1)}}>이전</button>
          <input type="submit" value="다음"/>
        </div>
      </form>
    </div>
  )
};

export default PersonalInfo;
