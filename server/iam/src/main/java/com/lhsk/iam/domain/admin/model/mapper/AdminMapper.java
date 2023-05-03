package com.lhsk.iam.domain.admin.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.lhsk.iam.domain.admin.model.vo.LoginHistoryReqeustVO;
import com.lhsk.iam.domain.admin.model.vo.MenuClickRequestVO;
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
}
