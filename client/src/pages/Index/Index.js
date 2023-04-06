import "./index.css";
import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";
// import { Pagination, Autoplay, SwiperCore } from "swiper/core";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import MainSliderImg from "../../assets/images/index_main.jpg";
import StrongImg01 from "../../assets/images/index_strong_01.jpg";
import SeperateImg from "../../assets/images/bg_seperate.png";
import NewsBgImg from "../../assets/images/index_news.png";
import axios from "axios";

// SwiperCore.use([Pagination, Autoplay]);

const Index = () => {
  const news_wrap = useRef();
  const [news, setNews] = useState([]);
  const [swiper, setSwiper] = useState(null);

  useEffect(() => {
    const url = "http://localhost:3001/news/getNews";
    axios
      .get(url)
      .then((response) => {
        response.data.items === null
          ? console.log("fail")
          : console.log("success");

        pushElement(response.data.items);
      })
      .catch((err) => console.log(err));
  }, []);

  // let newsArr = [];
  // const clearData = (items) => {
  //   items.map((ele, idx) => {
  //     newsArr.push(ele);
  //     setNews(newsArr);
  //     console.log(ele);
  //   });
  // };

  const pushElement = (items) => {
    const div_news = news_wrap.current; // swiper
    const child = div_news.children[0]; // swiper_wrapper

    child.innerHTML = "";

    items.map((item, idx) => {

      const newAElement = document.createElement("a");
      newAElement.classList.add(
        "content",
        "main_news_cont",
        "flex",
        "flex_column",
        "justify_between",
        "swiper-slide"
      );
      const newH3Element = document.createElement("h3");
      newH3Element.innerHTML = item.title;
      const newPElement = document.createElement("p");
      newPElement.innerHTML = item.description;
      const newH4Element = document.createElement("h4");
      let publicDate = new Date(item.pubDate);
      const day = ["일", "월", "화", "수", "목", "금", "토"];
      // let dateFormat = publicDate.getFullYear() + "년" + (publicDate.getMonth() + 1) + "월" + publicDate.getDate() + "일" + day[publicDate.getDay()] + "요일";
      newH4Element.innerHTML =
        publicDate.getFullYear() +
        "년 " +
        (publicDate.getMonth() + 1) +
        "월 " +
        publicDate.getDate() +
        "일 " +
        day[publicDate.getDay()] +
        "요일";

      child.appendChild(newAElement);
      newAElement.append(newH3Element);
      newAElement.append(newPElement);
      newAElement.append(newH4Element);
      newAElement.setAttribute("href", item.link);
      newAElement.setAttribute("target", "_blank");
    });
  };

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
            <div className="content">
              <figure>
                <img src={StrongImg01} alt="장점1"></img>
              </figure>
              <div>
                한 눈에 자산을 분석<br></br>통합 계좌 관리
              </div>
            </div>
            <div className="content">
              <figure>
                <img src={StrongImg01} alt="장점2"></img>
              </figure>
              <div>
                쉽고 편리하게 만드는<br></br>보고서
              </div>
            </div>
            <div className="content">
              <figure>
                <img src={StrongImg01} alt="장점3"></img>
              </figure>
              <div>
                기존 상품과 비교해<br></br>최적의 상품 정보 제공
              </div>
            </div>
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
          <div className="swiper_wrap">
            <Swiper
              ref={news_wrap}
              className="main_news_wrap flex justify_between"
              spaceBetween={50}
              grabCursor={true}
              slidesPerView={3}
              navigation={{ clickable: true }}
              // mousewheel={true}
              pagination={{ clickable: true }}
              modules={[Navigation, Pagination]}
              style={{
                "--swiper-theme-color": "#898989",
                "--swiper-navigation-size": "30px",
              }}
            ></Swiper>
            {/* {news.map((ele, idx) => {
              // let news_title = useRef();
              return (
                <Link key={idx} className="" to={`${ele.link}`}>
                  <div className="main_news_cont content">
                    <h2 ref={news_title}></h2>
                    <h3>{ele.title.replace(/<[^>]+>/g, "").replace(/&apos;/g,"'" )}</h3>
                    <p>{ele.description.replace(/<[^>]+>/g, "").replace(/&apos;/g,"'" )}</p>
                    <h4>{ele.pubDate}</h4>
                  </div>
                </Link>
              );
            })} */}
          </div>
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
