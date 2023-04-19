package com.lhsk.iam.domain.account.model.vo;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/*
 * 요청에 맞게 프론트로 보내줄 VO
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InoutVO {
	private String acctNo;			// 계좌번호
	private String bankNm;			// 은행이름
	private String inoutDv;			// 입,출 구분
	private LocalDate trscDt;		// 거래일자
	private LocalTime trscTm;		// 거래시간
	private BigDecimal trscAmt;		// 거래금액
	private BigDecimal bal;			// 잔액
	private String currCd;			// 통화코드
	private String rmrk1;			// 적요
}
