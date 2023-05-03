package com.lhsk.iam.domain.account.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.lhsk.iam.domain.account.model.vo.AccountVO;
import com.lhsk.iam.domain.account.model.vo.InoutRequestVO;
import com.lhsk.iam.domain.account.model.vo.InoutVO;
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
//@RequestMapping("api/accounts")
public class AccountController {
	
	private final AccountService accountService;
	private final AccountApiService accountApiService;
	private final InoutProcessingService inoutProcessingService;
	private final JwtTokenProvider jwtTokenProvider;
	private final JwtConfig jwtConfig;
	
	// 전체 계좌정보 조회 메서드(ROLE_MANAGER, ROLE_ADMIN)
	@GetMapping("/api/accounts")
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
	@GetMapping("/api/accounts/available/{userNo}")
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
		}
		else return new ResponseEntity<>(HttpStatus.FORBIDDEN);
	}
		
	// 한 계좌의 입출금 내역
	@GetMapping("api/accounts/inout/{acctNo}")
	public ResponseEntity<List<InoutVO>> getInout(@RequestBody InoutRequestVO vo, HttpServletRequest request) {
		/*
		 * {
		 * 	"acctNo" : "",		계좌번호
		 *  "startDt" : "",		시작날짜
		 *  "endDt" : "", 		끝날짜
		 *  "inoutDv" : "",		입출구분 1.입금 2.출금 3.전부
		 *  "sort" : "",		정렬기준 asc desc
		 *  "page" : int		프론트에서 볼 페이지 번호
		 *  "pageSize" : int	프론트에서 한번에 볼 건수
		 *  "isLoan" : boolean	대출계좌 여부 true/false
		 * }
		 */
		log.info("AccountController.getInout");
		// Token에서 userNo을 parsing
		String accessToken = request.getHeader("Authorization")
									.replace(jwtConfig.getTokenPrefix(), "");
		int userNo = jwtTokenProvider.getUserNoFromToken(accessToken);
		
		// 오늘이 포함되었는지 boolean값 반환
		boolean istoday = inoutProcessingService.isTodayBetweenDates(vo.getStartDt(), vo.getEndDt());
		
		
		if(istoday) {
			// 오늘이 포함되었을 경우 -> OpenApi를 통해 갱신을 해준다.
			accountApiService.updateInoutToday(vo);
		}
		
		// 대출일때와 예금일때를 구분해서 return을 해줘야함 -> 추후 작업 필요
		return new ResponseEntity<>(accountService.findOneInout(vo, userNo), HttpStatus.OK);
	}

	
	
}
