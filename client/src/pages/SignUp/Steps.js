import React, { useContext, useEffect, useRef } from "react";
import { PageContext } from "./context/PageContext";
import UserInfo from "./component/UserInfo";
import PersonalInfo from "./component/PersonalInfo";
import EmailConfirm from "./component/EmailConfirm";
import Result from "./component/Result";
import UserIcon from "../../assets/images/icon/user.png";
const Steps = () => {
  const { pageNum } = useContext(PageContext);
  // if-else=>switch로 변경
  switch (pageNum) {
    case 0:
      return (
        <>
          <ProgressBar pageNum={pageNum} />
          <FormTitle pageNum={pageNum} />
          <UserInfo />
        </>
      );
    case 1:
      return (
        <>
          <ProgressBar pageNum={pageNum} />
          <FormTitle pageNum={pageNum} />
          <PersonalInfo />
        </>
      );
    case 2:
      return (
        <>
          <ProgressBar pageNum={pageNum} />
          <FormTitle pageNum={pageNum} />
          <EmailConfirm />
        </>
      );
    case 3:
      return (
        <>
          <ProgressBar pageNum={pageNum} />
          <FormTitle pageNum={pageNum} />
          <Result />
        </>
      );
    default:
      return (
        <>
          <h1>404 page</h1>
        </>
      );
  }
};
// 나중에 component 폴더로 분리
const ProgressBar = (props) => {
  const progressBarRef = useRef();
  const progressWrapRef = useRef();
  const progressItem = useRef();

  // 추후 progress wrap 이용해서 전부 처리
  useEffect(() => {
    const progressWidth = progressWrapRef.current.offsetWidth;
    const progressCountImg = progressWrapRef.current.childNodes.length;
    const progressChildList = progressWrapRef.current.children;
    // list 내 항목 attribute로 ref 추가가 안 됨
    // item.setAttribute("ref",{progressItem});

    // 랜더링 시, pageNum state 변경되므로 active 전체 삭제 후에 아이콘[pageNum]까지 active 클래스 부여
    for (var item of progressChildList) {
      item.classList.remove("active");
    }
    for (let i = 0; i <= props.pageNum; i++) {
      progressChildList[i + 1].classList.add("active");
    }

    // progress bar로 각 props를 전달하되, 아이템 별 사이에 있는 줄은 전체 개수보다 1이 적고, 전체 length 구할 때
    // progress_bar div도 포함되어 있으니 1을 빼야 하니 총 2를 뺌
    progressFunc(props.pageNum, progressWidth, progressCountImg - 2);
  }, [props.pageNum]);
  // 현재 width를 바탕으로 progress bar 작업
  const progressFunc = (pageNum, width, count) => {
    progressBarRef.current.style.transition = "0.4s ease-in-out";
    progressBarRef.current.style.width = `${(width / count) * pageNum}px`;
  };
  return (
    <div ref={progressWrapRef} className="progress_wrap">
      <div ref={progressBarRef} className="progress_bar"></div>
      <figure>
        <img className="circle active" src={UserIcon} alt="icon" />
      </figure>
      <figure>
        <img className="circle" src={UserIcon} alt="icon" />
      </figure>
      <figure>
        <img className="circle" src={UserIcon} alt="icon" />
      </figure>
      <figure>
        <img className="circle" src={UserIcon} alt="icon" />
      </figure>
    </div>
  );
};

const FormTitle = (props) => {
  // 페이지별 title
  const formTitles = [
    "Hello, We are I'am! Create Account",
    "Please check your email",
    "Almost there..",
    "It's Done!",
  ];
  return <h1>{formTitles[props.pageNum]}</h1>;
};

export default Steps;
