package com.lhsk.iam.domain.account.model.vo;

import java.math.BigDecimal;
import java.sql.Date;

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
// 수시입출금계좌
public class AccountApiVO {
	@JsonProperty("ACCT_NO")
	private String acctNo;		// 계좌번호	
	
	@JsonProperty("BANK_CD")
	private String bankCd;		// 은행코드
	
	@JsonProperty("BAL")
	private BigDecimal bal;		// 잔액
	
	@JsonProperty("IB_TYPE")
	private String ibType;		// 뱅킹종류
	
	@JsonProperty("ACCT_DV")
	private String acctDv;		// 계좌구분
	
	@JsonProperty("LOAN_NM")
	private String loanNm;		// 예금/대출과목명
	
	@JsonProperty("ACCT_NICK_NM")
	private String acctNickNm;	// 계좌별칭
	
	@JsonProperty("AGMT_AMT")
	private BigDecimal agmtAmt;		// 대출한도/가입금액/약정금액
	
	@JsonProperty("PYAT_AMT")
	private BigDecimal pyatAmt; 	// 월납입금
	
	@JsonProperty("PYAT_DT")
	private Date pyatDt;		// 월납입일
	
	@JsonProperty("NEW_DT")
	private Date newDt;			// 신규일자
	
	@JsonProperty("EXPI_DT")
	private Date expiDt;		// 만기일자
	
	@JsonProperty("REPAY_WAY")
	private String repayWay;	// 상환방법
	
	@JsonProperty("CONT_RT")
	private BigDecimal contRt;		// 이자율
	
	@JsonProperty("DPSV_DV")
	private String dpsvDv;		// 예적금구분
	
	@JsonProperty("LOAN_KIND")
	private String loanKind;	// 대출종류
	
	@JsonProperty("CLTR_CTT")
	private String cltrCtt;		// 담보내역
	
	@JsonProperty("INT_PAYT_DT")
	private Date intPaytDt;		// 이자납입예정일자
	
	@JsonProperty("CURR_CD")
	private String currCd;		// 통화코드
	
	@JsonProperty("REAL_AMT")
	private BigDecimal realAmt;		// 출금가능잔액
	

}
