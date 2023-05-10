package com.lhsk.iam.global.config;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import com.lhsk.iam.domain.user.model.mapper.LoginMapper;
import com.lhsk.iam.domain.user.service.LoginService;
import com.lhsk.iam.global.config.jwt.JwtAuthenticationFilter;
import com.lhsk.iam.global.config.jwt.JwtAuthorizationFilter;
import com.lhsk.iam.global.config.jwt.JwtTokenProvider;

@Configuration
@EnableWebSecurity // 시큐리티 활성화 -> 기본 스프링 필터체인에 등록
public class SecurityConfig {	
	
	@Autowired
	private LoginMapper loginMapper;	
	@Autowired
	private JwtTokenProvider jwtTokenProvider;
	@Autowired
	private JwtConfig jwtConfig;
	@Autowired
	private LoginService loginService;
	
    @Value("${aes.secret}")
    private String key;
    @Value("${aes.iv}")
    private String ivString;
	
	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
		return authenticationConfiguration.getAuthenticationManager();
	}
	

	@Autowired
	private CorsConfig corsConfig;
	
	
	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
	

	@Bean
	SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http
				.csrf().disable()
				.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
				.and()
				.formLogin().disable()
				.httpBasic().disable()
				.apply(new MyCustomDsl()) // 커스텀 필터 등록
				.and()
				.logout(logout -> logout
	                    .logoutSuccessHandler((request, response, authentication) -> {
	                        response.setStatus(HttpServletResponse.SC_OK);
	                    })
	            )
				.authorizeRequests(authroize -> authroize.antMatchers("/api/users/**") 
						.access("hasRole('ROLE_USER') or hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
						.antMatchers("/api/manager/**")
						.access("hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
						.antMatchers("/api/admin/**")
						.access("hasRole('ROLE_ADMIN')")
						.anyRequest().permitAll());

		return http.build();
	}

	public class MyCustomDsl extends AbstractHttpConfigurer<MyCustomDsl, HttpSecurity> {
		@Override
		public void configure(HttpSecurity http) throws Exception {
		    AuthenticationManager authenticationManager = http.getSharedObject(AuthenticationManager.class);
		    http
		            .addFilter(corsConfig.corsFilter())
		            .addFilter(new JwtAuthenticationFilter(authenticationManager, loginService))
		            .addFilter(new JwtAuthorizationFilter(authenticationManager, loginMapper, jwtConfig, jwtTokenProvider));
		}
	}

}