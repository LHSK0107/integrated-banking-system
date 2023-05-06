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
	public boolean checkExistsId(String id) {
		log.info("Duplicate id count: "+userMapper.checkExistsId(id));
		if(userMapper.checkExistsId(id) > 0) return true;
		else return false;
	}
	
	// email 중복체크
	public boolean checkDuplicateEmail(String email) {
		// DB의 email을 리스트를 조회해 복호화 시켜서 client에서 가져온 email과 대조
		List<String> emailList = userMapper.findAllEmail();
		for (String encryptedEmail : emailList) {
			try {
				String decryptedEmail = aesGcmEncrypt.decrypt(encryptedEmail, key);
				if (email.equals(decryptedEmail)) { return true; }
			} catch (GeneralSecurityException e) {
				throw new RuntimeException("Failed to decrypt user information", e);
			}
		}
		return false;
	}
	
	// 비밀번호 일치 확인
	public boolean checkPassword(int userNo, String password) {
		// DB에 저장된 password와 Client에서 받아온 password가 일치하는 지 비교 후, true / false 반환 
		return bCryptPasswordEncoder.matches(password, userMapper.checkPassword(userNo));
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
		// 회원 정보 암호화
			encryptUser(userVO);
		// mapper의 signup메서드 호출 (조건 : VO 객체를 넘겨줘야 함)
			userMapper.signup(userVO);			
		} catch (Exception e) {
			e.printStackTrace();
			return "fail";
		}
		return "success";
	}

	// 회원정보 수정
	public String updateUser(String userCode, UpdateUserVO updateUserVO) {
		// 변경하는 값이 없는 경우 : VO에서 변경 될 수 있는 값들이 모두 null이나 ""로 넘어올 경우 fail 반환
		if (
			(updateUserVO.getUserCode() == null || updateUserVO.getUserCode().equals(""))
			&& (updateUserVO.getPassword() == null || updateUserVO.getPassword().equals(""))
			&& (updateUserVO.getName() == null || updateUserVO.getName().equals(""))
			&& (updateUserVO.getDept() == null || updateUserVO.getDept().equals(""))
			&& (updateUserVO.getPhone() == null || updateUserVO.getPhone().equals(""))			
		) { 
			return "fail"; 
		// 변경 값이 있는 경우 : userCode에 따라 변경 가능한 값이 올바르게 들어왔는지 검증
		} else {
			// 1. user일 때
			if (userCode.equals("ROLE_USER")) {
				// 변경할 수 없는 값이 들어온 경우
				if (
					(updateUserVO.getUserCode() != null && !updateUserVO.getUserCode().equals("")) ||
					(updateUserVO.getName() != null && !updateUserVO.getName().equals("")) || 
					(updateUserVO.getDept() != null && !updateUserVO.getDept().equals(""))
				) {
					return "fail";
				// 변경할 수 있는 값인 경우 
				} else {
					// 변경된 정보를 암호화하여 update 하고 정상적으로 수행 되었으면 success 반환
					if (userMapper.updateUser(encryptUser(updateUserVO)) > 0) { return "success"; }
					else { return "fail"; }

				}
			// 2. manager일 때
			} else if (userCode.equals("ROLE_MANAGER")) {
				// 변경할 수 없는 값이 들어온 경우
				if (updateUserVO.getUserCode() != null || !updateUserVO.getUserCode().equals("")) {
					return "fail";
				// 변경할 수 있는 값인 경우
				} else {
					// 변경된 정보를 암호화하여 update 하고 정상적으로 수행 되었으면 success 반환
					if (userMapper.updateUser(encryptUser(updateUserVO)) > 0) { return "success"; }
					else { return "fail"; }
				}
			// 3. admin일 때
			} else {
				// 변경된 정보를 암호화하여 update 하고 정상적으로 수행 되었으면 success 반환
				if (userMapper.updateUser(encryptUser(updateUserVO)) > 0) { return "success"; }
				else { return "fail"; }
			}
		}
	}

	// 회원 삭제
	public String deleteUser(int userNo) {
		if (userMapper.deleteUser(userNo) > 0) return "success";
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
			throw new RuntimeException("Failed to encrypt user information", e);
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
			throw new RuntimeException("Failed to encrypt user information", e);
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
			throw new RuntimeException("Failed to decrypt user information", e);
		}
		return detailUserVO;
		
	}
	

}
