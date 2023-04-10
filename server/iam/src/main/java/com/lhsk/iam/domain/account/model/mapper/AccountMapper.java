package com.lhsk.iam.domain.account.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.lhsk.iam.domain.account.model.vo.AccountVO;

@Mapper
public interface AccountMapper {
	
	List<AccountVO> findAllAccount();
	AccountVO findByAcctNo(String acctNo);
}
