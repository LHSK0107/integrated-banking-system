package com.lhsk.iam.domain.account.api;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

import org.apache.commons.lang3.StringUtils;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.lhsk.iam.domain.account.model.vo.AccountApiVO;
import com.lhsk.iam.domain.account.model.vo.InoutApiVO;

public class DataProcessor {
	
	// 문자열로 받아온 날짜를 LocalDate로 바꿔준다.
	public LocalDate toLocalDate(String date) {
		 DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
		 return LocalDate.parse(date, formatter);
	}
	
	// 문자열로 받아온 시간을 LocalTime으로 바꿔준다.
	public LocalTime toLocalTime(String time) {
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HHmmss");
		return LocalTime.parse(time, formatter);
	}
	
	// 받아온 데이터가 공백이 아니라면 LocalDate 타입으로 변경
	public AccountApiVO dateTrans(AccountApiVO vo) {
		LocalDate date;
		if((vo.getNewDtApi() != null) && !vo.getNewDtApi().equals("")) {
        	date = toLocalDate(vo.getNewDtApi());
        	vo.setNewDt(date);
        }
		if((vo.getExpiDtApi() != null) && !vo.getExpiDtApi().equals("")) {
			date = toLocalDate(vo.getExpiDtApi());
			vo.setExpiDt(date);
		}
		if((vo.getIntPaytDtApi() != null) && !vo.getIntPaytDtApi().equals("")) {
			date = toLocalDate(vo.getIntPaytDtApi());
			vo.setIntPaytDt(date);
		}
		if(vo.getPyatDtApi() != null && !vo.getPyatDtApi().equals("")) {
			date = toLocalDate(vo.getPyatDtApi());
			vo.setPyatDt(date);
		}
		return vo;
	}
	
	// dateTrans 오버로딩
	public InoutApiVO dateTimeTrans(InoutApiVO vo) {
		LocalDate date;
		LocalTime time;
		if((vo.getTrscDtApi() != null) && !vo.getTrscDtApi().equals("")) {
        	date = toLocalDate(vo.getTrscDtApi());
        	vo.setTrscDt(date);
        }
		if((vo.getTrscTmApi() != null) && !vo.getTrscTmApi().equals("")) {
        	time = toLocalTime(vo.getTrscTmApi());
        	vo.setTrscTm(time);
        }
		return vo;
	}

	
	// vo필드 하나하나 검사해서 null이거나 비어있다면 기본값 넣어주기
	public AccountApiVO valCheck(AccountApiVO vo) {
		vo = dateTrans(vo);
		
		if(StringUtils.isBlank(vo.getAcctNo())) vo.setAcctNo("123123");
		if(StringUtils.isBlank(vo.getBankCd())) vo.setBankCd("001");
		if(vo.getBal() == null) vo.setBal(new BigDecimal(0.00));
		if(StringUtils.isBlank(vo.getIbType())) vo.setIbType("ibtype");
		if(StringUtils.isBlank(vo.getAcctDv())) vo.setAcctDv("01");
		if(StringUtils.isBlank(vo.getLoanNm())) vo.setLoanNm("loan");
		if(StringUtils.isBlank(vo.getAcctNickNm())) vo.setAcctNickNm("nick");
		if(vo.getAgmtAmt() == null) vo.setAgmtAmt(new BigDecimal(0.00));
		if(vo.getPyatAmt() == null) vo.setPyatAmt(new BigDecimal(0.00));
		if(vo.getPyatDt() == null) vo.setPyatDt(LocalDate.parse("1000-01-01"));
		if(vo.getNewDt() == null) vo.setNewDt(LocalDate.parse("1000-01-01"));
		if(vo.getExpiDt() == null) vo.setExpiDt(LocalDate.parse("1000-01-01"));
		if(StringUtils.isBlank(vo.getRepayWay())) vo.setRepayWay("1");
		if(vo.getContRt() == null) vo.setContRt(new BigDecimal(0.00000));
		if(StringUtils.isBlank(vo.getDpsvDv())) vo.setDpsvDv("dpsv");
		if(StringUtils.isBlank(vo.getLoanKind())) vo.setLoanKind("loankind");
		if(StringUtils.isBlank(vo.getCltrCtt())) vo.setCltrCtt("cl");
		if(vo.getIntPaytDt() == null) vo.setIntPaytDt(LocalDate.parse("1000-01-01"));
		if(StringUtils.isBlank(vo.getCurrCd())) vo.setCurrCd("KRW");
		if(vo.getRealAmt() == null) vo.setRealAmt(new BigDecimal(0.00));
		
		return vo;
	}
	
	public InoutApiVO valCheck(InoutApiVO vo) {
		vo = dateTimeTrans(vo);
		
		if(StringUtils.isBlank(vo.getAcctNo())) vo.setAcctNo("123123");
		if(StringUtils.isBlank(vo.getBankCd())) vo.setBankCd("001");
		if(StringUtils.isBlank(vo.getInoutDv())) vo.setInoutDv("");
		if(vo.getTrscDt() == null) vo.setTrscDt(LocalDate.parse("1000-01-01"));
		if(vo.getTrscTm() == null) vo.setTrscTm(LocalTime.parse("00:00:00"));
		if(vo.getBal() == null) vo.setBal(new BigDecimal(0.00));
		if(StringUtils.isBlank(vo.getRmrk1())) vo.setRmrk1("");
		if(vo.getTrscAmt() == null) vo.setTrscAmt(new BigDecimal(0.00));
		if(StringUtils.isBlank(vo.getCurrCd())) vo.setCurrCd("KRW");
		
		return vo;
	}
}
