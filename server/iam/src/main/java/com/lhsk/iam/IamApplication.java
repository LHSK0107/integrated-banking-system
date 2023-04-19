package com.lhsk.iam;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@MapperScan(basePackages = {"com.lhsk.iam.domain.user.model.mapper","com.lhsk.iam.domain.account.model.mapper"})
@EnableScheduling
public class IamApplication {

   
   public static void main(String[] args) {
//      LogbackConfig.configure();
      SpringApplication.run(IamApplication.class, args);
   }

}