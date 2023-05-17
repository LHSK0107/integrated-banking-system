package com.lhsk.iam.global.config.jwt;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lhsk.iam.global.config.JwtConfig;
import com.lhsk.iam.global.config.auth.PrincipalDetailsService;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@Slf4j
public class TokenController {
	
	@Autowired
	private JwtConfig jwtConfig;
	@Autowired
	private JwtTokenProvider jwtTokenProvider;
	
	/*
	 * 리프레시 토큰 검증
	 * 검증 통과시, 액세스 토큰 재발급
	 * 미통과시(보안 공격, 리프레시 토큰 만료) -> 로그아웃 처리
	 */
	 
	@PostMapping("/reAccessToken")
	public ResponseEntity<?> reAccessToken(HttpServletRequest req) {
		// 쿠키에서 리프레시 토큰 추출
	    String refreshToken = getRefreshTokenFromCookies(req);
	    log.info("refresh = "+refreshToken);
	    
    	// 리프레시 토큰 유효성 검사
	    try {
	    	if (refreshToken == null || !jwtTokenProvider.validateToken(refreshToken)) {
	    		log.info("try 안에서 쿠키 없음");
	    		log.info("리프레시 토큰 : " + refreshToken);
	    		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired refresh token.");
	    	}
	    } catch(ExpiredJwtException e) {
	    	// 토큰이 만료됨
	    	log.info("토큰이 만료됨 : " + refreshToken);
	    	return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("토큰이 만료됐습니다.");
	    } catch(MalformedJwtException e) {
	    	// 토큰 구조가 올바르지 않은 경우에 대한 처리
	    	log.info("토큰의 구조가 올바르지 않음 : " + refreshToken);
	    	return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("손상된 토큰입니다.");
	    } catch(SignatureException e) {
	    	// Jwt가 올바르게 서명되지 않음 -> 스프링 재실행시 일어날듯
	    	log.info("서명이 일치하지 않음 : " + refreshToken);
	    	return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("서명이 일치하지 않습니다.");
	    }
	    
	    Authentication authentication = jwtTokenProvider.getAuthenticationFromRefreshToken(refreshToken);
	    String newAccessToken = jwtTokenProvider.createAccessToken(authentication);
	    log.info("재발급한 액세스토큰 : "+newAccessToken);
	    return ResponseEntity.ok()
	    		.header(jwtConfig.getHeaderString(), jwtConfig.getTokenPrefix() + newAccessToken)
	    		.header("Access-Control-Expose-Headers", jwtConfig.getHeaderString())
	    		.build();
	}
	
	@PostMapping("/refreshToken")
	public ResponseEntity<?> genereateRefreshToken(HttpServletRequest req, HttpServletResponse resp) {
		
		String oldRefreshToken = getRefreshTokenFromCookies(req);
		try {
	    	if (oldRefreshToken == null || !jwtTokenProvider.validateToken(oldRefreshToken)) {
	    		log.info("리프레시 토큰 : " + oldRefreshToken);
	    		log.info("토큰이 이상함");
	    		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired refresh token.");
	    	}
	    } catch(ExpiredJwtException e) {
	    	// 토큰이 만료됨
	    	log.info("토큰이 만료됨 : " + oldRefreshToken);
	    	return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("토큰이 만료됐습니다.");
	    } catch(MalformedJwtException e) {
	    	// 토큰 구조가 올바르지 않은 경우에 대한 처리
	    	log.info("토큰의 구조가 올바르지 않음 : " + oldRefreshToken);
	    	return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("손상된 토큰입니다.");
	    } catch(SignatureException e) {
	    	// Jwt가 올바르게 서명되지 않음 -> 스프링 재실행시 일어날듯
	    	log.info("서명이 일치하지 않음 : " + oldRefreshToken);
	    	return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("서명이 일치하지 않습니다.");
	    }
		
		Authentication authentication = jwtTokenProvider.getAuthenticationFromRefreshToken(oldRefreshToken);
		
		String newRefreshToken = jwtTokenProvider.createRefreshToken(authentication);
				
		Cookie refreshTokenCookie = new Cookie("refreshToken", newRefreshToken);
		refreshTokenCookie.setHttpOnly(true);			// JS로 쿠키접근 불가능
		refreshTokenCookie.setPath("/");	// 프론트가 쿠키를 서버측으로 전송할때, 특정 url로 요청할 경우에만 전송가능
		refreshTokenCookie.setMaxAge(60 * 30); 			// 30 min
		
//      refreshTokenCookie.setSecure(true);			// https에서만 전송되도록 설정
        resp.addCookie(refreshTokenCookie);
		return new ResponseEntity<>("로그인 연장 완료",HttpStatus.OK);
	}
	
	// 쿠키로부터 리프레시 토큰을 추출하는 메소드
	private String getRefreshTokenFromCookies(HttpServletRequest req) {
	    Cookie[] cookies = req.getCookies();
	    log.info("getRefreshTokenFromCookies : " + cookies);
	    if (cookies != null) {
	        for (Cookie cookie : cookies) {
	            if (cookie.getName().equals("refreshToken")) {
	            	log.info("쿠키 있음");
	            	log.info("리프레시 토큰 : "+cookie.getValue());
	                return cookie.getValue();
	            }
	        }
	    }
	    return null;
	}
	
}
