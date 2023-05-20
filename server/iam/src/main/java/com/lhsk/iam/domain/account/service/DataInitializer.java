package com.lhsk.iam.domain.account.service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lhsk.iam.domain.account.api.AccountClient;
import com.lhsk.iam.domain.account.model.mapper.AccountApiMapper;
import com.lhsk.iam.domain.account.model.vo.AccountApiVO;
import com.lhsk.iam.domain.account.model.vo.InoutApiVO;
import com.lhsk.iam.domain.account.model.vo.InoutRequestVO;
import com.lhsk.iam.domain.account.model.vo.UserAccountVO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {
   
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
   @Value("${webCashApi.test}")
   String testStr;
   
   // 프로그램이 처음 시작되면 딱 한 번만 실행되는 메소드
   @PostConstruct
   @Transactional
   public void dataInit() {
      
	  log.info(testStr);
	   
      Map<String, String> secret = new HashMap<>();
      secret.put("apiKey", apiKey);
      secret.put("apiId", inoutId);
      secret.put("orgNo", orgNo);
      secret.put("bizNo", bizNo);
      
      final int PAGE_SIZE = 1000;
        int page = 0;
        
        // 회원별 조회 가능 계좌 리스트 백업
        List<UserAccountVO> info = accountApiMapper.findAllUserAccount();
        // 과거 거래내역 삭제
        accountApiMapper.deleteInoutPast();
        // 금일 거래내역 삭제
        accountApiMapper.deleteInoutToday();
        // 계좌목록 삭제
        accountApiMapper.deleteAccounts();
        // 계좌목록 추가
        List<AccountApiVO> accountList = accountClient.getAccounts();
        accountApiMapper.insertAccounts(accountList);
        // 백업 데이터 재입력
        if (info.size() > 0) accountApiMapper.insertBackupUserAccount(info);
        // 과거 거래내역 추가
        while (true) {
           log.info("inout_past page : "+page);
           List<InoutApiVO> inoutPastList = accountClient.getPastInouts(page,PAGE_SIZE, secret);   // API요청으로 얻은 계좌 목록 JSON
           if (inoutPastList.isEmpty()) {
               break;
           }
           accountApiMapper.insertInoutPast(inoutPastList);
            
           page++;
        }
        // 페이지 초기화
        page = 0;
        // 금일 거래내역 추가
        while (true) {
        	log.info("inout_today page : "+page);
        	// getTodayInouts()의 매개변수 생성
            InoutRequestVO req = new InoutRequestVO();
            int total = accountApiMapper.getTotalToday(LocalDate.now());    		
    		// 요청 VO 생성
    		req.setSecret(secret);
    		req.setApiPageSize(PAGE_SIZE);
    		req.setApiPage(page);
    		// api에서 금일 내역 조회한 결과를 리스트에 담음 
            List<InoutApiVO> inoutTodayList = accountClient.getTodayInouts(req, total);   // API요청으로 얻은 입출금 목록 JSON
            if (inoutTodayList.isEmpty()) {
                break;
            }
            accountApiMapper.insertInoutToday(inoutTodayList);
             
            page++;
         }
        
    }
}