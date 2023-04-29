package com.lhsk.iam.domain.user.controller;

import java.util.List;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.lhsk.iam.domain.user.model.vo.DetailUserVO;
import com.lhsk.iam.domain.user.model.vo.UpdateUserVO;
import com.lhsk.iam.domain.user.model.vo.UserVO;
import com.lhsk.iam.domain.user.service.UserService;
import com.lhsk.iam.global.config.JwtConfig;
import com.lhsk.iam.global.config.jwt.JwtTokenProvider;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
public class UserController {
	// 생성자 주입
	private final UserService userService;
	private final JwtTokenProvider jwtTokenProvider;
	private final JwtConfig jwtConfig;
	
	// id 중복 체크
	@PostMapping("/api/signup/id")
	public ResponseEntity<?> checkDuplicateId(@RequestBody UserVO userVO) {
		log.info("UserController.CheckDuplicateId");
		boolean flag = userService.checkDuplicateId(userVO.getId());
		// 상태코드 200과 함께 중복되면 true, 중복되지 않으면 false 반환
		return new ResponseEntity<>(flag, HttpStatus.OK);
	}
	
	// email 중복 체크
	@PostMapping("/api/signup/email")
	public ResponseEntity<?> checkDuplicateEmail(@RequestBody UserVO userVO) {
		log.info("UserController.CheckDuplicateEmail");
		boolean flag = userService.checkDuplicateEmail(userVO.getEmail());
		// 상태코드 200과 함께 중복되면 true, 중복되지 않으면 false 반환
		return new ResponseEntity<>(flag, HttpStatus.OK);
	}
	
	// password 일치 확인
	@PostMapping("/api/users/checkPass")
	public ResponseEntity<?> checkPassword(
											@RequestBody Map<String, Object> data, 
											HttpServletRequest httpServletRequest	
	) {
		log.info("UserController.CheckPassword");
		// 토큰으로 userCode parsing
		String accessToken = httpServletRequest
								.getHeader("Authorization")
								.replace(jwtConfig.getTokenPrefix(), "");
		String userCode = jwtTokenProvider.getUserCodeFromToken(accessToken);
		// userCode가 user, manager, admin일 때 password 일치 확인 가능
		if (
			userCode.equals("ROLE_USER" ) || 
			userCode.equals("ROLE_MANAGER") || 
			userCode.equals("ROLE_ADMIN")
		) {
			// Map으로 받은 data를 key로 parsing
			boolean flag = userService.checkPassword((int)data.get("userNo"), (String)data.get("password"));
			// true/false 와 함께 200 상태코드 반환
			return new ResponseEntity<>(flag, HttpStatus.OK);
		// 그 외에는 403 forbidden 접근 제한
		} else return new ResponseEntity<>(HttpStatus.FORBIDDEN);
	}
	
	// 회원가입
	@PostMapping("/api/signup")
	public ResponseEntity<?> signup(@RequestBody UserVO userVO) {
		log.info("UserController.signup");
		if (userService.signup(userVO).equals("success"))
			return ResponseEntity.ok().body("success");
		else return ResponseEntity.badRequest().body("fail");
	}
	
	// 회원정보 수정
	@PutMapping("/api/users")
	public String updateUser(@RequestBody UpdateUserVO updateUserVO) {
		log.info("UserController.update"); 
//		log.info(updateUserVO.toString());
		return "{\"status\":\""+userService.updateUser(updateUserVO)+"\"}";
	}
	
	// 회원 삭제
	@DeleteMapping("/api/users/{userNo}")
	public String deleteUser(@PathVariable int userNo) {
		log.info("UserController.deleteUser"); 
		return "{\"status\":\""+userService.deleteUser(userNo)+"\"}";
	}

	// 회원 리스트 (ROLE_ADMIN, ROLE_MANAGER)
	@GetMapping("/api/users")
	public List<DetailUserVO> findAllUser() {
		log.info("UserController.userList");
		return userService.findAllUser();
	}
	  
	// 회원 상세조회 (ROLE_USER)
	@GetMapping("/api/users/{userNo}")
	public DetailUserVO findByUserNo(@PathVariable int userNo) {	// @PathVariable : 경로 상의 값을 가져올 때 사용 
		log.info("UserController.findByUserNo"); 
		return userService.findByUserNo(userNo);
	}
	
	// 로그아웃
	@PostMapping("/api/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
		Cookie[] cookies = request.getCookies();
	    if (cookies != null) {
	        for (Cookie cookie : cookies) {
	            if ("refreshToken".equals(cookie.getName())) {
	                // 쿠키의 값을 비우고 유효 시간을 과거로 설정하여 삭제합니다.
	                cookie.setValue(null);
	                cookie.setMaxAge(0);
	                cookie.setHttpOnly(true);
	                cookie.setSecure(true); // HTTPS를 사용하는 경우에만 필요합니다.
	                cookie.setPath("/");
	                response.addCookie(cookie);
	                break;
	            }
	        }
	    }
        // SecurityContextHolder에서 인증 정보를 제거합니다.
        SecurityContextHolder.clearContext();
        // 성공적으로 로그아웃 되었다는 응답을 반환합니다.
        return ResponseEntity.ok().body("로그아웃 되었습니다.");
    }
	
	
		
}