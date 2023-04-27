package com.lhsk.iam.global.config.jwt;

import java.util.Date;
import java.util.UUID;

import javax.annotation.PostConstruct;
import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import com.lhsk.iam.global.config.JwtConfig;
import com.lhsk.iam.global.config.auth.PrincipalDetails;
import com.lhsk.iam.global.config.auth.PrincipalDetailsService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class JwtTokenProvider {
	
	@Autowired
    private JwtConfig jwtConfig;
	@Autowired
	private PrincipalDetailsService principalDetailsService;
	
	private SecretKey secretKey;
	
	@PostConstruct
    public void init() {
		secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS512);
    }
	
	// 엑세스토큰 발급
	public String createAccessToken(Authentication authentication) {
        PrincipalDetails principalDetailis = (PrincipalDetails) authentication.getPrincipal();
        log.info(jwtConfig.getSecret());
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtConfig.getExpirationTime());

        String jwtToken = Jwts.builder()
                .setSubject(principalDetailis.getUserVO().getId())	// id
                .setIssuedAt(now)								// 토큰 발행 일자
                .claim("userCode", principalDetailis.getUserVO().getUserCodeList().get(0))	// 유저권한
                .claim("userNo", principalDetailis.getUserVO().getUserNo())		// 유저번호
                .claim("name", principalDetailis.getUserVO().getName())			// 유저이름
                .setExpiration(expiryDate)						// 토큰 만료 시간
                .signWith(secretKey, SignatureAlgorithm.HS512)	
                .compact();
        
        return jwtToken;
    }
	
	// 리프레시토큰 발급
	public String createRefreshToken(Authentication authentication) {
		PrincipalDetails principalDetailis = (PrincipalDetails) authentication.getPrincipal();
		
		Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtConfig.getRefreshExpirationTime());
		
        String refreshToken = Jwts.builder()
                .setSubject(principalDetailis.getUserVO().getId())
                .setId(UUID.randomUUID().toString())			// JTI(jwt의 고유아이디)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(secretKey, SignatureAlgorithm.HS512)
                .compact();

        return refreshToken;
    }
	
	// 액세스토큰 재발급시 비밀번호 없이 Authentication 객체를 생성 및 반환
	public Authentication getAuthenticationFromRefreshToken(String refreshToken) {
	    String username = getUsernameFromToken(refreshToken);
	    PrincipalDetails principalDetails = (PrincipalDetails) principalDetailsService.loadUserByUsername(username);
	    return new UsernamePasswordAuthenticationToken(principalDetails, null, principalDetails.getAuthorities());
	}
	
	// 유저아이디 추출
	public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }
	
	// 유저 권한 추출
	public String getUserCodeFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.get("userCode", String.class);
    }
	
	// 토큰의 유효성 검사
	public boolean validateToken(String token) {
	    try {
	        Jws<Claims> claims = Jwts.parserBuilder()
	                .setSigningKey(secretKey)
	                .build()
	                .parseClaimsJws(token);
	                
	        if (claims.getBody().getExpiration().before(new Date())) {
	        	System.out.println("토큰이 만료됨" + token);
	            throw new ExpiredJwtException(null, claims.getBody(), "Token has expired");
	        }
	        return true;
	    } catch (MalformedJwtException e) {
	        // 토큰 구조가 올바르지 않은 경우에 대한 처리
	    	log.info("토큰의 구조가 올바르지 않음");
	    } catch (Exception e) {
	        // 기타 예외에 대한 처리
	    	log.info("validateToken 기타 예외");
	    }
	    
	    return false;
	}
}
