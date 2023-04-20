/* eslint-disable */
import React, { useState, useEffect, useCallback } from "react";
import "./index.css";
import Balance from "../../hooks/useBalance";
import useCurrentTime from "../../hooks/useCurrentTime";
import useAxiosAcctInquiry from "../../api/useAxiosAcctInquiry";
import {AcctList} from "./component/AcctList";
import {Link} from "react-router-dom";
const Index = () => {
  const [statementList, setStatementList] = useState([]);
  const [depAInsList, setDepAInsList] = useState([]);
  const [loanList, setLoanList] = useState([]);

  let stateArr=[];
  let depAInsArr=[];
  let loanArr=[];

  const {apiData, isLoading, error} = useAxiosAcctInquiry("http://localhost:3001/api/getAccountList");
  useEffect(() => {
    apiData && clearData(apiData);
  }, [apiData]);
  
  // api 요소 중, 계좌 구분에 따라 분리
  const clearData = (apiData) => {
    apiData.map((ele)=>{
      if (ele.ACCT_DV === "01") {
        stateArr.push(ele);
        setStatementList(stateArr);
      } else if (ele.ACCT_DV === "02") {
        depAInsArr.push(ele);
        setDepAInsList(depAInsArr);
      } else if (ele.ACCT_DV === "03") {
        loanArr.push(ele);
        setLoanList(loanArr);
      };
    });
  }
  // 현재 시간 조회
  const currentTime = useCurrentTime();
  // 잔액 합산
  const calcTotalBal = useCallback(() =>{
    let [stateBal, depInsBal, loanBal] = [0,0,0];
    statementList.map((ele)=>{
      stateBal += Number(ele?.BAL);
    });
    depAInsList.map((ele)=>{
      depInsBal += Number(ele?.BAL);
    });
    loanList.map((ele)=>{
      loanBal += Number(ele?.BAL);
    });
    return {stateBal, depInsBal, loanBal};
  },[loanList]);
  
  return (
    <div id="wrap">
      <div className="inner">
        <div className="nav_depth flex justify_end align_center">
          <Link
            className="flex justify_end align_center"
            href="../Index/index.html"
          >
            <figure>
              <img
                src={require(`../../assets/images/icon/arrow_b.png`)}
                alt=""
              />
            </figure>
            홈
          </Link>
          <figure>
            <img src={require(`../../assets/images/icon/arrow_b.png`)} alt="" />
          </figure>
          <p>조회</p>
          <figure>
            <img src={require(`../../assets/images/icon/arrow_b.png`)} alt="" />
          </figure>
          <p>
            <span>전체계좌조회</span>
          </p>
        </div>
        <div className="flex">
          <aside>
            <div className="aside_wrap">
              <h2>조회</h2>
              <ul className="aside_nav">
                <li className="aside_active">
                  <a href="./">전체계좌조회</a>
                </li>
                <li>
                  <a href="../InOut/index.html">입출내역조회</a>
                </li>
              </ul>
            </div>
          </aside>
          <section>
            <h3>전체계좌조회</h3>
            <div className="description">
              <p> · 보고자 하는 계좌분류를 클릭합니다.</p>
              <p>
                {" "}
                · 크게 예금과 대출 탭을 클릭하여 총 잔액과 계좌별 잔액을
                확인합니다.
              </p>
              <p>
                {" "}
                · 각 계좌를 클릭하면 계좌의 상세 정보와 거래 내역을 확인할 수
                있습니다.
              </p>
            </div>
            <div className="content_wrap">
              <ul className="tab flex">
                <li>예금</li>
                <li className="active">대출</li>
              </ul>
              <div className="content">
                <p style={{ textAlign: "right", marginBottom: "10px" }}>
                  조회일시 {currentTime}
                </p>
                <div>
                  <div className="accordian_btn flex justify_between align_center">
                    <div>
                      <p>
                        입출금<span></span>
                      </p>
                    </div>
                    <div className="flex align_center">
                      <h4>
                        <Balance balance={calcTotalBal().stateBal} />
                      </h4>
                      <p></p>
                      <figure>
                        <img
                          src={require(`../../assets/images/icon/arrow_down_b.png`)}
                          alt=""
                        />
                      </figure>
                    </div>
                  </div>
                  <ul>{AcctList(statementList)}</ul>
                  <div className="accordian_btn flex justify_between align_center">
                    <div>
                      <p>
                        예적금 <span>2</span>
                      </p>
                    </div>
                    <div className="flex align_center">
                      <h4>
                        <Balance balance={calcTotalBal().depInsBal} />
                      </h4>
                      <figure>
                        <img
                          src={require(`../../assets/images/icon/bank/003.png`)}
                          alt=""
                        />
                      </figure>
                    </div>
                  </div>
                  <ul>{AcctList(depAInsList)}</ul>
                </div>
                <div></div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
export default Index;


