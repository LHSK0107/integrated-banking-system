/* eslint-disable */
import React, {useState, useRef, useCallback, useEffect}  from "react";
import ReactDOMServer from 'react-dom/server'
import "./inout.css";
import { Description } from '../../commons/Description';
import { SideNav } from '../../commons/SideNav';
import Breadcrumb from '../../commons/Breadcrumb';
import useCommonAxios from "../../api/useCommonAxios";
import useAxios from "../../api/useAxios";
import BankName from '../../hooks/useBankName';
import useCurrentTime from "../../hooks/useCurrentTime";

const Index = () => {

  /** 폼에 대한 각 요소 변수 저장 -> 변수명 차후 변경 */
  const [optionVal, setOptionVal] = useState({
    bankCD:"",
    acctNO:"",
    strDate:"",
    endDate:"",
    lang:"",
    inout:"",
    arrange:"recent",
    paging:"10"
  });

  const {apiData}=useAxios("https://localhost:3001/api/getAccountList");
  /** 계좌 중, 은행코드 중복 제거 함수 */
  const getBankCD = () =>{
    let arr = [];
    apiData.filter((val)=>arr.includes(val?.BANK_CD)===false && arr.push(val?.BANK_CD));
    return arr;
  }
  /** 은행별 계좌 요소를 option으로 리턴하는 함수 */
  const bankListOption = apiData &&
    getBankCD().map((ele,i) => {
      return (
        <option key={i} name="bankCD" value={ReactDOMServer.renderToString(<BankName bankCD={ele} num={0} />)}>
          <BankName bankCD={ele} />
        </option>
      );
    }
  );
  /** 은행명 select 값 handler */
  const handleBankNMSelectOnChange = (e) => {
    setOptionVal({...optionVal, bankCD: e.target.value});
  }
  /** 계좌 select 값 handler */
  const handleAcctSelectOnChange = (e) => {
    setOptionVal({...optionVal, acctNO: e.target.value});
  }
  /** 은행명 select 값에 따른 계좌번호 리스트 변경 */
  const acctListOption = () => apiData && apiData.filter((ele) => {
    if(optionVal.bankCD===""){
      return ele;
    } else if (optionVal.bankCD===ele?.BANK_CD){
      return ele;
    }
  }).map((val,i)=>{
    return (
      <option key={i} value={val?.ACCT_NO}>
        &nbsp;{val?.ACCT_NO}&nbsp;{val?.LOAN_NM}
      </option>
    )
  });

  // input date ref 설정
  const strInputRef = useRef();
  const endInputRef = useRef();
  const handleDateOnChange = (e) => {
    const {name, value}=e.target;
    setOptionVal({...optionVal,[name]:value});
    name==="endDate" && setLimitInputValue(value);
  };
  // 현재 date와 date 형식 가져오기
  // 초기 기본 값으로 오늘 날짜로부터 30일간격의 날짜를 input value로 지정
  const {nowDate, currentTime} = useCurrentTime(0);
  const initialDate = useCallback(() =>{
    const today=new Date(nowDate);
    const currentStr = `${today.getFullYear()}${('0' + (today.getMonth() + 1)).slice(-2)}${('0' + today.getDate()).slice(-2)}`;
    today.setDate(today.getDate()-30);
    const pastStr = `${today.getFullYear()}${('0' + (today.getMonth() + 1)).slice(-2)}${('0' + today.getDate()).slice(-2)}`;
    const setpastDate = `${nowDate.getFullYear()}-${('0' + (nowDate.getMonth())).slice(-2)}-${('0' + nowDate.getDate()).slice(-2)}`;
    setOptionVal({...optionVal, strDate:setpastDate, endDate:currentTime});
    setLimitInputValue(currentTime);
    return {currentStr, pastStr};
  },[nowDate]);
  /** 날짜 범위에 따른 달력 제한 부여 */
  const setLimitInputValue = useCallback((end) => {
    const arr = end.split("-");
    const imsiDate = new Date();
    imsiDate.setFullYear(parseInt(arr[0]),parseInt(arr[1]),parseInt(arr[2]));
    imsiDate.setDate(imsiDate.getDate()-30);
    const pastStr = `${imsiDate.getFullYear()}-${('0' + (imsiDate.getMonth())).slice(-2)}-${('0' + imsiDate.getDate()).slice(-2)}`;
    // setOptionVal({...optionVal, strDate:pastStr, endDate:end});
    strInputRef.current.setAttribute("min", pastStr);
    endInputRef.current.getAttribute("max")===null && endInputRef.current.setAttribute("max", end);
    strInputRef.current.setAttribute("max", end);
  },[]);
  // nowDate가 있을 경우, 날짜 초기화 함수 실행
  useEffect(()=>{
    nowDate && initialDate();
  },[]);

  /** radio 버튼에 대한 onChange 핸들러 */
  const handleRadioOnChange = (e) => {
    const {name, value} = e.target;
    setOptionVal({...optionVal, [name]:value});
    console.log(optionVal);
  }

  /** */
  const handleOnSubmit = () =>{
    return false;
  }
  return (
    <div id="wrap">
      <div className="inner">
        <Breadcrumb title={"조회"} subMenu={"입출금내역조회"}/>
        <div className="flex">
          <SideNav now={"입출내역조회"} />
          <section>
            <h3>입출내역조회</h3>
            <Description />
            <div className="form_wrap">
              <ul className="tab flex">
                <li>예금</li>
                <li className="active">대출</li>
              </ul>
              <form className="report_form" onSubmit={handleOnSubmit}>
                <ul>
                  <li className="flex">
                    <p className="flex align_center">계좌</p>
                    <div className="flex align_center">
                      <select onChange={handleBankNMSelectOnChange}>
                        <option name="bankCD" value="">전체 은행</option>
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
                        <input type="date" name="strDate" onKeyDown={(e) => e.preventDefault()} value={optionVal.strDate} required ref={strInputRef} onChange={handleDateOnChange}/>
                        <b>~</b>
                        <input type="date" name="endDate" onKeyDown={(e) => e.preventDefault()} value={optionVal.endDate} required ref={endInputRef} onChange={handleDateOnChange}/>
                      </div>
                      <div className="flex align_center">
                        <span onClick={dateChangeBtn(0)}>당일</span>
                        <span onClick={dateChangeBtn(1)}>3일</span>
                        <span onClick={dateChangeBtn(2)}>1주일</span>
                        <span onClick={dateChangeBtn(3)}>1개월</span>
                      </div>
                    </div>
                  </li>
                  <li className="flex">
                    <p className="flex align_center">언어구분</p>
                    <div className="flex align_center" onChange={handleRadioOnChange}>
                      <input type="radio" id="kor" name="lang" value="kr" defaultChecked />
                      <label>국문</label>
                      <input type="radio" id="eng" name="lang" value="en" disabled />
                      <label>영문</label>
                    </div>
                  </li>
                  <li className="flex">
                    <p className="flex align_center">조회구분</p>
                    <div className="flex align_center" onChange={handleRadioOnChange}>
                      <input type="radio" id="inout" name="sort" value="" defaultChecked />
                      <label>전체</label>
                      <input type="radio" id="in" name="sort" value="01" />
                      <label>입금만</label>
                      <input type="radio" id="out" name="sort" value="02" />
                      <label>출금만</label>
                    </div>
                  </li>
                  <li className="flex">
                    <p className="flex align_center">조회결과순서</p>
                    <div className="flex align_center" onChange={handleRadioOnChange}>
                      <input type="radio" id="new" name="arrange" value="recent" defaultChecked />
                      <label>최근일로부터</label>
                      <input type="radio" id="old" name="arrange" value="past" />
                      <label>과거일로부터</label>
                    </div>
                  </li>
                  <li className="flex">
                    <p className="flex align_center">정렬방식</p>
                    <div className="flex align_center" onChange={handleRadioOnChange}>
                      <input value="10" type="radio" id="ten" name="paging" defaultChecked />
                      <label>10건</label>
                      <input value="30" type="radio" id="thirty" name="paging" />
                      <label >30건</label>
                      <input value="50" type="radio" id="fifty" name="paging"/>
                      <label >50건</label>
                    </div>
                  </li>
                </ul>
                <div className="btn_wrap flex justify_center">
                  <button type="submit">조회</button>
                </div>
              </form>
            </div>
            <div className="result_wrap">
              <div className="account_info">
                <ul>
                  <li className="flex">
                    <div className="title">예금종류</div>
                    <div>기업자유예금</div>
                    <div className="title">계좌별칭</div>
                    <div>1 기업 0987</div>
                  </li>
                  <li className="flex">
                    <div className="title">잔액</div>
                    <div>100,000,000원</div>
                    <div className="title">출금가능금액</div>
                    <div>100,000,000원</div>
                  </li>
                  <li className="flex">
                    <div className="title">조회시작일</div>
                    <div>2023-04-01</div>
                    <div className="title">조회종료일</div>
                    <div>2023-04-18</div>
                  </li>
                </ul>
              </div>
              <div className="result">
                <div className="btn_info flex justify_between align_center">
                  <button >인쇄</button>
                  <p>조회일시 2023-04-18 13:35:12</p>
                </div>
                <div className="result_data">
                  <ul className="column flex">
                    <li className="account">계좌</li>
                    <li className="date">거래일시</li>
                    <li className="memo">적요</li>
                    <li className="withdraw">출금(원)</li>
                    <li className="credit">입금(원)</li>
                    <li className="balance">잔액(원)</li>
                  </ul>
                  <ul className="data flex">
                    <li className="account">
                      <div className="flex align_center">
                        <figure>
                          <img src="" alt="" />
                        </figure>
                        <span>국민은행</span>
                      </div>
                      <div className="flex align_center">
                        12345678901234567890
                      </div>
                    </li>
                    <li className="date flex justify_center align_center">
                      2023.04.05 14:24:14
                    </li>
                    <li className="memo flex justify_center align_center">
                      비플_WeCafe2
                      <br />
                      asdf
                    </li>
                    <li className="withdraw flex justify_end align_center">
                      -1,000
                    </li>
                    <li className="credit flex justify_end align_center">+</li>
                    <li className="balance flex justify_end align_center">
                      100,000,000
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
  function dateChangeBtn(date) {
    return () => {
      if(date===0){
        const date =currentTime;
        setOptionVal({ ...optionVal, strDate: date, endDate: date });
      }else if(date===1){
        const date = new Date(nowDate);
        date.setDate(date.getDate()-2);
        const strDate = `${date.getFullYear()}-${('0' + (date.getMonth()+1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
        setOptionVal({ ...optionVal, strDate: strDate, endDate: currentTime });
      } else if(date===2){
        const date = new Date(nowDate);
        date.setDate(date.getDate()-6);
        const strDate = `${date.getFullYear()}-${('0' + (date.getMonth()+1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
        setOptionVal({ ...optionVal, strDate: strDate, endDate: currentTime });
      } else if(date===3){
        const date = new Date(nowDate);
        date.setDate(date.getDate()-30);
        const strDate = `${date.getFullYear()}-${('0' + (date.getMonth()+1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
        setOptionVal({ ...optionVal, strDate: strDate, endDate: currentTime });
      }
    };
  }
};

export default Index;
