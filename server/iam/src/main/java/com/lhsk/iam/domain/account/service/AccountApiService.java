package com.lhsk.iam.domain.account.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.lhsk.iam.domain.account.api.AccountClient;
import com.lhsk.iam.domain.account.model.mapper.AccountApiMapper;
import com.lhsk.iam.domain.account.model.vo.InoutApiVO;
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
     *  클라이언트로부터 입출내역 요청을 받았을때 오늘이 포함되어 있다면
     */
	public void updateInoutToday(InoutRequestVO req) {
		Map<String, String> secret = new HashMap<>();
		secret.put("apiKey", apiKey);
		secret.put("apiId", inoutId);
		secret.put("orgNo", orgNo);
		secret.put("bizNo", bizNo);	
		
		final int PAGE_SIZE = 1000;
		int page = 0;
		
		/*
		 *  DB에서 조회한 totalCnt
		 *  새로운 거래내역이 있는지 체크하기 위함
		 */
		
		// 요청 VO 생성
		req.setSecret(secret);
		req.setApiPageSize(PAGE_SIZE);
		req.setApiPage(page);
		
		
		/*
		 *   금일 내역을 조회함
		 *   만약 같이 넘겨준 total과 조회해서 나온 total이 같을 경우, 아무 작업도 하지 않음
		 */
		List<InoutApiVO> inoutTodayList = new ArrayList<>();
		// inoutTodayList에 1페이지씩 거래내역을 저장
		while (true) {
			int total = accountApiMapper.getTotal(req.getEndDt());
			List<InoutApiVO> list = accountClient.getTodayInouts(req, total);   // API요청으로 얻은 계좌 목록 JSON
			if (list.isEmpty()) {
			    break;
			}
			inoutTodayList.addAll(list);
			req.setPage(req.getPage()+1);
		}
		
		// 새롭게 추가된 내역이 없으면 return
		if(inoutTodayList.size() == 0) return;
		
		// 모두 담았으면 DB에 입력후 메소드 종료
		accountApiMapper.insertInoutToday(inoutTodayList);
	}
	
}
