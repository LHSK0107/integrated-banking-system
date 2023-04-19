package com.lhsk.iam.domain.account.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.lhsk.iam.domain.account.model.mapper.AccountMapper;
import com.lhsk.iam.domain.account.model.vo.AccountVO;
import com.lhsk.iam.domain.account.model.vo.InoutVO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AccountService {
	
	private final AccountMapper accountMapper;
	
// 이미 외부API를 조회하고 DB에 저장했기 때문에 DB에서만 조회하여 찾으면 된다. -> ?
	// 계좌 리스트 (ROLE_ADMIN, ROLE_MANAGER)
	public List<AccountVO> findAllAccount() {
		// accountVO 객체를 accountList에 담아서 리턴
		List<AccountVO> accountList = accountMapper.findAllAccount();
		log.info("accountList size: "+accountList.size());
		return accountList;
	}

	public AccountVO findByAcctNo(String acctNo) {
		return accountMapper.findByAcctNo(acctNo);
	}
	
	// 계좌 상세정보
	
	
	// 거래내역 조회
	public List<InoutVO> findInouts() {
		
		return null;
	}
}
