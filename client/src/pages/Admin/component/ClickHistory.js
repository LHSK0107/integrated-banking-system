import React, { useContext, useEffect, useState } from "react";
import Breadcrumb from "../../../commons/Breadcrumb";
import Aside from "./Aside";
import "../admin.css";
import { useNavigate } from "react-router";
import Chart from "./Chart";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { useRef } from "react";

const ClickHistory = () => {
  const { loggedUserInfo } = useAuth();
  const [click, setClick] = useState([]);
  // const [xDate, setXDate] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  // 로컬스토리지에서 jwt 가져오기
  const savedToken = localStorage.getItem("jwt");

  // day 버튼 잡기
  const dayBtn = useRef();

  useEffect(() => {
    // clickRecordDay();
    // setXDate(click.reduce((acc, { date }) => {
    //   if (!acc.includes(date)) {
    //     acc.unshift(date);
    //   }
    //   return acc;
    // }, []));
    // console.log(xDate);
    dayBtn.current.click();
  }, []);

  // chart에 전달해줄 series 정제
  const series =
    click &&
    click.reduce((acc, { menuNm, clickCnt, date }) => {
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
  click &&
    click.map((ele) => {
      if (!xDate.includes(ele.date)) {
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
          ref={dayBtn}
        >
          DAY
        </li>
      ),
      tabCont: (
        <>
          <div className="chart">
            {series && <Chart data={series} dates={xDate} />}
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
            {series && <Chart data={series} dates={xDate} />}
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
            {series && <Chart data={series} dates={xDate} />}
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
              <p className="dateTime">
                조회일시{" "}
                <span>
                  {new Date(new Date().getTime() + 9 * 60 * 60 * 1000)
                    .toISOString()
                    .replace("T", " ")
                    .slice(0, -5)}
                </span>
              </p>
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
