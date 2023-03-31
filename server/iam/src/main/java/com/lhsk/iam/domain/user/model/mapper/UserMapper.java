package com.lhsk.iam.domain.user.model.mapper;


import java.util.List;

import org.springframework.stereotype.Repository;

import com.lhsk.iam.domain.user.model.vo.UserVO;

@Repository
public interface UserMapper {
	
	void signup(UserVO userVO);

	List<UserVO> findAllUser();

}
