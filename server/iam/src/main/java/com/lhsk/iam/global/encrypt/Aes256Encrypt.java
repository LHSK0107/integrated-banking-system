package com.lhsk.iam.global.encrypt;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

public class Aes256Encrypt {
	
    private static final String KEY_ALGORITHM = "AES";
    private static final String CIPHER_TRANSFORMATION = "AES/CBC/PKCS5Padding";

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

class AesUtil {
    
    public static String encrypt(String plainText, String secretKey) throws Exception {
        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        SecretKeySpec keySpec = new SecretKeySpec(secretKey.getBytes("UTF-8"), "AES");
        IvParameterSpec ivSpec = new IvParameterSpec(secretKey.getBytes("UTF-8"));

        cipher.init(Cipher.ENCRYPT_MODE, keySpec, ivSpec);

        byte[] encrypted = cipher.doFinal(plainText.getBytes("UTF-8"));
        return Base64.getEncoder().encodeToString(encrypted);
    }
    
    public static String decrypt(String cipherText, String secretKey) throws Exception {
        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        SecretKeySpec keySpec = new SecretKeySpec(secretKey.getBytes("UTF-8"), "AES");
        IvParameterSpec ivSpec = new IvParameterSpec(secretKey.getBytes("UTF-8"));

        cipher.init(Cipher.DECRYPT_MODE, keySpec, ivSpec);

        byte[] decoded = Base64.getDecoder().decode(cipherText);
        byte[] decrypted = cipher.doFinal(decoded);
        return new String(decrypted, "UTF-8");
    }

}

class AesUtil2 {

    private static final String CIPHER_ALGORITHM = "AES";
    private static final String CIPHER_TRANSFORMATION = "AES/CBC/PKCS5Padding";
    private static final int KEY_SIZE = 256;
    private static final String CHARSET = "UTF-8";

    public static String encrypt(String plaintext, String key, String iv) throws Exception {
        byte[] keyBytes = key.getBytes(CHARSET);
        byte[] ivBytes = iv.getBytes(CHARSET);
        byte[] plaintextBytes = plaintext.getBytes(CHARSET);

        SecretKeySpec secretKeySpec = new SecretKeySpec(keyBytes, CIPHER_ALGORITHM);
        IvParameterSpec ivParameterSpec = new IvParameterSpec(ivBytes);

        Cipher cipher = Cipher.getInstance(CIPHER_TRANSFORMATION);
        cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec, ivParameterSpec);

        byte[] encrypted = cipher.doFinal(plaintextBytes);
        return Base64.getEncoder().encodeToString(encrypted);
    }

    public static String decrypt(String ciphertext, String key, String iv) throws Exception {
        byte[] keyBytes = key.getBytes(CHARSET);
        byte[] ivBytes = iv.getBytes(CHARSET);
        byte[] ciphertextBytes = Base64.getDecoder().decode(ciphertext);

        SecretKeySpec secretKeySpec = new SecretKeySpec(keyBytes, CIPHER_ALGORITHM);
        IvParameterSpec ivParameterSpec = new IvParameterSpec(ivBytes);

        Cipher cipher = Cipher.getInstance(CIPHER_TRANSFORMATION);
        cipher.init(Cipher.DECRYPT_MODE, secretKeySpec, ivParameterSpec);

        byte[] decrypted = cipher.doFinal(ciphertextBytes);
        return new String(decrypted, CHARSET);
    }
}
