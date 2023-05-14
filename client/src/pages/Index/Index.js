import "./index.css";
import React from "react";
import Quick01 from "../../assets/images/icon/check-circle.png";
import Quick02 from "../../assets/images/icon/dollar-sign.png";
import Quick03 from "../../assets/images/icon/pie-chart.png";
import Quick04 from "../../assets/images/icon/file-text.png";
import Quick05 from "../../assets/images/icon/trending-up.png";
import NewsBgImg from "../../assets/images/index_news.png";
import NewsSlider from "./component/NewsSlider";
import BannerSlider from "./component/BannerSlider";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div id="wrap">
      <div className="section01">
        <div className="inner">
          <BannerSlider />
        </div>
      </div>
      <div className="quick_wrap">
        <div className="inner">
          <div className="quick flex justify_between">
            <Link
              className="transition flex flex_column justify_center align_center quick_menu"
              to="./inquiry"
            >
              <figure className="flex justify_center align_center">
                <img src={Quick01} alt="" />
              </figure>
              <p>전체계좌조회</p>
            </Link>
            <Link
              className="transition flex flex_column justify_center align_center quick_menu"
              to="./inout"
            >
              <figure className="flex justify_center align_center">
                <img src={Quick02} alt="" />
              </figure>
              <p>거래내역조회</p>
            </Link>
            <Link
              className="transition flex flex_column justify_center align_center quick_menu"
              to="./dashboard"
            >
              <figure className="flex justify_center align_center">
                <img src={Quick03} alt="" />
              </figure>
              <p>대시보드</p>
            </Link>
            <Link
              className="transition flex flex_column justify_center align_center quick_menu"
              to="./dailyReport"
            >
              <figure className="flex justify_center align_center">
                <img src={Quick04} alt="" />
              </figure>
              <p>일일시재보고서</p>
            </Link>
            <Link
              className="transition flex flex_column justify_center align_center quick_menu"
              to="./inoutReport"
            >
              <figure className="flex justify_center align_center">
                <img src={Quick05} alt="" />
              </figure>
              <p>거래내역조회</p>
            </Link>
          </div>
        </div>
      </div>

      <div className="section02">
        <div className="inner">
          <div className="flex">
            <div className="section02_cont">
              <figure>
                <img
                  src={require("../../assets/images/index_section02.jpg")}
                  alt="serp"
                ></img>
              </figure>
            </div>
            <div className="section02_tit flex flex_column justify_center">
              <h3>편리한 금융업무</h3>
              <p>전제계좌 조회부터 보고서 작성, <br></br>그리고 자산을 한 눈에 볼 수 있는 대시보드까지</p>
              <p>편하게 금융 업무를 볼 수 있습니다.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="news">
        <div className="inner">
          <div>
            <figure>
              <img src={NewsBgImg} alt="뉴스 구분 따옴표 이미지" />
            </figure>
          </div>
          <NewsSlider />
          <div className="flex justify_end">
            <figure>
              <img src={NewsBgImg} alt="뉴스 구분 따옴표 이미지" />
            </figure>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
