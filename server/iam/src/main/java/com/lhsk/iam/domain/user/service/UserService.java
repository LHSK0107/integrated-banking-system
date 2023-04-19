package com.lhsk.iam.domain.user.service;

import java.security.NoSuchAlgorithmException;
import java.util.List;

import org.springframework.stereotype.Service;

import com.lhsk.iam.domain.user.model.mapper.UserMapper;
import com.lhsk.iam.domain.user.model.vo.UpdateUserVO;
import com.lhsk.iam.domain.user.model.vo.UserVO;
import com.lhsk.iam.global.encrypt.Sha512Encrypt;
import com.lhsk.iam.domain.user.model.vo.DetailUserVO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {
	// 생성자 주입
	private final UserMapper userMapper;
	
	// email 중복체크
	public boolean checkDuplicateEmail(String email) {
		log.info("Duplicate Email count: "+userMapper.checkDuplicateEmail(email));
		if(userMapper.checkDuplicateEmail(email) > 0) return true;
		else return false;
	}
	
	// 최초 가입 유무 체크
	public int checkExistsUser() {
		log.info("Exist Users count: "+userMapper.checkExistsUser());
		return userMapper.checkExistsUser();
	}
	
	// 회원가입
	public String signup(UserVO userVO) {
		try {
		// userCode
			// existUser 값이 0이면 userCode를 ROLE_ADMIN으로 세팅
			String userCode = checkExistsUser() == 0 ? "ROLE_ADMIN" : "ROLE_USER";
			userVO.setUserCode(userCode);
			log.info(userVO.getUserCode());
		// password
			// userVO 객체에 있는 password를 꺼내어 hash 수행
			String password = userVO.getPassword();
		    userVO.setPassword(Sha512Encrypt.hash(password));
		    log.info(userVO.getPassword());
			// mapper의 signup메서드 호출 (조건 : VO객체를 넘겨줘야 함)
			userMapper.signup(userVO);			

		} catch (NoSuchAlgorithmException e) {
			log.error("Error: " + e.getMessage());
			return "fail";
		} catch (Exception e) {
			e.printStackTrace();
			return "fail";
		}
		return "ok";
	}

	// 회원정보 수정
	public String updateUser(UpdateUserVO updateUserVO) {
		if (userMapper.updateUser(updateUserVO) > 0) return "ok";
		else return "fail";
	}

	// 회원 삭제
	public String deleteUser(int userNo) {
		if (userMapper.deleteUser(userNo) > 0) return "ok";
		else return "fail";
	}

	// 회원 리스트 (ROLE_ADMIN, ROLE_MANAGER)
	public List<DetailUserVO> findAllUser() {
		// userVO 객체를 userList에 담아서 리턴
		List<DetailUserVO> userList = userMapper.findAllUser();
		log.info("userList size: "+userList.size());
		return userList;
	}

	// 회원 상세조회
	public DetailUserVO findByUserNo(int userNo) {
		return userMapper.findByUserNo(userNo);
	}


	

}
