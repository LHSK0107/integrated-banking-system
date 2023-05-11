package com.lhsk.iam.domain.dashboard.model.vo;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AcctDvByBalSumVO {
	private String acctDv;		// 계좌 구분(01: 수시 입출금, 02: 예적금, 03: 대출)
	private BigDecimal balSum;	// 잔액 합계
}
