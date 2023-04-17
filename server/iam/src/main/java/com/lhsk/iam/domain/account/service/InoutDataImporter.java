package com.lhsk.iam.domain.account.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

//import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lhsk.iam.domain.account.api.AccountClient;
import com.lhsk.iam.domain.account.model.mapper.AccountApiMapper;
import com.lhsk.iam.domain.account.model.vo.InoutApiVO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

// 외부 API를 호출하여 받아온 입출금내역을 DB에 저장하는 클래스
@Service
@RequiredArgsConstructor
@Slf4j
public class InoutDataImporter {

	private final AccountClient accountClient;
	private final AccountApiMapper accountApiMapper;
	@Value(value = "${webCashApi.key}") 
	String apiKey;
	@Value(value = "${webCashApi.inoutId}") 
	String inoutId;
	@Value(value = "${webCashApi.orgNo}") 
	String orgNo;
	@Value(value = "${webCashApi.bizNo}") 
	String bizNo;
	
	
	// 과거 내역테이블을 초기화 시켜주는 메소드 (스프링이 켜질 때 딱 한번만 실행되는 메소드)
	// 과거부터 어제까지의 입출금 내역을 조회하여 DB에 추가
//	@PostConstruct
	@Transactional
	public void inoutPastTableInit() {
		
		Map<String, String> secret = new HashMap<>();
		secret.put("apiKey", apiKey);
		secret.put("apiId", inoutId);
		secret.put("orgNo", orgNo);
		secret.put("bizNo", bizNo);
		
		final int PAGE_SIZE = 1000;
        int page = 0;
        accountApiMapper.deleteInoutPast();
        while (true) {
        	log.info("page : "+page);
//            List<InoutApiVO> list = accountClient.fetchTransactionsFromApi(page, PAGE_SIZE).collectList().block();
        	List<InoutApiVO> list = accountClient.getPastInouts(page,PAGE_SIZE, secret);
            if (list.isEmpty()) {
                break;
            }
            accountApiMapper.insertInoutPast(list);
            
            page++;
        }
	}
	
	// inout_today 테이블을 주기적으로 갱신시켜주는 메소드
	public void insertTodayInout() {
		
	}
	
}
