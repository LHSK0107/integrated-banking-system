import { AuthAxios } from "../api/useCommonAxios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

const useAxiosInterceptor = () => {
    const refresh = useRefreshToken();
    const {token} = useAuth();
    useEffect(()=>{
        const requestIntercept = AuthAxios.interceptors.request.use(
            (config) => {
                // 헤더에 없거나 최초 요청 시 실행
                if(!config.headers['Authorization']){
                    config.headers['Authorization'] = `Bearer ${localStorage.getItem("jwt")}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );
        const responseIntercept = AuthAxios.interceptors.response.use(
            (response) => response,
            // token 만료 시
            async (error) => {
                const prevRequest = error?.config;
                // forbidden
                // sent => 존재하지 않을 때
                if(error?.response?.status === 401 || error?.response?.status === 403) {
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    // 새로운 토큰으로 request를 다시 함
                    return AuthAxios(prevRequest);
                } 
                // if가 트루가 아닐 때
                return Promise.reject(error);
            }
        );
        // 처리 완료 후, 언마운트
        return () => {
            AuthAxios.interceptors.response.eject(responseIntercept);
            AuthAxios.interceptors.request.eject(requestIntercept);
        }
    },[refresh,token]);
    return AuthAxios;
}
export default useAxiosInterceptor;