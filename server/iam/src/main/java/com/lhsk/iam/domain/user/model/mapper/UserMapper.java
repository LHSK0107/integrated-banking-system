package com.lhsk.iam.domain.user.model.mapper;

import org.springframework.stereotype.Repository;

import com.lhsk.iam.domain.user.model.vo.UserVO;

@Repository
public interface UserMapper {
	
	void signup(UserVO userVO);;
}
