import React, { useContext, useEffect, useState } from "react";
import Breadcrumb from "../../../commons/Breadcrumb";
import Aside from "./Aside";
import "../admin.module.css";
import { LogInContext } from "../../../commons/LogInContext";
import { useNavigate } from "react-router";
import decodeJwt from "../../../hooks/decodeJwt";
import axios from "axios";
import Chart from "./Chart";

const ClickHistory = () => {
  const { token, setToken, loggedUser, setLoggedUser, loggedIn, setLoggedIn } =
    useContext(LogInContext);
  const [click, setClick] = useState([]);
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
      clickRecord();
    }
  }, [setLoggedUser, setClick]);

  // 메뉴 클릭 기록 가져오기
  const clickRecord = () => {
    axios
      .post(
        "http://localhost:8080/api/admin/menu",
        {
          period: "day",
        },
        {
          headers: { Authorization: "Bearer " + savedToken },
        }
      )
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          setClick(res.data);
        }
      })
      .catch((err) => {
        alert(err.response.data.message);
        navigate("/");
      })
      .finally(() => {});
  };

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
  const series = click.reduce((acc, { menuNm, clickCnt, date }) => {
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
//   console.log(series);

  return (
    <div id="wrap">
      <div className="inner">
        <Breadcrumb title={"관리자 페이지"} subMenu={"메뉴 클릭 기록 조회"} />
        <div className="flex">
          <Aside now={"메뉴 클릭 기록 조회"} />
          <section className="click_list">
            <h3>메뉴 클릭 기록 조회</h3>
            <div className="list_wrap">
              <Chart data={series} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ClickHistory;
