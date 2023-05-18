package com.lhsk.iam.domain.admin.service;

import java.security.GeneralSecurityException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.lhsk.iam.domain.account.model.vo.AccountVO;
import com.lhsk.iam.domain.account.model.vo.GrantAccountVO;
import com.lhsk.iam.domain.account.model.vo.UserAccountVO;
import com.lhsk.iam.domain.account.service.AccountService;
import com.lhsk.iam.domain.admin.model.mapper.AdminMapper;
import com.lhsk.iam.domain.admin.model.vo.MenuClickVO;
import com.lhsk.iam.domain.user.model.vo.LoginHistoryVO;
import com.lhsk.iam.global.encrypt.AesGcmEncrypt;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
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
	
	// 계좌조회 권한 페이지 계좌정보(재가공)
	public List<GrantAccountVO> getAllAccounts() {
		/*
			data : {
				[
				 GrantAccountVO {
					 userNo		: 0,	// 회원번호는 데이터 없음 
					 acctDv		: ,
					 acctNo		: ,
					 banCd		: ,
					 acctNickNm : ,
					}
				]
			}
		 */
		// 전체 계좌 정보를 불러옴
		List<AccountVO> accountAllInfo = accountService.findAllAccount();
		// 최종 반환 list
		List<GrantAccountVO> info = new ArrayList<>();
		
		if (accountAllInfo.size() > 0) {
			// 필요한 값만 추출하여 계좌 정보를 재가공
			for (int i = 0; i < accountAllInfo.size(); i++) {
				AccountVO accountInfo = accountAllInfo.get(i);
				GrantAccountVO reAccountInfo = new GrantAccountVO();
				
				reAccountInfo.setAcctDv(accountInfo.getAcctDv());
				reAccountInfo.setAcctNickNm(accountInfo.getAcctNickNm());
				reAccountInfo.setAcctNo(accountInfo.getAcctNo());
				reAccountInfo.setBankCd(accountInfo.getBankCd());
				
				info.add(reAccountInfo);
			}
		}
		return info;
	}

	// 회원에게 허용된 계좌정보 조회(재가공)
	public List<GrantAccountVO> getAvailable(int userNo) {
		/*
			data : {
				[
				 GrantAccountVO {
					 userNo		: ,
					 acctDv		: ,
					 acctNo		: ,
					 banCd		: ,
					 acctNickNm : ,
					}
				]
			}
		 */
		// user_account 테이블에서 해당 회원이 접근 가능한 계좌 정보를 불러옴
		List<AccountVO> availableInfo = accountService.findAllAvailableAccount(userNo);
		// 최종 반환 list
		List<GrantAccountVO> info = new ArrayList<>();
		
		if (availableInfo.size() > 0) {
			// 필요한 값만 추출하여 계좌 정보를 재가공
			for (int i = 0; i < availableInfo.size(); i++) {
				AccountVO accountInfo = availableInfo.get(i);
				GrantAccountVO reAccountInfo = new GrantAccountVO();
				reAccountInfo.setUserNo(userNo);
				reAccountInfo.setAcctDv(accountInfo.getAcctDv());
				reAccountInfo.setAcctNickNm(accountInfo.getAcctNickNm());
				reAccountInfo.setAcctNo(accountInfo.getAcctNo());
				reAccountInfo.setBankCd(accountInfo.getBankCd());
				
				info.add(reAccountInfo);
			}
		}
		return info;
	}
	
	// 회원에 계좌 조회 권한 부여
	public void grantAvailableAccounts(int userNo, List<UserAccountVO> data) {
		// iv 값 세팅
		ivToByteArray(ivString);
		// 클라이언트에서 넘어 온 값 재가공
		for (UserAccountVO info : data) {
			try {
				info.setUserNo(userNo);
				// 계좌번호 암호화
				info.setAcctNo(aesGcmEncrypt.encrypt(info.getAcctNo(), key, iv));
			} catch (GeneralSecurityException e) {
				e.printStackTrace();
			}
		}
		int deleteCount = adminMapper.deleteUserAccount(userNo);
		int insertCount = adminMapper.insertUserAccount(data);
		
		log.info("delete: "+ deleteCount+", insertCount: "+insertCount);
	}
	
	
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
