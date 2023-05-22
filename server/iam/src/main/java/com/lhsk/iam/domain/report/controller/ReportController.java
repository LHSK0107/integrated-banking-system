package com.lhsk.iam.domain.report.controller;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.lhsk.iam.domain.report.model.vo.InoutReportRequestVO;
import com.lhsk.iam.domain.report.service.ReportService;
import com.lhsk.iam.domain.user.model.vo.DetailUserVO;
import com.lhsk.iam.domain.user.service.UserService;
import com.lhsk.iam.global.config.jwt.JwtTokenProvider;
import com.lhsk.iam.global.email.service.EmailService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@Slf4j
public class ReportController {
	
	private final EmailService emailService;
	private final JwtTokenProvider jwtTokenProvider;
	private final UserService userService;
	private final ReportService reportService;
	
	// 일일시재보고서 데이터 요청
	@PostMapping("/api/users/reports/daily")
	public ResponseEntity<?> getDailyReportData(HttpServletRequest req) {
		
		String accessToken = req.getHeader("Authorization").split(" ")[1];
		
		// 유저 권한에 따라 분기별 처리 (ROLE_BLACK은 시큐리티에서 걸리기 때문에 배제함)
		String userCode = jwtTokenProvider.getUserCodeFromToken(accessToken);
		if(userCode.equals("ROLE_USER")) {
			log.info("일반 사용자 진입");
			int userNo = jwtTokenProvider.getUserNoFromToken(accessToken);
			return new ResponseEntity<>(reportService.getDailyReportData(userNo), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(reportService.getDailyReportData(), HttpStatus.OK);
		}
	}
	
	// 입출내역보고서 데이터 요청
	@PostMapping("/api/users/reports/inout")
	public ResponseEntity<?> getInoutReportData(@RequestBody InoutReportRequestVO vo, HttpServletRequest req) {
		
		/*
		 * {
		 * 		bankCd : "은행코드"		전체 선택시 null
		 * 		acctNo : "계좌번호"		전체 선택시 null
		 * 		startDt : "2023-05-11"	
		 * 		endDt : "2023-05-14"	
		 * }
		 */
		
		String accessToken = req.getHeader("Authorization").split(" ")[1];
		// 유저 권한에 따라 분기별 처리 (ROLE_BLACK은 시큐리티에서 걸리기 때문에 배제함)
		String userCode = jwtTokenProvider.getUserCodeFromToken(accessToken);
		if(userCode.equals("ROLE_USER")) {
			log.info("일반 사용자 진입");
			int userNo = jwtTokenProvider.getUserNoFromToken(accessToken);
			if (vo.getEndDt().equals(LocalDate.now().toString())) {
				return new ResponseEntity<>(reportService.getInoutReportDataToday(vo, userNo), HttpStatus.OK);
			} else {
				return new ResponseEntity<>(reportService.getInoutReportData(vo, userNo), HttpStatus.OK);
			}
		} else {
			if (vo.getEndDt().equals(LocalDate.now().toString())) {
				return new ResponseEntity<>(reportService.getInoutReportDataToday(vo), HttpStatus.OK);
			} else {
				return new ResponseEntity<>(reportService.getInoutReportData(vo), HttpStatus.OK);
			}
		}
	}
	
	// 이메일로 내보내기
	@PostMapping("/api/users/reports/email")
	public ResponseEntity<?> sendEmailWithAttachment(@RequestParam("file") MultipartFile file, HttpServletRequest req) {
		try {
			// 액세스 토큰으로 부터 유저의 email을 추출
			String accessToken = req.getHeader("Authorization").split(" ")[1];
			int userNo = jwtTokenProvider.getUserNoFromToken(accessToken);
			DetailUserVO user = userService.findByUserNo(userNo);
			String email = user.getEmail();
			log.info("발송메일 주소 : "+email);
			log.info("건네받은 파일 이름(getOriginalFilename()) : " + file.getOriginalFilename());
			log.info("건네받은 파일 이름(getName()) : " + file.getName());
			// 다운로드한 파일을 디스크에 저장합니다.
			File tempFile = File.createTempFile(file.getName(), ".xlsx");
	        Files.copy(file.getInputStream(), tempFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
			
			// 이메일 발송
			emailService.sendEmailWithAttachment(tempFile, email);
			
			tempFile.delete();
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			log.info("exception");
		}
		
		return new ResponseEntity<>("메일 보내기 성공", HttpStatus.OK);
	}
}
