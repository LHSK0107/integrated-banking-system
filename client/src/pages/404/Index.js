import "./404.css";
import React from 'react';
import { useNavigate } from 'react-router-dom';
import NotFoundBgImg from "../../assets/images/notfound_bg.png";
import NotFoundTit from "../../assets/images/notfound_tit.png"

export default function Index() {
    const navigate = useNavigate();
    const goMain = (e) => {
        e.preventDefault();
        navigate("/");
    }
    
    const goBack = (e) => {
        e.preventDefault();
        window.history.back();
    }

  return (
    <div className="notFound_wrap flex justify_center align_center">
        <div className="notFound flex flex_column align_center justify_center">
            <div className="notFound_title flex">
                <img src={NotFoundTit} alt="404페이지 타이틀"></img>
            </div>
            <div className="notFound_cont">
                <h2>죄송합니다. 현재 찾을 수 없는 페이지를 요청 하셨습니다.</h2>
                <h3>존재하지 않는 주소를 입력하셨거나,<br />
                요청하신 페이지의 주소가 변경, 삭제되어 찾을 수 없습니다.<br />
                주소를 다시 한 번 확인해주시기 바랍니다.<br /><br />
                감사합니다.</h3>
            </div>
            <div className="notFound_btn_wrap flex">
                <button className="btn" onClick={goMain}>메인으로</button>
                <button className="btn" onClick={goBack}>이전으로</button>
            </div>
        </div>
    </div>
  )
}
