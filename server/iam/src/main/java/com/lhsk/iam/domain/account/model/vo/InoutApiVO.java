package com.lhsk.iam.domain.account.model.vo;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDate;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class InoutApiVO {
	private BigInteger trscNo;		// 거래번호
	
	@JsonProperty("ACCT_NO")
	private String acctNo;			// 계좌번호
	
	@JsonProperty("BANK_CD")
	private String bankCd;			// 은행코드
	
	@JsonProperty("INOUT_DV")
	private String inoutDv;			// 입,출 구분
	
	@JsonProperty("TRSC_DT")
	private String trscDtApi;
	private LocalDate trscDt;		// 거래일자
	
	@JsonProperty("TRSC_TM")
	private String trscTmApi;
	private LocalTime trscTm;		// 거래시간
	
	@JsonProperty("BAL")
	private BigDecimal bal;			// 잔액
	
	@JsonProperty("RMRK1")
	private String rmrk1;			// 적요
	
	@JsonProperty("TRSC_AMT")
	private BigDecimal trscAmt;		// 거래금액
	
	@JsonProperty("CURR_CD")
	private String currCd;			// 통화코드
	
}
