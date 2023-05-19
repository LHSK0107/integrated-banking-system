// import AuthAxios from "./useAxiosInterceptor.js";
import axios from "axios";
import useAuth from "./useAuth";
const useRefreshToken = () => {
  const { setToken2 } = useAuth();
  const refresh = async () => {
    const response = await axios.post(
      // "http://localhost:8080/reAccessToken",
      "https://iam-api.site/api/reAccessToken",
      null,
      {
        withCredentials: true,
      }
    );
    const token = response.headers.get("Authorization").split(" ")[1];
    setToken2(token);
    response.then(
      (val) => {
        console.log(`성공 val:${val}`);
      },
      (err) => {
        console.log(`실패 val:${err}`);
      }
    );
    return token;
  };

  return refresh;
};

export default useRefreshToken;
