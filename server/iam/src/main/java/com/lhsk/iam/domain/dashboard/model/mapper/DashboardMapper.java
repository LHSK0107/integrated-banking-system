package com.lhsk.iam.domain.dashboard.model.mapper;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.lhsk.iam.domain.dashboard.model.vo.AcctDv01InoutSumVo;
import com.lhsk.iam.domain.dashboard.model.vo.AcctDvByBalSumVO;

@Mapper
public interface DashboardMapper {
	
	// 관리자의 전체 계좌 구분별 합계 계산
	List<AcctDvByBalSumVO> findByAdminsAcctDvToBalSum();
	// 관리자의 총 자산 합계 계산
	BigDecimal findByAdminsAllAccountToBalSum();
	// 일별 관리자의 수시 입출금 계좌 입츨금 합계 조회
	List<AcctDv01InoutSumVo> adminsAcctDv01DailyIn(LocalDate startDt);
	// 일별 관리자의 수시 입출금 계좌 츨금 합계 조회
	List<AcctDv01InoutSumVo> adminsAcctDv01DailyOut(LocalDate startDt);
	// 월별 관리자의 수시 입출금 계좌 입츨금 합계 조회
	List<AcctDv01InoutSumVo> adminsAcctDv01MonthlyIn(LocalDate startDt);
	// 월별 관리자의 수시 입출금 계좌 츨금 합계 조회
	List<AcctDv01InoutSumVo> adminsAcctDv01MonthlyOut(LocalDate startDt);
	// 연별 관리자의 수시 입출금 계좌 입츨금 합계 조회
	List<AcctDv01InoutSumVo> adminsAcctDv01YearlyIn(LocalDate startDt);
	// 연별 관리자의 수시 입출금 계좌 츨금 합계 조회
	List<AcctDv01InoutSumVo> adminsAcctDv01YearlyOut(LocalDate startDt);

	
	// 회원의 보유 계좌 구분별 합계 계산
	List<AcctDvByBalSumVO> findByUsersAcctDvToBalSum(int userNo);
	// 회원의 보유 총 자산 합계 계산
	BigDecimal findByUsersAllAccountToBalSum(int userNo);
	// 일별 회원의 수시 입출금 계좌 입츨금 합계 조회
	List<AcctDv01InoutSumVo> usersAcctDv01DailyIn(Map<String, Object> request);
	// 일별 회원의 수시 입출금 계좌 츨금 합계 조회
	List<AcctDv01InoutSumVo> usersAcctDv01DailyOut(Map<String, Object> request);
	// 월별 회원의 수시 입출금 계좌 입츨금 합계 조회
	List<AcctDv01InoutSumVo> usersAcctDv01MonthlyIn(Map<String, Object> request);
	// 월별 회원의 수시 입출금 계좌 츨금 합계 조회
	List<AcctDv01InoutSumVo> usersAcctDv01MonthlyOut(Map<String, Object> request);
	// 연별 회원의 수시 입출금 계좌 입츨금 합계 조회
	List<AcctDv01InoutSumVo> usersAcctDv01YearlyIn(Map<String, Object> request);
	// 연별 회원의 수시 입출금 계좌 츨금 합계 조회
	List<AcctDv01InoutSumVo> usersAcctDv01YearlyOut(Map<String, Object> request);

}
