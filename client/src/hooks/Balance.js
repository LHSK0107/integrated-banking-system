import React, { useEffect, useState } from 'react'

const Balance = ({balance}) => {
  // 변수명 수정은 후에
  const [realMoney, setRealMoney]=useState("");
  const splitBalance = balance.split(".",1);
  const money = splitBalance.reverse().toString();
  const balLength = money.length;

  useEffect(()=>{
    const addUnit = () => {
      let count = 0;
      let arr = [];
      for(let i=balLength; i>0; i--){
        if(count!==0 && count%3===0){
          arr.unshift(",");
        }
        arr.unshift(balance[i-1]);
        count++;
      }
      setRealMoney(arr.join('')+"원");
    }
    addUnit();
  },[balance,balLength]);
  return <p>{realMoney==="" ? "null" : realMoney}</p>

};

export default Balance;