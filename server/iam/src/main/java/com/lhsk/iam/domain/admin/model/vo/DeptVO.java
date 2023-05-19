package com.lhsk.iam.domain.admin.model.vo;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class DeptVO {

	private String deptNo;	// 부서 번호 (3자리)
	private String dept;	// 부서 이름 (최대 30자리)
}
