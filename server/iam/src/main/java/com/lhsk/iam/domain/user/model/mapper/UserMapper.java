package com.lhsk.iam.domain.user.model.mapper;


import java.util.List;

import org.springframework.stereotype.Repository;

import com.lhsk.iam.domain.user.model.vo.UpdateUserVO;
import com.lhsk.iam.domain.user.model.vo.UserVO;
import com.lhsk.iam.domain.user.model.vo.WithoutUserCodeUserVO;

@Repository
public interface UserMapper {
	
	void signup(UserVO userVO);

	void updateUser(UpdateUserVO updateUserVO);

	List<UserVO> findAllUser();
	
	WithoutUserCodeUserVO findByUserNo(int userNo);
}
