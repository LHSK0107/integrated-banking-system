import React, { Component, Fragment  } from 'react'
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

class BarChart extends Component {
    render() {
        const series2 = this.props.data;    //App.js에서 데이터를 보내줄 예정
        const options = {
            data: {
                table: "datatable"
              },
              chart: {
                type: "column"
              },
              title: {
                text: "Live births in Norway"
              },
              subtitle: {
                text:
                  "Source: "
              },
              xAxis: {
                type: "category"
              },
              yAxis: {
                allowDecimals: false,
                title: {
                  text: "Amount"
                }
              },
              tooltip: {
                formatter: function () {
                  return '<b>' + this.series.name + '</b><br/>' +
                    this.point.y + ' ' + this.point.name.toLowerCase();
                }
              },
              series: [{
                name: 'Employees',
                color: 'rgba(165,170,217,1)',
                data: [150, 73, 20],
                pointPadding: 0.3,
                pointPlacement: -0.2
              }, {
                name: 'Employees Optimized',
                color: 'rgba(126,86,134,.9)',
                data: [140, 90, 40],
                pointPadding: 0.4,
                pointPlacement: -0.2
              }, {
                name: 'Profit',
                color: 'rgba(248,161,63,1)',
                data: [183.6, 178.8, 198.5],
                tooltip: {
                  valuePrefix: '$',
                  valueSuffix: ' M'
                },
                pointPadding: 0.3,
                pointPlacement: 0.2,
                yAxis: 1
              }, {
                name: 'Profit Optimized',
                color: 'rgba(186,60,61,.9)',
                data: [203.6, 198.8, 208.5],
                tooltip: {
                  valuePrefix: '$',
                  valueSuffix: ' M'
                },
                pointPadding: 0.4,
                pointPlacement: 0.2,
                yAxis: 1
              }]

        }

  return (
    <Fragment>
        <HighchartsReact highcharts={Highcharts} options={options} />
    </Fragment>
  )
}}

export default BarChart;
