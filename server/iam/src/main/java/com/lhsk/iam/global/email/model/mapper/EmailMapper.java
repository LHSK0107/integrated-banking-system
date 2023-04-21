package com.lhsk.iam.global.email.model.mapper;

public interface EmailMapper {
	void saveVerificationCode(String email, String code);
}
