package com.lhsk.iam.domain.user.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lhsk.iam.global.config.auth.PrincipalDetails;

@RestController
public class RestApiController {
	
	@GetMapping("user")
	public String user(Authentication authentication) {
		PrincipalDetails principal = (PrincipalDetails) authentication.getPrincipal();
		System.out.println("principal : " + principal.getUserVO().getId());
		System.out.println("principal : " + principal.getUserVO().getName());
		System.out.println("principal : " + principal.getUserVO().getPassword());

		return "<h1>user</h1>";
	}
	
	@GetMapping("home2")
	public String home2() {
		return "<h1>home2</h1>";
	}
}
