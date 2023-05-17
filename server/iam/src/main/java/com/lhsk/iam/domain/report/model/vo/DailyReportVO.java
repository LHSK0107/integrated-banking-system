package com.lhsk.iam.domain.report.model.vo;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class DailyReportVO {
	private String date;
	private String time;
	private BigDecimal allInoutAcctBal;
	private BigDecimal allTimeAcctBal;
	private BigDecimal allLoanAcctBal;
	private List<DailyInoutAcctReportVO> inoutAcctList;
	private List<TimeAcctReportVO> timeAcctList;
	private List<LoanAcctReportVO> loanAcctList;
	
	
}
