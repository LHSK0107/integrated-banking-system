package com.lhsk.iam.domain.account.model.vo;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InoutRequestVO {
	private int userNo;								// 회원번호
	private String bankCd;							// 은행코드
	private String acctNo;							// 계좌번호
	private LocalDate startDt;						// 시작날짜
	private LocalDate endDt;						// 끝날짜
	private String inoutDv;							// 입출구분
	private String sort;							// 정렬타입
	private int isLoan;								// 대출계좌 여부 0: 예/적금, 1: 대출
	Map<String, String> secret = new HashMap<>();	// API키
	private int ApiPageSize;						// api 페이지당 건수
	private int ApiPage;							// api 조회페이지
	private int pageSize;							// DB 페이지당 건수
	private int page;								// DB 조회페이지
	private int start;
	
}
