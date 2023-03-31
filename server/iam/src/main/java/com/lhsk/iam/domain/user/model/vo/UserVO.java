package com.lhsk.iam.domain.user.model.vo;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import lombok.Data;

@Data
public class UserVO {
	private int user_no;
	private String user_code; // (ROLE_USER or ROLE_ADMIN)
	private String id;
	private String password;
	private String name;
	private String dept;
	private String email;
	private String phone;
	
	public List<String> getUserCodeList() {
		if(this.user_code.length()>0) {
			return Arrays.asList(this.user_code);
		}
		return new ArrayList<>();
			
	}
}
