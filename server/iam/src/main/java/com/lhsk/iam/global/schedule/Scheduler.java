package com.lhsk.iam.global.schedule;

import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.lhsk.iam.domain.account.model.mapper.AccountMapper;
import com.lhsk.iam.domain.account.model.vo.InoutVO;
import com.lhsk.iam.domain.user.model.mapper.UserMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class Scheduler {
	private final UserMapper userMapper;
	private final AccountMapper accountMapper;
	
	// 매일 0시 0분 0초에 정해진 로직을 실행
	@Scheduled(cron = "0 0 0 * * ?")
	public void insertMenuClick() {
		// 새로운 날짜의 메뉴 클릭 기록 대상을 DB에 insert
		addMenuClickDB();
		// 거래내역 데이터 복사 및 리셋
		copyInoutData();
		log.info("scheduler activated");
	}
	
	public void addMenuClickDB() {
		userMapper.insertMenuClick("all_account");
		userMapper.insertMenuClick("inout");
		userMapper.insertMenuClick("inout_report");
		userMapper.insertMenuClick("daily_report");
		userMapper.insertMenuClick("dashboard");
		
	}
	
	/* 
	 * inout_today의 데이터를 복사해서 inout_past로 이동후 inout_today 비워주기
	 * 복사와 리셋시, 거래날짜가 어제인 경우에만 실행(0시 0분 0초가 되었다는 것은 날짜가 바뀌었다는 뜻)
	 * 이는 0시 0분 0초에 거래가 발생했을 경우 거래내역이 잘못 복사되거나 의도치않게 삭제되는 것을 방지하기 위함
	 */
	public void copyInoutData() {
		List<InoutVO> inoutList = accountMapper.copyInoutData();
		if(inoutList != null && inoutList.size() != 0) {
			accountMapper.insertInoutPast(inoutList);
		}
		accountMapper.resetInoutToday();
	}
	
}
