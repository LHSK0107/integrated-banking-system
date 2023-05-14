package com.lhsk.iam.domain.dashboard.controller;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.lhsk.iam.domain.dashboard.service.DashboardService;
import com.lhsk.iam.global.config.JwtConfig;
import com.lhsk.iam.global.config.jwt.JwtTokenProvider;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
public class DashboardController {

	private final DashboardService dashboardService;
	private final JwtTokenProvider jwtTokenProvider;
	private final JwtConfig jwtConfig;
	
	// 관리자의 자산 잔액 합계 메서드
	@GetMapping("/api/manager/dashboard/totalBalances")
	public ResponseEntity<Map<String, BigDecimal>> findByAdminsBalSums() {
		log.info("DashboardController findByAdminsBalSums");
		// key : 01, 02, 03, total 
		Map<String, BigDecimal> balSumInfo = dashboardService.findByAdminsBalSums();
		
		return new ResponseEntity<>(balSumInfo, HttpStatus.OK);
	}
	
	// 관리자의 자산 비율 메서드
	@GetMapping("/api/manager/dashboard/acctDvRatio")
	public ResponseEntity<Map<String, BigDecimal>> adminsEachAcctDvRatio() {
		log.info("DashboardController adminsEachAcctDvRatio");
		// key : 01, 02, 03
		Map<String, BigDecimal> acctDvRatioInfo = dashboardService.adminsEachAcctDvRatio();
		return new ResponseEntity<>(acctDvRatioInfo, HttpStatus.OK);
	}
	

	// 관리자의 수시입출금 계좌 기간별(일/월/년) 입/출금 합계
	@GetMapping("/api/manager/dashboard/acctDv01InoutSum")
	public ResponseEntity<Map<String, Map<String, Object>>> adminsAcctDv01InoutSum() {
		log.info("DashboardController adminsAcctDv01InoutSum");
		
		Map<String, Map<String, Object>> data = new HashMap<>();
		
		// key: date, in, out / value는 배열
		Map<String, Object> daily = dashboardService.adminsAcctDv01Daily();
		Map<String, Object> monthly = dashboardService.adminsAcctDv01Monthly();
		Map<String, Object> yearly = dashboardService.adminsAcctDv01Yearly();
		
		data.put("day", daily);
		data.put("month", monthly);
		data.put("year", yearly);
		
		return new ResponseEntity<>(data, HttpStatus.OK);
	}
	
	// 회원의 보유 자산 잔액 합계 메서드
	@GetMapping("/api/users/dashboard/totalBalances/{userNo}")
	public ResponseEntity<Map<String, BigDecimal>> findByUsersBalSums(@PathVariable int userNo, 
			HttpServletRequest request) {
		log.info("DashboardController findByUsersBalSums");
		
		// JWT에서 userNo을 parsing
		String accessToken = request.getHeader("Authorization")
				.replace(jwtConfig.getTokenPrefix(), "");
		int userNoByToken = jwtTokenProvider.getUserNoFromToken(accessToken);
		
		// 토큰 소유자와 PathVariable의 userNo가 같을 때 200 ok, 그 외에는 403 forbidden 
		if (userNo == userNoByToken) {
			// key : 01, 02, 03, total
			Map<String, BigDecimal> balSumInfo = dashboardService.findByUsersBalSums(userNo);
			return new ResponseEntity<>(balSumInfo, HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.FORBIDDEN);
	}

	// 회원의 자산 비율 메서드
	@GetMapping("/api/users/dashboard/acctDvRatio/{userNo}")
	public ResponseEntity<Map<String, BigDecimal>> usersEachAcctDvRatio(@PathVariable int userNo, 
			HttpServletRequest request) {
		log.info("DashboardController usersEachAcctDvRatio");
		
		// JWT에서 userNo을 parsing
		String accessToken = request.getHeader("Authorization")
				.replace(jwtConfig.getTokenPrefix(), "");
		int userNoByToken = jwtTokenProvider.getUserNoFromToken(accessToken);
		
		// 토큰 소유자와 PathVariable의 userNo가 같을 때 200 ok, 그 외에는 403 forbidden 
		if (userNo == userNoByToken) {		
			// key : 01, 02, 03
			Map<String, BigDecimal> acctDvRatioInfo = dashboardService.usersEachAcctDvRatio(userNo);
			return new ResponseEntity<>(acctDvRatioInfo, HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.FORBIDDEN);
	}

	// 회원의 수시입출금 계좌 기간별(일/월/년) 입/출금 합계
	@GetMapping("/api/users/dashboard/acctDv01InoutSum/{userNo}")
	public ResponseEntity<Map<String, Map<String, Object>>> usersAcctDv01InoutSum(@PathVariable int userNo, 
																				HttpServletRequest request) {
		log.info("DashboardController usersAcctDv01InoutSum");
		
		// JWT에서 userNo을 parsing
		String accessToken = request.getHeader("Authorization")
				.replace(jwtConfig.getTokenPrefix(), "");
		int userNoByToken = jwtTokenProvider.getUserNoFromToken(accessToken);
		
		// 토큰 소유자와 PathVariable의 userNo가 같을 때 200 ok, 그 외에는 403 forbidden 
		if (userNo == userNoByToken) {
			// key : 01, 02, 03, total
			Map<String, Map<String, Object>> data = new HashMap<>();
			
			// key: date, in, out / value는 배열
			Map<String, Object> daily = dashboardService.usersAcctDv01Daily(userNo);
			Map<String, Object> monthly = dashboardService.usersAcctDv01Monthly(userNo);
			Map<String, Object> yearly = dashboardService.usersAcctDv01Yearly(userNo);
			
			data.put("day", daily);
			data.put("month", monthly);
			data.put("year", yearly);
			
			return new ResponseEntity<>(data, HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.FORBIDDEN);
		
		
	}

	
}
