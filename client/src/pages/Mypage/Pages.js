import React, { useContext } from "react";
import { StepContext } from "./context/StepContext";
import ConfirmPw from "./component/ConfirmPw";
import UpdateInfo from "./component/UpdateInfo";
import Index404 from "../404/Index";

const Pages = () => {
  const { stepNum } = useContext(StepContext);

  switch (stepNum) {
    case 0:
      return <ConfirmPw />;
    case 1:
      return <UpdateInfo />;
    default:
      return <Index404 />;
  }
};

export default Pages;
