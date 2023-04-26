import React, { useState } from "react";
import { StepContext } from "./context/StepContext";
import Pages from "./Pages";

function Index() {
  const [stepNum, setStepNum] = useState(0);
  const [userInfo, setUserInfo] = useState({
    userNo: "",
    userCode: "",
    name: "",
    id: "",
    email: "",
    tel: "",
    dept: ""
  })
  const currentPage = () => {
    return (
      <StepContext.Provider value={{ stepNum, setStepNum, userInfo, setUserInfo }}>
        <Pages />
      </StepContext.Provider>
    );
  };

  return (
    <div id="wrap">
      <div className="inner flex flex_column align_center">
        <h2>개인정보수정</h2>
        {currentPage()}
      </div>
    </div>
  );
}

export default Index;
