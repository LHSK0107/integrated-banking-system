package com.lhsk.iam.domain.account.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lhsk.iam.domain.account.model.vo.AccountVO;
import com.lhsk.iam.domain.account.model.vo.InoutRequestVO;
import com.lhsk.iam.domain.account.model.vo.InoutVO;
import com.lhsk.iam.domain.account.service.AccountApiService;
import com.lhsk.iam.domain.account.service.AccountService;
import com.lhsk.iam.domain.account.service.InoutProcessingService;
import com.lhsk.iam.global.config.jwt.JwtPermissionVerifier;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("api/accounts")
public class AccountController {
	
	private final AccountService accountService;
	private final AccountApiService accountApiService;
	private final InoutProcessingService inoutProcessingService;
	private final JwtPermissionVerifier jwtPermissionVerifier;	
	
	// 전체 계좌정보 조회 메서드(ROLE_MANAGER, ROLE_ADMIN)
	@GetMapping
	public ResponseEntity<List<AccountVO>> findAllAccount(HttpServletRequest httpServletRequest) {
		log.info("AccountController.AccountList");
		// JWT에서 userCode 
		String userCode = jwtPermissionVerifier.getUserCodeFromJWT(httpServletRequest);
		// USER는 403, MANAGER & ADMIN은 200, 그 외는 400 HttpStatus 반환
		if (userCode.equals("ROLE_USER")) 
			return new ResponseEntity<>(HttpStatus.FORBIDDEN);
		else if (userCode.equals("ROLE_MANAGER") || userCode.equals("ROLE_ADMIN"))
			return new ResponseEntity<>(accountService.findAllAccount(), HttpStatus.OK);
		else return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
	}
	
	// 조회 가능 계좌정보 리스트(ROLE_USER)
	@GetMapping()
	public ResponseEntity<List<AccountVO>> findAllAvailableAccount(HttpServletRequest httpServletRequest) {
		return new ResponseEntity<>(HttpStatus.OK);
	}
	
	// 특정 계좌정보 조회 메서드
	@GetMapping("/{acctNo}")
	public ResponseEntity<AccountVO> findByAcctNo(@PathVariable String acctNo) {
		log.info("AccountController.findByAcctNo");
		return new ResponseEntity<>(accountService.findByAcctNo(acctNo), HttpStatus.OK);
	}
	
	/*
	 * 하나의 계좌를 조회할 때
	 */	
	@GetMapping("/inout/{acctNo}")
	public ResponseEntity<List<InoutVO>> getInout(@RequestBody InoutRequestVO vo) {
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
		
		// 오늘이 포함되었는지 boolean값 반환
		boolean istoday = inoutProcessingService.isTodayBetweenDates(vo.getStartDt(), vo.getEndDt());
		
		
		if(istoday) {
			// 오늘이 포함되었을 경우 -> OpenApi를 통해 갱신을 해준다.
			accountApiService.updateInoutToday(vo);
		}
		
		// 대출일때와 예금일때를 구분해서 return을 해줘야함 -> 추후 작업 필요
		return new ResponseEntity<>(accountService.findOneInout(vo), HttpStatus.OK);
	}

	
	
}
