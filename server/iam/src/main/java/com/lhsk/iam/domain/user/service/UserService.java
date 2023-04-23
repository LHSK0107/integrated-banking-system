package com.lhsk.iam.domain.user.service;

import java.security.GeneralSecurityException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.lhsk.iam.domain.user.model.mapper.UserMapper;
import com.lhsk.iam.domain.user.model.vo.DetailUserVO;
import com.lhsk.iam.domain.user.model.vo.UpdateUserVO;
import com.lhsk.iam.domain.user.model.vo.UserVO;
import com.lhsk.iam.global.encrypt.AesGcmEncrypt;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
	// 생성자 주입
	private final UserMapper userMapper;
	
	@Autowired
	private PasswordEncoder bCryptPasswordEncoder;
	private AesGcmEncrypt aesGcmEncrypt = new AesGcmEncrypt();
	
	// 양방향 암호화 키 & iv(초기 벡터)
	@Value("${aes.secret}")
	private String key;
	@Value("${aes.iv}")
	private String ivString;
	
	// 최종적으로 iv가 저장될 byte[] 변수
	private byte[] iv = new byte[12];
	
	// id 중복체크
	public boolean checkDuplicateId(String id) {
		log.info("Duplicate id count: "+userMapper.checkDuplicateId(id));
		if(userMapper.checkDuplicateId(id) > 0) return true;
		else return false;
	}
	
	// email 중복체크
	public boolean checkDuplicateEmail(String email) {
		// DB의 email을 리스트를 조회해 복호화 시켜서 client에서 가져온 email과 대조
		List<String> emailList = userMapper.findAllEmail();
		for (String encryptedEmail : emailList) {
			try {
				String decryptedEmail = aesGcmEncrypt.decrypt(encryptedEmail, key);
				log.info(encryptedEmail);
				log.info(decryptedEmail);
				if (email.equals(decryptedEmail)) return true;
			} catch (GeneralSecurityException e) {
				e.printStackTrace();
			}
		}
		return false;
	}
	
	// 최초 가입 유무 체크
	public int checkExistsUser() {
		log.info("Exist Users count: "+userMapper.checkExistsUser());
		return userMapper.checkExistsUser();
	}
	
	// 회원가입
	public String signup(UserVO userVO) {
		try {
		// userCode 부여
			// existUser 값이 0이면 userCode를 ROLE_ADMIN으로 세팅
			String userCode = checkExistsUser() == 0 ? "ROLE_ADMIN" : "ROLE_USER";
			userVO.setUserCode(userCode);
//			log.info(userVO.getUserCode());
		// 회원 정보 암호화
			encryptUser(userVO);
		// mapper의 signup메서드 호출 (조건 : VO객체를 넘겨줘야 함)
			userMapper.signup(userVO);			
//		} catch (NoSuchAlgorithmException e) {
//			log.error("Error: " + e.getMessage());
//			return "fail";
		} catch (Exception e) {
			e.printStackTrace();
			return "fail";
		}
		return "ok";
	}

	// 회원정보 수정
	public String updateUser(UpdateUserVO updateUserVO) {
		encryptUser(updateUserVO);
		// 변경하는 값이 없는 경우 : VO에서 변경 될 수 있는 값들이 모두 null로 넘어올 경우
		if (
			updateUserVO.getUserCode() == null
			&& updateUserVO.getPassword() == null
			&& updateUserVO.getName() == null
			&& updateUserVO.getDept() == null
			&& updateUserVO.getPhone() == null
		) return "fail";
		else if (userMapper.updateUser(updateUserVO) > 0) return "ok";
		else return "fail";
	}

	// 회원 삭제
	public String deleteUser(int userNo) {
		if (userMapper.deleteUser(userNo) > 0) return "ok";
		else return "fail";
	}

	// 회원 리스트 (ROLE_ADMIN, ROLE_MANAGER)
	public List<DetailUserVO> findAllUser() {
		// userVO 객체를 userList에 담아서 반환
		List<DetailUserVO> userList = userMapper.findAllUser();
		// 리스트에서 하나씩 꺼내서 복호화
		for (int i=0; i<userList.size(); i++) {
			DetailUserVO user = userList.get(i);
			user = decryptUser(user);
			log.info(user.toString());
		}
		log.info("userList size: "+userList.size());
		return userList;
	}

	// 회원 상세조회
	public DetailUserVO findByUserNo(int userNo) {
		// 복호화 후 반환
		return decryptUser(userMapper.findByUserNo(userNo));
	}

	
//	------------------------------------------------------------------------------------
	
	// iv property를 byte[]로 변환
	public byte[] ivToByteArray(String ivString) {
		// property에서 String으로 받아온 ivString을  ", "을 기준으로 split -> String[]에 저장
		String[] ivStringArray = ivString.split(", ");
		// String[] -> byte[]로 번환
		for (int i = 0; i < iv.length; i++) {
		    iv[i] = Byte.parseByte(ivStringArray[i]);
//		    log.info(iv[i]+"");
		}
		return iv;
	}
	
	// 회원정보 암호화
	public UserVO encryptUser(UserVO userVO) {
		try {
			ivToByteArray(ivString);
			userVO.setPassword(bCryptPasswordEncoder.encode(userVO.getPassword()));
			userVO.setName(aesGcmEncrypt.encrypt(userVO.getName(), key, iv));
			userVO.setEmail(aesGcmEncrypt.encrypt(userVO.getEmail(), key, iv));
			userVO.setPhone(aesGcmEncrypt.encrypt(userVO.getPhone(), key, iv));
		} catch (GeneralSecurityException e) {
			e.printStackTrace();
		}
		return userVO;
	}
	
	// 회원정보 수정 시, 암호화 
	public UpdateUserVO encryptUser(UpdateUserVO updateUserVO) {
		try {
			ivToByteArray(ivString);
			// null이 아니고 공백 값이 아닐 때 암호화
			if (updateUserVO.getPassword() != null && !updateUserVO.getPassword().equals("")) {
				updateUserVO.setPassword(bCryptPasswordEncoder.encode(updateUserVO.getPassword())); }
			if (updateUserVO.getName() != null && !updateUserVO.getName().equals("")) {
				updateUserVO.setName(aesGcmEncrypt.encrypt(updateUserVO.getName(), key, iv)); }
			if (updateUserVO.getPhone() != null && !updateUserVO.getPhone().equals("")) {
				updateUserVO.setPhone(aesGcmEncrypt.encrypt(updateUserVO.getPhone(), key, iv)); }
		} catch (GeneralSecurityException e) {
			e.printStackTrace();
		}
		return updateUserVO;
	}
	
	// 회원정보 복호화
	public DetailUserVO decryptUser(DetailUserVO detailUserVO) {
		try {
			detailUserVO.setName(aesGcmEncrypt.decrypt(detailUserVO.getName(), key));
			detailUserVO.setEmail(aesGcmEncrypt.decrypt(detailUserVO.getEmail(), key));
			detailUserVO.setPhone(aesGcmEncrypt.decrypt(detailUserVO.getPhone(), key));
		} catch (GeneralSecurityException e) {
			e.printStackTrace();
		}
		return detailUserVO;
		
	}
	

}
