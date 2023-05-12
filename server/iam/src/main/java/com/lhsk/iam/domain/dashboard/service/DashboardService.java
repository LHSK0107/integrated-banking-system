package com.lhsk.iam.domain.dashboard.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
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

	// 관리자의 계좌 구분별 자산 비율 메서드
	public Map<String, BigDecimal> adminsEachAcctDvRatio() {
		Map<String, BigDecimal> acctDvRatioInfo = new HashMap<>();
		
		// 관리자의 전체 계좌 구분별 합계
		List<AcctDvByBalSumVO> list = dashboardMapper.findByAdminsAcctDvToBalSum();
		// 전체 계좌 잔액의 합계 계산
		BigDecimal totalSum = BigDecimal.ZERO;
		for (AcctDvByBalSumVO info : list) {
			totalSum.add(info.getBalSum());
		}
		// 계좌 구분별 자산 비율 계산(계좌구분별 잔액 합계/전체 계좌 잔액의 합계) 
		for (AcctDvByBalSumVO info : list) {
			if (!info.getBalSum().equals(BigDecimal.ZERO) && !info.getBalSum().equals(null)) {
				acctDvRatioInfo.put(info.getAcctDv(), info.getBalSum()
														  .divide(totalSum)
														  .setScale(2, RoundingMode.HALF_DOWN));
			}
		}
		// key: acctDv, value: ratio 
		return acctDvRatioInfo;
	}
	
	// 회원의 계좌 구분별 자산 비율 메서드
	public Map<String, BigDecimal> usersEachAcctDvRatio(int userNo) {
		Map<String, BigDecimal> acctDvRatioInfo = new HashMap<>();
		
		// 회원의 전체 계좌 구분별 합계
		List<AcctDvByBalSumVO> list = dashboardMapper.findByUsersAcctDvToBalSum(userNo);
		// 전체 계좌 잔액의 합계 계산
		BigDecimal sum = BigDecimal.ZERO;
		for (AcctDvByBalSumVO balSum : list) {
			sum.add(balSum.getBalSum());
		}
		// 계좌 구분별 자산 비율 계산(계좌구분별 잔액 합계/전체 계좌 잔액의 합계)
		for (AcctDvByBalSumVO balSum : list) {
			if (!balSum.getBalSum().equals(BigDecimal.ZERO) && !balSum.getBalSum().equals(null)) {				
				// 값은 반올림하여 소수 둘째자리까지 나타냄
				acctDvRatioInfo.put(balSum.getAcctDv(), balSum.getBalSum()
															  .divide(sum)
															  .setScale(2, RoundingMode.HALF_DOWN));
			}
		}
		// key: acctDv, value: ratio 
		return acctDvRatioInfo;
	}

	// 관리자의 수시입출금 계좌 기간별(일/월/년) 입/출금 합계
	public Map<String, List<BigDecimal>> adminsAcctDv01InoutSum() {
		Map<String, List<BigDecimal>> InoutSumInfo = new HashMap<>();
		
		List<BigDecimal> daliyList = new ArrayList<>();
		List<BigDecimal> monthlyList = new ArrayList<>();
		List<BigDecimal> yearlyList = new ArrayList<>();
		
		InoutSumInfo.put("day", daliyList);
		InoutSumInfo.put("month", monthlyList);
		InoutSumInfo.put("year", yearlyList);
		
		return InoutSumInfo;
	}


}
