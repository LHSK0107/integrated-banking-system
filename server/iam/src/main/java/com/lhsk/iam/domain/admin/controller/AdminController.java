package com.lhsk.iam.domain.admin.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.lhsk.iam.domain.admin.model.vo.LoginHistoryReqeustVO;
import com.lhsk.iam.domain.admin.model.vo.MenuClickRequestVO;
import com.lhsk.iam.domain.admin.model.vo.MenuClickVO;
import com.lhsk.iam.domain.admin.service.AdminService;
import com.lhsk.iam.domain.user.model.vo.LoginHistoryVO;
import com.lhsk.iam.global.config.jwt.JwtTokenProvider;

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
	@GetMapping("/api/admin/menu")
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
}



