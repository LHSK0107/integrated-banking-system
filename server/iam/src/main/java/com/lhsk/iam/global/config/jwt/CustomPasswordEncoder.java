package com.lhsk.iam.global.config.jwt;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class CustomPasswordEncoder implements PasswordEncoder {
	/*
	 *  비밀번호를 인코딩하는 과정
	 *  여기서 암호화를 진행하면 된다.(?)
	 */
	
	// 입력받은 평문 비밀번호를 암호화된 문자열로 반환
	@Override
	public String encode(CharSequence rawPassword) {
	    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
	    return encoder.encode(rawPassword);
	}

	// 입력받은 평문 비밀번호와 암호화된 비밀번호를 비교하여 일치 여부를 반환
	@Override
	public boolean matches(CharSequence rawPassword, String encodedPassword) {
	    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
	    return encoder.matches(rawPassword, encodedPassword);
	}
}
