import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import React from "react";
import useCurrentTime from "../../../hooks/useCurrentTime";

const getOptions = ({data, dates}) => ({
  colors: ["#FFC209", "#2196F3", "#FF3F4C", "#008345", "#151c62"],
  title: {
    text: "",
    style: {
      fontFamily: "Noto Sans KR",
      fontSize: "18px",
      fontWeight: "500",
    },
    margin: 10,
  },
  credits: { enabled: false }, // 워터마크 숨김
  plotOptions: {
    series: {
      dataLabels: {
        enabled: true,
        // format: '{point.name}: {point.y:.1f}%'
      },
    },
  },
  chart: {
    type: "spline",
    // width: 600,
    // height: 400,
    backgroundColor: "rgba(255, 255, 255, 0)",
    marginTop: 50,
  },
  xAxis: [{
    categories: dates,
  }],
  yAxis: {
    title: {
      text: "횟수",
      style: {
        fontFamily: "Noto Sans KR",
        fontSize: "14px",
      },
    },
    labels: {
      // enabled: false//label 미사용 시 false로 지정.
    },
    gridLineWidth: 0, // y축 차트 뒤에 깔리는 선 미사용 시 0으로 지정.
  },
  legend: {
    //범례
    floating: true, //범례를 차트 영역 위로 띄울 시 true 지정.
    align: "right", //수평 정렬 지정
    verticalAlign: "top", //수직 정렬 지정.
    symbolRadius: 0, //범례 심볼 radius 지정
    symbolWidth: 10,
    symbolHeight: 10,
    itemDistance: 17, //범례 간 간격 지정.
    itemStyle: {
      //   color: "#444",
      fontSize: "14px",
      fontWeight: "400",
    },
    x: 10,
    y: -3,
  },
  series: data,
  responsive: {
    rules: [
      {
        condition: {
          maxWidth: 500,
        },
        chartOptions: {
          legend: {
            layout: "horizontal",
            align: "center",
            verticalAlign: "bottom",
          },
        },
      },
    ],
  },
});

const Chart = ({data, dates}) => {
//     console.log(data);
//   Object.keys(data).forEach((key) => {
//     console.log(key, data[key]);
//   })
// console.log(data);
// console.log(dates);
  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={getOptions({data, dates})} />
    </div>
  );
};

export default Chart;
