package com.lhsk.iam.domain.report.model.vo;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class DailyInoutAcctReportVO {
	
	private String bankNm;			// 은행이름
	private String acctNo;			// 계좌번호
	private String acctNickNm;		// 계좌별칭
	private int outCnt;				// 출금건수
	private BigDecimal totalOut;	// 출금액
	private int inCnt;				// 입금건수
	private BigDecimal totalIn;		// 입금액
	private BigDecimal agmtAmt;		// 대출한도
	private BigDecimal bal;			// 잔액
	private BigDecimal realAmt;		// 출금가능잔액
}
