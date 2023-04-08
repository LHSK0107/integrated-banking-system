/* eslint-disable */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios, { all } from "axios";
import "./index.css";
import IamIcon from "../../assets/images/account_bg.png";
// 은행 코드별 이미지 출력 추가하기
import KakaoIcon from "../../assets/images/icon/bank/kakao_icon.png";

const Index = () => {
  const [statementList, setStatementList] = useState([]);
  const [depAInsList, setDepAInsList] = useState([]);
  const [loanList, setLoanList] = useState([]);
  
  // 페이징 처리 추가하기
  const showList = 10;
  const [page, setPage] = useState(1);
  const offset=(page-1)*showList;

  let arr = null;
  let stateArr=[];
  let depAInsArr=[];
  let loanArr=[];

  // useQuery를 통한 로딩 처리 추가하기
  useEffect(() => {
    arr=null;
    const url = "http://localhost:3001/api/getAccountList";
      axios.get(url).then((res) => {
      res.data.RESP_DATA.REC===null ? console.log('failed') : console.log("success");
      clearData(res.data.RESP_DATA);
    }).catch((err)=>console.log(err));
  }, []);
  
  const clearData = (allAccount) => {
    arr = allAccount.REC;
    arr.map((ele, i) => {
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

  // 금액 단위 , 정규화 필요
  return (
    <div className="contents flex justify_center align_center">
      <div className="contents_inner">
        <h1 className="contents_title">계좌조회</h1>
        <div className="content flex justify_between">
          <div className="content_left flex justify_center align_center">
            <h3>수시입출금</h3>
            <figure>
              <img className="account_img" src={IamIcon} alt="lam icon"/>
            </figure>
          </div>
          <div className="content_right">
            <ul className="account_list flex flex_column justify_between">
              <li className="flex justify_between">
                <div className="idx">번호</div>
                <div className="acct_no">계좌번호</div>
                <div className="loan_nm">상품명</div>
                <div className="bal">잔액</div>
              </li>
              {statementList.map((ele, i) => {
                return (
                  <Link key={i} className="flex align_center" to={`/inquiry?acct_no=${ele.ACCT_NO}`}>
                    <li className="account_li flex justify_between align_center">
                      <div className="idx">{i<10 ? i<9 ? <p>0{i+1}</p> : <p>{i+1}</p> : <p>{i+1}</p>}</div>
                      <div className="acct_no flex align_center justify_center"><figure><img src={KakaoIcon} alt=""/></figure><span>&nbsp;&nbsp;{ele?.ACCT_NO}</span></div>
                      <div className="loan_nm"><p>{ele?.LOAN_NM.trim()}</p></div>
                      <div className="bal"><p>{ele?.BAL.split(".",1)}원</p></div>
                    </li>
                  </Link>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="content flex justify_between">
          <div className="content_left flex justify_center align_center">
            <h3>예적금</h3>
            <figure>
              <img className="account_img" src={IamIcon} alt="lam icon"/>
            </figure>
          </div>
          <div className="content_right">
            <ul className="account_list flex flex_column justify_between">
              <li className="flex justify_between">
                <div className="idx">번호</div>
                <div className="acct_no">계좌번호</div>
                <div className="loan_nm">상품명</div>
                <div className="bal">잔액</div>
              </li>
              {depAInsList.map((ele, i) => {
                return (
                  <Link key={i} className="flex align_center " to="">
                    <li className="account_li flex justify_between align_center">
                      <div className="idx">{i<10 ? i<9 ? <p>0{i+1}</p> : <p>{i+1}</p> : <p>{i+1}</p>}</div>
                      <div className="acct_no flex align_center justify_center"><figure><img src={KakaoIcon} alt=""/></figure><span>&nbsp;&nbsp;{ele?.ACCT_NO}</span></div>
                      <div className="loan_nm"><p>{ele?.LOAN_NM.trim()}</p></div>
                      <div className="bal"><p>{ele?.BAL.split(".",1)}원</p></div>
                    </li>
                  </Link>
                );
              })}
              {/* <div className="bal"><ConfigNum number={ele?.BAL.split(".",1)} /></div> */}
            </ul>
          </div>
        </div>

        <div className="content flex justify_between">
          <div className="content_left flex justify_center align_center">
            <h3>대출</h3>
            <figure>
              <img className="account_img" src={IamIcon} alt="lam icon"/>
            </figure>
          </div>
          <div className="content_right">
            <ul className="account_list flex flex_column justify_between">
              <li className="flex justify_between">
                <div className="idx">번호</div>
                <div className="acct_no">계좌번호</div>
                <div className="loan_nm">상품명</div>
                <div className="bal">잔액</div>
              </li>
              {loanList.map((ele, i) => {
                return (
                  <Link key={i} className="flex align_center " to="">
                    <li className="account_li flex justify_between align_center">
                      <div className="idx">{i<10 ? i<9 ? <p>0{i+1}</p> : <p>{i+1}</p> : <p>{i+1}</p>}</div>
                      <div className="acct_no flex align_center justify_center"><figure><img src={KakaoIcon} alt=""/></figure><span>&nbsp;&nbsp;{ele?.ACCT_NO}</span></div>
                      <div className="loan_nm"><p>{ele?.LOAN_NM.trim()}</p></div>
                      <div className="bal"><p>{ele?.BAL.split(".",1)}원</p></div>
                    </li>
                  </Link>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// const ConfigNum = (number) =>{
//   return(
//     <p>

//     </p>
//   )
// }

export default Index;