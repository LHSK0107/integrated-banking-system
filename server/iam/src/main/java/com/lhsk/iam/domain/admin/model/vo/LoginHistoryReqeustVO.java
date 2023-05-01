package com.lhsk.iam.domain.admin.model.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginHistoryReqeustVO {
	private int page;		// 프론트에서 볼 페이지 (1페이지부터 시작)
	private int pageSize;	// 한 페이지에서 볼 건수
	private int start;		// LIMIT에서 첫번째 파라미터값 (start-1) * pageSize
	private String sort;	// 정렬기준
	private String name;	// 검색대상
}
