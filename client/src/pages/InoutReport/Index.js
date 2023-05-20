/* eslint-disable */
import "./inoutReport.css";
import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import ReactDOMServer from "react-dom/server";
import { Description } from "../../commons/Description";
import { SideNav } from "../../commons/SideNav";
import Breadcrumb from "../../commons/Breadcrumb";
import BankName from "../../hooks/useBankName";
import useCurrentTime from "../../hooks/useCurrentTime";
import useAxiosInterceptor from "../../hooks/useAxiosInterceptor";
import useAuth from "../../hooks/useAuth";
import ExcelExportComponent from "./component/ExcelExportComponent";

const Index = () => {
  const AuthAxios = useAxiosInterceptor();
  const { loggedUserInfo } = useAuth();
  /** 폼에 대한 각 요소 변수 저장 -> 변수명 차후 변경 */
  const [optionVal, setOptionVal] = useState({
    bankCD: "",
    acctNO: "",
    strDate: "",
    endDate: ""
  });

  const [apiData, setApiData] = useState(null);
  // 사용자가 볼 수 있는 계좌를 가져옴
  useEffect(() => {
    const controller = new AbortController();
    const getAvailableAcct = async () => {
      try {
        const response = await AuthAxios.get(
          loggedUserInfo?.userCode === "ROLE_ADMIN" ||
            loggedUserInfo?.userCode === "ROLE_MANAGER"
            ? "/api/manager/accounts"
            : `/api/users/accounts/available/${loggedUserInfo?.userNo}`,
          {
            signal: controller.signal,
          }
        );
        setApiData(response.data);
      } catch (err) {
        console.log(`error 발생: ${err}`);
      }
    };
    loggedUserInfo?.userCode && getAvailableAcct();
    return () => {
      controller.abort();
    };
  }, [loggedUserInfo]);

  /** 계좌 중, 은행코드 중복 제거 함수 */
  const getBankCD = () => {
    let arr = [];
    apiData?.filter(
      (val) => arr.includes(val?.bankCd) === false && arr.push(val?.bankCd)
    );
    return arr;
  };
  /** 은행별 계좌 요소를 option으로 리턴하는 함수 */
  const bankListOption =
    apiData &&
    getBankCD().map((ele, i) => {
      return (
        <option
          key={i}
          name="bankCD"
          value={ReactDOMServer.renderToString(
            <BankName bankCD={ele} num={0} />
          )}
        >
          <BankName bankCD={ele} />
        </option>
      );
    });

  /** 은행명 select 값 handler */
  const handleBankNMSelectOnChange = (e) => {
    setOptionVal({ ...optionVal, bankCD: e.target.value });
  };
  /** 계좌 select 값 handler */
  const handleAcctSelectOnChange = (e) => {
    setOptionVal({ ...optionVal, acctNO: e.target.value });
  };
  /** 은행명 select 값에 따른 계좌번호 리스트 변경 */
  const acctListOption = () =>
    apiData &&
    apiData
      ?.filter((ele) => {
        if (optionVal.bankCD === "") {
          return ele;
        } else if (optionVal.bankCD === ele?.bankCd) {
          return ele;
        }
      })
      .map((val, i) => {
        return (
          <option key={i} value={val?.acctNo}>
            &nbsp;{val?.ACCT_NO}&nbsp;{val?.loanNm}
          </option>
        );
      });

  // input date ref 설정
  const strInputRef = useRef();
  const endInputRef = useRef();
  const handleDateOnChange = (e) => {
    const { name, value } = e.target;
    setOptionVal({ ...optionVal, [name]: value });
    name === "endDate" && setLimitInputValue(value);
  };
  // 현재 date와 date 형식 가져오기
  // 초기 기본 값으로 오늘 날짜로부터 30일간격의 날짜를 input value로 지정
  const { nowDate, currentTime } = useCurrentTime(0);
  const initialDate = useCallback(() => {
    const today = new Date(nowDate);
    const currentStr = `${today.getFullYear()}${(
      "0" +
      (today.getMonth() + 1)
    ).slice(-2)}${("0" + today.getDate()).slice(-2)}`;
    today.setDate(today.getDate() - 29);
    const pastStr = `${today.getFullYear()}${(
      "0" +
      (today.getMonth() + 1)
    ).slice(-2)}${("0" + today.getDate()).slice(-2)}`;
    const setpastDate = `${today.getFullYear()}-${(
      "0" +
      (today.getMonth() + 1)
    ).slice(-2)}-${("0" + today.getDate()).slice(-2)}`;
    setOptionVal({ ...optionVal, strDate: setpastDate, endDate: currentTime });
    setLimitInputValue(currentTime);
    return { currentStr, pastStr };
  }, [nowDate]);
  /** 날짜 범위에 따른 달력 제한 부여 */
  const setLimitInputValue = useCallback((end) => {
    const arr = end.split("-");
    const imsiDate = new Date();
    imsiDate.setFullYear(parseInt(arr[0]), parseInt(arr[1]), parseInt(arr[2]));
    imsiDate.setDate(imsiDate.getDate() - 30);
    const pastStr = `${imsiDate.getFullYear()}-${(
      "0" + imsiDate.getMonth()
    ).slice(-2)}-${("0" + imsiDate.getDate()).slice(-2)}`;
    // setOptionVal({...optionVal, strDate:pastStr, endDate:end});
    strInputRef.current.setAttribute("min", pastStr);
    endInputRef.current.getAttribute("max") === null &&
      endInputRef.current.setAttribute("max", end);
    strInputRef.current.setAttribute("max", end);
  }, []);
  // nowDate가 있을 경우, 날짜 초기화 함수 실행
  useEffect(() => {
    nowDate && initialDate();
  }, []);

  /** 조회 버튼 시, 서버 요청*/
  const [inoutDataList,setInoutDataList]=useState(null);
  inoutDataList&&console.log(inoutDataList);
  const handleClickExcelExport = (e) =>{
    console.log("실행");
    e.preventDefault();
    // cancellation token
    const getData = async () => {
        const inoutData = await AuthAxios.post("/api/users/reports/inout",{
          bankNm : optionVal?.bankCD ==="" ? "null" : optionVal?.bankCD,
          acctNo: optionVal?.acctNO === "" ? "null" : optionVal?.acctNO,
          startDt: optionVal?.strDate,
          endDt: optionVal?.endDate,
        });
        return inoutData;
    }
    getData().then(res=>{
      console.log(`data가져옴`);
      setInoutDataList(res.data);
      console.log(res.data);
    }).finally(()=>{
      setTimeout(()=>{
        setInoutDataList(null);
      },500)
    })
    return false;
  }
  /** 제출 */
  const handleOnSubmit = (e) =>{
    e.preventDefault();
    return false;
  }
  const exportExcel = useCallback(() => {
    return inoutDataList && <ExcelExportComponent data={inoutDataList} />;
  },[inoutDataList]);
  return (
    <div id="wrap">
      <div className="inner">
        <Breadcrumb title={"조회"} subMenu={"입출금내역조회"} />
        <div className="inoutPage flex">
          <SideNav now={"입출내역조회"} />
          <section>
            <h3>입출내역보고서</h3>
            <Description />
            <div className="form_wrap">
              <form className="report_form" onSubmit={(e) => handleOnSubmit(e)}>
                <ul>
                  <li className="flex">
                    <p className="flex align_center">계좌</p>
                    <div className="flex align_center">
                      <select onChange={handleBankNMSelectOnChange}>
                        <option name="bankCD" value="">
                          전체 은행
                        </option>
                        {bankListOption}
                      </select>
                      <select onChange={handleAcctSelectOnChange}>
                        <option value="">전체 계좌</option>
                        {acctListOption()}
                      </select>
                    </div>
                  </li>
                  <li className="flex">
                    <p className="flex align_center">조회기간</p>
                    <div>
                      <div className="flex align_center">
                        <input
                          type="date"
                          name="strDate"
                          onKeyDown={(e) => e.preventDefault()}
                          value={optionVal.strDate}
                          required
                          ref={strInputRef}
                          onChange={handleDateOnChange}
                        />
                        <b>~</b>
                        <input
                          type="date"
                          name="endDate"
                          onKeyDown={(e) => e.preventDefault()}
                          value={optionVal.endDate}
                          required
                          ref={endInputRef}
                          onChange={handleDateOnChange}
                        />
                      </div>
                      <div className="flex align_center">
                        <span onClick={dateChangeBtn(0)}>당일</span>
                        <span onClick={dateChangeBtn(1)}>3일</span>
                        <span onClick={dateChangeBtn(2)}>1주일</span>
                        <span onClick={dateChangeBtn(3)}>1개월</span>
                      </div>
                    </div>
                  </li>
                </ul>
                <div className="btn_wrap flex justify_center">
                  <button onClick={(e)=>{
                    handleClickExcelExport(e);
                  }}>Excel 내보내기</button>
                    {inoutDataList&&exportExcel()}
                  <button type="button">이메일로 내보내기</button>
                </div>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
  function dateChangeBtn(date) {
    return () => {
      if (date === 0) {
        const date = currentTime;
        setOptionVal({ ...optionVal, strDate: date, endDate: date });
      } else if (date === 1) {
        const date = new Date(nowDate);
        date.setDate(date.getDate() - 2);
        const strDate = `${date.getFullYear()}-${(
          "0" +
          (date.getMonth() + 1)
        ).slice(-2)}-${("0" + date.getDate()).slice(-2)}`;
        setOptionVal({ ...optionVal, strDate: strDate, endDate: currentTime });
      } else if (date === 2) {
        const date = new Date(nowDate);
        date.setDate(date.getDate() - 6);
        const strDate = `${date.getFullYear()}-${(
          "0" +
          (date.getMonth() + 1)
        ).slice(-2)}-${("0" + date.getDate()).slice(-2)}`;
        setOptionVal({ ...optionVal, strDate: strDate, endDate: currentTime });
      } else if (date === 3) {
        const date = new Date(nowDate);
        date.setDate(date.getDate() - 29);
        const strDate = `${date.getFullYear()}-${(
          "0" +
          (date.getMonth() + 1)
        ).slice(-2)}-${("0" + date.getDate()).slice(-2)}`;
        setOptionVal({ ...optionVal, strDate: strDate, endDate: currentTime });
      }
    };
  }
};

export default Index;
