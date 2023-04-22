package com.lhsk.iam.global.email.controller;

import java.security.NoSuchAlgorithmException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.lhsk.iam.global.email.service.EmailService;
import com.lhsk.iam.global.email.service.VerificationCodeService;
import com.lhsk.iam.global.encrypt.Sha512Encrypt;

@RestController
public class EmailController {
	
	
	
	@Autowired
    private EmailService emailService;
	
	@Autowired
    private VerificationCodeService verificationCodeService;
	
	// 인증번호 요청
	@PostMapping("/api/signup/email")
	public ResponseEntity<?> verifyRequest(@RequestBody Map<String, String> data) {
	    // 랜덤코드 생성
	    String code = verificationCodeService.generateVerificationCode();
	    // 입력받은 이메일로 코드 발송
	    emailService.sendVerificationEmail(data.get("email"), code);

	    try {
	        // 이메일과 코드를 DB에 저장
	        verificationCodeService.saveVerificationCode(data.get("email"), code);
	        // 무사히 전송 및 저장이 완료됐으면 ok
	        return ResponseEntity.ok("send email successful");
	    } catch (NoSuchAlgorithmException e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred while saving the verification code");
	    }
	}
	
	@PostMapping("/api/signup/email/verification")
	public ResponseEntity<?> verify(@RequestBody Map<String, String> data) {
	    String email = data.get("email");
	    String inputCode = data.get("code");

	    boolean isVerified = verificationCodeService.verifyEmail(email, inputCode);
		if (isVerified) {
		    // 인증 코드가 일치하면 회원가입을 완료하고, 성공 메시지를 반환합니다.
		    return ResponseEntity.ok("Verification successful");
		} else {
		    // 인증 코드가 일치하지 않으면 오류 메시지를 반환합니다.
		    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Verification failed");
		}
	}
	
	
//	// 인증번호 입력값 체크
//	@PostMapping("/api/signup/email/verification")
//	public ResponseEntity<?> verify(@RequestBody Map<String, String> data) {
//	    String email = data.get("email");
//	    String inputCode = data.get("code");
//	    String storedEmail = null;
//	    String hashEmail = null;
//		try {
//			storedEmail = verificationCodeService.findEmailByCode(inputCode);
//			String salt = storedEmail.split("=")[0] + "=";
//			email = Sha512Encrypt.hashForLogin(salt, email);
//		} catch (NoSuchAlgorithmException e) {
//			e.printStackTrace();
//		}
//	    if (email.equals(hashEmail)) {
//	        // 인증 코드가 일치하면 회원가입을 완료하고, 성공 메시지를 반환합니다.
//	        return ResponseEntity.ok("Verification successful");
//	    } else {
//	        // 인증 코드가 일치하지 않으면 오류 메시지를 반환합니다.
//	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Verification failed");
//	    }
//	
//	}
}
