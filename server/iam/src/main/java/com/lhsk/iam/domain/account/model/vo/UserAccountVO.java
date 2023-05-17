package com.lhsk.iam.domain.account.model.vo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UserAccountVO {

	private int userNo;
	private String acctNo;
	private String bankCd;
}
