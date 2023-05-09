package com.lhsk.iam.global.news.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lhsk.iam.global.news.model.vo.NaverNewsVO;
import com.lhsk.iam.global.news.service.NaverNewsService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class NaverNewsController {
	
	private final NaverNewsService naverNewsService;
	
	@GetMapping("/api/news")
	public List<NaverNewsVO> getNews() {
		return naverNewsService.getNews();
	}
}
