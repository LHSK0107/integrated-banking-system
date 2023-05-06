package com.lhsk.iam.domain.admin.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.lhsk.iam.domain.admin.model.vo.LoginHistoryReqeustVO;
import com.lhsk.iam.domain.user.model.vo.LoginHistoryVO;

@Mapper
public interface AdminMapper {
	public List<LoginHistoryVO> findAllLoginHistory(LoginHistoryReqeustVO vo);
	public List<LoginHistoryVO> findLoginHistory(LoginHistoryReqeustVO vo);
}
