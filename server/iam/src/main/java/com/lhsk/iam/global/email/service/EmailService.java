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

			String html = "<!DOCTYPE html>\r\n"
					+ "<html lang=\"ko\">\r\n"
					+ "<head>\r\n"
					+ "    <meta charset=\"UTF-8\">\r\n"
					+ "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n"
					+ "    <title>Document</title>\r\n"
					+ "</head>\r\n"
					+ "<body>\r\n"
					+"<img src=\"https://raw.githubusercontent.com/poohharry/aws_deploy/3558abd66ef05bab00a73f22b23cf8af4fc52686/logo_3d_2.svg?token=ATMLQWXE6EHR4VIOKIEW25DEM4ZZI\">"
					+ "\r\n"
					+ "<p style=\"color: gray;\">"
	                +"안녕하세요, IAM입니다.<br/>"      
	                    +"IAM은 고객님께서 사용하고 계신 통합계좌 조회 서비스 운영사입니다.<br/>"  
	                    +"고객님께서 개인정보열람을 위해 요청하신 인증번호를 전달드립니다.<br/>" 
	                    +"아래 인증번호를 화면에 입력 부탁드립니다<br/>" 
	                    +"</p><br/>"
	                 +"<div style=\""
	                 + "width:auto;border: 1px solid black; border-radius: 3px; font-weight: bold;"
	                 + "text-align: center; color: blue; padding-top: 15pt; padding-bottom: 15pt;"
	                 + "\">"
	                 + "인증 번호 : " +  verificationCode
	                 + "</div><br/>" 
	                 +"<p style=\"color: gray;\">"
	                 +"만약 이메일 요청을 하시지 않은 경우 고객센터</br>"
	                 +"1522-5904로 전달 부탁드립니다."
	                 +"</p>" //이메일 내용 삽입
					
					
					+ "</body>\r\n"
					+ "</html>";
			
			helper.addInline("imgCID", new ClassPathResource("logo.png"));
			
			String content = //html 형식으로 작성 !
//					"<img src=\"/iam/src/main/resources/logo_3d.svg\">"+
	                "<p style=\"color: gray;\">"
	                +"안녕하세요, IAM입니다.<br/>"      
	                    +"IAM은 고객님께서 사용하고 계신 통합계좌 조회 서비스 운영사입니다.<br/>"  
	                    +"고객님께서 개인정보열람을 위해 요청하신 인증번호를 전달드립니다.<br/>" 
	                    +"아래 인증번호를 화면에 입력 부탁드립니다<br/>" 
	                    +"</p><br/>"
	                 +"<div style=\""
	                 + "width:auto;border: 1px solid black; border-radius: 3px; font-weight: bold;"
	                 + "text-align: center; color: blue; padding-top: 15pt; padding-bottom: 15pt;"
	                 + "\">"
	                 + "인증 번호 : " +  verificationCode
	                 + "</div><br/>" 
	                 +"<p style=\"color: gray;\">"
	                 +"만약 이메일 요청을 하시지 않은 경우 고객센터</br>"
	                 +"1522-5904로 전달 부탁드립니다."
	                 +"</p>"; //이메일 내용 삽입
			
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
//		helper.setTo(toEmail);
		helper.setTo("poohharry@naver.com");
		helper.setSubject("Email with Attachment");
		helper.setText("This is an email with an attachment.");
		
		FileSystemResource file = new FileSystemResource(attachmentFile);
		helper.addAttachment(file.getFilename(), file);
		
		log.info("메일 발송");
		javaMailSender.send(message);
	}
	
}
