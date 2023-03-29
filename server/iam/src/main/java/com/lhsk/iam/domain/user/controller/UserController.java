package com.lhsk.iam.domain.user.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
public class UserController {
	
	// 회원 가입 페이지 출력 요청
	@GetMapping("/user/signup")
	public String signupForm() {
		return "signup";
	}
	
	@PostMapping("/user/signup")
	public String signup(@RequestParam("id") String id, 
						@RequestParam("password") String password, 
						@RequestParam("name") String name) {
		log.info("UserController.signup"+id+", "+password+", "+name);
		return "index";
	}
}
