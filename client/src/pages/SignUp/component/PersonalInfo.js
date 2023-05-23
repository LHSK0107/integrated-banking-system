/* eslint-disable */
import React, {
  useEffect,
  useContext,
  useRef,
  useState,
  useCallback,
} from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { PageContext } from "../context/PageContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthAxios } from "../../../api/useCommonAxios";
const PersonalInfo = () => {
  const navigate = useNavigate();
  const { pageNum, setPageNum, formData, setFormData } =
    useContext(PageContext);
  const [dept, setDept] = useState([]);
  // 부서 가져오기
  useEffect(() => {
    const controller = new AbortController();
    const getDept = async () => {
      try {
        const response = await AuthAxios.get(`/api/dept`);
        // console.log(response);
        if (response.status === 200) {
          setDept(response.data.map((ele) => ele.dept));
        }
      } catch (err) {
        // console.log(err);
      }
    };
    getDept();
    return () => {
      controller.abort();
    }; 
  }, [AuthAxios]);
  // form의 각 요소 지정
  const schema = yup.object().shape({
    name: yup.string().required("정확한 이름을 입력해주세요."),
    dept: yup.string().required("올바른 부서 정보를 입력해주세요."),
    phone: yup.string().required("올바른 휴대폰 번호를 입력해주세요."),
  });
  const {
    register,
    handleSubmit,
    unregister,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = (data) => {
    // console.log(
    //   `data: ${data}, id:${formData.id},pw:${formData.password}, email:${formData.email}`
    // );
    const values = {
      name: data.name,
      dept: data.dept,
      phone: data.phone,
    };
    setFormData({ ...formData, ...values });
    axios
      .post("https://iam-api.site/api/signup", {
        id: formData.id,
        password: formData.password,
        name: data.name,
        dept: data.dept,
        email: formData.email,
        phone: data.phone,
      })
      .then((res) => {
        if (res.data === "success") {
          alert("회원가입에 성공하였습니다.");
          navigate("/login");
        } else {
          alert("회원가입에 실패하였습니다. 다시 시도해주세요.");
          navigate("/signup");
        }
      });
  };
  // input value 관리를 위한 state
  const [personalInputValue, setPersonalInputValue] = useState({
    name: "",
    dept: "",
    phone: "",
  });
  // input name별 onChange 관리
  const onChange = useCallback((e) => {
    const { name, value } = e.target;
    setPersonalInputValue({ ...personalInputValue, [name]: value });
  });
  useEffect(() => {
    unregister(["name", "dept", "phone"]);
    setPersonalInputValue({
      ...personalInputValue,
      name: formData.name,
      dept: formData.dept,
      phone: formData.phone,
    });
  }, []);
  return (
    <div className="form_container">
      <form className="userInfo_form" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <p>이름</p>
          <input
            type="text"
            placeholder="이름을 입력하세요."
            {...register("name")}
            value={personalInputValue?.name}
            onChange={onChange}
          />
          <p>{errors.name?.message}</p>
        </div>
        <div>
          <p>부서</p>
          <select value={personalInputValue?.dept} {...register("dept")} onChange={onChange}>
            {dept.map((ele) => (
              <option
                value={ele}
                key={ele}
              >
                {ele}
              </option>
            ))}
          </select>
          <p>{errors.dept?.message}</p>
        </div>
        <div>
          <p>휴대폰번호</p>
          <input
            type="text"
            value={personalInputValue?.phone}
            {...register("phone")}
            onChange={onChange}
            placeholder="휴대폰번호를 '-'를 포함하여 입력하세요."
          />
          <p>{errors.phone?.message}</p>
        </div>
        <div className="form_btn_wrap flex justify_between align_center">
          <button
            className="prev_btn"
            onClick={() => {
              setPageNum(pageNum - 1);
            }}
          >
            이전
          </button>
          <input type="submit" value="회원가입" />
        </div>
      </form>
    </div>
  );
};

export default PersonalInfo;
