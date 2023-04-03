import React, {useState} from "react";
import axios from "axios";

export const ReqSignUp = ({ data }) => {
  console.log(data);
  const [isVerify, setIsVerify]= useState(false);
  const result = () => {
    axios.post("http://localhost:3301/auth/signup",data).then(()=>{
      console.log("success");
      setIsVerify(true);
      return isVerify;
    }).catch((err)=>{console.log(err); setIsVerify(false); return isVerify;})
  }
  return <div>ReqSignUp</div>;
};
