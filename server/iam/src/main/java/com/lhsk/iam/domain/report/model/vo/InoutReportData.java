package com.lhsk.iam.domain.report.model.vo;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class InoutReportData {
	private String date;
	private String bankNm;
	private String acctNo;
	private List<InoutReportVO> acctlist;
}
