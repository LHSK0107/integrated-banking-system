package com.lhsk.iam.domain.account.model.mapper;

import java.time.LocalDate;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.lhsk.iam.domain.account.model.vo.AccountApiVO;
import com.lhsk.iam.domain.account.model.vo.InoutApiVO;
import com.lhsk.iam.domain.account.model.vo.InoutVO;
import com.lhsk.iam.domain.account.model.vo.UserAccountVO;	

@Mapper
public interface AccountApiMapper {

	// 테이블 데이터 삭제
	public void deleteAccounts();
	// 과거의 입출금내역 테이블 데이터 삭제
	public void deleteInoutPast();	
	// 오늘의 입출금내역 테이블 데이터 삭제
	public void deleteInoutToday();
	// 계좌목록 추가
	public void insertAccounts(List<AccountApiVO> list);
	// 어제까지의 입출금내역 추가
	public void insertInoutPast(List<InoutApiVO> list);
	// 금일 입출금내역 추가
	public void insertInoutToday(List<InoutApiVO> list);
	// 금일 발생한 입출금내역을 과거 입츨금내역 테이블에 추가
	public void insertTodayPast(List<InoutVO> list);
	// 현재상황의 total을 반환
	public int getTotal(LocalDate date);
	// today 테이블 total을 반환
	public int getTotalToday(LocalDate date);
	// user_account 테이블 데이터 전체 조회
	public List<UserAccountVO> findAllUserAccount();
	// user_account에 백업 데이터 입력
	public void insertBackupUserAccount(List<UserAccountVO> info);
}
