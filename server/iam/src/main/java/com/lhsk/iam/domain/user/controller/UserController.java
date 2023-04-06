package com.lhsk.iam.domain.user.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.lhsk.iam.domain.user.model.vo.UpdateUserVO;
import com.lhsk.iam.domain.user.model.vo.UserVO;
import com.lhsk.iam.domain.user.model.vo.WithoutUserCodeUserVO;
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
	@GetMapping("/api/signup/{id}")
	public boolean checkDuplicateId(@PathVariable String id) {
		log.info("UserController.CheckDuplicateId");
		return userService.checkDuplicateId(id);
	}
	
	// email 인증 /api/signup/email

	// 회원가입
	@PostMapping("/api/users")
	public String signup(@RequestBody UserVO userVO) {
		log.info("UserController.signup");
//		log.info("userVO: "+userVO);
		userService.signup(userVO);
		return "{\"status\":\"ok\"}";
	}
	
	// 회원정보 수정
	@PutMapping("/api/users")
	public String updateUser(@RequestBody UpdateUserVO updateUserVO) {
		log.info("UserController.update"); 
//		log.info(updateUserVO.toString());
		userService.updateUser(updateUserVO);
		return "{\"status\":\"ok\"}";
	}

	// 회원 리스트 (ROLE_ADMIN, ROLE_MANAGER)
	@GetMapping("/api/users")
	public List<UserVO> findAllUser() {
		log.info("UserController.userList");
		return userService.findAllUser();
	}
	  
	// 회원 상세조회 (ROLE_USER)
	@GetMapping("/api/users/{userNo}")
	public WithoutUserCodeUserVO findByUserNo(@PathVariable int userNo) {	// @PathVariable : 경로 상의 값을 가져올 때 사용 
		log.info("UserController.findByUserNo"); 
		return userService.findByUserNo(userNo);
	}
	
	// 회원 삭제
	@DeleteMapping("/api/users/{userNo}")
	public String deleteUser(@PathVariable int userNo) {
		log.info("UserController.deleteUser"); 
		userService.deleteUser(userNo);
		return "{\"status\":\"ok\"}";
	}
	

// -----------------------------------------------------------------------------------------------
// @Controller를 이용하는 경우

//	// 회원 상세조회(ROLE_USER)
//	@PostMapping("/user/{userNo}")
//	public String findByUserNo(@PathVariable int userNo, Model model) {	
//		log.info("UserController.findByUserNo"); 
//		model.addAttribute("user", userService.findByUserNo(userNo));
//		return "user";
//	}
	
//	// 회원 리스트 출력(ROLE_ADMIN, ROLE_MANAGER)
//	@GetMapping("/user/list")
//	public String findAllUser(Model model) {			// Model : html로 가져갈 데이터가 있다면 사용
//		log.info("UserController.userList - model"); 
//		model.addAttribute("user", userService.findAllUser());
//		return "user";
//	}
	
}
