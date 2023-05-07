package com.lhsk.iam.domain.admin.model.vo;

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
public class MenuClickRequestVO {
	private int allAccount;
	private int inout;
	private int inoutReport;
	private int dailyReport;
	private int dashboard;
}
