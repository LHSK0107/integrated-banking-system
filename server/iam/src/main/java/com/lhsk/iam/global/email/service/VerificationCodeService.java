package com.lhsk.iam.global.email.service;

import java.security.NoSuchAlgorithmException;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.lhsk.iam.global.email.model.mapper.EmailMapper;
import com.lhsk.iam.global.encrypt.Sha512Encrypt;

import lombok.extern.slf4j.Slf4j;

// 인증번호 발급 및 조회 서비스
@Service
@Slf4j
public class VerificationCodeService {
	
	@Autowired
	private EmailMapper emailMapper;
	
	// 인증번호와 이메일을 DB에 저장 (1분동안)
	public void saveVerificationCode(String email, String code) throws NoSuchAlgorithmException {
		email = Sha512Encrypt.hash(email);
		emailMapper.saveVerificationCode(email, code);
    }
	
	// 입력받은 코드와 일치하는 이메일 반환
	public String findEmailByCode(String code) throws NoSuchAlgorithmException {
		return emailMapper.findEmailByCode(code);
	}
	
	// 랜덤으로 인증번호 생성 (a-zA-Z0-9)
	public String generateVerificationCode() {
        int length = 6;
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder stringBuilder = new StringBuilder();

        Random random = new Random();

        for (int i = 0; i < length; i++) {
            int index = random.nextInt(characters.length());
            char randomChar = characters.charAt(index);
            stringBuilder.append(randomChar);
        }
        return stringBuilder.toString();
    }
	
	// 1분마다 오래된 인증메일 정보 삭제
	@Scheduled(fixedRate = 60000) // 1분마다 실행 (60000밀리초 = 1분)
	public void deleteOldRecords() {
		emailMapper.deleteOldVeri();
	}


	public boolean verifyEmail(String email, String inputCode) {
		try {
			String storedEmail = findEmailByCode(inputCode);
			String salt = storedEmail.split("=")[0] + "=";
			email = Sha512Encrypt.hashForLogin(salt, email);
			log.info(email);
			if(email.equals(storedEmail)) return true;
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		}
		return false;
	}
}

