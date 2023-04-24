package com.lhsk.iam.domain.user.model.vo;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UserVO {

	private int userNo;
	private String userCode;
	private String id;
	private String password;
	private String name;
	private String dept;
	private String email;
	private String phone;
	
	// 회원번호(userNo)는 setter를 통한 접근을 제한한다.
	public void setUserCode(String userCode) { this.userCode = userCode; }
	public void setId(String id) { this.id = id; }
	public void setPassword(String password) { this.password = password; }
	public void setName(String name) { this.name = name; }
	public void setDept(String dept) { this.dept = dept; }
	public void setEmail(String email) { this.email = email; }
	public void setPhone(String phone) { this.phone = phone; }
	
	public List<String> getUserCodeList() {
		if(this.userCode.length()>0) {
			return Arrays.asList(this.userCode);
		}
		return new ArrayList<>();
	}
	
}