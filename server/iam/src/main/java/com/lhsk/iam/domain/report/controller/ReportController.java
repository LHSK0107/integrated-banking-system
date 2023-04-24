package com.lhsk.iam.domain.report.controller;

import java.io.IOException;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.lhsk.iam.domain.report.service.ReportService;

@RestController
public class ReportController {
	
	@Autowired
	private ReportService reportService;
	
	@GetMapping("/api/reports/daily")
    public ResponseEntity<Void> dailyReport(HttpServletResponse response, HttpServletRequest request) throws IOException {
        /*
         * 시트 생성
         */
		
		Workbook workbook = reportService.createDaily();
		
		// 헤더 설정
	    String fileName = "일일시재보고서.xlsx";
	    // 공백 문자가 '+'로 바뀌는 것을 방지하기 위해 '+' 문자를 '%20'으로 교체
	    String encodedFileName = URLEncoder.encode(fileName, StandardCharsets.UTF_8).replaceAll("\\+", "%20");

	    response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
	    response.setHeader("Content-Disposition", "attachment; filename=\"" + encodedFileName + "\"");

        // 다운로드 로직
        try (OutputStream outputStream = response.getOutputStream()) {
            workbook.write(outputStream);
        }

        // Close the workbook
        workbook.close();

        return new ResponseEntity<>(HttpStatus.OK);
    }
}
