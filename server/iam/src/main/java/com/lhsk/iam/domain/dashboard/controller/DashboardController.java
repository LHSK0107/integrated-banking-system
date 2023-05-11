package com.lhsk.iam.domain.dashboard.controller;

import java.math.BigDecimal;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.lhsk.iam.domain.dashboard.service.DashboardService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
public class DashboardController {

	private final DashboardService dashboardService;
	
	// 관리자의 자산 잔액 합계 메서드
	@GetMapping("/api/manager/dashboard/totalBalances")
	public ResponseEntity<Map<String, BigDecimal>> findByAdminsBalSums() {
		log.info("DashboardController.findByAdminsBalSums");
		// key : 01, 02, 03, total 
		Map<String, BigDecimal> balSumInfo = dashboardService.findByAdminsBalSums();
		
		return new ResponseEntity<>(balSumInfo, HttpStatus.OK);
	}
	
	// 회원의 보유 자산 잔액 합계 메서드
	@GetMapping("/api/users/dashboard/totalBalances/{userNo}")
	public ResponseEntity<Map<String, BigDecimal>> findByUsersBalSums(@PathVariable int userNo) {
		log.info("DashboardController.findByUsersBalSums");
		// key : 01, 02, 03, total
		Map<String, BigDecimal> balSumInfo = dashboardService.findByUsersBalSums(userNo);
		
		return new ResponseEntity<>(balSumInfo, HttpStatus.OK);
	}
}
