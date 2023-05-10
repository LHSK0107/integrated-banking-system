// import AuthAxios from "./useAxiosInterceptor.js";
import axios from "../api/useCommonAxios";
import useAuth from "./useAuth";
const useRefreshToken = () => {
    const {setToken2} = useAuth();
    console.log("Refresh 실행");
    const refresh = async () => {
        const response = await axios.post('/reAccessToken');
        const token = response.headers.get("Authorization").split(" ")[1];
        setToken2(token);
        response.then((val)=>{
            console.log(`성공 val:${val}`);
        }, (err)=>{
            console.log(`실패 val:${err}`);
        })
        return token;
    }
   
  return refresh;
}

export default useRefreshToken;