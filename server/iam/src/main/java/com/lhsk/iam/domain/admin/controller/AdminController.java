package com.lhsk.iam.domain.admin.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

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
			System.out.println("day로 진입");
			return new ResponseEntity<>(adminService.findMenuClickDay(), HttpStatus.OK);
		} else if(data.get("period").equals("week")) {
			return new ResponseEntity<>(adminService.findMenuClickWeek(), HttpStatus.OK);			
		} else if(data.get("period").equals("month")) {
			return new ResponseEntity<>(adminService.findMenuClickMonth(), HttpStatus.OK);			
		} else {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	// 계좌조회 권한 페이지 계좌정보
	@GetMapping("/api/manager/usersAccount")
	public ResponseEntity<?> getAllAccounts() {
		Map<String, List<String>> acctInfoList = adminService.getAllAccounts();
		
		return new ResponseEntity<>(acctInfoList, HttpStatus.OK);
	}
	
	// 회원에 계좌 조회 권한 부여
	@PostMapping("/api/manager/usersAccount") 
	public ResponseEntity<?> setUserAccount(@RequestBody Map<String, Object> data) {
		// 클라이언트에서 넘어 온 값 분리
		int userNo = (int)data.get("userNo");
		List<String> acctNoList = (List<String>)data.get("acctNo");
		List<String> bankCdList = (List<String>)data.get("bankCd");
		// 하나의 객체에 값 세팅
		List<UserAccountVO> infoList = new ArrayList<>();
		for (UserAccountVO info : infoList) {
			for (int i = 0; i < acctNoList.size(); i++) {
				info.setUserNo(userNo);
				info.setAcctNo(acctNoList.get(i));
				info.setBankCd(bankCdList.get(i));
			}
		}
		return new ResponseEntity<>(HttpStatus.OK);
	}
	
}



