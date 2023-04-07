package com.lhsk.iam.domain.account.api;

import java.io.IOException;
import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
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

import lombok.extern.slf4j.Slf4j;

// 외부 API 호출을 담당하는 클래스
@Component
@Slf4j
public class AccountClient {
	
	private final WebClient webClient;
	private final ObjectMapper objectMapper;
	private DataProcessor dataProcessor;
	
	@Value("${webCashApi.cookie}")
	private String COOKIE;
	@Value("${webCashApi.allAccounts}")
	private String ALLACCOUNTS;
	
	// 생성자를 통해 baseUrl을 지정해준다.
	@Autowired
	public AccountClient(@Value("${webCashApi.url}") String apiUrl) {
        this.webClient = WebClient.builder()
                .baseUrl(apiUrl)
                .build();
        this.objectMapper = new ObjectMapper();
        this.dataProcessor = new DataProcessor();
    }
	
	public List<AccountApiVO> getAccounts() {
		try {
			// baseUrl을 지정해줬고, 다른 url로 요청을 보낼 일이 없기 때문에 url()을 작성할 필요가 없다.
            String response = webClient.post()
            		.contentType(MediaType.APPLICATION_JSON)
            		.header("Cookie", COOKIE)
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

}
