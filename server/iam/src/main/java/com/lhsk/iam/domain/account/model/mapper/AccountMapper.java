package com.lhsk.iam.domain.account.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.lhsk.iam.domain.account.model.vo.AccountVO;
import com.lhsk.iam.domain.account.model.vo.InoutRequestVO;
import com.lhsk.iam.domain.account.model.vo.InoutVO;

@Mapper
public interface AccountMapper {
	
	List<AccountVO> findAllAccount();
	AccountVO findByAcctNo(String acctNo);
	List<InoutVO> findOneInout(InoutRequestVO vo);
	List<String> findAvailableAcct(int userNo);
}
