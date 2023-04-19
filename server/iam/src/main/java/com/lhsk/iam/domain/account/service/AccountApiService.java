package com.lhsk.iam.domain.account.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.lhsk.iam.domain.account.api.AccountClient;
import com.lhsk.iam.domain.account.model.mapper.AccountApiMapper;
import com.lhsk.iam.domain.account.model.vo.InoutRequestVO;
import com.lhsk.iam.domain.account.model.vo.InoutVO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AccountApiService {
	
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
	
    /*
     *  클라이언트로부터 입출내역 요청을 받았을때 리스트를 리턴
     */
	public void updateInoutToday(
			String acctNo,
			LocalDate startDate,
			LocalDate endDate,
			String inoutDv,
			String sort
			) {
		Map<String, String> secret = new HashMap<>();
		secret.put("apiKey", apiKey);
		secret.put("apiId", inoutId);
		secret.put("orgNo", orgNo);
		secret.put("bizNo", bizNo);	
		
		List<InoutVO> inouts = new ArrayList<>();
		final int PAGE_SIZE = 1000;
		int page = 0;
		
		/*
		 *  DB에서 조회한 totalCnt
		 *  새로운 거래내역이 있는지 체크하기 위함
		 */
		int total = accountApiMapper.getTotal(endDate);
		
		
		
		
		// 요청 VO 생성
		InoutRequestVO req = InoutRequestVO.builder()
				.acctNo(acctNo)
				.startDt(startDate)
				.endDt(endDate)
				.inoutDv(inoutDv)
				.sort(sort)
				.secret(secret)
				.pageSize(PAGE_SIZE)
				.page(page)
				.build();
		
		// 
		accountClient.getTodayInouts(req, total);
		
	}
	

}
