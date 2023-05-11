import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../commons/Breadcrumb";
import Aside from "./Aside";
import "../admin.css";
import { useNavigate } from "react-router";
import Chart from "./Chart";
import useAxiosInterceptor from "../../../hooks/useAxiosInterceptor";

const ClickHistory = () => {
  const AuthAxios = useAxiosInterceptor();
  const [click, setClick] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const clickRecord = async () => {
      try{
        const response = await AuthAxios.get("/api/admin/logins",
        {
          period: "day",
        },
        {
          signal: controller.signal
        });
        if (response.status === 200) {
          setClick(response.data);
          console.log(response.data);
        }
      } catch (err) {
        console.log(`error 발생: ${err}`);
        alert(err.response.data.message);
        navigate("/");
      }
    }
    // 메뉴 클릭 기록 가져오기
    clickRecord();
    return () => {
      controller.abort();
    }
  }, [AuthAxios]);

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
  const series = click && click.reduce((acc, { menuNm, clickCnt, date }) => {
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
