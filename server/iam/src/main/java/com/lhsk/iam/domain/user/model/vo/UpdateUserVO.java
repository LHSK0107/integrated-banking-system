package com.lhsk.iam.domain.user.model.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserVO {
	
	private int userNo;
	private String userCode;
	private String password;
	private String name;
	private String dept;
	private String email;
	private String phone;

}
