package com.lhsk.iam.domain.account.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.lhsk.iam.domain.account.model.mapper.AccountMapper;
import com.lhsk.iam.domain.account.model.vo.AccountVO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AccountService {
	
	private final AccountMapper accountMapper;
	
	// 이미 외부API를 조회하고 DB에 저장했기 때문에 DB에서만 조회하여 찾으면 된다. -> ?
	public List<AccountVO> findAllAccount() {
		return accountMapper.findAllAccount();
	}
	
}
