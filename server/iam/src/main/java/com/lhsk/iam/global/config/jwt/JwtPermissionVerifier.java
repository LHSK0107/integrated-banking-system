package com.lhsk.iam.global.config.jwt;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;

@Component
public class JwtPermissionVerifier {

	@Value("${jwt.tokenPrefix}")
	private String TOKEN_PREFIX;
	@Value("${jwt.headerString}")
	private String HEADER_STRING;
	@Value("${jwt.secret}")
	private String SECRET;
	
	/*
	 * api요청시 jwt토큰으로부터 userCode를 추출하여 접근을 차단시킬 목적
	 */
	public String getUserCodeFromJWT(HttpServletRequest request) {
		String jwtHeader = request.getHeader("Authorization");
		// header가 있는지 확인
		if(jwtHeader == null || !jwtHeader.startsWith(TOKEN_PREFIX)) {
			return null;
		}

		String jwtToken = request.getHeader(HEADER_STRING).replace(TOKEN_PREFIX, "");
		String userCode = 
				JWT.require(Algorithm.HMAC512(SECRET)).build().verify(jwtToken).getClaim("userCode").asString();
		
		return userCode;
	}
}
