package com.lhsk.iam.domain.user.model.vo;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

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
@JsonIgnoreProperties
public class UserVO {
	
	private int userNo;
	private String userCode;
	private String id;
	private String password;
	private String name;
	private String dept;
	private String email;
	private String phone;
	

	public List<String> getUserCode() {
		if(this.userCode.length()>0) {
			return Arrays.asList(this.userCode);
		}
		return new ArrayList<>();
			
	}
}