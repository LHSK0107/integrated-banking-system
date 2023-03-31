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
public class UserVO {
	
	private int userNo;
	private String userCode;
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
