package com.lhsk.iam.domain.user.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.lhsk.iam.domain.user.model.mapper.UserMapper;
import com.lhsk.iam.domain.user.model.vo.UserVO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

	private final UserMapper userMapper;
	
	public void signup(UserVO userVO) {
		
	}
	
	public List<UserVO> selectAll() {
		return userMapper.selectAll();
	}

}
