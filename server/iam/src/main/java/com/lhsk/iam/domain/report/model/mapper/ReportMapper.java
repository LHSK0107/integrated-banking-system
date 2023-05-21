package com.lhsk.iam.domain.report.model.mapper;

import java.math.BigDecimal;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.lhsk.iam.domain.report.model.vo.DailyInoutAcctReportVO;
import com.lhsk.iam.domain.report.model.vo.InoutReportVO;
import com.lhsk.iam.domain.report.model.vo.InoutReportRequestVO;
import com.lhsk.iam.domain.report.model.vo.LoanAcctReportVO;
import com.lhsk.iam.domain.report.model.vo.TimeAcctReportVO;

@Mapper
public interface ReportMapper {
	
	// 일일시재보고서
	// 사용자의 수시입출금 보고서 데이터 추출
	public List<DailyInoutAcctReportVO> getUserInoutAcctReportData(int userNo);
	// 사용자의 정기예적금 보고서 데이터 추출
	public List<TimeAcctReportVO> getUserTimeAcctReportData(int userNo);
	// 사용자의 대출 보고서 데이터 추출
	public List<LoanAcctReportVO> getUserLoanAcctReportData(int userNo);
	// 관리자의 수시입출금 보고서 데이터 추출
	public List<DailyInoutAcctReportVO> getAdminInoutAcctReportData();
	// 관리자의 정기예적금 보고서 데이터 추출
	public List<TimeAcctReportVO> getAdminTimeAcctReportData();
	// 관리자의 대출 보고서 데이터 추출
	public List<LoanAcctReportVO> getAdminLoanAcctReportData();
	
	// 입출내역보고서
	// 입출금내역보고서 데이터 추출
	// 과거
	public List<InoutReportVO> getAdminInoutReportData(InoutReportRequestVO requestVO);
	public List<InoutReportVO> getUserInoutReportData(InoutReportRequestVO requestVO);
	// 오늘 포함
	public List<InoutReportVO> getAdminInoutReportDataToday(InoutReportRequestVO requestVO);
	public List<InoutReportVO> getUserInoutReportDataToday(InoutReportRequestVO requestVO);
	// 거래내역중 가장 최신의 날짜 추출
	public String getLastBalanceDate(String acctNo, String date);
	// 해당 날짜의 거래내역으로부터 잔액 추출
	public BigDecimal getLastBalance(String acctNo, String date);
	// 계좌번호로 현재 잔액 추출
	public BigDecimal getBalByAcctNo(String acctNo);
	
}
