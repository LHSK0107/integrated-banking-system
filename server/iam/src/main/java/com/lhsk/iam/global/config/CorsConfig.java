package com.lhsk.iam.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

	@Bean
	public CorsFilter corsFilter() {
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		CorsConfiguration config = new CorsConfiguration();
		// 내 서버가 응답을 할 때 json을 자바스크립트에서 처리할 수 있게 할 지를 설정
		config.setAllowCredentials(true);	
		// 모든 ip에 응답을 허용하겠다.
		config.addAllowedOrigin("https://lhskbank.netlify.app");
//		config.addAllowedOrigin("https://localhost:3000");
//		config.addAllowedOriginPattern("*");
		// 모든 header에 응답을 허용하겠다.
		config.addAllowedHeader("*");
		// 
		config.setAllowCredentials(true);
		// 모든 post,get,put,delete,patch 요청을 허용하겠다.
		config.addAllowedMethod("*");
		source.registerCorsConfiguration("/**", config);
		return new CorsFilter(source);
	}
}
