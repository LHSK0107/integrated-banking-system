package com.lhsk.iam.domain.report.service;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFColor;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import com.lhsk.iam.domain.account.model.mapper.AccountMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReportService {

	private AccountMapper accountMapper;
	
	public Workbook createDaily() {
		/*
		 * 참고용 엑셀 관련 코드
		 * 
		 * 셀 병합을 위한 셀 범위 생성 (시작 행, 끝 행, 시작 열, 끝 열)
		 * CellRangeAddress cellRangeAddress = new CellRangeAddress(0, 3, 1, 16);
		 * 셀 병합 적용
		 * sheet.addMergedRegion(cellRangeAddress);
		 * Row row = sheet.createRow(0);
		 * Cell cell = row.createCell(1);
		 * cell.setCellValue("일일시재보고서");
		 * 
		 */
		
		
		
		/*
		 * 시트 생성
		 */
		XSSFWorkbook  workbook = new XSSFWorkbook();
		Sheet sheet = workbook.createSheet("일일시재보고서");	// 시트이름
		// 픽셀 단위로 너비 설정
        int widthInPixels = 15;
        // 기본 문자 너비
        int defaultCharWidth = 256;
        // 픽셀을 문자 너비로 변환 (대략적인 값)
        int widthInChars = widthInPixels * defaultCharWidth / 7;
        sheet.setColumnWidth(0, widthInChars);
        sheet.setColumnWidth(19, widthInChars);
        // 픽셀 단위로 높이 설정
        int heightInPixels = 29;
        // 픽셀을 포인트로 변환 (대략적인 값)
        float pointsPerPixel = 72f / 96f; // 1픽셀은 대략 0.75포인트입니다.
        float heightInPoints = heightInPixels * pointsPerPixel;
        float row6Height = 14 * pointsPerPixel;
        byte[] grayRgb = new byte[]{(byte) 244, (byte) 244, (byte) 244};
        byte[] blueRgb = new byte[]{(byte) 120, (byte) 132, (byte) 150};
        byte[] skyBlueRgb = new byte[]{(byte) 237, (byte) 242, (byte) 244};
        
        
		// 셀 스타일 생성
//		CellStyle cellStyle = workbook.createCellStyle();
		// 폰트 생성
		Font bold = workbook.createFont();
        bold.setBold(true);	// 볼드처리
        
		// 제목부분
		CellRangeAddress cellRangeAddress = new CellRangeAddress(0, 3, 1, 18);
		
        sheet.addMergedRegion(cellRangeAddress);
        
        Font subjectFont = workbook.createFont();
        subjectFont.setFontHeightInPoints((short) 18);
        subjectFont.setBold(true);
        
        CellStyle subjectStyle = workbook.createCellStyle();
        subjectStyle.setAlignment(HorizontalAlignment.CENTER);
        subjectStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        subjectStyle.setFont(subjectFont);
        
        Row row = sheet.createRow(0);
        Cell cell = row.createCell(1);
        cell.setCellValue("일일시재보고서");
        cell.setCellStyle(subjectStyle);
        
        
        // 기준일부분
        
        XSSFColor grayColor = new XSSFColor(grayRgb, null);
        XSSFCellStyle grayColorCell = workbook.createCellStyle();
        grayColorCell.setFillForegroundColor(grayColor);
        grayColorCell.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        
        XSSFColor blueColor = new XSSFColor(blueRgb, null);
        XSSFCellStyle blueColorCell = workbook.createCellStyle();
        blueColorCell.setFillForegroundColor(blueColor);
        blueColorCell.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        
        
        row = sheet.createRow(4);
        row.setHeightInPoints(heightInPoints);
        cellRangeAddress = new CellRangeAddress(4,4,2,18);
        cell = row.createCell(0);
        cell.setCellStyle(grayColorCell);
        cell = row.createCell(1);
        grayColorCell.setFont(bold);
        cell.setCellStyle(grayColorCell);
        cell.setCellValue("기준일 : ");

        XSSFCellStyle dateCellStyle = workbook.createCellStyle();
        dateCellStyle.setFillForegroundColor(grayColor);
        dateCellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        cell = row.createCell(2);
        cell.setCellStyle(dateCellStyle);
        cell.setCellValue("2023-04-24");
        sheet.addMergedRegion(cellRangeAddress);
        cell = row.createCell(19);
        cell.setCellStyle(dateCellStyle);
        
        row = sheet.createRow(5);
        row.setHeightInPoints(row6Height);
        
        cellRangeAddress = new CellRangeAddress(5,5,1,4);
        sheet.addMergedRegion(cellRangeAddress);
        cellRangeAddress = new CellRangeAddress(5,5,6,9);
        sheet.addMergedRegion(cellRangeAddress);
        cellRangeAddress = new CellRangeAddress(5,5,10,14);
        sheet.addMergedRegion(cellRangeAddress);
        cellRangeAddress = new CellRangeAddress(5,5,15,18);

        row = sheet.createRow(6);
        sheet.addMergedRegion(cellRangeAddress);
    	// 7번행 blue컬러로 색칠
    	cell = row.createCell(0);
    	cell.setCellStyle(blueColorCell);
    	cell = row.createCell(1);
    	cell.setCellStyle(blueColorCell);
    	cell = row.createCell(5);
    	cell.setCellStyle(blueColorCell);
    	cell = row.createCell(6);
    	cell.setCellStyle(blueColorCell);
    	cell = row.createCell(10);
    	cell.setCellStyle(blueColorCell);
    	cell = row.createCell(15);
    	cell.setCellStyle(blueColorCell);
    	cell = row.createCell(19);
    	cell.setCellStyle(blueColorCell);
        
        
        
        
        
		
		return workbook;
	}
}
