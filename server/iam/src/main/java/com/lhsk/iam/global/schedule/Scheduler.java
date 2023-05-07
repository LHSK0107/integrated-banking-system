package com.lhsk.iam.global.schedule;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.lhsk.iam.domain.user.model.mapper.UserMapper;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class Scheduler {
	private final UserMapper userMapper;
	
	// 매일 0시 0분 0초에 새로운 집계대상을 추가
	@Scheduled(cron = "0 0 0 * * ?")
	public void insertMenuClick() {
		userMapper.insertMenuClick("all_account");
		userMapper.insertMenuClick("inout");
		userMapper.insertMenuClick("inout_report");
		userMapper.insertMenuClick("daily_report");
		userMapper.insertMenuClick("dashboard");
	}
}
