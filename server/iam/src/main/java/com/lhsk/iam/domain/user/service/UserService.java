package com.lhsk.iam.domain.user.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.lhsk.iam.domain.user.model.mapper.UserMapper;
import com.lhsk.iam.domain.user.model.vo.UserVO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

	private final UserMapper userMapper;
	
	public void signup(UserVO userVO) {
		// mapper의 signup메서드 호출 (조건 : VO객체를 넘겨줘야 함)
		userMapper.signup(userVO);
	}

	public List<UserVO> findAllUser() {
		// userVO 객체를 userList에 담아서 리턴
		List<UserVO> userList = userMapper.findAllUser();
		log.info("userList size: "+userList.size());
		return userList;
	}

	

}
