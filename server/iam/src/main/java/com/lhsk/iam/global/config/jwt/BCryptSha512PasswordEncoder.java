package com.lhsk.iam.global.config.jwt;

import java.security.NoSuchAlgorithmException;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.lhsk.iam.global.encrypt.Sha512Encrypt;

public class BCryptSha512PasswordEncoder implements PasswordEncoder {
	/*
	 *  비밀번호를 인코딩하는 과정
	 *  여기서 암호화를 진행하면 된다.(?)
	 */
	private final BCryptPasswordEncoder bCryptPasswordEncoder;
	
	public BCryptSha512PasswordEncoder() {
        this.bCryptPasswordEncoder = new BCryptPasswordEncoder();
    }
	
	// 입력받은 평문 비밀번호를 BCrypt로 선 암호화후, Sha512로 추가 암호화된 문자열로 반환
	@Override
	public String encode(CharSequence rawPassword) {
		System.out.println("PasswordEncoder encode_raw : " + rawPassword);
		// 먼저 BCrypt로 인코딩 진행
		String bcryptHashed = bCryptPasswordEncoder.encode(rawPassword);
		try {
            return Sha512Encrypt.hash(bcryptHashed);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error hashing password", e);
        }
	}

	/*
	 * 	입력받은 비밀번호를 암호화한 이후 DB의 암호화된 비밀번호와 비교하여 일치여부를 반환
	 * 
	 *  encodedPassword는 DB에서 유저정보를 조회하여 가져온 값
	 *	PrincipalDetailsService에서 loadUserByUsername()으로 사용자 정보를 조회하고,
	 *	PrincialDetails를 반환한다. 그 후에 PrincialDetails에서 getPassword()를 통해
	 *	DB에 저장되어있던 비밀번호를 그대로 가져온다. 이때, 비밀번호는 salt + sha512로 암호화된 비밀번호다.
	 *	=============================================================================
	 *	이하 DB에 저장된 비밀번호에 포함되어있는 salt를 DBsalt라 부르겠다. 
	 *	따라서 우리는 encodedPassword에서 DBsalt값을 따로 떼어내고 -> String dbSalt를 따로 저장
	 *	hashForLogin(DBSalt, rawPassword)을 통해 해싱작업을 진행한다. 이 결과값을 rawSha라 부르겠다.
	 *	로그인 시 비밀번호의 일치여부는 rawSha.equals(encodedPassword)의 결과를 따른다.
	 */
	@Override
	public boolean matches(CharSequence rawPassword, String encodedPassword) {
		System.out.println("PasswordEncoder matches_raw : " + rawPassword);
		// 평문 bcrypt 진행
//		String bcryptHashed = bCryptPasswordEncoder.encode(rawPassword);
//		System.out.println("PasswordEncoder matches_raw_bcrypt : " + bcryptHashed);
		
		// salt만 따로 떼어내기
		String[] tokenParts = encodedPassword.split("=");
		String dbSalt = tokenParts[0] + "=";
		System.out.println("dbSalt : "+dbSalt);
		
        try {
            String sha512Hashed = Sha512Encrypt.hashForLogin(dbSalt, rawPassword+"");
            System.out.println("입력 비밀번호 : " + sha512Hashed);
            System.out.println("DB 비밀번호 : " + encodedPassword);
            return sha512Hashed.equals(encodedPassword);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error hashing password", e);
        }
	}
}
