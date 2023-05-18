package com.lhsk.iam.domain.user.service;

import java.security.GeneralSecurityException;
import java.time.LocalDateTime;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lhsk.iam.domain.user.model.mapper.LoginMapper;
import com.lhsk.iam.domain.user.model.vo.LoginHistoryVO;
import com.lhsk.iam.domain.user.model.vo.UserVO;
import com.lhsk.iam.global.config.JwtConfig;
import com.lhsk.iam.global.config.auth.PrincipalDetails;
import com.lhsk.iam.global.config.jwt.JwtTokenProvider;
import com.lhsk.iam.global.encrypt.AesGcmEncrypt;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
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
        
        // 액세스 토큰 발급(헤더)
        response.addHeader(jwtConfig.getHeaderString(), jwtConfig.getTokenPrefix()+accessToken);
        response.addHeader("Access-Control-Expose-Headers", jwtConfig.getHeaderString());
        response.addHeader("Access-Control-Expose-Headers", "Set-Cookie");
        
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
        log.info("dt : "+vo.getLoginDt());
        log.info("dept : "+vo.getDept());
        loginMapper.insertLoginHistory(vo);
        log.info("insertLoginHistory 작업 완료");
    }
    
    // 로그아웃
    public void logout(HttpServletRequest request, HttpServletResponse response) {
		log.info("cookie 소멸 시작");
    	Cookie[] cookies = request.getCookies();
	    if (cookies != null) {
	        for (Cookie cookie : cookies) {
	            if ("refreshToken".equals(cookie.getName())) {
	            	log.info("쿠키가 존재함");
	            	log.info(cookie.getName() + " : " + cookie.getValue()); 
	                // 쿠키의 값을 비우고 유효 시간을 과거로 설정하여 삭제합니다.
	                cookie.setValue(null);
	                cookie.setMaxAge(0);
	                cookie.setHttpOnly(true);
	                cookie.setSecure(true); // HTTPS를 사용하는 경우에만 필요합니다.
	                cookie.setPath("/");
	                response.addCookie(cookie);
	                break;
	            }
	        }
	    }
	    // SecurityContextHolder에서 인증 정보를 제거합니다.
        SecurityContextHolder.clearContext();
    }
}
