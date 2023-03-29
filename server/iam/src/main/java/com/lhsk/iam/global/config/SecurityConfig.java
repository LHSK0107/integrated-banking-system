package com.lhsk.iam.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.filter.CorsFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig extends WebSecurityConfigurerAdapter {
   
//   private final CorsFilter corsFilter;
//   private final UserRepository userRepository;
   // 패스워드 인코더 bean등록
   @Bean
   public BCryptPasswordEncoder passwordEncoder()
   {
       return new BCryptPasswordEncoder();
   }
   
   
   // 시큐리티 필터 체인이 가장 먼저 실행된다.
   @Override
   protected void configure(HttpSecurity http) throws Exception {
//      http.addFilterBefore(new MyFilter1(), SecurityContextPersistenceFilter.class);
      http.csrf().disable();
      http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)   // 세션을 사용하지 않겠다
      .and()
//      .addFilter(corsFilter)   // 모든 요청에 필터를 넣는다. @CrossOrigin(인증X), 시큐리티 필터에 등록 인증(O)
//      .formLogin().disable()   // 
//      .httpBasic().disable()
//      .addFilter(new JwtAuthenticationFilter(authenticationManager()))   // AuthenticationManager
//      .addFilter(new JwtAuthorizationFilter(authenticationManager(), userRepository))   // AuthenticationManager
      .authorizeRequests()
//      .antMatchers("/api/v1/user/**")
//      .access("hasRole('ROLE_USER') or hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
//      .antMatchers("/api/v1/manager/**")
//      .access("hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
//      .antMatchers("/api/v1/admin/**")
//      .access("hasRole('ROLE_ADMIN')")
      .anyRequest().permitAll();
      
   }
}