package com.lhsk.iam.domain.user.model.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.transaction.annotation.Transactional;

import com.lhsk.iam.domain.user.model.vo.LoginHistoryVO;
import com.lhsk.iam.domain.user.model.vo.UserVO;

@Mapper
public interface LoginMapper {
	
	
	UserVO findUserById(String id);
	@Transactional
	void insertLoginHistory(LoginHistoryVO loginHistroryVO);
	
}
