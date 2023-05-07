package com.lhsk.iam.domain.user.model.mapper;


import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.transaction.annotation.Transactional;

import com.lhsk.iam.domain.user.model.vo.UpdateUserVO;
import com.lhsk.iam.domain.user.model.vo.UserVO;
import com.lhsk.iam.domain.admin.model.vo.MenuClickRequestVO;
import com.lhsk.iam.domain.user.model.vo.DetailUserVO;

@Mapper
public interface UserMapper {
	
	// id 존재 여부 확인
	int checkExistsId(String id);
	// email 중복체크를 위해 전체 email 조회
	List<String> findAllEmail();
	// 비밀번호 일치 확인
	String checkPassword(int userNo);
	// 최초 가입 유무 체크
	int checkExistsUser();
	
	// 회원가입
	@Transactional
	int signup(UserVO userVO);
	// 회원정보 수정
	int updateUser(UpdateUserVO updateUserVO);
	// 회원 삭제
	int deleteUser(int userNo);
	// 전체 회원 리스트 조회
	List<DetailUserVO> findAllUser();
	// 회원 상세정보 조회
	DetailUserVO findByUserNo(int userNo);
	
	// 전체 부서 리스트 조회
	List<String> findAllDept();
	// 부서 추가
	int AddDept(String dept);
	// 부서 수정
	int updateDept(String newDept, String oldDept);
	// 부서 삭제
	int deleteDept(String dept);
	
	// 메뉴 클릭 스케쥴링
	void insertMenuClick(String menuNm);
	// 메뉴 클릭 기록 집계
	void updateMenuClick(String menuNm, int cnt);
}
