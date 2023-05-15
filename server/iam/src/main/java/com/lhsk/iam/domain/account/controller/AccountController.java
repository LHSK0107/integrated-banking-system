package com.lhsk.iam.domain.account.controller;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.lhsk.iam.domain.account.model.vo.AccountVO;
import com.lhsk.iam.domain.account.model.vo.InoutRequestVO;
import com.lhsk.iam.domain.account.service.AccountApiService;
import com.lhsk.iam.domain.account.service.AccountService;
import com.lhsk.iam.domain.account.service.InoutProcessingService;
import com.lhsk.iam.global.config.JwtConfig;
import com.lhsk.iam.global.config.jwt.JwtTokenProvider;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
public class AccountController {
	
	private final AccountService accountService;
	private final AccountApiService accountApiService;
	private final InoutProcessingService inoutProcessingService;
	private final JwtTokenProvider jwtTokenProvider;
	private final JwtConfig jwtConfig;
	
	// 전체 계좌정보 조회 메서드(ROLE_MANAGER, ROLE_ADMIN)
	@GetMapping("/api/manager/accounts")
	public ResponseEntity<List<AccountVO>> findAllAccount(HttpServletRequest request) {
		log.info("AccountController.AccountList");
		String accessToken = request.getHeader("Authorization")
											   .replace(jwtConfig.getTokenPrefix(), "");
		// JWT에서 userCode를 추출 
		String userCode = jwtTokenProvider.getUserCodeFromToken(accessToken);
		
		// USER는 403, MANAGER & ADMIN은 200, 그 외는 400 HttpStatus 반환
		if (userCode.equals("ROLE_USER")) 
			return new ResponseEntity<>(HttpStatus.FORBIDDEN);
		else if (userCode.equals("ROLE_MANAGER") || userCode.equals("ROLE_ADMIN"))
			return new ResponseEntity<>(accountService.findAllAccount(), HttpStatus.OK);
		else return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
	}
	
	// 조회 가능 계좌정보 리스트(ROLE_USER)
	@GetMapping("/api/users/accounts/available/{userNo}")
	public ResponseEntity<List<AccountVO>> findAllAvailableAccount(
												HttpServletRequest request,
												@PathVariable int userNo) {

		log.info("AccountController.AvailableAccountList");
		String accessToken = request.getHeader("Authorization")
											   .replace(jwtConfig.getTokenPrefix(), "");
		String userCode = jwtTokenProvider.getUserCodeFromToken(accessToken);
		int TokenUserNo = jwtTokenProvider.getUserNoFromToken(accessToken);
		
		// USER이면서 토큰 소유자와 조회 회원이 같으면 200, 아니면 403
		if (userCode.equals("ROLE_USER") && TokenUserNo == userNo) {
			List<AccountVO> accountList = accountService.findAllAvailableAccount(userNo);
			return new ResponseEntity<>(accountList, HttpStatus.OK); 			
		} else if(userCode.equals("ROLE_MANAGER") || userCode.equals("ROLE_ADMIN")) {
			List<AccountVO> accountList = accountService.findAllAvailableAccount(userNo);
			return new ResponseEntity<>(accountList, HttpStatus.OK); 						
		}
		else return new ResponseEntity<>(HttpStatus.FORBIDDEN);
	}
		
	// 회원 계좌의 입출금 내역(ROLE_USER)
	@PostMapping("api/users/accounts/inout")
	public ResponseEntity<Map<String, Object>> getUsersInout(@RequestBody InoutRequestVO vo, HttpServletRequest request) {
		/*
		 * {
		 *  "isLoan" : boolean,	대출계좌 여부 (true / false)
		 *  "bankCd" : "",		은행 코드					(전체 "All") 
		 * 	"acctNo" : "",		계좌번호					(전체 "All")
		 *  "startDt" : "",		조회 시작 날짜				(형식 : "1000-01-01")
		 *  "endDt" : "", 		조회 끝 날짜				(형식 : "1000-01-01")
		 *  "inoutDv" : "",		입출 구분 				(입금 "1", 출금 "2", 전체 "All")
		 *  "sort" : "",		정렬 기준					(최근순 "recent", 과거순 "past")
		 *  "page" : int,		프론트에서 볼 페이지 번호
		 *  "pageSize" : int	프론트에서 페이지당 보여질 건수 (10/30/50)
		 * }
		 */
		log.info("AccountController.getUsersInout");
		// Token에서 userNo을 parsing하여 vo에 set
		String accessToken = request.getHeader("Authorization")
									.replace(jwtConfig.getTokenPrefix(), "");
		int userNo = jwtTokenProvider.getUserNoFromToken(accessToken);
		vo.setUserNo(userNo);
		
		// 오늘이 포함되었는지 boolean값 반환
		boolean istoday = inoutProcessingService.isTodayBetweenDates(vo.getStartDt(), vo.getEndDt());
		
		if(istoday) {
			// 오늘이 포함되었을 경우 -> OpenApi를 통해 갱신을 해준다.
			accountApiService.updateInoutToday(vo);
		}
		
		// 총 페이지 및 입출금 내역 조회 결과 Map 리턴(key : totalPage, list)
		return new ResponseEntity<>(accountService.findUsersInout(vo, istoday), HttpStatus.OK);
	}

	// 관리자의 입출금 내역 조회(ROLE_MANAGER, ROLE_ADMIN)
	@PostMapping("api/manager/accounts/inout")
	public ResponseEntity<Map<String, Object>> getAdminsInout(@RequestBody InoutRequestVO vo) {
		log.info("AccountController.getAdminsInout");
		
		// 오늘이 포함되었는지 boolean값 반환
		boolean istoday = inoutProcessingService.isTodayBetweenDates(vo.getStartDt(), vo.getEndDt());
		
		if(istoday) {
			// 오늘이 포함되었을 경우 -> OpenApi를 통해 갱신을 해준다.
			accountApiService.updateInoutToday(vo);
		}
		
		// 총 페이지 및 입출금 내역 조회 결과 Map 리턴(key : totalPage, list)
		return new ResponseEntity<>(accountService.findAdminsInout(vo, istoday), HttpStatus.OK);
	}

	
	
}
