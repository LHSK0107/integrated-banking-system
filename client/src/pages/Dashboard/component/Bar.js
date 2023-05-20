import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import React from "react";

const getOptions = ({ data }) => ({
  lang: {
    thousandsSep: ",",
  },
  colors: ["#3f77cb", "#d470cc"],
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
  chart: {
    type: "column",
    // width: 800,
    // height: 400,
    // margin: [30, 10, 30, 0],
    backgroundColor: "rgba(255, 255, 255, 0)",
    marginTop: 50,
  },
  xAxis: [
    {
      categories: data["date"],
      labels: {
        y: 20,
        style: {
          fontFamily: "Noto Sans KR",
          fontSize: "12px",
        },
      },
      lineColor: "#cfcfcf", //x축 선 색상 지정.
      gridLineWidth: 0, // x축 그래프 뒤에 깔리는 선 굵기 지정.(0으로 지정 시 사라짐)
      tickWidth: 1, //x축 label 사이 표지자 너비(0으로 지정 시 사라지며, 차트 타입에 따라 default로 지정되어 있을 수 있음)
      tickColor: "#cfcfcf",
      tickPosition: "inside", // outside가 default 이며, x축 선 기준 아래를 바라봄. inside는 위를 바라봄.
      crosshair: true,
    },
  ],
  yAxis: {
    title: {
      text: "원",
      style: {
        fontFamily: "Noto Sans KR",
        fontSize: "14px",
      },
    },
    labels: {
      // enabled: false//label 미사용 시 false로 지정.
      format: "{value:,.0f}",
      // formatter: function () {
      //   return parseInt(this.value / 20);
      // },
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
      color: "#444",
      fontSize: "14px",
      fontWeight: "400",
    },
    x: 10,
    y: -3,
  },
  series: [
    {
      name: "입금",
      data: data.in,
    },
    {
      name: "출금",
      data: data.out,
      //   dataLabels: {
      //     enabled: true,
      //     align: 'right',
      //     verticalAlign: 'top',
      //     //위치 지정
      //     x: 20,
      //     y: -6,
      //   }
    },
  ],
  options: {
  	scales: {
    	yAxes: [{
        ticks: {
          beginAtZero: true,
          callback: function(value, index) {
            if(value.toString().length > 8) return (Math.floor(value / 100000000)).toLocaleString("ko-KR") + "억";
            else if(value.toString().length > 4) return (Math.floor(value / 10000)).toLocaleString("ko-KR") + "만";
            else return value.toLocaleString("ko-KR"); 
          }
        },
      }]
    },
  }
});

const Bar = ({ data }) => {
  // console.log(data);

  return (
    <div>
      {/* <HighchartsReact highcharts={Highcharts} options={getOptions("column")} /> */}
      <HighchartsReact highcharts={Highcharts} options={getOptions({ data })} />
    </div>
  );
};

export default Bar;
