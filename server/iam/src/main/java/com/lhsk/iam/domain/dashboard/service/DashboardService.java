package com.lhsk.iam.domain.dashboard.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.lhsk.iam.domain.dashboard.model.mapper.DashboardMapper;
import com.lhsk.iam.domain.dashboard.model.vo.AcctDv01InoutSumVo;
import com.lhsk.iam.domain.dashboard.model.vo.AcctDvByBalSumVO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
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
		if (AllAccountBalSum == null) {
			AllAccountBalSum = BigDecimal.ZERO;
		}
		balSumInfo.put("total", AllAccountBalSum);

		if(balSumInfo.get("01") == null) {
			balSumInfo.put("01", new BigDecimal(0.00));
		}
		if(balSumInfo.get("02") == null) {
			balSumInfo.put("02", new BigDecimal(0.00));
		}
		if(balSumInfo.get("03") == null) {
			balSumInfo.put("03", new BigDecimal(0.00));
		}
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
	
	// 관리자의 수시입출금 계좌 일별 입/출금 합계
	public Map<String, Object> adminsAcctDv01Daily() {
		// 반환 객체 생성
		Map<String, Object> data = new HashMap<>();
		// 날짜 넣어주기
		LocalDate[] date = new LocalDate[7];
		for (int i = 0; i < 7; i++) {
			// i만큼 현재 날짜에서 빼기
			date[i] = LocalDate.now().minusDays(i);
		}
		List<LocalDate> list1 = new ArrayList<>(Arrays.asList(date));
        Collections.reverse(list1);
		data.put("date", list1);

		// 입금 합계 넣어주기
		BigDecimal[] inSum = new BigDecimal[7];
		// date의 마지막 인덱스가 가장 예전 날짜이므로 이것을 조회 시작 날짜로 넣어준다.
		List<AcctDv01InoutSumVo> inList = dashboardMapper.adminsAcctDv01DailyIn(date[6]);
		DateTimeFormatter dayformat = DateTimeFormatter.ofPattern("yyyy-MM-dd");
		for (int i = 0; i < 7; i++) {
			for (AcctDv01InoutSumVo vo : inList) {
				// String 형태로 날짜 포맷을 바꿔서 일치하는지 조회
				if (vo.getTrscDt().equals(date[i].format(dayformat))) {
					inSum[i] = vo.getAmtSum();
					break; 	// 일치하는 항목을 찾으면 루프 종료
				} 
			}
		}
		List<BigDecimal> list2 = new ArrayList<>(Arrays.asList(inSum));
        Collections.reverse(list2);
		data.put("in", list2);

		// 출금 합계 넣어주기
		BigDecimal[] outSum = new BigDecimal[7];
		List<AcctDv01InoutSumVo> outList = dashboardMapper.adminsAcctDv01DailyOut(date[6]);
		for (int i = 0; i < 7; i++) {
			for (AcctDv01InoutSumVo vo : outList) {
				if (vo.getTrscDt().equals(date[i].format(dayformat))) {
					outSum[i] = vo.getAmtSum();
					break; 	// 일치하는 항목을 찾으면 루프 종료
				}
			}
		}
		List<BigDecimal> list3 = new ArrayList<>(Arrays.asList(outSum));
        Collections.reverse(list3);
		data.put("out", list3);
		
		return data;
	}

	// 관리자의 수시입출금 계좌 월별 입/출금 합계
	public Map<String, Object> adminsAcctDv01Monthly() {
		// 반환 객체 생성
		Map<String, Object> data = new HashMap<>();
		// 날짜 넣어주기
		LocalDate[] date = new LocalDate[7];
		for (int i = 0; i < 7; i++) {
			date[i] = LocalDate.now().minusMonths(i).withDayOfMonth(1); // 현재 월의 첫 날짜로 설정
		}
		List<LocalDate> list1 = new ArrayList<>(Arrays.asList(date));
        Collections.reverse(list1);
		data.put("date", list1);

		// 입금 합계 넣어주기
		BigDecimal[] inSum = new BigDecimal[7];
		List<AcctDv01InoutSumVo> inList = dashboardMapper.adminsAcctDv01MonthlyIn(date[6]);
		DateTimeFormatter monthformat = DateTimeFormatter.ofPattern("yyyy-MM");
		for (int i = 0; i < 7; i++) {
			for (AcctDv01InoutSumVo vo : inList) {
				// DB에서 조회된 날짜는 월까지 표기 되므로 이에 따라 비교 대상도 연월로 포맷을 일치 시킨다.
				if (vo.getTrscDt().equals(date[i].format(monthformat))) {
					inSum[i] = vo.getAmtSum();
					break;
				} 
			}
		}
		List<BigDecimal> list2 = new ArrayList<>(Arrays.asList(inSum));
        Collections.reverse(list2);
		data.put("in", list2);

		// 출금 합계 넣어주기
		BigDecimal[] outSum = new BigDecimal[7];
		List<AcctDv01InoutSumVo> outList = dashboardMapper.adminsAcctDv01MonthlyOut(date[6]);
		for (int i = 0; i < 7; i++) {
			for (AcctDv01InoutSumVo vo : outList) {
				if (vo.getTrscDt().equals(date[i].format(monthformat))) {
					outSum[i] = vo.getAmtSum();
					break;
				}
			}
		}
		List<BigDecimal> list3 = new ArrayList<>(Arrays.asList(outSum));
        Collections.reverse(list3);
		data.put("out", list3);
		
		return data;
	}

	// 관리자의 수시입출금 계좌 연별 입/출금 합계
	public Map<String, Object> adminsAcctDv01Yearly() {
		// 반환 객체 생성
		Map<String, Object> data = new HashMap<>();
		// 날짜 넣어주기
		LocalDate[] date = new LocalDate[7];
		for (int i = 0; i < 7; i++) {
			date[i] = LocalDate.now().minusYears(i).withDayOfYear(1); // 현재 연도의 첫 날짜로 설정
		}
		List<LocalDate> list1 = new ArrayList<>(Arrays.asList(date));
        Collections.reverse(list1);
		data.put("date", list1);

		// 입금 합계 넣어주기
		BigDecimal[] inSum = new BigDecimal[7];
		List<AcctDv01InoutSumVo> inList = dashboardMapper.adminsAcctDv01YearlyIn(date[6]);
		DateTimeFormatter yearformat = DateTimeFormatter.ofPattern("yyyy");
		for (int i = 0; i < 7; i++) {
			for (AcctDv01InoutSumVo vo : inList) {
				// DB에서 조회된 날짜는 연도까지 표기 되므로 이에 따라 비교 대상도 연도로 포맷을 일치 시킨다.
				if (vo.getTrscDt().equals(date[i].format(yearformat))) {
					inSum[i] = vo.getAmtSum();
					break;
				}
			}
		}
		List<BigDecimal> list2 = new ArrayList<>(Arrays.asList(inSum));
        Collections.reverse(list2);
		data.put("in", list2);

		// 출금 합계 넣어주기
		BigDecimal[] outSum = new BigDecimal[7];
		List<AcctDv01InoutSumVo> outList = dashboardMapper.adminsAcctDv01YearlyOut(date[6]);
		for (int i = 0; i < 7; i++) {
			for (AcctDv01InoutSumVo vo : outList) {
				if (vo.getTrscDt().equals(date[i].format(yearformat))) {
					outSum[i] = vo.getAmtSum();
					break;
				}
			}
		}
		List<BigDecimal> list3 = new ArrayList<>(Arrays.asList(outSum));
        Collections.reverse(list3);
		data.put("out", list3);
		
		return data;
	}
	
	// --------------------------------------------------------------------------------------------------

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
		if (AllAccountBalSum == null) {
			AllAccountBalSum = BigDecimal.ZERO;
		}
		balSumInfo.put("total", AllAccountBalSum);
		
		if(balSumInfo.get("01") == null) {
			balSumInfo.put("01", new BigDecimal(0.00));
		}
		if(balSumInfo.get("02") == null) {
			balSumInfo.put("02", new BigDecimal(0.00));
		}
		if(balSumInfo.get("03") == null) {
			balSumInfo.put("03", new BigDecimal(0.00));
		}
		 
		return balSumInfo;
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

	// 회원의 수시입출금 계좌 일별 입/출금 합계
	public Map<String, Object> usersAcctDv01Daily(int userNo) {
		// 반환 객체 생성
		Map<String, Object> data = new HashMap<>();
	
		// 날짜 넣어주기
		LocalDate[] date = new LocalDate[7];
		for (int i = 0; i < 7; i++) {
			date[i] = LocalDate.now().minusDays(i);
		}
		List<LocalDate> list1 = new ArrayList<>(Arrays.asList(date));
        Collections.reverse(list1);
		data.put("date", list1);
		
		// 쿼리에 매개변수로 넣어 줄 map 객체 생성
		Map<String, Object> request = new HashMap<>();
		request.put("startDt", date[6]);	// 조회 시작 날짜
		request.put("userNo", userNo);		// 회원 번호
		
		// 입금 합계 넣어주기
		BigDecimal[] inSum = new BigDecimal[7];
		List<AcctDv01InoutSumVo> inList = dashboardMapper.usersAcctDv01DailyIn(request);
		DateTimeFormatter dayformat = DateTimeFormatter.ofPattern("yyyy-MM-dd");
		for (int i = 0; i < 7; i++) {
			for (AcctDv01InoutSumVo vo : inList) {
				if (vo.getTrscDt().equals(date[i].format(dayformat))) {
					inSum[i] = vo.getAmtSum();
					break; 	// 일치하는 항목을 찾으면 루프 종료
				} 
			}
		}
		List<BigDecimal> list2 = new ArrayList<>(Arrays.asList(inSum));
        Collections.reverse(list2);
		data.put("in", list2);

		// 출금 합계 넣어주기
		BigDecimal[] outSum = new BigDecimal[7];
		List<AcctDv01InoutSumVo> outList = dashboardMapper.usersAcctDv01DailyOut(request);
		for (int i = 0; i < 7; i++) {
			for (AcctDv01InoutSumVo vo : outList) {
				if (vo.getTrscDt().equals(date[i].format(dayformat))) {
					outSum[i] = vo.getAmtSum();
					break; 	// 일치하는 항목을 찾으면 루프 종료
				}
			}
		}
		List<BigDecimal> list3 = new ArrayList<>(Arrays.asList(outSum));
        Collections.reverse(list3);
		data.put("out", list3);
		
		return data;
	}
	
	// 회원의 수시입출금 계좌 월별 입/출금 합계
	public Map<String, Object> usersAcctDv01Monthly(int userNo) {
		// 반환 객체 생성
		Map<String, Object> data = new HashMap<>();
	
		// 날짜 넣어주기
		LocalDate[] date = new LocalDate[7];
		for (int i = 0; i < 7; i++) {
			date[i] = LocalDate.now().minusMonths(i).withDayOfMonth(1); // 현재 월의 첫 날짜로 설정
		}
		List<LocalDate> list1 = new ArrayList<>(Arrays.asList(date));
        Collections.reverse(list1);
		data.put("date", list1);
		
		// 쿼리에 매개변수로 넣어 줄 map 객체 생성
		Map<String, Object> request = new HashMap<>();
		request.put("startDt", date[6]);	// 조회 시작 날짜
		request.put("userNo", userNo);		// 회원 번호
		
		// 입금 합계 넣어주기
		BigDecimal[] inSum = new BigDecimal[7];
		List<AcctDv01InoutSumVo> inList = dashboardMapper.usersAcctDv01MonthlyIn(request);
		DateTimeFormatter monthformat = DateTimeFormatter.ofPattern("yyyy-MM");
		for (int i = 0; i < 7; i++) {
			for (AcctDv01InoutSumVo vo : inList) {
				if (vo.getTrscDt().equals(date[i].format(monthformat))) {
					inSum[i] = vo.getAmtSum();
					break; 	// 일치하는 항목을 찾으면 루프 종료
				} 
			}
		}
		List<BigDecimal> list2 = new ArrayList<>(Arrays.asList(inSum));
        Collections.reverse(list2);
		data.put("in", list2);

		// 출금 합계 넣어주기
		BigDecimal[] outSum = new BigDecimal[7];
		List<AcctDv01InoutSumVo> outList = dashboardMapper.usersAcctDv01MonthlyOut(request);
		for (int i = 0; i < 7; i++) {
			for (AcctDv01InoutSumVo vo : outList) {
				if (vo.getTrscDt().equals(date[i].format(monthformat))) {
					outSum[i] = vo.getAmtSum();
					break; 	// 일치하는 항목을 찾으면 루프 종료
				}
			}
		}
		List<BigDecimal> list3 = new ArrayList<>(Arrays.asList(outSum));
        Collections.reverse(list3);
		data.put("out", list3);
		
		return data;
	}
	
	// 회원의 수시입출금 계좌 연별 입/출금 합계
	public Map<String, Object> usersAcctDv01Yearly(int userNo) {
		// 반환 객체 생성
		Map<String, Object> data = new HashMap<>();
		// 날짜 넣어주기
		LocalDate[] date = new LocalDate[7];
		for (int i = 0; i < 7; i++) {
			date[i] = LocalDate.now().minusYears(i).withDayOfYear(1); // 현재 연도의 첫 날짜로 설정
		}
		List<LocalDate> list1 = new ArrayList<>(Arrays.asList(date));
        Collections.reverse(list1);
		data.put("date", list1);

		// 쿼리에 매개변수로 넣어 줄 map 객체 생성
		Map<String, Object> request = new HashMap<>();
		request.put("startDt", date[6]);	// 조회 시작 날짜
		request.put("userNo", userNo);		// 회원 번호
		
		// 입금 합계 넣어주기
		BigDecimal[] inSum = new BigDecimal[7];
		List<AcctDv01InoutSumVo> inList = dashboardMapper.usersAcctDv01YearlyIn(request);
		DateTimeFormatter yearformat = DateTimeFormatter.ofPattern("yyyy");
		for (int i = 0; i < 7; i++) {
			for (AcctDv01InoutSumVo vo : inList) {
				// DB에서 조회된 날짜는 연도까지 표기 되므로 이에 따라 비교 대상도 연도로 포맷을 일치 시킨다.
				if (vo.getTrscDt().equals(date[i].format(yearformat))) {
					inSum[i] = vo.getAmtSum();
					break;
				}
			}
		}
		List<BigDecimal> list2 = new ArrayList<>(Arrays.asList(inSum));
        Collections.reverse(list2);
		data.put("in", list2);

		// 출금 합계 넣어주기
		BigDecimal[] outSum = new BigDecimal[7];
		List<AcctDv01InoutSumVo> outList = dashboardMapper.usersAcctDv01YearlyOut(request);
		for (int i = 0; i < 7; i++) {
			for (AcctDv01InoutSumVo vo : outList) {
				if (vo.getTrscDt().equals(date[i].format(yearformat))) {
					outSum[i] = vo.getAmtSum();
					break;
				}
			}
		}
		List<BigDecimal> list3 = new ArrayList<>(Arrays.asList(outSum));
        Collections.reverse(list3);
		data.put("out", list3);
		
		return data;
	}

}
