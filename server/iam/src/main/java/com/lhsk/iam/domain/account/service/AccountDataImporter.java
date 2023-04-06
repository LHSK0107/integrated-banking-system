package com.lhsk.iam.domain.account.service;

import java.util.List;

import com.lhsk.iam.domain.account.api.AccountClient;
import com.lhsk.iam.domain.account.model.mapper.AccountApiMapper;
import com.lhsk.iam.domain.account.model.vo.AccountApiVO;

import lombok.RequiredArgsConstructor;

//외부 API를 호출하여 받아온 계좌 목록을 DB에 저장하는 클래스
@RequiredArgsConstructor
public class AccountDataImporter {
	
	private final AccountClient accountClient;
	private final AccountApiMapper accountApiMapper;
	
	// 주기적으로 table의 데이터를 delete하고 새로 insert 진행
	public void insertAccount() {
		// API요청으로 얻은 계좌 목록 JSON
		List<AccountApiVO> list = accountClient.getAccounts();
		
		// table delete
		accountApiMapper.deleteAccounts();
		
		
		// table insert
		list = accountClient.getAccounts();
	}
}
