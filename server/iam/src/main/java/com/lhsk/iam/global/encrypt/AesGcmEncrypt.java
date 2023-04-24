package com.lhsk.iam.global.encrypt;

import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.util.Base64;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;

/*
 	AES-GCM(Galois/Counter Mode)
		1. 특징
 			- CBC의 bit-flipping attack에 대한 보안 취약점을 보완한 방법
 			- 데이터 값의 Hash 가 암호문에 포함 → 데이터 복호화 시 변조 확인 가능
 			- 병렬 처리 가능
 		2. 필요한 요소
 			- 암호화할 데이터
 			- 대칭 key
 			- IV(Initial Vector) : 무작위 생성 & 각 암호화 작업마다 고유해야 함
 	
	GCMParameterSpec(int tLen, byte[] src)
		 - GCM를 사용할 때 암호화 및 복호화에 필요한 매개변수를 지정하는 데 사용
		 - 매개 변수
		 	1. int tLen
		 		- 인증 태그(Authentication Tag) 길이를 비트 단위로 나타냄 
		 		- 일반적으로 128 비트 (16 바이트)를 사용하지만, 경우에 따라 다른 길이를 사용할 수도 있다
			2. byte[] src 
		 		- IV (초기 벡터)를 바이트 배열로 나타냄
		 		- 각 암호화 작업에 고유한 값이어야 함
*/

public class AesGcmEncrypt {
    
    private static final int GCM_IV_LENGTH = 12; 	// IV(초기 벡터) 길이 - byte 단위 (권고 길이가 96bit이므로)
    private static final int GCM_TAG_LENGTH = 16; 	// 인증 태그 길이 - byte 단위

    
	// 암호화 메서드
    public String encrypt(String plaintext, String key, byte[] iv) throws GeneralSecurityException {
    	// 주어진 비밀키(key)를 바이트 배열로 변환
        byte[] secretKeyBytes = key.getBytes(StandardCharsets.UTF_8);
        // secretKeyBytes로 SecretKeySpec 객체 생성
        SecretKey secretKey = new SecretKeySpec(secretKeyBytes, "AES"); //  비밀키를 만들어 줌
        
        // AES-GCM으로 Cipher 객체를 초기화
        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");		// AES-GCM은 padding이 필요 없음
        
        // GCMParameterSpec을 사용하여 IV와 인증 태그 길이를 설정
        GCMParameterSpec gcmParameterSpec = new GCMParameterSpec(GCM_TAG_LENGTH * 8, iv);	// bit 단위로 변환하기 위해 8을 곱함
        
        // Cipher 객체 초기화
        cipher.init(Cipher.ENCRYPT_MODE, secretKey, gcmParameterSpec);	// 암호화 모드, 대칭 키, GCM에 필요한 매개변수 전달
        // 암호화 수행
        byte[] cipherText = cipher.doFinal(plaintext.getBytes());		// 평문을 byte[]로 변환하여 암호화함

        // IV와 암호문을 저장할 ByteBuffer 생성
        ByteBuffer byteBuffer = ByteBuffer.allocate(iv.length + cipherText.length);	// 전체 길이 = IV + 암호문 길이
        byteBuffer.put(iv);				// 복호화 과정에서 필요하므로 암호문과 함께 전달
        byteBuffer.put(cipherText);		// byteBuffer에는 초기벡터 - 암호문 순으로 저장되어 있음

        // IV + 암호문을 Base64 인코딩하여 반환
        return Base64.getEncoder().encodeToString(byteBuffer.array());
    }

    // 복호화 메서드
    public String decrypt(String cipherTextWithIv, String key) throws GeneralSecurityException {
    	// 비밀키 생성
        byte[] secretKeyBytes = key.getBytes(StandardCharsets.UTF_8);
        SecretKey secretKey = new SecretKeySpec(secretKeyBytes, "AES");

        // Base64로 인코딩된 값을 다시 디코딩
        byte[] decoded = Base64.getDecoder().decode(cipherTextWithIv);

        // 디코딩 된 값을 ByteBuffer 형태로 저장
        ByteBuffer byteBuffer = ByteBuffer.wrap(decoded);
        
        // IV와 암호문을 담을 변수 선언
        byte[] iv = new byte[GCM_IV_LENGTH];
        byte[] cipherText = new byte[byteBuffer.remaining() - GCM_IV_LENGTH];	// ByteBuffer 길이 = IV 길이 + 암호문 길이
        // IV와 암호문을 순서대로 추출
        byteBuffer.get(iv);
        byteBuffer.get(cipherText);

        // GCMParameterSpec을 사용하여 IV와 인증 태그 길이를 설정
        GCMParameterSpec spec = new GCMParameterSpec(GCM_TAG_LENGTH * 8, iv);
        
        // Cipher 객체 초기화
        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        cipher.init(Cipher.DECRYPT_MODE, secretKey, spec);			// 복호화 모드, 대칭 키, GCM에 필요한 매개변수 전달

        // 복호화 한 평문을 String 형태로 반환 
        return new String(cipher.doFinal(cipherText));
    }
        
}
