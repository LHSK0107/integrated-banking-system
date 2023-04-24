package com.lhsk.iam.domain.user.model.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserVO {
	
	// ※ id, email은 수정 불가
	// 표시 외 필드 값은 관리자(ROLE_MANAGER, ROLE_ADMIN)만이 수정 가능하다.
	private int userNo;			// 수정 불가
	private String userCode;	// ROLE_ADMIN만 수정 가능
	private String password;	// ROLE_USER가 수정 가능한 값
	private String name;
	private String dept;
	private String phone;		// ROLE_USER가 수정 가능한 값

}
