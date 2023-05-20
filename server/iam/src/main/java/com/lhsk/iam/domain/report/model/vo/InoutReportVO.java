package com.lhsk.iam.domain.report.model.vo;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class InoutReportVO {
	
	private String bankCd;			// 은행코드
	private String acctNo;			// 계좌번호
	private BigDecimal beforeBal;	// 이전잔액
	private int inCnt;				// 입금건수
	private BigDecimal inSum;		// 총 입금액
	private int outCnt;				// 출금건수
	private BigDecimal outSum;		// 총 출금액
	private BigDecimal afterBal;	// 이후잔액
	
}
