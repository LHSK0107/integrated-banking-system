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
import com.lhsk.iam.domain.dashboard.service.DashboardService;
import com.lhsk.iam.domain.report.model.mapper.ReportMapper;
import com.lhsk.iam.domain.report.model.vo.DailyInoutAcctReportVO;
import com.lhsk.iam.domain.report.model.vo.DailyReportVO;
import com.lhsk.iam.domain.report.model.vo.InoutReportData;
import com.lhsk.iam.domain.report.model.vo.InoutReportRequestVO;
import com.lhsk.iam.domain.report.model.vo.InoutReportVO;
import com.lhsk.iam.domain.report.model.vo.LoanAcctReportVO;
import com.lhsk.iam.domain.report.model.vo.TimeAcctReportVO;
import com.lhsk.iam.global.encrypt.AesGcmEncrypt;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReportService {

	@Value("${aes.secret}")
	private String key;
	@Value("${aes.iv}")
	private String ivString;
	
	private byte[] iv = new byte[12];
	
	private final DashboardService dashboardService;
	private final ReportMapper reportMapper;
	private AesGcmEncrypt aesGcmEncrypt = new AesGcmEncrypt();
	
	public byte[] ivToByteArray(String ivString) {
		// property에서 String으로 받아온 ivString을  ", "을 기준으로 split -> String[]에 저장
		String[] ivStringArray = ivString.split(", ");
		// String[] -> byte[]로 번환
		for (int i = 0; i < iv.length; i++) {
		    iv[i] = Byte.parseByte(ivStringArray[i]);
		}
		return iv;
	}
	
	
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
	
	// 일반사용자인 경우(과거만)
	public InoutReportData getInoutReportData(InoutReportRequestVO requestVO, int userNo) {
		
		ivToByteArray(ivString);
		
		// 계좌번호 암호화
		if (requestVO.getAcctNo() != null && !requestVO.getAcctNo().equals("null")) {
			try {
				requestVO.setAcctNo(aesGcmEncrypt.encrypt(requestVO.getAcctNo(), key, iv));
			} catch (GeneralSecurityException e) {
				e.printStackTrace();
			}
		}
		InoutReportData data = new InoutReportData();
		data.setDate(requestVO.getStartDt() + "~" + requestVO.getEndDt());
		requestVO.setUserNo(userNo);
		log.info("bankCd : "+requestVO.getBankCd());
		
		// 데이터 추출
		List<InoutReportVO> reportData = reportMapper.getUserInoutReportData(requestVO);
		// 응답데이터에 빈값 채우기
		if(requestVO.getBankCd() == null || requestVO.getBankCd().equals("null")) data.setBankCd("전체");
		if(requestVO.getAcctNo() == null || requestVO.getAcctNo().equals("null")) data.setAcctNo("전체");
	    
		// 받아온 계좌들을 순회하며 부족한 데이터를 수동으로 넣어주기
	    for (InoutReportVO inoutReportVO : reportData) {
	    	log.info("beforeBal : " + inoutReportVO.getBeforeBal());
	    	// 이전잔액이 없는 경우 더 과거로 가서 잔액을 구해 넣어준다.
	    	if(inoutReportVO.getBeforeBal() == null) {
	    		String lastBalanceDate = reportMapper.getLastBalanceDate(inoutReportVO.getAcctNo(), requestVO.getStartDt());
	    		log.info("lastBalanceDate : "+lastBalanceDate);
	    		
	    		if (lastBalanceDate != null) {
	    			inoutReportVO.setBeforeBal(reportMapper.getLastBalance(inoutReportVO.getAcctNo(), lastBalanceDate));
	    		} else {
	    			inoutReportVO.setBeforeBal(reportMapper.getBalByAcctNo(inoutReportVO.getAcctNo()));
	    		}
	    	}

	    	// 이후잔액이 없는 경우(마지막날 기준 거래내역이 없음) 입금액만큼 더해주고 출금액만큼 뺀 값을 잔액으로 설정
	    	if(inoutReportVO.getAfterBal() == null) {
	    		BigDecimal before =  inoutReportVO.getBeforeBal();
	    		before = before.add(inoutReportVO.getInSum());
	    		before = before.subtract(inoutReportVO.getOutSum());
	    		inoutReportVO.setAfterBal(before);
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
	// 일반사용자인 경우(오늘 포함)
	public InoutReportData getInoutReportDataToday(InoutReportRequestVO requestVO, int userNo) {
		log.info("user: getInoutReportDataToday");
		ivToByteArray(ivString);
		
		// 계좌번호 암호화
		if (requestVO.getAcctNo() != null && !requestVO.getAcctNo().equals("null")) {
			try {
				requestVO.setAcctNo(aesGcmEncrypt.encrypt(requestVO.getAcctNo(), key, iv));
			} catch (GeneralSecurityException e) {
				e.printStackTrace();
			}
		}
		InoutReportData data = new InoutReportData();
		data.setDate(requestVO.getStartDt() + "~" + requestVO.getEndDt());
		requestVO.setUserNo(userNo);
		log.info("bankCd : "+requestVO.getBankCd());
		
		// 데이터 추출
		List<InoutReportVO> reportData = reportMapper.getUserInoutReportDataToday(requestVO);
		// 응답데이터에 빈값 채우기
		if(requestVO.getBankCd() == null || requestVO.getBankCd().equals("null")) data.setBankCd("전체");
		if(requestVO.getAcctNo() == null || requestVO.getAcctNo().equals("null")) data.setAcctNo("전체");
		
		// 받아온 계좌들을 순회하며 부족한 데이터를 수동으로 넣어주기
		for (InoutReportVO inoutReportVO : reportData) {
			log.info("beforeBal : " + inoutReportVO.getBeforeBal());
			// 이전잔액이 없는 경우 더 과거로 가서 잔액을 구해 넣어준다.
			if(inoutReportVO.getBeforeBal() == null) {
				String lastBalanceDate = reportMapper.getLastBalanceDate(inoutReportVO.getAcctNo(), requestVO.getStartDt());
				log.info("lastBalanceDate : "+lastBalanceDate);
				
				if (lastBalanceDate != null) {
					inoutReportVO.setBeforeBal(reportMapper.getLastBalance(inoutReportVO.getAcctNo(), lastBalanceDate));
				} else {
					inoutReportVO.setBeforeBal(reportMapper.getBalByAcctNo(inoutReportVO.getAcctNo()));
				}
			}
			
			// 이후잔액이 없는 경우(마지막날 기준 거래내역이 없음) 입금액만큼 더해주고 출금액만큼 뺀 값을 잔액으로 설정
			if(inoutReportVO.getAfterBal() == null) {
				BigDecimal before =  inoutReportVO.getBeforeBal();
				before = before.add(inoutReportVO.getInSum());
				before = before.subtract(inoutReportVO.getOutSum());
				inoutReportVO.setAfterBal(before);
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
	
	// 매니저 이상인 경우(과거만)
	public InoutReportData getInoutReportData(InoutReportRequestVO requestVO) {
		
		ivToByteArray(ivString);
		
		log.info(requestVO.getAcctNo());
		// 계좌번호 암호화
		if (requestVO.getAcctNo() != null && !requestVO.getAcctNo().equals("null")) {
			try {
				log.info("암호화 시작");
				requestVO.setAcctNo(aesGcmEncrypt.encrypt(requestVO.getAcctNo(), key, iv));
			} catch (GeneralSecurityException e) {
				e.printStackTrace();
			}
		}
		log.info(requestVO.getAcctNo() + " 매니저");
		InoutReportData data = new InoutReportData();
				
		// 데이터 추출
		List<InoutReportVO> reportData = reportMapper.getAdminInoutReportData(requestVO);
		log.info("추출 끝");
		// 복호화 작업
		
		if (requestVO.getAcctNo() != null && !requestVO.getAcctNo().equals("null")) {
			try {
				requestVO.setAcctNo(aesGcmEncrypt.decrypt(requestVO.getAcctNo(), key));
			} catch (GeneralSecurityException e) {
				e.printStackTrace();
			}
		}
		
		data.setDate(requestVO.getStartDt() + "~" + requestVO.getEndDt());
		data.setBankCd(requestVO.getBankCd());
		data.setAcctNo(requestVO.getAcctNo());
		
		// 응답데이터에 빈값 채우기
		if(requestVO.getBankCd() == null || requestVO.getBankCd().equals("null")) data.setBankCd("전체");
		if(requestVO.getAcctNo() == null || requestVO.getAcctNo().equals("null")) data.setAcctNo("전체");
	    
		// 받아온 계좌들을 순회하며 부족한 데이터를 수동으로 넣어주기
	    for (InoutReportVO inoutReportVO : reportData) {
	    	log.info("beforeBal : " + inoutReportVO.getBeforeBal());
	    	// 이전잔액이 없는 경우 더 과거로 가서 잔액을 구해 넣어준다.
	    	if(inoutReportVO.getBeforeBal() == null) {
	    		String lastBalanceDate = reportMapper.getLastBalanceDate(inoutReportVO.getAcctNo(), requestVO.getStartDt());
	    		log.info("lastBalanceDate : "+lastBalanceDate);
	    		
	    		if (lastBalanceDate != null) {
	    			inoutReportVO.setBeforeBal(reportMapper.getLastBalance(inoutReportVO.getAcctNo(), lastBalanceDate));
	    		} else {
	    			inoutReportVO.setBeforeBal(reportMapper.getBalByAcctNo(inoutReportVO.getAcctNo()));
	    		}
	    	}

	    	// 이후잔액이 없는 경우(마지막날 기준 거래내역이 없음) 입금액만큼 더해주고 출금액만큼 뺀 값을 잔액으로 설정
	    	if(inoutReportVO.getAfterBal() == null) {
	    		BigDecimal before =  inoutReportVO.getBeforeBal();
	    		before = before.add(inoutReportVO.getInSum());
	    		before = before.subtract(inoutReportVO.getOutSum());
	    		inoutReportVO.setAfterBal(before);
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
	// 매니저 이상인 경우(오늘 포함)
	public InoutReportData getInoutReportDataToday(InoutReportRequestVO requestVO) {
		log.info("manager: getInoutReportDataToday");
		ivToByteArray(ivString);
		
		log.info(requestVO.getAcctNo());
		// 계좌번호 암호화
		if (requestVO.getAcctNo() != null && !requestVO.getAcctNo().equals("null")) {
			try {
				log.info("암호화 시작");
				requestVO.setAcctNo(aesGcmEncrypt.encrypt(requestVO.getAcctNo(), key, iv));
			} catch (GeneralSecurityException e) {
				e.printStackTrace();
			}
		}
		log.info(requestVO.getAcctNo() + " 매니저");
		InoutReportData data = new InoutReportData();
		
		// 데이터 추출
		List<InoutReportVO> reportData = reportMapper.getAdminInoutReportDataToday(requestVO);
		log.info("추출 끝");
		// 복호화 작업
		
		if (requestVO.getAcctNo() != null && !requestVO.getAcctNo().equals("null")) {
			try {
				requestVO.setAcctNo(aesGcmEncrypt.decrypt(requestVO.getAcctNo(), key));
			} catch (GeneralSecurityException e) {
				e.printStackTrace();
			}
		}
		
		data.setDate(requestVO.getStartDt() + "~" + requestVO.getEndDt());
		data.setBankCd(requestVO.getBankCd());
		data.setAcctNo(requestVO.getAcctNo());
		
		// 응답데이터에 빈값 채우기
		if(requestVO.getBankCd() == null || requestVO.getBankCd().equals("null")) data.setBankCd("전체");
		if(requestVO.getAcctNo() == null || requestVO.getAcctNo().equals("null")) data.setAcctNo("전체");
		
		// 받아온 계좌들을 순회하며 부족한 데이터를 수동으로 넣어주기
		for (InoutReportVO inoutReportVO : reportData) {
			log.info("beforeBal : " + inoutReportVO.getBeforeBal());
			// 이전잔액이 없는 경우 더 과거로 가서 잔액을 구해 넣어준다.
			if(inoutReportVO.getBeforeBal() == null) {
				String lastBalanceDate = reportMapper.getLastBalanceDate(inoutReportVO.getAcctNo(), requestVO.getStartDt());
				log.info("lastBalanceDate : "+lastBalanceDate);
				
				if (lastBalanceDate != null) {
					inoutReportVO.setBeforeBal(reportMapper.getLastBalance(inoutReportVO.getAcctNo(), lastBalanceDate));
				} else {
					inoutReportVO.setBeforeBal(reportMapper.getBalByAcctNo(inoutReportVO.getAcctNo()));
				}
			}
			
			// 이후잔액이 없는 경우(마지막날 기준 거래내역이 없음) 입금액만큼 더해주고 출금액만큼 뺀 값을 잔액으로 설정
			if(inoutReportVO.getAfterBal() == null) {
				BigDecimal before =  inoutReportVO.getBeforeBal();
				before = before.add(inoutReportVO.getInSum());
				before = before.subtract(inoutReportVO.getOutSum());
				inoutReportVO.setAfterBal(before);
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
