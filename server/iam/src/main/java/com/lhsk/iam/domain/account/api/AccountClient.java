package com.lhsk.iam.domain.account.api;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.transaction.Transaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.lhsk.iam.domain.account.model.vo.AccountApiVO;
import com.lhsk.iam.domain.account.model.vo.InoutApiVO;
import com.lhsk.iam.domain.account.model.vo.InoutRequestVO;

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
						@Value("${webCashApi.cookieValue}") String cookieValue,
						Environment env) {
        this.webClient = WebClient.builder()
                .baseUrl(apiUrl)
                .defaultCookie(cookieKey, cookieValue)
                .build();
        this.objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        this.dataProcessor = new DataProcessor(env);
        
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
        } catch (GeneralSecurityException e) {
        	throw new RuntimeException("Failed to encrypt accounts", e);
		}
	}
	
	// 과거의 입출내역을 조회
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
        } catch (GeneralSecurityException e) {
            throw new RuntimeException("Failed to encrypt accounts", e);
		}
	}
	
	// 금일 입출내역을 조회
	public List<InoutApiVO> getTodayInouts(InoutRequestVO vo, int total) {
		
		Map<String, String> secret = vo.getSecret();
		
		String date = LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE);
		
		Map<String, Object> reqData = new HashMap<>();
		reqData.put("INQ_STR_DT", date);
		reqData.put("INQ_END_DT", date);
		reqData.put("PAGE_CNT", vo.getApiPageSize());
		reqData.put("INQ_PAGE_NO", vo.getApiPage());
		
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("API_KEY", secret.get("apiKey"));
        requestBody.put("API_ID", secret.get("apiId"));
        requestBody.put("ORG_NO", secret.get("orgNo"));
        requestBody.put("BIZ_NO", secret.get("bizNo"));
        requestBody.put("REQ_DATA", reqData);
        
		try {
			String jsonRequest = objectMapper.writeValueAsString(requestBody);
            String response = webClient.post()
            		.contentType(MediaType.APPLICATION_JSON)
            		.body(BodyInserters.fromValue(jsonRequest))
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
            JsonNode jsonNode = objectMapper.readTree(response);
            // 토탈 카운트를 뽑아낸다.
            JsonNode totalCntJson = jsonNode.get("RESP_DATA").get("TOT_CNT");
//            int totalCnt = Integer.parseInt(totalCntJson.toString());
            int totalCnt = totalCntJson.asInt();
            log.info("total : " + total);
            log.info("totalCnt : " + totalCnt);
            
            List<InoutApiVO> list = new ArrayList<>();
            if(total!=totalCnt) {
            	int cnt = totalCnt - total;	// 반복문을 돌려야하는 횟수
            	JsonNode recNode = jsonNode.get("RESP_DATA").get("REC");
            	if(cnt > 1000) {
            		// Api조회시 최대 1천개만 가능하기 때문에 차이가 1000이 넘어가면 1천개만 넣는다.
            		for(int i = 0; i < 1000; i++) {
            			InoutApiVO inout = objectMapper.treeToValue(recNode.get(i), InoutApiVO.class);
            			if(inout != null) {
            				inout = dataProcessor.valCheck(inout);
            				list.add(inout);
            			} else {
            				break;
            			}
            		}
            	} else {
            		// 1000 이하라면 total의 차이만큼만 넣어주면 된다.
            		for(int i = 0; i < cnt; i++) {
            			InoutApiVO inout = objectMapper.treeToValue(recNode.get(i), InoutApiVO.class);
            			if(inout != null) {
            				inout = dataProcessor.valCheck(inout);
            				list.add(inout);
            			} else {
            				break;
            			}
            		}
            	}
            }
            
            return list;
        } catch (WebClientResponseException e) {
            throw new RuntimeException("Failed to get accounts", e);                                                    
        } catch (IOException e) {
            throw new RuntimeException("Failed to parse response", e);
        } catch (GeneralSecurityException e) {
        	throw new RuntimeException("Failed to encrypt accounts", e);
		}
	}
	
}
