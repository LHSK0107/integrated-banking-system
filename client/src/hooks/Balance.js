import React, { useEffect, useState } from 'react'

const Balance = ({balance}) => {
  // const arr = balance.split("원",1);
  // const realMoney = arr.toString()
  const [realMoney, setRealMoney]=useState("");
  const splitBalance = balance.split(".",1);
  const money = splitBalance.reverse().toString();
  const balLength = money.length;

  useEffect(()=>{
    const addUnit = () => {
      let count = 0;
      let arr = [];
      let imsi = "";
      for(let i=balLength; i>0; i--){
        if(count!==0 && count%3===0){
          arr.unshift(",");
        }
        arr.unshift(balance[i-1]);
        count++;
      }
      for(let value of arr){
        imsi = imsi+value;
      }
      setRealMoney(imsi+"원");
    }
    addUnit();
  },[balance,balLength]);
  return (
    <p>{realMoney==="" ? "null" : realMoney}</p>
  )
};

export default Balance;