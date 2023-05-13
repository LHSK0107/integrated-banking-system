import "../index.css";
import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const NewsSlider = () => {
  return (
    <div className="swiper_wrap">
      <Swiper
        className="bannerSwiper"
        slidesPerView={1}
        spaceBetween={50}
        grabCursor={true}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        navigation={{ clickable: true }}
        pagination={{ clickable: true }}
        modules={[Navigation, Pagination]}
        style={{
          "--swiper-theme-color": "#898989",
          "--swiper-navigation-size": "30px",
        }}
      >
        <SwiperSlide>
          <div className="main_banner_cont flex">
            <div className="main_banner_tit flex justify_center align_center">
              <h3>중소기업을 위한 믿을 수 있는 통합경영관리</h3>
            </div>
            <div className="">
              <figure>
                <img
                  src={require("../../../assets/images/index_main01.jpg")}
                  alt="슬라이드1"
                ></img>
              </figure>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="main_banner_cont flex">
            <div className="main_banner_tit flex justify_center align_center">
              <h3>경비지출관리 솔루션 선택아닌, 필수</h3>
            </div>
            <div className="">
              <figure>
                <img
                  src={require("../../../assets/images/index_main02.jpg")}
                  alt="슬라이드2"
                ></img>
              </figure>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="main_banner_cont flex">
            <div className="main_banner_tit flex justify_center align_center">
              <h3>금융데이터 연동을 통한 자금 관리</h3>
            </div>
            <div className="">
              <figure>
                <img
                  src={require("../../../assets/images/index_main03.jpg")}
                  alt="슬라이드3"
                ></img>
              </figure>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default NewsSlider;
