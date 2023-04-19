package com.lhsk.iam.domain.account.service;

import java.time.LocalDate;

import org.springframework.stereotype.Service;

@Service
public class InoutProcessingService {
	
	public boolean isTodayBetweenDates(LocalDate startDate, LocalDate endDate) {
		boolean flag = false;
		LocalDate today = LocalDate.now();
		flag = !today.isBefore(startDate) && !today.isAfter(endDate);
		return flag;
	}
}
