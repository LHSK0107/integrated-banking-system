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

const Index = () => {
  const AuthAxios = useAxiosInterceptor();
  const { loggedUserInfo } = useAuth();
  const [balance, setBalance] = useState([]);
  const [ratioBal, setRatioBal] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [inoutBal, setInoutBal] = useState([]);
  // day 버튼 잡기
  const dayBtn = useRef();

  useEffect(() => {
    const controller = new AbortController();
    console.log(loggedUserInfo);
    const totalUri =
      loggedUserInfo?.userCode === "ROLE_USER"
        ? `/api/users/dashboard/totalBalances/${loggedUserInfo?.userNo}`
        : `/api/manager/dashboard/totalBalances`;
    const totalBalance = async () => {
      try {
        const response = await AuthAxios.get(totalUri, {
          signal: controller.signal,
        });
        console.log(response);
        if (response.status === 200) {
          setBalance(response.data);
        }
      } catch (err) {
        console.log(`error 발생: ${err}`);
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
        console.log(response);
        if (response.status === 200) {
          setInoutBal([
            response.data["day"],
            response.data["month"],
            response.data["year"],
          ]);
        }
      } catch (err) {
        console.log(`error 발생: ${err}`);
      }
    };
    totalBalance();
    inoutBalance();
    return () => {
      controller.abort();
    };
  }, [loggedUserInfo]);

  useEffect(() => {
    setRatioBal([balance["01"], balance["02"], balance["03"]]);
  }, [balance]);
  console.log(activeIndex);

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
    console.log(inoutBal);
    console.log(
      "graph 들어가기 전 ",
      activeIndex,
      " ",
      inoutBal[activeIndex].in
    );
    return <Bar data={inoutBal[activeIndex]} />;
  };

  console.log(balance);
  console.log(ratioBal);
  // console.log(inoutBal);
  // console.log(activeIndex);

  return (
    <div id="wrap">
      <div className="banner">
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
              <a className="flex btn" href="../AllAccount/index.html">
                조회
              </a>
              <a className="flex btn" href="../InOutReport/index.html">
                보고서
              </a>
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
                {balance["total"] === undefined ? (
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
      <div>
        <div className="chart_wrap inner">
          <div className="flex">
            <div className="pie">
              <Pie data={ratioBal} />
            </div>
            <div className="point">
              <Point />
            </div>
          </div>
          <div className="column">
            <h4>입금 - 출금</h4>
            <div className="column_btn">
              <ul className="flex">
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
        </div>
      </div>
    </div>
  );
};

export default Index;
