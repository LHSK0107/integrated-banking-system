package com.lhsk.iam.domain.account.service;

import java.security.GeneralSecurityException;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.lhsk.iam.domain.account.model.mapper.AccountMapper;
import com.lhsk.iam.domain.account.model.vo.AccountVO;
import com.lhsk.iam.domain.account.model.vo.InoutRequestVO;
import com.lhsk.iam.domain.account.model.vo.InoutVO;
import com.lhsk.iam.global.encrypt.AesGcmEncrypt;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AccountService {
	
	private final AccountMapper accountMapper;
	
	private AesGcmEncrypt aesGcmEncrypt = new AesGcmEncrypt();
	
	@Value("${aes.secret}")
	private String key;
	
// 이미 외부API를 조회하고 DB에 저장했기 때문에 DB에서만 조회하여 찾으면 된다. -> ?
	// 계좌 리스트 (ROLE_ADMIN, ROLE_MANAGER)
	public List<AccountVO> findAllAccount() {
		// accountVO 객체를 accountList에 담아서 리턴
		List<AccountVO> accountList = accountMapper.findAllAccount();
		// accountVO에서 acctNo를 복호화해서 넣음
		for (AccountVO account : accountList) {
			try {
				account.setAcctNo(decryptAcctNo(account));
			} catch (GeneralSecurityException e) {
				throw new RuntimeException("Failed to decrypt acctNo", e); 
			}
		}
		log.info("accountList size: "+accountList.size());
		return accountList;
	}

	public AccountVO findByAcctNo(String acctNo) {
		return accountMapper.findByAcctNo(acctNo);
	}
	
	// 계좌 상세정보
	
	
	// 한 계좌의 거래내역 조회
	public List<InoutVO> findOneInout(InoutRequestVO vo) {
		vo.setStart((vo.getPage()-1)*vo.getPageSize());
		List<InoutVO> list = accountMapper.findOneInout(vo);

		return list;
	}
	
//	---------------------------------------------------------------------------------------
	
	// 계좌번호 복호화
	public String decryptAcctNo(AccountVO account) throws GeneralSecurityException {
		return aesGcmEncrypt.decrypt(account.getAcctNo(), key); 
	}
}
