import React, { useEffect, useState } from "react";
import axios from "axios";
import Balance from "../../hooks/useBalance";
import Pie from "./component/Pie";
import Bar from "./component/Bar";
import Point from "./component/Point";
import useAxiosInterceptor from "../../hooks/useAxiosInterceptor";
import useAuth from "../../hooks/useAuth";
import { useRef } from "react";
import "./dashboard.css";
import BankName from "../../hooks/useBankName";
import { Link } from "react-router-dom";

const Index = () => {
  const AuthAxios = useAxiosInterceptor();
  const { loggedUserInfo } = useAuth();
  const [balance, setBalance] = useState([]);
  const [ratioBal, setRatioBal] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [inoutBal, setInoutBal] = useState([]);
  const [totalAccount, setTotalAccount] = useState([]);
  const [initTotalAccount, setInitTotalAccount] = useState([]);
  // day 버튼 잡기
  const dayBtn = useRef();

  useEffect(() => {
    const controller = new AbortController();
    // console.log(loggedUserInfo);
    const totalUri =
      loggedUserInfo?.userCode === "ROLE_USER"
        ? `/api/users/dashboard/totalBalances/${loggedUserInfo?.userNo}`
        : `/api/manager/dashboard/totalBalances`;
    const totalBalance = async () => {
      try {
        const response = await AuthAxios.get(totalUri, {
          signal: controller.signal,
        });
        if (response.status === 200) {
          setBalance(response.data);
        }
      } catch (err) {
        // console.log(err);
      }
    };
    const inoutUri =
      loggedUserInfo?.userCode === "ROLE_USER"
        ? `/api/users/dashboard/acctDv01InoutSum/${loggedUserInfo?.userNo}`
        : `/api/manager/dashboard/acctDv01InoutSum`;
    const inoutBalance = async () => {
      try {
        const response = await AuthAxios.get(inoutUri, {
          signal: controller.signal,
        });
        if (response.status === 200) {
          setInoutBal([
            response.data["day"],
            response.data["month"],
            response.data["year"],
          ]);
        }
      } catch (err) {
        // console.log(err);
      }
    };
    const hasAccountUri =
      loggedUserInfo?.userCode === "ROLE_USER"
        ? `/api/users/accounts/available/${loggedUserInfo?.userNo}`
        : `/api/manager/accounts`;
    const hasAccount = async () => {
      try {
        const response = await AuthAxios.get(hasAccountUri, {
          signal: controller.signal,
        });
        if (response.status === 200) {
          setInitTotalAccount(response.data);
          setTotalAccount(response.data);
        }
      } catch (err) {
        // console.log(err);
      }
    };
    totalBalance(); // 총 계좌별 잔액 가져오기
    inoutBalance(); // 입출금 일/월/년별 총액 가져오기
    hasAccount(); // 보유 계좌 또는 조회 가능 계좌 가져오기
    return () => {
      controller.abort();
    };
  }, [loggedUserInfo]);

  useEffect(() => {
    setRatioBal([balance["01"], balance["02"], balance["03"]]);
  }, [balance]);
  // console.log(activeIndex);

  // 계좌 리스트 그리기
  function DrawTable() {
    const [selectedDv, setSelectedDv] = useState("01");

    const groupedAccounts = {};
    initTotalAccount.forEach((account) => {
      if (groupedAccounts[account.acctDv]) {
        groupedAccounts[account.acctDv].push(account);
      } else {
        groupedAccounts[account.acctDv] = [account];
      }
    });
    delete groupedAccounts["04"]; // 04 삭제

    const groupedAccountsByBankCd = {};
    Object.keys(groupedAccounts).forEach((dv) => {
      // dv: 계좌 구분(01, 02, 03)
      groupedAccountsByBankCd[dv] = {};
      groupedAccounts[dv].forEach((account) => {
        if (groupedAccountsByBankCd[dv][account.bankCd]) {
          groupedAccountsByBankCd[dv][account.bankCd].push(account);
        } else {
          groupedAccountsByBankCd[dv][account.bankCd] = [account];
        }
      });
    });

    const sortedKeys = Object.keys(groupedAccountsByBankCd).sort();

    return (
      <>
        <ul className="table_btn flex flex_column align_center">
          <li className="flex justify_center">
            <p
              className={selectedDv === "01" ? "active" : ""}
              onClick={() => setSelectedDv("01")}
            >
              입출금
            </p>
            <p
              className={selectedDv === "02" ? "active" : ""}
              onClick={() => setSelectedDv("02")}
            >
              예적금
            </p>
            <p
              className={selectedDv === "03" ? "active" : ""}
              onClick={() => setSelectedDv("03")}
            >
              대출금
            </p>
          </li>
          <li className="table_list">
            {sortedKeys &&
              sortedKeys.map((ele) => (
                <ul className={selectedDv === ele ? "active" : ""} key={ele}>
                  {Object.keys(groupedAccountsByBankCd[ele])
                    .sort()
                    .map((bankCd) => (
                      <li key={bankCd}>
                        <div className="flex">
                          <figure className="flex justify_center align_center">
                            <img
                              src={require(`../../assets/images/icon/bank/${bankCd}.png`)}
                              alt="bank img icon"
                            />
                          </figure>
                          <p>
                            <BankName bankCD={bankCd} />
                          </p>
                        </div>
                        <ul>
                          {groupedAccountsByBankCd[ele][bankCd].map(
                            (account) => (
                              <li key={account.acctNo}>
                                {account.acctNo} ({account.acctNickNm})
                              </li>
                            )
                          )}
                        </ul>
                      </li>
                    ))}
                </ul>
              ))}
          </li>
        </ul>
      </>
    );
  }

  // bar 그래프 그리기
  const drawBar = () => {
    // let data = {...inoutBal[activeIndex]};
    for (let i = 0; i < 3; i++) {
      inoutBal[i].in = inoutBal[i].in.map((ele) => {
        if (ele === null) return 0;
        return ele;
      });
      inoutBal[i].out = inoutBal[i].in.map((ele) => {
        if (ele === null) return 0;
        return ele;
      });
    }
    if (activeIndex === 0) {
      inoutBal[activeIndex].date = inoutBal[activeIndex].date.map((ele) =>
        ele.substring(0, 10)
      );
    }
    if (activeIndex === 1) {
      inoutBal[activeIndex].date = inoutBal[activeIndex].date.map((ele) =>
        ele.substring(0, 7)
      );
    }
    if (activeIndex === 2) {
      inoutBal[activeIndex].date = inoutBal[activeIndex].date.map((ele) =>
        ele.substring(0, 4)
      );
    }
    // console.log(inoutBal);
    // console.log(
    //   "graph 들어가기 전 ",
    //   activeIndex,
    //   " ",
    //   inoutBal[activeIndex].in
    // );
    return <Bar data={inoutBal[activeIndex]} />;
  };

  // console.log(balance);
  // console.log(ratioBal);
  // console.log(inoutBal);
  // console.log(activeIndex);
  // console.log(totalAccount);

  return (
    <div id="wrap">
      <div className="dashboard">
        <div className="banner pc">
          <div className="inner flex">
            <div className="member">
              <p>
                {loggedUserInfo?.userCode !== "" &&
                  loggedUserInfo?.userCode.split("_")[1]}
              </p>
              <h2>
                안녕하세요,
                <br />
                <span>{loggedUserInfo?.name}</span>님
              </h2>
              <div className="flex justify_between">
                <Link className="flex btn" to="/inquiry">
                  조회
                </Link>
                <Link className="flex btn" to="/dailyReport">
                  보고서
                </Link>
              </div>
            </div>
            <div className="total">
              <div className="total_total">
                <div className="flex justify_between">
                  <p>
                    보유 총 자산 <span>= 입출금 + 예적금 - 대출금</span>
                  </p>
                  <span>
                    조회일시{" "}
                    {new Date(new Date().getTime() + 9 * 60 * 60 * 1000)
                      .toISOString()
                      .replace("T", " ")
                      .slice(0, -5)}
                  </span>
                </div>
                <h3>
                  {balance["total"] === undefined || null ? (
                    "-"
                  ) : (
                    <Balance balance={balance["total"]} />
                  )}
                </h3>
              </div>
              <div className="section_total flex">
                <div className="check">
                  <div className="flex">
                    <figure>
                      <img src="" alt="" />
                    </figure>
                    <span>입출금</span>
                  </div>
                  <div>
                    <p>
                      <span>총액</span>
                      {balance["01"] === undefined ? (
                        "-"
                      ) : (
                        <Balance balance={balance["01"]} />
                      )}
                    </p>
                  </div>
                </div>
                <div className="deposit">
                  <div className="flex">
                    <figure>
                      <img src="" alt="" />
                    </figure>
                    <span>예적금</span>
                  </div>
                  <div>
                    <p>
                      <span>총액</span>
                      {balance["02"] === undefined ? (
                        "-"
                      ) : (
                        <Balance balance={balance["02"]} />
                      )}
                    </p>
                  </div>
                </div>
                <div className="loan">
                  <div className="flex">
                    <figure>
                      <img src="" alt="" />
                    </figure>
                    <span>대출금</span>
                  </div>
                  <div>
                    {/* <p><span>총액</span>{loanBalCal()}</p> */}
                    <p>
                      <span>총액</span>
                      {balance["03"] === undefined ? (
                        "-"
                      ) : (
                        <Balance balance={balance["03"]} />
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="banner mobile">
          <div className="inner">
            <div className="member flex">
              <div>
                <p>
                  {loggedUserInfo?.userCode !== "" &&
                    loggedUserInfo?.userCode.split("_")[1]}
                </p>
                <h2>
                  안녕하세요,
                  <br />
                  <span>{loggedUserInfo?.name}</span>님
                </h2>
              </div>
              <div>
                <span className="time">
                  조회일시{" "}
                  {new Date(new Date().getTime() + 9 * 60 * 60 * 1000)
                    .toISOString()
                    .replace("T", " ")
                    .slice(0, -5)}
                </span>
                <p>보유 총 자산</p>
                <h3>
                  {balance["total"] === undefined ? (
                    "-"
                  ) : (
                    <Balance balance={balance["total"]} />
                  )}
                </h3>
              </div>
            </div>
          </div>
          <div className="mobile_total">
            <div className="inner">
              <div className="check">
                <div className="flex justify_between">
                  <span>입출금</span>
                  <p>
                    <span>총액</span>
                    {balance["01"] === undefined ? (
                      "-"
                    ) : (
                      <Balance balance={balance["01"]} />
                    )}
                  </p>
                </div>
                <div className="flex justify_between">
                  <span>예적금</span>
                  <p>
                    <span>총액</span>
                    {balance["02"] === undefined ? (
                      "-"
                    ) : (
                      <Balance balance={balance["02"]} />
                    )}
                  </p>
                </div>
                <div className="flex justify_between">
                  <span>대출금</span>
                  <p>
                    <span>총액</span>
                    {balance["03"] === undefined ? (
                      "-"
                    ) : (
                      <Balance balance={balance["03"]} />
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="chart_wrap inner">
          <div className="pie">
            <h4>계좌 구분별 비율</h4>
            <Pie data={ratioBal} />
          </div>
          <div className="column">
            <h4>입금 - 출금</h4>
            <div className="column_btn">
              <ul className="flex justify_center">
                <li
                  className={activeIndex === 0 ? "active" : ""}
                  onClick={() => setActiveIndex(0)}
                >
                  DAY
                </li>
                <li
                  className={activeIndex === 1 ? "active" : ""}
                  onClick={() => setActiveIndex(1)}
                >
                  MONTH
                </li>
                <li
                  className={activeIndex === 2 ? "active" : ""}
                  onClick={() => setActiveIndex(2)}
                >
                  YEAR
                </li>
              </ul>
            </div>

            <div className="column_chart">
              {/* <Bar
                data={inoutBal[activeIndex]}
              /> */}
              {inoutBal?.length > 0 && drawBar()}
            </div>
          </div>
          <div className="table">
            <h4>보유 계좌</h4>
            <DrawTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
