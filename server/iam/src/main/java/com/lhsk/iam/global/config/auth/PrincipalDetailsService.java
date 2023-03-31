package com.lhsk.iam.global.config.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.lhsk.iam.domain.user.model.mapper.UserDAO;
import com.lhsk.iam.domain.user.model.vo.UserVO;

import lombok.RequiredArgsConstructor;

// http://localhost:8080/login => 여기서 동작을 안 한다.
@Service
@RequiredArgsConstructor
public class PrincipalDetailsService implements UserDetailsService{
	
	// 긁어온 MyBatis버전
//	@Autowired
//	private UserDao userDao;
//	
//	@Override
//	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//		CustomUserDetails users = userDao.getUserById(username);
//		if(users == null) {
//			 throw new UsernameNotFoundException("username " + username + " not found");
//		}
//		System.out.println("**************Found user***************");
//		System.out.println("id : " + users.getUsername());
//		return users;
//	}
	
	@Autowired
	private UserDAO userDAO;
	
	// MyBatis 버전 커스텀해야함
	// 여기서 말하는 username은 ID이다.
	// 시큐리티가 기본으로 로그인 진행시킬때 id 파라미터 이름이 username이기 때문
	@Override
	public UserDetails loadUserByUsername(String id) throws UsernameNotFoundException {
		UserVO userEntity =  userDAO.findUserById(id);
		if(userEntity == null) {
			throw new UsernameNotFoundException("id " + id + " not found");
		}
		return new PrincipalDetails(userEntity);
	}
	
	// JPA버전
//	private final UserRepository userRepository;	// jpa 문법이기 때문에 MyBatis에서 해결할 방법을 찾아야함
//
//	
//	@Override
//	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//		System.out.println("PrincipalDetailsService의 loadUserByUsername");
//		UserVO userEntity = userRepository.findByUsername(username);
//		return new PrincipalDetails(userEntity);	// 호출되면 PrincipalDetails를 세션에 담음
//	}
}
   