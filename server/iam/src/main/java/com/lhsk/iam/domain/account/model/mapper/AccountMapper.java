package com.lhsk.iam.domain.account.model.mapper;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.lhsk.iam.domain.account.model.vo.AccountVO;
import com.lhsk.iam.domain.account.model.vo.InoutRequestVO;
import com.lhsk.iam.domain.account.model.vo.InoutVO;

@Mapper
public interface AccountMapper {
	
	// 전체 계좌정보 조회
	List<AccountVO> findAllAccount();
	// 특정 회원이 조회 가능한 계좌정보 리스트
	List<AccountVO> findAvailableAccount(int userNo);
	// 해당 계좌에 접근(조회) 가능한 사용자인지 확인
	int checkByAcctNoToAccessibleUser(HashMap<String, Object> userInfo);
	// 특정 계좌의 입출금 조회
	List<InoutVO> findOneInout(InoutRequestVO vo);
	// 은행 코드 & 은행 이름 리스트
	Map<String, String> findAllBankCodeAndBankName();
	// 특정 은행 코드에 대응되는 은행 이름 조회
	String findByBankCodeToBankName(String bankCd);
	
	
}
