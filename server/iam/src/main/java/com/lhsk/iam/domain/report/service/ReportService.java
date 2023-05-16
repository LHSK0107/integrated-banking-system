package com.lhsk.iam.domain.report.service;

import java.math.BigDecimal;
import java.security.GeneralSecurityException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.lhsk.iam.domain.account.model.mapper.AccountMapper;
import com.lhsk.iam.domain.account.model.vo.AccountVO;
import com.lhsk.iam.domain.account.model.vo.InoutVO;
import com.lhsk.iam.domain.dashboard.service.DashboardService;
import com.lhsk.iam.domain.report.model.mapper.ReportMapper;
import com.lhsk.iam.domain.report.model.vo.DailyReportVO;
import com.lhsk.iam.domain.report.model.vo.InoutAcctReportVO;
import com.lhsk.iam.domain.report.model.vo.LoanAcctReportVO;
import com.lhsk.iam.domain.report.model.vo.TimeAcctReportVO;
import com.lhsk.iam.global.encrypt.AesGcmEncrypt;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReportService {

	@Value("${aes.secret}")
	private String key;
	
	private final AccountMapper accountMapper;
	private final DashboardService dashboardService;
	private final ReportMapper reportMapper;
	private AesGcmEncrypt aesGcmEncrypt = new AesGcmEncrypt();
	
	// 일반 사용자인 경우 열람가능한 계좌만을 추려서 데이터를 추출함
	public DailyReportVO getDailyReportData(int userNo) {
		DailyReportVO dailyReport = new DailyReportVO();
		
		// 열람 가능 계좌 추출
		List<AccountVO> acctList = accountMapper.findAvailableAccount(userNo);
		
		dailyReport.setDate(LocalDate.now().toString());
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss");
		dailyReport.setTime(LocalTime.now().format(formatter));
		
		Map<String, BigDecimal> balSumInfo = dashboardService.findByUsersBalSums(userNo);
		dailyReport.setAllInoutAcctBal(balSumInfo.get("01"));
		dailyReport.setAllTimeAcctBal(balSumInfo.get("02"));
		dailyReport.setAllLoanAcctBal(balSumInfo.get("03"));
		List<InoutAcctReportVO> inoutAccts = reportMapper.getUserInoutAcctReportData(userNo);
		
		for(InoutAcctReportVO inoutAcct : inoutAccts) {
			try {
				inoutAcct.setAcctNo(aesGcmEncrypt.decrypt(inoutAcct.getAcctNo(), key));
			} catch (GeneralSecurityException e) {
				e.printStackTrace();
			}
		}
		dailyReport.setInoutAcctList(inoutAccts);
		List<TimeAcctReportVO> timeAccts = reportMapper.getUserTimeAcctReportData(userNo);
		for(TimeAcctReportVO timeAcct : timeAccts) {
			try {
				timeAcct.setAcctNo(aesGcmEncrypt.decrypt(timeAcct.getAcctNo(), key));
			} catch (GeneralSecurityException e) {
				e.printStackTrace();
			}
		}
		dailyReport.setTimeAcctList(timeAccts);
		List<LoanAcctReportVO> loanAccts = reportMapper.getUserLoanAcctReportData(userNo);
		for(LoanAcctReportVO loanAcct : loanAccts) {
			try {
				loanAcct.setAcctNo(aesGcmEncrypt.decrypt(loanAcct.getAcctNo(), key));
			} catch (GeneralSecurityException e) {
				e.printStackTrace();
			}
		}
		dailyReport.setLoanAcctList(loanAccts);
		
		
		
		return dailyReport;
	}
	
	// 매니저 or 관리자인 경우 모든 계좌를 열람할 수 있기 때문에 전 계좌에서 데이터를 추출함
	public DailyReportVO getDailyReportData() {
DailyReportVO dailyReport = new DailyReportVO();
		
		dailyReport.setDate(LocalDate.now().toString());
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss");
		dailyReport.setTime(LocalTime.now().format(formatter));
		
		Map<String, BigDecimal> balSumInfo = dashboardService.findByAdminsBalSums();
		dailyReport.setAllInoutAcctBal(balSumInfo.get("01"));
		dailyReport.setAllTimeAcctBal(balSumInfo.get("02"));
		dailyReport.setAllLoanAcctBal(balSumInfo.get("03"));
		List<InoutAcctReportVO> inoutAccts = reportMapper.getAdminInoutAcctReportData();
		
		for(InoutAcctReportVO inoutAcct : inoutAccts) {
			try {
				inoutAcct.setAcctNo(aesGcmEncrypt.decrypt(inoutAcct.getAcctNo(), key));
			} catch (GeneralSecurityException e) {
				e.printStackTrace();
			}
		}
		dailyReport.setInoutAcctList(inoutAccts);
		List<TimeAcctReportVO> timeAccts = reportMapper.getAdminTimeAcctReportData();
		for(TimeAcctReportVO timeAcct : timeAccts) {
			try {
				timeAcct.setAcctNo(aesGcmEncrypt.decrypt(timeAcct.getAcctNo(), key));
			} catch (GeneralSecurityException e) {
				e.printStackTrace();
			}
		}
		dailyReport.setTimeAcctList(timeAccts);
		List<LoanAcctReportVO> loanAccts = reportMapper.getAdminLoanAcctReportData();
		for(LoanAcctReportVO loanAcct : loanAccts) {
			try {
				loanAcct.setAcctNo(aesGcmEncrypt.decrypt(loanAcct.getAcctNo(), key));
			} catch (GeneralSecurityException e) {
				e.printStackTrace();
			}
		}
		dailyReport.setLoanAcctList(loanAccts);
		
		
		
		return dailyReport;
	}
}
