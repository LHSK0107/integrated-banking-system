package com.lhsk.iam.domain.dashboard.model.mapper;

import java.math.BigDecimal;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.lhsk.iam.domain.dashboard.model.vo.AcctDvByBalSumVO;

@Mapper
public interface DashboardMapper {
	// 관리자의 전체 계좌 구분별 합계 계산
	List<AcctDvByBalSumVO> findByAdminsAcctDvToBalSum();
	// 관리자의 총 자산 합계 계산
	BigDecimal findByAdminsAllAccountToBalSum();
	// 회원의 보유 계좌 구분별 합계 계산
	List<AcctDvByBalSumVO> findByUsersAcctDvToBalSum(int userNo);
	// 회원의 보유 총 자산 합계 계산
	BigDecimal findByUsersAllAccountToBalSum(int userNo);
}
