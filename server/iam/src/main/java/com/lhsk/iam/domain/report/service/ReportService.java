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
import com.lhsk.iam.domain.dashboard.service.DashboardService;
import com.lhsk.iam.domain.report.model.mapper.ReportMapper;
import com.lhsk.iam.domain.report.model.vo.DailyReportVO;
import com.lhsk.iam.domain.report.model.vo.InoutReportData;
import com.lhsk.iam.domain.report.model.vo.DailyInoutAcctReportVO;
import com.lhsk.iam.domain.report.model.vo.InoutReportVO;
import com.lhsk.iam.domain.report.model.vo.InoutReportRequestVO;
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
		
		// 기준일, 기준시간 설정
		dailyReport.setDate(LocalDate.now().toString());
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss");
		dailyReport.setTime(LocalTime.now().format(formatter));
		
		// 계좌구분별 총 자산 설정
		Map<String, BigDecimal> balSumInfo = dashboardService.findByUsersBalSums(userNo);
		dailyReport.setAllInoutAcctBal(balSumInfo.get("01"));
		dailyReport.setAllTimeAcctBal(balSumInfo.get("02"));
		dailyReport.setAllLoanAcctBal(balSumInfo.get("03"));
		List<DailyInoutAcctReportVO> inoutAccts = reportMapper.getUserInoutAcctReportData(userNo);
		
		// 계좌구분별 개별데이터 
		for(DailyInoutAcctReportVO inoutAcct : inoutAccts) {
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
		List<DailyInoutAcctReportVO> inoutAccts = reportMapper.getAdminInoutAcctReportData();
		
		for(DailyInoutAcctReportVO inoutAcct : inoutAccts) {
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
	
	// 일반사용자인 경우
	public List<InoutReportVO> getInoutReportData(InoutReportRequestVO requestVO, int userNo) {
		// 이 부분에서 requestVO에 포함된 필드를 사용하여 필요한 SQL 쿼리를 실행하고, 그 결과를 InoutReportVO 객체로 변환하여 반환합니다.
		// 이러한 작업은 MyBatis 또는 JPA와 같은 ORM 도구를 사용하여 수행될 수 있습니다.
		
		List<InoutReportVO> reportData = reportMapper.getInoutReportData(requestVO);
		
		// 복호화 및 필요한 추가 처리 수행
		for(InoutReportVO inoutReportVO : reportData) {
			try {
				inoutReportVO.setAcctNo(aesGcmEncrypt.decrypt(inoutReportVO.getAcctNo(), key));
			} catch (GeneralSecurityException e) {
				e.printStackTrace();
			}
		}
		
		return reportData;
	}
	
	// 매니저 이상인 경우
	public InoutReportData getInoutReportData(InoutReportRequestVO requestVO) {
		InoutReportData data = new InoutReportData();
		data.setDate(requestVO.getStartDt() + "~" + requestVO.getEndDt());
		
		
		String bankCd = accountMapper.findBankCdByBankNm(requestVO.getBankNm());
		
		requestVO.setBankCd(accountMapper.findBankCdByBankNm(requestVO.getBankNm()));

		List<InoutReportVO> reportData = reportMapper.getInoutReportData(requestVO);
		
		if(requestVO.getBankNm() == null || requestVO.getBankNm().equals("null")) data.setBankNm("전체");
		if(requestVO.getAcctNo() == null || requestVO.getAcctNo().equals("null")) data.setAcctNo("전체");
	    
	    for (InoutReportVO inoutReportVO : reportData) {
	    	System.out.println("beforeBal : " + inoutReportVO.getBeforeBal());
	    	// 이전잔액이 없는 경우 더 과거로 가서 잔액을 구해 넣어준다.
	    	if(inoutReportVO.getBeforeBal() == null) {
	    		String lastBalanceDate = reportMapper.getLastBalanceDate(inoutReportVO.getAcctNo());
	    		System.out.println("lastBalanceDate : "+lastBalanceDate);
	    		
	    		if (lastBalanceDate != null) {
	    			inoutReportVO.setBeforeBal(reportMapper.getLastBalance(inoutReportVO.getAcctNo(), lastBalanceDate));
	    		} else {
//	    			inoutReportVO.setBeforeBal(accountMapper.);
	    		}
	    	}

	    	// 이후잔액이 없는 경우(마지막날 기준 거래내역이 없음) 입금액만큼 더해주고 출금액만큼 뺀 값을 잔액으로 설정
	    	if(inoutReportVO.getBeforeBal() == null) {
	    		String lastBalanceDate = reportMapper.getLastBalanceDate(inoutReportVO.getAcctNo());
	    		if (lastBalanceDate != null) {
	    			inoutReportVO.setBeforeBal(reportMapper.getLastBalance(inoutReportVO.getAcctNo(), lastBalanceDate));
	    		}
	    	}
	    	
	    	
	        // 복호화 작업
	        try {
				inoutReportVO.setAcctNo(aesGcmEncrypt.decrypt(inoutReportVO.getAcctNo(), key));
			} catch (GeneralSecurityException e) {
				e.printStackTrace();
			}
	    }
	    data.setAcctlist(reportData);
	    
	    return data;
    }
    
}
