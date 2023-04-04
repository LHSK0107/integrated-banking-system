package com.lhsk.iam.global.config.jwt;

import java.io.IOException;
import java.util.Date;
import java.util.List;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.filter.OncePerRequestFilter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lhsk.iam.domain.user.model.vo.LoginRequestVO;
import com.lhsk.iam.domain.user.model.vo.UserVO;
import com.lhsk.iam.global.config.auth.PrincipalDetails;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter{

	private final AuthenticationManager authenticationManager;
	
	
	// Authentication 객체 만들어서 리턴 => 의존 : AuthenticationManager
	// 인증 요청시에 실행되는 함수 => /login
	@Override
	public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
			throws AuthenticationException {
		
//		System.out.println("JwtAuthenticationFilter : 진입");
//		System.out.println("authenticationManager 생성 " + authenticationManager);
		// request에 있는 username과 password를 파싱해서 자바 Object로 받기
		ObjectMapper om = new ObjectMapper();
		LoginRequestVO loginRequestDto = null;
		try {
			loginRequestDto = om.readValue(request.getInputStream(), LoginRequestVO.class);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
//		System.out.println("JwtAuthenticationFilter loginRequestDto: "+loginRequestDto);
		
		// 유저네임패스워드 토큰 생성
		UsernamePasswordAuthenticationToken authenticationToken = 
				new UsernamePasswordAuthenticationToken(
						loginRequestDto.getUsername(), 
						loginRequestDto.getPassword());
		
//		System.out.println("JwtAuthenticationFilter : 토큰생성완료 ->" + authenticationToken);
//		System.out.println("JwtAuthenticationFilter : getCredentials ->" + authenticationToken.getCredentials());
//		System.out.println("비밀번호가 동일한가? : " + authenticationToken.getCredentials().equals(loginRequestDto.getPassword()));
		// authenticate() 함수가 호출 되면 인증 프로바이더가 유저 디테일 서비스의
		// loadUserByUsername(토큰의 첫번째 파라메터) 를 호출하고
		// UserDetails를 리턴받아서 토큰의 두번째 파라메터(credential)과
		// UserDetails(DB값)의 getPassword()함수로 비교해서 동일하면
		// Authentication 객체를 만들어서 필터체인으로 리턴해준다.
		
		// Tip: 인증 프로바이더의 디폴트 서비스는 UserDetailsService 타입
		// Tip: 인증 프로바이더의 디폴트 암호화 방식은 BCryptPasswordEncoder
		// 결론은 인증 프로바이더에게 알려줄 필요가 없음.
		Authentication authentication = 
				authenticationManager.authenticate(authenticationToken);
		
//		System.out.println("authenticationManager : 성공");
		
		PrincipalDetails principalDetailis = (PrincipalDetails) authentication.getPrincipal();
//		System.out.println("Authentication : "+principalDetailis.getUserVO().getId());
		return authentication;
	}

	
	// JWT Token 생성해서 response에 담아주기
	@Override
	protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
			Authentication authResult) throws IOException, ServletException {
//		System.out.println("successfulAuthentication메소드 진입");
		PrincipalDetails principalDetailis = (PrincipalDetails) authResult.getPrincipal();
		
		String jwtToken = JWT.create()
				.withSubject(principalDetailis.getUsername())
				.withExpiresAt(new Date(System.currentTimeMillis()+JwtProperties.EXPIRATION_TIME))
				.withClaim("id", principalDetailis.getUserVO().getId())
				.withClaim("name", principalDetailis.getUserVO().getName())
				.sign(Algorithm.HMAC512(JwtProperties.SECRET));
		System.out.println("principalDetailis.getUsername() : " + principalDetailis.getUsername());
		response.addHeader(JwtProperties.HEADER_STRING, JwtProperties.TOKEN_PREFIX+jwtToken);
	}
	
}