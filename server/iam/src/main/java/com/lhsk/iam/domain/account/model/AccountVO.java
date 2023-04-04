package com.lhsk.iam.domain.account.model;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class AccountVO {
	private String acctNo;		// 계좌번호
	private String bankCd;		// 은행코드
	private double bal;			// 잔액
	private String ibType;		// 뱅킹종류
	private String acctDv;		// 계좌구분
	private String loanNm;		// 예금/대출과목명
	private String acctNickNm;	// 계좌별칭
	private double agmtAmt;		// 대출한도/가입금액/약정금액
	private double pyatAmy; 	// 월납입금
	private Date pyatDt;		// 월납입일
	private Date newDt;			// 신규일자
	private Date expiDt;		// 만기일자
	private String repayWay;	// 상환방법
	private double contRt;		// 이자율
	private String dpsvDv;		// 예적금구분
	private String loanKind;	// 대출종류
	private String cltrCtt;		// 담보내역
	private Date intPaytDt;		// 이자납입예정일자
	private String currCd;		// 통화코드
	private double realAmt;		// 출금가능잔액

}
