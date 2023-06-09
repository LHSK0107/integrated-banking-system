/* eslint-disable */
import React, { useState, useEffect } from "react";
import useAxiosInterceptor from "../../hooks/useAxiosInterceptor";
import "./inquiry.css";
import Balance from "../../hooks/useBalance";
import useCurrentTime from "../../hooks/useCurrentTime";
import { AcctList } from "./component/AcctList";
import { Description } from "../../commons/Description";
import { SideNav } from "../../commons/SideNav";
import Breadcrumb from "../../commons/Breadcrumb";
import ExcelExportComponent from "./component/ExcelExportComponent";
import EmailExportComponent from "./component/EmailExportComponent";
import useAuth from "../../hooks/useAuth";
const Index = () => {
  const { loggedUserInfo } = useAuth();
  // 계좌 구현
  const [statementList, setStatementList] = useState([]);
  const [depAInsList, setDepAInsList] = useState([]);
  const [loanList, setLoanList] = useState([]);

  let stateArr = [];
  let depAInsArr = [];
  let loanArr = [];

  const AuthAxios = useAxiosInterceptor();
  const [apiData, setApiData] = useState(null);
  useEffect(() => {
    let isMounted = true;
    // cancellation token
    const controller = new AbortController();
    const getUsers = async () => {
      const response = await AuthAxios.get(
        loggedUserInfo?.userCode === "ROLE_ADMIN" ||
          loggedUserInfo?.userCode === "ROLE_MANAGER"
          ? "/api/manager/accounts"
          : `/api/users/accounts/available/${loggedUserInfo?.userNo}`,
        {
          signal: controller.signal,
        }
      );
      return response;
    };
    loggedUserInfo?.userCode &&
      getUsers().then((res) => {
        setApiData(res.data);
      });
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [loggedUserInfo]);

  useEffect(() => {
    apiData && clearData(apiData);
  }, [apiData]);

  // api 요소 중, 계좌 구분에 따라 분리
  const clearData = (apiData) => {
    apiData?.map((ele) => {
      if (ele.acctDv === "01") {
        stateArr.push(ele);
        setStatementList(stateArr);
      } else if (ele.acctDv === "02") {
        depAInsArr.push(ele);
        setDepAInsList(depAInsArr);
      } else if (ele.acctDv === "03") {
        loanArr.push(ele);
        setLoanList(loanArr);
      }
    });
  };
  // 현재 시간 조회
  const currentTime = useCurrentTime();
  // 잔액 합산
  const calcTotalBal = () => {
    let [stateBal, depInsBal, loanBal] = [0, 0, 0];
    statementList?.map((ele) => {
      stateBal += Number(ele?.bal);
    });
    depAInsList?.map((ele) => {
      depInsBal += Number(ele?.bal);
    });
    loanList?.map((ele) => {
      loanBal += Number(ele?.bal);
    });
    return { stateBal, depInsBal, loanBal };
  };
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
          <div className={stateOn ? "" : "on"}>
            <div
              className="accordian_btn flex justify_between align_center"
              onClick={() => {
                stateOn ? setStateOn(false) : setStateOn(true);
              }}
            >
              <div>
                <p>
                  입출금<span>{statementList.length}</span>
                </p>
              </div>
              <div className="flex align_center">
                <h4>
                  <Balance balance={calcTotalBal().stateBal} />
                </h4>
                <p></p>
                <div className="pc">
                  <figure className="flex align_center">
                    <img
                      src={require(`../../assets/images/icon/arrow_up_w.png`)}
                      alt=""
                    />
                  </figure>
                </div>
                <div className="mobile">
                  <figure className="flex align_center">
                    <img
                      src={require(`../../assets/images/icon/arrow_down_b.png`)}
                      alt=""
                    />
                  </figure>
                </div>
              </div>
            </div>
            <ul>{AcctList(statementList)}</ul>
          </div>
          <div className={delInsOn ? "on" : ""}>
            <div
              className="accordian_btn flex justify_between align_center"
              onClick={() => {
                delInsOn ? setDelInsOn(false) : setDelInsOn(true);
              }}
            >
              <div>
                <p>
                  예적금<span>{depAInsList.length}</span>
                </p>
              </div>
              <div className="flex align_center">
                <h4>
                  <Balance balance={calcTotalBal().depInsBal} />
                </h4>
                <p></p>
                <div className="pc">
                  <figure className="flex align_center">
                    <img
                      src={require(`../../assets/images/icon/arrow_up_w.png`)}
                      alt=""
                    />
                  </figure>
                </div>
                <div className="mobile">
                  <figure className="flex align_center">
                    <img
                      src={require(`../../assets/images/icon/arrow_down_b.png`)}
                      alt=""
                    />
                  </figure>
                </div>
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
        <div className={loanOn ? "" : "on"}>
          <div
            className="accordian_btn flex justify_between align_center"
            onClick={() => {
              loanOn ? setLoanOn(false) : setLoanOn(true);
            }}
          >
            <div>
              <p>
                대출금<span>{loanList.length}</span>
              </p>
            </div>
            <div className="flex align_center">
              <h4>
                <Balance balance={calcTotalBal().loanBal} />
              </h4>
              <div className="pc">
                <figure className="flex align_center">
                  <img
                    src={require(`../../assets/images/icon/arrow_up_w.png`)}
                    alt=""
                  />
                </figure>
              </div>
              <div className="mobile">
                <figure className="flex align_center">
                  <img
                    src={require(`../../assets/images/icon/arrow_down_b.png`)}
                    alt=""
                  />
                </figure>
              </div>
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
        <Breadcrumb title={"조회"} subMenu={"전체계좌조회"} />
        <div className="inquiry flex">
          <SideNav now={"전체계좌조회"} />
          <section>
            <h3>전체계좌조회</h3>
            <Description />
            <div className="content_wrap">
              <ul className="tab flex">
                {tabContArr.map((ele) => {
                  return ele.tabTitile;
                })}
              </ul>
              <p>조회일시 {currentTime}</p>
              <div className="content">{tabContArr[activeIndex].tabCont}</div>
              {apiData && (
                <ExcelExportComponent
                  stateData={statementList}
                  depAInsData={depAInsList}
                  loadData={loanList}
                  stateBal={calcTotalBal().stateBal}
                  depInsBal={calcTotalBal().depInsBal}
                  loanBal={calcTotalBal().loanBal}
                />
              )}
              {apiData && (
                <EmailExportComponent
                  stateData={statementList}
                  depAInsData={depAInsList}
                  loadData={loanList}
                  stateBal={calcTotalBal().stateBal}
                  depInsBal={calcTotalBal().depInsBal}
                  loanBal={calcTotalBal().loanBal}
                />
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
export default Index;
