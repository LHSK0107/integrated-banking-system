package com.lhsk.iam.domain.user.model.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.lhsk.iam.domain.user.model.vo.UserVO;

@Mapper
public interface LoginMapper {
	
	
	UserVO findUserByEmail(String email);
	
	
}
