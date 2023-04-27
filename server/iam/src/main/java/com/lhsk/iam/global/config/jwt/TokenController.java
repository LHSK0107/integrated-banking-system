package com.lhsk.iam.global.config.jwt;

import java.util.Enumeration;
import java.util.Iterator;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lhsk.iam.global.config.JwtConfig;
import com.lhsk.iam.global.config.auth.PrincipalDetails;
import com.lhsk.iam.global.config.auth.PrincipalDetailsService;

import io.jsonwebtoken.ExpiredJwtException;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class TokenController {
	
	private JwtConfig jwtConfig;
	@Autowired
	private JwtTokenProvider jwtTokenProvider;
	private PrincipalDetailsService principalDetailsService;
	
	/*
	 * 리프레시 토큰 검증
	 * 검증 통과시, 액세스 토큰 재발급
	 * 미통과시(보안 공격, 리프레시 토큰 만료) -> 로그아웃 처리
	 */
	 
	@PostMapping("/refreshToken")
	public ResponseEntity<?> reAccessToken(HttpServletRequest req) {
		// 쿠키에서 리프레시 토큰 추출
	    System.out.println("Request Cookies:");
	    Cookie[] cookies = req.getCookies();
	    String refreshToken = null;
	    if (cookies != null) {
	        for (Cookie cookie : cookies) {
	            System.out.println(cookie.getName() + ": " + cookie.getValue());
	            if (cookie.getName().equals("refreshToken")) {
                    refreshToken = cookie.getValue();
                    break;
                }
	        }
	    }
	    
	    try {
	    	// 리프레시 토큰 유효성 검사
	    	if (refreshToken == null || !jwtTokenProvider.validateToken(refreshToken)) {
	    		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired refresh token.");
	    	}
	    } catch (ExpiredJwtException e) {
	    	return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token has expired.");
		}
	    
	    
	    Authentication authentication = jwtTokenProvider.getAuthenticationFromRefreshToken(refreshToken);
	    String newAccessToken = jwtTokenProvider.createAccessToken(authentication);
	    System.out.println("재발급한 액세스토큰"+newAccessToken);
	    return ResponseEntity.ok().header(jwtConfig.getHeaderString(), jwtConfig.getTokenPrefix() + newAccessToken).build();
	}
	
	
	

	
}
