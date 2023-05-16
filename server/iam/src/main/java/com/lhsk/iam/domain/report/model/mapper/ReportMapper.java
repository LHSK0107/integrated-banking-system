package com.lhsk.iam.domain.report.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.lhsk.iam.domain.report.model.vo.InoutAcctReportVO;
import com.lhsk.iam.domain.report.model.vo.LoanAcctReportVO;
import com.lhsk.iam.domain.report.model.vo.TimeAcctReportVO;

@Mapper
public interface ReportMapper {
	public List<InoutAcctReportVO> getUserInoutAcctReportData(int userNo);
	public List<TimeAcctReportVO> getUserTimeAcctReportData(int userNo);
	public List<LoanAcctReportVO> getUserLoanAcctReportData(int userNo);
	public List<InoutAcctReportVO> getAdminInoutAcctReportData();
	public List<TimeAcctReportVO> getAdminTimeAcctReportData();
	public List<LoanAcctReportVO> getAdminLoanAcctReportData();
}
