package com.lhsk.iam.global.news.model.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class NaverNewsVO {
	private String title;
	private String originallink;
	private String link;
	private String description;
	private String pubDate;
}
