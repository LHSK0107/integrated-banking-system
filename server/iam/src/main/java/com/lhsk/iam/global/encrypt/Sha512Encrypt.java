package com.lhsk.iam.global.encrypt;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

/*
	MessageDigest 클래스
		- Java에서 암호화를 위해 사용되는 클래스 중 하나 
		- SHA-1, SHA-256, SHA-512, MD5 등 다양한 암호화 알고리즘을 지원함
		- 입력 데이터를 바이트 단위로 받아들이고, 지정된 알고리즘에 따라 입력 데이터를 해시값으로 변환함
	StringBuilder 클래스
		- 문자열을 더할 때 사용하는 클래스 
		- 문자열을 더하는 과정에서 매번 새로운 문자열을 생성하는 것이 아니라, 기존 문자열에 새로운 문자열을 추가하면서 문자열을 생성함
		- 이러한 방식으로 문자열을 생성하면, 메모리 사용량이 감소하고 속도가 빨라짐 
*/
public class Sha512Encrypt {
	private static final int SALT_LENGTH = 32;
	
	// salt 생성
	public static String generateSalt() {
		SecureRandom secureRandom = new SecureRandom();
		byte[] salt = new byte[SALT_LENGTH];
		secureRandom.nextBytes(salt);
		return Base64.getEncoder().encodeToString(salt);
	}
	
	// 회원가입 시, password를 암호화 해주는 메서드 (해당 알고리즘이 지원되지 않는 환경에서 exception 발생)
	public static String hash(String password) throws NoSuchAlgorithmException {
		// MessageDigest 클래스를 이용해 SHA512 알고리즘 인스턴스를 호출
	    MessageDigest messageDigest = MessageDigest.getInstance("SHA-512");
	    // generateSalt() 메서드를 호출해 salt 값을 받아옴
	    String saltString = generateSalt();
	    String saltedPassword = saltString+password;
	    // password를 UTF-8로 인코딩 → getByte() 메서드로 바이트 배열로 반환 → digest() 메서드로 해시 처리
	    byte[] hash = messageDigest.digest(saltedPassword.getBytes(StandardCharsets.UTF_8));
	    // hash된 길이(byte)의 2배 크기로 문자열 버퍼 할당 (hash.length = 64)
	    StringBuilder hexString = new StringBuilder(2 * hash.length);
	    // 16진수 문자열로 변환 
	    hexString.append(saltString);	// salt 문자열을 앞에 추가
	    for (byte b : hash) {
	    	// b를 8bit로 표현하고 오른쪽 8bit만 남게됨(부호 비트를 제외함)
	    	String hex = Integer.toHexString(0xff & b);	// 0xff = 255, 부호 비트가 모두 0
	    	// hex가 한 자리일때 앞에 0을 붙여 두 자리로 만듦
	    	if (hex.length() == 1) {
	    		hexString.append('0');
	        }
	    	hexString.append(hex);		// 문자열 추가
	    }
	    return hexString.toString();	// 문자열 반환
	}
	
	// 로그인 시 유효성 검사를 위해 쓰이는 암호화 메서드
	public static String hashForLogin(String saltString, String password) throws NoSuchAlgorithmException {
	    MessageDigest messageDigest = MessageDigest.getInstance("SHA-512");
	    String saltedPassword = saltString+password;
	    byte[] hash = messageDigest.digest(saltedPassword.getBytes(StandardCharsets.UTF_8));
	    StringBuilder hexString = new StringBuilder(2 * hash.length);
	    hexString.append(saltString);
	    for (byte b : hash) {
	    	String hex = Integer.toHexString(0xff & b);
	    	if (hex.length() == 1) {
	    		hexString.append('0');
	        }
	    	hexString.append(hex);
	    }
	    return hexString.toString();
	}

}
