package com.lhsk.iam.domain.account.model.vo;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InoutRequestVO {
	private String acctNo;							// 계좌번호
	private LocalDate startDt;						// 시작날짜
	private LocalDate endDt;						// 끝날짜
	private String inoutDv;							// 입출구분
	private String sort;							// 정렬타입
	Map<String, String> secret = new HashMap<>();	// API키
	private int pageSize;							// 페이지당 건수
	private int page;								// 조회페이지
}
