package com.lhsk.iam.domain.account.api;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.transaction.Transaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lhsk.iam.domain.account.model.vo.AccountApiVO;
import com.lhsk.iam.domain.account.model.vo.InoutApiVO;

import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;

// 외부 API 호출을 담당하는 클래스
@Component
@Slf4j
public class AccountClient {
	
	private final WebClient webClient;
	private final ObjectMapper objectMapper;
	private DataProcessor dataProcessor;
	
	@Value("${webCashApi.allAccounts}")
	private String ALLACCOUNTS;
	
	
	
	// 생성자를 통해 baseUrl을 지정해준다.
	@Autowired
	public AccountClient(@Value("${webCashApi.url}") String apiUrl, 
						@Value("${webCashApi.cookieKey}") String cookieKey,
						@Value("${webCashApi.cookieValue}") String cookieValue) {
        this.webClient = WebClient.builder()
                .baseUrl(apiUrl)
                .defaultCookie(cookieKey, cookieValue)
                .build();
        this.objectMapper = new ObjectMapper();
        this.dataProcessor = new DataProcessor();
    }
	
	// 계좌목록을 가져오는 메소드
	public List<AccountApiVO> getAccounts() {
		try {
			// baseUrl을 지정해줬고, 다른 url로 요청을 보낼 일이 없기 때문에 url()을 작성할 필요가 없다.
            String response = webClient.post()
            		.contentType(MediaType.APPLICATION_JSON)
            		.body(BodyInserters.fromValue(ALLACCOUNTS))
                    .retrieve()					// HTTP 요청을 보내고 응답을 받아온다.
                    .bodyToMono(String.class)	// 응답 바디를 Mono<String> 형태로 변환
                    // Mono가 발행하는 데이터를 구독하여 최종 데이터를 반환, Mono를 블로킹하여 스트림의 처리를 동기적으로 수행
                    .block();
            JsonNode jsonNode = objectMapper.readTree(response);	// JsonNode로 파싱
            JsonNode recNode = jsonNode.get("RESP_DATA").get("REC");
            List<AccountApiVO> accounts = new ArrayList<>();
            for (JsonNode accountNode : recNode) {
                AccountApiVO account = objectMapper.treeToValue(accountNode, AccountApiVO.class);
                account = dataProcessor.valCheck(account);
                accounts.add(account);
            }
            return accounts;
        } catch (WebClientResponseException e) {
            throw new RuntimeException("Failed to get accounts", e);                                                    
        } catch (IOException e) {
            throw new RuntimeException("Failed to parse response", e);
        }
	}
	
	
	// 과거의 거래내역을 가져오는 메소드
	// 2000년 1월 1일부터 어제까지의 입출금 내역을 조회
	// 한번에 1000건의 데이터만 조회가능
//	public Flux<InoutApiVO> fetchTransactionsFromApi(int page, int pageSize) {
//			String startDate = "10000101";
//			String endDate = LocalDate.now().minusDays(1).format(DateTimeFormatter.BASIC_ISO_DATE);
//			
//			Map<String, Object> reqData = new HashMap<>();
//			reqData.put("INQ_STR_DT", startDate);
//			reqData.put("INQ_END_DT", endDate);
//			reqData.put("PAGE_CNT", pageSize);
//			reqData.put("INQ_PAGE_NO", page);
//			
//		    Map<String, Object> requestBody = new HashMap<>();
//		    requestBody.put("API_KEY", secret.get("apiKey"));
//		    requestBody.put("API_ID", secret.get("apiId"));
//		    requestBody.put("ORG_NO", secret.get("orgNo"));
//		    requestBody.put("BIZ_NO", secret.get("bizNo"));
//		    requestBody.put("REQ_DATA", reqData);
//        Flux<InoutApiVO> list = webClient.post()
//                .contentType(MediaType.APPLICATION_JSON)
//                .bodyValue(requestBody.toString())
//                .retrieve()
//                .bodyToFlux(InoutApiVO.class);
//        
//        list.subscribe(value -> System.out.println("value : " + value));
//        
//        return list;
//    }
	
	public List<InoutApiVO> getPastInouts(int page, int pageSize, Map<String, String> secret) {
		
		// ReqeustBody 생성하는 과정
		String startDate = "10000101";
		String endDate = LocalDate.now().minusDays(1).format(DateTimeFormatter.BASIC_ISO_DATE);
		
		Map<String, Object> reqData = new HashMap<>();
		reqData.put("INQ_STR_DT", startDate);
		reqData.put("INQ_END_DT", endDate);
		reqData.put("PAGE_CNT", pageSize);
		reqData.put("INQ_PAGE_NO", page);
		
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("API_KEY", secret.get("apiKey"));
        requestBody.put("API_ID", secret.get("apiId"));
        requestBody.put("ORG_NO", secret.get("orgNo"));
        requestBody.put("BIZ_NO", secret.get("bizNo"));
        requestBody.put("REQ_DATA", reqData);
        
		try {
			// Map을 Json형태로 바꿔주는 작업
			String jsonRequest = objectMapper.writeValueAsString(requestBody);
			// baseUrl을 지정해줬고, 다른 url로 요청을 보낼 일이 없기 때문에 url()을 작성할 필요가 없다.
            String response = webClient.post()
            		.contentType(MediaType.APPLICATION_JSON)
            		.body(BodyInserters.fromValue(jsonRequest))
                    .retrieve()					// HTTP 요청을 보내고 응답을 받아온다.
                    .bodyToMono(String.class)	// 응답 바디를 Mono<String> 형태로 변환
                    // Mono가 발행하는 데이터를 구독하여 최종 데이터를 반환, Mono를 블로킹하여 스트림의 처리를 동기적으로 수행
                    .block();
            JsonNode jsonNode = objectMapper.readTree(response);	// JsonNode로 파싱
            JsonNode recNode = jsonNode.get("RESP_DATA").get("REC");
            List<InoutApiVO> list = new ArrayList<>();
            for (JsonNode inoutNode : recNode) {
            	InoutApiVO inout = objectMapper.treeToValue(inoutNode, InoutApiVO.class);
            	inout = dataProcessor.valCheck(inout);
            	list.add(inout);
            }
            return list;
        } catch (WebClientResponseException e) {
            throw new RuntimeException("Failed to get accounts", e);                                                    
        } catch (IOException e) {
            throw new RuntimeException("Failed to parse response", e);
        }
	}
	
}
