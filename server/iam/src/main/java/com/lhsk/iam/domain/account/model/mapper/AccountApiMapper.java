package com.lhsk.iam.domain.account.model.mapper;

import java.time.LocalDate;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.lhsk.iam.domain.account.model.vo.AccountApiVO;
import com.lhsk.iam.domain.account.model.vo.InoutApiVO;

@Mapper
public interface AccountApiMapper {

	// 테이블 데이터 삭제
	public void deleteAccounts();
	// 계좌목록 추가
	public void insertAccounts(List<AccountApiVO> list);
	// 과거의 입출금내역 테이블 데이터 삭제
	public void deleteInoutPast();
	// 어제까지의 입출금내역 추가
	public void insertInoutPast(List<InoutApiVO> list);
	// 금일 발생한 입출금내역 추가
//	public void insertInoutToday(InoutApiVO inout);
	// 현재상황의 total을 반환
	public int getTotal(LocalDate date);
}
