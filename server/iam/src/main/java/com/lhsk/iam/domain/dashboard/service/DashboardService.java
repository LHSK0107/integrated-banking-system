package com.lhsk.iam.domain.dashboard.service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.lhsk.iam.domain.dashboard.model.mapper.DashboardMapper;
import com.lhsk.iam.domain.dashboard.model.vo.AcctDvByBalSumVO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardService {

	private final DashboardMapper dashboardMapper;
		
	// 관리자의 자산 잔액 합계
	public Map<String, BigDecimal> findByAdminsBalSums() {
		Map<String, BigDecimal> balSumInfo = new HashMap<>();
		
		// 관리자의 전체 계좌 구분별 합계 계산
		List<AcctDvByBalSumVO> list = dashboardMapper.findByAdminsAcctDvToBalSum();
		for (AcctDvByBalSumVO info : list) {
			balSumInfo.put(info.getAcctDv(), info.getBalSum());
		}
		// 관리자의 총 자산 합계 계산
		BigDecimal AllAccountBalSum = dashboardMapper.findByAdminsAllAccountToBalSum();		
		balSumInfo.put("total", AllAccountBalSum);
		
		return balSumInfo;
	}

	// 회원의 보유 자산 잔액 합계 메서드
	public Map<String, BigDecimal> findByUsersBalSums(int userNo) {
		Map<String, BigDecimal> balSumInfo = new HashMap<>();
		
		// 회원의 보유 계좌 구분별 합계 계산
		List<AcctDvByBalSumVO> list = dashboardMapper.findByUsersAcctDvToBalSum(userNo);
		for (AcctDvByBalSumVO info : list) {
			balSumInfo.put(info.getAcctDv(), info.getBalSum());
		}
		// 회원의 보유 총 자산 합계 계산
		BigDecimal AllAccountBalSum = dashboardMapper.findByUsersAllAccountToBalSum(userNo);		
		balSumInfo.put("total", AllAccountBalSum);
		
		return balSumInfo;
	}
	
	// 회원의 보유 자산 중 계좌 구분별 합계 계산
	// 회원의 보유 총 자산 합계 계산


}
