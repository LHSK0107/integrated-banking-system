package com.lhsk.iam.domain.user.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.lhsk.iam.domain.user.model.vo.DetailUserVO;
import com.lhsk.iam.domain.user.model.vo.UpdateUserVO;
import com.lhsk.iam.domain.user.model.vo.UserVO;
import com.lhsk.iam.domain.user.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
public class UserController {
	// 생성자 주입
	private final UserService userService;
	
	// id 중복 체크
	@PostMapping("/api/signup/id")
	public String checkDuplicateId(@RequestBody UserVO userVO) {
		log.info("UserController.CheckDuplicateId");
//		log.info(userVO.getId());
		return "{\"status\":\""+userService.checkDuplicateId(userVO.getId())+"\"}";
	}
	
	// email 중복 체크
	@PostMapping("/api/signup/email")
	public String checkDuplicateEmail(@RequestBody UserVO userVO) {
		log.info("UserController.CheckDuplicateEmail");
//		log.info(userVO.getEmail());
		return "{\"status\":\""+userService.checkDuplicateEmail(userVO.getEmail())+"\"}";
	}
	
	// email 인증 /api/signup/email

	// 회원가입
	@PostMapping("/api/users")
	public String signup(@RequestBody UserVO userVO) {
		log.info("UserController.signup");
//		log.info("userVO: "+userVO);
		return "{\"status\":\""+userService.signup(userVO)+"\"}";
	}
	
	// 회원정보 수정
	@PutMapping("/api/users")
	public String updateUser(@RequestBody UpdateUserVO updateUserVO) {
		log.info("UserController.update"); 
//		log.info(updateUserVO.toString());
		return "{\"status\":\""+userService.updateUser(updateUserVO)+"\"}";
	}
	
	// 회원 삭제
	@DeleteMapping("/api/users/{userNo}")
	public String deleteUser(@PathVariable int userNo) {
		log.info("UserController.deleteUser"); 
		return "{\"status\":\""+userService.deleteUser(userNo)+"\"}";
	}

	// 회원 리스트 (ROLE_ADMIN, ROLE_MANAGER)
	@GetMapping("/api/users")
	public List<DetailUserVO> findAllUser() {
		log.info("UserController.userList");
		return userService.findAllUser();
	}
	  
	// 회원 상세조회 (ROLE_USER)
	@GetMapping("/api/users/{userNo}")
	public DetailUserVO findByUserNo(@PathVariable int userNo) {	// @PathVariable : 경로 상의 값을 가져올 때 사용 
		log.info("UserController.findByUserNo"); 
		return userService.findByUserNo(userNo);
	}
		
}