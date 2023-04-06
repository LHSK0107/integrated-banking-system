package com.lhsk.iam.domain.account.controller;

import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lhsk.iam.domain.account.api.AccountClient;
import com.lhsk.iam.domain.account.model.vo.AccountApiVO;
import com.lhsk.iam.domain.account.model.vo.AccountVO;
import com.lhsk.iam.domain.account.service.AccountService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/accounts")
public class AccountController {
	
	private final AccountService accountService;
	
	@GetMapping
	public ResponseEntity<List<AccountVO>> getAccountList() {
		List<AccountVO> list;
		list = accountService.findAllAccount();
		
		
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);	// application/json
		
		return new ResponseEntity<>(list, HttpStatus.OK);
	}
	
	@GetMapping("/test")
	public List<AccountApiVO> getAccountsTest() {
		AccountClient accountClient = new AccountClient();
		List<AccountApiVO> list = accountClient.getAccounts();
		return list;
	}
	
	
	
}
