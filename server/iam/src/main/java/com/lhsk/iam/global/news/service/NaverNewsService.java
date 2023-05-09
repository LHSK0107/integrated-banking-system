package com.lhsk.iam.global.news.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.client.WebClient;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lhsk.iam.global.news.model.vo.NaverNewsVO;

@Service
public class NaverNewsService {
	
	private final WebClient webClient;
	private final ObjectMapper objectMapper;
	
	private String clientId;
	private String clientSecret;
	
	public NaverNewsService(
			@Value("${NAVER_API_CLIENT_ID}") String clientId,
			@Value("${NAVER_API_CLIENT_SECRET}") String clientSecret
			) {
		this.webClient = WebClient.builder()
//				.baseUrl("https://openapi.naver.com/v1/search/news.json?query=webcash&display=10&start=1&sort=date")
				.baseUrl("https://openapi.naver.com")
				.build();
		this.objectMapper = new ObjectMapper();
		this.clientId = clientId;
		this.clientSecret = clientSecret;
	}
	
	public List<NaverNewsVO> getNews() {
		// 파라미터 생성과정
		MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
		params.add("query", "웹케시");
		params.add("display", "10");
		params.add("start", "1");
		params.add("sort", "date");
		
		try {
			String response = webClient.get()
					.uri(uriBuilder ->
							uriBuilder.path("/v1/search/news.json")
							.queryParams(params).build()
					)
					.headers(headers -> {
						headers.add("X-Naver-Client-Id", clientId);
						headers.add("X-Naver-Client-Secret", clientSecret);
					})
					.retrieve().bodyToMono(String.class).block();
			JsonNode jsonNode = objectMapper.readTree(response);
			JsonNode itemNode = jsonNode.get("items");
			List<NaverNewsVO> newsList = new ArrayList<>();
			for (JsonNode newsNode : itemNode) {
				NaverNewsVO news = objectMapper.treeToValue(newsNode, NaverNewsVO.class);
                newsList.add(news);
            }
			return newsList;
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
		
		return null;
	}
	
}
