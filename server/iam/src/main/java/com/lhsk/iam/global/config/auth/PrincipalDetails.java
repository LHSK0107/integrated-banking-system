package com.lhsk.iam.global.config.auth;

import java.util.ArrayList;
import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.lhsk.iam.domain.user.model.vo.UserVO;

import lombok.Getter;

@Getter
public class PrincipalDetails implements UserDetails {

	private UserVO userVO;
	
	public PrincipalDetails(UserVO userVO) {
		this.userVO = userVO;
	}
	
	// 권한을 Collection형태로 바꿔서 반환해줌
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		Collection<GrantedAuthority> authorities = new ArrayList<>();
		userVO.getUserCode().forEach(r->{
			authorities.add(()->r);
		});
		return authorities;
	}

	// 비밀번호 반환
	@Override
	public String getPassword() {
		return userVO.getPassword();
	}

	// ID반환
	@Override
	public String getUsername() {
		return userVO.getId();
	}

	// 계정이 만료되었는가?
	@Override
	public boolean isAccountNonExpired() {
		// true : 만료되지 않음
		return true;	
	}

	// 계정이 잠겼는가?
	@Override
	public boolean isAccountNonLocked() {
		return true;
	}
	
	// 비밀번호가 너무 오래된것은 아닌가?
	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	// 계정이 활성화 되어있는가?
	@Override
	public boolean isEnabled() {
		// ex) 1년동안 접속을 하지 않았다면 휴면계정으로 바꾸기
		// 현재시간 - 로그인시간 > 1년 ? false : true
		return true;
	}

}
