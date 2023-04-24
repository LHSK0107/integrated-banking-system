package com.lhsk.iam.domain.account.service;

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
   
   // 프로그램이 처음 시작되면 딱 한 번만 실행되는 메소드
//   @PostConstruct
   @Transactional
   public void dataInit() {
      
      Map<String, String> secret = new HashMap<>();
      secret.put("apiKey", apiKey);
      secret.put("apiId", inoutId);
      secret.put("orgNo", orgNo);
      secret.put("bizNo", bizNo);
      
      final int PAGE_SIZE = 1000;
        int page = 0;
        
        
        
        // 거래내역 삭제
        accountApiMapper.deleteInoutPast();
        // 계좌목록 삭제
        accountApiMapper.deleteAccounts();
        // 계좌목록 추가
        List<AccountApiVO> accountList = accountClient.getAccounts();
        accountApiMapper.insertAccounts(accountList);
        // 과거 거래내역 추가
        while (true) {
           log.info("page : "+page);
           List<InoutApiVO> inoutPastList = accountClient.getPastInouts(page,PAGE_SIZE, secret);   // API요청으로 얻은 계좌 목록 JSON
           if (inoutPastList.isEmpty()) {
               break;
           }
           accountApiMapper.insertInoutPast(inoutPastList);
            
           page++;
        }
    }
}