import {useMemo} from "react";

// 현재 시각 조회 함수
const useCurrentTime = (num) => {
  // render 관련 훅이 없어서 memo는 삭제해도 괜찮을 것 같음
  const nowDate = useMemo(() => new Date(), []);
  // 0일 경우, 기본 input date type과 같은 형식으로 반환 ex) 2023-04-05
  if (num === 0) {
    const currentTime = `${nowDate.getFullYear()}-${("0" + (nowDate.getMonth() + 1)).slice(-2)}-${("0" + nowDate.getDate()).slice(-2)}`;
    return {nowDate, currentTime};
  // 그 외, 조회기준일 형식을 반환 ex) 2023년 04월 05일 20:31
  } else {
    const currentTime = `${nowDate.getFullYear()}년 ${("0" + (nowDate.getMonth() + 1)).slice(-2)}월 ${("0" + nowDate.getDate()).slice(-2)}일 ${("0" + nowDate.getHours()).slice(-2)}:${("0" + nowDate.getMinutes()).slice(-2)}`;
    return currentTime;
  }
};

export default useCurrentTime;
