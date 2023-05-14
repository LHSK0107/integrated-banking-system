package com.lhsk.iam.domain.user.service;

import java.net.URI;
import java.net.URISyntaxException;
import java.security.GeneralSecurityException;
import java.time.LocalDateTime;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lhsk.iam.domain.user.model.mapper.LoginMapper;
import com.lhsk.iam.domain.user.model.vo.LoginHistoryVO;
import com.lhsk.iam.domain.user.model.vo.UserVO;
import com.lhsk.iam.global.config.JwtConfig;
import com.lhsk.iam.global.config.auth.PrincipalDetails;
import com.lhsk.iam.global.config.jwt.JwtTokenProvider;
import com.lhsk.iam.global.encrypt.AesGcmEncrypt;

@Service
public class LoginService {
	
	@Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private JwtConfig jwtConfig;

    @Autowired
    private LoginMapper loginMapper;

    @Value("${aes.secret}")
    private String key;
    @Value("${aes.iv}")
    private String ivString;
    
    @Transactional
    public void processSuccessfulAuthentication(
            HttpServletRequest request, HttpServletResponse response, Authentication authResult) {
        // 여기에 토큰 발급 및 로그인 기록 저장 코드를 작성합니다.
    	PrincipalDetails principalDetailis = (PrincipalDetails) authResult.getPrincipal();
        String accessToken = jwtTokenProvider.createAccessToken(authResult);
        String refreshToken = jwtTokenProvider.createRefreshToken(authResult);
  
        // 리프레시 토큰 발급(쿠키)
//        Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
//        refreshTokenCookie.setHttpOnly(false);			// JS로 쿠키접근 불가능
//        refreshTokenCookie.setPath("/");	// 프론트가 쿠키를 서버측으로 전송할때, 특정 url로 요청할 경우에만 전송가능
//        refreshTokenCookie.setMaxAge(60 * 30); 			// 30 min
        
//        refreshTokenCookie.setSecure(true);			// https에서만 전송되도록 설정
//        response.addCookie(refreshTokenCookie);
        
        // 액세스 토큰 발급(헤더)
        response.addHeader(jwtConfig.getHeaderString(), jwtConfig.getTokenPrefix()+accessToken);
        response.addHeader("Access-Control-Expose-Headers", jwtConfig.getHeaderString());
        response.addHeader("Access-Control-Expose-Headers", "Set-Cookie");
//        response.addHeader("Access-Control-Allow-Credentials", "true");
        
        // 리프레시 토큰 발급(쿠키)
        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
        	.path("/")
        	.sameSite("None")
        	.secure(true)
        	.httpOnly(true)
        	.domain("iam-api.site")
        	.maxAge(60 * 30)
        	.build();
        response.addHeader("Set-Cookie", cookie.toString());
        
        // 로그인 기록 저장
        UserVO user = principalDetailis.getUserVO();
        AesGcmEncrypt aesGcmEncrypt = new AesGcmEncrypt();
        byte[] iv = new byte[12];
        String[] ivStringArray = ivString.split(", "); 
 		// String[] -> byte[]로 번환
 		for (int i = 0; i < iv.length; i++) {
 		    iv[i] = Byte.parseByte(ivStringArray[i]);
 		}
        
        LoginHistoryVO vo = null;
 	try {
 		vo = LoginHistoryVO.builder()
 				   .userNo(user.getUserNo())
 				   .dept(user.getDept())
 				   .name(aesGcmEncrypt.encrypt(user.getName(), key, iv))
 				   .email(aesGcmEncrypt.encrypt(user.getEmail(), key, iv))
 				   .loginDt(LocalDateTime.now())
 				   .build();
 	} catch (GeneralSecurityException e) {
 		e.printStackTrace();
 	}
        System.out.println("dt : "+vo.getLoginDt());
        System.out.println("dept : "+vo.getDept());
        loginMapper.insertLoginHistory(vo);
        System.out.println("insertLoginHistory 작업 완료");
    }
}
