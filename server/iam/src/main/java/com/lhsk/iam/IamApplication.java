package com.lhsk.iam;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.lhsk.iam.global.config.LogbackConfig;

@SpringBootApplication
@MapperScan(basePackages = {"com.lhsk.iam.domain.user.model.mapper","com.lhsk.iam.domain.account.model.mapper"})
@EnableScheduling
public class IamApplication {

	// 비밀번호 인코딩 bean 등록
    @Bean
    BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
	
	public static void main(String[] args) {
//		LogbackConfig.configure();
		SpringApplication.run(IamApplication.class, args);
	}

}
