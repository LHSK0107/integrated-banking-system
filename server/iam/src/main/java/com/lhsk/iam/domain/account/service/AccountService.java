package com.lhsk.iam.domain.account.service;

import java.security.GeneralSecurityException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

	// 특정 사용자의 조회 가능한 계좌정보 리스트 (ROLE_USER)
	public List<AccountVO> findAllAvailableAccount(int userNo) {
		// 회원번호를 토대로 해당 회원이 열람 가능한 계좌정보 목록 조회
		List<AccountVO> accountList = accountMapper.findAvailableAccount(userNo);
		// 조회 가능한 계좌정보가 없으면 null 반환
		if (accountList == null) return null;
		// 계좌 정보가 있으면 암호화 되어 저장된 계좌번호를 다시 복호화해서 반환
		for (AccountVO account : accountList) {
			try {
				account.setAcctNo(aesGcmEncrypt.decrypt(account.getAcctNo(), key));				
			} catch (GeneralSecurityException e) {
				throw new RuntimeException("Failed to decrypt acctNo", e); 
			}
		}
		return accountList;
	}
	
	// 계좌 입출금내역 조회 (ROLE_USER)
	public Map<String, Object> findUsersInout(InoutRequestVO vo, boolean isToday) {
		// 총 페이지 수와 입출금 리스트를 담는 map 객체 생성
		Map<String, Object> info = new HashMap<>();
		// map에 들어가 value 선언
		List<InoutVO> inoutList = null;
		int totalPage = 0;
		
		// 계좌번호 암호화
		if (vo.getAcctNo() != null && !vo.getAcctNo().equals("All")) {
			try {
				vo.setAcctNo(aesGcmEncrypt.encrypt(vo.getAcctNo(), key, iv));
			} catch (GeneralSecurityException e) {
				e.printStackTrace();
			}
		}
		// Page 값 변환
		vo.setPage(vo.getPage()-1);
		// limit start 값 지정(조회할 페이지 * 페이지당 건수)
		vo.setStart(vo.getPage()*vo.getPageSize());
		
		
		// 조회기간에 오늘이 포함되면 당일 포함 입출금내역 조회 쿼리 수행
		if (isToday) {
			// count 값으로 page 수 계산
			double count = accountMapper.CountUsersInoutToday(vo);
			log.info(count+"");
			if (count != 0) totalPage = (int)Math.ceil(count/vo.getPageSize());
			
			inoutList = accountMapper.findUsersInoutToday(vo);
			// list가 비어있으면 null 반환
			if (inoutList == null) return null;
		} else {
			// count 값으로 page 수 계산
			double count = accountMapper.CountUsersInoutPast(vo);
			log.info(count+"");
			if (count != 0) totalPage = (int)Math.ceil(count/vo.getPageSize());
			
			inoutList = accountMapper.findUsersInoutPast(vo);
			// list가 비어있으면 null 반환
			if (inoutList == null) return null;
		}
		
		// 계좌번호 복호화 진행
		for (InoutVO inout : inoutList) {
			try {
				inout.setAcctNo(aesGcmEncrypt.decrypt(inout.getAcctNo(), key));
			} catch (GeneralSecurityException e) {
				throw new RuntimeException("Failed to decrypt acctNo", e); 
			}
		}
		
		// 총 페이지 수와 입출금 리스트를 map에 담아 반환
		info.put("totalPage", totalPage);
		info.put("list", inoutList);
		return info;
	}
	
	// 계좌 입출금내역 조회 (ROLE_MANAGER, ROLE_ADMIN)
	public Map<String, Object> findAdminsInout(InoutRequestVO vo, boolean isToday) {
		// 총 페이지 수와 입출금 리스트를 담는 map 객체 생성
		Map<String, Object> info = new HashMap<>();
		// map에 들어가 value 선언
		List<InoutVO> inoutList = null;
		int totalPage = 0;
		
		// 계좌번호 암호화
		if (vo.getAcctNo() != null && !vo.getAcctNo().equals("All")) {
			try {
				vo.setAcctNo(aesGcmEncrypt.encrypt(vo.getAcctNo(), key, iv));
			} catch (GeneralSecurityException e) {
				e.printStackTrace();
			}
		}
		// Page 값 변환
		vo.setPage(vo.getPage()-1);
		// limit start 값 지정(조회할 페이지 * 페이지당 건수)
		vo.setStart(vo.getPage()*vo.getPageSize());
		
		// 조회기간에 오늘이 포함되면 당일 포함 입출금내역 조회 쿼리 수행
		if (isToday) {
			// count 값으로 page 수 계산
			double count = accountMapper.CountAdminsInoutToday(vo);
			log.info(count+"");
			if (count != 0) totalPage = (int)Math.ceil(count/vo.getPageSize());
			inoutList = accountMapper.findAdminsInoutToday(vo);
			if (inoutList == null) return null;
		}else {
			// count 값으로 page 수 계산
			double count = accountMapper.CountAdminsInoutPast(vo);
			log.info(count+"");
			if (count != 0) totalPage = (int)Math.ceil(count/vo.getPageSize());
			inoutList = accountMapper.findAdminsInoutPast(vo);
			if (inoutList == null) return null;
		}
		
		// 계좌번호 복호화 진행
		for (InoutVO inout : inoutList) {
			try {
				inout.setAcctNo(aesGcmEncrypt.decrypt(inout.getAcctNo(), key));
			} catch (GeneralSecurityException e) {
				throw new RuntimeException("Failed to decrypt acctNo", e); 
			}
		}
		
		// 총 페이지 수와 입출금 리스트를 map에 담아 반환
		info.put("totalPage", totalPage);
		info.put("list", inoutList);
		return info;
	}
	
//	// 해당 계좌에 접근(조회) 가능한 사용자인지 확인
//	public int checkByAcctNoToAccessibleUser(HashMap<String, Object> userInfo) {
//		return accountMapper.checkByAcctNoToAccessibleUser(userInfo);
//	}
		
	
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
