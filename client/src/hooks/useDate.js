import {useMemo} from "react";

// 현재 시각 조회 함수
// 다음과 같이 출력하기 위함 ex) 2023.04.05 14:24:14
const useDate = (trscDt,trscTm) => {
  // 변수명 추후 수정
  const fullDate = trscDt.substring(0,4).concat('.')+trscDt.substring(4,6).concat('.')+trscDt.substring(6);
  const reTime = trscTm.substring(0,2).concat(':')+trscTm.substring(2,4).concat(':')+trscTm.substring(4);
  const doneTime = `${fullDate} ${reTime}`;
  return doneTime;
};

export default useDate;
