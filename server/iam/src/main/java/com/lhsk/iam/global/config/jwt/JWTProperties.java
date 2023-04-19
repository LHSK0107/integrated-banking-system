package com.lhsk.iam.global.config.jwt;

public interface JWTProperties {
   final String SECRET = "cos";
   final long EXPIRATION_TIME = 180000000;
   final String TOKEN_PREFIX = "Bearer ";
   final String HEADER_STRING = "Authorization";
   
}