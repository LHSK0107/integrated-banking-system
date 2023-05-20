package com.lhsk.iam.domain.report.model.vo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class InoutReportRequestVO {
	private int userNo;
	private String bankCd;		// 은행코드
	private String acctNo;		// 계좌번호
	private String startDt;		// 시작날짜
	private String endDt;		// 끝날짜
}
