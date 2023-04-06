package com.lhsk.iam.domain.account.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.lhsk.iam.domain.account.api.AccountClient;
import com.lhsk.iam.domain.account.model.mapper.AccountApiMapper;
import com.lhsk.iam.domain.account.model.vo.AccountApiVO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

//외부 API를 호출하여 받아온 계좌 목록을 DB에 저장하는 클래스
@Service
@RequiredArgsConstructor
@Slf4j
public class AccountDataImporter {
	
	private final AccountClient accountClient;
	private final AccountApiMapper accountApiMapper;
	// 주기적으로 table의 데이터를 delete하고 새로 insert 진행
	@Scheduled(fixedDelay = 1000)
	public void insertAccount() {
		log.info("insertAccount @Scheduled");
		// API요청으로 얻은 계좌 목록 JSON
		List<AccountApiVO> list = accountClient.getAccounts();
		
		// table delete
		accountApiMapper.deleteAccounts();
		
		
		// table insert
		accountApiMapper.insertAccounts(list);
	}
}
