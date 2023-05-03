/* eslint-disable */
import React, { useState, useEffect, useCallback, useContext, useRef } from "react";
import "./index.css";
import Balance from "../../hooks/useBalance";
import useCurrentTime from "../../hooks/useCurrentTime";
import useAxiosAcctInquiry from "../../api/useAxiosAcctInquiry";
import { Link, useNavigate } from "react-router-dom";
import decodeJwt from "../../hooks/decodeJwt";
import { LogInContext } from "../../commons/LogInContext";
import { Description } from '../../commons/Description';
import { SideNav } from '../../commons/SideNav';
import Breadcrumb from '../../commons/Breadcrumb';
import ExcelExportComponent from "./component/ExcelExportComponent";

const Index = () => {
  // 토큰 확인
  const { token, setToken, loggedUser, setLoggedUser, loggedIn, setLoggedIn } = useContext(LogInContext);
  const navigate=useNavigate();
  // 로컬스토리지에서 jwt 가져오기
  const savedToken = localStorage.getItem("jwt");
  setToken(savedToken);
  
  useEffect(() => {
    if (savedToken === null) {
      setLoggedIn(false);
      // navigate("/login");
    } else {
      const decodedPayload = decodeJwt(savedToken);
      setLoggedUser({
        id: decodedPayload.id,
        name: decodedPayload.name,
        exp: decodedPayload.exp,
        userCode: decodedPayload.userCode,
        userNo: decodedPayload.userNo
      });
      setLoggedIn(true);
    }
  }, [token, setLoggedUser, setLoggedIn]);

  const [optionVal, setOptionVal] = useState({
    lang:"",
    selectDate:""
  });
  /** radio 버튼에 대한 onChange 핸들러 */
  const handleRadioOnChange = (e) => {
    const {name, value} = e.target;
    setOptionVal({...optionVal, [name]:value});
  }

  /** */
  const handleOnSubmit = () =>{
    return false;
  }

  const selectDateRef = useRef();
  // // 현재 date와 date 형식 가져오기
  // // 초기 기본 값으로 오늘 날짜로부터 30일간격의 날짜를 input value로 지정
  const {currentTime} = useCurrentTime(0);
  const initialDate = useCallback(() =>{
    setOptionVal({...optionVal, selectDate:currentTime});
    setLimitInputValue(currentTime);
  },[currentTime]);

  /** 날짜 범위에 따른 달력 제한 부여 */
  const setLimitInputValue = useCallback((end) => {
    selectDateRef.current.setAttribute("max", end);
  },[]);
  // nowDate가 있을 경우, 날짜 초기화 함수 실행
  useEffect(()=>{
    currentTime &&initialDate()
  },[]);

  return (
    <div id="wrap">
      <div className="inner">
        <Breadcrumb title={"조회"} subMenu={"입출금거래내역"} />
        <div className="flex">
          <SideNav />
          <section>
            <h3>일일시재보고서</h3>
            <Description />
            <div className="form_wrap">
              <div className="report_form" onSubmit={handleOnSubmit}>
                <ul>
                  <li className="flex">
                    <p className="flex align_center">언어구분</p>
                    <div
                      className="flex align_center"
                      onChange={handleRadioOnChange}
                    >
                      <input
                        type="radio"
                        id="kor"
                        name="lang"
                        value="kr"
                        defaultChecked
                      />
                      <label>국문</label>
                      <input
                        type="radio"
                        id="eng"
                        name="lang"
                        value="en"
                        disabled
                      />
                      <label>영문</label>
                    </div>
                  </li>
                  <li className="flex">
                    <p className="flex align_center">발급기준년월일</p>
                    <div>
                      <div className="flex align_center">
                        <input
                          type="date"
                          name="strDate"
                          value={optionVal.selectDate}
                          onKeyDown={(e) => e.preventDefault()}
                          ref={selectDateRef}
                        />
                      </div>
                    </div>
                  </li>
                </ul>
                <div className="btn_wrap flex justify_center">
                  {
                    <ExcelExportComponent
                      selectDate={optionVal.selectDate}
                      lang={optionVal.lang}
                    />
                  }
                  <button type="button">이메일로 내보내기</button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
export default Index;
