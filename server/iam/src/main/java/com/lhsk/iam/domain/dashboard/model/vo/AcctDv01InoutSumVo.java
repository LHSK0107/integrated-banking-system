package com.lhsk.iam.domain.dashboard.model.vo;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AcctDv01InoutSumVo {

	private String inoutDv;		// 입출금 구분(1: 입금, 2: 출금)
	private LocalDate trscDt;	// 거래 일자
	private BigDecimal amtSum;	// 거래금액 합계
}
