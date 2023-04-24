package com.lhsk.iam.global.config.jwt;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.core.env.Environment;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.lhsk.iam.domain.user.model.mapper.LoginMapper;
import com.lhsk.iam.domain.user.model.vo.UserVO;
import com.lhsk.iam.global.config.auth.PrincipalDetails;

public class JwtAuthorizationFilter extends BasicAuthenticationFilter{
	
	private LoginMapper loginMapper;
	
	private String SECRET;
	private long EXPIRATION_TIME;
	private String TOKEN_PREFIX;
	private String HEADER_STRING;
	
	
	public JwtAuthorizationFilter(AuthenticationManager authenticationManager, LoginMapper loginMapper, Environment env) {
		super(authenticationManager);
		this.loginMapper = loginMapper;
		this.SECRET = env.getProperty("jwt.secret");
	    this.EXPIRATION_TIME = Long.parseLong(env.getProperty("jwt.expirationTime"));
	    this.TOKEN_PREFIX = env.getProperty("jwt.tokenPrefix");
	    this.HEADER_STRING = env.getProperty("jwt.headerString");
	}
	
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
			throws IOException, ServletException {
		
		String jwtHeader = request.getHeader("Authorization");
		
		// header가 있는지 확인
		if(jwtHeader == null || !jwtHeader.startsWith(TOKEN_PREFIX)) {
			chain.doFilter(request, response);
			return;
		}
		
		// JWT토큰을 검증해서 정상적인 사용자인지 확인
		
		// 토큰 검증 (이게 인증이기 때문에 AuthenticationManager도 필요 없음)
		// 내가 SecurityContext에 직접접근해서 세션을 만들때 자동으로 UserDetailsService에 있는
		// loadByUsername이 호출됨.
		String jwtToken = request.getHeader(HEADER_STRING).replace(TOKEN_PREFIX, "");
		System.out.println("jwtToken : "+jwtToken);
		String id = 
				JWT.require(Algorithm.HMAC512(SECRET)).build().verify(jwtToken).getClaim("id").asString();
		System.out.println("id : "+id);
		// 서명이 정상적으로 됨
		if(id != null) {
			
			UserVO userEntity = loginMapper.findUserById(id);
			
			PrincipalDetails principalDetails = new PrincipalDetails(userEntity);
			
			// 인증은 토큰 검증시 끝. 인증을 하기 위해서가 아닌 스프링 시큐리티가 수행해주는 권한 처리를 위해
			// 아래와 같이 토큰을 만들어서 Authentication 객체를 강제로 만들고 그걸 세션에 저장!
			
			// JWT토큰 서명을 통해서 서명이 정상이면 Authentication 객체를 만들어준다.
			Authentication authentication = 
					new UsernamePasswordAuthenticationToken(
							principalDetails, // 나중에 컨트롤러에서 DI해서 쓸 때 사용하기 편함.
							null, // 패스워드는 모르니까 null 처리, 어차피 지금 인증하는게 아니니까!!  -> ?...
							principalDetails.getAuthorities());
			
			// 강제로 시큐리티의 세션에 접근하여 Authentication 객체를 저장
			SecurityContextHolder.getContext().setAuthentication(authentication);
		}
		
		chain.doFilter(request, response);
	}
}
