package com.lhsk.iam.domain.admin.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.lhsk.iam.domain.account.model.vo.UserAccountVO;
import com.lhsk.iam.domain.admin.model.vo.DeptVO;
import com.lhsk.iam.domain.admin.model.vo.MenuClickVO;
import com.lhsk.iam.domain.user.model.vo.LoginHistoryVO;

@Mapper
public interface AdminMapper {
	// 로그인 기록 조회
	public List<LoginHistoryVO> findAllLoginHistory();
	// 메뉴 클릭 기록 조회
	public List<MenuClickVO> findMenuClickDay();
	public List<MenuClickVO> findMenuClickWeek();
	public List<MenuClickVO> findMenuClickMonth();
	
	// 전체 부서 리스트 조회
	List<DeptVO> findAllDept();
	// 부서 추가
	int addDept(DeptVO deptVo);
	// 부서 수정
	int updateDept(DeptVO deptVo);
	// 부서 삭제
	int deleteDept(String deptNo);
	
	// 회원에 계좌조회 권한 부여
	int insertUserAccount(List<UserAccountVO> info);
	// 회원에 계좌조회 권한 회수
	int deleteUserAccount(int userNo);
	
	// MANAGER에게 권한 위임
	int grantAdminToManager(int userNo);
	// Admin의 권한 위임시, userNo로 변경
	int afterGrantAdmin(int userNo);
}
