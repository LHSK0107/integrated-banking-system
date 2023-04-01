package com.lhsk.iam.domain.user.controller;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
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
//@Controller
@RequiredArgsConstructor
public class UserController {
	// 생성자 주입
	private final UserService userService;
	
	// 회원가입 페이지 출력 요청
	@GetMapping("/user/signup")
	public String signupForm() {
		return "signup";
	}
	
	// 회원가입
	@PostMapping("/user/signup")
	public String signup(@RequestBody UserVO userVO) {
		log.info("UserController.signup");
//		log.info("userVO: "+userVO);
		userService.signup(userVO);
		return "index";
	}

	// 회원 리스트 출력
	// @RestController를 이용하는 경우
	@GetMapping("/user/list")
	public List<UserVO> findAllUser() {
		log.info("UserController.userList");
		return userService.findAllUser();
	}
	
	// 회원 리스트 출력(ROLE_ADMIN, ROLE_MANAGER)
	// @Controller를 이용하는 경우
//	@GetMapping("/user/list")
//	public String findAllUser(Model model) {			// Model : html로 가져갈 데이터가 있다면 사용
//		log.info("UserController.userList - model"); 
//		model.addAttribute("user", userService.findAllUser());
//		return "user";
//	}
	  
	// 회원 상세조회(ROLE_USER)
	// @RestController를 이용하는 경우
	@PostMapping("/user/{userNo}")
	public WithoutUserCodeUserVO findByUserNo(@PathVariable int userNo) {	// @PathVariable : 경로 상의 값을 가져올 때 사용 
		log.info("UserController.findByUserNo"); 
		return userService.findByUserNo(userNo);
	}
	
//	@PostMapping("/user/{userNo}")
//	// @Controller를 이용하는 경우
//	public String findByUserNo(@PathVariable int userNo, Model model) {	
//		log.info("UserController.findByUserNo"); 
//		model.addAttribute("user", userService.findByUserNo(userNo));
//		return "user";
//	}
	
	// 회원정보 수정
	@PutMapping("/user/update")
	public UpdateUserVO updateUser(UpdateUserVO updateUserVO) {
		return userService.updateUser(updateUserVO.getUserNo());
	}
	
	
	
}
