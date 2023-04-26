package com.lhsk.iam.domain.account.service;

import java.security.GeneralSecurityException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.lhsk.iam.domain.account.model.mapper.AccountMapper;
import com.lhsk.iam.domain.account.model.vo.AccountVO;
import com.lhsk.iam.domain.account.model.vo.InoutRequestVO;
import com.lhsk.iam.domain.account.model.vo.InoutVO;
import com.lhsk.iam.domain.user.service.UserService;
import com.lhsk.iam.global.config.jwt.JwtPermissionVerifier;
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
	@Value("${aes.iv}")
	private String ivString;
	
	private byte[] iv = new byte[12];
	
// ※ 이미 외부API를 조회하고 DB에 저장했기 때문에 DB에서만 조회하여 찾으면 된다. -> ?
	
	// 계좌 리스트 (ROLE_ADMIN, ROLE_MANAGER)
	public List<AccountVO> findAllAccount() {
		// accountVO 객체를 accountList에 담아서 리턴
		List<AccountVO> accountList = accountMapper.findAllAccount();
		// accountVO에서 acctNo를 복호화 시킴
		for (AccountVO account : accountList) {
			try {
				account.setAcctNo(aesGcmEncrypt.decrypt(account.getAcctNo(), key));
			} catch (GeneralSecurityException e) {
				throw new RuntimeException("Failed to decrypt acctNo", e); 
			}
		}
		log.info("accountList size: "+accountList.size());
		return accountList;
	}

	// 특정 계좌 상세정보
	public AccountVO findByAcctNo(String acctNo) {
		try {
			// acctNo를 암호화 하여 동일한 값을 가진 계좌정보 조회 
			ivToByteArray(ivString);
			AccountVO account = accountMapper.findByAcctNo(aesGcmEncrypt.encrypt(acctNo, key, iv));
			// DB에서 가져온 정보 중, 계좌번호를 평문으로 복호화
			account.setAcctNo(aesGcmEncrypt.decrypt(account.getAcctNo(), key));
			return account;
		} catch (GeneralSecurityException e) {
			throw new RuntimeException("Failed to encrypt acctNo", e); 
		}
	}
	
	// 한 계좌의 거래내역 조회
	public List<InoutVO> findOneInout(InoutRequestVO vo) {
		vo.setStart((vo.getPage()-1)*vo.getPageSize());
		List<InoutVO> list = accountMapper.findOneInout(vo);
		// 거래 내역에서 계좌번호 복호화
		for (InoutVO inout : list) {
			try {
				inout.setAcctNo(aesGcmEncrypt.decrypt(inout.getAcctNo(), key));
			} catch (GeneralSecurityException e) {
				throw new RuntimeException("Failed to encrypt acctNo", e); 
			}
		}
		return list;
	}
	
	// 특정 사용자의 조회 가능한 계좌 리스트 
	public List<AccountVO> findAllAvailableAccount(int userNo) {
		// 회원번호를 토대로 해당 회원이 열람 가능한 계좌번호 목록 조회
		List<String> acctNoList = accountMapper.findAvailableAccount(userNo);
		List<AccountVO> accountList = new ArrayList<AccountVO>();
		
		for (String acctNo : acctNoList) {
			try {
				// 암호화 되어 저장된 계좌번호를 다시 복호화
				acctNo = aesGcmEncrypt.decrypt(acctNo, key);
				// 해당 계좌의 정보를 accountList에 추가
				accountList.add(accountMapper.findByAcctNo(acctNo));
				
			} catch (GeneralSecurityException e) {
				throw new RuntimeException("Failed to decrypt acctNo", e); 
			}
		}
		return accountList;
	}
	
	
	
//	---------------------------------------------------------------------------------------
	
	// iv property를 byte[]로 변환
	public byte[] ivToByteArray(String ivString) {
		// property에서 String으로 받아온 ivString을  ", "을 기준으로 split -> String[]에 저장
		String[] ivStringArray = ivString.split(", ");
		// String[] -> byte[]로 번환
		for (int i = 0; i < iv.length; i++) {
		    iv[i] = Byte.parseByte(ivStringArray[i]);
		}
		return iv;
	}
}
