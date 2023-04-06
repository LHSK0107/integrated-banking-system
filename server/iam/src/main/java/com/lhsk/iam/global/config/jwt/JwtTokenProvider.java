package com.lhsk.iam.global.config.jwt;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.lhsk.iam.global.config.auth.PrincipalDetails;

public class JwtTokenProvider {
	
	@Value("${jwt.secret}")
	private String SECRET;
	@Value("${jwt.expirationTime}")
	private String EXPIRATION_TIME;
	@Value("${jwt.tokenPrefix}")
	private String TOKEN_PREFIX;
	@Value("${jwt.headerString}")
	private String HEADER_STRING;
	
	public String generateToken(Authentication authentication) {
    	PrincipalDetails principalDetailis = (PrincipalDetails) authentication.getPrincipal();

    	String jwtToken = JWT.create()
				.withSubject(principalDetailis.getUsername())
				.withExpiresAt(new Date(System.currentTimeMillis()+EXPIRATION_TIME))
				.withClaim("id", principalDetailis.getUserVO().getId())
				.withClaim("name", principalDetailis.getUserVO().getName())
				.sign(Algorithm.HMAC512(SECRET));
    	
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + EXPIRATION_TIME);
        
        return jwtToken;
        
//        return Jwts.builder()
//                .setSubject(user.getUsername())
//                .setIssuedAt(new Date())
//                .setExpiration(expiryDate)
//                .signWith(SignatureAlgorithm.HS512, jwtSecret)
//                .compact();
    }
}
