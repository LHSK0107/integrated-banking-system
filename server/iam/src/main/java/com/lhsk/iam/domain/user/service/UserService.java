package com.lhsk.iam.domain.user.service;

import org.springframework.stereotype.Service;

import com.lhsk.iam.domain.user.model.mapper.UserMapper;
import com.lhsk.iam.domain.user.model.vo.UserVO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

	private final UserMapper userMapper;
	
	public void signup(UserVO userVO) {
		// mapper의 signup메서드 호출 (조건 : VO객체를 넘겨줘야 함)
		userMapper.signup(userVO);
	}
	

}
