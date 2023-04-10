package com.lhsk.iam.domain.account.model.vo;

import java.math.BigDecimal;
import java.time.LocalDate;

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
// 수시입출금계좌
public class AccountVO {
	private String acctNo;			// 계좌번호	
	private String bankCd;			// 은행코드 
	private BigDecimal bal;			// 잔액
	private String ibType;			// 뱅킹종류	0:개인, 1:기업
	private String acctDv;			// 계좌구분	01:보통예금, 02:정기예적금, 03:대출금
	private String loanNm;			// 예금/대출과목명
	private String acctNickNm;		// 계좌별칭
	private BigDecimal agmtAmt;		// 대출한도/가입금액/약정금액
	private BigDecimal pyatAmt; 	// 월납입금
	private LocalDate pyatDt;		// 월납입일
	private LocalDate newDt;		// 신규일자
	private LocalDate expiDt;		// 만기일자
	private String repayWay;		// 상환방법	0:일시상환, 1:분할상환, 2:수시상환 
	private BigDecimal contRt;		// 이자율
	private String dpsvDv;			// 예적금구분	'예금', '적금'
	private String loanKind;		// 대출종류	'일반거래', '한도거래'
	private String cltrCtt;			// 담보내역
	private LocalDate intPaytDt;	// 이자납입예정일자
	private String currCd;			// 통화코드
	private BigDecimal realAmt;		// 출금가능잔액

}
