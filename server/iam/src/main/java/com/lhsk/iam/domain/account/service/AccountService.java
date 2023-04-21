package com.lhsk.iam.domain.account.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.lhsk.iam.domain.account.model.mapper.AccountMapper;
import com.lhsk.iam.domain.account.model.vo.AccountVO;
import com.lhsk.iam.domain.account.model.vo.InoutRequestVO;
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
	public List<InoutVO> findOneInout(InoutRequestVO vo) {
		System.out.println("acctNo : "+vo.getAcctNo());
		System.out.println("startDt : "+vo.getStartDt());
		System.out.println("endDt : "+vo.getEndDt());
		System.out.println("inoutDv : "+vo.getInoutDv());
		System.out.println("sort : "+vo.getSort());
		System.out.println("page : "+vo.getPage());
		System.out.println("pageSize : "+vo.getPageSize());
		System.out.println("isLoan : "+vo.isLoan());
		
		vo.setStart((vo.getPage()-1)*vo.getPageSize());
		List<InoutVO> list = accountMapper.findOneInout(vo);
		
//		InoutVO vo = InoutVO.builder()
//				.acctNo("08205223404013")
//				.bankNm("지우은행")
//				.build();
//		list.add(vo);
//		InoutVO vo1 = InoutVO.builder()
//				.acctNo("08205223404013")
//				.bankNm("지우은행2")
//				.build();
//		list.add(vo1);
		return list;
	}
}
