package com.lhsk.iam.domain.report.model.vo;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class InoutReportRequestVO {
	private String bankNm;		// 은행명
	private String bankCd;		// 은행코드
	private String acctNo;		// 계좌번호
	private String startDt;		// 시작날짜
	private String endDt;		// 끝날짜
	private String inoutDv;		// 조회구분 1:입금, 2:출금, 3:전체
}
