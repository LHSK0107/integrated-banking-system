package com.lhsk.iam.domain.report.service;

import java.io.OutputStream;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lhsk.iam.domain.account.model.mapper.AccountMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReportService {

	private AccountMapper accountMapper;
	
	public Workbook createDaily() {
		/*
		 * 시트 생성
		 */
		
		Workbook workbook = new XSSFWorkbook();
		Sheet sheet = workbook.createSheet("일일시재보고서");	// 시트이름
		
		// 셀 병합을 위한 셀 범위 생성 (시작 행, 끝 행, 시작 열, 끝 열)
		CellRangeAddress cellRangeAddress = new CellRangeAddress(0, 3, 1, 16);
		
		// 셀 병합 적용
        sheet.addMergedRegion(cellRangeAddress);
		
        // 병합된 셀에 값을 설정
        Row row = sheet.createRow(0);
        Cell cell = row.createCell(1);
        
        cell.setCellValue("일일시재보고서");
		
		return workbook;
	}
}
