package com.lhsk.iam.domain.user.model.vo;

import java.time.LocalDateTime;

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
public class LoginHistoryVO {
	private int userNo;
	private String name;
	private String email;
	private LocalDateTime loginDt;
}
