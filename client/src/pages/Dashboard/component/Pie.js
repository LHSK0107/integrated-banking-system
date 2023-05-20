import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import React from "react";

const getOptions = ({ data }) => ({
  colors: ["#FFC209", "#2196F3", "#FF3F4C"],
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
  accessibility: {
    announceNewData: {
      enabled: true,
    },
    point: {
      valueSuffix: "%",
    },
  },
  plotOptions: {
    name: ["입출금", "예적금", "대출금"],
    series: {
      dataLabels: {
        enabled: true,
        // format: '{point.name}: {point.percentage:.1f} % value: {point.y}'
        format: "{point.name}: {point.percentage:.1f} %",
        fontSize: "16px"
      },
    },
  },
  chart: {
    type: "pie",
    // width: 600,
    // height: 400,
    backgroundColor: "rgba(255, 255, 255, 0)",
    // marginTop: 50,
  },
  xAxis: [
    
  ],
  yAxis: {
    
  },
  legend: {
    
  },
  series: [
    {
      innerSize: "40%", //도넛 차트 지정시 내부 구멍 너비를 설정.(도넛 차트 필수 지정 옵션)
      // name: 'Browsers',
      data: [
        ["입출금", data[0]],
        ["예적금", data[1]],
        ["대출금", data[2]],
      ],
    },
  ],
});

const Pie = ({ data }) => {
  // console.log(data);
  return (
    <div>
      {/* <HighchartsReact highcharts={Highcharts} options={getOptions("column")} /> */}
      <HighchartsReact highcharts={Highcharts} options={getOptions({ data })} />
    </div>
  );
};

export default Pie;
