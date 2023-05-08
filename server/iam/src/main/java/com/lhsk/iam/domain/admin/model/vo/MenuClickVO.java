package com.lhsk.iam.domain.admin.model.vo;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuClickVO {
	private String menuNm;			// 메뉴이름
	private long clickCnt;			// 클릭횟수
	private String date;			// 집계날짜
}
