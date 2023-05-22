package com.lhsk.iam.global.email.service;

import java.io.File;

import javax.activation.FileDataSource;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

// 이메일 발송과 관련된 로직을 처리하는 클래스
@Service
@Slf4j
public class EmailService {
	
	@Autowired
    private JavaMailSender javaMailSender;
	@Value("${aes.secret}")
	private String serverEmail;
	
	// 인증번호 이메일 발송
	public void sendVerificationEmail(String toEmail, String verificationCode) {
		try {
			MimeMessage message = javaMailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true);

			String html = 
			"<div style=\"margin: 20px; padding: 20px;\">"
	        +"<img style=\"width:50px; margin-bottom: 30px;\" src=\"https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FchUe8p%2FbtsgDOjnM5r%2FKftRAvLvQr0LhhF23AJ59K%2Fimg.png\">"
			+"<div style=\"color: #232323; margin-bottom: 30px;\">"
	        +   "<p style=\"margin: 2px 0\">안녕하세요, IAM입니다.</p>"
	        +   "<p style=\"margin: 2px 0\">아래 인증번호를 화면에 입력 부탁드립니다.</p>"
	        +"</div>"
	        +"<div style=\"width: 500px; background-color: #003b87; border-radius: 3px; text-align: center; color: #ffffff; padding: 20px 0; margin-bottom: 30px;\">"
	        +        "인증 번호 : <span style=\"font-size: 22px; font-weight: bolder;\">" + verificationCode + "</span>"
	        +"</div>"
	        +"<p style=\"color: #898989; font-size: 14px;\">만약 이메일 요청을 하시지 않은 경우 고객센터 1577-8820로 연락 부탁드립니다.</p>"
	        +"</div>"
	        ;
			
			helper.setFrom(serverEmail);
			helper.setTo(toEmail);
			helper.setSubject("회원가입 이메일 인증번호");
			helper.setText(html, true); // true를 설정하면 HTML 메일로 인식
//			helper.addInline("logo", file);
			log.info("메일 발송");
			javaMailSender.send(message);
			
			
			
		} catch (MessagingException e) {
			e.printStackTrace();
		}
    }
	
	
	public void sendEmailWithAttachment(File attachmentFile, String toEmail) throws MessagingException {
		MimeMessage message = javaMailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message, true);
		
		helper.setFrom(serverEmail);
		helper.setTo(toEmail);
//		helper.setTo("poohharry@naver.com");
		helper.setSubject("보고서 내보내기");
		helper.setText("보고서가 무사히 완성되었습니다.");
		
		FileSystemResource file = new FileSystemResource(attachmentFile);
		helper.addAttachment(file.getFilename(), file);
		
		log.info("메일 발송");
		javaMailSender.send(message);
	}
	
}
