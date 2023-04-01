package com.lhsk.iam.domain.user.model.vo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UpdateUserVO {
	
	private int userNo;
	private String password;
	private String name;
	private String dept;
	private String email;
	private String phone;

}
