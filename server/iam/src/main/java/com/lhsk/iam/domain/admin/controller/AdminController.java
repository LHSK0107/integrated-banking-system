package com.lhsk.iam.domain.admin.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.lhsk.iam.domain.account.model.vo.GrantAccountVO;
import com.lhsk.iam.domain.account.model.vo.UserAccountVO;
import com.lhsk.iam.domain.admin.model.vo.MenuClickVO;
import com.lhsk.iam.domain.admin.service.AdminService;
import com.lhsk.iam.domain.user.model.vo.LoginHistoryVO;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class AdminController {
	
	private final AdminService adminService;
	
	// 모든 유저의 로그인 기록 조회
	@GetMapping("/api/admin/logins")
	public ResponseEntity<List<LoginHistoryVO>> getAllLoginHistory() {

		return new ResponseEntity<>(adminService.findAllLoginHistory(), HttpStatus.OK);
	}
	
	// 메뉴 클릭 기록 조회
	@PostMapping("/api/admin/menu")
	public ResponseEntity<List<MenuClickVO>> getMenuClick(@RequestBody Map<String, String> data) {
		/*
		 * {
		 *  "period" : "day"
		 * }
		 */
		// default로 7일치 기록을 보여줌
		if(data.get("period").equals("day")) {
			return new ResponseEntity<>(adminService.findMenuClickDay(), HttpStatus.OK);
		} else if(data.get("period").equals("week")) {
			return new ResponseEntity<>(adminService.findMenuClickWeek(), HttpStatus.OK);			
		} else if(data.get("period").equals("month")) {
			return new ResponseEntity<>(adminService.findMenuClickMonth(), HttpStatus.OK);			
		} else {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	
	// 계좌조회 권한 페이지 - 전체 계좌정보 재가공 
	@GetMapping("/api/manager/usersAccount")
	public ResponseEntity<?> getAllAccounts() {
		List<GrantAccountVO> acctInfoList = adminService.getAllAccounts();
		
		if (acctInfoList == null) return null;
		else return new ResponseEntity<>(acctInfoList, HttpStatus.OK);
	}
	
	// 계좌조회 권한 페이지 - 회원에게 허용된 계좌정보 재가공 
	@GetMapping("/api/manager/usersAvailable/{userNo}")
	public ResponseEntity<?> getAvailable(@PathVariable int userNo) {
		List<GrantAccountVO> availableInfoList = adminService.getAvailable(userNo);
		
		if (availableInfoList == null) return null;
		else return new ResponseEntity<>(availableInfoList, HttpStatus.OK);
	}
	
	// 회원에 계좌 조회 권한 부여
	@PostMapping("/api/manager/grantAccount/{userNo}") 
	public ResponseEntity<?> setUserAccount(@PathVariable int userNo, @RequestBody List<UserAccountVO> data) {
		adminService.grantAvailableAccounts(userNo, data);
		
		return new ResponseEntity<>(HttpStatus.OK);
	}
	
}



