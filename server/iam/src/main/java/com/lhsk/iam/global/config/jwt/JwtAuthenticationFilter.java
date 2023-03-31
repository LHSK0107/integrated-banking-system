package com.lhsk.iam.global.config.jwt;

import java.io.IOException;
import java.util.Date;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lhsk.iam.domain.user.model.vo.UserVO;
import com.lhsk.iam.global.config.auth.PrincipalDetails;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter{
	private final AuthenticationManager authenticationManager;
	
	// /login요청을 하면 로그인 시도를 위해서 실행되는 함수
	@Override
	public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
			throws AuthenticationException {
		System.out.println("attemptAuthentication : 로그인 시도중");
		
		try {
			ObjectMapper om = new ObjectMapper();
			UserVO userVO;
			userVO = om.readValue(request.getInputStream(), UserVO.class);
			System.out.println(userVO);
			
			UsernamePasswordAuthenticationToken authenticationToken = 
					new UsernamePasswordAuthenticationToken(userVO.getId(), userVO.getPassword());
			
			// 2. 정상인지 로그인 시도를 해본다.
			// PrincipalDetailsService의 loadUserByUsername()가 실행된 후 정상이면 authentication이 리턴됨.
			// DB에 있는 id와 password가 일치한다.
			Authentication authentication = authenticationManager.authenticate(authenticationToken);
			PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
			
			return authentication;
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}
	
	@Override
	protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
			Authentication authResult) throws IOException, ServletException {
		System.out.println("successfulAuthentication 실행됨 -> 인증완료");
		PrincipalDetails principalDetails = (PrincipalDetails) authResult.getPrincipal();
		
		// Hash암호방식
		String jwtToken = JWT.create()
				.withSubject("cos토큰")
				.withExpiresAt(new Date(System.currentTimeMillis()+(60000*10))) // 만료시간 10분
				.withClaim("id", principalDetails.getUserVO().getId())
				.withClaim("username", principalDetails.getUserVO().getId())
				.sign(Algorithm.HMAC512("cos")); // 서버만 알고있는 고유한 값
		
		
		response.addHeader("Authorization", "Bearer " + jwtToken);
	}
}
