import useAuth from "../hooks/useAuth";
import axios from "../api/useCommonAxios";
import {useNavigate} from "react-router-dom";
const autoLogout = () =>{
  console.log(`로그아웃`);
    localStorage.removeItem("jwt")
    const logout = async () =>{
        return await axios.post("https://iam-api.site/api/logout",
          {
            allAccount: 1,
            inout: 2,
            inoutReport: 3,
            dailyReport: 4,
            dashboard: 5,
          }
        )
    }
    return logout;
}
export default autoLogout;