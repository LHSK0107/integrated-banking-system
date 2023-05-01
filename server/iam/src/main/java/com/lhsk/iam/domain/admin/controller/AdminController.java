package com.lhsk.iam.domain.admin.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.lhsk.iam.domain.admin.model.vo.LoginHistoryReqeustVO;
import com.lhsk.iam.domain.admin.service.AdminService;
import com.lhsk.iam.domain.user.model.vo.LoginHistoryVO;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class AdminController {
	
	private final AdminService adminService;
	
	// 모든 유저의 로그인 기록 조회
	@GetMapping("/api/admin/logins")
	public ResponseEntity<List<LoginHistoryVO>> getAllLoginHistory(@RequestBody LoginHistoryReqeustVO vo) {
		/*
		 * {
		 *  "page" : int		프론트에서 볼 페이지 번호
		 *  "pageSize" : int	프론트에서 한번에 볼 건수
		 *  "sort" : "",		정렬기준 "asc" or "desc"
		 * }
		 */
		vo.setStart((vo.getPage()-1) * vo.getPageSize());
		return new ResponseEntity<>(adminService.findAllLoginHistory(vo), HttpStatus.OK);
	}
	
	// 특정 유저의 로그인 기록 조회
	@GetMapping("/api/admin/login")
	public ResponseEntity<List<LoginHistoryVO>> getLoginHistory(@RequestBody LoginHistoryReqeustVO vo) {
		vo.setStart((vo.getPage()-1) * vo.getPageSize());
		return new ResponseEntity<>(adminService.findLoginHistory(vo), HttpStatus.OK);
	}

}



