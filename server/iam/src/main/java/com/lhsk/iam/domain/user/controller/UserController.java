package com.lhsk.iam.domain.user.controller;

import java.util.List;
import java.util.Map;

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

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
public class UserController {
	// 생성자 주입
	private final UserService userService;
	
	// id 중복 체크
	@PostMapping("/api/signup/id")
	public String checkDuplicateId(@RequestBody UserVO userVO) {
		log.info("UserController.CheckDuplicateId");
//		log.info(userVO.getId());
		return "{\"status\":\""+userService.checkDuplicateId(userVO.getId())+"\"}";
	}
	
	// email 중복 체크
	@PostMapping("/api/signup/email")
	public String checkDuplicateEmail(@RequestBody UserVO userVO) {
		log.info("UserController.CheckDuplicateEmail");
//		log.info(userVO.getEmail());
		return "{\"status\":\""+userService.checkDuplicateEmail(userVO.getEmail())+"\"}";
	}
	
	// email 인증 /api/signup/email

	// 회원가입
	@PostMapping("/api/users")
	public String signup(@RequestBody UserVO userVO) {
		log.info("UserController.signup");
//		log.info("userVO: "+userVO);
		return "{\"status\":\""+userService.signup(userVO)+"\"}";
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
	@PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        // SecurityContextHolder에서 인증 정보를 제거합니다.
        SecurityContextHolder.clearContext();
        // 성공적으로 로그아웃 되었다는 응답을 반환합니다.
        return ResponseEntity.ok().body("로그아웃 되었습니다.");
    }
	
	// 회원 비밀번호 일치 확인
	@PostMapping("/api/users/checkPass")
	public ResponseEntity<?> checkPassword(@RequestBody Map<String, Object> data) {
		// Map으로 받은 data를 key로 parsing
		log.info("userNo: "+data.get("userNo").toString()+" password: "+data.get("password"));
		// true/false 와 함께 200 상태코드 반환
		boolean flag = userService.checkPassword((int)data.get("userNo"), (String)data.get("password"));
		return new ResponseEntity<>(flag, HttpStatus.OK);
	}
	
		
}