package com.lhsk.iam.domain.user.model.mapper;


import java.util.List;

import org.springframework.stereotype.Repository;

import com.lhsk.iam.domain.user.model.vo.UpdateUserVO;
import com.lhsk.iam.domain.user.model.vo.UserVO;
import com.lhsk.iam.domain.user.model.vo.DetailUserVO;

@Repository
public interface UserMapper {
	
	// id 중복체크
	int checkDuplicateId(String id);
	// 회원가입
	int signup(UserVO userVO);
	// 회원정보 수정
	int updateUser(UpdateUserVO updateUserVO);
	// 회원 삭제
	int deleteUser(int userNo);
	// 회원 상세조회
	List<DetailUserVO> findAllUser();
	// 회원 삭제
	DetailUserVO findByUserNo(int userNo);


	
}
