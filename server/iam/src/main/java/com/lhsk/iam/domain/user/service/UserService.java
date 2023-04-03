package com.lhsk.iam.domain.user.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.lhsk.iam.domain.user.model.mapper.UserMapper;
import com.lhsk.iam.domain.user.model.vo.UpdateUserVO;
import com.lhsk.iam.domain.user.model.vo.UserVO;
import com.lhsk.iam.domain.user.model.vo.WithoutUserCodeUserVO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

	private final UserMapper userMapper;
	
	public boolean checkDuplicateId(String id) {
		log.info("Duplicate id count: "+userMapper.checkDuplicateId(id));
		if(userMapper.checkDuplicateId(id) > 0) return true;
		else return false;
	}
	
	public void signup(UserVO userVO) {
		// mapper의 signup메서드 호출 (조건 : VO객체를 넘겨줘야 함)
		userMapper.signup(userVO);
	}

	public void updateUser(UpdateUserVO updateUserVO) {
		userMapper.updateUser(updateUserVO);
	}

	public List<UserVO> findAllUser() {
		// userVO 객체를 userList에 담아서 리턴
		List<UserVO> userList = userMapper.findAllUser();
		log.info("userList size: "+userList.size());
		return userList;
	}

	public WithoutUserCodeUserVO findByUserNo(int userNo) {
		return userMapper.findByUserNo(userNo);
	}

	public void deleteUser(int userNo) {
		userMapper.deleteUser(userNo);
	}



	

}
