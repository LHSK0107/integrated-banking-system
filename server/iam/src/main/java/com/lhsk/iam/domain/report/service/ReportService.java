package com.lhsk.iam.domain.report.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.lhsk.iam.domain.account.model.mapper.AccountMapper;
import com.lhsk.iam.domain.account.model.vo.AccountVO;
import com.lhsk.iam.domain.dashboard.service.DashboardService;
import com.lhsk.iam.domain.report.model.vo.DailyReportVO;
import com.lhsk.iam.domain.report.model.vo.InoutAcctReportVO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReportService {

	private AccountMapper accountMapper;
	private final DashboardService dashboardService;
	
	// 일반 사용자인 경우 열람가능한 계좌만을 추려서 데이터를 추출함
	public DailyReportVO getDailyReportData(int userNo) {
		
		DailyReportVO dailyReport = new DailyReportVO();
		
		// 열람 가능 계좌 추출
		List<AccountVO> acctList = accountMapper.findAvailableAccount(userNo);
		
		dailyReport.setDate(LocalDate.now().toString());
		Map<String, BigDecimal> balSumInfo = dashboardService.findByUsersBalSums(userNo);
		dailyReport.setAllInoutAcctBal(balSumInfo.get("01"));
		dailyReport.setAllTimeAcctBal(balSumInfo.get("02"));
		dailyReport.setAllLoanAcctBal(balSumInfo.get("03"));
		List<InoutAcctReportVO> inoutAccts = null;
		
		
		
		return dailyReport;
	}
	
	// 매니저 or 관리자인 경우 모든 계좌를 열람할 수 있기 때문에 전 계좌에서 데이터를 추출함
	public DailyReportVO getDailyReportData() {
		
		
		return null;
	}
}
