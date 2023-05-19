import useAuth from "./useAuth";
import axios from "../api/useCommonAxios";
const useRefreshToken = () => {
  const { setToken2 } = useAuth();
  const refresh = async () => {
    try { // accessToken 재발급 시도
      console.log("accessToken 재발급 실행");
      const response = await axios.post("/api/reAccessToken");
      const token = response.headers.get("Authorization").split(" ")[1];
      localStorage.removeItem("jwt");
      localStorage.setItem("jwt", token);
      setToken2(token);
      return token;
    } catch { // refreshToken 만료 시, 실행
      alert("로그인이 필요합니다.");
      setToken2(null);
      localStorage.removeItem("jwt");
    }
  };
  return refresh;
};

export default useRefreshToken;
