package com.lhsk.iam.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.filter.CorsFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
	
    
	private final CorsFilter corsFilter;
//	private final UserRepository userRepository;
	
	// 패스워드 인코더 bean등록
	@Bean
	public PasswordEncoder passwordEncoder() {
	    return new BCryptPasswordEncoder();
	}
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//        http.csrf().disable();
        http.cors().and()
        .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        .and()
        .addFilter(corsFilter)
		.formLogin().disable()
		.httpBasic().disable()
        .authorizeRequests()
        .antMatchers("/user/**").authenticated()
        .antMatchers("/manager/**").access("hasAnyRole('ROLE_MANAGER','ROLE_ADMIN')")
        .antMatchers("/admin/**").access("hasRole('ROLE_ADMIN')")
        .anyRequest().permitAll();

        return http.build();
    }
	
	
    // 시큐리티 필터 체인이 가장 먼저 실행된다.
//    @Override
//    protected void configure(HttpSecurity http) throws Exception {
//    	
//    	
////		http.addFilterBefore(new MyFilter1(), SecurityContextPersistenceFilter.class);
//    	
//		// rest api이므로 csrf 보안이 필요없으므로 disable처리.
//    	// html tag 를 통한 공격  ( api 서버 이용시 disable() )
//		http.csrf().disable();	
//		// 세션을 사용하지 않겠다
//		http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
//		.and()
//		// 모든 요청에 필터를 넣는다. @CrossOrigin(인증X), 시큐리티 필터에 등록 인증(O)
//		.addFilter(corsFilter)
//		.formLogin().disable()   // 기본 폼을 쓰지 않음
//		// 기본 인증 로그인을 이용하지 않기 위해
//		.httpBasic().disable()
////		.addFilter(new JwtAuthenticationFilter(authenticationManager()))   // AuthenticationManager
////		.addFilter(new JwtAuthorizationFilter(authenticationManager(), userRepository))   // AuthenticationManager
//		
//		// 각 경로 path 별 권한 처리
//		.authorizeRequests()
////		.antMatchers("/api/v1/user/**")
////		.access("hasRole('ROLE_USER') or hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
////		.antMatchers("/api/v1/manager/**")
////		.access("hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
////		.antMatchers("/api/v1/admin/**")
////		.access("hasRole('ROLE_ADMIN')")
//		.anyRequest().permitAll();
//		
//    }
}