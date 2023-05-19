import React, { memo, useEffect, useState,useRef } from 'react'
import autoLogout from '../utils/autoLogout';
import useAuth from '../hooks/useAuth';
import TimerImg from "../assets/images/icon/timer.png";
const timerFormmater = (countTime)=>{
    let min = Math.floor(countTime/60);
    let sec = Math.floor(countTime-min*60);
    if(min < 10) min = `0${min}`;
    if(sec < 10) sec = `0${sec}`;
    return `${min}:${sec}`;
}

const ExpCountDown = memo(({seconds}) => {
    const {setToken2} = useAuth();
    const [countdown, setCountDown] = useState(seconds);
    const timerRef = useRef();
    useEffect(()=>{
        timerRef.current = setInterval(()=>{
            setCountDown(prev=>prev-1);
        },1000);
        return()=>clearInterval(timerRef.current);
    },[]);

    useEffect(()=>{
        if(countdown <= 0) {
            clearInterval(timerRef.current);
            alert("로그아웃 되었습니다.");
            autoLogout();
            localStorage.removeItem("jwt");
            setToken2(null);
        }
    })
  return (
    <div className="flex align_center">
        <img className="timer-icon-img" alt="timer-clock-이미지" src={TimerImg} />
        <p>{timerFormmater(countdown)}</p>
    </div>
  )
})

export default ExpCountDown;