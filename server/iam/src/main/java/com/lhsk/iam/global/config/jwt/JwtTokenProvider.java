package com.lhsk.iam.global.config.jwt;

import java.util.Date;

import org.springframework.security.core.Authentication;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.lhsk.iam.global.config.auth.PrincipalDetails;

public class JwtTokenProvider {
	
	private String jwtSecret = JwtProperties.SECRET;
	private int jwtExpirationInMs = JwtProperties.EXPIRATION_TIME;
	
	public String generateToken(Authentication authentication) {
    	PrincipalDetails principalDetailis = (PrincipalDetails) authentication.getPrincipal();

    	String jwtToken = JWT.create()
				.withSubject(principalDetailis.getUsername())
				.withExpiresAt(new Date(System.currentTimeMillis()+JwtProperties.EXPIRATION_TIME))
				.withClaim("id", principalDetailis.getUserVO().getId())
				.withClaim("name", principalDetailis.getUserVO().getName())
				.sign(Algorithm.HMAC512(JwtProperties.SECRET));
    	
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);
        
        return jwtToken;
        
//        return Jwts.builder()
//                .setSubject(user.getUsername())
//                .setIssuedAt(new Date())
//                .setExpiration(expiryDate)
//                .signWith(SignatureAlgorithm.HS512, jwtSecret)
//                .compact();
    }
}
