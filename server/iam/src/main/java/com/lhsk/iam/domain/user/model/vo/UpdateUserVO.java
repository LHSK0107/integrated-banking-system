package com.lhsk.iam.domain.user.model.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
public class UpdateUserVO {
	
	// ※ id, email은 수정 불가
	// 표시 외 필드 값은 관리자(ROLE_MANAGER, ROLE_ADMIN)만이 수정 가능하다.
	private int userNo;			// 수정 불가
	private String userCode;	// ROLE_ADMIN만 수정 가능
	private String password;	// ROLE_USER가 수정 가능한 값
	private String name;
	private String dept;
	private String phone;		// ROLE_USER가 수정 가능한 값
	
	public void setUserCode(String userCode) { this.userCode = userCode; }
	public void setPassword(String password) { this.password = password; }
	public void setName(String name) { this.name = name; }
	public void setDept(String dept) { this.dept = dept; }
	public void setPhone(String phone) { this.phone = phone; }

	
	
}
