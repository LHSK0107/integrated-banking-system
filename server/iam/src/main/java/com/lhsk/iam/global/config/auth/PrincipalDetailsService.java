package com.lhsk.iam.global.config.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.lhsk.iam.domain.user.model.mapper.LoginMapper;
import com.lhsk.iam.domain.user.model.vo.UserVO;

import lombok.RequiredArgsConstructor;

// http://localhost:8080/login => 여기서 동작을 안 한다.
@Service
@RequiredArgsConstructor
public class PrincipalDetailsService implements UserDetailsService{
	
	private final LoginMapper loginMapper;
	
	// MyBatis 버전 커스텀해야함
	// 여기서 말하는 username은 email이다.
	// 시큐리티가 기본으로 로그인 진행시킬때 id 파라미터 이름이 username이기 때문
	@Override
	public UserDetails loadUserByUsername(String id) throws UsernameNotFoundException {
		
		System.out.println("PrincipalDetailsService : 진입(findUserById 전)");
		UserVO userEntity =  loginMapper.findUserById(id);
		System.out.println("PrincipalDetailsService : 진입(findUserById 후)");
		
		System.out.println("PrincipalDetails 생성 : " + new PrincipalDetails(userEntity));
		if(userEntity == null) {
			throw new UsernameNotFoundException("id " + id + " not found");
		}
		return new PrincipalDetails(userEntity);
	}

}