import React, { useContext, useEffect, useState } from "react";
import Breadcrumb from "../../../commons/Breadcrumb";
import Aside from "./Aside";
import "../admin.css";
import { LogInContext } from "../../../commons/LogInContext";
import { useNavigate } from "react-router";
import decodeJwt from "../../../hooks/decodeJwt";
import axios from "axios";
import Chart from "./Chart";

const ClickHistory = () => {
  const { token, setToken, loggedUser, setLoggedUser, loggedIn, setLoggedIn } =
    useContext(LogInContext);
  const [click, setClick] = useState([]);
  // const [xDate, setXDate] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  // 로컬스토리지에서 jwt 가져오기
  const savedToken = localStorage.getItem("jwt");
  setToken(savedToken);

  useEffect(() => {
    if (savedToken === null) {
      setLoggedUser({
        id: "",
        name: "",
        exp: "",
        userCode: "",
        userNo: "",
      });
      setLoggedIn(false);
    } else {
      const decodedPayload = decodeJwt(savedToken);
      setLoggedUser({
        id: decodedPayload.sub,
        name: decodedPayload.name,
        exp: decodedPayload.exp,
        userCode: decodedPayload.userCode,
        userNo: decodedPayload.userNo,
      });
      setLoggedIn(true);
      // clickRecordDay();
      // setXDate(click.reduce((acc, { date }) => {
      //   if (!acc.includes(date)) {
      //     acc.unshift(date);
      //   }
      //   return acc;
      // }, []));
      // console.log(xDate);
      
    }
  }, [setLoggedUser, setClick, activeIndex]);

  // groupBy 함수
  //   const groupBy = (array, key) =>
  //     array.reduce((result, currentValue) => {
  //       // key 값으로 그룹화하여 object 생성
  //       (result[currentValue[key]] = result[currentValue[key]] || []).push(
  //         currentValue
  //       );
  //       return result;
  //     }, {});
  // 클릭 기록 날짜별로 묶기
  //   const clickArr = [];
  //   clickArr.push(groupBy(click, "date"));
  //   console.log(...clickArr);
  //   const middleArr = groupBy(click, "clickCnt");
  //   const resultArr = JSON.parse(JSON.stringify(middleArr));

  // chart에 전달해줄 data 정제
  const series = click&&click.reduce((acc, { menuNm, clickCnt, date }) => {
    const index = acc.findIndex(({ name }) => name === menuNm);
    if (index !== -1) {
      acc[index].data.unshift(clickCnt);
    } else {
      acc.push({
        name: menuNm,
        data: [clickCnt],
      });
    }
    return acc;
  }, []);

  // chart에 전달해줄 dates 정제
  const xDate = [];
  click&&click.map((ele) => {
    if(!xDate.includes(ele.date)) {
      xDate.unshift(ele.date);
    }
  });
  
  // 탭
  const tabClickHandler = (index) => {
    setActiveIndex(index);
    
    const period = ["day", "week", "month"][index];
    axios
    .post(
      "http://localhost:8080/api/admin/menu",
      { period: period },
      { headers: { Authorization: "Bearer " + savedToken } }
      )
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          // setClick(prev => {
          //   return res.data;
          // });
          setClick(res.data);
          // const xDate = [...new Set(click.map(({date}) => date))];
          // setXDate(click.reduce((acc, { date }) => {
          //   if (!acc.includes(date)) {
          //     acc.unshift(date);
          //   }
          //   return acc;
          // }, []));
        }
      })
      .catch((err) => {
        alert(err.response.data.message);
        navigate("/");
      })
      .finally(() => {});
    };

  const tabContList = [
    {
      tabTit: (
        <li
          className={activeIndex === 0 ? "active" : ""}
          onClick={() => tabClickHandler(0)}
        >
          DAY
        </li>
      ),
      tabCont: (
        <>
          <div className="chart">
            {series&&<Chart data={series} dates={xDate} />}
          </div>
        </>
      ),
    },
    {
      tabTit: (
        <li
          className={activeIndex === 1 ? "active" : ""}
          onClick={() => tabClickHandler(1)}
        >
          WEEK
        </li>
      ),
      tabCont: (
        <>
          <div className="chart">
            {series&&<Chart data={series} dates={xDate} />}
          </div>
        </>
      ),
    },
    {
      tabTit: (
        <li
          className={activeIndex === 2 ? "active" : ""}
          onClick={() => tabClickHandler(2)}
        >
          MONTH
        </li>
      ),
      tabCont: (
        <>
          <div className="chart">
            {series&&<Chart data={series} dates={xDate} />}
          </div>
        </>
      ),
    },
  ];

  return (
    <div id="wrap">
      <div className="inner">
        <Breadcrumb title={"관리자 페이지"} subMenu={"메뉴 클릭 기록 조회"} />
        <div className="flex">
          <Aside now={"메뉴 클릭 기록 조회"} />
          <section className="click_list">
            <h3>메뉴 클릭 기록 조회</h3>
            <div className="list_wrap">
              <p>조회일시</p>
              <ul className="tab flex">
                {tabContList.map((ele) => {
                  return ele.tabTit;
                })}
              </ul>
              <div className="cont">{tabContList[activeIndex].tabCont}</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ClickHistory;
