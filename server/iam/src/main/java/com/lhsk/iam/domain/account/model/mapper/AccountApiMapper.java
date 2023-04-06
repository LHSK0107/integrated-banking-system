package com.lhsk.iam.domain.account.model.mapper;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AccountApiMapper {
	
	public int isEmptyAccountTable();
	public void insertAccount();
}
