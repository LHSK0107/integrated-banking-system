package com.lhsk.iam.domain.account.model.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
// 관리자의 계좌 조회 권한 부여 페이지에서 할 때, 정보 재가공을 위해 사용
public class GrantAccountVO {
	
	private int userNo;				// 회원번호
	private String acctDv;			// 계좌구분	01:보통예금, 02:정기예적금, 03:대출금
	private String acctNo;			// 계좌번호	
	private String bankCd;			// 은행코드 
	private String acctNickNm;		// 계좌별칭
}
