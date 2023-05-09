package com.lhsk.iam.domain.report.controller;

import java.io.File;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.lhsk.iam.domain.user.model.vo.DetailUserVO;
import com.lhsk.iam.domain.user.service.UserService;
import com.lhsk.iam.global.config.jwt.JwtTokenProvider;
import com.lhsk.iam.global.email.service.EmailService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ReportController {
	
	private final EmailService emailService;
	private final JwtTokenProvider jwtTokenProvider;
	private final UserService userService;
	
	
//	@PostMapping("/api/reports/email")
//	public ResponseEntity<?> sendEmailWithAttachment(@RequestBody Map<String, String> data, HttpServletRequest req) {
//		try {
//			// 액세스 토큰으로 부터 유저의 email을 추출
//			String accessToken = req.getHeader("Authorization").split(" ")[1];
//			int userNo = jwtTokenProvider.getUserNoFromToken(accessToken);
//			DetailUserVO user = userService.findByUserNo(userNo);
//			String email = user.getEmail();
//			
//			System.out.println("email : "+email);
//			
//			String blobUrl = data.get("blob");
//			
//			System.out.println("blob : "+blobUrl);
//			
//			// blob url로 파일을 다운로드
//			URL url = new URL(blobUrl);
//			HttpURLConnection connection = (HttpURLConnection) url.openConnection();
//		    connection.setRequestMethod("GET");
//		    connection.setDoInput(true);
//		    connection.connect();
//			
//		    InputStream inputStream = connection.getInputStream();
//		    
//		    // 다운로드한 파일을 디스크에 저장합니다.
//		    File tempFile = File.createTempFile("temp-", ".bin");
//		    Files.copy(inputStream, tempFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
//
//		    // 이메일 발송
//		    emailService.sendEmailWithAttachment(tempFile, email);
//		    
//		    tempFile.delete();
//		} catch (Exception e) {
//			// TODO: handle exception
//			e.printStackTrace();
//			System.out.println("exception");
//		}
//		
//		return new ResponseEntity<>("메일 보내기 성공", HttpStatus.OK);
//	}
	
	@PostMapping("/api/reports/email")
	public ResponseEntity<?> sendEmailWithAttachment(@RequestParam("file") MultipartFile file, HttpServletRequest req) {
		try {
			// 액세스 토큰으로 부터 유저의 email을 추출
			String accessToken = req.getHeader("Authorization").split(" ")[1];
			int userNo = jwtTokenProvider.getUserNoFromToken(accessToken);
			DetailUserVO user = userService.findByUserNo(userNo);
			String email = user.getEmail();
			
			
			// 다운로드한 파일을 디스크에 저장합니다.
			File tempFile = File.createTempFile("temp-", ".xlsx");
	        Files.copy(file.getInputStream(), tempFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
			
			// 이메일 발송
			emailService.sendEmailWithAttachment(tempFile, email);
			
			tempFile.delete();
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			System.out.println("exception");
		}
		
		return new ResponseEntity<>("메일 보내기 성공", HttpStatus.OK);
	}
}
