package com.lhsk.iam.global.email.model.mapper;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface EmailMapper {
	void saveVerificationCode(String email, String code);
	void deleteOldVeri();
	String findEmailByCode(String code);
}
