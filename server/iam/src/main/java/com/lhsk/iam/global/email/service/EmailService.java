package com.lhsk.iam.global.email.service;

import java.io.File;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

// 이메일 발송과 관련된 로직을 처리하는 클래스
@Service
public class EmailService {
	
	@Autowired
    private JavaMailSender javaMailSender;
	@Value("${aes.secret}")
	private String serverEmail;
	
	// 인증번호 이메일 발송
	public void sendVerificationEmail(String toEmail, String verificationCode) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(toEmail);
        mailMessage.setSubject("회원가입 이메일 인증");
        mailMessage.setText("인증 코드: " + verificationCode);
        
        javaMailSender.send(mailMessage);
    }
	
	
	public void sendEmailWithAttachment(File attachmentFile, String toEmail) throws MessagingException {
		MimeMessage message = javaMailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message, true);
		
		helper.setFrom(serverEmail);
//		helper.setTo(toEmail);
		helper.setTo("poohharry@naver.com");
		helper.setSubject("Email with Attachment");
		helper.setText("This is an email with an attachment.");
		
		FileSystemResource file = new FileSystemResource(attachmentFile);
		helper.addAttachment(file.getFilename(), file);
		
		System.out.println("메일 발송");
		javaMailSender.send(message);
	}
	
}
