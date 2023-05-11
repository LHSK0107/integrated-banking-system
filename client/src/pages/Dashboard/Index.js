import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Balance from "../../hooks/useBalance";
import "./dashboard.css";
import useAuth from "../../hooks/useAuth";
import Pie from "./component/Pie";
import Bar from "./component/Bar";
import Point from "./component/Point";
import { LogInContext } from "../../commons/LogInContext";
import { AuthAxios } from "../../api/useCommonAxios";
import useAxiosInterceptor from "../../hooks/useAxiosInterceptor";
const Index = () => {

  useEffect(()=>{
    axios.post("http://localhost:8080/reAccessToken",{
      withCredential: true
    }).then((res) => {
      console.log(`res는 ${res.headers.get("Authorization")}`);
    }).catch((err)=>console.error(err));
  },[]);
  const {loggedUserInfo} = useAuth();
  const AuthAxios = useAxiosInterceptor();

  // 대시보드 구현
  const [statementList, setStatementList] = useState([]); // 입출금
  const [depAInsList, setDepAInsList] = useState([]); // 예적금
  const [loanList, setLoanList] = useState([]); // 대출금
  const [inList, setInList] = useState([]); // 입금
  const [outList, setOutList] = useState([]); // 출금

  let arr = null;
  let stateArr = []; // 입출금
  let depAInsArr = []; // 예적금
  let loanArr = []; // 대출금
  let arr2 = null;
  let inArr = [];
  let outArr = [];
  const inoutProps = {
    in: inList,
    out: outList,
  };

  // 계좌 구분별
  useEffect(() => {
    arr = null;
    // const url = "http://localhost:3001/api/getAccountList";
    // axios
    //   .get(url)
    //   .then((res) => {
    //     res.data.RESP_DATA.REC === null
    //       ? console.log("failed")
    //       : console.log("success");
    //     clearData(res.data.RESP_DATA);
    //   })
    //   .catch((err) => console.log(err))
    //   .finally(() => {});
    const getList = async () => {
      try{
        const response = await AuthAxios("/api/accounts",{},"get");
        response && console.log(response);
      } catch(err){
        console.log(err);
      }
    }
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
      }
    });
  };

  // 입출금 잔액
  const stateBalCal = () => {
    let stateBal = 0;
    statementList.map((ele) => {
      stateBal += Number(ele.BAL);
    });
    return stateBal + "";
  };
  // 예적금 잔액
  const depAInsBalCal = () => {
    let depAInsBal = 0;
    depAInsList.map((ele) => {
      depAInsBal += Number(ele.BAL);
    });
    return depAInsBal + "";
  };
  // 대출금 잔액
  const loanBalCal = () => {
    let loanBal = 0;
    loanList.map((ele) => {
      loanBal += Number(ele.BAL);
    });
    return loanBal + "";
  };
  const totolCal = () => {
    let total =
      Number(stateBalCal()) + Number(depAInsBalCal()) + Number(loanBalCal());
    console.log(total);
    return total + "";
  };

  // 20230101 날짜 형식
  const leftPad = (value) => {
    if (value >= 10) {
      return value;
    }
    return `0${value}`;
  };
  const toStringByFormat = (sourceDate, delimeter = "") => {
    const year = sourceDate.getFullYear();
    const month = leftPad(sourceDate.getMonth() + 1);
    const day = leftPad(sourceDate.getDate());
    return [year, month, day].join(delimeter);
  };

  // 입출별
  useEffect(() => {
    // const todayYear = new Date().getFullYear();
    // const todayMonth = new Date().getMonth() + 1;
    // const todayDate = new Date().getDate();
    // const start = `${todayYear}${todayMonth >= 10 ? todayMonth : "0"+todayMonth}${todayDate >= 10 ? todayDate : "0"+todayDate}`;
    const end = toStringByFormat(new Date());
    const start = Number(end) - 9 + "";
    // console.log("start: ", start, typeof(start));
    // console.log("end: ", end, typeof(end));
    // const url = `http://localhost:3001/api/getDates/${start}/${end}`;
    // axios
    //   .get(url)
    //   .then((res) => {
    //     res.data.RESP_DATA.REC === null
    //       ? console.log("입출 failed")
    //       : console.log("입출 success");
    //     clearData2(res.data.RESP_DATA);
    //     // ppLinist();
    //   })
    //   .catch((err) => console.log(err))
    //   .finally(() => {});
  }, []);

  const clearData2 = (data) => {
    arr2 = data.REC;
    console.log(data);
    arr2.map((ele) => {
      if (ele.INOUT_DV === "1") {
        inArr.push(ele.TRSC_AMT);
        setInList(inArr);
      } else if (ele.INOUT_DV === "2") {
        outArr.push(ele.TRSC_AMT);
        setOutList(outArr);
      }
    });
  };

  // const ppLinist = (() => {
  //     inArr.map((ele) => {
  //         console.log(ele);
  //     })
  // })

  return (
    <div id="wrap">
      <div className="banner">
        <div className="inner flex">
          <div className="member">
            <p>
              {loggedUserInfo?.userCode !== "" && loggedUserInfo?.userCode.split("_")[1]}
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
                <p>보유 총 자산</p>
                <span>
                  조회일시{" "}
                  {new Date(new Date().getTime() + 9 * 60 * 60 * 1000)
                    .toISOString()
                    .replace("T", " ")
                    .slice(0, -5)}
                </span>
              </div>
              <h3>
                <Balance balance={totolCal()} />
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
                    <Balance balance={stateBalCal()} />
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
                    <Balance balance={depAInsBalCal()} />
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
                    <Balance balance={loanBalCal()} />
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
              <Pie />
            </div>
            <div className="point">
              <Point />
            </div>
          </div>
          <div className="column">
            <Bar data={inoutProps} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
