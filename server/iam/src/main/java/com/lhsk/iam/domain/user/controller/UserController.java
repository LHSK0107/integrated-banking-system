package com.lhsk.iam.domain.user.controller;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.lhsk.iam.domain.admin.model.vo.MenuClickRequestVO;
import com.lhsk.iam.domain.user.model.vo.DetailUserVO;
import com.lhsk.iam.domain.user.model.vo.UpdateUserVO;
import com.lhsk.iam.domain.user.model.vo.UserVO;
import com.lhsk.iam.domain.user.service.LoginService;
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
	private final LoginService loginService;
	
	// id 존재 여부 확인
	@PostMapping("/api/signup/id")
	public ResponseEntity<?> checkExistsId(@RequestBody UserVO userVO) {
		log.info("UserController.CheckExistsId");
		boolean flag = userService.checkExistsId(userVO.getId());
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
	public ResponseEntity<?> checkPassword(@RequestBody Map<String, Object> data, HttpServletRequest request) {
		log.info("UserController.CheckPassword");
		// Token에서 userCode parsing
		String accessToken = request.getHeader("Authorization")
									.replace(jwtConfig.getTokenPrefix(), "");
		int userNo = jwtTokenProvider.getUserNoFromToken(accessToken);
		String id = jwtTokenProvider.getUsernameFromToken(accessToken);
		// 토큰 소유자와 id가 본인과 일치하는 지 검증 후, password 일치 확인 가능
		if (id.equals(userService.findByUserNo(userNo).getId())) {
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
		// 회원가입 성공 시, 상태코드 200과 함께 success 반환
		if (userService.signup(userVO).equals("success"))
			return ResponseEntity.ok().body("success");
		// 회원가입 실패 시, 상태코드 400과 함께 success 반환
		else return ResponseEntity.badRequest().body("fail");
	}
	
	// 회원정보 수정
	@PutMapping("/api/users")
	public ResponseEntity<?> updateUser(@RequestBody UpdateUserVO updateUserVO, HttpServletRequest request) {
		log.info("UserController.update");
		
		// Token에서 userCode와 id parsing
		String acceessToken = request.getHeader("Authorization")
									 .replace(jwtConfig.getTokenPrefix(), "");
		String userCode = jwtTokenProvider.getUserCodeFromToken(acceessToken);
		String id = jwtTokenProvider.getUsernameFromToken(acceessToken);
		
		// userCode가 user, manager, admin일 때 회원정보 수정 가능
		// 1. user일 때
		if (userCode.equals("ROLE_USER")) {
			// 수정하려는 회원과 발급된 토큰의 소유자와 같은 지 확인
			if (id.equals(userService.findByUserNo(updateUserVO.getUserNo()).getId())) {
				String flag = userService.updateUser(userCode, updateUserVO);
				// 쿼리 성공 여부에 따라 다른 상태코드 반환
				if (flag.equals("success")) { 
					return new ResponseEntity<>(flag, HttpStatus.OK); }
				else { 
					return new ResponseEntity<>(flag, HttpStatus.BAD_REQUEST); }
			// 수정하려는 회원과 발급된 토큰의 소유자와 다르면 접근 제한
			} else { 
				return new ResponseEntity<>("fail", HttpStatus.FORBIDDEN); 
			}
		// 2. manager일 때
		} else if (userCode.equals("ROLE_MANAGER")) {
			// 2-1. 수정하려는 user가 자신일 때
			if(id.equals((userService.findByUserNo(updateUserVO.getUserNo()).getId()))) {
				String flag = userService.updateUser(userCode, updateUserVO);
				// 쿼리 성공 여부에 따라 다른 상태코드 반환
				if (flag.equals("success")) { 
					return new ResponseEntity<>(flag, HttpStatus.OK); }
				else { 
					return new ResponseEntity<>(flag, HttpStatus.BAD_REQUEST); }
			// 2-2. 수정하려는 user가 manager일 때, 접근 제한
			} else if(userService.findByUserNo(updateUserVO.getUserNo()).getUserCode().equals("ROLE_MANAGER")) {
				return new ResponseEntity<>(HttpStatus.FORBIDDEN);
			// 2-3. 수정하려는 user가 admin일 때, 접근 제한
			} else if(userService.findByUserNo(updateUserVO.getUserNo()).getUserCode().equals("ROLE_ADMIN")) {
				return new ResponseEntity<>(HttpStatus.FORBIDDEN);
			} else {
				String flag = userService.updateUser(userCode, updateUserVO);
				// 쿼리 성공 여부에 따라 다른 상태 코드 반환
				if (flag.equals("success")) {
					return new ResponseEntity<>(flag, HttpStatus.OK); }
				else {
					return new ResponseEntity<>(flag, HttpStatus.BAD_REQUEST); }
			}
		// 3. admin일 때
		} else {
			// 자신의 정보를 수정할 때
			if(id.equals((userService.findByUserNo(updateUserVO.getUserNo()).getId()))) {
				if(updateUserVO.getUserCode() != null || updateUserVO.getUserCode().equals("")) {
					return new ResponseEntity<>("fail", HttpStatus.BAD_REQUEST);
				}
			} else {
				String flag = userService.updateUser(userCode, updateUserVO);
				if (flag.equals("success")) {
					return new ResponseEntity<>(flag, HttpStatus.OK);
				}
			}
		}
		return new ResponseEntity<>("fail", HttpStatus.BAD_REQUEST);
	}	
	
	// 회원 삭제
	@DeleteMapping("/api/users/{userNo}")
	public ResponseEntity<?> deleteUser(HttpServletRequest request,
										HttpServletResponse response,
										@PathVariable int userNo,
										@RequestBody MenuClickRequestVO menuVO) {
		log.info("UserController.deleteUser");
		// Token에서 userCode와 id parsing
		String accessToken = request.getHeader("Authorization")
									 .replace(jwtConfig.getTokenPrefix(), "");
		String userCode = jwtTokenProvider.getUserCodeFromToken(accessToken);
		String id = jwtTokenProvider.getUsernameFromToken(accessToken);
		
		// 1. user일 때
		if (userCode.equals("ROLE_USER" )) {
			// 삭제하려는 회원과 토큰을 가진 회원이 동일한지 검증
			if(id.equals((userService.findByUserNo(userNo).getId()))) {
				String flag = userService.deleteUser(userNo);
				// 쿼리 성공 여부에 따라 다른 상태 코드 반환
				if (flag.equals("success")) {
					// 메뉴 클릭 기록 집계 등록 (insert or update)
					userService.updateMenuClick(menuVO);
					// 로그아웃 처리
					loginService.logout(request, response);
					return new ResponseEntity<>(flag, HttpStatus.OK); }
				else {
					return new ResponseEntity<>(flag, HttpStatus.BAD_REQUEST); }
			// 동일하지 않으면 접근 제한
			} else {
				return new ResponseEntity<>(HttpStatus.FORBIDDEN);
			}
		// 2. manager일 때
		} else if (userCode.equals("ROLE_MANAGER")) {
			// 2-1. 삭제하려는 user가 자신일 때
			if(id.equals((userService.findByUserNo(userNo).getId()))) {
				String flag = userService.deleteUser(userNo);
				// 쿼리 성공 여부에 따라 다른 상태 코드 반환
				if (flag.equals("success")) {
					// 메뉴 클릭 기록 집계 등록 (insert or update)
					userService.updateMenuClick(menuVO);
					// 로그아웃 처리
					loginService.logout(request, response);
					return new ResponseEntity<>(flag, HttpStatus.OK); }
				else {
					return new ResponseEntity<>(flag, HttpStatus.BAD_REQUEST); }
			// 2-2. 삭제하려는 user가 manager일 때, 접근 제한
			} else if(userService.findByUserNo(userNo).getUserCode().equals("ROLE_MANAGER")) {
				return new ResponseEntity<>(HttpStatus.FORBIDDEN);
			// 2-3. 삭제하려는 user가 admin일 때, 접근 제한
			} else if(userService.findByUserNo(userNo).getUserCode().equals("ROLE_ADMIN")) {
				return new ResponseEntity<>(HttpStatus.FORBIDDEN);
			} else {
				String flag = userService.deleteUser(userNo);
				// 쿼리 성공 여부에 따라 다른 상태 코드 반환
				if (flag.equals("success")) {
					return new ResponseEntity<>(flag, HttpStatus.OK); }
				else {
					return new ResponseEntity<>(flag, HttpStatus.BAD_REQUEST); }
			}
		// 3. admin일 때
		} else {
			// 삭제하려는 회원과 토큰을 가진 회원이 동일한지 검증
			if(id.equals((userService.findByUserNo(userNo).getId()))) {
				// 삭제 거부
				return new ResponseEntity<>(HttpStatus.FORBIDDEN);
			} else {
				String flag = userService.deleteUser(userNo);
				// 쿼리 성공 여부에 따라 다른 상태 코드 반환
				if (flag.equals("success")) {
					return new ResponseEntity<>(flag, HttpStatus.OK); }
				else {
					return new ResponseEntity<>(flag, HttpStatus.BAD_REQUEST); }
			}
		}
	} 

	// 회원 리스트 (ROLE_ADMIN, ROLE_MANAGER)
	@GetMapping("/api/manager/users")
	public ResponseEntity<?> findAllUser(HttpServletRequest request) {
		log.info("UserController.userList");

		// Token에서 userCode parsing
		String accessToken = request.getHeader("Authorization");
		accessToken = accessToken.split(" ")[1];
		String userCode = jwtTokenProvider.getUserCodeFromToken(accessToken);
	
		// 1. manager나 admin일 때
		if (userCode.equals("ROLE_MANAGER") || userCode.equals("ROLE_ADMIN")) {
			return new ResponseEntity<>(userService.findAllUser(), HttpStatus.OK);
		// 2. 그 외는 접근 제한
		} else {
			return new ResponseEntity<>(HttpStatus.FORBIDDEN);
		}
	}
	  
	// 회원 상세조회
	@GetMapping("/api/users/{userNo}")	// @PathVariable : 경로 상의 값을 가져올 때 사용
	public ResponseEntity<?> findByUserNo(@PathVariable int userNo, HttpServletRequest request) { 
		log.info("UserController.findByUserNo"); 

		// Token에서 userCode parsing
		String accessToken = request.getHeader("Authorization");
		accessToken = accessToken.split(" ")[1];
		String userCode = jwtTokenProvider.getUserCodeFromToken(accessToken);	
		String id = jwtTokenProvider.getUsernameFromToken(accessToken);
		
		DetailUserVO userInfo = userService.findByUserNo(userNo);
		
		// 1. user일 때
		if (userCode.equals("ROLE_USER" )) {
			// 조회하려는 회원과 토큰을 가진 회원이 동일한지 검증
			if(id.equals(userInfo.getId())) {
				return new ResponseEntity<>(userInfo, HttpStatus.OK); }
			// 동일하지 않으면 접근 제한
			else {
				return new ResponseEntity<>(HttpStatus.FORBIDDEN); }
		// 2. manager일 때
		} else if (userCode.equals("ROLE_MANAGER")) {
			// 2-1. 조회하려는 user가 자신일 때
			if(id.equals(userInfo.getId())) {
				return new ResponseEntity<>(userInfo, HttpStatus.OK);
			// 2-2. 조회하려는 user가 manager일 때, 접근 제한
			} else if(userInfo.getUserCode().equals("ROLE_MANAGER")) {
				return new ResponseEntity<>(HttpStatus.FORBIDDEN);
			// 2-3. 삭제하려는 user가 admin일 때, 접근 제한
			} else if(userInfo.getUserCode().equals("ROLE_ADMIN")) {
				return new ResponseEntity<>(HttpStatus.FORBIDDEN);
			} else {
				return new ResponseEntity<>(userInfo, HttpStatus.OK); 
			}
		// 3. admin일 때
		} else {
			return new ResponseEntity<>(userInfo, HttpStatus.OK);
		}
	}
	
	// 로그아웃
	@PostMapping("/api/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response, @RequestBody MenuClickRequestVO vo) {
		/*
		 * {
		 * 	"allAccount" : 1,
		 *  "inout" : 2,
		 *  "inoutReport" : 3,
		 *  "dailyReport" : 4,
		 *  "dashboard" : 5
		 * }
		 */
		// 메뉴 클릭 기록 집계 등록 (insert or update)
		userService.updateMenuClick(vo);
		// 로그아웃 처리
		loginService.logout(request, response);
        
        // 성공적으로 로그아웃 되었다는 응답을 반환합니다.
        return ResponseEntity.ok().body("로그아웃 되었습니다.");
    }
	
		
}