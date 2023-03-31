package com.lhsk.iam.domain.user.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import com.lhsk.iam.domain.user.model.vo.UserVO;

@Mapper
public interface UserMapper {
	
	@Select("SELECT * FROM user")
	List<UserVO> selectAll();
	
}
