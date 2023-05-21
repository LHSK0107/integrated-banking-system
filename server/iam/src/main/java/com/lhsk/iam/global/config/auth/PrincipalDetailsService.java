package com.lhsk.iam.global.config.auth;

import java.security.GeneralSecurityException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.lhsk.iam.domain.user.model.mapper.LoginMapper;
import com.lhsk.iam.domain.user.model.vo.UserVO;
import com.lhsk.iam.global.encrypt.AesGcmEncrypt;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

// http://localhost:8080/login => 여기서 동작을 안 한다.
@Service
@RequiredArgsConstructor
@Slf4j
public class PrincipalDetailsService implements UserDetailsService{
	
	private final LoginMapper loginMapper;
	
	@Value("${aes.secret}")
	private String key;
	
	
	// MyBatis 버전 커스텀해야함
	// 여기서 말하는 username은 email이다.
	// 시큐리티가 기본으로 로그인 진행시킬때 id 파라미터 이름이 username이기 때문
	@Override
	public UserDetails loadUserByUsername(String id) throws UsernameNotFoundException {
		
		UserVO userEntity =  loginMapper.findUserById(id);
		
		// 이 부분을 추가하면 ROLE_BLACK을 가진 사용자를 찾을 수 있습니다.
	    if (userEntity.getUserCodeList().get(0).equals("ROLE_BLACK")) {
	    	log.info("차단된 계정 : "+id);
	        throw new DisabledException("This user is blacklisted");
	    }
		
		AesGcmEncrypt aesGcmEncrypt = new AesGcmEncrypt();
		try {
			String name = aesGcmEncrypt.decrypt(userEntity.getName(), key);
			String email = aesGcmEncrypt.decrypt(userEntity.getEmail(), key);
			userEntity.setName(name);
			userEntity.setEmail(email);
		} catch (GeneralSecurityException e) {
			e.printStackTrace();
		}
		
		PrincipalDetails principal = new PrincipalDetails(userEntity);
		
//		return new PrincipalDetails(userEntity);
		return principal;
	}

}