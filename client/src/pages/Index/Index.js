import "./index.css";
import React from "react";

import MainSliderImg from "../../assets/images/index_main.jpg";
import StrongImg01 from "../../assets/images/index_strong_01.jpg";
import SeperateImg from "../../assets/images/bg_seperate.png";
import NewsBgImg from "../../assets/images/index_news.png";
import NewsSlider from "./component/NewsSlider";

const Index = () => {

  const data = [
    {id:1, img:StrongImg01, alt:"장점1", content:"한 눈에 자산을\n분석 통합 계좌 관리"},
    {id:2, img:StrongImg01, alt:"장점2", content:"쉽고 편리하게\n만드는 보고서"},
    {id:3, img:StrongImg01, alt:"장점3", content:"기존 상품과 비교해\n최적의 상품 정보 제공"},
  ];

  return (
    <div className="index_wrap">
      <section className="main_slider_section">
        <figure>
          <img src={MainSliderImg} alt="메인 슬라이더 이미지"></img>
        </figure>
      </section>
      <section className="main_introduce_section">
        <div className="inner">
          <h2 className="content_title">
            why <span>I'AM</span>
          </h2>
          <div className="main_introduce_strong_wrap flex justify_center">
            {data.map(ele => {
              return (
                <div key={ele.id} className="content">
                  <figure>
                    <img src={ele.img} alt={ele.alt} />
                  </figure>
                  <div>
                    {ele.content.split("\n")[0]}
                    <br></br>
                    {ele.content.split("\n")[1]}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
      <div className="section_seperate flex justify_center">
        <figure>
          <img src={SeperateImg} alt="구분 이미지"></img>
        </figure>
      </div>
      <section className="main_image_section">
        <div className="inner">감성 문구와 사진?이미지?</div>
      </section>
      <div className="section_seperate flex justify_center">
        <figure>
          <img src={SeperateImg} alt="구분 이미지"></img>
        </figure>
      </div>
      <section className="main_notice_section">
        <div className="inner">
          <div className="main_notice_wrap content flex justify_between">
            <div className="main_notice_detail">
              <h3>Lorem ipsum dolor sit amet,</h3>
              <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
                tempus efficitur metus sit amet tincidunt. Donec aliquet varius
                nunc, quis consequat tortor ultrices eu. Lorem ipsum dolor sit
                amet, consectetur adipiscing elit. Proin tempus efficitur metus
                sit amet tincidunt. Donec aliquet varius nunc, quis consequat
                tortor ultrices eu.
              </div>
              <button className="more_btn">더 알아보기</button>
            </div>
            <div className="main_notice_board"></div>
          </div>
        </div>
      </section>
      <section className="main_news_section">
        <div className="inner">
          <div>
            <figure>
              <img src={NewsBgImg} alt="뉴스 구분 따옴표 이미지"></img>
            </figure>
          </div>
          <NewsSlider />
          <div className="flex justify_end">
            <figure>
              <img src={NewsBgImg} alt="뉴스 구분 따옴표 이미지"></img>
            </figure>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
