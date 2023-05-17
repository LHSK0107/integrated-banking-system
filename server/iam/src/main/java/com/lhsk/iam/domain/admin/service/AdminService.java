package com.lhsk.iam.domain.admin.service;

import java.security.GeneralSecurityException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.lhsk.iam.domain.account.model.vo.AccountVO;
import com.lhsk.iam.domain.account.service.AccountService;
import com.lhsk.iam.domain.admin.model.mapper.AdminMapper;
import com.lhsk.iam.domain.admin.model.vo.MenuClickVO;
import com.lhsk.iam.domain.user.model.vo.LoginHistoryVO;
import com.lhsk.iam.global.encrypt.AesGcmEncrypt;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminService {
	
	private final AdminMapper adminMapper;
	private final AccountService accountService;
	private AesGcmEncrypt aesGcmEncrypt = new AesGcmEncrypt();
	
	@Value("${aes.secret}")
	private String key;
	@Value("${aes.iv}")
	private String ivString;
	// 최종적으로 iv가 저장될 byte[] 변수
	private byte[] iv = new byte[12];
	
	
	// 모든 유저의 로그인기록 조회
	public List<LoginHistoryVO> findAllLoginHistory() {
		List<LoginHistoryVO> list = adminMapper.findAllLoginHistory();
		decrypt(list);	// 복호화
		return list;
	}
	
	// 로그인 기록 복호화
	private List<LoginHistoryVO> decrypt(List<LoginHistoryVO> list) {
		for(int i = 0; i < list.size(); i++) {
			try {
				list.get(i).setName(aesGcmEncrypt.decrypt(list.get(i).getName(), key));
				list.get(i).setEmail(aesGcmEncrypt.decrypt(list.get(i).getEmail(), key));
			} catch (GeneralSecurityException e) {
				e.printStackTrace();
			}
		}
		
		return list;
	}
	
	// 7일간의 메뉴 클릭 집계
	public List<MenuClickVO> findMenuClickDay() {
		return adminMapper.findMenuClickDay();
	}
	
	// 7주간의 메뉴 클릭 집계
	public List<MenuClickVO> findMenuClickWeek() {
		return adminMapper.findMenuClickWeek();
	}
	
	// 7개월간의 메뉴 클릭 집계
	public List<MenuClickVO> findMenuClickMonth() {
		List<MenuClickVO> list = adminMapper.findMenuClickMonth();
		for(int i = 0 ; i < list.size(); i++) {
			list.get(i).setDate(list.get(i).getDate().substring(0,7));
		}
		return list;
	}
	
	// 계좌조회 권한 페이지 계좌정보
	public Map<String, List<String>> getAllAccounts() {
		/*
			data : {
				acctDv [ ],
				acctNo [ ],
				bankCd [ ],
				acctNickNm []
		 */
		// 최종 반환 map
		Map<String, List<String>> info = new HashMap<>();

		// 계좌구분 리스트
		List<String> acctDvList = new ArrayList<>();
		// 계좌번호 리스트
		List<String> acctNoList = new ArrayList<>();
		// 은행코드 리스트
		List<String> bankCdList = new ArrayList<>();
		// 은행코드 리스트
		List<String> acctNickNmList = new ArrayList<>();
		
		// 전체 계좌 정보를 불러옴
		List<AccountVO> accountAllInfo = accountService.findAllAccount();
		// 차례대로 계좌 정보를 각각의 list에 추가
		for (AccountVO account : accountAllInfo) {
			acctDvList.add(account.getAcctDv());
			acctNoList.add(account.getAcctNo());
			bankCdList.add(account.getBankCd());
			acctNickNmList.add(account.getAcctNickNm());
		}
		// 리스트들을 모두 map에 담기
		info.put("acctDv", acctDvList);
		info.put("acctNo", acctNoList);
		info.put("bankCd", bankCdList);
		info.put("acctNickNm", acctNickNmList);
		
		return info;
	}

	// 회원에게 허용된 계좌정보 조회
	public Map<String, List<String>> getAvailable() {
		/*
			data : {
				user_no [ ],
				acct_dv [ ],
				acct_no [ ],
				bank_cd [ ],
			}
		 */
		
		
		return null;
	}
	
	// 회원에 계좌 조회 권한 부여

	
	
	// iv property를 byte[]로 변환
	private byte[] ivToByteArray(String ivString) {
		// property에서 String으로 받아온 ivString을  ", "을 기준으로 split -> String[]에 저장
		String[] ivStringArray = ivString.split(", ");
		// String[] -> byte[]로 번환
		for (int i = 0; i < iv.length; i++) {
		    iv[i] = Byte.parseByte(ivStringArray[i]);
		}
		return iv;
	}
	
}
