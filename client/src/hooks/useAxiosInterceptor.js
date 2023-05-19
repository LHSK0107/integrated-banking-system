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
                console.log(`AuthAxios요청발생`);
                if(!config.headers['Authorization']){ // 헤더에 없거나 최초 요청 시 실행
                    config.headers['Authorization'] = `Bearer ${localStorage.getItem("jwt")}`;
                }
                return config;
            }, (error) => Promise.reject(error) // 요청 오류가 있는 경우
        );
        const responseIntercept = AuthAxios.interceptors.response.use(
            (response) => response,
            async (error) => {  // token 만료 시
                const originRequest = error?.config; // 에러가 발생한 요청에 대한 정보 담기
                if(error?.response?.status === 401 || error?.response?.status === 403) {
                    originRequest.sent = true;
                    const newAccessToken = await refresh();
                    originRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return AuthAxios(originRequest); // 새로운 토큰으로 request를 다시 함
                }
                return Promise.reject(error); // 401 또는 403에러가 아닐 경우
            }
        );
        return () => { // 처리 완료 후, 중첩되지 않게 언마운트
            AuthAxios.interceptors.response.eject(responseIntercept);
            AuthAxios.interceptors.request.eject(requestIntercept);
        }
    },[refresh,token]);
    return AuthAxios;
}
export default useAxiosInterceptor;