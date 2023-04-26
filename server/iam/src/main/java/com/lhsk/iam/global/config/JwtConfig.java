package com.lhsk.iam.global.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Getter;
import lombok.Setter;

@Configuration
@ConfigurationProperties(prefix = "jwt")
@Getter
@Setter
public class JwtConfig {
	private String secret;
    private long expirationTime;
    private String tokenPrefix;
    private String headerString;
    private long refreshExpirationTime;
}
