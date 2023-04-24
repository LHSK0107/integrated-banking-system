/* eslint-disable */
import React, { useState, useEffect, useCallback } from "react";
import "./index.css";
import Balance from "../../hooks/useBalance";
import useCurrentTime from "../../hooks/useCurrentTime";
import useAxiosAcctInquiry from "../../api/useAxiosAcctInquiry";
import { AcctList } from "./component/AcctList";
import { Link } from "react-router-dom";
import { Description } from '../../commons/Description';
import { SideNav } from '../../commons/SideNav';
import Breadcrumb from '../../commons/Breadcrumb';
const Index = () => {
  const [statementList, setStatementList] = useState([]);
  const [depAInsList, setDepAInsList] = useState([]);
  const [loanList, setLoanList] = useState([]);

  let stateArr = [];
  let depAInsArr = [];
  let loanArr = [];

  const { apiData, isLoading, error } = useAxiosAcctInquiry(
    "http://localhost:3001/api/getAccountList"
  );
  useEffect(() => {
    apiData && clearData(apiData);
  }, [apiData]);

  // api 요소 중, 계좌 구분에 따라 분리
  const clearData = (apiData) => {
    apiData.map((ele) => {
      if (ele.ACCT_DV === "01") {
        stateArr.push(ele);
        setStatementList(stateArr);
      } else if (ele.ACCT_DV === "02") {
        depAInsArr.push(ele);
        setDepAInsList(depAInsArr);
      } else if (ele.ACCT_DV === "03") {
        loanArr.push(ele);
        setLoanList(loanArr);
      }
    });
  };
  // 현재 시간 조회
  const currentTime = useCurrentTime();
  // 잔액 합산
  const calcTotalBal = useCallback(() => {
    let [stateBal, depInsBal, loanBal] = [0, 0, 0];
    statementList.map((ele) => {
      stateBal += Number(ele?.BAL);
    });
    depAInsList.map((ele) => {
      depInsBal += Number(ele?.BAL);
    });
    loanList.map((ele) => {
      loanBal += Number(ele?.BAL);
    });
    return { stateBal, depInsBal, loanBal };
  }, [loanList]);

  // 탭 + 아코디언
  const [activeIndex, setActiveIndex] = useState(0);
  const [stateOn, setStateOn] = useState(true);
  const [delInsOn, setDelInsOn] = useState(true);
  const [loanOn, setLoanOn] = useState(true);
  const tabClickHandler = (index) => {
    setActiveIndex(index);
  };
  const tabContArr = [
    {
      tabTitile: (
        <li
          className={activeIndex === 0 ? "active" : ""}
          onClick={() => tabClickHandler(0)}
        >
          예금
        </li>
      ),
      tabCont: (
        <>
        <div className={stateOn ? "on" : ""}>
          <div className="accordian_btn flex justify_between align_center" onClick={() => {stateOn? setStateOn(false) : setStateOn(true)}}>
            <div>
              <p>
                입출금<span>총계좌수</span>
              </p>
            </div>
            <div className="flex align_center">
              <h4>
                <Balance balance={calcTotalBal().stateBal} />
              </h4>
              <p></p>
              <figure className="flex align_center">
                <img
                  src={require(`../../assets/images/icon/arrow_up_w.png`)}
                  alt=""
                />
              </figure>
            </div>
          </div>
          <ul>{AcctList(statementList)}</ul>
        </div>
        <div className={delInsOn ? "on" : ""}>
        <div className="accordian_btn flex justify_between align_center" onClick={() => {delInsOn? setDelInsOn(false) : setDelInsOn(true)}}>
          <div>
            <p>
              예적금<span>총계좌수</span>
            </p>
          </div>
          <div className="flex align_center">
            <h4>
              <Balance balance={calcTotalBal().depInsBal} />
            </h4>
            <p></p>
            <figure className="flex align_center">
              <img
                src={require(`../../assets/images/icon/arrow_up_w.png`)}
                alt=""
              />
            </figure>
          </div>
        </div>
        <ul>{AcctList(depAInsList)}</ul>
      </div>
      </>
      ),
    },
    {
      tabTitile: (
        <li
          className={activeIndex === 1 ? "active" : ""}
          onClick={() => tabClickHandler(1)}
        >
          대출
        </li>
      ),
      tabCont: (
        <div className={loanOn ? "on" : ""}>
          <div className="accordian_btn flex justify_between align_center" onClick={() => {loanOn? setLoanOn(false) : setLoanOn(true)}}>
            <div>
              <p>
                대출금<span>총계좌수</span>
              </p>
            </div>
            <div className="flex align_center">
              <h4>
                <Balance balance={calcTotalBal().depInsBal} />
              </h4>
              <figure className="flex align_center">
                <img
                  src={require(`../../assets/images/icon/arrow_up_w.png`)}
                  alt=""
                />
              </figure>
            </div>
          </div>
          <ul>{AcctList(loanList)}</ul>
        </div>
      ),
    },
  ];

  return (
    <div id="wrap">
      <div className="inner">
        <Breadcrumb/>
        <div className="flex">
          <SideNav />
          <section>
            <h3>전체계좌조회</h3>
            <Description/>
            <div className="content_wrap">
              <ul className="tab flex">
                {tabContArr.map((ele) => {
                  return ele.tabTitile;
                })}
              </ul>
              <p>조회일시 {currentTime}</p>
              <div className="content">
                {tabContArr[activeIndex].tabCont}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
export default Index;
