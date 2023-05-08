package com.lhsk.iam.global.config.jwt;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lhsk.iam.domain.user.model.vo.LoginRequestVO;
import com.lhsk.iam.domain.user.service.LoginService;
import com.lhsk.iam.global.config.auth.PrincipalDetails;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter{
   
   private AuthenticationManager authenticationManager;
   private LoginService loginService;
   
   public JwtAuthenticationFilter(AuthenticationManager authenticationManager, LoginService loginService) {
       this.authenticationManager = authenticationManager;
       this.loginService = loginService;
   }
   
   // Authentication 객체 만들어서 리턴 => 의존 : AuthenticationManager
   // 인증 요청시에 실행되는 함수 => /login
   @Override
   public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
         throws AuthenticationException {
      
            
      // request에 있는 username과 password를 파싱해서 자바 Object로 받기
      ObjectMapper om = new ObjectMapper();
      LoginRequestVO loginRequestDto = null;
      try {
         loginRequestDto = om.readValue(request.getInputStream(), LoginRequestVO.class);
      } catch (Exception e) {
         e.printStackTrace(); 
      }

      log.info("입력받은 username : "+loginRequestDto.getUsername());
      log.info("입력받은 password : "+loginRequestDto.getPassword());
      
      // 유저네임패스워드 토큰 생성
      UsernamePasswordAuthenticationToken authenticationToken = 
            new UsernamePasswordAuthenticationToken(
                  loginRequestDto.getUsername(), 
                  loginRequestDto.getPassword());
      
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
      
//      PrincipalDetails principalDetailis = (PrincipalDetails) authentication.getPrincipal();
      
      return authentication;
   }

   
   // JWT Token 생성해서 response에 담아주기
   @Override
   protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
         Authentication authResult) throws IOException, ServletException {
	   log.debug("call successful login");
	   loginService.processSuccessfulAuthentication(request, response, authResult);
   }
   
   // 로그인 실패시 상태코드와 응답 메시지를 담아준다.
   @Override
   protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                              AuthenticationException failed) throws IOException, ServletException {
       response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // HTTP 응답 코드 401 Unauthorized 설정
       response.setContentType("application/json;charset=UTF-8"); // 응답 데이터 타입 설정
       String message;
       if (failed instanceof UsernameNotFoundException) {
           message = "아이디가 존재하지 않습니다.";
       } else if (failed instanceof BadCredentialsException) {
           message = "비밀번호가 잘못 입력되었습니다.";
       } else {
           message = "아이디가 존재하지 않습니다.";
       }

       response.getWriter().write("{\"message\":\"" + message + "\"}"); // 실패 메시지 반환
   }
   
}