package com.lhsk.iam.global.config.jwt;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.time.LocalDateTime;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.encrypt.AesBytesEncryptor;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lhsk.iam.domain.user.model.mapper.LoginMapper;
import com.lhsk.iam.domain.user.model.vo.LoginHistoryVO;
import com.lhsk.iam.domain.user.model.vo.LoginRequestVO;
import com.lhsk.iam.domain.user.model.vo.UserVO;
import com.lhsk.iam.domain.user.service.UserService;
import com.lhsk.iam.global.config.JwtConfig;
import com.lhsk.iam.global.config.auth.PrincipalDetails;
import com.lhsk.iam.global.encrypt.AesGcmEncrypt;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter{
   
   private AuthenticationManager authenticationManager;
   private JwtTokenProvider jwtTokenProvider;
   private JwtConfig jwtConfig;
   private LoginMapper loginMapper;
   private String key;
   private String ivString;
   
   public JwtAuthenticationFilter(AuthenticationManager authenticationManager,
		    LoginMapper loginMapper, JwtConfig jwtConfig, JwtTokenProvider jwtTokenProvider, String key, String ivString) {
       this.authenticationManager = authenticationManager;
       this.loginMapper = loginMapper;
       this.jwtTokenProvider = jwtTokenProvider;
       this.jwtConfig = jwtConfig;
       this.key = key;
       this.ivString = ivString;
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
      
      PrincipalDetails principalDetailis = (PrincipalDetails) authentication.getPrincipal();
      
      return authentication;
   }

   
   // JWT Token 생성해서 response에 담아주기
   @Override
   protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
         Authentication authResult) throws IOException, ServletException {
	   
       PrincipalDetails principalDetailis = (PrincipalDetails) authResult.getPrincipal();
       String accessToken = jwtTokenProvider.createAccessToken(authResult);
       String refreshToken = jwtTokenProvider.createRefreshToken(authResult);
 
       // 리프레시 토큰 발급(쿠키)
       Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
       refreshTokenCookie.setHttpOnly(true);			// JS로 쿠키접근 불가능
       refreshTokenCookie.setPath("/");	// 프론트가 쿠키를 서버측으로 전송할때, 특정 url로 요청할 경우에만 전송가능
       refreshTokenCookie.setMaxAge(60 * 30); 			// 30 min
       
//       refreshTokenCookie.setSecure(true);			// https에서만 전송되도록 설정
       response.addCookie(refreshTokenCookie);
       
       // 액세스 토큰 발급(헤더)
       response.addHeader(jwtConfig.getHeaderString(), jwtConfig.getTokenPrefix()+accessToken);
       response.addHeader("Access-Control-Expose-Headers", jwtConfig.getHeaderString());
       
       // 로그인 기록 저장
       UserVO user = principalDetailis.getUserVO();
       AesGcmEncrypt aesGcmEncrypt = new AesGcmEncrypt();
       byte[] iv = new byte[12];
       String[] ivStringArray = ivString.split(", ");
		// String[] -> byte[]로 번환
		for (int i = 0; i < iv.length; i++) {
		    iv[i] = Byte.parseByte(ivStringArray[i]);
		}
       
       LoginHistoryVO vo = null;
	try {
		vo = LoginHistoryVO.builder()
				   .userNo(user.getUserNo())
				   .dept(user.getDept())
				   .name(aesGcmEncrypt.encrypt(user.getName(), key, iv))
				   .email(aesGcmEncrypt.encrypt(user.getEmail(), key, iv))
				   .loginDt(LocalDateTime.now())
				   .build();
	} catch (GeneralSecurityException e) {
		e.printStackTrace();
	}
       System.out.println("dt : "+vo.getLoginDt());
       System.out.println("dept : "+vo.getDept());
       loginMapper.insertLoginHistory(vo);
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