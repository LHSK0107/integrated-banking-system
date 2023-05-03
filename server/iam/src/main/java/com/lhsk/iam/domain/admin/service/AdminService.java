package com.lhsk.iam.domain.admin.service;

import java.security.GeneralSecurityException;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.lhsk.iam.domain.admin.model.mapper.AdminMapper;
import com.lhsk.iam.domain.admin.model.vo.LoginHistoryReqeustVO;
import com.lhsk.iam.domain.admin.model.vo.MenuClickRequestVO;
import com.lhsk.iam.domain.admin.model.vo.MenuClickVO;
import com.lhsk.iam.domain.user.model.vo.LoginHistoryVO;
import com.lhsk.iam.global.encrypt.AesGcmEncrypt;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminService {
	
	private final AdminMapper adminMapper;
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
		AesGcmEncrypt aesGcmEncrypt = new AesGcmEncrypt();
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
		return adminMapper.findMenuClickMonth();
	}
	
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
