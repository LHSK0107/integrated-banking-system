package com.lhsk.iam;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan(basePackages =  "com.lhsk.iam.domain.user.model.mapper")
public class IamApplication {

	public static void main(String[] args) {
		SpringApplication.run(IamApplication.class, args);
	}

}
