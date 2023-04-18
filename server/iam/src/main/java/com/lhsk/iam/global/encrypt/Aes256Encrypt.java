package com.lhsk.iam.global.encrypt;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;

public class Aes256Encrypt {
	
    private static final String ENCRYPTION_ALGORITHM = "AES";
    private static final String KEY_ALGORITHM = "AES";
    private static final String CIPHER_TRANSFORMATION = "AES/ECB/PKCS5Padding";

    // AES256 암호화를 위한 키 생성 메소드(암호화, 복호화에 모두 사용)
    public static SecretKey generateAES256Key() throws NoSuchAlgorithmException {
        KeyGenerator keyGenerator = KeyGenerator.getInstance(KEY_ALGORITHM);
        SecureRandom secureRandom = new SecureRandom();
        keyGenerator.init(256, secureRandom);
        return keyGenerator.generateKey();
    }

    // AES256 암호화 메소드
    public static String encryptAES256(String plainText, SecretKey key) throws Exception {
        Cipher cipher = Cipher.getInstance(CIPHER_TRANSFORMATION);
        cipher.init(Cipher.ENCRYPT_MODE, key);
        byte[] encryptedBytes = cipher.doFinal(plainText.getBytes());
        return Base64.getEncoder().encodeToString(encryptedBytes);
    }

    // AES256 복호화 메소드
    public static String decryptAES256(String encryptedText, SecretKey key) throws Exception {
        Cipher cipher = Cipher.getInstance(CIPHER_TRANSFORMATION);
        cipher.init(Cipher.DECRYPT_MODE, key);
        byte[] decodedBytes = Base64.getDecoder().decode(encryptedText);
        byte[] decryptedBytes = cipher.doFinal(decodedBytes);
        return new String(decryptedBytes);
    }

    public static void main(String[] args) {
        try {
            // 키 생성
            SecretKey key = generateAES256Key();

            // 평문
            String plainText = "암호화할 평문";

            // 암호화
            String encryptedText = encryptAES256(plainText, key);

            // 복호화
            String decryptedText = decryptAES256(encryptedText, key);

            // 결과 출력
            System.out.println("평문: " + plainText);
            System.out.println("암호문: " + encryptedText);
            System.out.println("복호문: " + decryptedText);
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
        }
    }
}
