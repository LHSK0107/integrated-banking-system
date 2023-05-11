import "../index.css";
import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const NewsSlider = () => {
  const news_wrap = useRef();
  const [news, setNews] = useState([]);

  useEffect(() => {
    const url = "http://localhost:8080/api/news";
    axios
      .get(url)
      .then((response) => {
        console.log(response);
        clearData(response.data);
      })
      .catch((err) => {
        console.log(err);
        news_wrap.current.innerHTML = "데이터를 불러올 수 없습니다.";
      });
  }, []);

  let newsArr = [];
  const day = ["일", "월", "화", "수", "목", "금", "토"];
  const clearData = (items) => {
    items.map((ele, idx) => {
      console.log(ele);
      ele.pubDate = updateDateFormat(ele.pubDate);
      newsArr.push(ele);
      setNews(newsArr);
    });
  };

  const updateDateFormat = (item) => {
    let publicDate = new Date(item);
    const day = ["일", "월", "화", "수", "목", "금", "토"];
    publicDate =
      publicDate.getFullYear() +
      "년 " +
      (publicDate.getMonth() + 1) +
      "월 " +
      publicDate.getDate() +
      "일 " +
      day[publicDate.getDay()] +
      "요일";
    return publicDate;
  };

//   const pushElement = (items) => {
//     const div_news = news_wrap.current; // swiper
//     const child = div_news.children[0]; // swiper_wrapper

//     child.innerHTML = ""; // 비우기

//     items.map((item, idx) => {
//       const newAElement = document.createElement("a");
//       newAElement.classList.add(
//         "content",
//         "main_news_cont",
//         "flex",
//         "flex_column",
//         "justify_between",
//         "swiper-slide"
//       );
//       const newH3Element = document.createElement("h3");
//       newH3Element.innerHTML = item.title;
//       const newPElement = document.createElement("p");
//       newPElement.innerHTML = item.description;
//       const newH4Element = document.createElement("h4");
//       let publicDate = new Date(item.pubDate);
//       const day = ["일", "월", "화", "수", "목", "금", "토"];
//       // let dateFormat = publicDate.getFullYear() + "년" + (publicDate.getMonth() + 1) + "월" + publicDate.getDate() + "일" + day[publicDate.getDay()] + "요일";
//       newH4Element.innerHTML =
//         publicDate.getFullYear() +
//         "년 " +
//         (publicDate.getMonth() + 1) +
//         "월 " +
//         publicDate.getDate() +
//         "일 " +
//         day[publicDate.getDay()] +
//         "요일";

//       child.appendChild(newAElement);
//       newAElement.append(newH3Element);
//       newAElement.append(newPElement);
//       newAElement.append(newH4Element);
//       newAElement.setAttribute("href", item.link);
//       newAElement.setAttribute("target", "_blank");
//     });
//   };

  return (
      <div className="swiper_wrap">
        {/* <div className="swiper_wrap">
                <Swiper
                  ref={news_wrap}
                  className="main_news_wrap flex justify_between"
                  slidesPerView={3}
                  spaceBetween={50}
                  grabCursor={true}
                  navigation={{ clickable: true }}
                  // mousewheel={true}
                  pagination={{
                    clickable: true,
                    type: "fraction",
                  }}
                  modules={[Navigation, Pagination]}
                  style={{
                    "--swiper-theme-color": "#898989",
                    "--swiper-navigation-size": "30px",
                  }}
                ></Swiper>
              </div> */}
      <Swiper
        ref={news_wrap}
        className="main_news_wrap mySwiper"
        slidesPerView={3}
        spaceBetween={50}
        grabCursor={true}
        navigation={{ clickable: true }}
        // mousewheel={true}
        pagination={{
          type: "fraction",
        }}
        modules={[Navigation, Pagination]}
        style={{
          "--swiper-theme-color": "#898989",
          "--swiper-navigation-size": "30px",
        }}
      >
        {news.map((ele, idx) => {
          return (
            <SwiperSlide key={idx}>
              <Link className="" to={`${ele.link}`} target={"_blank"}>
                <div className="main_news_cont card flex justify_between flex_column">
                  <h3>
                    {ele.title.replace(/<[^>]+>/g, "").replace(/&apos;/g, "'").replace(/&quot;/g,"'")}
                  </h3>
                  <p>
                    {ele.description
                      .replace(/<[^>]+>/g, "")
                      .replace(/&apos;/g, "'")
                      .replace(/&quot;/g,"'")}
                  </p>
                  <h4>{ele.pubDate}</h4>
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default NewsSlider;
