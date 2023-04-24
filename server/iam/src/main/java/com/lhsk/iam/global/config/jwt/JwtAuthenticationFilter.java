package com.lhsk.iam.global.config.jwt;

import java.io.IOException;
import java.util.Date;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.core.env.Environment;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lhsk.iam.domain.user.model.vo.LoginRequestVO;
import com.lhsk.iam.global.config.auth.PrincipalDetails;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter{
   
   private AuthenticationManager authenticationManager;
   
   public JwtAuthenticationFilter(AuthenticationManager authenticationManager, 
                           Environment env) {
       this.authenticationManager = authenticationManager;
       this.SECRET = env.getProperty("jwt.secret");
       this.EXPIRATION_TIME = Long.parseLong(env.getProperty("jwt.expirationTime"));
       this.TOKEN_PREFIX = env.getProperty("jwt.tokenPrefix");
       this.HEADER_STRING = env.getProperty("jwt.headerString");
   }
   
   
   private String SECRET;
   private long EXPIRATION_TIME;
   private String TOKEN_PREFIX;
   private String HEADER_STRING;
   
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

      System.out.println("입력받은 username : "+loginRequestDto.getUsername());
      System.out.println("입력받은 password : "+loginRequestDto.getPassword());

      
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
      
      PrincipalDetails principalDetailis = (PrincipalDetails) authentication.getPrincipal();
      
      return authentication;
   }

   
   // JWT Token 생성해서 response에 담아주기
   @Override
   protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
         Authentication authResult) throws IOException, ServletException {
      PrincipalDetails principalDetailis = (PrincipalDetails) authResult.getPrincipal();
      
//      System.out.println("SECRET : " + SECRET);
//      System.out.println("EXPIRATION_TIME : " + EXPIRATION_TIME);
      
      String jwtToken = JWT.create()
            .withSubject(principalDetailis.getUsername())
            .withExpiresAt(new Date(System.currentTimeMillis()+EXPIRATION_TIME))
            .withClaim("id", principalDetailis.getUserVO().getId())
            .withClaim("name", principalDetailis.getUserVO().getName())
            .withClaim("expirationTime", new Date(System.currentTimeMillis()+EXPIRATION_TIME))
            .withClaim("userCode", principalDetailis.getUserVO().getUserCodeList().get(0))
            .withClaim("userNo", principalDetailis.getUserVO().getUserNo())
            .sign(Algorithm.HMAC512(SECRET));
//      System.out.println("principalDetailis.getId() : " + principalDetailis.getUserVO().getId());
//      System.out.println("principalDetailis.getName() : " + principalDetailis.getUserVO().getName());
//      System.out.println("principalDetailis.getUserCodeList() : " + principalDetailis.getUserVO().getUserCodeList());
//      System.out.println("principalDetailis.getUserNo() : " + principalDetailis.getUserVO().getUserNo());
      response.addHeader(HEADER_STRING, TOKEN_PREFIX+jwtToken);
      response.addHeader("Access-Control-Expose-Headers", HEADER_STRING);
   }
   
   // 로그인 실패시 상태코드와 응답 메시지를 담아준다.
   @Override
   protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                               AuthenticationException failed) throws IOException, ServletException {
       response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // HTTP 응답 코드 401 Unauthorized 설정
       response.setContentType("application/json;charset=UTF-8"); // 응답 데이터 타입 설정
       response.getWriter().write("{\"message\":\"아이디 또는 비밀번호가 잘못 입력되었습니다.\"}"); // 실패 메시지 반환
   }
   
}