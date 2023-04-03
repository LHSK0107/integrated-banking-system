package com.lhsk.iam.domain.user.model.mapper;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.lhsk.iam.domain.user.model.vo.UserVO;

@Repository
public interface LoginMapper {
	
	
	UserVO findUserById(String id);
	
	
}
