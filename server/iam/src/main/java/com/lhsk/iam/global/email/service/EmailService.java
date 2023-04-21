package com.lhsk.iam.global.email.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

// 이메일 발송과 관련된 로직을 처리하는 클래스
@Service
public class EmailService {
	
	@Autowired
    private JavaMailSender javaMailSender;
	
	public void sendVerificationEmail(String toEmail, String verificationCode) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(toEmail);
        mailMessage.setSubject("회원가입 이메일 인증");
        mailMessage.setText("인증 코드: " + verificationCode);
        
        javaMailSender.send(mailMessage);
    }
	
}
