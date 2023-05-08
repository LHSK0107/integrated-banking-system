import {AuthPostAxios} from "./useAxiosInterceptor.js";
import useAuth from "./useAuth";
const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await AuthPostAxios.get('/reAccessToken', {
            withCredentials: true
        });
        
    }
  return refresh;
}

export default useRefreshToken