package com.lhsk.iam.global.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
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
import com.lhsk.iam.global.config.jwt.JwtAuthenticationFilter;
import com.lhsk.iam.global.config.jwt.JwtAuthorizationFilter;

@Configuration
@EnableWebSecurity // 시큐리티 활성화 -> 기본 스프링 필터체인에 등록
//@RequiredArgsConstructor
public class SecurityConfig {	
//	private final CustomAuthenticationProvider customAuthenticationProvider;
	
	@Autowired
	private LoginMapper loginMapper;	
	@Autowired
	private Environment env;
	
	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
		return authenticationConfiguration.getAuthenticationManager();
	}
	
//	@Bean
//    public AuthenticationManager authenticationManager() {
//        return new ProviderManager(Collections.singletonList(customAuthenticationProvider));
//    }

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
				.authorizeRequests(authroize -> authroize.antMatchers("/users/**")
						.access("hasRole('ROLE_USER') or hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
						.antMatchers("/manager/**")
						.access("hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
						.antMatchers("/admin/**")
						.access("hasRole('ROLE_ADMIN')")
						.antMatchers("/accounts/**")
						.access("hasRole('ROLE_USER') or hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
						.anyRequest().permitAll());

		return http.build();
	}

	public class MyCustomDsl extends AbstractHttpConfigurer<MyCustomDsl, HttpSecurity> {
		@Override
		public void configure(HttpSecurity http) throws Exception {
		    AuthenticationManager authenticationManager = http.getSharedObject(AuthenticationManager.class);
		    http
		            .addFilter(corsConfig.corsFilter())
		            .addFilter(new JwtAuthenticationFilter(authenticationManager, env))
		            .addFilter(new JwtAuthorizationFilter(authenticationManager, loginMapper, env));
		}
	}

}