import { useEffect, useState } from 'react'

const useBalance = ({balance}) => {
  // 변수명 수정은 후에
  const [realMoney, setRealMoney]=useState("");
  let splitBalance = null;
  if(typeof(balance)==="string"){
    splitBalance = balance.split(".",1);
  } else {
    splitBalance = [String(balance)];
  }
  const money = splitBalance.toString();
  const balLength = money.length;
  useEffect(()=>{
    const addUnit = () => {
      let count = 0;
      let arr = [];
      for(let i=balLength; i>0; i--){
        if(count!==0 && count%3===0){
          arr.unshift(",");
        }
        arr.unshift(money[i-1]);
        count++;
      }
      setRealMoney(arr.join('')+"원");
    }
    addUnit();
  },[money,balance,balLength]);
  return realMoney;
};

export default useBalance;