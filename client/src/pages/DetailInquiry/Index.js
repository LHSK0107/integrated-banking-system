import React, { useCallback, useEffect, useState, useRef } from 'react';
import './index.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AccountCard from './component/AccountCard';
import MagnifierImg from "../../assets/images/icon/magnifier.png";
import DetailTrscList from './component/DetailTrscList';
import { useQuery } from "@tanstack/react-query";
import useCurrentTime from "../../hooks/useCurrentTime";
const Index = () => {
  const { acctNo } = useParams();
  const [title, setTitle] = useState("");
  const [bal, setBal] = useState(0);
  const [exptDate, setExptDate] = useState("");

  const paramList=acctNo.split("=");
  const realAcctNo=paramList[1];
  // 카드형식 데이터 api 호출
  const getAccountInfo = useCallback(() => {
    // axios.get(`http://localhost:3001/api/getDetailAccountHistory/${realAcctNo}`)
    // .then((res)=>{
    //   getData(res.data.RESP_DATA);
    // });
  },[realAcctNo]);

  useEffect(()=>{
    getAccountInfo();
    
  },[getAccountInfo]);

  // 데이터 정제
  const getData = (data) =>{
    let arr = data.REC;
    arr.map((ele)=>{
      setTitle(ele.LOAN_NM);
      setBal(ele.BAL);
      setExptDate(ele.EXPI_DT);
    })
  };

  // 날짜 input value 관리
  const [inputValueList, setInputValueList]=useState({
    strDate: "",
    endDate: ""
  });
  const onChange = (e) => {
    const {name, value}=e.target;
    setInputValueList({...inputValueList,[name]:value});
    name==="endDate" && setLimitInputValue(value);
  };

  // 현재 date와 date 형식 가져오기
  const {nowDate, currentTime} = useCurrentTime(0);
  // 초기 기본 값으로 오늘 날짜로부터 30일간격의 날짜를 input value로 지정
  const initialDate = () =>{
    const currentStr = `${nowDate.getFullYear()}${('0' + (nowDate.getMonth() + 1)).slice(-2)}${('0' + nowDate.getDate()).slice(-2)}`;
    nowDate.setDate(nowDate.getDate()-29);
    const pastStr = `${nowDate.getFullYear()}${('0' + (nowDate.getMonth() + 1)).slice(-2)}${('0' + nowDate.getDate()).slice(-2)}`;
    const setpastDate = `${nowDate.getFullYear()}-${('0' + (nowDate.getMonth() + 1)).slice(-2)}-${('0' + nowDate.getDate()).slice(-2)}`;
    setInputValueList({...inputValueList, strDate:setpastDate, endDate:currentTime});
    setLimitInputValue(currentTime);
    return {currentStr, pastStr};
  };
  // 날짜 범위에 따른 달력 제한 부여
  const strInputRef = useRef();
  const endInputRef = useRef();
  const setLimitInputValue = useCallback((end) => {
    const arr = end.split("-");
    const imsiDate = new Date();
    imsiDate.setFullYear(parseInt(arr[0]),parseInt(arr[1]),parseInt(arr[2]));
    imsiDate.setDate(imsiDate.getDate()-29);
    console.log(end);
    const pastStr = `${imsiDate.getFullYear()}-${('0' + (imsiDate.getMonth())).slice(-2)}-${('0' + imsiDate.getDate()).slice(-2)}`;
    strInputRef.current.setAttribute("min", pastStr);
    endInputRef.current.getAttribute("max")===null && endInputRef.current.setAttribute("max", end);
    strInputRef.current.setAttribute("max", end);
  },[inputValueList.strDate, inputValueList.endDate]);

  // 기간에 따른 데이터 조회
  const getDetailData = async () => {
    // 초기 빈 value 값을 위한 조건문 실행
      if(inputValueList.strDate===""){
        const dateObj = initialDate();
        // const url = `http://localhost:3001/api/getDate/${realAcctNo}/${dateObj.pastStr}/${dateObj.currentStr}`;
        // return await axios
        //   .get(url)
        //   .then((res) => res.data);
      } else {
        const start = inputValueList.strDate.replaceAll("-","");
        const end = inputValueList.endDate.replaceAll("-","");
        // const url = `http://localhost:3001/api/getDate/${realAcctNo}/${start}/${end}`;
        // return await axios
        //   .get(url)
        //   .then((res) => res.data);
      }
  };
  // useQuery api 조회
  const {
    data: recData,
    isError,
    refetch,
    status,
  } = useQuery(["rec"], () => getDetailData());
  // isInitialLoading, isLoading, isRefetcing, isFetched
  if (isError) {
    console.log("error");
  }
  
  return (
    <div className="detail_page_wra">
      <div className="detail_banner_section">
        <div className="inner">
          <h2>my account</h2>
          {title !== "" ? (
            <AccountCard
              realAcctNo={realAcctNo}
              title={title}
              bal={bal}
              exptDate={exptDate}
            />
          ) : (
            <h1>null</h1>
          )}
        </div>
      </div>
      <section className="detail_main_section">
        <div className="inner">
          <h2>Detail</h2>
          <div className="detail_search_wrap flex justify_between">
            <div className="detail_search_form flex align_center">
              <input ref={strInputRef} type="date" name="strDate" value={inputValueList.strDate} onChange={onChange}/>
              <input ref={endInputRef} type="date" name="endDate" value={inputValueList.endDate} onChange={onChange}/>
              <button className="detail_search_btn" onClick={refetch}>
                <figure>
                  <img src={MagnifierImg} alt="magnifier 이미지" />
                </figure>
              </button>
            </div>
            <p>* 최근 30일까지 조회 가능</p>
          </div>
        </div>
        <div className="detail_record_wrap">
          <div className="inner">
            <ul>
              <DetailTrscList status={status} recData={recData} />
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;