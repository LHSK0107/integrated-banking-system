package com.lhsk.iam.domain.user.model.mapper;


import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.lhsk.iam.domain.user.model.vo.UpdateUserVO;
import com.lhsk.iam.domain.user.model.vo.UserVO;
import com.lhsk.iam.domain.user.model.vo.WithoutUserCodeUserVO;

@Mapper
public interface UserMapper {
	
	void signup(UserVO userVO);

	void updateUser(UpdateUserVO updateUserVO);

	List<UserVO> findAllUser();
	
	WithoutUserCodeUserVO findByUserNo(int userNo);

	void deleteUser(int userNo);

	int checkDuplicateId(String id);
	
}
