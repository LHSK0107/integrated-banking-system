/* eslint-disable */
import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { PageContext } from "../context/PageContext";
import axios from "axios";
import CheckIcon from "../../../assets/images/icon/check.png";
import ForbiddenIcon from "../../../assets/images/icon/forbidden.png";
const UserInfo = () => {
  const idRef = useRef();

  const { pageNum, setPageNum, formData, setFormData } =
    useContext(PageContext);
  // form의 각 요소 지정
  const schema = yup
    .object()
    .shape({
      id: yup
        .string()
        .matches(/^(?=.*[a-zA-Z0-9]).{6,20}$/, "형식에 맞지 않습니다.")
        .min(6, "최소 6자 이상 입력해주세요.")
        .max(20, "최대 20자리까지 입력해주세요.")
        .required("아이디를 다시 입력해주세요."),
      password: yup
        .string()
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[?!@#$%^&*+=-])(?=.*[0-9]).{6,20}$/,
          "대/소/특수/숫자 포함하여 입력해주세요."
        )
        .min(6, "최소 6자 이상 입력해주세요.")
        .max(20, "최대 20자리까지 입력해주세요.")
        .required("패스워드를 다시 입력해주세요."),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "패스워드가 틀립니다.")
        .required("패스워드를 다시 입력해주세요."),
    })
    .required();
  const {
    register,
    trigger,
    handleSubmit,
    formState: { errors },
    unregister,
  } = useForm({
    resolver: yupResolver(schema),
  });
  /** 다음 버튼 클릭 시, formData에 각 입력값 전달 */
  const onSubmit = (data) => {
    const values = {
      id: data.id,
      password: data.password,
      confirmPassword: data.confirmPassword,
      email: formData.email,
    };
    setFormData({ ...formData, ...values });
    setPageNum(pageNum + 1);
  };
  // input value 관리를 위한 state
  const [userInputValue, setUserInputValue] = useState({
    id: "",
    password: "",
    confirmPassword: "",
    email: "",
  });
  // input name별 onChange 관리
  const onChange = useCallback((e) => {
    const { name, value } = e.target;
    setUserInputValue({ ...userInputValue, [name]: value });
  });
  useEffect(() => {
    // 이전 페이지로 갔다가 다시 다음을 누르는 경우, 이미 input의 각 항목이 register 되어 있어서 오류가 발생하여 unregister 적용
    unregister(["id", "password", "confirmPassword", "email"]);
    // context로부터 저장된 input value 호출
    setUserInputValue({
      ...userInputValue,
      id: formData.id,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      email: formData.email,
    });
  }, []);
  const [checkId, setCheckId] = useState(false);
  const triggerID = () => {
    return trigger(["id"]);
  }
  const checkID = (id) => {
    // trigger는 promise로 리턴하기 때문에 then으로 값 꺼냄
    console.log(triggerID().then((res)=>{
      if(res) {
        axios
          .post("https://iam-api.site/api/signup/id", {
            id: userInputValue.id,
          })
          .then((res) => {
            if (res.data === true) {
              alert("중복된 아이디가 있습니다. 아이디를 다시 입력해주십시오.");
              setCheckId(false);
              console.log(`id 체크 결과: ${res.data}`);
            } else {
              alert("사용 가능한 아이디입니다.");
              setCheckId(true);
              console.log(`id 체크 결과: ${res.data}`);
            }
          });
      } else {
        alert("아이디를 다시 입력해주십시오");
        setCheckId(false);
        return false;
      }
    }));
    
  };
  return (
    <div className="form_container">
      <form className="userInfo_form" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <p>아이디</p>
          <div className="signup_checkID_wrap flex justify_between align_center">
            <input
              type="text"
              placeholder="아이디를 입력하세요."
              {...register("id")}
              value={userInputValue.id}
              onChange={onChange}
            />
            <figure>
              <img
                src={checkId ? CheckIcon : ForbiddenIcon}
                alt="id check icon"
              />
            </figure>
          </div>
          <button
            className="signup_check_btn"
            onClick={(e) => {
              e.preventDefault();
              checkID(userInputValue.id);
            }}
          >
            아이디 중복확인
          </button>
          <span>{errors.id?.message}</span>
        </div>
        <div>
          <p>비밀번호</p>
          <input
            type="password"
            placeholder="패스워드를 입력하세요."
            {...register("password")}
            value={userInputValue.password}
            onChange={onChange}
          />
          <span>{errors.password?.message}</span>
        </div>
        <div>
          <p>비밀번호 확인</p>
          <input
            type="password"
            placeholder="패스워드를 다시 입력하세요."
            {...register("confirmPassword")}
            value={userInputValue.confirmPassword}
            onChange={onChange}
          />
          <span>{errors.confirmPassword?.message}</span>
        </div>
        <div>
          <p>이메일</p>
          <input type="text" value={userInputValue.email} disabled />
        </div>
        <input type="submit" value="다음" />
      </form>
    </div>
  );
};

export default UserInfo;