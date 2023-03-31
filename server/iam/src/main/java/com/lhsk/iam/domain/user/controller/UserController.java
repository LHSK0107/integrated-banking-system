package com.lhsk.iam.domain.user.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import com.lhsk.iam.domain.user.model.vo.UserVO;
import com.lhsk.iam.domain.user.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
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
	public String signup(@ModelAttribute UserVO userVO) {
		log.info("UserController.signup");
		log.info("userVO"+userVO);
		userService.signup(userVO);
		return "index";
	}
	
	
}
