package com.lhsk.iam.domain.user.model.vo;

import lombok.Getter;

@Getter
public class DetailUserVO {
	
	// password를 제외한 값만 조회된다.
	private int userNo;			// ROLE_USER에게는 보여지지 않는다.
	private String userCode;	
	private String name;
	private String dept;
	private String email;
	private String phone;
	
}
