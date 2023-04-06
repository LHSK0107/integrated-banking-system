package com.lhsk.iam.domain.account.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.lhsk.iam.domain.account.model.vo.AccountApiVO;

@Mapper
public interface AccountApiMapper {
	
	public int isEmptyAccountTable();
	public void insertAccounts(List<AccountApiVO> list);
	public void deleteAccounts();
}
