/* eslint-disable */
import "./dailyreport.css";
import React, { useState, useEffect, useCallback, useRef } from "react";
import useCurrentTime from "../../hooks/useCurrentTime";
import { Description } from '../../commons/Description';
import { SideNavReport } from '../../commons/SideNavReport';
import Breadcrumb from '../../commons/Breadcrumb';
import useAxiosInterceptor from "../../hooks/useAxiosInterceptor";
import ExcelExportComponent from "./component/ExcelExportComponent";
import "./dailyreport.css";

const Index = () => {
  const AuthAxios = useAxiosInterceptor();
  const [optionVal, setOptionVal] = useState({
    lang:"",
    selectDate:""
  });
  /** radio 버튼에 대한 onChange 핸들러 */
  const handleRadioOnChange = (e) => {
    const {name, value} = e.target;
    setOptionVal({...optionVal, [name]:value});
  }
  /** 제출 */
  const handleOnSubmit = (e) =>{
    e.preventDefault();
    return false;
  }
  // 현재 date와 date 형식 가져오기
  const selectDateRef = useRef();
  const {currentTime} = useCurrentTime(0);
  // 초기 기본 값으로 오늘 날짜로부터 30일간격의 날짜를 input value로 지정
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
    currentTime && initialDate();
  },[]);

  const [apiData, setApiData]=useState(null);
  const handleClickExcelExport = () =>{
    // cancellation token
    const getData = async () => {
        const apiData = await AuthAxios.post("/api/users/reports/daily");
        return apiData;
    }
    getData().then(res=>{
      setApiData(res.data);
    });
  }
 
  return (
    <div id="wrap">
      <div className="inner">
        <Breadcrumb title={"보고서"} subMenu={"일일시재보고서"} />
        <div className="dailyReport flex">
          <SideNavReport now={"일일시재보고서"} />
          <section>
            <h3>일일시재보고서</h3>
            <Description />
            <div className="form_wrap">
              <form className="report_form" onSubmit={e=>handleOnSubmit(e)}>
                <ul>
                  <li className="flex">
                    <p className="flex align_center">언어구분</p>
                    <div
                      className="flex align_center"
                      onChange={handleRadioOnChange}
                    >
                      <label className="flex align_center">
                      <input
                        type="radio"
                        id="kor"
                        name="lang"
                        value="kr"
                        defaultChecked
                      />
                      국문</label>
                      <label className="flex align_center">
                      <input
                        type="radio"
                        id="eng"
                        name="lang"
                        value="en"
                        disabled
                      />
                      영문</label>
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
                          readOnly={true}
                        />
                      </div>
                    </div>
                  </li>
                </ul>
                <div className="btn_wrap flex justify_center">
                  <button onClick={()=>{
                    handleClickExcelExport();
                  }}>Excel 내보내기</button>
                    {apiData && <ExcelExportComponent data={apiData}/>}
                  <button type="button">이메일로 내보내기</button>
                </div>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
export default Index;
